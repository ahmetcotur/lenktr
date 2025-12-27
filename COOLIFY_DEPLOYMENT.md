# Coolify Deployment Guide - LENK.TR

Bu doküman, LENK.TR projesini Coolify platformunda nasıl deploy edeceğinizi adım adım açıklar.

## 📋 Ön Gereksinimler

- Coolify hesabı ve kurulu bir Coolify instance
- Supabase projesi (Database + Storage)
- Git repository (GitHub, GitLab, veya Bitbucket)

## 🔧 Adım 1: Environment Variables (Ortam Değişkenleri)

Coolify'da projenizi oluşturduktan sonra, aşağıdaki environment variables'ları ekleyin:

### Gerekli Environment Variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Production URL
VITE_APP_URL=https://lenk.tr
```

> **Önemli:** Supabase bilgilerinizi Supabase Dashboard > Settings > API bölümünden alabilirsiniz.

## 🚀 Adım 2: Coolify'da Proje Oluşturma

### 2.1. Yeni Kaynak Ekle
1. Coolify dashboard'unuza giriş yapın
2. **"New Resource"** butonuna tıklayın
3. **"Application"** seçeneğini seçin

### 2.2. Git Repository Bağlama
1. Git source'unuzu seçin (GitHub/GitLab/Bitbucket)
2. Repository'nizi seçin
3. Branch'i seçin (genellikle `main` veya `master`)

### 2.3. Build Configuration
Coolify otomatik olarak Dockerfile'ı tespit edecektir. Eğer tespit etmezse:

- **Build Pack:** `Dockerfile`
- **Dockerfile Location:** `./Dockerfile`
- **Port:** `80`

### 2.4. Environment Variables Ekleme
1. **"Environment Variables"** sekmesine gidin
2. Yukarıdaki environment variables'ları ekleyin
3. **"Save"** butonuna tıklayın

## 🗄️ Adım 3: Supabase Kurulumu

### 3.1. Database Schema Kurulumu
1. Supabase Dashboard > SQL Editor'e gidin
2. `supabase_schema.sql` dosyasının içeriğini çalıştırın
3. Tüm tabloların oluşturulduğunu doğrulayın

### 3.2. Storage Kurulumu
1. Supabase Dashboard > Storage'a gidin
2. Aşağıdaki bucket'ları oluşturun:
   - `avatars` (public)
   - `backgrounds` (public)
   - `link-thumbnails` (public)

### 3.3. Storage Policies
`supabase_storage.sql` dosyasını SQL Editor'de çalıştırarak storage policy'lerini kurun.

## 🔒 Adım 4: Domain ve SSL

### 4.1. Domain Ekleme
1. Coolify'da projenizin ayarlarına gidin
2. **"Domains"** sekmesine tıklayın
3. Domain'inizi ekleyin (örn: `lenk.tr`)
4. DNS kayıtlarınızı Coolify'ın verdiği IP'ye yönlendirin

### 4.2. SSL Sertifikası
Coolify otomatik olarak Let's Encrypt SSL sertifikası oluşturacaktır.

## 📦 Adım 5: Deployment

### 5.1. İlk Deploy
1. Tüm ayarları kontrol edin
2. **"Deploy"** butonuna tıklayın
3. Build loglarını takip edin
4. Deploy tamamlandığında siteniz yayında olacak

### 5.2. Otomatik Deployment
Coolify, Git repository'nizdeki değişiklikleri otomatik olarak tespit edip deploy edebilir:

1. **"Settings"** > **"Auto Deploy"** sekmesine gidin
2. **"Enable Auto Deploy"** seçeneğini aktif edin
3. Artık her push'ta otomatik deploy olacak

## 🧪 Adım 6: Test ve Doğrulama

Deploy sonrası aşağıdakileri test edin:

- [ ] Ana sayfa yükleniyor mu?
- [ ] Kullanıcı kaydı çalışıyor mu?
- [ ] Login işlemi başarılı mı?
- [ ] Bio page oluşturma çalışıyor mu?
- [ ] Resim upload çalışıyor mu?
- [ ] Public bio page görüntüleniyor mu?

## 🔍 Adım 7: Monitoring ve Logs

### Logları İnceleme
1. Coolify dashboard'da projenize gidin
2. **"Logs"** sekmesine tıklayın
3. Real-time logları görüntüleyin

### Hata Ayıklama
Eğer bir sorun yaşarsanız:
1. Build loglarını kontrol edin
2. Runtime loglarını kontrol edin
3. Environment variables'ları doğrulayın
4. Supabase bağlantısını test edin

## 🔄 Güncelleme ve Bakım

### Kod Güncellemeleri
```bash
# Local'de değişiklik yapın
git add .
git commit -m "Update: açıklama"
git push origin main

# Coolify otomatik deploy edecek (Auto Deploy aktifse)
# veya manuel olarak "Deploy" butonuna tıklayın
```

### Environment Variables Güncelleme
1. Coolify'da **"Environment Variables"** sekmesine gidin
2. Değişiklik yapın
3. **"Save"** ve **"Redeploy"** yapın

## 🐳 Local'de Docker ile Test

Deploy etmeden önce local'de test etmek için:

```bash
# Docker build
docker build -t lenk-tr .

# Docker run
docker run -p 3000:80 \
  -e VITE_SUPABASE_URL=your-url \
  -e VITE_SUPABASE_ANON_KEY=your-key \
  lenk-tr

# veya docker-compose ile
docker-compose up
```

Tarayıcıda `http://localhost:3000` adresine gidin.

## 📊 Performans Optimizasyonu

Coolify'da performansı artırmak için:

1. **Resource Limits:** Container için CPU ve RAM limitlerini ayarlayın
2. **Health Checks:** Health check endpoint'i ekleyin
3. **Scaling:** Gerekirse horizontal scaling yapın

## 🆘 Yaygın Sorunlar ve Çözümler

### Build Başarısız Oluyor
- `package.json` dosyasını kontrol edin
- Node.js versiyonunu kontrol edin (Dockerfile'da `node:20-alpine`)
- Build loglarını detaylı inceleyin

### Environment Variables Çalışmıyor
- Vite için değişkenler `VITE_` prefix'i ile başlamalı
- Değişiklikleri kaydettikten sonra redeploy yapın
- Build-time variables olduğu için rebuild gerekir

### Supabase Bağlantı Hatası
- URL ve ANON_KEY'i doğrulayın
- Supabase projesinin aktif olduğunu kontrol edin
- CORS ayarlarını kontrol edin (Supabase Dashboard > Authentication > URL Configuration)

### 404 Hataları (React Router)
- `nginx.conf` dosyasının doğru kopyalandığını kontrol edin
- `try_files $uri $uri/ /index.html;` satırının olduğundan emin olun

## 📞 Destek

Sorun yaşarsanız:
- Coolify documentation: https://coolify.io/docs
- Supabase documentation: https://supabase.com/docs
- Proje GitHub Issues

## ✅ Checklist

Deploy öncesi kontrol listesi:

- [ ] Supabase projesi oluşturuldu
- [ ] Database schema kuruldu
- [ ] Storage bucket'ları oluşturuldu
- [ ] Environment variables ayarlandı
- [ ] Git repository bağlandı
- [ ] Dockerfile test edildi
- [ ] Domain DNS ayarları yapıldı
- [ ] İlk deploy başarılı
- [ ] SSL sertifikası aktif
- [ ] Tüm özellikler test edildi

---

**Başarılar! 🎉**

Herhangi bir sorunuz olursa, Coolify loglarını ve Supabase loglarını kontrol etmeyi unutmayın.
