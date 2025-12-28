import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3, Globe, ChevronRight, Play, Star, Plus, Check, Palette, Settings, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    return (
        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/5">
            {['en', 'tr'].map((lang) => (
                <button
                    key={lang}
                    onClick={() => i18n.changeLanguage(lang)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${i18n.language === lang
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-gray-500 hover:text-white'
                        }`}
                >
                    {lang}
                </button>
            ))}
        </div>
    );
};

const LandingPage = () => {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'center', skipSnaps: false },
        [Autoplay({ delay: 3000, stopOnInteraction: false })]
    );
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi, onSelect]);

    const features = [
        {
            icon: Palette,
            title: t('features.custom'),
            desc: t('features.customDesc'),
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Settings,
            title: t('features.tools'),
            desc: t('features.toolsDesc'),
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            icon: Activity,
            title: t('features.tracking'),
            desc: t('features.trackingDesc'),
            color: "text-lime-500",
            bg: "bg-lime-500/10"
        },
    ];

    const stats = [
        { label: t('stats.s1l'), val: t('stats.s1v') },
        { label: t('stats.s2l'), val: t('stats.s2v') },
        { label: t('stats.s3l'), val: t('stats.s3v') },
        { label: t('stats.s4l'), val: t('stats.s4v') },
    ];

    const demos = [
        {
            id: 'glass',
            title: 'Glass',
            subtitle: 'Glassmorphism',
            accent: 'blue',
            color: 'from-blue-600 to-indigo-600',
            textColor: 'text-blue-400',
            description: 'Premium glassmorphism effect.',
            theme: {
                font: 'font-sans',
                buttonStyle: 'backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]',
                layout: 'stacked'
            },
            preview: {
                name: 'Elena Vance',
                bio: 'Product Designer',
                avatar: 'https://i.pravatar.cc/150?u=elena',
                links: [
                    { label: 'View Portfolio', url: 'https://behance.net' },
                    { label: 'Read My Blog', url: 'https://medium.com' },
                    { label: 'LinkedIn Profile', url: 'https://linkedin.com' }
                ]
            }
        },
        {
            id: 'neon',
            title: 'Neon',
            subtitle: 'Neon Glow',
            accent: 'cyan',
            color: 'from-cyan-400 to-blue-600',
            textColor: 'text-cyan-400',
            description: 'Cyberpunk neon aesthetic.',
            theme: {
                font: 'font-mono',
                buttonStyle: 'bg-black/80 border border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:bg-cyan-950/30 hover:scale-[1.02]',
                layout: 'stacked'
            },
            preview: {
                name: 'KAI_ZEN',
                bio: 'Streaming daily',
                avatar: 'https://i.pravatar.cc/150?u=kai',
                links: [
                    { label: 'Watch Live', url: 'https://twitch.tv' },
                    { label: 'Discord Server', url: 'https://discord.com' },
                    { label: 'Highlights', url: 'https://youtube.com' }
                ]
            }
        },
        {
            id: 'minimal',
            title: 'Minimal',
            subtitle: 'Minimalist',
            accent: 'zinc',
            color: 'from-zinc-100 to-zinc-400',
            textColor: 'text-zinc-400',
            description: 'Clean minimalist design.',
            theme: {
                font: 'font-serif',
                buttonStyle: 'bg-white border border-gray-200 text-gray-800 hover:border-black hover:bg-gray-50 transition-colors',
                layout: 'stacked'
            },
            preview: {
                name: 'Arlo White',
                bio: 'Curating essentials',
                avatar: 'https://i.pravatar.cc/150?u=arlo',
                links: [
                    { label: 'Newsletter', url: 'https://substack.com' },
                    { label: 'Shop', url: 'https://shop.com' }
                ]
            }
        },
        {
            id: 'brutalist',
            title: 'Brutal',
            subtitle: 'Brutalist',
            accent: 'yellow',
            color: 'from-yellow-400 to-orange-500',
            textColor: 'text-yellow-400',
            description: 'Bold brutalist aesthetic.',
            theme: {
                font: 'font-black',
                buttonStyle: 'bg-[#ffbc00] text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
                layout: 'stacked'
            },
            preview: {
                name: 'ALEX BOLD',
                bio: 'Designer & Artist',
                avatar: 'https://i.pravatar.cc/150?u=alex',
                links: [
                    { label: 'PORTFOLIO', url: 'https://behance.net' },
                    { label: 'SHOP', url: 'https://shop.com' }
                ]
            }
        },
        {
            id: 'gradient',
            title: 'Gradient',
            subtitle: 'Gradient Mesh',
            accent: 'violet',
            color: 'from-violet-600 to-indigo-600',
            textColor: 'text-violet-400',
            description: 'Vibrant gradient design.',
            theme: {
                font: 'font-sans',
                buttonStyle: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-indigo-500/50 hover:scale-[1.03] hover:brightness-110',
                layout: 'stacked'
            },
            preview: {
                name: 'Maya Rivers',
                bio: 'Creative Director',
                avatar: 'https://i.pravatar.cc/150?u=maya',
                links: [
                    { label: 'Portfolio', url: 'https://dribbble.com' },
                    { label: 'Instagram', url: 'https://instagram.com' }
                ]
            }
        }
    ];

    return (
        <div className="min-h-screen bg-[#08090D] text-white selection:bg-blue-500/30 font-sans">
            {/* SEO Meta Tags */}
            <SEO
                title="LENK.TR - Modern Link Management & Bio Pages"
                description="Create beautiful bio pages and manage your links with LENK.TR. Modern, fast, and easy to use link management platform for creators and businesses."
                keywords="link management, bio page, linktree alternative, social media links, bio link, link in bio, url shortener, link tracking, analytics"
                url="/"
            />

            {/* Ambient Background Engine */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[160px] rounded-full"></div>
            </div>

            <nav className="relative z-50 flex items-center justify-between px-8 md:px-16 py-10 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-110 transition-transform duration-500">
                            <Zap size={28} className="text-white fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black tracking-tighter font-heading text-white">lenk.tr</span>
                        </div>
                    </Link>
                    <div className="hidden lg:flex items-center gap-12 text-sm font-bold text-zinc-500 tracking-widest uppercase">
                        <a href="#features" className="hover:text-white transition-all hover:scale-105">{t('nav.features')}</a>
                        <a href="#how-it-works" className="hover:text-white transition-all hover:scale-105">{t('nav.howItWorks')}</a>
                        <a href="#ecosystem" className="hover:text-white transition-all hover:scale-105">{t('nav.themes')}</a>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <LanguageSwitcher />
                    <div className="h-4 w-px bg-white/5 hidden md:block" />
                    <Link to="/login" className="hidden md:block text-sm font-bold text-gray-400 hover:text-white tracking-widest uppercase transition-colors">{t('nav.signIn')}</Link>
                    <Link to="/register">
                        <Button variant="primary" size="md">{t('nav.getStarted')}</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero: The Infrastructure */}
            <section className="relative z-10 px-6 md:px-16 pt-8 pb-12 md:pt-12 md:pb-16 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col justify-center">
                <div className="flex flex-col items-center text-center">
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-4 md:mb-6"
                    >
                        <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full glass-effect mb-6 md:mb-10 border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></span>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-blue-400">{t('hero.badge')}</span>
                            <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 md:mb-4 leading-tight">
                            {t('hero.title1')} <br /> {t('hero.title2')}
                        </h1>

                        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed px-4">
                            {t('hero.desc')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                            <Link to="/register">
                                <Button variant="primary" size="md" className="px-8 md:px-10 py-3 md:py-4 text-sm md:text-base shadow-lg shadow-blue-600/20">
                                    {t('hero.ctaClaim')} <Plus size={18} className="ml-2" />
                                </Button>
                            </Link>
                            <a href="#how-it-works">
                                <Button variant="secondary" size="md" className="px-8 md:px-10 py-3 md:py-4 text-sm md:text-base group">
                                    <Play size={16} className="mr-2 fill-current group-hover:scale-110 transition-transform" /> {t('hero.ctaDemo')}
                                </Button>
                            </a>
                        </div>
                    </Motion.div>
                </div>
            </section>


            {/* Design Showcase: Infinite Styles */}
            <section id="ecosystem" className="relative z-10 px-6 md:px-16 py-10 md:py-12 max-w-[1400px] mx-auto overflow-hidden">
                <div className="mb-8 md:mb-10 text-center">
                    <Badge variant="primary" className="mb-4">{t('showcase.badge')}</Badge>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                        {t('showcase.title1')} <br /> {t('showcase.title2')}
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mt-4 leading-relaxed">
                        {t('showcase.desc')}
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-4 md:gap-6">
                            {demos.map((d, i) => {
                                const isCenter = i === selectedIndex;
                                const distance = Math.abs(i - selectedIndex);
                                const scale = isCenter ? 1 : distance === 1 ? 0.85 : 0.7;
                                const opacity = isCenter ? 1 : distance === 1 ? 0.6 : 0.3;

                                return (
                                    <div
                                        key={d.id}
                                        className="flex-[0_0_70%] sm:flex-[0_0_45%] md:flex-[0_0_32%] lg:flex-[0_0_24%] min-w-0 transition-all duration-500"
                                        style={{
                                            transform: `scale(${scale})`,
                                            opacity: opacity
                                        }}
                                    >
                                        <div className="group cursor-pointer">
                                            {/* Phone Frame */}
                                            <div className="relative aspect-[9/18] rounded-[2rem] p-2 border-2 border-white/10 bg-[#0A0C10] shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-all duration-500 max-w-[280px] mx-auto">
                                                {/* Theme Overlay */}
                                                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${d.color}`}></div>

                                                {/* Inner Screen */}
                                                <div className={`relative h-full flex flex-col p-3 overflow-hidden ${d.theme.font}`}>
                                                    <div className="flex flex-col items-center mb-4 mt-3">
                                                        <div className={`w-12 h-12 rounded-full border-2 border-white/20 p-1 mb-2 group-hover:scale-110 transition-transform duration-500`}>
                                                            <img src={d.preview.avatar} alt={d.preview.name} className="w-full h-full rounded-full object-cover" />
                                                        </div>
                                                        <h4 className="text-sm font-bold text-white mb-0.5">{d.preview.name}</h4>
                                                        <p className="text-[8px] text-gray-400 text-center line-clamp-1 px-2">{d.preview.bio}</p>
                                                    </div>

                                                    <div className={`space-y-2 ${d.theme.layout === 'grid' ? 'grid grid-cols-2 gap-2 space-y-0' : ''}`}>
                                                        {d.preview.links.map((link, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={typeof link === 'string' ? '#' : link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`w-full py-2 px-2 text-[9px] font-bold text-center flex items-center justify-center transition-all group/link relative ${d.theme.buttonStyle}`}
                                                            >
                                                                <span>{typeof link === 'string' ? link : link.label}</span>
                                                                <ArrowRight size={8} className="absolute right-2 opacity-40 group-hover/link:opacity-100 transition-opacity" />
                                                            </a>
                                                        ))}
                                                    </div>

                                                    {/* Footer Accent */}
                                                    <div className={`mt-auto w-full py-2 flex justify-center opacity-20`}>
                                                        <Zap size={10} className="fill-current" />
                                                    </div>
                                                </div>

                                                {/* Shine Effect */}
                                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                            </div>

                                            <div className="mt-4 px-2 text-center">
                                                <span className={`text-[8px] font-bold uppercase tracking-wider ${d.textColor} mb-1 block`}>{d.subtitle}</span>
                                                <h3 className="text-base font-bold text-white mb-1">{d.title}</h3>
                                                <p className="text-[11px] text-gray-500 leading-relaxed">{d.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {demos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => emblaApi?.scrollTo(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === selectedIndex
                                    ? 'w-6 bg-blue-500'
                                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="relative z-10 px-6 md:px-16 py-10 md:py-12 max-w-[1400px] mx-auto">
                <div className="mb-8 md:mb-10 text-center">
                    <Badge variant="primary" className="mb-4">{t('howItWorks.badge')}</Badge>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                        {t('howItWorks.title')}
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mt-4 leading-relaxed">
                        {t('howItWorks.desc')}
                    </p>
                </div>

                {/* Mobile/Tablet: Compact Grid Layout */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
                    {/* Step 1 Card */}
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="premium-card p-4 sm:p-6 border-white/5"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                            <span className="text-xs font-bold text-blue-400">STEP 1</span>
                        </div>
                        <div className="relative rounded-xl overflow-hidden border border-white/10 mb-4 group">
                            <img
                                src="/screenshots/dashboard.png"
                                alt="Dashboard"
                                className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('howItWorks.step1.title')}</h3>
                        <p className="text-sm text-gray-400 mb-4">{t('howItWorks.step1.desc')}</p>
                        <ul className="space-y-2">
                            {[t('howItWorks.step1.feature1'), t('howItWorks.step1.feature2'), t('howItWorks.step1.feature3')].map((f, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <Check size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-gray-300">{f}</span>
                                </li>
                            ))}
                        </ul>
                    </Motion.div>

                    {/* Step 2 Card */}
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="premium-card p-4 sm:p-6 border-white/5"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                            <span className="text-xs font-bold text-purple-400">STEP 2</span>
                        </div>
                        <div className="relative rounded-xl overflow-hidden border border-white/10 mb-4 group">
                            <img
                                src="/screenshots/bio-editor.png"
                                alt="Bio Editor"
                                className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('howItWorks.step2.title')}</h3>
                        <p className="text-sm text-gray-400 mb-4">{t('howItWorks.step2.desc')}</p>
                        <ul className="space-y-2">
                            {[t('howItWorks.step2.feature1'), t('howItWorks.step2.feature2'), t('howItWorks.step2.feature3')].map((f, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <Check size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-gray-300">{f}</span>
                                </li>
                            ))}
                        </ul>
                    </Motion.div>

                    {/* Step 3 Card */}
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="premium-card p-4 sm:p-6 border-white/5 sm:col-span-2"
                    >
                        <div className="grid sm:grid-cols-2 gap-6 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 mb-4">
                                    <span className="text-xs font-bold text-lime-400">STEP 3</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{t('howItWorks.step3.title')}</h3>
                                <p className="text-sm text-gray-400 mb-4">{t('howItWorks.step3.desc')}</p>
                                <ul className="space-y-2">
                                    {[t('howItWorks.step3.feature1'), t('howItWorks.step3.feature2'), t('howItWorks.step3.feature3')].map((f, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check size={16} className="text-lime-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-xs text-gray-300">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                                <img
                                    src="/screenshots/link-manager.png"
                                    alt="Link Manager"
                                    className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </Motion.div>
                </div>

                {/* Desktop: Alternating Layout */}
                <div className="hidden lg:block space-y-12 md:space-y-16">
                    {/* Step 1: Dashboard */}
                    <Motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                    >
                        <div className="order-2 md:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                                <span className="text-xs font-bold text-blue-400">STEP 1</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {t('howItWorks.step1.title')}
                            </h3>
                            <p className="text-base text-gray-400 leading-relaxed mb-6">
                                {t('howItWorks.step1.desc')}
                            </p>
                            <ul className="space-y-3">
                                {[
                                    t('howItWorks.step1.feature1'),
                                    t('howItWorks.step1.feature2'),
                                    t('howItWorks.step1.feature3')
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                <img
                                    src="/screenshots/dashboard.png"
                                    alt="Dashboard Overview"
                                    className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    </Motion.div>

                    {/* Step 2: Bio Editor */}
                    <Motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                    >
                        <div className="order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                                <span className="text-xs font-bold text-purple-400">STEP 2</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {t('howItWorks.step2.title')}
                            </h3>
                            <p className="text-base text-gray-400 leading-relaxed mb-6">
                                {t('howItWorks.step2.desc')}
                            </p>
                            <ul className="space-y-3">
                                {[
                                    t('howItWorks.step2.feature1'),
                                    t('howItWorks.step2.feature2'),
                                    t('howItWorks.step2.feature3')
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check size={20} className="text-purple-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-1">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                <img
                                    src="/screenshots/bio-editor.png"
                                    alt="Bio Editor Interface"
                                    className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    </Motion.div>

                    {/* Step 3: Link Manager */}
                    <Motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                    >
                        <div className="order-2 md:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 mb-4">
                                <span className="text-xs font-bold text-lime-400">STEP 3</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {t('howItWorks.step3.title')}
                            </h3>
                            <p className="text-base text-gray-400 leading-relaxed mb-6">
                                {t('howItWorks.step3.desc')}
                            </p>
                            <ul className="space-y-3">
                                {[
                                    t('howItWorks.step3.feature1'),
                                    t('howItWorks.step3.feature2'),
                                    t('howItWorks.step3.feature3')
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check size={20} className="text-lime-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                <img
                                    src="/screenshots/link-manager.png"
                                    alt="Link Manager"
                                    className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-lime-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    </Motion.div>
                </div>

                {/* CTA */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-8 text-center"
                >
                    <Link to="/register">
                        <Button variant="primary" size="lg" className="px-10 py-4 text-base shadow-lg shadow-blue-600/20">
                            {t('howItWorks.cta')} <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </Link>
                </Motion.div>
            </section>

            {/* Powerful Features */}
            <section id="features" className="relative z-10 px-6 md:px-16 py-10 md:py-12 max-w-[1400px] mx-auto">
                <div className="mb-8 md:mb-10">
                    <Badge variant="primary" className="mb-4">{t('features.badge')}</Badge>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">{t('features.title')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {features.map((f, i) => (
                        <Motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="premium-card p-5 md:p-6 group border-white/5"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center ${f.color} mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                                <f.icon size={28} className="fill-current/10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight text-white">{f.title}</h3>
                            <p className="text-sm md:text-base text-gray-400 leading-relaxed">{f.desc}</p>
                        </Motion.div>
                    ))}
                </div>
            </section>


            {/* Footer: Nexus Termination */}
            <footer className="relative z-10 px-6 md:px-16 py-8 md:py-12 border-t border-white/5">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 md:mb-12">
                        <div className="col-span-1 sm:col-span-2 md:col-span-1 text-center sm:text-left">
                            <div className="flex items-center gap-3 mb-4 md:mb-6 group cursor-pointer justify-center sm:justify-start">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                                    <Zap size={20} className="text-white fill-current" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl md:text-2xl font-black tracking-tighter font-heading text-white">lenk.tr</span>
                                </div>
                            </div>
                            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 md:mb-6 max-w-xs mx-auto sm:mx-0">
                                {t('footer.tagline') || 'The ultimate link management platform for modern creators.'}
                            </p>
                            <div className="flex gap-3 justify-center sm:justify-start">
                                {[
                                    { icon: 'twitter', url: 'https://twitter.com' },
                                    { icon: 'github', url: 'https://github.com' },
                                    { icon: 'discord', url: 'https://discord.com' }
                                ].map(s => (
                                    <a key={s.icon} href={s.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group hover:scale-110">
                                        <Globe size={14} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {[
                            {
                                title: 'Platform',
                                links: [
                                    { label: 'Features', to: '/#features' },
                                    { label: 'Pricing', to: '/pricing' },
                                    { label: 'Security', to: '/security' },
                                    { label: 'Themes', to: '/#ecosystem' }
                                ]
                            },
                            {
                                title: 'Ecosystem',
                                links: [
                                    { label: 'Developers', to: '/#features' },
                                    { label: 'Short Links', to: '/links' },
                                    { label: 'Analytics', to: '/analytics' },
                                    { label: 'Global Reach', to: '/#features' }
                                ]
                            },
                            {
                                title: 'Company',
                                links: [
                                    { label: 'About Us', to: '/about' },
                                    { label: 'Contact', to: '/contact' },
                                    { label: 'Terms', to: '/terms' },
                                    { label: 'Privacy', to: '/privacy' }
                                ]
                            }
                        ].map((section, i) => (
                            <div key={i} className="space-y-3 text-center sm:text-left">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-white">{section.title}</p>
                                <ul className="space-y-2">
                                    {section.links.map((link, j) => (
                                        <li key={j}>
                                            {link.to.startsWith('/#') ? (
                                                <a href={link.to} className="text-xs md:text-sm text-gray-500 hover:text-white transition-colors">{link.label}</a>
                                            ) : (
                                                <Link to={link.to} className="text-xs md:text-sm text-gray-500 hover:text-white transition-colors">{link.label}</Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 opacity-30 pt-6 md:pt-8 border-t border-white/5">
                        <p className="text-[10px] font-bold uppercase tracking-wider">© 2025 LENK.TR</p>
                        <div className="flex gap-6 md:gap-8">
                            <a href="#" className="text-[10px] font-bold uppercase tracking-wider hover:text-white">Security</a>
                            <a href="#" className="text-[10px] font-bold uppercase tracking-wider hover:text-white">API Health</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
