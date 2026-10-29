-- LENK.TR - ahmet@ahmetcotur.com Sistem Yöneticisi Yetkilendirme Scripti
-- Bu script ahmet@ahmetcotur.com hesabının profiles tablosundaki rolünü 'admin' yapar ve e-postasını onaylar.

UPDATE profiles p
JOIN users u ON u.id = p.id
SET p.role = 'admin',
    p.updated_at = UTC_TIMESTAMP()
WHERE LOWER(u.email) = 'ahmet@ahmetcotur.com';

UPDATE users
SET email_verified_at = COALESCE(email_verified_at, created_at, UTC_TIMESTAMP()),
    access_disabled = 0,
    access_disabled_reason = NULL,
    access_disabled_at = NULL
WHERE LOWER(email) = 'ahmet@ahmetcotur.com';

-- Yetkilendirme kontrolü:
SELECT u.id, u.email, p.full_name, p.role, u.email_verified_at, u.access_disabled
FROM users u
LEFT JOIN profiles p ON p.id = u.id
WHERE LOWER(u.email) = 'ahmet@ahmetcotur.com';
