"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassProgressRing } from '@/components/glass/GlassProgressRing';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassInput } from '@/components/glass/GlassInput';
import { PiggyBank, Plus, ShieldCheck, Sparkles, Lock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SavingsGoal, CurrencyCode } from '@/types';

export const SavingsScreen: React.FC = () => {
  const {
    savingsGoals,
    createSavingsGoal,
    depositToSavings,
    playHaptic,
    showDynamicIsland,
    wallets,
  } = useBank();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  // Form states for creating a goal
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState<'vault' | 'target' | 'flexi'>('target');
  const [maturityDate, setMaturityDate] = useState('31 Dec 2026');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [autoSaveAmount, setAutoSaveAmount] = useState('');

  // Deposit state
  const [depositAmount, setDepositAmount] = useState('');

  const totalSaved = savingsGoals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((acc, g) => acc + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    playHaptic('medium');
    createSavingsGoal({
      title,
      targetAmount: parseFloat(targetAmount) || 0,
      currency: 'NGN',
      category,
      interestRate: category === 'vault' ? 18.5 : category === 'target' ? 15.0 : 12.0,
      maturityDate,
      frequency,
      autoSaveAmount: parseFloat(autoSaveAmount) || 0,
      colorGradient: category === 'vault' ? ['#065f46', '#047857'] : ['#0d2236', '#14314c'],
    });

    setCreateModalOpen(false);
    setTitle('');
    setTargetAmount('');
    setAutoSaveAmount('');
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !depositAmount) return;

    const amt = parseFloat(depositAmount);
    playHaptic('medium');
    depositToSavings(selectedGoal.id, amt);

    setDepositModalOpen(false);
    setDepositAmount('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <PiggyBank size={16} />
            <span>High-Yield Wealth</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Ruthie Vault & Savings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sandbox preview: sample savings goals and illustrative rates only. No interest is earned or credited.
          </p>
        </div>

        <GlassButton
          variant="primary"
          onClick={() => {
            playHaptic('light');
            setCreateModalOpen(true);
          }}
          icon={<Plus size={16} />}
        >
          Create Savings Goal
        </GlassButton>
      </div>

      {/* Top Hero Banner: Overall Accumulation */}
      <div className="rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#064e3b]/80 via-[#0a273e]/90 to-[#020d18] border border-emerald-400/30 text-white shadow-[0_20px_50px_rgba(5,150,105,0.3)] backdrop-blur-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
            <Sparkles size={14} />
            <span>ILLUSTRATIVE DEMO RATE · NOT AN OFFER</span>
          </div>
          <p className="text-xs uppercase tracking-wider text-slate-300 font-medium">
            Total Saved Across All Goals
          </p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-mono">
            ₦{totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-xs text-emerald-300 font-semibold">
            Simulated sample data · no interest credited
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
          <GlassProgressRing progress={overallProgress} size={100} strokeWidth={9} color="#34d399" label="Overall" />
          <p className="text-xs font-bold text-white mt-2">
            Target: ₦{totalTarget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Savings Goals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Active Vaults & Goals ({savingsGoals.length})
          </h2>
          <span className="text-xs text-slate-400">Sample goals only · no funds are held</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {savingsGoals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const isVault = goal.category === 'vault';

            return (
              <div
                key={goal.id}
                className="rounded-3xl p-6 bg-white/70 dark:bg-[#071726]/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-emerald-500/40 transition-all duration-300 space-y-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isVault ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Lock size={12} />
                          Locked Vault
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Target Goal
                        </span>
                      )}
                      <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        Sample goal
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {goal.title}
                    </h3>
                  </div>

                  <GlassProgressRing progress={pct} size={70} strokeWidth={6} color="#10b981" />
                </div>

                {/* Amount Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      ₦{goal.currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-slate-400">
                      of ₦{goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    />
                  </div>
                </div>

                {/* Footer specs & Deposit action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-white/10 text-xs">
                  <div className="text-slate-500 dark:text-slate-400">
                    <span>Matures: </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {goal.maturityDate}
                    </span>
                  </div>

                  <GlassButton
                    variant="glass"
                    size="sm"
                    onClick={() => {
                      playHaptic('light');
                      setSelectedGoal(goal);
                      setDepositModalOpen(true);
                    }}
                    icon={<Plus size={14} />}
                  >
                    Deposit Funds
                  </GlassButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal 1: Create Goal */}
      <GlassModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Savings Plan"
        subtitle="Lock funds in Ruthie Vault or set up an automated goal"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-1">
          <GlassInput
            label="Plan Title"
            placeholder="e.g. Lagos Land Equity / Wedding / MacBook"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <GlassInput
            label="Target Amount (₦ NGN)"
            type="number"
            placeholder="1000000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">
              Goal type (preview)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'vault', label: 'Ruthie Vault' },
                { id: 'target', label: 'Target Goal' },
                { id: 'flexi', label: 'Flexi Anytime' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    category === c.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-slate-900 dark:text-white font-bold'
                      : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-500'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">{c.label}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Demo only
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">
                Auto-Save Cadence
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white outline-none"
              >
                <option value="daily">Daily Auto-Save</option>
                <option value="weekly">Weekly Auto-Save</option>
                <option value="monthly">Monthly Auto-Save</option>
              </select>
            </div>

            <GlassInput
              label="Auto-Save Amount (₦)"
              type="number"
              placeholder="25000"
              value={autoSaveAmount}
              onChange={(e) => setAutoSaveAmount(e.target.value)}
            />
          </div>

          <GlassButton variant="primary" size="lg" type="submit" className="w-full mt-2">
            Create Preview Goal
          </GlassButton>
        </form>
      </GlassModal>

      {/* Modal 2: Deposit into Goal */}
      <GlassModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        title={`Deposit to ${selectedGoal?.title}`}
        subtitle="Savings are unavailable. No funds will be moved or earn interest."
        maxWidth="sm"
      >
        <form onSubmit={handleDepositSubmit} className="space-y-4 pt-1">
          <GlassInput
            label="Deposit Amount (₦ NGN)"
            type="number"
            placeholder="50000"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            currencyPrefix="₦"
          />

          <GlassButton variant="primary" size="lg" type="submit" className="w-full">
            Confirm Deposit
          </GlassButton>
        </form>
      </GlassModal>
    </div>
  );
};
