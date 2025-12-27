import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Target, Shield, Palette, ArrowRight, Users } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const AboutPage = () => {
    const { t } = useTranslation();

    const values = [
        {
            icon: Zap,
            title: t('about.valueSpeed'),
            desc: t('about.valueSpeedDesc'),
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            icon: Shield,
            title: t('about.valueSecurity'),
            desc: t('about.valueSecurityDesc'),
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            icon: Palette,
            title: t('about.valueDesign'),
            desc: t('about.valueDesignDesc'),
            color: 'text-lime-500',
            bg: 'bg-lime-500/10'
        }
    ];

    const team = [
        { name: 'Alex Chen', role: 'CEO & Co-Founder', avatar: 'https://i.pravatar.cc/150?u=alex' },
        { name: 'Sarah Kim', role: 'CTO & Co-Founder', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { name: 'Marcus Rodriguez', role: 'Head of Design', avatar: 'https://i.pravatar.cc/150?u=marcus' },
        { name: 'Yuki Tanaka', role: 'Lead Engineer', avatar: 'https://i.pravatar.cc/150?u=yuki' }
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
                    <Badge variant="primary" className="mb-8">{t('about.title')}</Badge>
                    <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter font-heading text-white leading-none mb-12 uppercase italic">
                        {t('about.hero')}
                    </h1>
                </Motion.div>
            </section>

            {/* Mission Section */}
            <section className="relative z-10 px-6 md:px-16 py-32 md:py-48 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                    <Motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-20 h-20 rounded-[28px] bg-blue-500/10 flex items-center justify-center text-blue-500 mb-10 border border-white/5">
                            <Target size={36} />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-heading text-white mb-8 uppercase italic">{t('about.mission')}</h2>
                    </Motion.div>
                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-2xl text-gray-400 font-bold leading-relaxed">
                            {t('about.missionText')}
                        </p>
                    </Motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="relative z-10 px-6 md:px-16 py-32 md:py-48 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                        <Motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <p className="text-2xl text-gray-400 font-bold leading-relaxed">
                                {t('about.storyText')}
                            </p>
                        </Motion.div>
                        <Motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-heading text-white mb-8 uppercase italic">{t('about.story')}</h2>
                        </Motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="relative z-10 px-6 md:px-16 py-32 md:py-48 max-w-[1600px] mx-auto">
                <div className="mb-24 md:mb-40 text-center">
                    <h2 className="text-6xl md:text-[9rem] font-black tracking-tighter font-heading text-white leading-none uppercase italic mb-12">
                        {t('about.values')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                    {values.map((v, i) => (
                        <Motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="premium-card p-10 md:p-14 group border-white/5"
                        >
                            <div className={`w-20 h-20 rounded-[28px] ${v.bg} flex items-center justify-center ${v.color} mb-10 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                                <v.icon size={36} className="fill-current/10" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black font-heading mb-6 tracking-tighter text-white uppercase italic">{v.title}</h3>
                            <p className="text-xl text-gray-500 font-bold leading-relaxed">{v.desc}</p>
                        </Motion.div>
                    ))}
                </div>
            </section>

            {/* Team Section */}
            <section className="relative z-10 px-6 md:px-16 py-32 md:py-48 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-[1600px] mx-auto">
                    <div className="mb-24 md:mb-40 text-center">
                        <div className="w-20 h-20 rounded-[28px] bg-purple-500/10 flex items-center justify-center text-purple-500 mb-10 border border-white/5 mx-auto">
                            <Users size={36} />
                        </div>
                        <h2 className="text-6xl md:text-[9rem] font-black tracking-tighter font-heading text-white leading-none uppercase italic mb-12">
                            {t('about.team')}
                        </h2>
                        <p className="text-2xl text-gray-400 font-bold max-w-3xl mx-auto leading-relaxed">
                            {t('about.teamText')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {team.map((member, i) => (
                            <Motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-effect p-8 rounded-[40px] border-white/5 hover:border-blue-500/20 transition-all group text-center"
                            >
                                <div className="w-32 h-32 rounded-full border-4 border-white/10 p-1 mb-6 mx-auto group-hover:scale-105 transition-transform duration-500">
                                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                </div>
                                <h3 className="text-2xl font-black font-heading text-white mb-2 uppercase">{member.name}</h3>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{member.role}</p>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 md:px-16 py-32 md:py-48 max-w-[1600px] mx-auto text-center">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter font-heading text-white mb-12 uppercase italic">
                        {t('common.getStarted')}
                    </h2>
                    <Link to="/register">
                        <Button variant="primary" size="lg" className="px-12 py-6 text-xl" glow>
                            {t('common.getStarted')} <ArrowRight size={20} className="ml-3" />
                        </Button>
                    </Link>
                </Motion.div>
            </section>
        </div>
    );
};

export default AboutPage;
