import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

const EMOJI_CATEGORIES = {
    'Popular': ['🎨', '💼', '📱', '🌐', '📧', '📞', '🏠', '💡', '🎯', '⭐', '🔥', '💎'],
    'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉'],
    'Objects': ['📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🎮', '🕹️', '📷', '📹', '🎥', '📞'],
    'Symbols': ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕'],
    'Travel': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚'],
    'Food': ['🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🍳', '🧇', '🥞', '🧈'],
    'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓'],
    'Nature': ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🏵️', '🌲', '🌳', '🌴', '🌵', '🌾']
};

const IconPicker = ({ onSelect, onClose, currentIcon }) => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('Popular');

    const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
    const filteredEmojis = search
        ? allEmojis.filter(emoji => emoji.includes(search))
        : EMOJI_CATEGORIES[activeCategory];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0D0F14] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slide-in-up">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Choose Icon</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search icons..."
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Categories */}
                {!search && (
                    <div className="p-4 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
                        {Object.keys(EMOJI_CATEGORIES).map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeCategory === category
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {/* Emoji Grid */}
                <div className="p-4 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-8 gap-2">
                        {/* None Option */}
                        <button
                            onClick={() => onSelect('')}
                            className={`aspect-square rounded-lg flex items-center justify-center text-2xl hover:bg-white/10 transition-all ${currentIcon === '' ? 'bg-blue-500/20 ring-2 ring-blue-500' : 'bg-white/5'
                                }`}
                            title="No Icon"
                        >
                            <X size={20} className="text-zinc-500" />
                        </button>

                        {/* Emojis */}
                        {filteredEmojis.map((emoji, index) => (
                            <button
                                key={index}
                                onClick={() => onSelect(emoji)}
                                className={`aspect-square rounded-lg flex items-center justify-center text-2xl hover:bg-white/10 transition-all ${currentIcon === emoji ? 'bg-blue-500/20 ring-2 ring-blue-500' : 'bg-white/5'
                                    }`}
                                title={emoji}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>

                    {filteredEmojis.length === 0 && (
                        <div className="text-center py-8 text-zinc-500 text-sm">
                            No icons found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IconPicker;
