import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Smartphone,
    Mail,
    Lock,
    Globe,
    Check,
    Upload,
    LogOut
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { createClient } from '../utils/supabase/client';
import { uploadImage } from '../utils/supabase/storage';
import { useTranslation } from 'react-i18next';

const supabase = createClient();

const SettingsPage = () => {
    const { t } = useTranslation();
    const { user: authUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';
    const avatarInputRef = useRef(null);

    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    const [profile, setProfile] = useState({
        name: authUser?.user_metadata?.full_name || '',
        email: authUser?.email || '',
        avatar: authUser?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
        role: authUser?.user_metadata?.role || 'Operator'
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const { url, error } = await uploadImage(file, 'avatars', authUser.id);

            if (error) {
                setMessage({ type: 'error', text: t('settings.profile.uploadError') });
                return;
            }

            setProfile({ ...profile, avatar: url });
            setMessage({ type: 'success', text: t('settings.profile.uploadSuccess') });
        } catch (error) {
            console.error('Avatar upload error:', error);
            setMessage({ type: 'error', text: t('settings.profile.uploadError') });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: profile.name,
                    avatar_url: profile.avatar
                }
            });

            if (authError) throw authError;

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.name,
                    avatar_url: profile.avatar
                })
                .eq('id', authUser.id);

            if (profileError) throw profileError;

            setMessage({ type: 'success', text: t('settings.profile.updateSuccess') });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const [notifications, setNotifications] = useState({
        email_leads: true,
        email_updates: false,
        push_comments: true,
        push_mentions: true
    });

    const tabs = [
        { id: 'profile', label: t('settings.tabs.profile'), icon: User },
        { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
        { id: 'security', label: t('settings.tabs.security'), icon: Shield },
        { id: 'billing', label: t('settings.tabs.billing'), icon: CreditCard },
    ];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase mb-2">{t('settings.header.title')}</h1>
                <p className="text-zinc-500 font-medium">{t('settings.header.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-wide ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-[#0D0F14] border border-white/5 rounded-3xl p-6 md:p-8">

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6">{t('settings.profile.title')}</h2>
                                    {message && (
                                        <div className={`p-4 rounded-xl border text-xs font-bold uppercase tracking-wider text-center ${message.type === 'success' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 bg-zinc-900 flex items-center justify-center">
                                                {profile.avatar ? (
                                                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={32} className="text-zinc-700" />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => avatarInputRef.current?.click()}
                                                disabled={loading}
                                                className="absolute -bottom-2 -right-2 p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Upload size={14} />
                                            </button>
                                            <input
                                                ref={avatarInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                className="hidden"
                                                disabled={loading}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">{profile.name || t('settings.profile.anonymous')}</h3>
                                            <p className="text-zinc-500 text-sm mb-3">{profile.role}</p>
                                            <button
                                                onClick={() => setProfile({ ...profile, avatar: '' })}
                                                disabled={loading}
                                                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {t('settings.profile.removePhoto')}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">{t('settings.profile.displayName')}</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">{t('settings.profile.email')}</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white/50 text-sm focus:outline-none cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-white/5 pt-6 flex justify-end">
                                    <Button variant="primary" glow onClick={handleUpdateProfile} disabled={loading}>
                                        {loading ? t('common.saving') : t('common.saveChanges')}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6">{t('settings.notifications.title')}</h2>
                                    <p className="text-zinc-500 text-sm mb-8">{t('settings.notifications.subtitle')}</p>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Mail size={20} /></div>
                                                <div>
                                                    <h4 className="text-white font-bold text-sm">{t('settings.notifications.email.title')}</h4>
                                                    <p className="text-zinc-500 text-xs">{t('settings.notifications.email.desc')}</p>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setNotifications({ ...notifications, email_leads: !notifications.email_leads })}
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications.email_leads ? 'bg-blue-600' : 'bg-zinc-700'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.email_leads ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><Smartphone size={20} /></div>
                                                <div>
                                                    <h4 className="text-white font-bold text-sm">{t('settings.notifications.push.title')}</h4>
                                                    <p className="text-zinc-500 text-xs">{t('settings.notifications.push.desc')}</p>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setNotifications({ ...notifications, push_comments: !notifications.push_comments })}
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications.push_comments ? 'bg-blue-600' : 'bg-zinc-700'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.push_comments ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-lime-500/10 rounded-xl text-lime-500"><Globe size={20} /></div>
                                                <div>
                                                    <h4 className="text-white font-bold text-sm">{t('settings.notifications.marketing.title')}</h4>
                                                    <p className="text-zinc-500 text-xs">{t('settings.notifications.marketing.desc')}</p>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setNotifications({ ...notifications, email_updates: !notifications.email_updates })}
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications.email_updates ? 'bg-blue-600' : 'bg-zinc-700'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.email_updates ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6">{t('settings.security.title')}</h2>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h4 className="text-white font-bold">{t('settings.security.password.title')}</h4>
                                                    <p className="text-zinc-500 text-sm">{t('settings.security.password.lastChanged')}</p>
                                                </div>
                                                <Button variant="outline" size="sm">{t('settings.security.password.action')}</Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                    <input type="password" placeholder={t('settings.security.password.placeholder')} className="w-full bg-[#08090D] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <div>
                                                <h4 className="text-white font-bold flex items-center gap-2">
                                                    {t('settings.security.2fa.title')}
                                                    <Badge variant="default" size="sm" className="bg-zinc-700 text-zinc-300 border-none">{t('settings.security.2fa.disabled')}</Badge>
                                                </h4>
                                                <p className="text-zinc-500 text-sm max-w-sm mt-1">{t('settings.security.2fa.desc')}</p>
                                            </div>
                                            <Button variant="primary">{t('settings.security.2fa.action')}</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BILLING TAB */}
                        {activeTab === 'billing' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6">{t('settings.billing.title')}</h2>

                                    <div className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-500/20 mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-1">{t('settings.billing.plan.current')}</p>
                                                <h3 className="text-2xl font-black text-white uppercase italic">{t('settings.billing.plan.free')}</h3>
                                            </div>
                                            <Badge variant="primary" className="bg-blue-600 text-white">{t('settings.billing.plan.active')}</Badge>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
                                            <div className="h-full w-3/4 bg-blue-500"></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-400 mb-6">
                                            <span>{t('settings.billing.plan.usage')}</span>
                                            <span>{t('settings.billing.plan.reset')}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="primary" glow onClick={() => window.location.href = '/upgrade'}>{t('settings.billing.plan.upgrade')}</Button>
                                            <Button variant="outline">{t('settings.billing.plan.manage')}</Button>
                                        </div>
                                    </div>

                                    <h4 className="text-white font-bold mb-4">{t('settings.billing.payment.title')}</h4>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-white rounded-lg">
                                                {/* Generic Mastercard Icon */}
                                                <div className="flex -space-x-2">
                                                    <div className="w-4 h-4 rounded-full bg-red-500 opacity-80"></div>
                                                    <div className="w-4 h-4 rounded-full bg-orange-500 opacity-80"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-bold">{t('settings.billing.payment.method')}</p>
                                                <p className="text-zinc-500 text-xs">{t('settings.billing.payment.expires')}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">{t('common.edit')}</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
