import React from 'react';
import { motion as Motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', size = 'md', className = '', glow = false, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-[14px] font-bold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed tracking-tight relative overflow-hidden";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]",
    secondary: "bg-zinc-900 text-zinc-300 border border-white/5 hover:bg-zinc-800 hover:border-white/10",
    outline: "bg-transparent border border-blue-500/30 text-blue-500 hover:bg-blue-500/10",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    success: "bg-lime-600 text-white hover:bg-lime-500 shadow-[0_0_20px_rgba(163,230,53,0.15)]",
    danger: "bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "p-3"
  };

  return (
    <Motion.button
      whileHover={{
        scale: 1.02,
        translateY: -2,
        boxShadow: variant === 'primary' ? '0 20px 40px -10px rgba(59, 130, 246, 0.4)' : '0 20px 40px -10px rgba(0, 0, 0, 0.4)'
      }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${glow ? 'glow-primary' : ''} ${className}`}
      {...props}
    >
      {/* Subtle Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shine_1.5s_ease-in-out_infinite] pointer-events-none"></div>
      <span className="relative z-10 hidden md:inline-block mr-0">{/* dummy for shine animate reference */}</span>
      {children}
    </Motion.button>
  );
};

export default Button;
