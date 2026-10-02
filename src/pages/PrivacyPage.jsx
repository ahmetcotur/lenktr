import React from 'react';
import SEO from "../components/SEO";
import { PublicNav, PublicFooter } from "../components/layout/PublicSite";
import { useTranslation } from 'react-i18next';
import { motion as Motion } from 'framer-motion';
import { Zap, Shield, Calendar } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const PrivacyPage = () => {
    const { t } = useTranslation();

    const sections = [
        { title: t('privacy.collection'), content: t('privacy.collectionText') },
        { title: t('privacy.usage'), content: t('privacy.usageText') },
        { title: t('privacy.sharing'), content: t('privacy.sharingText') },
        { title: t('privacy.security'), content: t('privacy.securityText') },
        { title: t('privacy.rights'), content: t('privacy.rightsText') }
    ];

    return (
        <div className="min-h-screen bg-[#08090D] text-white">
            <SEO title={`${t('privacy.title')} | LENK.TR`} description={t('privacy.intro')} url="/privacy" />
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[160px] rounded-full animate-pulse"></div>
            </div>

            <PublicNav />

            {/* Hero */}
            <section className="relative z-10 px-6 md:px-16 pt-12 pb-16 md:pt-20 md:pb-24 max-w-[1200px] mx-auto">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="w-20 h-20 rounded-[28px] bg-purple-500/10 flex items-center justify-center text-purple-500 mb-10 border border-white/5 mx-auto">
                        <Shield size={36} />
                    </div>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter font-heading text-white leading-none mb-12 uppercase italic">
                        {t('privacy.title')}
                    </h1>
                    <div className="flex items-center justify-center gap-3 text-gray-500">
                        <Calendar size={18} />
                        <span className="text-sm font-bold uppercase tracking-widest">{t('privacy.updated')}: December 26, 2025</span>
                    </div>
                </Motion.div>

                {/* Introduction */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-effect p-5 sm:p-7 md:p-9 rounded-2xl sm:rounded-3xl border-white/5 mb-16"
                >
                    <p className="text-lg sm:text-xl text-gray-300 font-medium leading-relaxed">
                        {t('privacy.intro')}
                    </p>
                </Motion.div>

                {/* Sections */}
                <div className="space-y-7 sm:space-y-9">
                    {sections.map((section, i) => (
                        <Motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-effect p-5 sm:p-7 md:p-9 rounded-2xl sm:rounded-3xl border-white/5"
                        >
                            <h2 className="text-4xl md:text-5xl font-black font-heading text-white mb-8 uppercase italic">
                                {section.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 font-medium leading-relaxed">
                                {section.content}
                            </p>
                        </Motion.div>
                    ))}
                </div>
            </section>
            <PublicFooter />
        </div>
    );
};

export default PrivacyPage;
