"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassTransactionItem } from '@/components/glass/GlassTransactionItem';
import { GlassTabBar } from '@/components/glass/GlassTabBar';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassButton } from '@/components/glass/GlassButton';
import { History, Search, Download, Filter, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const TransactionHistoryScreen: React.FC = () => {
  const { transactions, showDynamicIsland, playHaptic } = useBank();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'INCOMING' | 'OUTGOING' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = transactions.filter((tx) => {
    // Status filter
    if (filterStatus === 'INCOMING' && tx.type !== 'TRANSFER_IN') return false;
    if (filterStatus === 'OUTGOING' && tx.type === 'TRANSFER_IN') return false;
    if (filterStatus === 'PENDING' && tx.status !== 'PENDING') return false;

    // Category filter
    if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        tx.title.toLowerCase().includes(q) ||
        tx.recipientOrSender.toLowerCase().includes(q) ||
        tx.reference.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleDownloadStatement = () => {
    playHaptic('medium');
    showDynamicIsland({ title: 'Statement export unavailable', subtitle: 'No verified ledger or statement service is connected.', type: 'security' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <History size={16} />
            <span>Sample History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Activity & Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sample records only. This history is not a ledger or proof of payment.
          </p>
        </div>

        <GlassButton
          variant="glass"
          onClick={handleDownloadStatement}
          icon={<Download size={16} />}
        >
          Export Statement
        </GlassButton>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <GlassTabBar
            tabs={[
              { id: 'ALL', label: 'All Transactions', count: transactions.length },
              { id: 'INCOMING', label: 'Inflow (+)', count: transactions.filter((t) => t.type === 'TRANSFER_IN').length },
              { id: 'OUTGOING', label: 'Outflow (−)', count: transactions.filter((t) => t.type !== 'TRANSFER_IN').length },
              { id: 'PENDING', label: 'Pending', count: transactions.filter((t) => t.status === 'PENDING').length },
            ]}
            activeTab={filterStatus}
            onChange={(tab) => setFilterStatus(tab as any)}
          />
        </div>

        <GlassInput
          placeholder="Search by name, reference, or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search size={16} />}
          clearable
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Transaction List Box */}
      <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-2">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {filtered.map((tx) => (
              <GlassTransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <History size={40} className="mx-auto text-slate-400 opacity-60" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No transactions match your search
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your query or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
