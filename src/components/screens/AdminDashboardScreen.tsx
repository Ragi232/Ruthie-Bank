"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassTabBar } from '@/components/glass/GlassTabBar';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassModal } from '@/components/glass/GlassModal';
import {
  ShieldCheck,
  Users,
  Activity,
  Layers,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowLeftRight,
  Database,
  RefreshCw,
  Building2,
  DollarSign,
} from 'lucide-react';

export const AdminDashboardScreen: React.FC = () => {
  const {
    adminUsers,
    adminUpdateUserStatus,
    adminApproveKyc,
    transactions,
    playHaptic,
    showDynamicIsland,
  } = useBank();

  const [activeTab, setActiveTab] = useState<'users' | 'ledger' | 'kyc' | 'fx'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof adminUsers[0] | null>(null);

  // FX Spread control state
  const [usdRate, setUsdRate] = useState('1540.50');
  const [gbpRate, setGbpRate] = useState('1985.20');
  const [eurRate, setEurRate] = useState('1675.80');

  const filteredUsers = adminUsers.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
  });

  const handleUpdateRates = (e: React.FormEvent) => {
    e.preventDefault();
    playHaptic('success');
    showDynamicIsland({
      title: 'Administrator action unavailable',
      subtitle: 'This preview has no server-side admin or rate-management API. No changes were made.',
      type: 'security',
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-28 md:pb-12">
      <div role="status" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-200">
        Preview only: customer records, ledger figures, KYC states, and metrics below are sample data. Admin actions are disabled because no server-side admin API exists.
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Layers size={16} />
            <span>Executive Operations Cockpit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Admin Management Console</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
              PREVIEW ONLY
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time ledger surveillance, KYC authorization, client liquidity management, and FX rate governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Core Ledger: Synchronized (Block #8,941,029)</span>
          </div>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Core Liquidity</span>
            <Building2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">₦1,842,500,000</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+18.4% this quarter</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>24h Cleared Volume</span>
            <Activity size={16} className="text-sky-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">₦342,850,000</p>
          <span className="text-[10px] text-slate-400 font-medium">1,420 transactions settled</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Active Profiles</span>
            <Users size={16} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">14,892</p>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">98.2% Tier 2/3 verified</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>AML / Fraud Shield</span>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">100.0%</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">0 suspicious disputes</span>
        </div>
      </div>

      {/* Tabs */}
      <GlassTabBar
        tabs={[
          { id: 'users', label: 'Customer Management', count: adminUsers.length },
          { id: 'ledger', label: 'Live Ledger Audit Stream', count: transactions.length },
          { id: 'kyc', label: 'KYC Approval Queue' },
          { id: 'fx', label: 'FX Rate & Spread Controls' },
        ]}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as any)}
      />

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Customer Accounts ({adminUsers.length})
            </h2>

            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-white/10 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3">Balance</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Joined</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        Tier {u.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                      {u.balance}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono">{u.joinedDate}</td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.status === 'ACTIVE' ? (
                          <button
                            onClick={() => adminUpdateUserStatus(u.id, 'LOCKED')}
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                            title="Lock User Account"
                          >
                            <Lock size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => adminUpdateUserStatus(u.id, 'ACTIVE')}
                            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                            title="Unlock User Account"
                          >
                            <Unlock size={15} />
                          </button>
                        )}

                        {u.tier < 3 && (
                          <button
                            onClick={() => adminApproveKyc(u.id, (u.tier + 1) as any)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-500 transition-colors"
                          >
                            Upgrade Tier {u.tier + 1}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE LEDGER AUDIT STREAM */}
      {activeTab === 'ledger' && (
        <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Cryptographic Ledger Entries ({transactions.length})
            </h2>
            <span className="text-xs text-emerald-500 font-mono">0 pending reconciliations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-white/10 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Counterparty</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Fee</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {tx.reference}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {tx.type}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                      {tx.recipientOrSender}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {tx.currency} {tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-400">
                      ₦{tx.fee.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono">{tx.timestamp}</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Sample record
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KYC APPROVAL QUEUE */}
      {activeTab === 'kyc' && (
        <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Pending Identity Verification Submissions
          </h2>

          <div className="space-y-3">
            {[
              {
                id: 'kyc_1',
                name: 'Chukwuma Eze',
                tierRequested: 2,
                docType: 'Bank Verification Number (BVN) + NIMC NIN',
                number: '2234****891',
                submitted: '2 hours ago',
              },
              {
                id: 'kyc_2',
                name: 'Kelechi Nwosu',
                tierRequested: 2,
                docType: 'Nigerian International Passport',
                number: 'A089****12',
                submitted: '5 hours ago',
              },
            ].map((k) => (
              <div
                key={k.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{k.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-500">
                      Upgrade to Tier {k.tierRequested}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {k.docType} · Document No: <span className="font-mono text-slate-900 dark:text-white">{k.number}</span>
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block">Submitted: {k.submitted}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playHaptic('warning');
                      showDynamicIsland('KYC review unavailable', 'This sample record was not reviewed or changed.', 'security');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Approve Verification
                  </button>
                  <button
                    onClick={() => {
                      playHaptic('warning');
                      showDynamicIsland('KYC review unavailable', 'This sample record was not reviewed or changed.', 'security');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold text-xs border border-rose-500/20 transition-all cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FX RATE & SPREAD CONTROLS */}
      {activeTab === 'fx' && (
        <form onSubmit={handleUpdateRates} className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Institutional Mid-Market Rate Governance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure baseline conversion rates published to all currency exchange widgets
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                USD / NGN (United States Dollar)
              </label>
              <input
                type="text"
                value={usdRate}
                onChange={(e) => setUsdRate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 font-mono font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                GBP / NGN (British Pound)
              </label>
              <input
                type="text"
                value={gbpRate}
                onChange={(e) => setGbpRate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 font-mono font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                EUR / NGN (Euro)
              </label>
              <input
                type="text"
                value={eurRate}
                onChange={(e) => setEurRate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 font-mono font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <GlassButton variant="primary" size="lg" type="submit" className="w-full sm:w-auto">
            Publish New Exchange Rates
          </GlassButton>
        </form>
      )}
    </div>
  );
};
