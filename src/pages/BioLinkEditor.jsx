import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical, Eye, Save, Palette, Type, Layout, Upload, Image, ChevronLeft, ChevronDown, Check, Calendar, ShieldAlert, Cookie, Share2, Lock, AlertTriangle, Activity, Globe, Mail, Send } from 'lucide-react';
import { FaXTwitter, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaTiktok, FaGithub, FaDiscord } from 'react-icons/fa6';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ColorPicker from '../components/ui/ColorPicker';
import ImageUploader from '../components/ui/ImageUploader';
import Toast from '../components/ui/Toast';
import IconPicker from '../components/ui/IconPicker';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '../utils/supabase/client';
import { useAuth } from '../context/AuthContext';

const supabase = createClient();

// Sortable Link Item Component
const SortableLinkItem = ({ link, updateLink, toggleLinkVisibility, deleteLink, setIconPickerOpen }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="glass-effect p-4 rounded-xl border-white/5 group hover:border-blue-500/20 transition-all"
        >
            <div className="flex items-center gap-3">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-move text-gray-600 hover:text-gray-400 touch-none"
                >
                    <GripVertical size={18} />
                </button>

                <button
                    onClick={() => setIconPickerOpen(link.id)}
                    className="w-12 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-2xl hover:bg-white/10 transition-colors"
                    title="Change icon"
                >
                    {link.icon || '+'}
                </button>

                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-bold focus:border-blue-500/50 focus:outline-none"
                        placeholder="Link Title"
                    />
                    <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-xs font-mono focus:border-blue-500/50 focus:outline-none"
                        placeholder="https://example.com"
                    />
                </div>

                <button
                    onClick={() => toggleLinkVisibility(link.id)}
                    className={`p - 2 rounded - lg transition - all ${link.visible
                        ? 'text-blue-500 hover:bg-blue-500/10'
                        : 'text-gray-600 hover:bg-white/5'
                        } `}
                >
                    <Eye size={18} />
                </button>

                <button
                    onClick={() => deleteLink(link.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};



const socialIcons = {
    twitter: <FaXTwitter />,
    instagram: <FaInstagram />,
    facebook: <FaFacebook />,
    linkedin: <FaLinkedin />,
    youtube: <FaYoutube />,
    tiktok: <FaTiktok />,
    github: <FaGithub />,
    discord: <FaDiscord />,
    website: <Globe />,
    email: <Mail />,
    telegram: <Send />
};

const fonts = [
    { name: 'System Font', family: 'sans-serif' },
    { name: 'Poppins', family: '"Poppins", sans-serif' },
    { name: 'Noto Sans', family: '"Noto Sans", sans-serif' },
    { name: 'Saira Condensed', family: '"Saira Condensed", sans-serif' },
    { name: 'Space Grotesk', family: '"Space Grotesk", sans-serif' },
    { name: 'Playfair Display', family: '"Playfair Display", serif' },
    { name: 'Josefin Sans', family: '"Josefin Sans", sans-serif' },
    { name: 'Roboto', family: '"Roboto", sans-serif' },
    { name: 'Crimson Text', family: '"Crimson Text", serif' },
    { name: 'Inconsolata', family: '"Inconsolata", monospace' },
    { name: 'Libre Baskerville', family: '"Libre Baskerville", serif' },
    { name: 'Klee One', family: '"Klee One", cursive' },
    { name: 'Roboto Condensed', family: '"Roboto Condensed", sans-serif' },
    { name: 'Montserrat', family: '"Montserrat", sans-serif' },
    { name: 'Roboto Mono', family: '"Roboto Mono", monospace' },
    { name: 'Edu SA Beginner', family: '"Edu SA Beginner", cursive' },
    { name: 'Radley', family: '"Radley", serif' },
    { name: 'PT Serif', family: '"PT Serif", serif' },
    { name: 'Lato', family: '"Lato", sans-serif' },
    { name: 'Dancing Script', family: '"Dancing Script", cursive' },
    { name: 'Charm', family: '"Charm", cursive' },
    { name: 'Prompt', family: '"Prompt", sans-serif' },
    { name: 'Montserrat Alternates', family: '"Montserrat Alternates", sans-serif' },
    { name: 'Lobster Two', family: '"Lobster Two", cursive' },
    { name: 'Nunito', family: '"Nunito", sans-serif' },
    { name: 'Comic Neue', family: '"Comic Neue", cursive' },
    { name: 'Josefin Slab', family: '"Josefin Slab", serif' },
    { name: 'Open Sans', family: '"Open Sans", sans-serif' },
    { name: 'Arima Madurai', family: '"Arima Madurai", cursive' },
    { name: 'Kaushan Script', family: '"Kaushan Script", cursive' },
    { name: 'UnifrakturMaguntia', family: '"UnifrakturMaguntia", cursive' }
];

const BioLinkEditor = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pageId = searchParams.get('id');
    const avatarInputRef = useRef(null);
    const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
    const [slug, setSlug] = useState('');

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Arima+Madurai:wght@400;700&family=Charm:wght@400;700&family=Comic+Neue:wght@400;700&family=Crimson+Text:wght@400;700&family=Dancing+Script:wght@400;700&family=Edu+SA+Beginner:wght@400;700&family=Inconsolata:wght@400;700&family=Josefin+Sans:wght@400;700&family=Josefin+Slab:wght@400;700&family=Kaushan+Script&family=Klee+One&family=Lato:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Lobster+Two:wght@400;700&family=Montserrat:wght@400;700&family=Montserrat+Alternates:wght@400;700&family=Noto+Sans:wght@400;700&family=Nunito:wght@400;700&family=Open+Sans:wght@400;700&family=PT+Serif:wght@400;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;700&family=Prompt:wght@400;700&family=Radley&family=Roboto:wght@400;700&family=Roboto+Condensed:wght@400;700&family=Roboto+Mono:wght@400;700&family=Saira+Condensed:wght@400;700&family=Space+Grotesk:wght@400;700&family=UnifrakturMaguntia&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    const [profile, setProfile] = useState({
        displayName: 'Your Name',
        bio: 'Your bio description',
        avatar: 'https://i.pravatar.cc/150?u=default',
        backgroundImage: '',
        font: 'sans-serif', // Default font
        customColors: { color1: '#2563eb', color2: '#9333ea' }, // Default Modern (Blue to Purple)
        backgroundBlur: 20, // Default blur
        backgroundOpacity: 40, // Default opacity %
        theme: 'modern',
        template: 'glassmorphism',
        uiStyle: 'glassmorphism',
        // Settings
        scheduleDate: null,
        expirationDate: null,
        pixels: [],
        cookieConsent: false,
        adultWarning: false,
        verifiedIcon: false,
        shareButton: true
    });

    const [links, setLinks] = useState([
        { id: 1, title: 'Portfolio', url: 'https://portfolio.com', icon: '🎨', isActive: true },
        { id: 2, title: 'GitHub', url: 'https://github.com', icon: '💻', isActive: true },
        { id: 3, title: 'Twitter', url: 'https://twitter.com', icon: '🐦', isActive: true }
    ]);

    const [socialMedia, setSocialMedia] = useState([
        { platform: 'twitter', url: '', isActive: false },
        { platform: 'instagram', url: '', isActive: false },
        { platform: 'facebook', url: '', isActive: false },
        { platform: 'linkedin', url: '', isActive: false },
        { platform: 'youtube', url: '', isActive: false },
        { platform: 'tiktok', url: '', isActive: false },
        { platform: 'github', url: '', isActive: false },
        { platform: 'discord', url: '', isActive: false },
        { platform: 'website', url: '', isActive: false },
        { platform: 'email', url: '', isActive: false },
        { platform: 'telegram', url: '', isActive: false }
    ]);

    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [bioPageId, setBioPageId] = useState(null);
    const [toast, setToast] = useState(null);
    const [iconPickerOpen, setIconPickerOpen] = useState(null); // ID of link being edited

    useEffect(() => {
        const fetchBioPage = async () => {
            if (!user) return;

            // If no ID passed and we are not explicitly creating new, 
            // maybe we shouldn't fetch anything (start fresh).
            if (!pageId) {
                setLoading(false);
                setSlug(user.email.split('@')[0] + '-' + Math.random().toString(36).substring(2, 5));
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('bio_pages')
                    .select('*')
                    .eq('id', pageId)
                    .single();

                if (error) throw error;

                if (data) {
                    setBioPageId(data.id);
                    setSlug(data.slug || '');
                    setProfile({
                        displayName: data.profile_title || '',
                        bio: data.profile_bio || '',
                        avatar: data.theme_settings?.avatar || 'https://i.pravatar.cc/150?u=default',
                        backgroundImage: data.theme_settings?.backgroundImage || '',
                        font: data.theme_settings?.font || 'sans-serif',
                        customColors: data.theme_settings?.customColors || { color1: '#2563eb', color2: '#9333ea' },
                        backgroundBlur: data.theme_settings?.backgroundBlur ?? 20,
                        backgroundOpacity: data.theme_settings?.backgroundOpacity ?? 40,
                        theme: data.theme_settings?.theme || 'modern',
                        template: data.theme_settings?.template || 'glassmorphism',
                        uiStyle: data.theme_settings?.uiStyle || 'glassmorphism',
                        scheduleDate: data.theme_settings?.scheduleDate || null,
                        expirationDate: data.theme_settings?.expirationDate || null,
                        pixels: data.theme_settings?.pixels || [],
                        cookieConsent: data.theme_settings?.cookieConsent || false,
                        adultWarning: data.theme_settings?.adultWarning || false,
                        verifiedIcon: data.theme_settings?.verifiedIcon || false,
                        shareButton: data.theme_settings?.shareButton ?? true
                    });
                    if (data.theme_settings?.bioLinks) setLinks(data.theme_settings.bioLinks);
                    if (data.theme_settings?.socialMedia) setSocialMedia(data.theme_settings.socialMedia);
                }
            } catch (err) {
                console.error('Error fetching bio page:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBioPage();
    }, [user, pageId]);

    const handleSave = async () => {
        if (!user) return;
        if (!slug) {
            setToast({ message: 'Please enter a slug for your page', type: 'error' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        setSaving(true);
        try {
            const payload = {
                user_id: user.id,
                slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                profile_title: profile.displayName,
                profile_bio: profile.bio,
                theme_settings: {
                    ...profile,
                    bioLinks: links,
                    socialMedia: socialMedia
                },
                is_published: true
            };

            if (bioPageId) {
                const { error: updateError } = await supabase
                    .from('bio_pages')
                    .update(payload)
                    .eq('id', bioPageId);

                if (updateError) throw updateError;
                setToast({ message: '✨ Bio page updated successfully!', type: 'success' });
            } else {
                const { data: newData, error: insertError } = await supabase
                    .from('bio_pages')
                    .insert([payload])
                    .select()
                    .single();

                if (insertError) throw insertError;
                if (newData) setBioPageId(newData.id);
                setToast({ message: '🎉 Bio page created successfully!', type: 'success' });
            }

            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            setToast({ message: 'Error: ' + err.message, type: 'error' });
            setTimeout(() => setToast(null), 4000);
        } finally {
            setSaving(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const themes = [
        { id: 'modern', name: 'Modern', gradient: 'from-blue-600 to-purple-600', colors: ['#2563eb', '#9333ea'] },
        { id: 'minimal', name: 'Minimal', gradient: 'from-gray-800 to-gray-900', colors: ['#1f2937', '#111827'] },
        { id: 'vibrant', name: 'Vibrant', gradient: 'from-pink-500 to-orange-500', colors: ['#ec4899', '#f97316'] },
        { id: 'nature', name: 'Nature', gradient: 'from-green-500 to-teal-600', colors: ['#22c55e', '#0d9488'] },
        { id: 'sunset', name: 'Sunset', gradient: 'from-orange-400 to-red-600', colors: ['#fb923c', '#dc2626'] }
    ];

    // UI Style Libraries (replacing old templates)
    const uiStyles = [
        {
            id: 'glassmorphism',
            name: 'Glass',
            icon: '✨',
            description: 'Glassmorphism',
            linkStyle: 'backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]',
            cardStyle: 'backdrop-blur-lg bg-white/5 border border-white/10'
        },
        {
            id: 'neumorphism',
            name: 'Neuro',
            icon: '🎨',
            description: 'Neumorphism',
            linkStyle: 'bg-[#e0e5ec] text-gray-700 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] hover:shadow-[inset_9px_9px_16px_rgb(163,177,198,0.6),inset_-9px_-9px_16px_rgba(255,255,255,0.5)] hover:scale-[1.02] transition-transform',
            cardStyle: 'bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff]'
        },
        {
            id: 'material',
            name: 'Material',
            icon: '📐',
            description: 'Material Design',
            linkStyle: 'bg-white text-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1 active:shadow-sm active:translate-y-0',
            cardStyle: 'bg-white shadow-md'
        },
        {
            id: 'brutalist',
            name: 'Brutal',
            icon: '⬛',
            description: 'Brutalist',
            linkStyle: 'bg-[#ffbc00] text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
            cardStyle: 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
        },
        {
            id: 'gradient',
            name: 'Gradient',
            icon: '🌈',
            description: 'Gradient Mesh',
            linkStyle: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-indigo-500/50 hover:scale-[1.03] hover:brightness-110',
            cardStyle: 'bg-gradient-to-br from-blue-400 to-purple-500'
        },
        {
            id: 'neon',
            name: 'Neon',
            icon: '💫',
            description: 'Neon Glow',
            linkStyle: 'bg-black/80 border border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:bg-cyan-950/30 hover:scale-[1.02]',
            cardStyle: 'bg-black border-2 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
        },
        {
            id: 'minimal',
            name: 'Minimal',
            icon: '⚪',
            description: 'Minimalist',
            linkStyle: 'bg-white border border-gray-200 text-gray-800 hover:border-black hover:bg-gray-50 transition-colors',
            cardStyle: 'bg-white border border-gray-100'
        },
        {
            id: 'retro',
            name: 'Retro',
            icon: '📺',
            description: 'Retro/Vintage',
            linkStyle: 'bg-[#f0e6d2] text-[#4a3b2a] border-2 border-[#4a3b2a] hover:bg-[#e6d8b9] hover:underline decoration-2 underline-offset-4',
            cardStyle: 'bg-yellow-50 border-4 border-yellow-900'
        }
    ];

    const addLink = () => {
        const newLink = {
            id: Date.now(),
            title: 'New Link',
            url: 'https://example.com',
            icon: '🔗',
            visible: true
        };
        setLinks([...links, newLink]);
    };

    const deleteLink = (id) => {
        setLinks(links.filter(link => link.id !== id));
    };

    const updateLink = (id, field, value) => {
        setLinks(links.map(link =>
            link.id === id ? { ...link, [field]: value } : link
        ));
    };

    const toggleLinkVisibility = (id) => {
        setLinks(links.map(link =>
            link.id === id ? { ...link, visible: !link.visible } : link
        ));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setLinks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { uploadImage } = await import('../utils/supabase/storage');
            const { url, error } = await uploadImage(file, 'avatars', user.id);

            if (error) {
                alert('Failed to upload avatar. Please try again.');
                return;
            }

            setProfile({ ...profile, avatar: url });
        } catch (error) {
            console.error('Avatar upload error:', error);
            alert('Failed to upload avatar. Please try again.');
        }
    };



    const updateSocialMedia = (id, url) => {
        setSocialMedia(socialMedia.map(social =>
            social.id === id ? { ...social, url, active: url.length > 0 } : social
        ));
    };

    const toggleSocialMedia = (platform) => {
        setSocialMedia(socialMedia.map(social =>
            social.platform === platform ? { ...social, isActive: !social.isActive } : social
        ));
    };

    return (
        <div className="flex h-screen bg-[#08090D] text-white overflow-hidden font-sans">
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Icon Picker Modal */}
            {iconPickerOpen && (
                <IconPicker
                    currentIcon={links.find(l => l.id === iconPickerOpen)?.icon || ''}
                    onSelect={(icon) => {
                        updateLink(iconPickerOpen, 'icon', icon);
                        setIconPickerOpen(null);
                    }}
                    onClose={() => setIconPickerOpen(null)}
                />
            )}

            {/* Sidebar Controls */}
            <div className="w-[450px] flex flex-col border-r border-white/5 bg-[#0D0F14]/95 backdrop-blur-xl h-full z-20 shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center gap-4 shrink-0 bg-[#0D0F14]">
                    <button
                        onClick={() => navigate('/bio')}
                        className="p-2 -ml-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Design Editor</h2>
                        <p className="text-xs text-zinc-500 font-medium">Customize your bio page</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
                    {/* Profile Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Type size={16} className="text-blue-500" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Profile Details</h3>
                        </div>

                        <div className="flex items-center gap-4">
                            <div
                                className="relative group cursor-pointer"
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-blue-500 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                                    <Upload size={14} className="text-white" />
                                </div>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </div>
                            <div className="flex-1 space-y-3">
                                <input
                                    type="text"
                                    value={profile.displayName}
                                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-600"
                                    placeholder="Display Name"
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500 font-mono">lenk.tr/</span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-blue-400 font-bold focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-600 font-mono"
                                        placeholder="your-slug"
                                    />
                                </div>
                            </div>
                        </div>

                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-600 resize-none"
                            placeholder="Write a short bio..."
                        />
                    </div>

                    <div className="h-px bg-white/5"></div>

                    {/* Links Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <GripVertical size={16} className="text-purple-500" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Links</h3>
                            </div>
                            <button onClick={addLink} className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1">
                                <Plus size={14} /> Add New
                            </button>
                        </div>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={links.map(link => link.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2">
                                    {links.map((link) => (
                                        <SortableLinkItem
                                            key={link.id}
                                            link={link}
                                            updateLink={updateLink}
                                            toggleLinkVisibility={toggleLinkVisibility}
                                            deleteLink={deleteLink}
                                            setIconPickerOpen={setIconPickerOpen}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    <div className="h-px bg-white/5"></div>

                    {/* Social Media Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-pink-500 font-bold text-lg">@</span>
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Socials</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {socialMedia.map((social) => (
                                <div key={social.platform} className="flex items-center gap-4 mb-4">
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className="text-2xl">{socialIcons[social.platform]}</div>
                                        <span className="text-sm font-medium text-zinc-300 capitalize">{social.platform}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleSocialMedia(social.platform)}
                                        className={`w-9 h-5 rounded-full transition-colors relative ${social.isActive ? 'bg-blue-500' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all shadow-sm ${social.isActive ? 'left-5' : 'left-1'}`}></div>
                                    </button>
                                    {social.isActive && (
                                        <input
                                            type="text"
                                            value={social.url}
                                            onChange={(e) => {
                                                setSocialMedia(socialMedia.map(s =>
                                                    s.platform === social.platform ? { ...s, url: e.target.value } : s
                                                ));
                                            }}
                                            placeholder={`Your ${social.platform} URL`}
                                            className="flex-1 px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-white/5"></div>

                    {/* Visual Style */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Palette size={16} className="text-pink-500" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Appearance</h3>
                        </div>

                        {/* Theme Colors */}
                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setProfile({
                                        ...profile,
                                        theme: theme.id,
                                        customColors: { color1: theme.colors[0], color2: theme.colors[1] }
                                    })}
                                    className={`aspect-square rounded-full bg-gradient-to-br ${theme.gradient} border-2 transition-all ${profile.theme === theme.id ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                    title={theme.name}
                                />
                            ))}
                        </div>

                        {/* Custom Gradient */}
                        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                            <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider">Custom Gradient</label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <ColorPicker
                                        label="Start Color"
                                        value={profile.customColors.color1}
                                        onChange={(val) => setProfile({ ...profile, customColors: { ...profile.customColors, color1: val } })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <ColorPicker
                                        label="End Color"
                                        value={profile.customColors.color2}
                                        onChange={(val) => setProfile({ ...profile, customColors: { ...profile.customColors, color2: val } })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Font Selection */}
                        <div className="mb-6 relative">
                            <label className="block text-xs font-bold text-zinc-500 mb-2">Font Family</label>
                            <button
                                onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                                className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                            >
                                <span style={{ fontFamily: profile.font }} className="text-sm font-medium">
                                    {fonts.find(f => f.family === profile.font)?.name || 'System Font'}
                                </span>
                                <ChevronDown size={16} className={`text-zinc-500 transition-transform ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isFontDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-[#1A1C23] border border-white/10 rounded-xl shadow-2xl z-50 custom-scrollbar">
                                    {fonts.map((font) => (
                                        <button
                                            key={font.name}
                                            onClick={() => {
                                                setProfile({ ...profile, font: font.family });
                                                setIsFontDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center justify-between group transition-colors"
                                        >
                                            <span style={{ fontFamily: font.family }} className="text-sm text-zinc-300 group-hover:text-white">
                                                {font.name}
                                            </span>
                                            {profile.font === font.family && <Check size={14} className="text-blue-500" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Settings Section */}
                        <div className="h-px bg-white/5"></div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity size={16} className="text-orange-500" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Page Settings</h3>
                            </div>

                            {/* Pro Features Group */}
                            <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-[10px] font-black text-black">PRO</div>

                                {/* Schedule Date */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                            <Calendar size={14} /> Schedule Date
                                        </label>
                                        <span className="text-[10px] text-zinc-600 font-mono">None</span>
                                    </div>
                                    <input type="datetime-local" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" disabled />
                                </div>

                                {/* Expiration Date */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                            <Calendar size={14} /> Expiration Date
                                        </label>
                                        <span className="text-[10px] text-zinc-600 font-mono">None</span>
                                    </div>
                                    <input type="datetime-local" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" disabled />
                                </div>

                                {/* Pixels */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                            <Activity size={14} /> Tracking Pixels
                                        </label>
                                    </div>
                                    <button className="w-full py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2">
                                        <Plus size={14} /> Attach Pixel
                                    </button>
                                </div>
                            </div>

                            {/* Standard Settings */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                            <Cookie size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-300">Cookie Consent</span>
                                    </div>
                                    <button
                                        onClick={() => setProfile({ ...profile, cookieConsent: !profile.cookieConsent })}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${profile.cookieConsent ? 'bg-blue-500' : 'bg-white/10'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all shadow-sm ${profile.cookieConsent ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                            <ShieldAlert size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-300">Adult Warning</span>
                                    </div>
                                    <button
                                        onClick={() => setProfile({ ...profile, adultWarning: !profile.adultWarning })}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${profile.adultWarning ? 'bg-red-500' : 'bg-white/10'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all shadow-sm ${profile.adultWarning ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                            <Check size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-300">Verified Icon</span>
                                    </div>
                                    <button
                                        onClick={() => setProfile({ ...profile, verifiedIcon: !profile.verifiedIcon })}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${profile.verifiedIcon ? 'bg-green-500' : 'bg-white/10'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all shadow-sm ${profile.verifiedIcon ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                            <Share2 size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-300">Share Button</span>
                                    </div>
                                    <button
                                        onClick={() => setProfile({ ...profile, shareButton: !profile.shareButton })}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${profile.shareButton ? 'bg-purple-500' : 'bg-white/10'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all shadow-sm ${profile.shareButton ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Button Styles */}
                        <div className="h-px bg-white/5 mb-4 mt-6"></div>
                        <label className="block text-xs font-bold text-zinc-500 mb-2">Button Style</label>
                        <div className="grid grid-cols-2 gap-2">
                            {uiStyles.slice(0, 6).map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => setProfile({ ...profile, uiStyle: style.id })}
                                    className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all ${profile.uiStyle === style.id ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                                >
                                    {style.name}
                                </button>
                            ))}
                        </div>

                        {/* Background Image */}
                        <div className="mt-6">
                            <ImageUploader
                                label="Background Image"
                                value={profile.backgroundImage}
                                onChange={(val) => setProfile({ ...profile, backgroundImage: val })}
                                bucket="bio-images"
                            />

                            {profile.backgroundImage && (
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-2 mt-4">Image Adjustments</label>
                                        <div className="space-y-4">
                                            {/* Opacity Slider */}
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-[10px] uppercase font-bold text-zinc-400">Overlay Opacity</span>
                                                    <span className="text-[10px] font-bold text-zinc-300">{profile.backgroundOpacity}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="90"
                                                    value={profile.backgroundOpacity}
                                                    onChange={(e) => setProfile({ ...profile, backgroundOpacity: e.target.value })}
                                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
                                                />
                                            </div>

                                            {/* Blur Slider */}
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-[10px] uppercase font-bold text-zinc-400">Blur Amount</span>
                                                    <span className="text-[10px] font-bold text-zinc-300">{profile.backgroundBlur}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50"
                                                    value={profile.backgroundBlur}
                                                    onChange={(e) => setProfile({ ...profile, backgroundBlur: e.target.value })}
                                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-[#0D0F14]">
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        glow
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <Activity size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* Right Preview */}
            <div className="flex-1 bg-[#08090D] relative flex items-center justify-center p-8 overflow-hidden">
                {/* Wallpaper Background */}
                <div className="absolute inset-0 opacity-100 transition-all duration-700"
                    style={profile.backgroundImage ? {
                        backgroundImage: `url(${profile.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: `blur(${Number(profile.backgroundBlur) + 20}px) brightness(0.4)` // Wallpaper always blurred more
                    } : {}}
                >
                    {!profile.backgroundImage && <div className="absolute inset-0 bg-[#08090D]"></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-[400px] h-[800px] animate-fade-in-up">
                    <div className="relative w-full h-full border-[8px] border-[#1a1a1a] rounded-[3rem] shadow-2xl bg-[#000] overflow-hidden">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#1a1a1a] rounded-b-2xl z-50"></div>

                        {/* Screen Content */}
                        <div
                            className="w-full h-full overflow-y-auto no-scrollbar relative"
                            style={{
                                ...(profile.backgroundImage ? {
                                    backgroundImage: `url(${profile.backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                } : {
                                    background: `linear-gradient(135deg, ${profile.customColors.color1}, ${profile.customColors.color2})`
                                }),
                                fontFamily: profile.font
                            }}
                        >
                            {/* Overlay controlled by slider */}
                            {profile.backgroundImage && (
                                <div
                                    className="absolute inset-0 transition-all duration-300"
                                    style={{
                                        backgroundColor: `rgba(0,0,0, ${profile.backgroundOpacity / 100})`,
                                        backdropFilter: `blur(${profile.backgroundBlur}px)`
                                    }}
                                ></div>
                            )}

                            {/* Adult Warning Overlay */}
                            {profile.adultWarning && (
                                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                                    <AlertTriangle size={48} className="text-red-500 mb-4" />
                                    <h3 className="text-xl font-black text-white mb-2 uppercase">Sensitive Content</h3>
                                    <p className="text-xs text-zinc-400 mb-6 font-medium">This page may contain content that is not suitable for all audiences.</p>
                                    <button className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-red-600 transition-colors w-full">I am 18+</button>
                                </div>
                            )}

                            <div className="relative z-10 flex flex-col min-h-full pt-16 px-6 pb-12">
                                {/* Share Button */}
                                {profile.shareButton && (
                                    <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all z-20">
                                        <Share2 size={18} />
                                    </button>
                                )}

                                {/* Avatar & Info */}
                                <div className="flex flex-col items-center text-center mb-8 mt-4">
                                    <div className="mb-4 relative group">
                                        <div className="w-24 h-24 rounded-full border-2 border-white/50 p-1 overflow-hidden shadow-lg">
                                            <img src={profile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                        </div>
                                    </div>

                                    {/* Name with Verified Badge */}
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <h1 className="text-xl font-bold text-white drop-shadow-md">{profile.displayName}</h1>
                                        {profile.verifiedIcon && (
                                            <div className="bg-blue-500 text-white p-0.5 rounded-full" title="Verified">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm text-white/90 mb-6 max-w-[280px] leading-relaxed drop-shadow-sm font-medium">{profile.bio}</p>
                                </div>

                                {/* Links */}
                                <div className="w-full space-y-3 mb-8">
                                    {links.filter(l => l.isActive).map((link) => {
                                        const style = uiStyles.find(s => s.id === profile.uiStyle) || uiStyles[0];
                                        return (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`block w-full py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center relative group ${style.linkStyle}`}
                                            >
                                                <span className="absolute left-6 text-xl opacity-80">{link.icon}</span>
                                                <span className="font-semibold">{link.title}</span>
                                            </a>
                                        );
                                    })}
                                </div>

                                {/* Socials */}
                                {socialMedia.some(s => s.isActive && s.url) && (
                                    <div className="flex flex-wrap justify-center gap-3 mt-auto">
                                        {socialMedia.filter(s => s.isActive && s.url).map(social => (
                                            <a key={social.platform} href={social.url} className="text-white/80 hover:text-white hover:scale-110 transition-all text-2xl drop-shadow-md">
                                                {socialIcons[social.platform]}
                                            </a>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-8 mb-4 flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-black"></div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">lenk.tr</span>
                                </div>

                                {/* Cookie Consent Banner */}
                                {profile.cookieConsent && (
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl p-3 rounded-xl border border-white/20 shadow-lg animate-fade-in-up z-40 text-left flex items-center justify-between gap-3">
                                        <div className="flex-1">
                                            <p className="text-[9px] font-bold text-black leading-tight">We use cookies to ensure you get the best experience on our website.</p>
                                        </div>
                                        <button className="px-3 py-1.5 bg-black text-white text-[9px] font-bold rounded-lg whitespace-nowrap">Got it!</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BioLinkEditor;
