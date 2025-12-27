import React from 'react';

const ColorPicker = ({ label, value, onChange }) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {label}
                </label>
            )}

            <div className="flex items-center gap-2">
                {/* Visual Color Box with Invisible Native Input */}
                <div className="relative w-10 h-10 rounded-lg border border-white/10 overflow-hidden shadow-sm group">
                    {/* The Color Preview */}
                    <div
                        className="absolute inset-0 z-10 transition-colors"
                        style={{ backgroundColor: value }}
                    />

                    {/* Hover Effect */}
                    <div className="absolute inset-0 z-10 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />

                    {/* The Native Input - Invisible but Clickable */}
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute -inset-2 w-[200%] h-[200%] opacity-0 cursor-pointer z-20"
                    />
                </div>

                {/* Hex Input */}
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">#</span>
                    <input
                        type="text"
                        value={value.replace('#', '')}
                        onChange={(e) => onChange(`#${e.target.value}`)}
                        className="w-full pl-6 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-white focus:border-blue-500/50 focus:bg-white/10 focus:outline-none transition-all uppercase"
                        placeholder="000000"
                        maxLength={6}
                    />
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
