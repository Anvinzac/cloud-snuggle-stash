import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type Session, type User } from '@supabase/supabase-js';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const applySession = async (session: Session | null) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      if (!cancelled) setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      setTimeout(() => {
        void applySession(session);
      }, 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      void applySession(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}