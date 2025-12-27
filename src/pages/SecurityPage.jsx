import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Shield, Lock, Server, Eye, Database, Key } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const SecurityPage = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: Lock,
            title: t('security.encryption'),
            desc: t('security.encryptionDesc'),
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            icon: Shield,
            title: t('security.ddos'),
            desc: t('security.ddosDesc'),
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            icon: Server,
            title: t('security.compliance'),
            desc: t('security.complianceDesc'),
            color: 'text-lime-500',
            bg: 'bg-lime-500/10'
        },
        {
            icon: Eye,
            title: t('security.monitoring'),
            desc: t('security.monitoringDesc'),
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            icon: Database,
            title: t('security.backup'),
            desc: t('security.backupDesc'),
            color: 'text-pink-500',
            bg: 'bg-pink-500/10'
        },
        {
            icon: Key,
            title: t('security.access'),
            desc: t('security.accessDesc'),
            color: 'text-cyan-500',
            bg: 'bg-cyan-500/10'
        }
    ];

    return (
        <div className="min-h-screen bg-[#08090D] text-white">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[160px] rounded-full"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-8 md:px-16 py-10 max-w-[1600px] mx-auto">
                <Link to="/" className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-105 transition-all duration-500">
                        <Zap size={28} className="text-white fill-current" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter font-heading italic uppercase">LENK.TR</span>
                </Link>
                <Link to="/">
                    <Button variant="secondary" size="md">{t('common.back')}</Button>
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 md:px-16 pt-24 pb-32 md:pt-32 md:pb-48 max-w-[1600px] mx-auto text-center">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Badge variant="primary" className="mb-8">{t('security.title')}</Badge>
                    <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter font-heading text-white leading-none mb-12 uppercase italic">
                        {t('security.hero')}
                    </h1>
                    <p className="text-2xl text-gray-400 font-bold max-w-3xl mx-auto leading-relaxed">
                        {t('security.desc')}
                    </p>
                </Motion.div>
            </section>

            {/* Security Features */}
            <section className="relative z-10 px-6 md:px-16 py-32 md:py-48 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {features.map((f, i) => (
                        <Motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="premium-card p-10 md:p-12 group border-white/5"
                        >
                            <div className={`w-20 h-20 rounded-[28px] ${f.bg} flex items-center justify-center ${f.color} mb-10 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                                <f.icon size={36} />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black font-heading mb-6 tracking-tighter text-white uppercase italic">{f.title}</h3>
                            <p className="text-xl text-gray-500 font-bold leading-relaxed">{f.desc}</p>
                        </Motion.div>
                    ))}
                </div>
            </section>

            {/* Trust Badge */}
            <section className="relative z-10 px-6 md:px-16 py-32 md:py-48 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-[1200px] mx-auto text-center">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-24 h-24 rounded-[32px] bg-green-500/10 flex items-center justify-center text-green-500 mb-12 border border-green-500/20 mx-auto">
                            <Shield size={48} />
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter font-heading text-white mb-8 uppercase italic">
                            99.9% Uptime
                        </h2>
                        <p className="text-2xl text-gray-400 font-bold max-w-2xl mx-auto leading-relaxed">
                            Trusted by 50,000+ creators worldwide. Your links are in safe hands.
                        </p>
                    </Motion.div>
                </div>
            </section>
        </div>
    );
};

export default SecurityPage;
