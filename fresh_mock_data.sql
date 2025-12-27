-- Clean Mock Data and Create Fresh Bio Pages
-- This will delete old mock data and create 3 new bio pages with correct structure

-- Step 1: Delete old mock bio pages (keep your manually created ones)
DELETE FROM public.bio_pages WHERE slug IN ('ahmetcotur', 'sarahdesign', 'alexcode');
DELETE FROM public.links WHERE short_slug IN ('portfolio', 'socialkas', 'wedding', 'dribbble', 'figma', 'course', 'github', 'blog', 'youtube');

-- Step 2: Create new bio pages with correct structure
DO $$
DECLARE
    user_id UUID := '1218247a-2b7f-4dd9-96d8-fba4d47018b3'; -- Your user ID
BEGIN

-- 1. Ahmet Çötür - Professional Photographer
INSERT INTO public.bio_pages (
    user_id,
    slug,
    profile_title,
    profile_bio,
    is_published,
    views,
    theme_settings
) VALUES (
    user_id,
    'ahmetcotur',
    'Ahmet Çötür',
    'Profesyonel Fotoğrafçı & Dijital İçerik Üreticisi | Kaş, Antalya, Fethiye, Bodrum',
    true,
    127,
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
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '📸 Portfolio', 'url', 'https://portfolio.com', 'icon', '🎨', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '🏨 Otel & Villa Çekimleri', 'url', 'https://socialkas.com', 'icon', '🏨', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '💍 Düğün Fotoğrafçılığı', 'url', 'https://wedding.com', 'icon', '💍', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '🚁 Drone Çekimleri', 'url', 'https://drone.com', 'icon', '🚁', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '📱 Sosyal Medya Paketleri', 'url', 'https://socialkas.com/sosyal-medya-paketleri', 'icon', '📱', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '📞 WhatsApp İletişim', 'url', 'https://wa.me/905074677502', 'icon', '💬', 'isActive', true)
        ),
        'socialMedia', jsonb_build_array(
            jsonb_build_object('platform', 'twitter', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'instagram', 'url', 'https://instagram.com/voynahmet', 'isActive', true),
            jsonb_build_object('platform', 'facebook', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'linkedin', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'youtube', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'tiktok', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'github', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'discord', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'website', 'url', 'https://socialkas.com', 'isActive', true),
            jsonb_build_object('platform', 'email', 'url', 'mailto:info@ahmetcotur.com', 'isActive', true),
            jsonb_build_object('platform', 'telegram', 'url', '', 'isActive', false)
        )
    )
);

-- 2. Sarah Design - UI/UX Designer
INSERT INTO public.bio_pages (
    user_id,
    slug,
    profile_title,
    profile_bio,
    is_published,
    views,
    theme_settings
) VALUES (
    user_id,
    'sarahdesign',
    'Sarah Anderson',
    'UI/UX Designer | Creating beautiful digital experiences ✨',
    true,
    89,
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
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '🎨 Design Portfolio', 'url', 'https://dribbble.com/sarah', 'icon', '🎨', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '💼 Hire Me on Upwork', 'url', 'https://upwork.com', 'icon', '💼', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '📚 Design Resources', 'url', 'https://resources.com', 'icon', '📚', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '🎓 Free UI Course', 'url', 'https://course.com', 'icon', '🎓', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '☕ Buy Me a Coffee', 'url', 'https://buymeacoffee.com/sarah', 'icon', '☕', 'isActive', true)
        ),
        'socialMedia', jsonb_build_array(
            jsonb_build_object('platform', 'twitter', 'url', 'https://twitter.com/sarahux', 'isActive', true),
            jsonb_build_object('platform', 'instagram', 'url', 'https://instagram.com/sarahdesigns', 'isActive', true),
            jsonb_build_object('platform', 'facebook', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'linkedin', 'url', 'https://linkedin.com/in/sarahanderson', 'isActive', true),
            jsonb_build_object('platform', 'youtube', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'tiktok', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'github', 'url', 'https://github.com/sarahdesign', 'isActive', true),
            jsonb_build_object('platform', 'discord', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'website', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'email', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'telegram', 'url', '', 'isActive', false)
        )
    )
);

-- 3. Alex Code - Full Stack Developer
INSERT INTO public.bio_pages (
    user_id,
    slug,
    profile_title,
    profile_bio,
    is_published,
    views,
    theme_settings
) VALUES (
    user_id,
    'alexcode',
    'Alex Rivera',
    'Full Stack Developer | Building the future, one line at a time 🚀',
    true,
    156,
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
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '💻 GitHub Projects', 'url', 'https://github.com/alexrivera', 'icon', '💻', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '📝 Tech Blog', 'url', 'https://blog.alexcode.dev', 'icon', '📝', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '🎥 YouTube Channel', 'url', 'https://youtube.com/@alexcode', 'icon', '🎥', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '🛠️ Dev Tools I Use', 'url', 'https://tools.alexcode.dev', 'icon', '🛠️', 'isActive', true),
            jsonb_build_object('id', gen_random_uuid()::text, 'title', '📧 Contact for Projects', 'url', 'mailto:alex@alexcode.dev', 'icon', '📧', 'isActive', true)
        ),
        'socialMedia', jsonb_build_array(
            jsonb_build_object('platform', 'twitter', 'url', 'https://twitter.com/alexcodes', 'isActive', true),
            jsonb_build_object('platform', 'instagram', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'facebook', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'linkedin', 'url', 'https://linkedin.com/in/alexrivera', 'isActive', true),
            jsonb_build_object('platform', 'youtube', 'url', 'https://youtube.com/@alexcode', 'isActive', true),
            jsonb_build_object('platform', 'tiktok', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'github', 'url', 'https://github.com/alexrivera', 'isActive', true),
            jsonb_build_object('platform', 'discord', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'website', 'url', '', 'isActive', false),
            jsonb_build_object('platform', 'email', 'url', 'mailto:alex@alexcode.dev', 'isActive', true),
            jsonb_build_object('platform', 'telegram', 'url', '', 'isActive', false)
        )
    )
);

-- Step 3: Add sample links
INSERT INTO public.links (user_id, short_slug, original_url, title, clicks, is_archived) VALUES
(user_id, 'portfolio', 'https://portfolio.ahmetcotur.com', 'Photography Portfolio', 45, false),
(user_id, 'socialkas', 'https://socialkas.com', 'Social Media Services', 32, false),
(user_id, 'wedding', 'https://wedding.ahmetcotur.com', 'Wedding Photography', 28, false),
(user_id, 'dribbble', 'https://dribbble.com/sarah', 'Dribbble Portfolio', 67, false),
(user_id, 'figma', 'https://figma.com/@sarah', 'Figma Templates', 54, false),
(user_id, 'course', 'https://course.sarahdesign.com', 'UI Design Course', 89, false),
(user_id, 'github', 'https://github.com/alexrivera', 'GitHub Profile', 123, false),
(user_id, 'blog', 'https://blog.alexcode.dev', 'Tech Blog', 98, false),
(user_id, 'youtube', 'https://youtube.com/@alexcode', 'YouTube Channel', 145, false);

RAISE NOTICE 'Successfully created 3 bio pages and 9 links!';
RAISE NOTICE 'Bio Pages: lenk.tr/ahmetcotur, lenk.tr/sarahdesign, lenk.tr/alexcode';
RAISE NOTICE 'Total Clicks: 681';
RAISE NOTICE 'Total Views: 372';

END $$;
