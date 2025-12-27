-- Complete Database Setup Script for LENK.TR
-- This script will create all tables, indexes, policies, and storage buckets
-- Run this in Supabase SQL Editor for a fresh installation

-- ============================================================================
-- STEP 1: DROP EXISTING TABLES (if you want to start fresh)
-- ============================================================================
-- Uncomment the following lines if you want to drop existing tables
-- WARNING: This will delete all data!

-- DROP TABLE IF EXISTS public.traffic_logs CASCADE;
-- DROP TABLE IF EXISTS public.notifications CASCADE;
-- DROP TABLE IF EXISTS public.bio_pages CASCADE;
-- DROP TABLE IF EXISTS public.links CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'Operator',
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Links Table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  original_url TEXT NOT NULL,
  short_slug TEXT UNIQUE NOT NULL,
  title TEXT,
  clicks INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bio Pages Table
CREATE TABLE IF NOT EXISTS public.bio_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  profile_title TEXT,
  profile_bio TEXT,
  theme_settings JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('click', 'system', 'alert')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Traffic Logs Table
CREATE TABLE IF NOT EXISTS public.traffic_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  bio_page_id UUID REFERENCES public.bio_pages(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('link', 'bio')),
  referrer TEXT,
  country TEXT DEFAULT 'TR',
  device TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Bio Pages Indexes
CREATE INDEX IF NOT EXISTS idx_bio_pages_user_id ON public.bio_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_bio_pages_slug ON public.bio_pages(slug);
CREATE INDEX IF NOT EXISTS idx_bio_pages_is_published ON public.bio_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_bio_pages_created_at ON public.bio_pages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bio_pages_user_published ON public.bio_pages(user_id, is_published);

-- Links Indexes
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_short_slug ON public.links(short_slug);
CREATE INDEX IF NOT EXISTS idx_links_is_archived ON public.links(is_archived);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON public.links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_links_user_archived ON public.links(user_id, is_archived);

-- Profiles Index
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Traffic Logs Indexes
CREATE INDEX IF NOT EXISTS idx_traffic_logs_user_id ON public.traffic_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_created_at ON public.traffic_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_link_id ON public.traffic_logs(link_id);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_bio_page_id ON public.traffic_logs(bio_page_id);

-- ============================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: CREATE RLS POLICIES
-- ============================================================================

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Links Policies
DROP POLICY IF EXISTS "Users can CRUD own links" ON public.links;
DROP POLICY IF EXISTS "Public can view links for redirect" ON public.links;
DROP POLICY IF EXISTS "Public can update clicks" ON public.links;
CREATE POLICY "Users can CRUD own links" ON public.links FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view links for redirect" ON public.links FOR SELECT USING (true);
CREATE POLICY "Public can update clicks" ON public.links FOR UPDATE USING (true) WITH CHECK (true);

-- Bio Pages Policies
DROP POLICY IF EXISTS "Users can CRUD own bio pages" ON public.bio_pages;
DROP POLICY IF EXISTS "Public can view bio pages" ON public.bio_pages;
DROP POLICY IF EXISTS "Public can update bio page views" ON public.bio_pages;
CREATE POLICY "Users can CRUD own bio pages" ON public.bio_pages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view bio pages" ON public.bio_pages FOR SELECT USING (true);
CREATE POLICY "Public can update bio page views" ON public.bio_pages FOR UPDATE USING (true) WITH CHECK (true);

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Traffic Logs Policies
DROP POLICY IF EXISTS "Users can view own traffic logs" ON public.traffic_logs;
DROP POLICY IF EXISTS "Public can insert traffic logs" ON public.traffic_logs;
CREATE POLICY "Users can view own traffic logs" ON public.traffic_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can insert traffic logs" ON public.traffic_logs FOR INSERT WITH CHECK (true);

-- ============================================================================
-- STEP 6: ANALYZE TABLES
-- ============================================================================

ANALYZE public.profiles;
ANALYZE public.links;
ANALYZE public.bio_pages;
ANALYZE public.notifications;
ANALYZE public.traffic_logs;

-- ============================================================================
-- DONE!
-- ============================================================================

-- Next steps:
-- 1. Run supabase_storage.sql to create storage buckets
-- 2. Run mock_data.sql to add sample data (optional)
-- 3. Test the application!
