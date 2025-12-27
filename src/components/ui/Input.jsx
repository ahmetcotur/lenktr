import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">{label}</label>}
            <div className="relative group">
                <input
                    className="bg-[#0D0F14] border border-white/5 rounded-[12px] px-4 py-3.5 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all w-full text-sm"
                    {...props}
                />
                <div className="absolute inset-0 rounded-[12px] border border-blue-500/0 group-focus-within:border-blue-500/20 pointer-events-none transition-all"></div>
            </div>
            {error && <span className="text-[10px] font-bold text-red-500 ml-1">{error}</span>}
        </div>
    );
};

export default Input;
