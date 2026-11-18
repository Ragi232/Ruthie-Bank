"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { Eye, EyeOff, Plus, ArrowUpRight, ArrowLeftRight, Copy, Check, ChevronDown } from 'lucide-react';
import { CurrencyCode } from '@/types';

export const GlassBalanceCard: React.FC = () => {
  const {
    balanceVisible,
    toggleBalanceVisible,
    selectedCurrency,
    setSelectedCurrency,
    wallets,
    user,
    setCurrentScreen,
    showDynamicIsland,
    playHaptic,
  } = useBank();

  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeWallet = wallets.find((w) => w.currency === selectedCurrency) || wallets[0];

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(user.accountNumber);
    setCopied(true);
    playHaptic('success');
    showDynamicIsland('Copied', `Ruthie Bank account ${user.accountNumber} copied`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCurrencySelect = (code: CurrencyCode) => {
    playHaptic('light');
    setSelectedCurrency(code);
    setDropdownOpen(false);
  };

  return (
    <div className="relative rounded-[32px] p-6 sm:p-8 text-white overflow-hidden shadow-[0_25px_60px_-15px_rgba(5,150,105,0.4)] border border-emerald-400/30 bg-gradient-to-br from-[#043328] via-[#082236] to-[#030d17] backdrop-blur-3xl transition-all duration-300">
      {/* Liquid glass light reflection circles */}
      <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-600/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl" />

      {/* Top Header inside Card */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Currency Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-xs font-semibold transition-colors"
            >
              <span className="text-base select-none">{activeWallet.flag}</span>
              <span>{activeWallet.currency} Wallet</span>
              <ChevronDown size={14} className="opacity-70" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-slate-950/95 backdrop-blur-3xl border border-white/20 p-1.5 shadow-2xl z-30 space-y-1">
                {wallets.map((w) => (
                  <button
                    key={w.currency}
                    onClick={() => handleCurrencySelect(w.currency)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      selectedCurrency === w.currency
                        ? 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{w.flag}</span>
                      <span>{w.currency}</span>
                    </span>
                    <span className="text-[10px] opacity-75 font-mono">
                      {w.symbol}
                      {w.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Show / Hide Balance Button */}
          <button
            onClick={toggleBalanceVisible}
            title={balanceVisible ? 'Hide balance' : 'Show balance'}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            {balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>

        {/* Account Number badge */}
        <button
          onClick={handleCopyAccount}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-mono border border-white/15 transition-colors"
        >
          <span>Demo acct: {user.accountNumber}</span>
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
      </div>

      {/* Main Balance Display */}
      <div className="relative space-y-1 my-4">
        <p className="text-xs uppercase font-medium tracking-wider text-emerald-300/80">
          Total Liquid Balance
        </p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-mono">
            {balanceVisible ? (
              <>
                <span className="text-emerald-400 mr-1">{activeWallet.symbol}</span>
                {activeWallet.balance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </>
            ) : (
              <>
                <span className="text-emerald-400 mr-1">{activeWallet.symbol}</span>
                ••••••••••
              </>
            )}
          </h2>
        </div>

        {activeWallet.currency !== 'NGN' && (
          <p className="text-xs text-white/70">
            ≈ ₦{(activeWallet.balance * activeWallet.rateToNgn).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            NGN equivalent
          </p>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="relative mt-7 pt-5 border-t border-white/15 grid grid-cols-3 gap-3">
        <button
          onClick={() => {
            playHaptic('medium');
            setCurrentScreen('transfers');
          }}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_8px_20px_rgba(16,185,129,0.35)] transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ArrowUpRight size={16} />
          <span>Send Money</span>
        </button>

        <button
          onClick={() => {
            playHaptic('medium');
            showDynamicIsland(
              'Add Money',
              `Fund your account via instant transfer to ${user.accountNumber}`,
              'success'
            );
          }}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Money</span>
        </button>

        <button
          onClick={() => {
            playHaptic('medium');
            setCurrentScreen('wallets');
          }}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ArrowLeftRight size={16} />
          <span>Swap FX</span>
        </button>
      </div>
    </div>
  );
};
