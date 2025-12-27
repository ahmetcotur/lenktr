import React from 'react';
import {
    Plus,
    Search,
    Filter,
    Link2,
    Copy,
    ExternalLink,
    MoreVertical,
    MousePointer2,
    Calendar,
    Share2,
    Globe,
    Lock,
    Zap,
    ChevronRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import BoostOverlay from '../components/overlays/BoostOverlay';
import StatsOverlay from '../components/overlays/StatsOverlay';
import EditLinkOverlay from '../components/overlays/EditLinkOverlay';
import { useNavigate } from 'react-router-dom';
import { createClient } from '../utils/supabase/client';

const supabase = createClient();

const ShortLinkManager = () => {
    const navigate = useNavigate();
    const [activeOverlay, setActiveOverlay] = React.useState({ type: null, link: null });
    const [links, setLinks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const fetchLinks = React.useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLinks(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const deleteLink = async (id) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;

        try {
            const { error } = await supabase
                .from('links')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setLinks(links.filter(link => link.id !== id));
        } catch (err) {
            alert('Error deleting link: ' + err.message);
        }
    };

    const toggleArchive = async (id, isArchived) => {
        try {
            const { error } = await supabase
                .from('links')
                .update({ is_archived: !isArchived })
                .eq('id', id);

            if (error) throw error;
            setLinks(links.map(link => link.id === id ? { ...link, is_archived: !isArchived } : link));
        } catch (err) {
            alert('Error updating link: ' + err.message);
        }
    };

    const openOverlay = (type, link) => {
        setActiveOverlay({ type, link });
    };

    const closeOverlay = () => {
        setActiveOverlay({ type: null, link: null });
        fetchLinks();
    };

    if (activeOverlay.type === 'boost' && activeOverlay.link) {
        return <BoostOverlay link={activeOverlay.link} onClose={closeOverlay} />;
    }

    if (activeOverlay.type === 'stats' && activeOverlay.link) {
        return <StatsOverlay link={activeOverlay.link} onClose={closeOverlay} />;
    }

    if (activeOverlay.type === 'edit' && activeOverlay.link) {
        return <EditLinkOverlay link={activeOverlay.link} onClose={closeOverlay} />;
    }

    return (
        <div className="space-y-10 animate-fade-in font-sans pb-20">
            {/* Header / Command Center */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <Badge variant="primary" className="mb-2">Link Manager</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-white font-heading underline decoration-blue-500/30 decoration-4 underline-offset-8">My Links</h1>
                    <p className="text-zinc-500 font-medium max-w-xl">Manage and track your shortened links in one place.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" size="md">
                        <Filter size={16} className="mr-2" /> Global Filter
                    </Button>
                    <Button
                        variant="primary"
                        size="lg"
                        glow
                        onClick={() => openOverlay('edit', null)}
                    >
                        <Plus size={18} className="mr-2" /> Create Link
                    </Button>
                </div>
            </div>

            {/* Quick Deploy Tool (Search & Create) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by link name or URL..."
                        className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-base text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/40 focus:bg-zinc-900/50 transition-all shadow-inner"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 px-4 py-4 rounded-2xl bg-zinc-900/20 border border-dashed border-white/10 flex items-center justify-center gap-3 text-zinc-600 cursor-pointer hover:border-blue-500/30 hover:text-blue-500 transition-all">
                        <Share2 size={18} />
                        <span className="text-sm font-bold uppercase tracking-widest">Share Links</span>
                    </div>
                </div>
            </div>

            {/* Main Links Table */}
            <div className="space-y-4">
                <div className="px-6 hidden md:grid grid-cols-12 gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600 border-b border-white/5 pb-4">
                    <div className="col-span-6">Short Link / Destination</div>
                    <div className="col-span-2 text-center">Analytics</div>
                    <div className="col-span-2 text-center">Created</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {loading ? (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                            <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
                        </div>
                    ) : links.length === 0 ? (
                        <div className="p-20 text-center border border-dashed border-white/5 rounded-3xl bg-zinc-900/10">
                            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-700">
                                <Link2 size={32} />
                            </div>
                            <h3 className="text-white font-bold mb-2">No links found</h3>
                            <p className="text-zinc-600 text-sm mb-8">Deploy your first shortened node to start tracking.</p>
                            <Button variant="primary" size="md" onClick={() => openOverlay('edit', null)}>
                                <Plus size={16} className="mr-2" /> Create First Link
                            </Button>
                        </div>
                    ) : (
                        links.map((link, i) => (
                            <div key={link.id || i} className="group relative bg-[#0D0F14]/40 border border-white/5 hover:border-blue-500/30 hover:bg-[#0D0F14]/60 rounded-2xl transition-all duration-300">
                                <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    {/* Details */}
                                    <div className="md:col-span-6 flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                            <Link2 size={20} />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">{link.title || 'Untitled Link'}</h3>
                                                <div className="flex md:hidden">
                                                    <Badge variant={!link.is_archived ? 'success' : 'primary'} className="scale-75 origin-left">{!link.is_archived ? 'Active' : 'Archived'}</Badge>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs">
                                                <span className="font-mono text-zinc-400 group-hover:text-white transition-colors">lenk.tr/{link.short_slug}</span>
                                                <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
                                                <span className="text-zinc-600 truncate max-w-[150px]">{link.original_url}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="md:col-span-2 flex flex-col items-center cursor-pointer group/stats" onClick={() => openOverlay('stats', link)}>
                                        <div className="flex items-center gap-2 text-white font-mono font-bold group-hover/stats:text-blue-400 transition-colors">
                                            <MousePointer2 size={14} className="text-lime-500" />
                                            {link.clicks || 0}
                                        </div>
                                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-tighter mt-1 group-hover/stats:text-blue-500/60 transition-colors">View Stats</span>
                                    </div>

                                    {/* Date */}
                                    <div className="md:col-span-2 flex flex-col items-center">
                                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                                            <Calendar size={14} />
                                            {new Date(link.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="md:col-span-2 flex items-center justify-end gap-4">
                                        <div className="hidden md:flex flex-col items-end gap-1">
                                            <Badge variant={!link.is_archived ? 'success' : 'primary'}>{!link.is_archived ? 'Active' : 'Archived'}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 relative">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`https://lenk.tr/${link.short_slug}`);
                                                    alert('Copied to clipboard!');
                                                }}
                                                className="p-2.5 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-all"
                                                title="Copy Link"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <div className="relative group/menu">
                                                <button className="p-2.5 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-all">
                                                    <MoreVertical size={16} />
                                                </button>
                                                {/* Dropdown Menu */}
                                                <div className="absolute right-0 top-full w-48 hidden group-hover/menu:block z-20">
                                                    <div className="h-2 w-full bg-transparent"></div>
                                                    <div className="bg-[#0D0F14] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                                        <div className="p-1">
                                                            <button
                                                                onClick={() => openOverlay('edit', link)}
                                                                className="w-full text-left px-3 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                            >
                                                                Edit Link
                                                            </button>
                                                            <button
                                                                onClick={() => toggleArchive(link.id, link.is_archived)}
                                                                className="w-full text-left px-3 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                            >
                                                                {link.is_archived ? 'Unarchive' : 'Archive'}
                                                            </button>
                                                            <div className="h-px bg-white/5 my-1"></div>
                                                            <button
                                                                onClick={() => deleteLink(link.id)}
                                                                className="w-full text-left px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar (Always Visible) */}
                                <div className="h-12 border-t border-white/5 bg-zinc-900/20 px-6 flex items-center justify-between rounded-b-2xl">
                                    <div className="flex gap-6">
                                        <a
                                            href={link.original_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-blue-500 flex items-center gap-2 transition-colors"
                                        >
                                            <ExternalLink size={12} /> Visit Link
                                        </a>
                                        <button
                                            onClick={() => openOverlay('boost', link)}
                                            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2 transition-colors"
                                        >
                                            <Zap size={12} /> Boost
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => navigate('/analytics')}
                                        className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        Full Stats <ChevronRight size={12} className="text-blue-500" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Registry Footer */}
            <div className="flex flex-col items-center gap-6 pt-10 border-t border-white/5">
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                    <span>Version 4.2.0</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                    <span>4 Links Active</span>
                </div>
                <Button variant="outline" size="lg" className="w-full md:w-auto">
                    Load More Links
                </Button>
            </div>
        </div>
    );
};

export default ShortLinkManager;
