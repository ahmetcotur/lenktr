import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Link2,
    UserCircle,
    BarChart3,
    Settings,
    LogOut,
    Zap,
    ShieldCheck,
    Cpu,
    Network
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const { signOut, user } = useAuth();

    const handleLogout = async () => {
        const { error } = await signOut();
        if (error) {
            console.error('Logout failed:', error.message);
        } else {
            navigate('/login');
        }
    };
    const links = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Cpu, label: 'My Links', path: '/links' },
        { icon: UserCircle, label: 'Bio Page', path: '/bio' },
        { icon: Network, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-[300px] bg-[#08090D] border-r border-white/5 h-screen flex flex-col fixed left-0 top-0 z-50">
            <div className="p-10 mb-8">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-105 transition-all duration-500">
                        <Zap size={28} className="text-white fill-current" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black tracking-tighter font-heading text-white italic">LENK.tr</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60">SIMPLE LINK MANAGEMENT</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-8 space-y-4">
                <div className="px-4 mb-6">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-700">DASHBOARD</span>
                </div>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
              flex items-center justify-between px-5 py-5 rounded-2xl transition-all duration-500 group
              ${isActive
                                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/[0.03] border border-transparent'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-5">
                                    <link.icon size={22} className={isActive ? 'text-blue-500' : 'text-gray-700 group-hover:text-blue-500 transition-all duration-500'} />
                                    <span className="text-sm font-black uppercase tracking-widest">{link.label}</span>
                                </div>
                                {link.path === '/analytics' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-8 m-6 mt-auto rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 border border-blue-500/20">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white leading-none mb-2 italic tracking-tighter uppercase">System Status</p>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Active</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/upgrade')}
                    className="w-full py-4 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all"
                >
                    Upgrade Plan
                </button>
            </div>

            <div className="p-6 border-t border-white/5 relative">
                <button
                    onClick={() => {
                        const menu = document.getElementById('user-menu');
                        menu.classList.toggle('hidden');
                    }}
                    className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
                        {user?.user_metadata?.avatar_url || user?.user_metadata?.avatar ? (
                            <img src={user.user_metadata.avatar_url || user.user_metadata.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-zinc-600 font-black text-xs">
                                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-bold text-white leading-none mb-1 truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</p>
                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none truncate">{user?.user_metadata?.role || 'Operator'}</p>
                    </div>
                    <div className="relative">
                        <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1 border border-[#08090D]"></div>
                        <Settings size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                </button>

                {/* User Menu Dropdown */}
                <div id="user-menu" className="hidden absolute bottom-full left-6 right-6 mb-2 bg-[#0D0F14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 animate-fade-in-up origin-bottom">
                    <button onClick={() => navigate('/settings?tab=profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm font-medium">
                        <UserCircle size={16} /> Profile Settings
                    </button>
                    <button onClick={() => navigate('/settings?tab=notifications')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm font-medium justify-between">
                        <div className="flex items-center gap-3">
                            <Zap size={16} /> Notifications
                        </div>
                        <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">2</span>
                    </button>
                    <div className="h-px bg-white/5 my-1"></div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all text-sm font-medium"
                    >
                        <LogOut size={16} /> Log Out
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
