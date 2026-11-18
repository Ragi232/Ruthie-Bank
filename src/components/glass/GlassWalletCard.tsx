"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { Wifi, Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react';

interface GlassWalletCardProps {
  cardHolder?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardType?: 'debit' | 'virtual' | 'black';
}

export const GlassWalletCard: React.FC<GlassWalletCardProps> = ({
  cardHolder = 'RUTHIE ADEBAYO',
  cardNumber = '5399 4820 9184 8492',
  expiry = '11/29',
  cvv = '482',
  cardType = 'black',
}) => {
  const { playHaptic, showDynamicIsland } = useBank();
  const [showDetails, setShowDetails] = useState(false);
  const [frozen, setFrozen] = useState(false);

  const toggleFreeze = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHaptic('medium');
    setFrozen(!frozen);
    showDynamicIsland(
      frozen ? 'Card Unfrozen' : 'Card Frozen',
      frozen ? 'Virtual Card is active for payments' : 'Virtual Card has been temporarily locked',
      frozen ? 'success' : 'security'
    );
  };

  return (
    <div
      className={`relative w-full aspect-[1.586/1] max-w-sm rounded-3xl p-6 text-white overflow-hidden select-none transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border ${
        frozen
          ? 'bg-slate-900/90 border-slate-700 opacity-80 filter grayscale'
          : cardType === 'black'
          ? 'bg-gradient-to-br from-[#0a2336] via-[#051824] to-[#010911] border-emerald-500/30'
          : 'bg-gradient-to-br from-[#065f46] via-[#043328] to-[#021812] border-emerald-400/40'
      }`}
    >
      {/* Metallic Holographic Mesh Glow */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -top-10 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl" />

      {/* Top row: Brand & Contactless Icon */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-base">ruthie</span>
          <span className="font-bold text-base text-emerald-400">bank</span>
          <span className="text-[10px] font-semibold text-emerald-300 ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30">
            PLATINUM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFreeze}
            title={frozen ? 'Unfreeze Card' : 'Freeze Card'}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {frozen ? <Lock size={14} className="text-rose-400" /> : <ShieldCheck size={14} className="text-emerald-400" />}
          </button>
          <Wifi size={20} className="text-white/70 rotate-90" />
        </div>
      </div>

      {/* EMV Chip Simulation */}
      <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border border-yellow-100/50 shadow-inner flex items-center justify-center p-1 mb-6">
        <div className="w-full h-full rounded border border-amber-800/30 grid grid-cols-2 gap-0.5 opacity-60">
          <div className="border-r border-b border-amber-900/30" />
          <div className="border-b border-amber-900/30" />
          <div className="border-r border-amber-900/30" />
          <div />
        </div>
      </div>

      {/* Card Number */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-base sm:text-lg tracking-widest font-semibold drop-shadow-sm">
          {showDetails ? cardNumber : `•••• •••• •••• ${cardNumber.slice(-4)}`}
        </p>
        <button
          onClick={() => {
            playHaptic('light');
            setShowDetails(!showDetails);
          }}
          className="p-1 text-white/60 hover:text-white"
        >
          {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Bottom row: Cardholder, Expiry, CVV */}
      <div className="flex items-end justify-between text-xs">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/50">Cardholder</p>
          <p className="font-semibold tracking-wider font-mono text-sm">{cardHolder}</p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/50">Expires</p>
            <p className="font-mono font-medium">{expiry}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/50">CVV</p>
            <p className="font-mono font-medium">{showDetails ? cvv : '•••'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
