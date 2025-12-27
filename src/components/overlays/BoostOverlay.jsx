import React from 'react';
import { ChevronRight, Share2, Zap, Globe } from 'lucide-react';
import Button from '../ui/Button';

const BoostOverlay = ({ link, onClose }) => (
    <div className="fixed inset-0 z-50 bg-[#08090D] overflow-y-auto animate-fade-in">
        <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white flex items-center gap-2 mb-2 transition-colors">
                        <ChevronRight size={20} className="rotate-180" /> Back to Links
                    </button>
                    <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                        Boost Traffic <span className="text-blue-500">🚀</span>
                    </h1>
                    <p className="text-zinc-500 font-medium">Promote <span className="text-white font-bold">{link.title}</span> to reach more people.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors" onClick={onClose}>
                    <ChevronRight size={24} className="text-white rotate-90" />
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic */}
                <div className="p-8 rounded-3xl border border-white/10 bg-[#0D0F14] hover:border-blue-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                        <Share2 size={24} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase mb-2">Social Blast</h3>
                    <p className="text-zinc-500 text-sm mb-6">Share to our network of 50k+ users.</p>
                    <div className="text-3xl font-black text-white mb-6">$9<span className="text-base text-zinc-600 font-medium">/once</span></div>
                    <ul className="space-y-4 mb-8">
                        {['50k+ Reach', '24h Featured', 'Basic Analytics'].map(feature => (
                            <li key={feature} className="flex items-center gap-3 text-sm text-zinc-400">
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <ChevronRight size={12} className="text-blue-500" />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <Button variant="outline" className="w-full">Select Plan</Button>
                </div>

                {/* Pro (Recommended) */}
                <div className="p-8 rounded-3xl border-2 border-blue-500 bg-blue-500/5 relative transform md:-translate-y-4">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-xl">
                        Recommended
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                        <Zap size={24} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase mb-2">Influencer Push</h3>
                    <p className="text-blue-200/60 text-sm mb-6">Get promoted by niche content creators.</p>
                    <div className="text-3xl font-black text-white mb-6">$29<span className="text-base text-blue-200/60 font-medium">/campaign</span></div>
                    <ul className="space-y-4 mb-8">
                        {['150k+ Reach', '3 Days Featured', 'Advanced Targeting', 'Content Creation'].map(feature => (
                            <li key={feature} className="flex items-center gap-3 text-sm text-white">
                                <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center shadow-lg shadow-blue-500">
                                    <ChevronRight size={12} className="text-white" />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <Button variant="primary" className="w-full" glow>Start Campaign</Button>
                </div>

                {/* Ultra */}
                <div className="p-8 rounded-3xl border border-white/10 bg-[#0D0F14] hover:border-purple-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                        <Globe size={24} className="text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase mb-2">Global Takeover</h3>
                    <p className="text-zinc-500 text-sm mb-6">Maximum visibility across all channels.</p>
                    <div className="text-3xl font-black text-white mb-6">$99<span className="text-base text-zinc-600 font-medium">/month</span></div>
                    <ul className="space-y-4 mb-8">
                        {['1M+ Reach', 'Permanent Feature', 'Dedicated Manager', 'Priority Support'].map(feature => (
                            <li key={feature} className="flex items-center gap-3 text-sm text-zinc-400">
                                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <ChevronRight size={12} className="text-purple-500" />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <Button variant="outline" className="w-full group-hover:border-purple-500 group-hover:text-purple-400">Select Plan</Button>
                </div>
            </div>
        </div>
    </div>
);

export default BoostOverlay;
