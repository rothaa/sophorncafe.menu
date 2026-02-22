-- Add contact fields to cafe_info
ALTER TABLE cafe_info 
ADD COLUMN IF NOT EXISTS location_en TEXT DEFAULT '123 Coffee Street, Phnom Penh',
ADD COLUMN IF NOT EXISTS location_kh TEXT DEFAULT 'ផ្លូវកាហ្វេ ១២៣ ភ្នំពេញ',
ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '+855 12 345 678',
ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'hello@sophorncafe.com',
ADD COLUMN IF NOT EXISTS hours_en TEXT DEFAULT 'Mon - Sun: 7:00 AM - 8:00 PM',
ADD COLUMN IF NOT EXISTS hours_kh TEXT DEFAULT 'ចន្ទ - អាទិត្យ: 7:00 ព្រឹក - 8:00 យប់';
