import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Link2,
    MousePointer2,
    Eye,
    Plus,
    ExternalLink,
    UserCircle,
    Loader2,
    TrendingUp
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { createClient } from '../utils/supabase/client';
import { useAuth } from '../context/AuthContext';

const supabase = createClient();

const DashboardOverview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalClicks: 0,
        totalViews: 0,
        activeLinks: 0,
        activeBioPages: 0,
        recentLinks: [],
        recentBioPages: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Fetch all data for totals and recent items separately
                const [allLinksRes, allBioRes, recentLinksRes, recentBioRes] = await Promise.all([
                    // Get all links for totals
                    supabase
                        .from('links')
                        .select('clicks, is_archived')
                        .eq('user_id', user.id),
                    // Get all bio pages for totals
                    supabase
                        .from('bio_pages')
                        .select('views, is_published')
                        .eq('user_id', user.id),
                    // Get recent links for display
                    supabase
                        .from('links')
                        .select('id, title, short_slug, clicks, is_archived')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(5),
                    // Get recent bio pages for display
                    supabase
                        .from('bio_pages')
                        .select('id, profile_title, slug, views, is_published')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(5)
                ]);

                if (allLinksRes.error) throw allLinksRes.error;
                if (allBioRes.error) throw allBioRes.error;
                if (recentLinksRes.error) throw recentLinksRes.error;
                if (recentBioRes.error) throw recentBioRes.error;

                const allLinks = allLinksRes.data || [];
                const allBioPages = allBioRes.data || [];
                const recentLinks = recentLinksRes.data || [];
                const recentBioPages = recentBioRes.data || [];

                const totalClicks = allLinks.reduce((acc, l) => acc + (l.clicks || 0), 0);
                const totalViews = allBioPages.reduce((acc, p) => acc + (p.views || 0), 0);
                const activeLinks = allLinks.filter(l => !l.is_archived).length;
                const activeBioPages = allBioPages.filter(p => p.is_published).length;

                setDashboardData({
                    totalClicks,
                    totalViews,
                    activeLinks,
                    activeBioPages,
                    recentLinks: recentLinks.slice(0, 3),
                    recentBioPages: recentBioPages.slice(0, 3)
                });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 size={40} className="animate-spin text-blue-500 mx-auto" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Dashboard</h1>
                    <p className="text-zinc-500 font-medium">Welcome back! Here's your overview.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" size="md" onClick={() => navigate('/links')}>
                        <Link2 size={16} className="mr-2" /> Manage Links
                    </Button>
                    <Button variant="primary" size="md" glow onClick={() => navigate('/bio')}>
                        <UserCircle size={16} className="mr-2" /> Bio Pages
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <MousePointer2 size={24} />
                        </div>
                        <Badge variant="success" className="text-xs">
                            <TrendingUp size={12} className="mr-1" /> Live
                        </Badge>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{dashboardData.totalClicks.toLocaleString()}</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Clicks</p>
                </Card>

                <Card className="p-6 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Eye size={24} />
                        </div>
                        <Badge variant="success" className="text-xs">
                            <TrendingUp size={12} className="mr-1" /> Live
                        </Badge>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{dashboardData.totalViews.toLocaleString()}</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Bio Page Views</p>
                </Card>

                <Card className="p-6 hover:border-lime-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-lime-500/10 flex items-center justify-center text-lime-500">
                            <Link2 size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{dashboardData.activeLinks}</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Links</p>
                </Card>

                <Card className="p-6 hover:border-orange-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <UserCircle size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{dashboardData.activeBioPages}</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Bio Pages</p>
                </Card>
            </div>

            {/* Recent Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Links */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <Link2 size={20} className="text-blue-500" /> Recent Links
                        </h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/links')}>
                            View All
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {dashboardData.recentLinks.length === 0 ? (
                            <div className="text-center py-8 text-zinc-600">
                                <Link2 size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No links yet</p>
                                <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/links')}>
                                    <Plus size={14} className="mr-2" /> Create Link
                                </Button>
                            </div>
                        ) : (
                            dashboardData.recentLinks.map(link => (
                                <div key={link.id} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 hover:border-blue-500/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-white truncate">{link.title || link.short_slug}</h3>
                                            <p className="text-xs text-zinc-500 truncate font-mono">lenk.tr/{link.short_slug}</p>
                                        </div>
                                        <div className="flex items-center gap-4 ml-4">
                                            <div className="text-right">
                                                <div className="text-lg font-black text-white">{link.clicks || 0}</div>
                                                <div className="text-[10px] text-zinc-600 uppercase font-bold">Clicks</div>
                                            </div>
                                            <a href={`https://lenk.tr/${link.short_slug}`} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-blue-500 transition-colors">
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Recent Bio Pages */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <UserCircle size={20} className="text-purple-500" /> Recent Bio Pages
                        </h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/bio')}>
                            View All
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {dashboardData.recentBioPages.length === 0 ? (
                            <div className="text-center py-8 text-zinc-600">
                                <UserCircle size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No bio pages yet</p>
                                <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/bio/editor')}>
                                    <Plus size={14} className="mr-2" /> Create Bio Page
                                </Button>
                            </div>
                        ) : (
                            dashboardData.recentBioPages.map(page => (
                                <div key={page.id} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 hover:border-purple-500/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-white truncate">{page.profile_title || 'Untitled'}</h3>
                                            <p className="text-xs text-zinc-500 truncate font-mono">lenk.tr/{page.slug}</p>
                                        </div>
                                        <div className="flex items-center gap-4 ml-4">
                                            <div className="text-right">
                                                <div className="text-lg font-black text-white">{page.views || 0}</div>
                                                <div className="text-[10px] text-zinc-600 uppercase font-bold">Views</div>
                                            </div>
                                            <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-purple-500 transition-colors">
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-white mb-2">Ready to grow?</h2>
                        <p className="text-zinc-400">Create new links or bio pages to expand your presence.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" size="lg" onClick={() => navigate('/links')}>
                            <Plus size={18} className="mr-2" /> New Link
                        </Button>
                        <Button variant="primary" size="lg" glow onClick={() => navigate('/bio/editor')}>
                            <Plus size={18} className="mr-2" /> New Bio Page
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DashboardOverview;
