# E-posta senaryoları

SMTP kurulmadan uygulama normal çalışır. Hesap e-postaları MariaDB'deki `mail_outbox` tablosuna alınır. SMTP tanımlanınca gönderim işçisi 15 saniyede bir kuyruğu işler. Üretimde `APP_URL=https://lenk.tr` olmalıdır.

| Senaryo | Tetikleyici | Davranış |
| --- | --- | --- |
| Karşılama ve doğrulama | Yeni hesap kaydı | 24 saatlik tek kullanımlık doğrulama bağlantısı |
| Doğrulamayı tekrar gönder | Profil ayarları | Önceki doğrulama bağlantısını geçersiz kılar |
| Şifre sıfırlama | Şifremi unuttum sayfası | 45 dakikalık tek kullanımlık bağlantı; hesap bulunup bulunmadığını açıklamaz |
| Şifre değişikliği | Ayarlardan değişiklik veya sıfırlama | Güvenlik e-postası ve uygulama bildirimi; diğer oturumlar kapanır |
| İletişim talebi | İletişim formu | Talep veritabanına kaydedilir; SUPPORT_EMAIL tanımlıysa destek kutusuna bildirim, cevap adresi talep sahibidir |

İletişim formu SMTP hazır değilken de talepleri saklar. SUPPORT_EMAIL tanımlanmadan alınan talepler `contact_messages` tablosundan görülebilir. Kullanıcıya otomatik iletişim teyidi gönderilmez; bu, formun üçüncü kişilere e-posta göndermek için kullanılmasını önler.

## SMTP bağlantısı
Coolify uygulama ortam değişkenlerinde aşağıdaki alanları yalnızca çalışma zamanında tanımlayın:

- `APP_URL`: `https://lenk.tr`
- `SMTP_HOST`, `SMTP_PORT`: SMTP sunucusu; 465 doğrudan TLS, 587 STARTTLS
- `SMTP_USER`, `SMTP_PASSWORD`: hesap bilgileri
- `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`: doğrulanmış gönderen adresi ve LENK.TR adı
- `SUPPORT_EMAIL`: iletişim taleplerini alacak adres
- `SMTP_SERVERNAME`: bağlantı iç ağ adıyla kuruluyorsa sertifikadaki sunucu adı
- `SMTP_CA_FILE`: yalnızca özel CA kullanılan kurulumlar için güvenilir sertifika dosyası

TLS sertifika doğrulaması kapatılmaz. Alan adının SPF/DKIM/DMARC kayıtları SMTP sağlayıcısına göre yapılandırılmalıdır. `MAIL_FROM_ADDRESS` SMTP hesabının göndermeye yetkili olduğu adres olmalıdır.

## Kuyruk ve işletim
Gönderim en fazla 5 kez denenir; denemeler arasında artan bekleme uygulanır. Süresi geçmiş sıfırlama/doğrulama mesajları gönderilmez. Gönderilen mesajların bağlantı içeren gövdesi veritabanından temizlenir. SMTP tarafından reddedilen teslimat başarısız kabul edilir. SMTP kabulü alıcının gelen kutusuna teslim garantisi değildir; canlı teslim testi SMTP bilgileri tanımlandıktan sonra yapılır.

```sql
SELECT kind, status, COUNT(*) FROM mail_outbox GROUP BY kind, status;
SELECT id, kind, attempts, last_error FROM mail_outbox WHERE status='failed';
SELECT name, email, subject, created_at FROM contact_messages ORDER BY created_at DESC;
```

Aktif mesaj işçisi bir veritabanı kilidiyle kaydı sahiplenir. Gönderici kabulünden sonra işlem beklenmedik biçimde sonlanırsa mesaj tekrar gönderilebilir; Message-ID aynı kalır. Yedeklerdeki mail gövdeleri ve tek kullanımlık bağlantılar özel tutulmalıdır.
