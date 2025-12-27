-- Mock Data for Testing
-- This script creates sample bio pages and links for demonstration
-- Run this in Supabase SQL Editor after replacing USER_ID with your actual user ID

-- Replace this with your actual user ID from auth.users
-- You can find it by running: SELECT id FROM auth.users WHERE email = 'your@email.com';
DO $$
DECLARE
    user_id UUID := 'e8270a84-d4f5-4dfc-8721-26f956ce943d'; -- Replace with your user ID
    ahmet_bio_id UUID;
    designer_bio_id UUID;
    developer_bio_id UUID;
BEGIN

-- 1. Ahmet Çötür - Professional Photographer Bio Page
INSERT INTO public.bio_pages (
    user_id,
    slug,
    profile_title,
    profile_bio,
    is_published,
    theme_settings
) VALUES (
    user_id,
    'ahmetcotur',
    'Ahmet Çötür',
    'Profesyonel Fotoğrafçı & Dijital İçerik Üreticisi | Kaş, Antalya, Fethiye, Bodrum',
    true,
    jsonb_build_object(
        'avatar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        'backgroundImage', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
        'uiStyle', 'elite',
        'font', 'Inter',
        'backgroundOpacity', 50,
        'backgroundBlur', 15,
        'verifiedIcon', true,
        'shareButton', true,
        'bioLinks', jsonb_build_array(
            jsonb_build_object('id', gen_random_uuid(), 'title', '📸 Portfolio', 'url', 'https://portfolio.com', 'icon', '🎨', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '🏨 Otel & Villa Çekimleri', 'url', 'https://socialkas.com', 'icon', '🏨', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '💍 Düğün Fotoğrafçılığı', 'url', 'https://wedding.com', 'icon', '💍', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '🚁 Drone Çekimleri', 'url', 'https://drone.com', 'icon', '🚁', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '📱 Sosyal Medya Paketleri', 'url', 'https://socialkas.com/sosyal-medya-paketleri', 'icon', '📱', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '📞 WhatsApp İletişim', 'url', 'https://wa.me/905074677502', 'icon', '💬', 'isActive', true)
        ),
        'socialMedia', jsonb_build_array(
            jsonb_build_object('platform', 'instagram', 'url', 'https://instagram.com/voynahmet', 'isActive', true),
            jsonb_build_object('platform', 'instagram', 'url', 'https://instagram.com/voyn.co', 'isActive', true),
            jsonb_build_object('platform', 'website', 'url', 'https://socialkas.com', 'isActive', true),
            jsonb_build_object('platform', 'email', 'url', 'mailto:info@ahmetcotur.com', 'isActive', true)
        )
    )
) RETURNING id INTO ahmet_bio_id;

-- 2. Sarah Design - UI/UX Designer Bio Page
INSERT INTO public.bio_pages (
    user_id,
    slug,
    profile_title,
    profile_bio,
    is_published,
    theme_settings
) VALUES (
    user_id,
    'sarahdesign',
    'Sarah Anderson',
    'UI/UX Designer | Creating beautiful digital experiences ✨',
    true,
    jsonb_build_object(
        'avatar', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        'backgroundImage', 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920',
        'uiStyle', 'gradient',
        'font', 'Poppins',
        'backgroundOpacity', 60,
        'backgroundBlur', 20,
        'verifiedIcon', true,
        'shareButton', true,
        'bioLinks', jsonb_build_array(
            jsonb_build_object('id', gen_random_uuid(), 'title', '🎨 Design Portfolio', 'url', 'https://dribbble.com/sarah', 'icon', '🎨', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '💼 Hire Me on Upwork', 'url', 'https://upwork.com', 'icon', '💼', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '📚 Design Resources', 'url', 'https://resources.com', 'icon', '📚', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '🎓 Free UI Course', 'url', 'https://course.com', 'icon', '🎓', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '☕ Buy Me a Coffee', 'url', 'https://buymeacoffee.com/sarah', 'icon', '☕', 'isActive', true)
        ),
        'socialMedia', jsonb_build_array(
            jsonb_build_object('platform', 'instagram', 'url', 'https://instagram.com/sarahdesigns', 'isActive', true),
            jsonb_build_object('platform', 'twitter', 'url', 'https://twitter.com/sarahux', 'isActive', true),
            jsonb_build_object('platform', 'linkedin', 'url', 'https://linkedin.com/in/sarahanderson', 'isActive', true),
            jsonb_build_object('platform', 'github', 'url', 'https://github.com/sarahdesign', 'isActive', true)
        )
    )
) RETURNING id INTO designer_bio_id;

-- 3. Alex Code - Full Stack Developer Bio Page
INSERT INTO public.bio_pages (
    user_id,
    slug,
    profile_title,
    profile_bio,
    is_published,
    theme_settings
) VALUES (
    user_id,
    'alexcode',
    'Alex Rivera',
    'Full Stack Developer | Building the future, one line at a time 🚀',
    true,
    jsonb_build_object(
        'avatar', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
        'backgroundImage', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920',
        'uiStyle', 'neon',
        'font', 'Space Grotesk',
        'backgroundOpacity', 70,
        'backgroundBlur', 10,
        'verifiedIcon', true,
        'shareButton', true,
        'bioLinks', jsonb_build_array(
            jsonb_build_object('id', gen_random_uuid(), 'title', '💻 GitHub Projects', 'url', 'https://github.com/alexrivera', 'icon', '💻', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '📝 Tech Blog', 'url', 'https://blog.alexcode.dev', 'icon', '📝', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '🎥 YouTube Channel', 'url', 'https://youtube.com/@alexcode', 'icon', '🎥', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '🛠️ Dev Tools I Use', 'url', 'https://tools.alexcode.dev', 'icon', '🛠️', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid(), 'title', '📧 Contact for Projects', 'url', 'mailto:alex@alexcode.dev', 'icon', '📧', 'isActive', true)
        ),
        'socialMedia', jsonb_build_array(
            jsonb_build_object('platform', 'github', 'url', 'https://github.com/alexrivera', 'isActive', true),
            jsonb_build_object('platform', 'twitter', 'url', 'https://twitter.com/alexcodes', 'isActive', true),
            jsonb_build_object('platform', 'linkedin', 'url', 'https://linkedin.com/in/alexrivera', 'isActive', true),
            jsonb_build_object('platform', 'youtube', 'url', 'https://youtube.com/@alexcode', 'isActive', true)
        )
    )
) RETURNING id INTO developer_bio_id;

-- Update views for bio pages (run after columns are added)
UPDATE public.bio_pages SET views = 127 WHERE slug = 'ahmetcotur';
UPDATE public.bio_pages SET views = 89 WHERE slug = 'sarahdesign';
UPDATE public.bio_pages SET views = 156 WHERE slug = 'alexcode';

-- Add some sample links for each bio page owner
-- Ahmet's Links
INSERT INTO public.links (user_id, short_slug, original_url, title, clicks, is_archived) VALUES
(user_id, 'portfolio', 'https://portfolio.ahmetcotur.com', 'Photography Portfolio', 45, false),
(user_id, 'socialkas', 'https://socialkas.com', 'Social Media Services', 32, false),
(user_id, 'wedding', 'https://wedding.ahmetcotur.com', 'Wedding Photography', 28, false);

-- Sarah's Links
INSERT INTO public.links (user_id, short_slug, original_url, title, clicks, is_archived) VALUES
(user_id, 'dribbble', 'https://dribbble.com/sarah', 'Dribbble Portfolio', 67, false),
(user_id, 'figma', 'https://figma.com/@sarah', 'Figma Templates', 54, false),
(user_id, 'course', 'https://course.sarahdesign.com', 'UI Design Course', 89, false);

-- Alex's Links
INSERT INTO public.links (user_id, short_slug, original_url, title, clicks, is_archived) VALUES
(user_id, 'github', 'https://github.com/alexrivera', 'GitHub Profile', 123, false),
(user_id, 'blog', 'https://blog.alexcode.dev', 'Tech Blog', 98, false),
(user_id, 'youtube', 'https://youtube.com/@alexcode', 'YouTube Channel', 145, false);

RAISE NOTICE 'Mock data created successfully!';
RAISE NOTICE 'Bio Pages: ahmetcotur, sarahdesign, alexcode';
RAISE NOTICE 'Total Links: 9';
RAISE NOTICE 'Total Clicks: 681';
RAISE NOTICE 'Total Views: 372';

END $$;
