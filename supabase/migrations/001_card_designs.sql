-- Card Designs Table
-- Stores complete card designs with all element positions, fonts, colors, backgrounds, and frames
CREATE TABLE IF NOT EXISTS card_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  design_name TEXT NOT NULL DEFAULT 'Untitled Design',
  
  -- Background settings
  bg_type TEXT NOT NULL DEFAULT 'gradient' CHECK (bg_type IN ('gradient', 'image', 'solid')),
  gradient_color1 TEXT DEFAULT '#667eea',
  gradient_color2 TEXT DEFAULT '#764ba2',
  gradient_angle INTEGER DEFAULT 135,
  solid_color TEXT DEFAULT '#ffffff',
  bg_image TEXT,
  
  -- Frame selection
  current_frame TEXT DEFAULT 'none',
  
  -- Canvas elements (stored as JSONB array)
  elements JSONB DEFAULT '[]'::jsonb,
  
  -- Card contact data
  card_data JSONB DEFAULT '{}'::jsonb,
  
  -- Selected fields to display
  selected_fields TEXT[] DEFAULT '{name,title,company,phone,email}',
  
  -- Design template used (if any)
  template_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster user queries
CREATE INDEX IF NOT EXISTS idx_card_designs_user_id ON card_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_card_designs_updated ON card_designs(user_id, updated_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_card_designs_updated_at
  BEFORE UPDATE ON card_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE card_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own card designs"
  ON card_designs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own card designs"
  ON card_designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own card designs"
  ON card_designs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own card designs"
  ON card_designs FOR DELETE
  USING (auth.uid() = user_id);
