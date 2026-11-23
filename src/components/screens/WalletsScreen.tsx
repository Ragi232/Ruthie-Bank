"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassCurrencyCard } from '@/components/glass/GlassCurrencyCard';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassInput } from '@/components/glass/GlassInput';
import { CurrencyCode, WalletBalance } from '@/types';
import {
  ArrowLeftRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe2,
  Info,
  AlertCircle,
} from 'lucide-react';

export const WalletsScreen: React.FC = () => {
  const {
    wallets,
    selectedCurrency,
    setSelectedCurrency,
    convertCurrency,
    playHaptic,
    showDynamicIsland,
  } = useBank();

  const [fromCurr, setFromCurr] = useState<CurrencyCode>('USD');
  const [toCurr, setToCurr] = useState<CurrencyCode>('NGN');
  const [fromAmount, setFromAmount] = useState<string>('500');
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [addWalletModalOpen, setAddWalletModalOpen] = useState(false);
  const [selectedWalletDetails, setSelectedWalletDetails] = useState<WalletBalance | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  const activeWallet = wallets.find((w) => w.currency === selectedCurrency) || wallets[0];
  const fromWallet = wallets.find((w) => w.currency === fromCurr) || wallets[0];
  const toWallet = wallets.find((w) => w.currency === toCurr) || wallets[1];

  // Calculate rate
  const rate =
    fromCurr === 'NGN'
      ? 1 / toWallet.rateToNgn
      : toCurr === 'NGN'
      ? fromWallet.rateToNgn
      : fromWallet.rateToNgn / toWallet.rateToNgn;

  const numFrom = parseFloat(fromAmount) || 0;
  const calculatedToAmount = numFrom * rate;

  const handleSwapCurrencies = () => {
    playHaptic('light');
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const handleStartReviewSwap = () => {
    if (numFrom <= 0) {
      showDynamicIsland('Invalid Amount', 'Enter an amount greater than 0', 'security');
      return;
    }
    playHaptic('medium');
    setConvertModalOpen(true);
  };

  const handleExecuteConvert = async () => {
    if (numFrom <= 0) return;
    setIsSwapping(true);
    playHaptic('medium');

    const res = await convertCurrency({
      fromCurrency: fromCurr,
      toCurrency: toCurr,
      fromAmount: numFrom,
      toAmount: calculatedToAmount,
      rate,
    });

    setIsSwapping(false);
    setConvertModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Globe2 size={16} />
            <span>Multi-Currency Core</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Global Wallets & FX
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Preview currency cards. No wallets, receiving accounts, exchange quotes, or conversions are connected.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GlassButton
            variant="glass"
            onClick={() => {
              playHaptic('light');
              setAddWalletModalOpen(true);
            }}
            icon={<Plus size={16} />}
          >
            Add Currency
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={() => {
              playHaptic('medium');
              handleStartReviewSwap();
            }}
            icon={<ArrowLeftRight size={16} />}
          >
            Convert Now
          </GlassButton>
        </div>
      </div>

      {/* Sandbox Transparency Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
        <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-950 dark:text-amber-100">
            Sample data only
          </p>
          <p className="opacity-90 leading-relaxed text-[11px]">
            Balances and exchange figures are illustrative. No treasury ledger or FX provider is connected, and no conversion can be completed.
          </p>
        </div>
      </div>

      {/* Grid of Multi-Currency Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Your Currency Balances
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wallets.map((wallet) => (
            <GlassCurrencyCard
              key={wallet.currency}
              wallet={wallet}
              selected={selectedCurrency === wallet.currency}
              onSelect={() => {
                playHaptic('light');
                setSelectedCurrency(wallet.currency);
                setSelectedWalletDetails(wallet);
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Split: Conversion Desk & Bank Requisites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instant Currency Swap Desk (2 cols) */}
        <div className="lg:col-span-2 rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Sample FX Estimate
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sample estimate only; no executable quote or settlement
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck size={14} />
              <span>Not a live rate</span>
            </div>
          </div>

          {/* Swap Inputs */}
          <div className="space-y-3">
            {/* From Input */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>You Send</span>
                <span>
                  Sample balance: {fromWallet.symbol}
                  {fromWallet.availableBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white outline-none"
                  placeholder="0.00"
                />
                <select
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value as CurrencyCode)}
                  aria-label="Source Currency"
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#0c243b] text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-white/15 outline-none cursor-pointer"
                >
                  {wallets.map((w) => (
                    <option key={w.currency} value={w.currency}>
                      {w.flag} {w.currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Invert Swap Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={handleSwapCurrencies}
                aria-label="Invert Currencies"
                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>

            {/* To Input */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>You Receive (Estimated)</span>
                <span>Institutional Mid-Market</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="w-full text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
                  {calculatedToAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value as CurrencyCode)}
                  aria-label="Destination Currency"
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#0c243b] text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-white/15 outline-none cursor-pointer"
                >
                  {wallets.map((w) => (
                    <option key={w.currency} value={w.currency}>
                      {w.flag} {w.currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Rate Diagnostic Details */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/[0.07] dark:bg-emerald-500/[0.1] border border-emerald-500/20 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Exchange Rate</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                1 {fromCurr} = {rate < 1 ? rate.toFixed(6) : rate.toLocaleString('en-US', { maximumFractionDigits: 2 })} {toCurr}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Conversion Fee</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₦0.00 (Zero Spread)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Settlement Speed</span>
              <span className="font-semibold text-slate-900 dark:text-white">Instant (0 seconds)</span>
            </div>
          </div>

          <GlassButton
            variant="primary"
            size="lg"
            onClick={handleStartReviewSwap}
            loading={isSwapping}
            className="w-full"
          >
            Review & Swap {fromCurr} for {toCurr}
          </GlassButton>
        </div>

        {/* Selected Wallet Requisites & Wire Info (1 col) */}
        <div className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {activeWallet.currency} Deposit Details
            </h2>
            <span className="text-xl select-none">{activeWallet.flag}</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Use these dedicated banking details to receive local and international wire transfers directly into your Ruthie {activeWallet.name} wallet.
          </p>

          <div className="space-y-3 text-xs">
            {activeWallet.accountNumber && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Account Number
                </span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {activeWallet.accountNumber}
                </p>
              </div>
            )}

            {activeWallet.iban && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  IBAN
                </span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {activeWallet.iban}
                </p>
              </div>
            )}

            {activeWallet.routingNo && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  ACH / Routing Number
                </span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {activeWallet.routingNo}
                </p>
              </div>
            )}

            {activeWallet.sortCode && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Sort Code
                </span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {activeWallet.sortCode}
                </p>
              </div>
            )}

            {activeWallet.bicSwift && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  SWIFT / BIC
                </span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {activeWallet.bicSwift}
                </p>
              </div>
            )}
          </div>

          <GlassButton
            variant="glass"
            onClick={() => {
              playHaptic('success');
              navigator.clipboard.writeText(
                `${activeWallet.currency} Requisites:\nAccount: ${activeWallet.accountNumber || activeWallet.iban}\nBank: Ruthie Bank International`
              );
              showDynamicIsland('Sample details copied', 'This is not a receiving account or wire instruction.', 'security');
            }}
            className="w-full"
          >
            Copy All Requisites
          </GlassButton>
        </div>
      </div>

      {/* FX Swap Review & Confirmation Modal */}
      <GlassModal
        isOpen={convertModalOpen}
        onClose={() => !isSwapping && setConvertModalOpen(false)}
        title="Review Currency Swap"
        subtitle="Institutional mid-market exchange quotation"
        maxWidth="md"
      >
        <div className="space-y-5 pt-1">
          {/* Visual Pair Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">You Debiting</p>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {fromWallet.symbol}{numFrom.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-400 font-medium">{fromWallet.name} ({fromCurr})</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ArrowLeftRight size={20} />
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">You Credited</p>
                <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {toWallet.symbol}{calculatedToAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-400 font-medium">{toWallet.name} ({toCurr})</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Exchange Rate:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  1 {fromCurr} = {rate < 1 ? rate.toFixed(6) : rate.toFixed(2)} {toCurr}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Settlement:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Instant Rebalance
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Spread Fee:</span>
                <p className="font-semibold text-emerald-500">
                  ₦0.00 (Zero Fee)
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Quote Guarantee:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Locked for 60s
                </p>
              </div>
            </div>
          </div>

          {/* Sandbox Warning */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
            <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <p>
              Currency conversion is unavailable. These wallet balances are sample data and no exchange will be executed.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <GlassButton
              variant="glass"
              onClick={() => setConvertModalOpen(false)}
              disabled={isSwapping}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              onClick={handleExecuteConvert}
              loading={isSwapping}
            >
              Confirm Swap
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Add Currency Modal */}
      <GlassModal
        isOpen={addWalletModalOpen}
        onClose={() => setAddWalletModalOpen(false)}
        title="Add Currency Wallet"
        subtitle="Currency account activation is unavailable in this preview."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Currency choices are illustrative. No account details, IBAN, routing code, or clearing account can be activated here.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
              { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
              { code: 'XAF', name: 'Central African CFA', flag: '🇨🇲' },
              { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
            ].map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  playHaptic('medium');
                  setAddWalletModalOpen(false);
                  showDynamicIsland('Wallet unavailable', 'No currency account was created. Wallet activation is not connected.', 'security');
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
              >
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500">
                    {c.code}
                  </p>
                  <p className="text-[11px] text-slate-400">{c.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
