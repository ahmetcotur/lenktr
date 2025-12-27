-- Check ahmetcotur bio page theme settings
SELECT 
    slug,
    theme_settings->'uiStyle' as ui_style,
    theme_settings->'customColors' as custom_colors,
    theme_settings->'backgroundImage' as bg_image
FROM public.bio_pages
WHERE slug = 'ahmetcotur';
