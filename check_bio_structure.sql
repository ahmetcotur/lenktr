-- Check this specific bio page's theme_settings
SELECT 
    id,
    slug,
    profile_title,
    theme_settings->'socialMedia' as social_media,
    theme_settings->'bioLinks' as bio_links
FROM public.bio_pages
WHERE id = 'd22234ca-848e-4b61-91c4-03c28d5f6a41';
