"use client";

import React from 'react';
import { TransactionRecord } from '@/types';
import { useBank } from '@/context/BankContext';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Zap,
  PiggyBank,
  TrendingUp,
  Compass,
} from 'lucide-react';

interface GlassTransactionItemProps {
  transaction: TransactionRecord;
}

export const GlassTransactionItem: React.FC<GlassTransactionItemProps> = ({ transaction }) => {
  const { setActiveReceipt, playHaptic } = useBank();

  const isCredit = transaction.type === 'TRANSFER_IN';

  const getCategoryIcon = () => {
    switch (transaction.category) {
      case 'transfer':
        return isCredit ? (
          <ArrowDownLeft size={16} className="text-emerald-500" />
        ) : (
          <ArrowUpRight size={16} className="text-slate-600 dark:text-slate-300" />
        );
      case 'fx':
        return <ArrowLeftRight size={16} className="text-teal-500" />;
      case 'bills':
        return <Zap size={16} className="text-amber-500" />;
      case 'savings':
        return <PiggyBank size={16} className="text-emerald-500" />;
      case 'investment':
        return <TrendingUp size={16} className="text-blue-500" />;
      case 'lifestyle':
        return <Compass size={16} className="text-purple-500" />;
      default:
        return <ArrowUpRight size={16} className="text-slate-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (transaction.status) {
      case 'PENDING':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400">
            Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400">
            Failed
          </span>
        );
      case 'PREVIEW':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300">
            Sample
          </span>
        );
      case 'SUCCEEDED':
      default:
        return null;
    }
  };

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'USD':
        return '$';
      case 'GBP':
        return '£';
      case 'EUR':
        return '€';
      case 'CAD':
        return 'C$';
      case 'GHS':
        return 'GH₵';
      case 'KES':
        return 'KSh ';
      case 'NGN':
      default:
        return '₦';
    }
  };

  const handleClick = () => {
    playHaptic('light');
    setActiveReceipt(transaction);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-all duration-200 cursor-pointer group select-none"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/[0.08] border border-slate-200/80 dark:border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-200">
          {getCategoryIcon()}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {transaction.title}
            </p>
            {getStatusBadge()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {transaction.recipientOrSender} · {transaction.timestamp}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 ml-3">
        <p
          className={`text-xs sm:text-sm font-bold font-mono ${
            isCredit
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {isCredit ? '+' : '−'}
          {getCurrencySymbol(transaction.currency)}
          {transaction.amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="text-[10px] text-slate-400 font-medium">{transaction.currency}</p>
      </div>
    </div>
  );
};
