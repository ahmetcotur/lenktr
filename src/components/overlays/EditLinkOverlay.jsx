import React, { useState } from 'react';
import {
    X, Save, Image as ImageIcon, Plus, Upload,
    Globe, Smartphone, Monitor, ChevronDown,
    Calendar, Lock, Folder, Share2, Facebook,
    Twitter, Instagram, Linkedin, Send, Slack,
    Layout, Link2, Copy, Trash2, Check, Loader2
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { createClient } from '../../utils/supabase/client';
import { useAuth } from '../../context/AuthContext';

const supabase = createClient();

const EditLinkOverlay = ({ link, onClose }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        destinationUrl: link?.original_url || '',
        title: link?.title || '',
        shortSlug: link?.short_slug || Math.random().toString(36).substring(2, 8),
        cloaking: false,
        showCtaBanner: false,
        ctaBanner: {
            logo: '',
            title: '',
            description: '',
            buttonText: 'Learn More',
            buttonUrl: ''
        }
    });

    const handleSave = async () => {
        if (!formData.destinationUrl) {
            alert('Please enter a destination URL');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                user_id: user.id,
                original_url: formData.destinationUrl,
                title: formData.title,
                short_slug: formData.shortSlug,
            };

            let error;
            if (link?.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('links')
                    .update(payload)
                    .eq('id', link.id);
                error = updateError;
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('links')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;
            onClose();
        } catch (err) {
            alert('Error saving link: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const [activeTab, setActiveTab] = useState('default');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#0D0F14] rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0D0F14] z-10">
                    <h2 className="text-lg font-black text-white">{link ? 'Update node.' : 'Short it.'}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

                    {/* Destination URL */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400">Destination URL</label>
                            <input
                                type="text"
                                placeholder="https://example.com/very-long-url-that-needs-shortening"
                                value={formData.destinationUrl}
                                onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Campaign or Project Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400">Custom Slug</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600 text-xs font-mono">
                                        lenk.tr/
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.shortSlug}
                                        onChange={(e) => setFormData({ ...formData, shortSlug: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-[68px] pr-4 py-3 text-sm text-white font-mono focus:border-blue-500/50 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pixels & UTMs */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400">Attach pixels</label>
                            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <Plus size={14} /> ADD PIXEL
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400">UTM Parameters</label>
                            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <Plus size={14} /> Add UTM
                            </button>
                        </div>
                    </div>

                    {/* Social Preview */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-zinc-400">Customize social preview</label>
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 text-yellow-500">
                            <Share2 size={16} className="shrink-0 mt-0.5" />
                            <p className="text-[10px] font-medium leading-relaxed">
                                Click on network to change the preview & titles of your link when shared on it, or use <span className="font-bold underline cursor-pointer">default</span> to change it for all
                            </p>
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {[
                                { id: 'default', icon: <Layout size={16} /> },
                                { id: 'facebook', icon: <Facebook size={16} /> },
                                { id: 'twitter', icon: <Twitter size={16} /> },
                                { id: 'pinterest', icon: <Share2 size={16} /> }, // Using generic for Pinterest
                                { id: 'slack', icon: <Slack size={16} /> },
                                { id: 'whatsapp', icon: <Send size={16} /> },
                                { id: 'telegram', icon: <Send size={16} /> },
                                { id: 'linkedin', icon: <Linkedin size={16} /> },
                            ].map((net) => (
                                <button
                                    key={net.id}
                                    onClick={() => setActiveTab(net.id)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${activeTab === net.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}
                                >
                                    {net.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Redirections */}
                    <div className="bg-white/5 rounded-2xl p-4 space-y-4 border border-white/5">
                        <label className="text-xs font-bold text-zinc-400 block mb-2">Custom redirections and deep links</label>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500">Target country</label>
                                <div className="relative">
                                    <select className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 appearance-none focus:outline-none">
                                        <option>All</option>
                                        <option>Turkey</option>
                                        <option>USA</option>
                                        <option>Germany</option>
                                    </select>
                                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500">Target OS</label>
                                <div className="relative">
                                    <select className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 appearance-none focus:outline-none">
                                        <option>All</option>
                                        <option>iOS</option>
                                        <option>Android</option>
                                        <option>Windows</option>
                                        <option>macOS</option>
                                    </select>
                                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500">Browser</label>
                                <div className="relative">
                                    <select className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 appearance-none focus:outline-none">
                                        <option>All</option>
                                        <option>Chrome</option>
                                        <option>Safari</option>
                                        <option>Firefox</option>
                                    </select>
                                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500">Redirection URL for this targets</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Redirection URL"
                                    className="flex-1 bg-white border border-white/10 rounded-lg px-3 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none"
                                />
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                                    Save target
                                </button>
                            </div>
                        </div>

                        <div className="py-8 text-center border border-dashed border-white/10 rounded-xl bg-[#0D0F14]/50">
                            <p className="text-xs text-zinc-600 font-medium">No targets yet</p>
                        </div>
                    </div>

                    {/* Cloaking & CTA Banner */}
                    <div className="space-y-6">
                        <label className="text-xs font-bold text-zinc-400">Cloaking / Hide URL & show CTA banner</label>

                        {/* Toggles */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFormData({ ...formData, cloaking: !formData.cloaking })}
                                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${formData.cloaking ? 'bg-blue-600' : 'bg-white/10 border border-white/10 hover:border-white/30'}`}
                                >
                                    {formData.cloaking && <Check size={14} className="text-white" />}
                                </button>
                                <span className="text-sm text-white font-medium cursor-pointer select-none" onClick={() => setFormData({ ...formData, cloaking: !formData.cloaking })}>
                                    Enable cloaking/CTA
                                </span>
                            </div>

                            {formData.cloaking && (
                                <>
                                    <ChevronDown size={16} className="-rotate-90 text-zinc-600" />
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setFormData({ ...formData, showCtaBanner: !formData.showCtaBanner })}
                                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${formData.showCtaBanner ? 'bg-blue-600' : 'bg-white/10 border border-white/10 hover:border-white/30'}`}
                                        >
                                            {formData.showCtaBanner && <Check size={14} className="text-white" />}
                                        </button>
                                        <span className="text-sm text-white font-medium cursor-pointer select-none" onClick={() => setFormData({ ...formData, showCtaBanner: !formData.showCtaBanner })}>
                                            Show CTA banner
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* CTA Banner Customization Panel */}
                        {formData.cloaking && formData.showCtaBanner && (
                            <div className="bg-[#0D0F14] border border-white/5 rounded-xl p-6 space-y-6">
                                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-4">Customize CTA banner</h3>

                                <div className="grid grid-cols-12 gap-6">
                                    {/* Logo */}
                                    <div className="col-span-3 space-y-2">
                                        <label className="text-xs font-bold text-zinc-400">Banner logo</label>
                                        <div className="aspect-[4/3] bg-white/5 border border-dashed border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors group">
                                            {formData.ctaBanner.logo ? (
                                                <img src={formData.ctaBanner.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-blue-500/20 text-zinc-500 group-hover:text-blue-500 transition-colors">
                                                        <Upload size={16} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Text */}
                                    <div className="col-span-9 space-y-2">
                                        <label className="text-xs font-bold text-zinc-400">Banner text to display</label>
                                        <input
                                            type="text"
                                            value={formData.ctaBanner.text}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                ctaBanner: { ...formData.ctaBanner, text: e.target.value }
                                            })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-all placeholder:text-zinc-600"
                                            placeholder="Go back to previous website"
                                        />
                                    </div>
                                </div>

                                {/* Redirection URL */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400">Banner redirection url</label>
                                    <input
                                        type="text"
                                        value={formData.ctaBanner.url}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            ctaBanner: { ...formData.ctaBanner, url: e.target.value }
                                        })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-all placeholder:text-zinc-600"
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>

                                {/* Colors */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400">Banner Background color</label>
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-2">
                                            <input
                                                type="text"
                                                value={formData.ctaBanner.bgColor}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    ctaBanner: { ...formData.ctaBanner, bgColor: e.target.value }
                                                })}
                                                className="flex-1 text-xs font-mono text-zinc-300 bg-transparent border-none focus:ring-0 px-2"
                                            />
                                            <div className="relative w-8 h-8 rounded border border-white/10 overflow-hidden shrink-0">
                                                <input
                                                    type="color"
                                                    value={formData.ctaBanner.bgColor}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        ctaBanner: { ...formData.ctaBanner, bgColor: e.target.value }
                                                    })}
                                                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer border-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400">Banner text color</label>
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-2">
                                            <input
                                                type="text"
                                                value={formData.ctaBanner.textColor}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    ctaBanner: { ...formData.ctaBanner, textColor: e.target.value }
                                                })}
                                                className="flex-1 text-xs font-mono text-zinc-300 bg-transparent border-none focus:ring-0 px-2"
                                            />
                                            <div className="relative w-8 h-8 rounded border border-white/10 overflow-hidden shrink-0">
                                                <input
                                                    type="color"
                                                    value={formData.ctaBanner.textColor}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        ctaBanner: { ...formData.ctaBanner, textColor: e.target.value }
                                                    })}
                                                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer border-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Banner Position */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-zinc-400">Banner position</label>
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {/* Bottom Right */}
                                        <div
                                            onClick={() => setFormData({
                                                ...formData,
                                                ctaBanner: { ...formData.ctaBanner, position: 'bottom-right' }
                                            })}
                                            className="group cursor-pointer"
                                        >
                                            <div className={`w-24 h-24 bg-white/5 rounded-lg border-2 mb-2 p-2 relative shadow-sm transition-all ${formData.ctaBanner.position === 'bottom-right' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-white/10 hover:border-white/20'}`}>
                                                <div className={`absolute bottom-3 right-3 w-12 h-6 rounded ${formData.ctaBanner.position === 'bottom-right' ? 'bg-blue-600' : 'bg-white/10'}`}></div>
                                                {formData.ctaBanner.position === 'bottom-right' && (
                                                    <div className="absolute -top-2 -right-2 bg-white text-black rounded-full p-0.5">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 block text-center">Bottom right<br />banner</span>
                                        </div>

                                        {/* Top Header */}
                                        <div
                                            onClick={() => setFormData({
                                                ...formData,
                                                ctaBanner: { ...formData.ctaBanner, position: 'top-header' }
                                            })}
                                            className="group cursor-pointer"
                                        >
                                            <div className={`w-24 h-24 bg-white/5 rounded-lg border-2 mb-2 p-0 relative shadow-sm transition-all overflow-hidden ${formData.ctaBanner.position === 'top-header' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-white/10 hover:border-white/20'}`}>
                                                <div className={`w-full h-6 ${formData.ctaBanner.position === 'top-header' ? 'bg-blue-600' : 'bg-white/10'}`}></div>
                                                {formData.ctaBanner.position === 'top-header' && (
                                                    <div className="absolute top-8 right-2 bg-white text-black rounded-full p-0.5">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 block text-center">Top Header</span>
                                        </div>

                                        {/* Bottom Left */}
                                        <div
                                            onClick={() => setFormData({
                                                ...formData,
                                                ctaBanner: { ...formData.ctaBanner, position: 'bottom-left' }
                                            })}
                                            className="group cursor-pointer"
                                        >
                                            <div className={`w-24 h-24 bg-white/5 rounded-lg border-2 mb-2 p-2 relative shadow-sm transition-all ${formData.ctaBanner.position === 'bottom-left' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-white/10 hover:border-white/20'}`}>
                                                <div className={`absolute bottom-3 left-3 w-8 h-10 rounded ${formData.ctaBanner.position === 'bottom-left' ? 'bg-blue-600' : 'bg-white/10'}`}></div>
                                                {formData.ctaBanner.position === 'bottom-left' && (
                                                    <div className="absolute -top-2 -right-2 bg-white text-black rounded-full p-0.5">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 block text-center">Bottom Left<br />pop</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scheduling */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400">Scheduling date (UTC)</label>
                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-500">
                                None
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400">Expiration date (UTC)</label>
                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-500">
                                None
                            </div>
                        </div>
                    </div>

                    {/* Password & Folder */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400">Password protection</label>
                            <input
                                type="text"
                                placeholder="No password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400">Folder</label>
                            <div className="relative">
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-400 appearance-none focus:outline-none focus:border-blue-500/50 transition-all">
                                    <option>Select Folder</option>
                                    <option>Marketing</option>
                                    <option>Personal</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditLinkOverlay;
