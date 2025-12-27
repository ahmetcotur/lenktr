import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Link2,
    MousePointer2,
    Eye,
    TrendingUp,
    ExternalLink,
    Plus,
    ArrowUpRight,
    Globe,
    Zap,
    Cpu,
    Activity,
    Shield,
    Loader2,
    Target
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { createClient } from '../utils/supabase/client';

const supabase = createClient();

const DashboardOverview = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState({
        totalClicks: 0,
        activeLinks: 0,
        topLinks: [],
        chartData: [0, 0, 0, 0, 0, 0, 0]
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // 1. Fetch all links for stats
                const { data: links, error: linksError } = await supabase
                    .from('links')
                    .select('*');

                if (linksError) throw linksError;

                const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
                const activeLinks = links.filter(l => !l.is_archived).length;
                const sortedLinks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 3);

                setStatsData({
                    totalClicks,
                    activeLinks,
                    topLinks: sortedLinks,
                    chartData: [45, 62, 55, 80, 70, 95, 88] // Keep mock chart for now until we have traffic table
                });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { label: "Total Clicks", value: statsData.totalClicks.toLocaleString(), trend: "+12.5%", icon: Activity, color: "text-blue-500", glow: "blue" },
        { label: "Active Nodes", value: statsData.activeLinks, trend: "Stable", icon: Target, color: "text-blue-400", glow: "blue" },
        { label: "Success Rate", value: "99.9%", trend: "0.0%", icon: Zap, color: "text-blue-300", glow: "blue" },
        { label: "Uptime", value: "24/7", trend: "Steady", icon: Cpu, color: "text-blue-600", glow: "blue" },
    ];

    return (
        <div className="space-y-12 md:space-y-20 animate-fade-in py-2">
            {/* Header: Overview */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 border-b border-white/5 pb-10 md:pb-16 text-center md:text-left">
                <div className="max-w-3xl">
                    <Badge variant="primary" className="mb-6 md:mb-8 font-black uppercase tracking-[0.3em]">System Status: Active</Badge>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter font-heading text-white leading-none mb-4 md:mb-6 italic uppercase">Statistics</h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-bold max-w-lg leading-relaxed mx-auto md:mx-0">Real-time analytics for your shortened links.</p>
                </div>
                <Button variant="primary" size="lg" className="px-10 md:px-12 py-5 md:py-7 text-lg md:text-xl shadow-[0_0_40px_-12px_rgba(59,130,246,0.5)] w-full md:w-auto">
                    <Plus size={24} className="mr-4" /> Create Link
                </Button>
            </div>

            {/* Core Telemetry Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, i) => (
                    <Card key={i} className="group relative overflow-hidden flex flex-col justify-between py-8 md:py-10 px-8 md:px-10 border-white/5 hover:border-blue-500/20 transition-all duration-700">
                        <div className="flex items-center justify-between mb-8 md:mb-10">
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center ${stat.color} transition-all duration-700 group-hover:scale-110 group-hover:bg-blue-600/20 border border-blue-500/10`}>
                                <stat.icon size={28} className="fill-current/10" />
                            </div>
                            <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/5 ${stat.trend.includes('+') ? 'text-blue-400' : 'text-gray-600'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] md:text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2 md:mb-3">{stat.label}</p>
                            <h3 className="text-3xl md:text-4xl font-black font-heading tracking-tighter text-white italic">{stat.value}</h3>
                        </div>
                        {/* Visual Pulse Flare */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    </Card>
                ))}
            </div>

            {/* Main Visual Processing Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                <Card className="lg:col-span-2 p-8 md:p-12 border-white/5 ring-1 ring-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 md:mb-16">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black font-heading tracking-tighter italic uppercase text-white mb-2">Traffic Activity</h3>
                            <p className="text-base md:text-lg text-gray-500 font-bold">Your link traffic over the last 7 days.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#08090D] border border-white/5 rounded-2xl p-1.5 h-12 md:h-14 w-fit">
                            <button className="px-5 md:px-6 h-full text-[10px] font-black uppercase tracking-[0.25em] rounded-xl bg-blue-600 text-white shadow-2xl shadow-blue-600/30">Clicks</button>
                            <button className="px-5 md:px-6 h-full text-[10px] font-black uppercase tracking-[0.25em] rounded-xl text-gray-600 hover:text-white transition-all">Pages</button>
                        </div>
                    </div>

                    <div className="h-[300px] md:h-[400px] flex items-end justify-between gap-3 md:gap-6 px-2 md:px-4 relative">
                        {/* System Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                            {[...Array(6)].map((_, i) => <div key={i} className="w-full border-t border-blue-500/20"></div>)}
                        </div>

                        {[45, 62, 55, 80, 70, 95, 88].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 md:gap-8 group relative z-10">
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                    <div className="px-3 md:px-4 py-1.5 md:py-2 glass-effect rounded-xl border-blue-500/30 text-blue-500 font-black text-xs md:text-sm tracking-widest">{h}K</div>
                                </div>
                                <div
                                    className="w-full bg-blue-600/5 rounded-xl md:rounded-2xl relative transition-all duration-700 group-hover:bg-blue-600/20 overflow-hidden border border-white/5"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute inset-x-0 top-0 h-1.5 md:h-2 bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-pulse"></div>
                                </div>
                                <span className="text-[9px] md:text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] md:tracking-[0.3em] group-hover:text-blue-500 transition-all duration-500">Day-{(i + 1).toString().padStart(2, '0')}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-8 md:p-12 border-white/5 flex flex-col ring-1 ring-white/5">
                    <div className="flex items-start justify-between mb-10 md:mb-12">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black font-heading tracking-tighter italic uppercase text-white mb-2">Top Links</h3>
                            <p className="text-base md:text-lg text-gray-500 font-bold">Your most clicked links.</p>
                        </div>
                        <div className="p-2.5 md:p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-500">
                            <TrendingUp size={24} />
                        </div>
                    </div>

                    <div className="space-y-8 md:space-y-10 flex-1">
                        {statsData.topLinks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                                No link activity detected
                            </div>
                        ) : statsData.topLinks.map((link, i) => (
                            <div key={link.id || i} className="group cursor-pointer">
                                <div className="flex items-start justify-between mb-4 md:mb-6">
                                    <div className="flex flex-col gap-1 md:gap-2">
                                        <span className="text-base md:text-lg font-black text-white group-hover:text-blue-500 transition-all duration-500 flex items-center gap-2 md:gap-3 tracking-tighter uppercase italic">
                                            {link.title || 'Untitled'} <ArrowUpRight size={18} className="text-gray-800 group-hover:text-blue-500 transition-all duration-500" />
                                        </span>
                                        <span className="text-xs md:text-sm font-bold text-gray-600 tracking-tight">lenk.tr/{link.short_slug}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-lg md:text-xl font-black text-white italic tracking-tighter leading-none mb-1">{(link.clicks || 0).toLocaleString()}</span>
                                        <span className="text-[9px] md:text-[10px] font-black uppercase text-gray-700 tracking-[0.2em]">CLICKS</span>
                                    </div>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,1)] transition-all duration-1500 ease-in-out" style={{ width: `${Math.min(((link.clicks || 0) / (statsData.topLinks[0]?.clicks || 1)) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        onClick={() => navigate('/upgrade')}
                        className="mt-12 md:mt-16 p-6 md:p-8 rounded-[32px] bg-blue-600 text-white shadow-2xl shadow-blue-600/30 group cursor-pointer hover:bg-blue-500 transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="flex items-center gap-4 md:gap-6 relative z-10">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                                <Shield size={24} className="fill-current" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg md:text-xl font-black italic tracking-tighter uppercase">Pro Plan</h4>
                                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Unlock advanced features</p>
                            </div>
                            <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardOverview;
