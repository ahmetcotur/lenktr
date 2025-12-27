import React from 'react';
import {
    Check,
    Share2,
    AlertTriangle,
} from 'lucide-react';
import {
    FaXTwitter,
    FaInstagram,
    FaFacebook,
    FaLinkedin,
    FaYoutube,
    FaTiktok,
    FaGithub,
    FaDiscord,
    FaGlobe,
    FaEnvelope,
    FaTelegram
} from 'react-icons/fa6';

const socialIcons = {
    twitter: <FaXTwitter />,
    instagram: <FaInstagram />,
    facebook: <FaFacebook />,
    linkedin: <FaLinkedin />,
    youtube: <FaYoutube />,
    tiktok: <FaTiktok />,
    github: <FaGithub />,
    discord: <FaDiscord />,
    website: <FaGlobe />,
    email: <FaEnvelope />,
    telegram: <FaTelegram />
};

const uiStyles = [
    { id: 'glass', name: 'Glassmorphism', linkStyle: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20' },
    { id: 'neon', name: 'Cyber Neon', linkStyle: 'bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
    { id: 'minimal', name: 'Minimal Dark', linkStyle: 'bg-[#121212] border border-white/5 text-white hover:bg-zinc-800' },
    { id: 'brutal', name: 'Neo Brutalist', linkStyle: 'bg-white border-4 border-black text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all' },
    { id: 'soft', name: 'Soft Gradient', linkStyle: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/10 text-white hover:from-blue-500/30 hover:to-purple-500/30' },
];

const PublicBioPage = ({ pageData }) => {
    if (!pageData) return null;

    const { theme_settings, profile_title, profile_bio } = pageData;
    const {
        avatar,
        bioLinks: links = [],
        socialMedia = [],
        uiStyle = 'glass',
        font = 'Inter',
        backgroundImage,
        backgroundOpacity = 40,
        backgroundBlur = 10,
        customColors = { color1: '#000000', color2: '#000000' },
        adultWarning = false,
        cookieConsent = false,
        shareButton = true,
        verifiedIcon = false
    } = theme_settings || {};

    const style = uiStyles.find(s => s.id === uiStyle) || uiStyles[0];

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-x-hidden" style={{ fontFamily: font }}>
            {/* Wallpaper Background */}
            <div
                className="fixed inset-0 z-0"
                style={backgroundImage ? {
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: `blur(${Number(backgroundBlur) + 20}px) brightness(0.4)`
                } : {
                    background: `linear-gradient(135deg, ${customColors.color1}, ${customColors.color2})`
                }}
            />

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-lg min-h-screen mx-auto flex flex-col">
                <div
                    className="flex-1 flex flex-col pt-16 px-6 pb-12 relative"
                    style={backgroundImage ? {
                        backgroundColor: `rgba(0,0,0, ${backgroundOpacity / 100})`,
                        backdropFilter: `blur(${backgroundBlur}px)`
                    } : {}}
                >
                    {/* Adult Warning Overlay */}
                    {adultWarning && (
                        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                            <AlertTriangle size={48} className="text-red-500 mb-4" />
                            <h3 className="text-2xl font-black text-white mb-2 uppercase">Sensitive Content</h3>
                            <p className="text-sm text-zinc-400 mb-8 font-medium">This page may contain content that is not suitable for all audiences.</p>
                            <button
                                onClick={(e) => e.currentTarget.parentElement.remove()}
                                className="px-8 py-4 bg-red-500 text-white font-black rounded-xl text-sm uppercase tracking-widest hover:bg-red-600 transition-all w-full max-w-xs shadow-2xl shadow-red-500/20"
                            >
                                I am 18+
                            </button>
                        </div>
                    )}

                    {/* Share Button */}
                    {shareButton && (
                        <button className="absolute top-8 right-8 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all z-20">
                            <Share2 size={20} />
                        </button>
                    )}

                    {/* Avatar & Info */}
                    <div className="flex flex-col items-center text-center mb-10 mt-4">
                        <div className="mb-6 relative">
                            <div className="w-28 h-28 rounded-full border-2 border-white/50 p-1 overflow-hidden shadow-2xl bg-zinc-900">
                                {avatar ? (
                                    <img src={avatar} alt={profile_title} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full flex items-center justify-center bg-zinc-800 text-zinc-600 font-black text-2xl uppercase">
                                        {profile_title?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name with Verified Badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <h1 className="text-2xl font-black text-white drop-shadow-lg tracking-tight">{profile_title || 'Unnamed Profile'}</h1>
                            {verifiedIcon && (
                                <div className="bg-blue-500 text-white p-0.5 rounded-full shadow-lg" title="Verified">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            )}
                        </div>

                        <p className="text-base text-white/80 mb-8 max-w-[320px] leading-relaxed drop-shadow-sm font-medium">{profile_bio}</p>
                    </div>

                    {/* Links */}
                    <div className="w-full space-y-4 mb-12">
                        {links.filter(l => l.visible).map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center relative group shadow-lg ${style.linkStyle}`}
                            >
                                <span className="absolute left-8 text-2xl opacity-80 group-hover:scale-110 transition-transform">{link.icon}</span>
                                <span className="font-bold text-lg">{link.title}</span>
                            </a>
                        ))}
                    </div>

                    {/* Socials */}
                    {socialMedia.some(s => s.active) && (
                        <div className="flex flex-wrap justify-center gap-6 mt-auto">
                            {socialMedia.filter(s => s.active).map(social => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/80 hover:text-white hover:scale-125 transition-all text-3xl drop-shadow-xl"
                                >
                                    {socialIcons[social.id]}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Branding */}
                    <a
                        href="/"
                        className="mt-12 mb-4 flex items-center justify-center gap-2 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer group"
                    >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-black group-hover:bg-white"></div>
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-white">lenk.tr</span>
                    </a>

                    {/* Cookie Consent Banner */}
                    {cookieConsent && (
                        <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto bg-white/95 backdrop-blur-2xl p-4 rounded-2xl border border-white/20 shadow-2xl animate-fade-in-up z-40 text-left flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-[11px] font-bold text-black leading-tight uppercase tracking-tight">This node uses cookies for telemetry.</p>
                            </div>
                            <button
                                onClick={(e) => e.currentTarget.parentElement.remove()}
                                className="px-4 py-2 bg-black text-white text-[10px] font-black rounded-lg whitespace-nowrap uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                            >
                                Accept
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicBioPage;
