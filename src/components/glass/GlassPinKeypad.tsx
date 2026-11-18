"use client";

import React from 'react';
import { useBank } from '@/context/BankContext';
import { Delete, ScanFace } from 'lucide-react';

interface GlassPinKeypadProps {
  pin: string;
  onChange: (pin: string) => void;
  maxLength?: number;
  onBiometric?: () => void;
  showBiometric?: boolean;
}

export const GlassPinKeypad: React.FC<GlassPinKeypadProps> = ({
  pin,
  onChange,
  maxLength = 6,
  onBiometric,
  showBiometric = true,
}) => {
  const { playHaptic } = useBank();

  const handleDigit = (digit: string) => {
    if (pin.length < maxLength) {
      playHaptic('medium');
      onChange(pin + digit);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      playHaptic('light');
      onChange(pin.slice(0, -1));
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto space-y-6">
      {/* 6 PIN Indicator Dots */}
      <div className="flex items-center justify-center gap-3.5 py-2">
        {Array.from({ length: maxLength }).map((_, i) => {
          const filled = i < pin.length;
          return (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                filled
                  ? 'bg-emerald-500 scale-110 shadow-[0_0_10px_#10b981]'
                  : 'bg-slate-300 dark:bg-white/20'
              }`}
            />
          );
        })}
      </div>

      {/* Numeric 3x4 Grid */}
      <div className="grid grid-cols-3 gap-4 place-items-center">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit)}
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-mono text-slate-900 dark:text-white bg-slate-100/80 dark:bg-white/[0.08] hover:bg-slate-200/90 dark:hover:bg-white/[0.16] active:scale-90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm transition-all duration-150 select-none cursor-pointer"
          >
            {digit}
          </button>
        ))}

        {/* Bottom row: Biometric / 0 / Delete */}
        {showBiometric && onBiometric ? (
          <button
            type="button"
            onClick={() => {
              playHaptic('success');
              onBiometric();
            }}
            title="Authenticate with Biometrics / Passkey"
            className="w-16 h-16 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-90 transition-all select-none cursor-pointer"
          >
            <ScanFace size={24} />
          </button>
        ) : (
          <div className="w-16 h-16" />
        )}

        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-mono text-slate-900 dark:text-white bg-slate-100/80 dark:bg-white/[0.08] hover:bg-slate-200/90 dark:hover:bg-white/[0.16] active:scale-90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm transition-all duration-150 select-none cursor-pointer"
        >
          0
        </button>

        <button
          type="button"
          onClick={handleDelete}
          title="Backspace"
          className="w-16 h-16 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all select-none cursor-pointer"
        >
          <Delete size={22} />
        </button>
      </div>
    </div>
  );
};
