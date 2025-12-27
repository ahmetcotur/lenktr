import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    MoreVertical,
    ExternalLink,
    Edit3,
    Eye,
    BarChart2,
    Copy,
    Layout,
    Smartphone,
    Trash2,
    Archive,
    Check
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { createClient } from '../utils/supabase/client';
import { useAuth } from '../context/AuthContext';

const supabase = createClient();

const BioPagesList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bioPages, setBioPages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [activeMenu, setActiveMenu] = React.useState(null); // ID of the page whose menu is open

    const fetchBioPages = React.useCallback(async () => {
        console.log('fetchBioPages called, user:', user);
        if (!user) {
            console.log('No user, skipping fetch');
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            console.log('Fetching bio pages for user:', user.id);
            const { data, error } = await supabase
                .from('bio_pages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            console.log('Bio pages response:', { data, error });
            if (error) throw error;
            setBioPages(data || []);
        } catch (err) {
            console.error('Error fetching bio pages:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]); // Changed from [user] to [user?.id] to prevent infinite loop

    React.useEffect(() => {
        fetchBioPages();
    }, [fetchBioPages]);

    const deletePage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bio page? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('bio_pages')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setBioPages(bioPages.filter(p => p.id !== id));
        } catch (err) {
            alert('Error deleting page: ' + err.message);
        }
    };

    const togglePublish = async (id, isPublished) => {
        try {
            const { error } = await supabase
                .from('bio_pages')
                .update({ is_published: !isPublished })
                .eq('id', id);

            if (error) throw error;
            setBioPages(bioPages.map(p => p.id === id ? { ...p, is_published: !isPublished } : p));
        } catch (err) {
            alert('Error updating page: ' + err.message);
        }
    };

    const copyUrl = (slug) => {
        const url = `${window.location.origin}/${slug}`;
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
    };

    return (
        <div className="space-y-10 animate-fade-in font-sans pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <Badge variant="primary" className="mb-2">Bio Pages</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-white font-heading">My Pages</h1>
                    <p className="text-zinc-500 font-medium max-w-xl">Create and manage your personal landing pages.</p>
                </div>
                <Button variant="primary" size="lg" glow onClick={() => navigate('/bio/editor')}>
                    <Plus size={18} className="mr-2" /> Create New Page
                </Button>
            </div>

            {/* Grid of Bio Pages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full p-20 text-center space-y-4">
                        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
                        <p className="text-zinc-700 text-xs">User: {user ? 'Authenticated' : 'Not authenticated'}</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full p-20 text-center border border-dashed border-red-500/20 rounded-3xl bg-red-500/5">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                            <Layout size={32} />
                        </div>
                        <h3 className="text-white font-bold mb-2">Error Loading Pages</h3>
                        <p className="text-red-500 text-sm mb-8">{error}</p>
                        <Button variant="primary" size="md" onClick={fetchBioPages}>
                            Try Again
                        </Button>
                    </div>
                ) : bioPages.length === 0 ? (
                    <div className="col-span-full p-20 text-center border border-dashed border-white/5 rounded-3xl bg-zinc-900/10">
                        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-700">
                            <Layout size={32} />
                        </div>
                        <h3 className="text-white font-bold mb-2">No bio pages found</h3>
                        <p className="text-zinc-600 text-sm mb-8">Create your first highly customizable bio landing page.</p>
                        <Button variant="primary" size="md" onClick={() => navigate('/bio/editor')}>
                            <Plus size={16} className="mr-2" /> Create First Page
                        </Button>
                    </div>
                ) : bioPages.map((page) => (
                    <div key={page.id} className="group relative bg-[#0D0F14] border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all duration-300 flex flex-col">

                        {/* Preview Area (Top Half) */}
                        <div className="h-48 bg-zinc-900/50 relative overflow-hidden rounded-t-3xl group-hover:bg-zinc-900/30 transition-colors">
                            {/* Mockup Preview */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:scale-105 transition-transform duration-500">
                                {page.theme_settings?.avatar ? (
                                    <img src={page.theme_settings.avatar} alt={page.profile_title} className="w-full h-full object-cover blur-sm opacity-50" />
                                ) : (
                                    <div className="text-zinc-700">
                                        <Layout size={64} strokeWidth={1} />
                                    </div>
                                )}
                            </div>

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate(`/bio/editor?id=${page.id}`)} // Pass ID
                                    className="shadow-xl"
                                >
                                    <Edit3 size={14} className="mr-2" /> Edit Design
                                </Button>
                                <Button variant="secondary" size="sm" className="bg-black/50 border border-white/10 text-white hover:bg-black/70">
                                    <Eye size={14} />
                                </Button>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                <Badge variant={page.is_published ? 'success' : 'primary'} className="shadow-lg backdrop-blur-md bg-black/50 border-white/10">
                                    {page.is_published ? 'Active' : 'Draft'}
                                </Badge>
                            </div>
                        </div>

                        {/* Info Area (Bottom Half) */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{page.profile_title || 'Untitled'}</h3>
                                    <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-zinc-500 hover:text-white transition-colors mt-1 inline-flex items-center gap-1">
                                        lenk.tr/{page.slug} <ExternalLink size={10} />
                                    </a>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === page.id ? null : page.id)}
                                        className="text-zinc-600 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenu === page.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setActiveMenu(null)}
                                            ></div>
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0D0F14] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden py-1">
                                                <button
                                                    onClick={() => navigate(`/bio/editor?id=${page.id}`)}
                                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                                >
                                                    <Edit3 size={14} /> Edit Design
                                                </button>
                                                <button
                                                    onClick={() => copyUrl(page.slug)}
                                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                                >
                                                    <Copy size={14} /> Copy URL
                                                </button>
                                                <button
                                                    onClick={() => togglePublish(page.id, page.is_published)}
                                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                                >
                                                    <Archive size={14} /> {page.is_published ? 'Unpublish' : 'Publish'}
                                                </button>
                                                <div className="h-px bg-white/5 my-1"></div>
                                                <button
                                                    onClick={() => deletePage(page.id)}
                                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                                                >
                                                    <Trash2 size={14} /> Delete Page
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <BarChart2 size={14} className="text-zinc-600" />
                                    <span className="text-zinc-400">0</span> Views
                                </div>
                                <div className="flex items-center gap-2">
                                    <Smartphone size={14} className="text-zinc-600" />
                                    <span className="text-zinc-400">{page.theme_settings?.uiStyle || 'Glass'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Card Placeholder */}
                <button
                    onClick={() => navigate('/bio/editor')}
                    className="group relative h-full min-h-[300px] rounded-3xl border-2 border-dashed border-white/5 hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all flex flex-col items-center justify-center gap-4 text-zinc-600 hover:text-blue-500"
                >
                    <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-blue-500/10 flex items-center justify-center transition-colors">
                        <Plus size={32} />
                    </div>
                    <span className="font-bold text-lg">Create Page</span>
                </button>
            </div>
        </div>
    );
};

export default BioPagesList;
