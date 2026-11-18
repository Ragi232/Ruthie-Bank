"use client";

import React from 'react';
import { useBank } from '@/context/BankContext';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'gold' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const { playHaptic } = useBank();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-[0_10px_25px_rgba(5,150,105,0.35)] hover:shadow-[0_14px_30px_rgba(5,150,105,0.45)] border border-emerald-400/40 hover:brightness-105';
      case 'gold':
        return 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-semibold shadow-[0_10px_25px_rgba(245,158,11,0.3)] hover:shadow-[0_14px_30px_rgba(245,158,11,0.45)] border border-amber-300/50 hover:brightness-105';
      case 'secondary':
        return 'bg-[#091a2b] dark:bg-[#0d2236] text-white border border-white/10 hover:border-white/25 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:bg-[#122e49]';
      case 'danger':
        return 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 dark:text-rose-400 border border-rose-500/20 backdrop-blur-md';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200';
      case 'glass':
      default:
        return 'bg-white/80 dark:bg-white/[0.08] hover:bg-white/95 dark:hover:bg-white/[0.14] text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/15 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-3.5 py-1.5 rounded-xl gap-1.5';
      case 'lg':
        return 'text-base px-6 py-3.5 rounded-2xl gap-3 font-semibold';
      case 'icon':
        return 'p-2.5 rounded-2xl justify-center';
      case 'md':
      default:
        return 'text-sm px-4.5 py-2.5 rounded-2xl gap-2 font-medium';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    playHaptic('light');
    if (onClick) onClick(e);
  };

  return (
    <button
      disabled={disabled || loading}
      onClick={handleClick}
      className={`inline-flex items-center justify-center select-none cursor-pointer transition-all duration-200 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 relative overflow-hidden ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
