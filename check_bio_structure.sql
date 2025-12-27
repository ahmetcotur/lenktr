-- Check current bio page structure
SELECT 
    id,
    slug,
    profile_title,
    theme_settings
FROM public.bio_pages
WHERE slug = 'ahmetcotur'
LIMIT 1;
