import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        success: "bg-lime-500/10 text-lime-400 border-lime-500/20",
        warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        pro: "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    );
};

export default Badge;
