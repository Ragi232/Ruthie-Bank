"use client";

import React from 'react';

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'hero' | 'subtle';
  interactive?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return 'bg-gradient-to-br from-[#064e3b]/80 via-[#0a2337]/90 to-[#04111d]/95 border border-[#34d399]/30 text-white shadow-[0_20px_50px_rgba(5,150,105,0.25)]';
      case 'elevated':
        return 'bg-white/85 dark:bg-[#091a2b]/85 border border-slate-200/90 dark:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]';
      case 'subtle':
        return 'bg-white/50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.04)]';
      default:
        return 'bg-white/70 dark:bg-[#071726]/75 border border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)]';
    }
  };

  const interactiveStyles = interactive
    ? 'hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_20px_45px_rgba(16,185,129,0.15)] dark:hover:border-emerald-400/40 cursor-pointer active:scale-[0.99] transition-all duration-300'
    : 'transition-all duration-300';

  return (
    <div
      className={`relative rounded-3xl backdrop-blur-2xl p-6 overflow-hidden ${getVariantStyles()} ${interactiveStyles} ${className}`}
      {...props}
    >
      {/* Specular glass reflection bar */}
      <div className="pointer-events-none absolute -inset-full opacity-0 hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12" />
      {children}
    </div>
  );
};
