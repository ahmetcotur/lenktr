import React from 'react';
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
    Tablet
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const AnalyticsDashboard = () => {
    // Generate smooth curve for chart
    const dataPoints = [20, 45, 30, 60, 55, 85, 70, 95, 80, 110, 95, 130];
    const width = 1000;
    const height = 300;
    const maxVal = Math.max(...dataPoints);
    const stepX = width / (dataPoints.length - 1);

    // Create SVG Path command
    const pathD = `M0,${height} ` + dataPoints.map((p, i) => {
        const x = i * stepX;
        const y = height - (p / maxVal * height * 0.8); // 80% height usage
        return `L${x},${y}`;
    }).join(' ') + ` L${width},${height} Z`;

    // Smooth line path (cubic bezier simulation for simplicity or just polyline)
    // For specific smooth effect without library, polyline is safer or simple L.
    // Let's stick to straight lines with gradient fill for Cyberpunk feel.

    const linePath = dataPoints.map((p, i) => {
        const x = i * stepX;
        const y = height - (p / maxVal * height * 0.8);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');

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
                        <span className="text-zinc-300">Last 30 Days</span>
                    </Button>
                    <Button variant="primary" size="lg" glow>
                        <Download size={18} className="mr-2" /> Export Report
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { label: 'Total Views', val: '248.5K', change: '+12.5%', icon: Users, color: 'blue' },
                    { label: 'Total Clicks', val: '86.2K', change: '+5.2%', icon: MousePointer2, color: 'purple' },
                    { label: 'Avg. CTR', val: '34.8%', change: '+2.1%', icon: Zap, color: 'lime' },
                    { label: 'Avg. Time', val: '1m 42s', change: '-0.8%', icon: Clock, color: 'orange' },
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
                        <p className="text-sm text-zinc-500 font-mono mt-1">Aggregated node data • 15 min interval</p>
                    </div>
                    <div className="flex gap-2">
                        {['12H', '24H', '7D', '30D'].map(range => (
                            <button key={range} className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10">
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SVG Chart */}
                <div className="absolute inset-0 top-20 bottom-0 w-full group">
                    {/* Grid Lines */}
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

                        {/* Area Fill */}
                        <path d={pathD} fill="url(#chartGradient)" className="transition-all duration-1000 ease-in-out" />

                        {/* Line Stroke */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            filter="url(#glow)"
                            className="drop-shadow-2xl"
                        />

                        {/* Interactive Data Points */}
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
                        {/* Abstract Map Dots */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        {/* Ping Points */}
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

                {/* Top Sources List */}
                <Card className="p-0 overflow-hidden flex flex-col bg-[#0D0F14]">
                    <div className="p-8 border-b border-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <Activity size={20} className="text-lime-500" /> Top Sources
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {[
                            { name: 'Instagram', traffic: '124,502', percent: 65, color: 'pink' },
                            { name: 'Twitter / X', traffic: '45,210', percent: 22, color: 'blue' },
                            { name: 'TikTok', traffic: '21,040', percent: 12, color: 'purple' },
                            { name: 'LinkedIn', traffic: '8,100', percent: 5, color: 'sky' },
                            { name: 'Direct', traffic: '5,000', percent: 3, color: 'gray' },
                        ].map((source, i) => (
                            <div key={i} className="px-8 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-white">{source.name}</div>
                                    <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${source.color}-500 rounded-full`} style={{ width: `${source.percent}%` }}></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-white">{source.traffic}</div>
                                    <div className="text-[10px] font-bold text-zinc-600">{source.percent}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-white/5 bg-zinc-900/20">
                        <Button variant="ghost" className="w-full text-xs uppercase tracking-widest text-zinc-500 hover:text-white">View All Sources</Button>
                    </div>
                </Card>
            </div>

            {/* Devices & System Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Mobile', icon: Smartphone, percent: '72%', color: 'blue' },
                    { title: 'Desktop', icon: Monitor, percent: '24%', color: 'purple' },
                    { title: 'Tablet', icon: Tablet, percent: '4%', color: 'orange' },
                    { title: 'Other', icon: Globe, percent: '<1%', color: 'gray' },
                ].map((device, i) => (
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
        </div>
    );
};

export default AnalyticsDashboard;

