-- Database Performance Optimization
-- Run this in Supabase SQL Editor to add indexes and improve query speed

-- Add indexes for bio_pages table
CREATE INDEX IF NOT EXISTS idx_bio_pages_user_id ON public.bio_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_bio_pages_slug ON public.bio_pages(slug);
CREATE INDEX IF NOT EXISTS idx_bio_pages_is_published ON public.bio_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_bio_pages_created_at ON public.bio_pages(created_at DESC);

-- Add indexes for links table
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_short_slug ON public.links(short_slug);
CREATE INDEX IF NOT EXISTS idx_links_is_archived ON public.links(is_archived);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON public.links(created_at DESC);

-- Add indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_bio_pages_user_published ON public.bio_pages(user_id, is_published);
CREATE INDEX IF NOT EXISTS idx_links_user_archived ON public.links(user_id, is_archived);

-- Analyze tables to update statistics
ANALYZE public.bio_pages;
ANALYZE public.links;
ANALYZE public.profiles;
ANALYZE public.traffic_logs;
