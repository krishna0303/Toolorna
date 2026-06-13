-- Leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  profession TEXT NOT NULL,
  problem TEXT NOT NULL,
  budget TEXT NOT NULL,
  tools_tried TEXT,
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  tool_name TEXT NOT NULL,
  tool_description TEXT,
  why_perfect TEXT,
  key_feature TEXT,
  indian_price TEXT,
  coupon_code TEXT,
  discount_percent TEXT,
  affiliate_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Click tracking table
CREATE TABLE clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_id UUID REFERENCES recommendations(id),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash TEXT
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- RLS policies for leads (service role only — all operations through API routes)
CREATE POLICY "select_leads" ON leads FOR SELECT
  TO authenticated USING (true = false);

CREATE POLICY "insert_leads" ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_leads" ON leads FOR UPDATE
  TO authenticated USING (true = false);

CREATE POLICY "delete_leads" ON leads FOR DELETE
  TO authenticated USING (true = false);

-- RLS policies for recommendations
CREATE POLICY "select_recommendations" ON recommendations FOR SELECT
  TO authenticated USING (true = false);

CREATE POLICY "insert_recommendations" ON recommendations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_recommendations" ON recommendations FOR UPDATE
  TO authenticated USING (true = false);

CREATE POLICY "delete_recommendations" ON recommendations FOR DELETE
  TO authenticated USING (true = false);

-- RLS policies for clicks
CREATE POLICY "select_clicks" ON clicks FOR SELECT
  TO authenticated USING (true = false);

CREATE POLICY "insert_clicks" ON clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_clicks" ON clicks FOR UPDATE
  TO authenticated USING (true = false);

CREATE POLICY "delete_clicks" ON clicks FOR DELETE
  TO authenticated USING (true = false);