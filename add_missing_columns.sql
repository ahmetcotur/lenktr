-- Add missing columns to bio_pages table
-- Run this first before running mock_data.sql

-- Add views column if it doesn't exist
ALTER TABLE public.bio_pages 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Add any other potentially missing columns
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;

-- Verify the changes
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('bio_pages', 'links')
ORDER BY table_name, ordinal_position;
