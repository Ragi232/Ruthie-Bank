"use client";

import React, { useEffect } from 'react';
import { useBank } from '@/context/BankContext';
import { X } from 'lucide-react';

interface GlassBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const GlassBottomSheet: React.FC<GlassBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  const { playHaptic } = useBank();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    playHaptic('light');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Sheet panel */}
      <div className="relative w-full max-w-lg md:rounded-3xl rounded-t-[32px] bg-white/95 dark:bg-[#081829]/95 backdrop-blur-3xl border-t md:border border-slate-200/90 dark:border-white/15 p-6 shadow-[0_-15px_40px_rgba(0,0,0,0.3)] md:shadow-[0_25px_60px_rgba(0,0,0,0.5)] z-10 max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
        {/* iOS Grab Handle */}
        <div className="flex justify-center -mt-2 mb-4 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20" />
        </div>

        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            {title && (
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            aria-label="Close sheet"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
