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
    Smartphone
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const BioPagesList = () => {
    const navigate = useNavigate();

    // Mock Data for Bio Pages
    const bioPages = [
        {
            id: 1,
            title: "Personal Brand",
            slug: "lenk.tr/alex-des",
            views: "12.5k",
            template: "Glass",
            status: "Active",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Photography Portfolio",
            slug: "lenk.tr/alex-shots",
            views: "4.2k",
            template: "Dark",
            status: "Active",
            image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Agency Landing",
            slug: "lenk.tr/agency-v1",
            views: "850",
            template: "Minimal",
            status: "Draft",
            image: null // No image
        }
    ];

    return (
        <div className="space-y-10 animate-fade-in font-sans pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <Badge variant="primary" className="mb-2">Bio Pages</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-white font-heading">My Pages</h1>
                    <p className="text-zinc-500 font-medium max-w-xl">Create and manage your personal landing pages.</p>
                </div>
                <Button variant="primary" size="lg" glow>
                    <Plus size={18} className="mr-2" /> Create New Page
                </Button>
            </div>

            {/* Grid of Bio Pages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bioPages.map((page) => (
                    <div key={page.id} className="group relative bg-[#0D0F14] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 flex flex-col">

                        {/* Preview Area (Top Half) */}
                        <div className="h-48 bg-zinc-900/50 relative overflow-hidden group-hover:bg-zinc-900/30 transition-colors">
                            {/* Mockup Preview */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:scale-105 transition-transform duration-500">
                                {page.image ? (
                                    <img src={page.image} alt={page.title} className="w-full h-full object-cover blur-sm opacity-50" />
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
                                    onClick={() => navigate('/bio/editor')} // Go to editor
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
                                <Badge variant={page.status === 'Active' ? 'success' : 'primary'} className="shadow-lg backdrop-blur-md bg-black/50 border-white/10">
                                    {page.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Info Area (Bottom Half) */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{page.title}</h3>
                                    <a href={`https://${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-zinc-500 hover:text-white transition-colors mt-1 inline-flex items-center gap-1">
                                        {page.slug} <ExternalLink size={10} />
                                    </a>
                                </div>
                                <button className="text-zinc-600 hover:text-white transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <BarChart2 size={14} className="text-zinc-600" />
                                    <span className="text-zinc-400">{page.views}</span> Views
                                </div>
                                <div className="flex items-center gap-2">
                                    <Smartphone size={14} className="text-zinc-600" />
                                    <span className="text-zinc-400">{page.template}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Card Placeholder */}
                <button className="group relative h-full min-h-[300px] rounded-3xl border-2 border-dashed border-white/5 hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all flex flex-col items-center justify-center gap-4 text-zinc-600 hover:text-blue-500">
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
