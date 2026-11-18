"use client";

import React from 'react';
import { WalletBalance } from '@/types';
import { useBank } from '@/context/BankContext';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';

interface GlassCurrencyCardProps {
  wallet: WalletBalance;
  onSelect?: () => void;
  selected?: boolean;
}

export const GlassCurrencyCard: React.FC<GlassCurrencyCardProps> = ({
  wallet,
  onSelect,
  selected = false,
}) => {
  const { balanceVisible, playHaptic, showDynamicIsland } = useBank();
  const [copied, setCopied] = React.useState(false);

  const copyAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    const acct = wallet.accountNumber || wallet.iban || '';
    if (acct) {
      navigator.clipboard.writeText(acct);
      setCopied(true);
      playHaptic('success');
      showDynamicIsland('Copied to Clipboard', `${wallet.currency} Account details copied`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-3xl p-5 backdrop-blur-2xl transition-all duration-300 cursor-pointer overflow-hidden border ${
        selected
          ? 'bg-gradient-to-br from-emerald-600/20 via-slate-900/40 to-[#04121e]/90 border-emerald-400 shadow-[0_12px_36px_rgba(5,150,105,0.25)]'
          : 'bg-white/70 dark:bg-[#071726]/75 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm'
      }`}
    >
      {/* Top row: Flag, Name, Currency Code */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl filter drop-shadow-sm select-none">{wallet.flag}</span>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {wallet.currency}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {wallet.name}
            </p>
          </div>
        </div>

        {wallet.accountNumber && (
          <button
            onClick={copyAccount}
            title="Copy account number"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.08] text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.14] transition-colors"
          >
            <span>{wallet.accountNumber}</span>
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          </button>
        )}
      </div>

      {/* Balance figure */}
      <div className="space-y-1 mb-4">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
          Available Balance
        </p>
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
          {balanceVisible ? (
            <>
              {wallet.symbol}
              {wallet.balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </>
          ) : (
            `${wallet.symbol} ••••••••`
          )}
        </p>
      </div>

      {/* Bottom row: Conversion rate against NGN */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-white/10 text-xs">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {wallet.currency === 'NGN' ? 'Primary Home Wallet' : `1 ${wallet.currency} ≈ ₦${wallet.rateToNgn.toLocaleString()}`}
        </span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
          <ArrowLeftRight size={12} />
          Convert
        </span>
      </div>
    </div>
  );
};
