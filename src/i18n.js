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
                        howItWorks: 'How It Works',
                        themes: 'Themes',
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
                    howItWorks: {
                        badge: 'HOW IT WORKS',
                        title: 'Get Started in Minutes',
                        desc: 'Create your bio page, manage links, and track performance—all in one place.',
                        step1: {
                            title: 'Access Your Dashboard',
                            desc: 'Sign up and instantly access your personalized dashboard. View all your links, bio pages, and analytics in one clean interface.',
                            feature1: 'Quick overview of all your links',
                            feature2: 'Real-time click statistics',
                            feature3: 'Easy navigation to all features'
                        },
                        step2: {
                            title: 'Design Your Bio Page',
                            desc: 'Choose from stunning themes and customize every detail. Drag-and-drop your links, add social icons, and make it yours.',
                            feature1: '5+ premium themes to choose from',
                            feature2: 'Drag-and-drop link management',
                            feature3: 'Live preview as you edit'
                        },
                        step3: {
                            title: 'Track & Optimize',
                            desc: 'Monitor your link performance with detailed analytics. See what works and optimize your strategy.',
                            feature1: 'Real-time click tracking',
                            feature2: 'Custom short links with QR codes',
                            feature3: 'Detailed performance metrics'
                        },
                        cta: 'Start Building Now'
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
                    },
                    sidebar: {
                        tagline: 'SIMPLE LINK MANAGEMENT',
                        sectionTitle: 'DASHBOARD',
                        menu: {
                            overview: 'Overview',
                            myLinks: 'My Links',
                            bioPage: 'Bio Page',
                            analytics: 'Analytics',
                            settings: 'Settings'
                        },
                        systemStatus: {
                            title: 'System Status',
                            active: 'Active'
                        },
                        upgradePlan: 'Upgrade Plan',
                        userMenu: {
                            profileSettings: 'Profile Settings',
                            notifications: 'Notifications',
                            logout: 'Log Out',
                            defaultRole: 'Operator'
                        }
                    },
                    dashboard: {
                        title: 'Dashboard',
                        welcome: 'Welcome back! Here\'s your overview.',
                        loading: 'Loading Dashboard...',
                        stats: {
                            totalClicks: 'Total Clicks',
                            bioViews: 'Bio Page Views',
                            activeLinks: 'Active Links',
                            activeBioPages: 'Active Bio Pages',
                            live: 'Live'
                        },
                        recentLinks: {
                            title: 'Recent Links',
                            viewAll: 'View All',
                            noLinks: 'No links yet',
                            createLink: 'Create Link',
                            clicks: 'Clicks'
                        },
                        recentBioPages: {
                            title: 'Recent Bio Pages',
                            viewAll: 'View All',
                            noBioPages: 'No bio pages yet',
                            createBioPage: 'Create Bio Page',
                            views: 'Views',
                            untitled: 'Untitled'
                        },
                        quickActions: {
                            title: 'Ready to grow?',
                            description: 'Create new links or bio pages to expand your presence.',
                            newLink: 'New Link',
                            newBioPage: 'New Bio Page'
                        },
                        buttons: {
                            manageLinks: 'Manage Links',
                            bioPages: 'Bio Pages'
                        }
                    },
                    bioEditor: {
                        title: 'Design Editor',
                        subtitle: 'Customize your bio page',
                        loading: 'Loading...',
                        saving: 'Saving...',
                        sections: {
                            profile: 'Profile Details',
                            links: 'Links',
                            socials: 'Socials',
                            appearance: 'Appearance',
                            settings: 'Page Settings'
                        },
                        profile: {
                            displayName: 'Display Name',
                            slug: 'your-slug',
                            bio: 'Write a short bio...'
                        },
                        links: {
                            addNew: 'Add New',
                            title: 'Link Title',
                            url: 'https://example.com',
                            changeIcon: 'Change icon'
                        },
                        socials: {
                            twitter: 'Twitter',
                            instagram: 'Instagram',
                            facebook: 'Facebook',
                            linkedin: 'LinkedIn',
                            youtube: 'YouTube',
                            tiktok: 'TikTok',
                            github: 'GitHub',
                            discord: 'Discord',
                            website: 'Website',
                            email: 'Email',
                            telegram: 'Telegram',
                            urlPlaceholder: 'Your {{platform}} URL'
                        },
                        appearance: {
                            customGradient: 'Custom Gradient',
                            startColor: 'Start Color',
                            endColor: 'End Color',
                            fontFamily: 'Font Family',
                            systemFont: 'System Font',
                            buttonStyle: 'Button Style',
                            backgroundImage: 'Background Image',
                            imageAdjustments: 'Image Adjustments',
                            overlayOpacity: 'Overlay Opacity',
                            blurAmount: 'Blur Amount'
                        },
                        uiStyles: {
                            glass: 'Glass',
                            glassDesc: 'Glassmorphism',
                            neuro: 'Neuro',
                            neuroDesc: 'Neumorphism',
                            material: 'Material',
                            materialDesc: 'Material Design',
                            brutal: 'Brutal',
                            brutalDesc: 'Brutalist',
                            gradient: 'Gradient',
                            gradientDesc: 'Gradient Mesh',
                            neon: 'Neon',
                            neonDesc: 'Neon Glow',
                            minimal: 'Minimal',
                            minimalDesc: 'Minimalist',
                            retro: 'Retro',
                            retroDesc: 'Retro/Vintage'
                        },
                        settings: {
                            pro: 'PRO',
                            scheduleDate: 'Schedule Date',
                            expirationDate: 'Expiration Date',
                            trackingPixels: 'Tracking Pixels',
                            attachPixel: 'Attach Pixel',
                            cookieConsent: 'Cookie Consent',
                            adultWarning: 'Adult Warning',
                            verifiedIcon: 'Verified Icon',
                            shareButton: 'Share Button',
                            none: 'None'
                        },
                        buttons: {
                            save: 'Save Changes',
                            preview: 'Preview',
                            back: 'Back'
                        },
                        toast: {
                            slugRequired: 'Please enter a slug for your page',
                            updated: '✨ Bio page updated successfully!',
                            created: '🎉 Bio page created successfully!',
                            error: 'Error: {{message}}'
                        },
                        preview: {
                            adultWarning: {
                                title: 'Sensitive Content',
                                description: 'This page may contain content that is not suitable for all audiences.',
                                button: 'I am 18+'
                            },
                            cookieConsent: {
                                text: 'We use cookies to ensure you get the best experience on our website.',
                                button: 'Got it!'
                            }
                        }
                    },
                    links: {
                        title: 'Short Links',
                        subtitle: 'Manage your short links and track performance',
                        loading: 'Loading links...',
                        createNew: 'Create New Link',
                        search: 'Search links...',
                        filters: {
                            all: 'All Links',
                            active: 'Active',
                            archived: 'Archived'
                        },
                        table: {
                            title: 'Title',
                            shortUrl: 'Short URL',
                            destination: 'Destination',
                            clicks: 'Clicks',
                            created: 'Created',
                            actions: 'Actions'
                        },
                        actions: {
                            edit: 'Edit',
                            delete: 'Delete',
                            archive: 'Archive',
                            unarchive: 'Unarchive',
                            copy: 'Copy',
                            qr: 'QR Code'
                        },
                        form: {
                            title: 'Link Title',
                            titlePlaceholder: 'My Awesome Link',
                            destination: 'Destination URL',
                            destinationPlaceholder: 'https://example.com',
                            customSlug: 'Custom Slug (optional)',
                            slugPlaceholder: 'my-link',
                            password: 'Password Protection (optional)',
                            passwordPlaceholder: 'Enter password',
                            expirationDate: 'Expiration Date (optional)',
                            create: 'Create Link',
                            update: 'Update Link',
                            cancel: 'Cancel'
                        },
                        empty: {
                            title: 'No links yet',
                            description: 'Create your first short link to get started',
                            createButton: 'Create Your First Link'
                        },
                        toast: {
                            created: '✨ Link created successfully!',
                            updated: '✅ Link updated successfully!',
                            deleted: '🗑️ Link deleted successfully!',
                            archived: '📦 Link archived successfully!',
                            unarchived: '📤 Link restored successfully!',
                            copied: '📋 Link copied to clipboard!',
                            error: 'Error: {{message}}'
                        },
                        confirm: {
                            deleteTitle: 'Delete Link',
                            deleteMessage: 'Are you sure you want to delete this link? This action cannot be undone.',
                            delete: 'Delete',
                            cancel: 'Cancel'
                        }
                    },
                    bioPages: {
                        title: 'My Pages',
                        subtitle: 'Create and manage your personal landing pages.',
                        badge: 'Bio Pages',
                        createNew: 'Create New Page',
                        noPagesTitle: 'No bio pages found',
                        noPagesDesc: 'Create your first highly customizable bio landing page.',
                        createFirst: 'Create First Page',
                        loading: 'Accessing Database...',
                        editDesign: 'Edit Design',
                        copyUrl: 'Copy URL',
                        publish: 'Publish',
                        unpublish: 'Unpublish',
                        deletePage: 'Delete Page',
                        deleteConfirmTitle: 'Delete Bio Page?',
                        deleteConfirmMessage: 'Are you sure you want to delete this bio page? This action cannot be undone and all data will be permanently lost.',
                        deleteButton: 'Delete Page',
                        cancelButton: 'Cancel',
                        statusActive: 'Active',
                        statusDraft: 'Draft',
                        views: 'Views',
                        createPage: 'Create Page'
                    },
                    linksPage: {
                        title: 'My Links',
                        subtitle: 'Manage and track your shortened links in one place.',
                        badge: 'Link Manager',
                        createLink: 'Create Link',
                        globalFilter: 'Global Filter',
                        allLinks: 'All Links',
                        activeOnly: 'Active Only',
                        archivedOnly: 'Archived Only',
                        searchPlaceholder: 'Search by link name or URL...',
                        shareLinks: 'Share Links',
                        noLinksTitle: 'No links found',
                        noLinksDesc: 'Deploy your first shortened node to start tracking.',
                        createFirst: 'Create First Link',
                        loading: 'Accessing Database...',
                        editLink: 'Edit Link',
                        archive: 'Archive',
                        unarchive: 'Unarchive',
                        delete: 'Delete',
                        deleteConfirmTitle: 'Delete Link',
                        deleteConfirmMessage: 'Are you sure you want to delete "{title}"? This action cannot be undone.',
                        visitLink: 'Visit Link',
                        boost: 'Boost',
                        fullStats: 'Full Stats',
                        viewStats: 'View Stats',
                        statusActive: 'Active',
                        statusArchived: 'Archived',
                        tableHeaders: {
                            shortLink: 'Short Link / Destination',
                            analytics: 'Analytics',
                            created: 'Created',
                            status: 'Status'
                        }
                    },
                    analytics: {
                        title: 'Command Center',
                        subtitle: 'Real-time intelligence across all your digital touchpoints.',
                        badge: 'Live Data',
                        systemStatus: 'System Operational',
                        exportReport: 'Export Report',
                        last7Days: 'Last 7 Days',
                        loading: 'Synchronizing Analytics...',
                        kpis: {
                            totalViews: 'Total Views',
                            totalClicks: 'Total Clicks',
                            avgCtr: 'Avg. CTR',
                            avgTime: 'Avg. Time',
                            realtime: 'Realtime'
                        },
                        trafficVolume: 'Traffic Volume',
                        aggregatedData: 'Aggregated node data • 24h interval',
                        globalHits: 'Global Hits',
                        viewMap: 'View Map',
                        topPerforming: 'Top Performing',
                        noData: 'No data yet',
                        fullAnalytics: 'Full Analytics',
                        trafficSources: 'Traffic Sources',
                        devices: {
                            mobile: 'Mobile',
                            desktop: 'Desktop',
                            tablet: 'Tablet',
                            other: 'Other'
                        }
                    },
                    settings: {
                        title: 'Settings',
                        subtitle: 'Manage your account preferences and workspace settings.',
                        tabs: {
                            profile: 'Profile',
                            notifications: 'Notifications',
                            security: 'Security',
                            billing: 'Billing'
                        },
                        profile: {
                            title: 'Public Profile',
                            displayName: 'Display Name',
                            emailAddress: 'Email Address',
                            removePicture: 'Remove Picture',
                            saveChanges: 'Save Changes',
                            saving: 'Saving...',
                            uploadSuccess: 'Avatar uploaded successfully! Click Save Changes to update.',
                            uploadError: 'Failed to upload avatar. Please try again.',
                            updateSuccess: 'Profile updated successfully!'
                        },
                        notifications: {
                            title: 'Notification Preferences',
                            subtitle: 'Manage how you receive updates and alerts.',
                            email: 'Email Notifications',
                            emailDesc: 'Receive daily summaries and lead alerts.',
                            push: 'Push Notifications',
                            pushDesc: 'Real-time alerts for new clicks and activity.',
                            marketing: 'Marketing Updates',
                            marketingDesc: 'News about product features and tips.'
                        },
                        security: {
                            title: 'Security Settings',
                            password: 'Password',
                            passwordDesc: 'Last changed 3 months ago.',
                            updatePassword: 'Update Password',
                            currentPassword: 'Current Password',
                            twoFactor: 'Two-Factor Authentication',
                            twoFactorDesc: 'Add an extra layer of security to your account using an authenticator app.',
                            enable2FA: 'Enable 2FA',
                            disabled: 'Disabled'
                        },
                        billing: {
                            title: 'Billing & Plan',
                            currentPlan: 'Current Plan',
                            freeStarter: 'Free Starter',
                            active: 'Active',
                            clicksUsed: '{used} / {total} clicks used',
                            resetsIn: 'Resets in {days} days',
                            upgradeToPro: 'Upgrade to Pro',
                            manageSubscription: 'Manage Subscription',
                            paymentMethods: 'Payment Methods',
                            cardEnding: 'Mastercard ending in 4242',
                            expires: 'Expires 12/28',
                            edit: 'Edit'
                        }
                    },
                    upgrade: {
                        title: 'Unlock Your Full Potential',
                        subtitle: 'Upgrade to Pro to remove branding, use custom domains, and access powerful analytics.',
                        monthly: 'Monthly',
                        yearly: 'Yearly',
                        mostPopular: 'Most Popular',
                        bestValue: 'Best Value',
                        recommended: 'Recommended',
                        faqTitle: 'Frequently Asked Questions',
                        plans: {
                            free: {
                                name: 'Free Starter',
                                desc: 'Essential tools for individuals just starting out.',
                                cta: 'Current Plan'
                            },
                            pro: {
                                name: 'Pro',
                                desc: 'Unlock advanced customization and analytics.',
                                cta: 'Upgrade to Pro'
                            },
                            lifetime: {
                                name: 'Lifetime Deal',
                                desc: 'Pay once, own it forever. Best value for power users.',
                                cta: 'Get Lifetime Access',
                                oneTime: 'One-time'
                            }
                        },
                        features: {
                            bioLinks: 'Unlimited Bio Links',
                            basicAnalytics: 'Basic Analytics (7 days)',
                            templates: 'Standard Templates',
                            branding: 'lenk.tr Branding',
                            customDomain: 'Custom Domain',
                            pixels: 'Tracking Pixels',
                            schedule: 'Schedule & Expiration',
                            everything: 'Everything in Free',
                            noBranding: 'No Branding',
                            advancedAnalytics: 'Advanced Analytics (90 days)',
                            proTemplates: 'Pro Templates & Fonts',
                            customDomainSupport: 'Custom Domain Support',
                            pixelsFull: 'Tracking Pixels (FB, Google)',
                            verified: 'Verified Output',
                            everythingPro: 'Everything in Pro',
                            lifetimeAccess: 'Lifetime Access',
                            unlimitedDomains: 'Unlimited Custom Domains',
                            lifetimeAnalytics: 'Lifetime Analytics History',
                            prioritySupport: 'Priority Support (24/7)',
                            apiAccess: 'API Access',
                            futureUpdates: 'Future Pro Updates'
                        },
                        billing: {
                            perMonth: '/mo',
                            billedYearly: 'Billed ${amount} yearly',
                            discount: '-20%'
                        },
                        faq: {
                            q1: 'Can I cancel anytime?',
                            a1: 'Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period.',
                            q2: 'Can I use my own domain?',
                            a2: 'Yes! Pro and Agency plans support custom domains so you can use your own web address.',
                            q3: 'What payment methods do you accept?',
                            a3: 'We accept all major credit cards, PayPal, and Apple Pay.'
                        }
                    },
                    login: {
                        title: 'Welcome Back',
                        subtitle: 'Sign in to manage your links and bio pages.',
                        emailLabel: 'Email Address',
                        emailPlaceholder: 'alex@example.com',
                        passwordLabel: 'Password',
                        passwordPlaceholder: '••••••••',
                        forgotPassword: 'Forgot?',
                        signInButton: 'Sign In',
                        githubButton: 'Continue with GitHub',
                        or: 'OR',
                        noAccount: 'New to the network?',
                        registerLink: 'Open account'
                    },
                    register: {
                        title: 'Create Account',
                        subtitle: 'Start shortening links and build your bio page.',
                        firstNameLabel: 'First Name',
                        firstNamePlaceholder: 'Alex',
                        lastNameLabel: 'Last Name',
                        lastNamePlaceholder: 'Rivera',
                        emailLabel: 'Email Address',
                        emailPlaceholder: 'alex@example.com',
                        passwordLabel: 'Password',
                        passwordPlaceholder: '••••••••',
                        termsAgree: 'I agree to the Terms and Privacy Policy.',
                        terms: 'Terms',
                        privacy: 'Privacy Policy',
                        submitButton: 'Get Started',
                        or: 'OR',
                        hasAccount: 'Already have an account?',
                        loginLink: 'Sign In'
                    },
                    editLink: {
                        titleUpdate: 'Update node.',
                        titleShort: 'Short it.',
                        save: 'Save',
                        destinationUrl: 'Destination URL',
                        title: 'Title',
                        campaignPlaceholder: 'Campaign or Project Name',
                        customSlug: 'Custom Slug',
                        attachPixels: 'Attach pixels',
                        addPixel: 'ADD PIXEL',
                        utmParams: 'UTM Parameters',
                        addUtm: 'Add UTM',
                        socialPreview: 'Customize social preview',
                        socialPreviewDesc: 'Click on network to change the preview & titles of your link when shared on it, or use <1>default</1> to change it for all',
                        customRedirections: 'Custom redirections and deep links',
                        targetCountry: 'Target country',
                        targetOs: 'Target OS',
                        browser: 'Browser',
                        redirectionUrl: 'Redirection URL for this targets',
                        saveTarget: 'Save target',
                        noTargets: 'No targets yet',
                        cloakingTitle: 'Cloaking / Hide URL & show CTA banner',
                        enableCloaking: 'Enable cloaking/CTA',
                        showCta: 'Show CTA banner',
                        customizeCta: 'Customize CTA banner',
                        bannerLogo: 'Banner logo',
                        bannerText: 'Banner text to display',
                        bannerRedirection: 'Banner redirection url',
                        bannerBg: 'Banner Background color',
                        bannerTextColor: 'Banner text color',
                        bannerPosition: 'Banner position',
                        posBottomRight: 'Bottom right banner',
                        posTopHeader: 'Top Header',
                        posBottomLeft: 'Bottom Left pop',
                        schedulingDate: 'Scheduling date (UTC)',
                        expirationDate: 'Expiration date (UTC)',
                        passwordProtection: 'Password protection',
                        folder: 'Folder',
                        none: 'None',
                        selectFolder: 'Select Folder',
                        errorUrl: 'Please enter a destination URL',
                        errorSave: 'Error saving link: '
                    },
                    boost: {
                        backToLinks: 'Back to Links',
                        title: 'Boost Traffic',
                        promote: 'Promote',
                        promoteDesc: 'to reach more people.',
                        socialBlast: 'Social Blast',
                        socialBlastDesc: 'Share to our network of 50k+ users.',
                        once: '/once',
                        selectPlan: 'Select Plan',
                        recommended: 'Recommended',
                        influencerPush: 'Influencer Push',
                        influencerPushDesc: 'Get promoted by niche content creators.',
                        campaign: '/campaign',
                        startCampaign: 'Start Campaign',
                        globalTakeover: 'Global Takeover',
                        globalTakeoverDesc: 'Maximum visibility across all channels.',
                        month: '/month',
                        features: {
                            reach50k: '50k+ Reach',
                            featured24h: '24h Featured',
                            basicAnalytics: 'Basic Analytics',
                            reach150k: '150k+ Reach',
                            featured3d: '3 Days Featured',
                            advancedTargeting: 'Advanced Targeting',
                            contentCreation: 'Content Creation',
                            reach1M: '1M+ Reach',
                            permanentFeature: 'Permanent Feature',
                            dedicatedManager: 'Dedicated Manager',
                            prioritySupport: 'Priority Support'
                        }
                    },
                    statsOverlay: {
                        backToLinks: 'Back to Links',
                        title: 'Analytics',
                        detailedStats: 'Detailed stats for',
                        totalClicks: 'Total Clicks',
                        uniqueVisitors: 'Unique Visitors',
                        avgDuration: 'Avg. Duration',
                        bounceRate: 'Bounce Rate',
                        trafficOverview: 'Traffic Overview',
                        day: 'Day',
                        topReferrers: 'Top Referrers',
                        topLocations: 'Top Locations'
                    }
                }
            },
            tr: {
                translation: {
                    nav: {
                        features: 'Özellikler',
                        howItWorks: 'Nasıl Çalışır',
                        themes: 'Temalar',
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
                    howItWorks: {
                        badge: 'NASIL ÇALIŞIR',
                        title: 'Dakikalar İçinde Başlayın',
                        desc: 'Bio sayfanızı oluşturun, linkleri yönetin ve performansı takip edin—hepsi tek yerde.',
                        step1: {
                            title: 'Kontrol Panelinize Erişin',
                            desc: 'Kaydolun ve anında kişiselleştirilmiş kontrol panelinize erişin. Tüm linklerinizi, bio sayfalarınızı ve analizlerinizi tek bir temiz arayüzde görüntüleyin.',
                            feature1: 'Tüm linklerinizin hızlı özeti',
                            feature2: 'Gerçek zamanlı tıklama istatistikleri',
                            feature3: 'Tüm özelliklere kolay navigasyon'
                        },
                        step2: {
                            title: 'Bio Sayfanızı Tasarlayın',
                            desc: 'Muhteşem temalar arasından seçim yapın ve her detayı özelleştirin. Linklerinizi sürükle-bırak ile yönetin, sosyal ikonlar ekleyin ve kendinize ait kılın.',
                            feature1: 'Seçebileceğiniz 5+ premium tema',
                            feature2: 'Sürükle-bırak link yönetimi',
                            feature3: 'Düzenlerken canlı önizleme'
                        },
                        step3: {
                            title: 'Takip Edin & Optimize Edin',
                            desc: 'Link performansınızı detaylı analizlerle izleyin. Neyin işe yaradığını görün ve stratejinizi optimize edin.',
                            feature1: 'Gerçek zamanlı tıklama takibi',
                            feature2: 'QR kodlu özel kısa linkler',
                            feature3: 'Detaylı performans metrikleri'
                        },
                        cta: 'Hemen Başla'
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
                    },
                    sidebar: {
                        tagline: 'KOLAY LİNK YÖNETİMİ',
                        sectionTitle: 'KONTROL PANELİ',
                        menu: {
                            overview: 'Genel Bakış',
                            myLinks: 'Linklerim',
                            bioPage: 'Bio Sayfam',
                            analytics: 'Analitik',
                            settings: 'Ayarlar'
                        },
                        systemStatus: {
                            title: 'Sistem Durumu',
                            active: 'Aktif'
                        },
                        upgradePlan: 'Planı Yükselt',
                        userMenu: {
                            profileSettings: 'Profil Ayarları',
                            notifications: 'Bildirimler',
                            logout: 'Çıkış Yap',
                            defaultRole: 'Operatör'
                        }
                    },
                    dashboard: {
                        title: 'Kontrol Paneli',
                        welcome: 'Tekrar hoş geldiniz! İşte özetiniz.',
                        loading: 'Kontrol Paneli Yükleniyor...',
                        stats: {
                            totalClicks: 'Toplam Tıklama',
                            bioViews: 'Bio Sayfa Görüntüleme',
                            activeLinks: 'Aktif Linkler',
                            activeBioPages: 'Aktif Bio Sayfalar',
                            live: 'Canlı'
                        },
                        recentLinks: {
                            title: 'Son Linkler',
                            viewAll: 'Tümünü Gör',
                            noLinks: 'Henüz link yok',
                            createLink: 'Link Oluştur',
                            clicks: 'Tıklama'
                        },
                        recentBioPages: {
                            title: 'Son Bio Sayfalar',
                            viewAll: 'Tümünü Gör',
                            noBioPages: 'Henüz bio sayfası yok',
                            createBioPage: 'Bio Sayfası Oluştur',
                            views: 'Görüntüleme',
                            untitled: 'İsimsiz'
                        },
                        quickActions: {
                            title: 'Büyümeye hazır mısınız?',
                            description: 'Varlığınızı genişletmek için yeni linkler veya bio sayfaları oluşturun.',
                            newLink: 'Yeni Link',
                            newBioPage: 'Yeni Bio Sayfası'
                        },
                        buttons: {
                            manageLinks: 'Linkleri Yönet',
                            bioPages: 'Bio Sayfalar'
                        }
                    },
                    bioEditor: {
                        title: 'Tasarım Editörü',
                        subtitle: 'Bio sayfanızı özelleştirin',
                        loading: 'Yükleniyor...',
                        saving: 'Kaydediliyor...',
                        sections: {
                            profile: 'Profil Detayları',
                            links: 'Linkler',
                            socials: 'Sosyal Medya',
                            appearance: 'Görünüm',
                            settings: 'Sayfa Ayarları'
                        },
                        profile: {
                            displayName: 'Görünen İsim',
                            slug: 'sizin-linkiniz',
                            bio: 'Kısa bir bio yazın...'
                        },
                        links: {
                            addNew: 'Yeni Ekle',
                            title: 'Link Başlığı',
                            url: 'https://ornek.com',
                            changeIcon: 'İkonu değiştir'
                        },
                        socials: {
                            twitter: 'Twitter',
                            instagram: 'Instagram',
                            facebook: 'Facebook',
                            linkedin: 'LinkedIn',
                            youtube: 'YouTube',
                            tiktok: 'TikTok',
                            github: 'GitHub',
                            discord: 'Discord',
                            website: 'Website',
                            email: 'E-posta',
                            telegram: 'Telegram',
                            urlPlaceholder: '{{platform}} URL\'niz'
                        },
                        appearance: {
                            customGradient: 'Özel Gradyan',
                            startColor: 'Başlangıç Rengi',
                            endColor: 'Bitiş Rengi',
                            fontFamily: 'Yazı Tipi',
                            systemFont: 'Sistem Yazı Tipi',
                            buttonStyle: 'Buton Stili',
                            backgroundImage: 'Arka Plan Görseli',
                            imageAdjustments: 'Görsel Ayarları',
                            overlayOpacity: 'Kaplama Opaklığı',
                            blurAmount: 'Bulanıklık Miktarı'
                        },
                        uiStyles: {
                            glass: 'Cam',
                            glassDesc: 'Glassmorphism',
                            neuro: 'Neuro',
                            neuroDesc: 'Neumorphism',
                            material: 'Material',
                            materialDesc: 'Material Design',
                            brutal: 'Brutal',
                            brutalDesc: 'Brutalist',
                            gradient: 'Gradyan',
                            gradientDesc: 'Gradyan Mesh',
                            neon: 'Neon',
                            neonDesc: 'Neon Işıltı',
                            minimal: 'Minimal',
                            minimalDesc: 'Minimalist',
                            retro: 'Retro',
                            retroDesc: 'Retro/Vintage'
                        },
                        settings: {
                            pro: 'PRO',
                            scheduleDate: 'Zamanlama Tarihi',
                            expirationDate: 'Son Kullanma Tarihi',
                            trackingPixels: 'Takip Pikselleri',
                            attachPixel: 'Piksel Ekle',
                            cookieConsent: 'Çerez Onayı',
                            adultWarning: 'Yetişkin Uyarısı',
                            verifiedIcon: 'Doğrulanmış İkon',
                            shareButton: 'Paylaş Butonu',
                            none: 'Yok'
                        },
                        buttons: {
                            save: 'Değişiklikleri Kaydet',
                            preview: 'Önizle',
                            back: 'Geri'
                        },
                        toast: {
                            slugRequired: 'Lütfen sayfanız için bir slug girin',
                            updated: '✨ Bio sayfası başarıyla güncellendi!',
                            created: '🎉 Bio sayfası başarıyla oluşturuldu!',
                            error: 'Hata: {{message}}'
                        },
                        preview: {
                            adultWarning: {
                                title: 'Hassas İçerik',
                                description: 'Bu sayfa tüm kitleler için uygun olmayabilecek içerik barındırabilir.',
                                button: '18 yaşındayım'
                            },
                            cookieConsent: {
                                text: 'Size en iyi deneyimi sunmak için çerezler kullanıyoruz.',
                                button: 'Anladım!'
                            }
                        }
                    },
                    links: {
                        title: 'Kısa Linkler',
                        subtitle: 'Kısa linklerinizi yönetin ve performansı takip edin',
                        loading: 'Linkler yükleniyor...',
                        createNew: 'Yeni Link Oluştur',
                        search: 'Link ara...',
                        filters: {
                            all: 'Tüm Linkler',
                            active: 'Aktif',
                            archived: 'Arşivlenmiş'
                        },
                        table: {
                            title: 'Başlık',
                            shortUrl: 'Kısa URL',
                            destination: 'Hedef',
                            clicks: 'Tıklama',
                            created: 'Oluşturulma',
                            actions: 'İşlemler'
                        },
                        actions: {
                            edit: 'Düzenle',
                            delete: 'Sil',
                            archive: 'Arşivle',
                            unarchive: 'Arşivden Çıkar',
                            copy: 'Kopyala',
                            qr: 'QR Kod'
                        },
                        form: {
                            title: 'Link Başlığı',
                            titlePlaceholder: 'Harika Linkim',
                            destination: 'Hedef URL',
                            destinationPlaceholder: 'https://ornek.com',
                            customSlug: 'Özel Slug (opsiyonel)',
                            slugPlaceholder: 'benim-linkim',
                            password: 'Şifre Koruması (opsiyonel)',
                            passwordPlaceholder: 'Şifre girin',
                            expirationDate: 'Son Kullanma Tarihi (opsiyonel)',
                            create: 'Link Oluştur',
                            update: 'Linki Güncelle',
                            cancel: 'İptal'
                        },
                        empty: {
                            title: 'Henüz link yok',
                            description: 'Başlamak için ilk kısa linkinizi oluşturun',
                            createButton: 'İlk Linkinizi Oluşturun'
                        },
                        toast: {
                            created: '✨ Link başarıyla oluşturuldu!',
                            updated: '✅ Link başarıyla güncellendi!',
                            deleted: '🗑️ Link başarıyla silindi!',
                            archived: '📦 Link başarıyla arşivlendi!',
                            unarchived: '📤 Link başarıyla geri yüklendi!',
                            copied: '📋 Link panoya kopyalandı!',
                            error: 'Hata: {{message}}'
                        },
                        confirm: {
                            deleteTitle: 'Linki Sil',
                            deleteMessage: 'Bu linki silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
                            delete: 'Sil',
                            cancel: 'İptal'
                        }
                    },
                    bioPages: {
                        title: 'Sayfalarım',
                        subtitle: 'Kişisel açılış sayfalarınızı oluşturun ve yönetin.',
                        badge: 'Bio Sayfaları',
                        createNew: 'Yeni Sayfa Oluştur',
                        noPagesTitle: 'Bio sayfası bulunamadı',
                        noPagesDesc: 'İlk özelleştirilebilir bio açılış sayfanızı oluşturun.',
                        createFirst: 'İlk Sayfayı Oluştur',
                        loading: 'Veritabanına Erişiliyor...',
                        editDesign: 'Tasarımı Düzenle',
                        copyUrl: 'URL Kopyala',
                        publish: 'Yayınla',
                        unpublish: 'Yayından Kaldır',
                        deletePage: 'Sayfayı Sil',
                        deleteConfirmTitle: 'Bio Sayfası Silinsin mi?',
                        deleteConfirmMessage: 'Bu bio sayfasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm veriler kalıcı olarak kaybolacaktır.',
                        deleteButton: 'Sayfayı Sil',
                        cancelButton: 'İptal',
                        statusActive: 'Aktif',
                        statusDraft: 'Taslak',
                        views: 'Görüntüleme',
                        createPage: 'Sayfa Oluştur'
                    },
                    linksPage: {
                        title: 'Linklerim',
                        subtitle: 'Kısaltılmış linklerinizi tek yerden yönetin ve takip edin.',
                        badge: 'Link Yöneticisi',
                        createLink: 'Link Oluştur',
                        globalFilter: 'Genel Filtre',
                        allLinks: 'Tüm Linkler',
                        activeOnly: 'Sadece Aktif',
                        archivedOnly: 'Sadece Arşivlenmiş',
                        searchPlaceholder: 'Link adı veya URL ile ara...',
                        shareLinks: 'Linkleri Paylaş',
                        noLinksTitle: 'Link bulunamadı',
                        noLinksDesc: 'Takibe başlamak için ilk kısaltılmış linkinizi oluşturun.',
                        createFirst: 'İlk Linki Oluştur',
                        loading: 'Veritabanına Erişiliyor...',
                        editLink: 'Linki Düzenle',
                        archive: 'Arşivle',
                        unarchive: 'Arşivden Çıkar',
                        delete: 'Sil',
                        deleteConfirmTitle: 'Link Sil',
                        deleteConfirmMessage: '"{title}" linkini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
                        visitLink: 'Linki Ziyaret Et',
                        boost: 'Güçlendir',
                        fullStats: 'Tüm İstatistikler',
                        viewStats: 'İstatistikleri Gör',
                        statusActive: 'Aktif',
                        statusArchived: 'Arşivlenmiş',
                        tableHeaders: {
                            shortLink: 'Kısa Link / Hedef',
                            analytics: 'Analitik',
                            created: 'Oluşturulma',
                            status: 'Durum'
                        }
                    },
                    analytics: {
                        title: 'Komuta Merkezi',
                        subtitle: 'Tüm dijital temas noktalarınızda gerçek zamanlı istihbarat.',
                        badge: 'Canlı Veri',
                        systemStatus: 'Sistem Çalışıyor',
                        exportReport: 'Rapor Dışa Aktar',
                        last7Days: 'Son 7 Gün',
                        loading: 'Analitikler Senkronize Ediliyor...',
                        kpis: {
                            totalViews: 'Toplam Görüntüleme',
                            totalClicks: 'Toplam Tıklama',
                            avgCtr: 'Ort. TKO',
                            avgTime: 'Ort. Süre',
                            realtime: 'Gerçek Zamanlı'
                        },
                        trafficVolume: 'Trafik Hacmi',
                        aggregatedData: 'Toplu düğüm verisi • 24s aralık',
                        globalHits: 'Küresel Erişimler',
                        viewMap: 'Haritayı Gör',
                        topPerforming: 'En İyi Performans',
                        noData: 'Henüz veri yok',
                        fullAnalytics: 'Tam Analitik',
                        trafficSources: 'Trafik Kaynakları',
                        devices: {
                            mobile: 'Mobil',
                            desktop: 'Masaüstü',
                            tablet: 'Tablet',
                            other: 'Diğer'
                        }
                    },
                    settings: {
                        title: 'Ayarlar',
                        subtitle: 'Hesap tercihlerinizi ve çalışma alanı ayarlarınızı yönetin.',
                        tabs: {
                            profile: 'Profil',
                            notifications: 'Bildirimler',
                            security: 'Güvenlik',
                            billing: 'Faturalama'
                        },
                        profile: {
                            title: 'Genel Profil',
                            displayName: 'Görünen Ad',
                            emailAddress: 'E-posta Adresi',
                            removePicture: 'Resmi Kaldır',
                            saveChanges: 'Değişiklikleri Kaydet',
                            saving: 'Kaydediliyor...',
                            uploadSuccess: 'Avatar başarıyla yüklendi! Güncellemek için Değişiklikleri Kaydet\'e tıklayın.',
                            uploadError: 'Avatar yüklenemedi. Lütfen tekrar deneyin.',
                            updateSuccess: 'Profil başarıyla güncellendi!'
                        },
                        notifications: {
                            title: 'Bildirim Tercihleri',
                            subtitle: 'Güncellemeleri ve uyarıları nasıl alacağınızı yönetin.',
                            email: 'E-posta Bildirimleri',
                            emailDesc: 'Günlük özetler ve potansiyel müşteri uyarıları alın.',
                            push: 'Anlık Bildirimler',
                            pushDesc: 'Yeni tıklamalar ve aktivite için gerçek zamanlı uyarılar.',
                            marketing: 'Pazarlama Güncellemeleri',
                            marketingDesc: 'Ürün özellikleri ve ipuçları hakkında haberler.'
                        },
                        security: {
                            title: 'Güvenlik Ayarları',
                            password: 'Şifre',
                            passwordDesc: 'Son değişiklik 3 ay önce.',
                            updatePassword: 'Şifreyi Güncelle',
                            currentPassword: 'Mevcut Şifre',
                            twoFactor: 'İki Faktörlü Kimlik Doğrulama',
                            twoFactorDesc: 'Kimlik doğrulama uygulaması kullanarak hesabınıza ekstra bir güvenlik katmanı ekleyin.',
                            enable2FA: '2FA\'yı Etkinleştir',
                            disabled: 'Devre Dışı'
                        },
                        billing: {
                            title: 'Faturalama ve Plan',
                            currentPlan: 'Mevcut Plan',
                            freeStarter: 'Ücretsiz Başlangıç',
                            active: 'Aktif',
                            clicksUsed: '{used} / {total} tıklama kullanıldı',
                            resetsIn: '{days} gün içinde sıfırlanır',
                            upgradeToPro: 'Pro\'ya Yükselt',
                            manageSubscription: 'Aboneliği Yönet',
                            paymentMethods: 'Ödeme Yöntemleri',
                            cardEnding: '4242 ile biten Mastercard',
                            expires: 'Son kullanma 12/28',
                            edit: 'Düzenle'
                        }
                    },
                    upgrade: {
                        title: 'Tam Potansiyelinizi Açığa Çıkarın',
                        subtitle: 'Markayı kaldırmak, özel alan adları kullanmak ve güçlü analitiğe erişmek için Pro\'ya yükseltin.',
                        monthly: 'Aylık',
                        yearly: 'Yıllık',
                        mostPopular: 'En Popüler',
                        bestValue: 'En İyi Değer',
                        recommended: 'Önerilen',
                        faqTitle: 'Sıkça Sorulan Sorular',
                        plans: {
                            free: {
                                name: 'Ücretsiz Başlangıç',
                                desc: 'Yeni başlayanlar için temel araçlar.',
                                cta: 'Mevcut Plan'
                            },
                            pro: {
                                name: 'Pro',
                                desc: 'Gelişmiş özelleştirme ve analitiğin kilidini açın.',
                                cta: 'Pro\'ya Yükselt'
                            },
                            lifetime: {
                                name: 'Ömür Boyu Anlaşma',
                                desc: 'Bir kez öde, sonsuza kadar sahip ol. Profesyoneller için en iyi değer.',
                                cta: 'Ömür Boyu Erişim Al',
                                oneTime: 'Tek seferlik'
                            }
                        },
                        features: {
                            bioLinks: 'Sınırsız Bio Linkleri',
                            basicAnalytics: 'Temel Analitik (7 gün)',
                            templates: 'Standart Şablonlar',
                            branding: 'lenk.tr Markası',
                            customDomain: 'Özel Alan Adı',
                            pixels: 'Takip Pikselleri',
                            schedule: 'Zamanlama ve Son Kullanma',
                            everything: 'Ücretsiz\'deki Her Şey',
                            noBranding: 'Marka Yok',
                            advancedAnalytics: 'Gelişmiş Analitik (90 gün)',
                            proTemplates: 'Pro Şablonlar ve Yazı Tipleri',
                            customDomainSupport: 'Özel Alan Adı Desteği',
                            pixelsFull: 'Takip Pikselleri (FB, Google)',
                            verified: 'Doğrulanmış Çıktı',
                            everythingPro: 'Pro\'daki Her Şey',
                            lifetimeAccess: 'Ömür Boyu Erişim',
                            unlimitedDomains: 'Sınırsız Özel Alan Adları',
                            lifetimeAnalytics: 'Ömür Boyu Analitik Geçmişi',
                            prioritySupport: 'Öncelikli Destek (7/24)',
                            apiAccess: 'API Erişimi',
                            futureUpdates: 'Gelecek Pro Güncellemeleri'
                        },
                        billing: {
                            perMonth: '/ay',
                            billedYearly: 'Yıllık ${amount} faturalandırılır',
                            discount: '-20%'
                        },
                        faq: {
                            q1: 'İstediğim zaman iptal edebilir miyim?',
                            a1: 'Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Planınız fatura döneminin sonuna kadar aktif kalacaktır.',
                            q2: 'Kendi alan adımı kullanabilir miyim?',
                            a2: 'Evet! Pro ve Ajans planları özel alan adlarını destekler, böylece kendi web adresinizi kullanabilirsiniz.',
                            q3: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
                            a3: 'Tüm büyük kredi kartlarını, PayPal ve Apple Pay\'i kabul ediyoruz.'
                        }
                    },
                    login: {
                        title: 'Tekrar Hoş Geldiniz',
                        subtitle: 'Linklerinizi ve bio sayfalarınızı yönetmek için giriş yapın.',
                        emailLabel: 'E-posta Adresi',
                        emailPlaceholder: 'alex@example.com',
                        passwordLabel: 'Şifre',
                        passwordPlaceholder: '••••••••',
                        forgotPassword: 'Unuttum?',
                        signInButton: 'Giriş Yap',
                        githubButton: 'GitHub ile Devam Et',
                        or: 'VEYA',
                        noAccount: 'Ağda yeni misiniz?',
                        registerLink: 'Hesap Aç'
                    },
                    register: {
                        title: 'Hesap Oluştur',
                        subtitle: 'Link kısaltmaya başlayın ve bio sayfanızı oluşturun.',
                        firstNameLabel: 'Ad',
                        firstNamePlaceholder: 'Ahmet',
                        lastNameLabel: 'Soyad',
                        lastNamePlaceholder: 'Yılmaz',
                        emailLabel: 'E-posta Adresi',
                        emailPlaceholder: 'ahmet@example.com',
                        passwordLabel: 'Şifre',
                        passwordPlaceholder: '••••••••',
                        termsAgree: 'Şartları ve Gizlilik Politikasını kabul ediyorum.',
                        terms: 'Şartlar',
                        privacy: 'Gizlilik Politikası',
                        submitButton: 'Başlayın',
                        or: 'VEYA',
                        hasAccount: 'Zaten hesabınız var mı?',
                        loginLink: 'Giriş Yap'
                    },
                    editLink: {
                        titleUpdate: 'Düğümü Güncelle.',
                        titleShort: 'Kısalt.',
                        save: 'Kaydet',
                        destinationUrl: 'Hedef URL',
                        title: 'Başlık',
                        campaignPlaceholder: 'Kampanya veya Proje Adı',
                        customSlug: 'Özel Slug',
                        attachPixels: 'Piksel Ekle',
                        addPixel: 'PİKSEL EKLE',
                        utmParams: 'UTM Parametreleri',
                        addUtm: 'UTM Ekle',
                        socialPreview: 'Sosyal önizlemeyi özelleştir',
                        socialPreviewDesc: 'Paylaşıldığında bağlantınızın önizlemesini ve başlıklarını değiştirmek için ağa tıklayın veya hepsini değiştirmek için varsayılanı kullanın',
                        customRedirections: 'Özel yönlendirmeler ve derin bağlantılar',
                        targetCountry: 'Hedef ülke',
                        targetOs: 'Hedef İşletim Sistemi',
                        browser: 'Tarayıcı',
                        redirectionUrl: 'Bu hedefler için yönlendirme URL\'si',
                        saveTarget: 'Hedefi kaydet',
                        noTargets: 'Henüz hedef yok',
                        cloakingTitle: 'Gizleme / URL\'yi gizle ve CTA başlığını göster',
                        enableCloaking: 'Gizlemeyi/CTA\'yı etkinleştir',
                        showCta: 'CTA başlığını göster',
                        customizeCta: 'CTA başlığını özelleştir',
                        bannerLogo: 'Logoyu değiştir',
                        bannerText: 'Görüntülenecek başlık metni',
                        bannerRedirection: 'Başlık yönlendirme URL\'si',
                        bannerBg: 'Başlık Arka plan rengi',
                        bannerTextColor: 'Başlık metni rengi',
                        bannerPosition: 'Başlık konumu',
                        posBottomRight: 'Sağ alt başlık',
                        posTopHeader: 'Üst Başlık',
                        posBottomLeft: 'Sol alt pop',
                        schedulingDate: 'Planlama tarihi (UTC)',
                        expirationDate: 'Son kullanma tarihi (UTC)',
                        passwordProtection: 'Şifre koruması',
                        folder: 'Klasör',
                        none: 'Yok',
                        selectFolder: 'Klasör Seç',
                        errorUrl: 'Lütfen bir hedef URL girin',
                        errorSave: 'Bağlantı kaydedilirken hata oluştu: '
                    },
                    boost: {
                        backToLinks: 'Bağlantılara Dön',
                        title: 'Trafiği Artır',
                        promote: 'Tanıt',
                        promoteDesc: 'daha fazla kişiye ulaşmak için.',
                        socialBlast: 'Sosyal Patlama',
                        socialBlastDesc: '50.000\'den fazla kullanıcı ağımızda paylaşın.',
                        once: '/tek seferlik',
                        selectPlan: 'Plan Seç',
                        recommended: 'Önerilen',
                        influencerPush: 'Influencer Desteği',
                        influencerPushDesc: 'Niş içerik oluşturucuları tarafından tanıtılın.',
                        campaign: '/kampanya',
                        startCampaign: 'Kampanyayı Başlat',
                        globalTakeover: 'Küresel Hakimiyet',
                        globalTakeoverDesc: 'Tüm kanallarda maksimum görünürlük.',
                        month: '/ay',
                        features: {
                            reach50k: '50B+ Erişim',
                            featured24h: '24s Öne Çıkan',
                            basicAnalytics: 'Temel Analitik',
                            reach150k: '150B+ Erişim',
                            featured3d: '3 Gün Öne Çıkan',
                            advancedTargeting: 'Gelişmiş Hedefleme',
                            contentCreation: 'İçerik Oluşturma',
                            reach1M: '1M+ Erişim',
                            permanentFeature: 'Kalıcı Özellik',
                            dedicatedManager: 'Özel Temsilci',
                            prioritySupport: 'Öncelikli Destek'
                        }
                    },
                    statsOverlay: {
                        backToLinks: 'Bağlantılara Dön',
                        title: 'Analitik',
                        detailedStats: 'Şunun için detaylı istatistikler:',
                        totalClicks: 'Toplam Tıklama',
                        uniqueVisitors: 'Tekil Ziyaretçiler',
                        avgDuration: 'Ort. Süre',
                        bounceRate: 'Hemen Çıkma Oranı',
                        trafficOverview: 'Trafik Özeti',
                        day: 'Gün',
                        topReferrers: 'En İyi Yönlendirenler',
                        topLocations: 'En İyi Konumlar'
                    }
                }
            }
        }
    });

export default i18n;
