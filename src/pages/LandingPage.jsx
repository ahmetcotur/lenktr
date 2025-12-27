import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3, Globe, ChevronRight, Play, Star, Plus, Check, Palette, Settings, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
            id: 'neon',
            title: 'The Creator',
            subtitle: 'Neon & Energetic',
            accent: 'cyan',
            color: 'from-cyan-400 to-blue-600',
            textColor: 'text-cyan-400',
            description: 'Cyberpunk aesthetic with glowing borders and sharp contrast.',
            theme: {
                font: 'font-mono',
                buttonStyle: 'bg-black/80 border border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:bg-cyan-950/30 hover:scale-[1.02]',
                layout: 'stacked'
            },
            preview: {
                name: 'KAI_ZEN',
                bio: 'cat bio.txt // Streaming daily @ 7PM. Check out my new setup!',
                avatar: 'https://i.pravatar.cc/150?u=kai',
                links: [
                    { label: 'Watch Live on Twitch', url: 'https://twitch.tv' },
                    { label: 'Gaming Discord', url: 'https://discord.com' },
                    { label: 'Latest Highlights', url: 'https://youtube.com' }
                ]
            }
        },
        {
            id: 'glass',
            title: 'The Professional',
            subtitle: 'Modern & Sleek',
            accent: 'blue',
            color: 'from-blue-600 to-indigo-600',
            textColor: 'text-blue-400',
            description: 'The signature glassmorphism effect for a premium look.',
            theme: {
                font: 'font-sans',
                buttonStyle: 'backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]',
                layout: 'stacked'
            },
            preview: {
                name: 'Elena Vance',
                bio: 'Product Designer @ TechLayer. Building the future of UX.',
                avatar: 'https://i.pravatar.cc/150?u=elena',
                links: [
                    { label: 'View Portfolio', url: 'https://behance.net' },
                    { label: 'Read My Blog', url: 'https://medium.com' },
                    { label: 'LinkedIn Profile', url: 'https://linkedin.com' }
                ]
            }
        },
        {
            id: 'minimal',
            title: 'The Minimalist',
            subtitle: 'Hyper-Clean',
            accent: 'zinc',
            color: 'from-zinc-100 to-zinc-400',
            textColor: 'text-zinc-400',
            description: 'A clean, distraction-free layout focused on legibility.',
            theme: {
                font: 'font-serif',
                buttonStyle: 'bg-white border border-gray-200 text-gray-800 hover:border-black hover:bg-gray-50 transition-colors',
                layout: 'stacked'
            },
            preview: {
                name: 'Arlo White',
                bio: 'Curating essential links for the mindful collector.',
                avatar: 'https://i.pravatar.cc/150?u=arlo',
                links: [
                    { label: 'Weekly Newsletter', url: 'https://substack.com' },
                    { label: 'Curated Shop', url: 'https://shop.com' }
                ]
            }
        },
        {
            id: 'brutalism',
            title: 'The Trendsetter',
            subtitle: 'Brutal & Bold',
            accent: 'yellow',
            color: 'from-yellow-400 to-orange-500',
            textColor: 'text-yellow-400',
            description: 'Daring design with heavy borders and high-energy colors.',
            theme: {
                font: 'font-display',
                buttonStyle: 'bg-[#ffbc00] text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
                layout: 'stacked'
            },
            preview: {
                name: 'MAX VOLUME',
                bio: 'Breaking boundaries. Defining the new standard.',
                avatar: 'https://i.pravatar.cc/150?u=max',
                links: [
                    { label: 'Latest Drop', url: 'https://drop.com' },
                    { label: 'Tour Dates', url: 'https://tour.com' },
                    { label: 'Merch Store', url: 'https://shop.com' }
                ]
            }
        }
    ];

    return (
        <div className="min-h-screen bg-[#08090D] text-white selection:bg-blue-500/30 font-sans">
            {/* Ambient Background Engine */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[160px] rounded-full"></div>
            </div>

            <nav className="relative z-50 flex items-center justify-between px-8 md:px-16 py-10 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-105 transition-all duration-500">
                            <Zap size={28} className="text-white fill-current" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter font-heading italic uppercase">LENK.TR</span>
                    </Link>
                    <div className="hidden lg:flex items-center gap-12 text-sm font-bold text-zinc-500 tracking-widest uppercase">
                        {['features', 'pricing', 'ecosystem'].map((item) => (
                            <a key={item} href={`#${item}`} className="hover:text-white transition-all hover:scale-105">{t(`nav.${item}`)}</a>
                        ))}
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
            <section className="relative z-10 px-6 md:px-16 pt-24 pb-32 md:pt-40 md:pb-64 max-w-[1600px] mx-auto min-h-[90vh] flex flex-col justify-center">
                <div className="flex flex-col items-center text-center">
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 md:mb-12"
                    >
                        <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full glass-effect mb-8 md:mb-16 border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></span>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-blue-400">{t('hero.badge')}</span>
                            <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <h1 className="text-6xl sm:text-7xl md:text-[10rem] lg:text-[13rem] font-black tracking-tighter mb-10 md:mb-16 font-heading leading-[0.85] text-gradient uppercase">
                            {t('hero.title1')} <br /> {t('hero.title2')}
                        </h1>

                        <p className="text-xl md:text-3xl text-gray-400 max-w-4xl mx-auto mb-16 md:mb-24 leading-relaxed font-bold px-4">
                            {t('hero.desc')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                            <Link to="/register">
                                <Button variant="primary" size="lg" className="px-10 md:px-14 py-6 md:py-8 text-lg md:text-2xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
                                    {t('hero.ctaClaim')} <Plus size={24} className="ml-4" />
                                </Button>
                            </Link>
                            <Button variant="secondary" size="lg" className="px-10 md:px-14 py-6 md:py-8 text-lg md:text-2xl group">
                                <Play size={20} className="mr-4 fill-current group-hover:scale-110 transition-transform" /> {t('hero.ctaDemo')}
                            </Button>
                        </div>
                    </Motion.div>
                </div>
            </section>


            {/* Design Showcase: Infinite Styles */}
            <section id="ecosystem" className="relative z-10 px-6 md:px-16 py-32 md:py-64 max-w-[1600px] mx-auto overflow-hidden">
                <div className="mb-24 md:mb-40 text-center">
                    <Badge variant="primary" className="mb-8">{t('showcase.badge')}</Badge>
                    <h2 className="text-6xl md:text-[9rem] font-black tracking-tighter font-heading text-white leading-none italic uppercase">
                        {t('showcase.title1')} <br /> {t('showcase.title2')}
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-500 font-bold max-w-3xl mx-auto mt-12 leading-relaxed">
                        {t('showcase.desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {demos.map((d, i) => (
                        <Motion.div
                            key={d.id}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="group cursor-default"
                        >
                            {/* Phone Frame */}
                            <div className="relative aspect-[9/18] rounded-[3rem] p-4 border-4 border-white/10 bg-[#0A0C10] shadow-2xl overflow-hidden group-hover:scale-[1.02] group-hover:-translate-y-4 transition-all duration-700">
                                {/* Theme Overlay */}
                                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${d.color}`}></div>

                                {/* Inner Screen */}
                                <div className={`relative h-full flex flex-col p-6 overflow-hidden ${d.theme.font}`}>
                                    <div className="flex flex-col items-center mb-10 mt-8">
                                        <div className={`w-20 h-20 rounded-full border-2 border-white/20 p-1 mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                            <img src={d.preview.avatar} alt={d.preview.name} className="w-full h-full rounded-full object-cover" />
                                        </div>
                                        <h4 className="text-xl font-black font-heading text-white mb-1">{d.preview.name}</h4>
                                        <p className="text-[10px] text-gray-400 text-center line-clamp-2 px-2">{d.preview.bio}</p>
                                    </div>

                                    <div className={`space-y-3 ${d.theme.layout === 'grid' ? 'grid grid-cols-2 gap-3 space-y-0' : ''}`}>
                                        {d.preview.links.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={typeof link === 'string' ? '#' : link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-full py-4 px-4 text-[11px] font-bold text-center flex items-center justify-center transition-all group/link relative ${d.theme.buttonStyle}`}
                                            >
                                                <span>{typeof link === 'string' ? link : link.label}</span>
                                                {d.id !== 'brutalism' && <ArrowRight size={12} className="absolute right-4 opacity-40 group-hover/link:opacity-100 transition-opacity" />}
                                            </a>
                                        ))}
                                    </div>

                                    {/* Footer Accent */}
                                    <div className={`mt-auto w-full py-4 flex justify-center opacity-20`}>
                                        <Zap size={14} className="fill-current" />
                                    </div>
                                </div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            </div>

                            <div className="mt-8 px-2">
                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${d.textColor} mb-2 block`}>{d.subtitle}</span>
                                <h3 className="text-2xl font-black font-heading text-white mb-2 uppercase">{d.title}</h3>
                                <p className="text-sm text-gray-500 font-bold leading-relaxed">{d.description}</p>
                            </div>
                        </Motion.div>
                    ))}
                </div>
            </section>

            {/* Powerful Features */}
            <section id="features" className="relative z-10 px-6 md:px-16 py-32 md:py-64 max-w-[1600px] mx-auto">
                <div className="mb-24 md:mb-40">
                    <Badge variant="primary" className="mb-8">{t('features.badge')}</Badge>
                    <h2 className="text-6xl md:text-[9rem] font-black tracking-tighter font-heading text-white leading-none italic uppercase">{t('features.title')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                    {features.map((f, i) => (
                        <Motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="premium-card p-10 md:p-14 group border-white/5"
                        >
                            <div className={`w-20 h-20 rounded-[28px] ${f.bg} flex items-center justify-center ${f.color} mb-10 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                                <f.icon size={36} className="fill-current/10" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black font-heading mb-6 tracking-tighter text-white uppercase italic">{f.title}</h3>
                            <p className="text-xl text-gray-500 font-bold leading-relaxed">{f.desc}</p>
                        </Motion.div>
                    ))}
                </div>
            </section>

            {/* Global Trust Section */}
            <section className="relative z-10 px-6 md:px-16 py-32 md:py-64 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12 md:space-y-16 text-center lg:text-left">
                            <Badge variant="success">NETWORK STATUS</Badge>
                            <h2 className="text-6xl md:text-9xl font-black tracking-tighter font-heading text-white leading-none uppercase italic">GLOBAL <br /> REACH.</h2>
                            <p className="text-2xl text-gray-500 font-bold leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Powering the links for the world's most innovative content creators and brands.
                            </p>
                            <div className="pt-8 flex flex-col sm:flex-row items-center gap-12 justify-center lg:justify-start">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-16 h-16 rounded-full border-4 border-[#08090D] bg-gray-800 overflow-hidden ring-1 ring-white/10">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                        </div>
                                    ))}
                                    <div className="w-16 h-16 rounded-full border-4 border-[#08090D] bg-blue-600 flex items-center justify-center text-sm font-black ring-1 ring-white/10">+22k</div>
                                </div>
                                <div>
                                    <div className="flex gap-1 text-blue-500 mb-2">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 italic">Rated 4.9/5 by 22,000+ users</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 md:gap-10">
                            {stats.map((s, i) => (
                                <div key={i} className="glass-effect p-8 md:p-12 rounded-[40px] border-white/5 hover:border-blue-500/20 transition-all group overflow-hidden">
                                    <p className="text-3xl md:text-4xl font-black font-heading text-white tracking-tighter mb-4 group-hover:scale-105 transition-transform duration-500 italic uppercase truncate">{s.val}</p>
                                    <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-gray-600">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer: Nexus Termination */}
            <footer className="relative z-10 px-6 md:px-16 py-24 md:py-40 border-t border-white/5">
                <div className="max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24 mb-32">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-4 mb-10 group cursor-pointer">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-105 transition-all duration-500">
                                    <Zap size={28} className="text-white fill-current" />
                                </div>
                                <span className="text-3xl font-black tracking-tighter font-heading italic uppercase">LENK.TR</span>
                            </div>
                            <p className="text-lg text-gray-500 font-bold leading-relaxed mb-10">
                                {t('footer.tagline') || 'The ultimate link management platform for modern creators.'}
                            </p>
                            <div className="flex gap-6">
                                {[
                                    { icon: 'twitter', url: 'https://twitter.com' },
                                    { icon: 'github', url: 'https://github.com' },
                                    { icon: 'discord', url: 'https://discord.com' }
                                ].map(s => (
                                    <a key={s.icon} href={s.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group hover:scale-110">
                                        <Globe size={18} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
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
                            <div key={i} className="space-y-8">
                                <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.4em] text-white italic">{section.title}</p>
                                <ul className="space-y-6">
                                    {section.links.map((link, j) => (
                                        <li key={j}>
                                            {link.to.startsWith('/#') ? (
                                                <a href={link.to} className="text-lg font-bold text-gray-600 hover:text-white transition-colors">{link.label}</a>
                                            ) : (
                                                <Link to={link.to} className="text-lg font-bold text-gray-600 hover:text-white transition-colors">{link.label}</Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 opacity-30 pt-16 border-t border-white/5">
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] font-heading italic">© 2025 LENK.TR // SIMPLY BETTER LINKS</p>
                        <div className="flex gap-12">
                            <a href="#" className="text-[11px] font-black uppercase tracking-[0.3em] hover:text-white">Security Scan</a>
                            <a href="#" className="text-[11px] font-black uppercase tracking-[0.3em] hover:text-white">API Health</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
