import React from 'react';
import { ChevronRight, Calendar, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

// Mock Data for Charts (Moved here)
const chartData = [45, 72, 58, 91, 64, 85, 120];
const maxVal = Math.max(...chartData);

const StatsOverlay = ({ link, onClose }) => (
    <div className="fixed inset-0 z-50 bg-[#08090D] overflow-y-auto animate-fade-in">
        <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white flex items-center gap-2 mb-2 transition-colors">
                        <ChevronRight size={20} className="rotate-180" /> Back to Links
                    </button>
                    <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                        Analytics <span className="text-lime-500">📊</span>
                    </h1>
                    <p className="text-zinc-500 font-medium">Detailed stats for <span className="text-white font-bold">{link.slug}</span></p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Calendar size={16} className="mr-2" /> Last 7 Days
                    </Button>
                    <Button variant="primary">
                        <ExternalLink size={16} className="mr-2" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Clicks', value: link.clicks, change: '+12%', color: 'blue' },
                    { label: 'Unique Visitors', value: '842', change: '+5%', color: 'purple' },
                    { label: 'Avg. Duration', value: '45s', change: '-2%', color: 'orange' },
                    { label: 'Bounce Rate', value: '24%', change: '-0.5%', color: 'lime' }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-[#0D0F14] border border-white/5">
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                            <Badge variant={stat.change.startsWith('+') ? 'success' : 'primary'} className="mb-1">
                                {stat.change}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="p-8 rounded-3xl bg-[#0D0F14] border border-white/5 mb-8">
                <h3 className="text-xl font-bold text-white mb-8">Traffic Overview</h3>
                <div className="h-64 flex items-end justify-between gap-4 px-4">
                    {chartData.map((value, i) => (
                        <div key={i} className="w-full flex flex-col justify-end gap-2 group">
                            <div className="relative w-full bg-blue-500/10 rounded-t-xl group-hover:bg-blue-500/20 transition-all overflow-hidden" style={{ height: `${(value / maxVal) * 100}%` }}>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ height: '100%' }}></div>
                                <div className="absolute inset-x-0 bottom-0 bg-blue-500 h-1"></div>
                            </div>
                            <span className="text-xs font-mono text-zinc-600 text-center group-hover:text-blue-400 transition-colors">Day {i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Referrers */}
                <div className="p-8 rounded-3xl bg-[#0D0F14] border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Top Referrers</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Instagram', count: 450, percent: 55, icon: '📸' },
                            { name: 'Twitter / X', count: 210, percent: 25, icon: '🐦' },
                            { name: 'Direct', count: 120, percent: 15, icon: '🔗' },
                            { name: 'Facebook', count: 40, percent: 5, icon: '👥' }
                        ].map((ref, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">{ref.icon}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm font-bold text-white mb-1">
                                        <span>{ref.name}</span>
                                        <span>{ref.count}</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${ref.percent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Locations */}
                <div className="p-8 rounded-3xl bg-[#0D0F14] border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Top Locations</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'United States', count: 320, percent: 40, flag: '🇺🇸' },
                            { name: 'Turkey', count: 280, percent: 35, flag: '🇹🇷' },
                            { name: 'Germany', count: 150, percent: 20, flag: '🇩🇪' },
                            { name: 'United Kingdom', count: 50, percent: 5, flag: '🇬🇧' }
                        ].map((loc, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="text-2xl">{loc.flag}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm font-bold text-white mb-1">
                                        <span>{loc.name}</span>
                                        <span>{loc.count}</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-lime-500 rounded-full" style={{ width: `${loc.percent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default StatsOverlay;
