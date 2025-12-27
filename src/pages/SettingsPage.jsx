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

const supabase = createClient();

const SettingsPage = () => {
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
                setMessage({ type: 'error', text: 'Failed to upload avatar. Please try again.' });
                return;
            }

            setProfile({ ...profile, avatar: url });
            setMessage({ type: 'success', text: 'Avatar uploaded successfully! Click Save Changes to update.' });
        } catch (error) {
            console.error('Avatar upload error:', error);
            setMessage({ type: 'error', text: 'Failed to upload avatar. Please try again.' });
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

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Settings</h1>
                <p className="text-zinc-500 font-medium">Manage your account preferences and workspace settings.</p>
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
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6">Public Profile</h2>
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
                                            <h3 className="text-white font-bold text-lg mb-1">{profile.name || 'Anonymous User'}</h3>
                                            <p className="text-zinc-500 text-sm mb-3">{profile.role}</p>
                                            <button
                                                onClick={() => setProfile({ ...profile, avatar: '' })}
                                                disabled={loading}
                                                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Remove Picture
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Display Name</label>
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
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Email Address</label>
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
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6">Notification Preferences</h2>
                                    <p className="text-zinc-500 text-sm mb-8">Manage how you receive updates and alerts.</p>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Mail size={20} /></div>
                                                <div>
                                                    <h4 className="text-white font-bold text-sm">Email Notifications</h4>
                                                    <p className="text-zinc-500 text-xs">Receive daily summaries and lead alerts.</p>
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
                                                    <h4 className="text-white font-bold text-sm">Push Notifications</h4>
                                                    <p className="text-zinc-500 text-xs">Real-time alerts for new clicks and activity.</p>
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
                                                    <h4 className="text-white font-bold text-sm">Marketing Updates</h4>
                                                    <p className="text-zinc-500 text-xs">News about product features and tips.</p>
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
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6">Security Settings</h2>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h4 className="text-white font-bold">Password</h4>
                                                    <p className="text-zinc-500 text-sm">Last changed 3 months ago.</p>
                                                </div>
                                                <Button variant="outline" size="sm">Update Password</Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                    <input type="password" placeholder="Current Password" className="w-full bg-[#08090D] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <div>
                                                <h4 className="text-white font-bold flex items-center gap-2">
                                                    Two-Factor Authentication
                                                    <Badge variant="default" size="sm" className="bg-zinc-700 text-zinc-300 border-none">Disabled</Badge>
                                                </h4>
                                                <p className="text-zinc-500 text-sm max-w-sm mt-1">Add an extra layer of security to your account using an authenticator app.</p>
                                            </div>
                                            <Button variant="primary">Enable 2FA</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BILLING TAB */}
                        {activeTab === 'billing' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6">Billing & Plan</h2>

                                    <div className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-500/20 mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-1">Current Plan</p>
                                                <h3 className="text-2xl font-black text-white uppercase italic">Free Starter</h3>
                                            </div>
                                            <Badge variant="primary" className="bg-blue-600 text-white">Active</Badge>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
                                            <div className="h-full w-3/4 bg-blue-500"></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-400 mb-6">
                                            <span>750 / 1000 clicks used</span>
                                            <span>Resets in 12 days</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="primary" glow onClick={() => window.location.href = '/upgrade'}>Upgrade to Pro</Button>
                                            <Button variant="outline">Manage Subscription</Button>
                                        </div>
                                    </div>

                                    <h4 className="text-white font-bold mb-4">Payment Methods</h4>
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
                                                <p className="text-white text-sm font-bold">Mastercard ending in 4242</p>
                                                <p className="text-zinc-500 text-xs">Expires 12/28</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">Edit</Button>
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
