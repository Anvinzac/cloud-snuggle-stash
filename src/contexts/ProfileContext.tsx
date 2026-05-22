import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile, CorporateAccount } from "@/components/businesscard/types";

interface ProfileContextValue {
  profile: UserProfile | null;
  corporateAccount: CorporateAccount | null;
  isCorporateAdmin: boolean;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  corporateAccount: null,
  isCorporateAdmin: false,
  loading: true,
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [corporateAccount, setCorporateAccount] = useState<CorporateAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setCorporateAccount(null);
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profileData) {
        setLoading(false);
        return;
      }

      setProfile(profileData as UserProfile);

      if (profileData.work_for) {
        const { data: corpData } = await supabase
          .from("corporate_accounts")
          .select("*")
          .eq("id", profileData.work_for)
          .single();

        if (corpData) {
          setCorporateAccount(corpData as CorporateAccount);
        }
      } else if (profileData.account_type === "corporate") {
        const { data: corpData } = await supabase
          .from("corporate_admins")
          .select("corporate_account_id")
          .eq("user_id", user.id)
          .single();

        if (corpData) {
          const { data: account } = await supabase
            .from("corporate_accounts")
            .select("*")
            .eq("id", corpData.corporate_account_id)
            .single();

          if (account) {
            setCorporateAccount(account as CorporateAccount);
          }
        }
      }

      setLoading(false);
    }

    loadProfile();
  }, [user, authLoading]);

  const isCorporateAdmin =
    !!profile &&
    !!corporateAccount &&
    profile.account_type === "corporate";

  return (
    <ProfileContext.Provider value={{ profile, corporateAccount, isCorporateAdmin, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
