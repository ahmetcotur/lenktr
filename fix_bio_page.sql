-- Fix social media data structure
-- This will restore the correct social media format

UPDATE public.bio_pages
SET theme_settings = jsonb_set(
    theme_settings,
    '{socialMedia}',
    '[
        {"platform": "twitter", "url": "", "isActive": false},
        {"platform": "instagram", "url": "https://instagram.com/voynahmet", "isActive": true},
        {"platform": "facebook", "url": "", "isActive": false},
        {"platform": "linkedin", "url": "", "isActive": false},
        {"platform": "youtube", "url": "", "isActive": false},
        {"platform": "tiktok", "url": "", "isActive": false},
        {"platform": "github", "url": "", "isActive": false},
        {"platform": "discord", "url": "", "isActive": false},
        {"platform": "website", "url": "https://socialkas.com", "isActive": true},
        {"platform": "email", "url": "mailto:info@ahmetcotur.com", "isActive": true},
        {"platform": "telegram", "url": "", "isActive": false}
    ]'::jsonb
)
WHERE id = '1c0a8401-00a9-4970-8112-8010b84a1699';

-- Verify
SELECT theme_settings->'socialMedia' FROM public.bio_pages 
WHERE id = '1c0a8401-00a9-4970-8112-8010b84a1699';
