-- Add missing traffic_logs table
-- Run this if you get "relation already exists" errors with the full schema

-- Create traffic_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.traffic_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
    bio_page_id UUID REFERENCES public.bio_pages(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'link' or 'bio'
    referrer TEXT,
    device TEXT,
    browser TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.traffic_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for traffic_logs
-- Allow public inserts (for anonymous tracking)
CREATE POLICY "Allow public inserts on traffic_logs"
ON public.traffic_logs FOR INSERT
TO public
WITH CHECK (true);

-- Allow users to view their own traffic logs
CREATE POLICY "Users can view own traffic logs"
ON public.traffic_logs FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_traffic_logs_user_id ON public.traffic_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_created_at ON public.traffic_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_link_id ON public.traffic_logs(link_id);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_bio_page_id ON public.traffic_logs(bio_page_id);
