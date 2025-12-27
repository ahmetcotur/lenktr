-- Supabase Storage Buckets Configuration
-- Run this in your Supabase SQL Editor to create storage buckets

-- Create bio-images bucket for bio page backgrounds and avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('bio-images', 'bio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create avatars bucket for user profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for bio-images bucket
-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload bio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own images
CREATE POLICY "Users can update own bio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own bio images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access to bio images
CREATE POLICY "Public can view bio images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bio-images');

-- Storage policies for avatars bucket
-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
