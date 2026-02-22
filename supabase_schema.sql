-- Create a table for drinks
CREATE TABLE IF NOT EXISTS drinks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_kh TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  is_best_seller BOOLEAN DEFAULT false,
  is_out_of_stock BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a table for cafe settings
CREATE TABLE IF NOT EXISTS cafe_info (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  logo TEXT,
  url TEXT NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial cafe info
INSERT INTO cafe_info (id, name, logo, url)
VALUES (1, 'So Phorn Cafe', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200&auto=format&fit=crop', 'http://localhost:5173')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Read)
CREATE POLICY "Public drinks are viewable by everyone" ON drinks FOR SELECT USING (true);
CREATE POLICY "Public cafe_info is viewable by everyone" ON cafe_info FOR SELECT USING (true);

-- Create policies for admin access (Update/Insert/Delete)
CREATE POLICY "Enable all for anyone for now" ON drinks FOR ALL USING (true);
CREATE POLICY "Enable all for anyone for now" ON cafe_info FOR ALL USING (true);

-- STORAGE SETUP
-- Note: You should create a public bucket named 'drink-images' in the Supabase Dashboard
-- or run the following if your Supabase version supports it via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('drink-images', 'drink-images', true);
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'drink-images' );
-- CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'drink-images' );
