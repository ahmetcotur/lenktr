import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    nav: {
                        features: 'Features',
                        pricing: 'Pricing',
                        ecosystem: 'Ecosystem',
                        company: 'Company',
                        signIn: 'Sign In',
                        getStarted: 'Get Started',
                        platform: 'Platform'
                    },
                    hero: {
                        badge: 'Version 2.4 Now Live',
                        title1: 'Smart Link',
                        title2: 'Management.',
                        desc: 'Fast, reliable, and beautiful link management for your brand. Sub-100ms load times. Professional analytics.',
                        ctaClaim: 'Get Started Free',
                        ctaDemo: 'How it Works'
                    },
                    showcase: {
                        badge: 'Design Ecosystem',
                        title1: 'Infinite',
                        title2: 'Identity Styles.',
                        desc: 'From minimalist glassmorphism to high-energy neon grids. Express your identity with 100+ customizable themes.'
                    },
                    features: {
                        badge: 'System Capabilities',
                        title: 'Total Control.',
                        custom: 'Infinite Design',
                        customDesc: 'Create unique designs that reflect your brand. Customize every pixel with colors, fonts, and glass effects.',
                        tools: 'Smart Link Tools',
                        toolsDesc: 'Manage your digital presence at full capacity with encrypted links, scheduled access, and custom slug support.',
                        tracking: 'Retargeting & Pixel',
                        trackingDesc: 'Understand your audience behavior with Facebook, TikTok, and Google pixels to multiply your ad efficiency.'
                    },
                    stats: {
                        s1l: 'Pixel Support',
                        s1v: 'FB, GGL, TT',
                        s2l: 'Custom Domain',
                        s2v: 'Your Brand',
                        s3l: 'SEO Optimized',
                        s3v: 'Google Ready',
                        s4l: 'Password Lock',
                        s4v: 'Secure Links'
                    },
                    footer: {
                        tagline: 'The ultimate link management platform for modern creators.',
                        platform: 'Platform',
                        ecosystem: 'Ecosystem',
                        company: 'Company'
                    },
                    about: {
                        title: 'About Us',
                        hero: 'Building the Future of Link Management',
                        mission: 'Our Mission',
                        missionText: 'We believe every creator deserves professional-grade tools to manage their digital presence. LENK.TR was built to empower individuals and brands with lightning-fast, secure, and beautiful link management.',
                        story: 'Our Story',
                        storyText: 'Founded in 2024, LENK.TR emerged from a simple frustration: existing link management tools were either too basic or too complex. We set out to create the perfect balance—powerful features wrapped in an intuitive, premium interface.',
                        values: 'Our Values',
                        valueSpeed: 'Speed First',
                        valueSpeedDesc: 'Every millisecond matters. We optimize relentlessly for performance.',
                        valueSecurity: 'Security Always',
                        valueSecurityDesc: 'Your data and your audience deserve enterprise-grade protection.',
                        valueDesign: 'Design Excellence',
                        valueDesignDesc: 'Beautiful interfaces aren\'t optional—they\'re essential.',
                        team: 'Our Team',
                        teamText: 'We\'re a distributed team of designers, engineers, and creators passionate about building tools that matter.'
                    },
                    contact: {
                        title: 'Contact Us',
                        hero: 'Get in Touch',
                        desc: 'Have questions? We\'re here to help. Reach out and we\'ll get back to you within 24 hours.',
                        form: {
                            name: 'Your Name',
                            email: 'Email Address',
                            subject: 'Subject',
                            message: 'Message',
                            send: 'Send Message',
                            sending: 'Sending...',
                            success: 'Message sent successfully!',
                            error: 'Failed to send message. Please try again.'
                        },
                        info: {
                            email: 'Email',
                            support: 'support@lenk.tr',
                            social: 'Follow Us',
                            hours: 'Support Hours',
                            hoursText: 'Monday - Friday, 9AM - 6PM (UTC+3)'
                        }
                    },
                    terms: {
                        title: 'Terms of Service',
                        updated: 'Last Updated',
                        intro: 'Welcome to LENK.TR. By using our service, you agree to these terms.',
                        acceptance: 'Acceptance of Terms',
                        acceptanceText: 'By accessing and using LENK.TR, you accept and agree to be bound by the terms and provision of this agreement.',
                        useOfService: 'Use of Service',
                        useOfServiceText: 'You agree to use LENK.TR only for lawful purposes and in accordance with these Terms of Service.',
                        userContent: 'User Content',
                        userContentText: 'You retain all rights to the content you create and share through LENK.TR. We do not claim ownership of your links or data.',
                        termination: 'Termination',
                        terminationText: 'We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any breach of these Terms.',
                        liability: 'Limitation of Liability',
                        liabilityText: 'LENK.TR shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.'
                    },
                    privacy: {
                        title: 'Privacy Policy',
                        updated: 'Last Updated',
                        intro: 'Your privacy is important to us. This policy explains how we collect, use, and protect your data.',
                        collection: 'Information We Collect',
                        collectionText: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.',
                        usage: 'How We Use Your Information',
                        usageText: 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect LENK.TR and our users.',
                        sharing: 'Information Sharing',
                        sharingText: 'We do not sell your personal information. We may share your information only with your consent or as necessary to provide our services.',
                        security: 'Data Security',
                        securityText: 'We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.',
                        rights: 'Your Rights',
                        rightsText: 'You have the right to access, update, or delete your personal information at any time through your account settings.'
                    },
                    security: {
                        title: 'Security',
                        hero: 'Enterprise-Grade Security',
                        desc: 'Your data and your audience deserve the highest level of protection.',
                        encryption: 'End-to-End Encryption',
                        encryptionDesc: 'All data is encrypted in transit and at rest using AES-256 encryption.',
                        ddos: 'DDoS Protection',
                        ddosDesc: 'Advanced protection against distributed denial-of-service attacks ensures 99.9% uptime.',
                        compliance: 'Compliance',
                        complianceDesc: 'GDPR and CCPA compliant. Regular third-party security audits.',
                        monitoring: '24/7 Monitoring',
                        monitoringDesc: 'Real-time threat detection and automated response systems.',
                        backup: 'Automated Backups',
                        backupDesc: 'Daily encrypted backups with point-in-time recovery.',
                        access: 'Access Control',
                        accessDesc: 'Multi-factor authentication and role-based access control.'
                    },
                    common: {
                        home: 'Home',
                        back: 'Back',
                        learnMore: 'Learn More',
                        readMore: 'Read More',
                        contactUs: 'Contact Us',
                        getStarted: 'Get Started',
                        copyright: '© 2025 LENK.TR. All rights reserved.'
                    }
                }
            },
            tr: {
                translation: {
                    nav: {
                        features: 'Özellikler',
                        pricing: 'Fiyatlandırma',
                        ecosystem: 'Ekosistem',
                        company: 'Kurumsal',
                        signIn: 'Giriş Yap',
                        getStarted: 'Başla',
                        platform: 'Platform'
                    },
                    hero: {
                        badge: 'Versiyon 2.4 Yayında',
                        title1: 'Akıllı Link',
                        title2: 'Yönetimi.',
                        desc: 'Markanız için hızlı, güvenilir ve güzel link yönetimi. 100ms altı yükleme süreleri. Profesyonel analizler.',
                        ctaClaim: 'Ücretsiz Başla',
                        ctaDemo: 'Nasıl Çalışır'
                    },
                    showcase: {
                        badge: 'Tasarım Ekosistemi',
                        title1: 'Sonsuz',
                        title2: 'Kimlik Stilleri.',
                        desc: 'Minimalist glassmorphism\'den yüksek enerjili neon ızgaralara. 100+ özelleştirilebilir tema ile kimliğinizi ifade edin.'
                    },
                    features: {
                        badge: 'Sistem Kabiliyetleri',
                        title: 'Kontrol Sende.',
                        custom: 'Sınırsız Tasarım',
                        customDesc: 'Markanızı yansıtan benzersiz tasarımlar oluşturun. Renkler, fontlar ve cam efektleriyle her pikseli özelleştirin.',
                        tools: 'Akıllı Link Araçları',
                        toolsDesc: 'Şifreli linkler, zamanlanmış erişim ve özel slug desteğiyle dijital varlığınızı tam kapasite yönetin.',
                        tracking: 'Takip & Piksel',
                        trackingDesc: 'Facebook, TikTok ve Google pikselleriyle kitlenizin davranışını anlayın ve reklam verimliliğinizi katlayın.'
                    },
                    stats: {
                        s1l: 'Piksel Desteği',
                        s1v: 'FB, GGL, TT',
                        s2l: 'Özel Alan Adı',
                        s2v: 'Kendi Linkin',
                        s3l: 'SEO Uyumlu',
                        s3v: 'Google Hazır',
                        s4l: 'Parola Kilidi',
                        s4v: 'Güvenli Paylaşım'
                    },
                    footer: {
                        tagline: 'Modern içerik üreticileri için nihai link yönetim platformu.',
                        platform: 'Platform',
                        ecosystem: 'Ekosistem',
                        company: 'Kurumsal'
                    },
                    about: {
                        title: 'Hakkımızda',
                        hero: 'Link Yönetiminin Geleceğini İnşa Ediyoruz',
                        mission: 'Misyonumuz',
                        missionText: 'Her içerik üreticisinin dijital varlığını yönetmek için profesyonel araçlara sahip olması gerektiğine inanıyoruz. LENK.TR, bireyleri ve markaları yıldırım hızında, güvenli ve güzel link yönetimi ile güçlendirmek için oluşturuldu.',
                        story: 'Hikayemiz',
                        storyText: '2024\'te kurulan LENK.TR, basit bir hayal kırıklığından doğdu: mevcut link yönetim araçları ya çok basit ya da çok karmaşıktı. Mükemmel dengeyi yaratmaya karar verdik—sezgisel, premium bir arayüze sarılmış güçlü özellikler.',
                        values: 'Değerlerimiz',
                        valueSpeed: 'Hız Öncelikli',
                        valueSpeedDesc: 'Her milisaniye önemlidir. Performans için acımasızca optimize ediyoruz.',
                        valueSecurity: 'Her Zaman Güvenlik',
                        valueSecurityDesc: 'Verileriniz ve kitleniz kurumsal düzeyde korumayı hak ediyor.',
                        valueDesign: 'Tasarım Mükemmelliği',
                        valueDesignDesc: 'Güzel arayüzler opsiyonel değil—zorunludur.',
                        team: 'Ekibimiz',
                        teamText: 'Önemli araçlar yaratma tutkusuyla dolu, dağıtık bir tasarımcı, mühendis ve içerik üreticisi ekibiyiz.'
                    },
                    contact: {
                        title: 'İletişim',
                        hero: 'Bize Ulaşın',
                        desc: 'Sorularınız mı var? Yardım için buradayız. Bize ulaşın, 24 saat içinde size geri döneceğiz.',
                        form: {
                            name: 'Adınız',
                            email: 'E-posta Adresi',
                            subject: 'Konu',
                            message: 'Mesaj',
                            send: 'Mesaj Gönder',
                            sending: 'Gönderiliyor...',
                            success: 'Mesaj başarıyla gönderildi!',
                            error: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'
                        },
                        info: {
                            email: 'E-posta',
                            support: 'destek@lenk.tr',
                            social: 'Bizi Takip Edin',
                            hours: 'Destek Saatleri',
                            hoursText: 'Pazartesi - Cuma, 09:00 - 18:00 (UTC+3)'
                        }
                    },
                    terms: {
                        title: 'Kullanım Koşulları',
                        updated: 'Son Güncelleme',
                        intro: 'LENK.TR\'ye hoş geldiniz. Hizmetimizi kullanarak bu şartları kabul etmiş olursunuz.',
                        acceptance: 'Şartların Kabulü',
                        acceptanceText: 'LENK.TR\'ye erişerek ve kullanarak, bu sözleşmenin şartlarını ve hükümlerini kabul etmiş olursunuz.',
                        useOfService: 'Hizmetin Kullanımı',
                        useOfServiceText: 'LENK.TR\'yi yalnızca yasal amaçlar için ve bu Kullanım Koşulları\'na uygun olarak kullanmayı kabul edersiniz.',
                        userContent: 'Kullanıcı İçeriği',
                        userContentText: 'LENK.TR aracılığıyla oluşturduğunuz ve paylaştığınız içeriğin tüm haklarını siz saklarsınız. Linklerinizin veya verilerinizin sahipliğini iddia etmiyoruz.',
                        termination: 'Fesih',
                        terminationText: 'Bu Şartların herhangi bir ihlali durumunda, önceden haber vermeksizin hizmetimize erişimi derhal sonlandırma veya askıya alma hakkını saklı tutarız.',
                        liability: 'Sorumluluk Sınırlaması',
                        liabilityText: 'LENK.TR, hizmeti kullanımınızdan kaynaklanan dolaylı, arızi, özel, sonuç olarak ortaya çıkan veya cezai zararlardan sorumlu tutulamaz.'
                    },
                    privacy: {
                        title: 'Gizlilik Politikası',
                        updated: 'Son Güncelleme',
                        intro: 'Gizliliğiniz bizim için önemlidir. Bu politika, verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.',
                        collection: 'Topladığımız Bilgiler',
                        collectionText: 'Hesap oluşturduğunuzda, hizmetlerimizi kullandığınızda veya destek için bizimle iletişime geçtiğinizde doğrudan bize sağladığınız bilgileri topluyoruz.',
                        usage: 'Bilgilerinizi Nasıl Kullanıyoruz',
                        usageText: 'Topladığımız bilgileri hizmetlerimizi sağlamak, sürdürmek ve geliştirmek, sizinle iletişim kurmak ve LENK.TR ile kullanıcılarımızı korumak için kullanıyoruz.',
                        sharing: 'Bilgi Paylaşımı',
                        sharingText: 'Kişisel bilgilerinizi satmıyoruz. Bilgilerinizi yalnızca izninizle veya hizmetlerimizi sağlamak için gerekli olduğunda paylaşabiliriz.',
                        security: 'Veri Güvenliği',
                        securityText: 'Verilerinizi korumak için şifreleme, güvenli sunucular ve düzenli güvenlik denetimleri dahil olmak üzere endüstri standardı güvenlik önlemleri uyguluyoruz.',
                        rights: 'Haklarınız',
                        rightsText: 'Hesap ayarlarınız aracılığıyla kişisel bilgilerinize istediğiniz zaman erişme, güncelleme veya silme hakkına sahipsiniz.'
                    },
                    security: {
                        title: 'Güvenlik',
                        hero: 'Kurumsal Düzeyde Güvenlik',
                        desc: 'Verileriniz ve kitleniz en yüksek düzeyde korumayı hak ediyor.',
                        encryption: 'Uçtan Uca Şifreleme',
                        encryptionDesc: 'Tüm veriler, AES-256 şifreleme kullanılarak aktarım sırasında ve beklemede şifrelenir.',
                        ddos: 'DDoS Koruması',
                        ddosDesc: 'Dağıtılmış hizmet reddi saldırılarına karşı gelişmiş koruma, %99,9 çalışma süresi sağlar.',
                        compliance: 'Uyumluluk',
                        complianceDesc: 'GDPR ve CCPA uyumlu. Düzenli üçüncü taraf güvenlik denetimleri.',
                        monitoring: '7/24 İzleme',
                        monitoringDesc: 'Gerçek zamanlı tehdit algılama ve otomatik yanıt sistemleri.',
                        backup: 'Otomatik Yedekleme',
                        backupDesc: 'Zaman içinde kurtarma ile günlük şifreli yedeklemeler.',
                        access: 'Erişim Kontrolü',
                        accessDesc: 'Çok faktörlü kimlik doğrulama ve rol tabanlı erişim kontrolü.'
                    },
                    common: {
                        home: 'Ana Sayfa',
                        back: 'Geri',
                        learnMore: 'Daha Fazla Bilgi',
                        readMore: 'Devamını Oku',
                        contactUs: 'Bize Ulaşın',
                        getStarted: 'Başla',
                        copyright: '© 2025 LENK.TR. Tüm hakları saklıdır.'
                    }
                }
            }
        }
    });

export default i18n;
