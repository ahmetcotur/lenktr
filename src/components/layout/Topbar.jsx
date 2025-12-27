import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Globe, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationsList, setNotificationsList] = useState([
        { id: 1, text: "New click from United States", time: "2m ago", read: false },
        { id: 2, text: "System optimized successfully", time: "1h ago", read: false },
        { id: 3, text: "New feature: Dark Mode", time: "1d ago", read: true },
    ]);

    const unreadCount = notificationsList.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    };

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const userRole = user?.user_metadata?.role || 'Operator';
    const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.avatar;

    return (
        <header className="h-16 md:h-20 border-b border-white/5 bg-[#08090D]/50 backdrop-blur-2xl flex items-center justify-between px-4 md:px-8 lg:px-10 sticky top-0 z-40">
            <div className="flex items-center gap-4 md:gap-6 flex-1 max-w-lg lg:max-w-xl">
                {/* Mobile Menu Trigger Placeholder */}
                <button className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5">
                    <Command size={18} />
                </button>
                <div className="relative w-full group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search system protocols..."
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-12 pr-4 md:pr-16 py-2 md:py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/30 focus:bg-zinc-900 transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 hidden lg:flex items-center gap-1.5 pointer-events-none">
                        <div className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-black text-zinc-600 flex items-center gap-1">
                            <Command size={10} /> K
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 pl-4 lg:pl-10 lg:border-l border-white/5 h-10 ml-4 lg:ml-10">
                {/* Global Connection Status */}
                <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full glass-effect">
                    <Globe size={14} className="text-lime-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Node: US-E3</span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative transition-all hover:scale-110 ${showNotifications ? 'text-white scale-110' : 'text-gray-600 hover:text-white'}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-[#08090D] shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                            <div className="absolute top-full right-0 mt-6 w-80 bg-[#0D0F14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-up origin-top-right">
                                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-[10px] uppercase font-black tracking-wider text-blue-500 hover:text-blue-400"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notificationsList.length > 0 ? (
                                        notificationsList.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => {
                                                    markAsRead(n.id);
                                                    // In a real app we might navigate here
                                                }}
                                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group flex gap-3 ${!n.read ? 'bg-blue-600/[0.02]' : ''}`}
                                            >
                                                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${!n.read ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-transparent border border-zinc-700'}`}></div>
                                                <div className="flex-1">
                                                    <p className={`text-sm mb-1 ${!n.read ? 'text-white font-medium' : 'text-zinc-500'}`}>{n.text}</p>
                                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{n.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <p className="text-zinc-500 text-sm">No new notifications</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-white/[0.02] border-t border-white/5">
                                    <button
                                        onClick={() => {
                                            navigate('/settings?tab=notifications');
                                            setShowNotifications(false);
                                        }}
                                        className="w-full py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        View All Settings
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div
                    onClick={() => navigate('/settings?tab=profile')}
                    className="flex items-center gap-4 group cursor-pointer"
                >
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-white group-hover:text-blue-500 transition-colors">{userName}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 group-hover:text-gray-400 transition-colors">{userRole}</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 group-hover:rotate-6 transition-transform duration-500 shadow-xl">
                            <div className="w-full h-full bg-[#161A22] rounded-[14px] flex items-center justify-center overflow-hidden">
                                {userAvatar ? (
                                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-white font-black text-lg">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
