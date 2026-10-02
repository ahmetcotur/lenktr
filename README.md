# LENK.TR
React/Vite arayüzü, Node.js API ve MariaDB 11 ile çalışan bağımsız bağlantı ve bio sayfası uygulaması.

## Yerel geliştirme
Node.js 22 ve MariaDB 11 gerekir. `.env.example` dosyasını `.env` olarak kopyalayıp veritabanı bilgilerini doldurun.

```sh
npm ci --legacy-peer-deps
npm start
npm run dev
```
API varsayılan üretim portu 80'dir; yerel `.env` portu 3001'dir. İlk başlatmada `server/schema.sql` tabloları veri silmeden oluşturur. Tarayıcı veritabanına doğrudan erişmez. Şifreler bcrypt ile, oturum anahtarları SHA-256 ile saklanır. Kullanıcıya ait kayıtların erişimi API'de sınırlandırılır. Kısa bağlantı ve bio sayfası adresleri ortak bir ad alanında benzersizdir; sayaçlar ve ziyaret kayıtları tek işlemde güncellenir.

## Coolify
Dockerfile ile dağıtın. `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` değişkenlerini yalnızca çalışma zamanında tanımlayın. MariaDB ile aynı Docker ağına bağlayın. Kalıcı dosya alanını `/app/data/uploads` konumuna bağlayın. Sağlık kontrolü: `/api/health`.

## Kontroller
```sh
npm run build
npm test
```
API testi kendi kullanıcılarını oluşturur ve temizler; ayrı test veritabanıyla çalıştırın.

## Veri geçişi
Supabase çalışma zamanı bağımlılığı yoktur. Eski veriler API dışa aktarımı veya SQL yedeğinden taşınabilir. Şifrelerin korunması için `auth.users.encrypted_password` değerleri gerekir; yönetici kullanıcı listeleme API'si bunları içermez. Görseller kalıcı yerel dosya alanına taşınmalıdır. Yedek ve erişim anahtarları Git deposuna eklenmemelidir.

## E-posta
Kayıt/doğrulama, şifre sıfırlama, güvenlik bildirimleri ve iletişim talepleri: [kurulum ve senaryolar](docs/email.md). SMTP kurulmadan mesajlar bekler; canlı teslimat kontrolü SMTP bağlandıktan sonra yapılır.
