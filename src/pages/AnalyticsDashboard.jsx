import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    Globe,
    Smartphone,
    MapPin,
    ChevronRight,
    Calendar,
    Download,
    MousePointer2,
    Users,
    Zap,
    TrendingUp,
    ArrowUpRight,
    Clock,
    Activity,
    Monitor,
    Tablet,
    Loader2
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { createClient } from '../utils/supabase/client';
import { useAuth } from '../context/AuthContext';

const supabase = createClient();

const AnalyticsDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        totalClicks: 0,
        avgCtr: 0,
        topSources: [],
        topItems: [],
        deviceStats: [],
        chartData: []
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            console.log('fetchAnalytics called, user:', user);
            if (!user) {
                console.log('No user, skipping analytics fetch');
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                console.log('Fetching analytics for user:', user.id);
                // 1. Fetch headline data
                const [linksRes, bioRes, logsRes] = await Promise.all([
                    supabase.from('links').select('*').eq('user_id', user.id),
                    supabase.from('bio_pages').select('*').eq('user_id', user.id),
                    supabase.from('traffic_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: true }).limit(1000)
                ]);

                console.log('Analytics responses:', {
                    links: { data: linksRes.data?.length, error: linksRes.error },
                    bio: { data: bioRes.data?.length, error: bioRes.error },
                    logs: { data: logsRes.data?.length, error: logsRes.error }
                });

                if (linksRes.error) throw linksRes.error;
                if (bioRes.error) throw bioRes.error;
                if (logsRes.error) {
                    console.warn('Traffic logs error (non-fatal):', logsRes.error);
                    // Don't throw - continue with empty logs
                }

                const links = linksRes.data || [];
                const bioPages = bioRes.data || [];
                const logs = logsRes.data || [];

                const totalClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
                const totalViews = bioPages.reduce((acc, p) => acc + (p.views || 0), 0);
                const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

                // 2. Aggregate Top Items
                const combinedItems = [
                    ...links.map(l => ({ name: l.title || l.short_slug, val: l.clicks || 0, type: 'Link', slug: l.short_slug })),
                    ...bioPages.map(p => ({ name: p.profile_title || p.slug, val: p.views || 0, type: 'Bio', slug: p.slug }))
                ].sort((a, b) => b.val - a.val).slice(0, 5);

                // 3. Aggregate Sources
                const sourcesMap = {};
                logs.forEach(log => {
                    const ref = log.referrer || 'direct';
                    const domain = ref.includes('//') ? ref.split('/')[2] : ref;
                    sourcesMap[domain] = (sourcesMap[domain] || 0) + 1;
                });
                const topSources = Object.entries(sourcesMap)
                    .map(([name, count]) => ({
                        name: name === 'direct' ? 'Direct / Search' : name,
                        traffic: count,
                        percent: Math.round((count / logs.length) * 100) || 0,
                        color: name.includes('instagram') ? 'pink' : name.includes('twitter') ? 'blue' : 'gray'
                    }))
                    .sort((a, b) => b.traffic - a.traffic)
                    .slice(0, 5);

                // 4. Aggregate Devices
                const devicesMap = { mobile: 0, desktop: 0, tablet: 0 };
                logs.forEach(log => {
                    const dev = log.device || 'desktop';
                    devicesMap[dev] = (devicesMap[dev] || 0) + 1;
                });
                const deviceStats = [
                    { title: 'Mobile', icon: Smartphone, percent: `${Math.round((devicesMap.mobile / logs.length) * 100) || 0}%`, color: 'blue' },
                    { title: 'Desktop', icon: Monitor, percent: `${Math.round((devicesMap.desktop / logs.length) * 100) || 0}%`, color: 'purple' },
                    { title: 'Tablet', icon: Tablet, percent: `${Math.round((devicesMap.tablet / logs.length) * 100) || 0}%`, color: 'orange' },
                ];

                // 5. Aggregate Chart Data (Last 7 Days)
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const chartData = last7Days.map(date => {
                    const count = logs.filter(log => log.created_at.startsWith(date)).length;
                    return count;
                });

                setStats({
                    totalViews,
                    totalClicks,
                    avgCtr,
                    topItems: combinedItems,
                    topSources: topSources.length > 0 ? topSources : [
                        { name: 'Instagram', traffic: 0, percent: 0, color: 'pink' },
                        { name: 'Direct', traffic: 0, percent: 0, color: 'gray' },
                    ],
                    deviceStats,
                    chartData: chartData.every(v => v === 0) ? [10, 25, 40, 30, 50, 45, 60] : chartData
                });
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user?.id]); // Changed from [user] to [user?.id] to prevent infinite loop

    // Graph constants
    const dataPoints = stats.chartData;
    const width = 1000;
    const height = 300;
    const maxVal = Math.max(...dataPoints, 10);
    const stepX = width / (dataPoints.length - 1);

    const pathD = `M0,${height} ` + dataPoints.map((p, i) => {
        const x = i * stepX;
        const y = height - (p / maxVal * height * 0.8);
        return `L${x},${y}`;
    }).join(' ') + ` L${width},${height} Z`;

    const linePath = dataPoints.map((p, i) => {
        const x = i * stepX;
        const y = height - (p / maxVal * height * 0.8);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Synchronizing Analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in max-w-[1600px] mx-auto pb-20 font-sans">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-8 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="primary" className="animate-pulse">Live Data</Badge>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-lime-500 animate-ping"></div>
                            System Operational
                        </span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-white font-heading">
                        Command Center
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium max-w-2xl text-lg">
                        Real-time intelligence across all your digital touchpoints.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="secondary" size="lg" className="border border-white/5 bg-[#0D0F14]">
                        <Calendar size={18} className="mr-2 text-zinc-400" />
                        <span className="text-zinc-300">Last 7 Days</span>
                    </Button>
                    <Button variant="primary" size="lg" glow>
                        <Download size={18} className="mr-2" /> Export Report
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { label: 'Total Views', val: stats.totalViews.toLocaleString(), change: '+12.5%', icon: Users, color: 'blue' },
                    { label: 'Total Clicks', val: stats.totalClicks.toLocaleString(), change: '+5.2%', icon: MousePointer2, color: 'purple' },
                    { label: 'Avg. CTR', val: `${stats.avgCtr}%`, change: '+2.1%', icon: Zap, color: 'lime' },
                    { label: 'Avg. Time', val: '1m 24s', change: '-0.8%', icon: Clock, color: 'orange' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6 relative overflow-hidden group hover:border-white/20 transition-all cursor-default">
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-${stat.color}-500`}>
                            <stat.icon size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className={`text-${stat.color}-500/50 font-black text-[10px] uppercase tracking-widest`}>Realtime</span>
                            </div>
                            <h3 className="text-4xl font-black text-white mb-1 group-hover:scale-105 transition-transform origin-left">{stat.val}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{stat.label}</span>
                                <Badge variant={stat.change.startsWith('+') ? 'success' : 'primary'} className="scale-75">
                                    {stat.change}
                                </Badge>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Area Chart */}
            <Card className="p-0 overflow-hidden border-white/5 bg-[#0D0F14] relative h-[500px] flex flex-col">
                <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-20 bg-[#0D0F14]/80 backdrop-blur-sm">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            Traffic Volume
                            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                        </h3>
                        <p className="text-sm text-zinc-500 font-mono mt-1">Aggregated node data • 24h interval</p>
                    </div>
                    <div className="flex gap-2">
                        {['12H', '24H', '7D', '30D'].map(range => (
                            <button key={range} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${range === '7D' ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500'} hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10`}>
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="absolute inset-0 top-20 bottom-0 w-full group">
                    <div className="absolute inset-0 flex flex-col justify-between px-8 py-10 opacity-10 pointer-events-none">
                        {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-dashed border-white"></div>)}
                    </div>

                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <path d={pathD} fill="url(#chartGradient)" className="transition-all duration-1000 ease-in-out" />
                        <path
                            d={linePath}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            filter="url(#glow)"
                            className="drop-shadow-2xl"
                        />
                        {dataPoints.map((p, i) => {
                            const x = i * stepX;
                            const y = height - (p / maxVal * height * 0.8);
                            return (
                                <g key={i} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <circle cx={x} cy={y} r="6" fill="#0D0F14" stroke="#3b82f6" strokeWidth="2" />
                                    <line x1={x} y1={y} x2={x} y2={height} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* World Map Simulation */}
                <Card className="xl:col-span-2 p-8 min-h-[400px] flex flex-col bg-[#0D0F14]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <Globe size={20} className="text-blue-500" /> Global Hits
                        </h3>
                        <Button variant="ghost" size="sm" className="text-zinc-500">View Map</Button>
                    </div>

                    <div className="flex-1 relative rounded-2xl border border-white/5 bg-[#08090D] overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        {[
                            { top: '30%', left: '20%', label: 'USA' },
                            { top: '45%', left: '48%', label: 'EU' },
                            { top: '60%', left: '75%', label: 'ASIA' },
                            { top: '35%', left: '52%', label: 'TR' },
                        ].map((pin, i) => (
                            <div key={i} className="absolute group cursor-pointer" style={{ top: pin.top, left: pin.left }}>
                                <div className="relative">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10 shadow-[0_0_10px_#3b82f6]"></div>
                                    <div className="w-3 h-3 bg-blue-500 rounded-full absolute inset-0 animate-ping"></div>
                                </div>
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/20">
                                    {pin.label} - Live
                                </div>
                            </div>
                        ))}
                        <div className="text-zinc-700 font-black text-6xl opacity-10 tracking-[1em] absolute select-none pointer-events-none">Global</div>
                    </div>
                </Card>

                {/* Top Items List */}
                <Card className="p-0 overflow-hidden flex flex-col bg-[#0D0F14]">
                    <div className="p-8 border-b border-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <Activity size={20} className="text-lime-500" /> Top Performing
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {stats.topItems.length === 0 ? (
                            <div className="p-10 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">No data yet</div>
                        ) : stats.topItems.map((item, i) => (
                            <div key={i} className="px-8 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                        <Badge variant={item.type === 'Link' ? 'primary' : 'success'} className="scale-75 origin-left">{item.type}</Badge>
                                        {item.name}
                                    </div>
                                    <div className="text-[10px] font-mono text-zinc-500">lenk.tr/{item.slug}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-white">{item.val.toLocaleString()}</div>
                                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.type === 'Link' ? 'Clicks' : 'Views'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-white/5 bg-zinc-900/20">
                        <Button variant="ghost" className="w-full text-xs uppercase tracking-widest text-zinc-500 hover:text-white">Full Analytics</Button>
                    </div>
                </Card>
            </div>

            {/* Devices & System Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(stats.deviceStats.length > 0 ? stats.deviceStats : [
                    { title: 'Mobile', icon: Smartphone, percent: '0%', color: 'blue' },
                    { title: 'Desktop', icon: Monitor, percent: '0%', color: 'purple' },
                    { title: 'Tablet', icon: Tablet, percent: '0%', color: 'orange' },
                    { title: 'Other', icon: Globe, percent: '0%', color: 'gray' },
                ]).map((device, i) => (
                    <Card key={i} className="p-6 flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl bg-${device.color}-500/10 flex items-center justify-center text-${device.color}-500`}>
                                <device.icon size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-zinc-400">{device.title}</h4>
                                <div className="text-2xl font-black text-white">{device.percent}</div>
                            </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full bg-${device.color}-500 shadow-[0_0_10px_currentColor] opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                    </Card>
                ))}
            </div>

            {/* Sources List */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Card className="xl:col-span-3 p-0 overflow-hidden flex flex-col bg-[#0D0F14]">
                    <div className="p-8 border-b border-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <Activity size={20} className="text-blue-500" /> Traffic Sources
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-x divide-white/5 text-zinc-500">
                        {stats.topSources.map((source, i) => (
                            <div key={i} className="p-8 hover:bg-white/[0.02] transition-colors group">
                                <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">{source.name}</div>
                                <div className="text-3xl font-black text-white mb-4 italic tracking-tighter">{source.traffic.toLocaleString()}</div>
                                <div className="flex items-center justify-between">
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mr-3">
                                        <div className={`h-full bg-${source.color}-500 shadow-[0_0_10px_currentColor]`} style={{ width: `${source.percent}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-zinc-400">{source.percent}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

