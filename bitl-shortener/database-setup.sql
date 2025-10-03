CREATE TABLE urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_id VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE UNIQUE INDEX idx_urls_short_id ON urls(short_id);

CREATE INDEX idx_urls_created_at ON urls(created_at);

ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create short URLs" ON urls
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read URLs" ON urls
  FOR SELECT TO anon
  USING (true);