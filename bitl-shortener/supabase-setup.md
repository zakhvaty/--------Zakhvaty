# Supabase Database Setup

## Database Schema

### URLs Table
```sql
CREATE TABLE urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_id VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for fast lookups by short_id
CREATE UNIQUE INDEX idx_urls_short_id ON urls(short_id);

-- Create index for created_at for potential analytics
CREATE INDEX idx_urls_created_at ON urls(created_at);
```

## Row Level Security (RLS)
Since this is a public service without user authentication, we'll allow:
- Anyone to INSERT new URLs
- Anyone to SELECT URLs by short_id for redirects

```sql
-- Enable RLS
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new URLs
CREATE POLICY "Anyone can create short URLs" ON urls
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anyone to read URLs (for redirects)
CREATE POLICY "Anyone can read URLs" ON urls
  FOR SELECT TO anon
  USING (true);
```

## Setup Instructions

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands above to create the table and policies
4. Copy your project URL and anon key to the .env file
5. Test the setup by inserting a test URL

## Environment Variables Required

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```