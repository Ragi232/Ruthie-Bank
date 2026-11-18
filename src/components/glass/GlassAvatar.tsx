"use client";

import React from 'react';

interface GlassAvatarProps {
  initials?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tier?: 1 | 2 | 3;
  online?: boolean;
  className?: string;
}

export const GlassAvatar: React.FC<GlassAvatarProps> = ({
  initials = 'RA',
  name = 'Ruthie Adebayo',
  size = 'md',
  tier = 3,
  online = true,
  className = '',
}) => {
  const getInitials = () => {
    if (initials) return initials;
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'lg':
        return 'w-14 h-14 text-lg';
      case 'xl':
        return 'w-20 h-20 text-2xl';
      case 'md':
      default:
        return 'w-10 h-10 text-sm';
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer ambient glow ring */}
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 opacity-70 blur-[2px]" />

      <div
        className={`relative flex items-center justify-center rounded-full font-bold text-white bg-gradient-to-br from-[#064e3b] via-[#0b2b40] to-[#04121e] border border-white/20 shadow-inner select-none ${getSizeClasses()}`}
      >
        {getInitials()}
      </div>

      {tier && (
        <span
          title={`Tier ${tier} Verified Account`}
          className="absolute -bottom-1 -right-1 flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-500 text-slate-950 border border-white shadow-sm"
        >
          T{tier}
        </span>
      )}

      {online && !tier && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950" />
      )}
    </div>
  );
};
