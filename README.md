# LENK.TR

[LENK.TR](https://lenk.tr), bağlantılarını kısaltıp bio sayfalarında paylaşmanı ve trafiğini tek panelden takip etmeni sağlayan bağımsız bir link yönetim uygulamasıdır. React arayüzü, Node.js API ve MariaDB ile çalışır; Supabase çalışma zamanı gerektirmez.

**Canlı site:** https://lenk.tr · **Kaynak kodu:** https://github.com/ahmetcotur/lenktr

## Özellikler

- Kısa bağlantılar oluşturma, düzenleme, arşivleme ve tıklama takibi
- UTM kampanya parametreleri; Meta, Google ve TikTok piksel olayları
- Ülke, işletim sistemi ve tarayıcıya göre yönlendirme; zamanlama ve parola koruması
- Sosyal paylaşım önizlemeleri ve isteğe bağlı markalı yönlendirme ekranı
- Linklere özel ayarlanabilir QR kodları; PNG, JPG ve PDF dışa aktarımı
- Özelleştirilebilir, yayınlanabilir bio sayfaları
- Tarih aralığı seçilebilen trafik grafikleri; link ve bio sayfasına göre detaylar
- Sosyal medya, arama motoru, yapay zekâ, bot, yönlendirme ve doğrudan trafik sınıflandırması
- Ülke, cihaz ve kaynak raporları; ziyaret edilen ülkeler için harita görünümü
- E-posta doğrulamalı kayıt, şifre sıfırlama ve güvenlik bildirimleri
- Yönetici paneli ve kullanıcı erişim denetimi
- Türkçe ve İngilizce arayüz

## Teknoloji

React 19, Vite, Tailwind CSS, Express 5, Node.js 22 ve MariaDB 11. Veritabanına yalnızca sunucu erişir. Parolalar bcrypt ile saklanır; kimlik doğrulama ve kullanıcıya ait kayıtların yetkilendirmesi API tarafında yapılır.

## Yerel geliştirme

Node.js 22 ve çalışan bir MariaDB 11 sunucusu gerekir. Depoyu klonlayıp ortam dosyasını hazırlayın:

```sh
git clone https://github.com/ahmetcotur/lenktr.git
cd lenktr
cp .env.example .env
npm ci --legacy-peer-deps
```

`.env` içindeki `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` ve `DB_NAME` değerlerini MariaDB kurulumunuza göre düzenleyin. Gerekli tablolar ilk sunucu başlangıcında `server/schema.sql` ile oluşturulur.

```sh
npm start       # API ve uygulama: http://localhost:3001
npm run dev     # Vite geliştirme sunucusu
```

Geliştirme arayüzü API isteklerini çalışan Node sunucusuna iletir. Uygulama portu `PORT` değişkeniyle ayarlanabilir.

## Dağıtım

Dockerfile Coolify veya başka bir Docker platformunda kullanılabilir. Uygulama için MariaDB 11 veritabanını aynı ağda veya erişilebilir bir veritabanı sunucusunda sağlayın ve çalışma zamanında `.env.example` içindeki veritabanı değişkenlerini tanımlayın. `UPLOAD_DIR` için kalıcı disk bağlayın; üretimde örneğin `/app/data/uploads` kullanın. E-posta gönderimi için SMTP değişkenlerini, doğru `APP_URL` ve gönderen adresiyle ayarlayın.

Sağlık kontrolü: `GET /api/health`.

## E-posta

Kayıt doğrulama, doğrulama bağlantısını yeniden gönderme, şifre sıfırlama, güvenlik bildirimleri ve iletişim formu senaryoları [e-posta kurulum notlarında](docs/email.md) açıklanmıştır. SMTP yapılandırılmadığında e-postalar MariaDB kuyruğunda bekler.

## Kontroller

```sh
npm run lint
npm run build
npm test
```

API entegrasyon testi kayıt oluşturup temizler. Üretim veritabanı yerine ayrı bir test veritabanıyla çalıştırın.

## Supabase'den veri taşıma

Uygulamanın çalışma anında Supabase bağımlılığı yoktur. Eski Supabase verileri API dışa aktarımı veya SQL yedeğiyle taşınabilir. Kullanıcı parolalarının korunması için `auth.users.encrypted_password` değerlerine ihtiyaç vardır; yönetici kullanıcı listeleme API'si parola verisi sunmaz. Görseller `UPLOAD_DIR` altındaki kalıcı dosya alanına taşınmalıdır. Yedekleri, parolaları ve erişim anahtarlarını Git deposuna eklemeyin.
