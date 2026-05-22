-- Profiles: extends auth.users with app-specific fields
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL DEFAULT 'personal'
    CHECK (account_type IN ('personal', 'corporate')),
  work_for UUID REFERENCES corporate_accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Corporate accounts: company-level branding template
CREATE TABLE IF NOT EXISTS corporate_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'prebuilt'
    CHECK (template_type IN ('prebuilt', 'custom')),
  template_id TEXT,
  accent_color TEXT NOT NULL DEFAULT '#0f3460',
  font_family TEXT NOT NULL DEFAULT 'Inter',
  font_size INTEGER NOT NULL DEFAULT 16,
  custom_design JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Corporate admins: users who can manage the corporate template
CREATE TABLE IF NOT EXISTS corporate_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_account_id UUID NOT NULL REFERENCES corporate_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(corporate_account_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_work_for ON profiles(work_for);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_corporate_admins_user ON corporate_admins(user_id);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_updated_at();

CREATE TRIGGER update_corporate_accounts_updated_at
  BEFORE UPDATE ON corporate_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Corporate admins can read profiles of their employees"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM corporate_admins ca
      WHERE ca.user_id = auth.uid()
        AND ca.corporate_account_id = profiles.work_for
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Corporate admins can update employee profiles within their corp"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM corporate_admins ca
      WHERE ca.user_id = auth.uid()
        AND ca.corporate_account_id = profiles.work_for
    )
  );

-- corporate_accounts RLS
ALTER TABLE corporate_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read corporate accounts"
  ON corporate_accounts FOR SELECT
  USING (true);

CREATE POLICY "Corporate admins can insert their corporate account"
  ON corporate_accounts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.account_type = 'corporate'
    )
  );

CREATE POLICY "Corporate admins can update their corporate account"
  ON corporate_accounts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM corporate_admins ca
      WHERE ca.user_id = auth.uid()
        AND ca.corporate_account_id = corporate_accounts.id
    )
  );

-- corporate_admins RLS
ALTER TABLE corporate_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Corporate admins can read their admin records"
  ON corporate_admins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Corporate admins can manage admin records for their corp"
  ON corporate_admins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM corporate_admins ca
      WHERE ca.user_id = auth.uid()
        AND ca.corporate_account_id = corporate_admins.corporate_account_id
    )
  );

CREATE POLICY "Corporate admins can delete admin records from their corp"
  ON corporate_admins FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM corporate_admins ca
      WHERE ca.user_id = auth.uid()
        AND ca.corporate_account_id = corporate_admins.corporate_account_id
    )
  );
