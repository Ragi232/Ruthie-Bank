"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassInput } from '@/components/glass/GlassInput';
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Calculator,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const LoansScreen: React.FC = () => {
  const {
    loanEligibility,
    applyForLoan,
    repayActiveLoan,
    playHaptic,
    showDynamicIsland,
  } = useBank();

  // Calculator sliders
  const [calcAmount, setCalcAmount] = useState<number>(500000);
  const [calcDuration, setCalcDuration] = useState<number>(6);

  // Application modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [purpose, setPurpose] = useState('Business Expansion');
  const [isApplying, setIsApplying] = useState(false);

  // Repay modal
  const [repayModalOpen, setRepayModalOpen] = useState(false);
  const [repayAmount, setRepayAmount] = useState('89583');
  const [isRepaying, setIsRepaying] = useState(false);

  // Calculate monthly installment: interest is 2% per month
  const monthlyInterestRate = 0.02;
  const totalInterest = calcAmount * monthlyInterestRate * calcDuration;
  const totalPayable = calcAmount + totalInterest;
  const monthlyInstallment = totalPayable / calcDuration;

  const activeLoan = loanEligibility.currentActiveLoan;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    playHaptic('medium');

    setTimeout(() => {
      applyForLoan(calcAmount, calcDuration, purpose);
      setIsApplying(false);
      setApplyModalOpen(false);
    }, 1000);
  };

  const handleRepaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(repayAmount);
    if (amt <= 0) return;

    setIsRepaying(true);
    playHaptic('medium');

    setTimeout(() => {
      repayActiveLoan(amt);
      setIsRepaying(false);
      setRepayModalOpen(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
          <CreditCard size={16} />
          <span>Microfinance & Credit Lines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Digital Loans & Prime Credit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Instant disbursement directly into your NGN wallet with competitive 2.0% monthly interest
        </p>
      </div>

      {/* Credit Gauge & Active Loan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credit Score Gauge (1 col) */}
        <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Credit Score
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Tier 1 Prime
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-emerald-500">
              {loanEligibility.creditScore}
            </span>
            <span className="text-xs text-slate-400">/ 850</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Excellent credit rating. You qualify for instant pre-approved credit lines up to ₦
            {loanEligibility.maxAmount.toLocaleString()} without collateral.
          </p>
        </div>

        {/* Active Loan Card (2 cols) */}
        <div className="md:col-span-2 rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#121c2b] via-[#091522] to-[#040910] border border-white/10 text-white shadow-xl backdrop-blur-3xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <h2 className="text-base font-bold text-white">
                Active Loan Facility
              </h2>
            </div>
            {activeLoan && activeLoan.status === 'ACTIVE' ? (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ACTIVE · ON TRACK
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
                NO OUTSTANDING LOAN
              </span>
            )}
          </div>

          {activeLoan && activeLoan.status === 'ACTIVE' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Total Due</span>
                  <span className="text-lg font-bold font-mono text-white">
                    ₦{activeLoan.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Already Repaid</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    ₦{activeLoan.repaidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Next Installment</span>
                  <span className="text-lg font-bold font-mono text-amber-400">
                    ₦{activeLoan.monthlyInstallment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Due Date</span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {activeLoan.nextDueDate}
                  </span>
                </div>
              </div>

              {/* Repay Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Repaying early boosts your credit score and unlocks lower interest rates.
                </span>
                <GlassButton
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    playHaptic('light');
                    setRepayAmount(Math.round(activeLoan.monthlyInstallment).toString());
                    setRepayModalOpen(true);
                  }}
                >
                  Repay Now
                </GlassButton>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-2">
              <p className="text-sm text-slate-300">
                You have zero active debt. Use the calculator below to request instant disbursement.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Loan Calculator Section */}
      <div className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Calculator size={16} />
              <span>Loan Estimator</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Instant Credit Calculator
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            2.0% Monthly Flat
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sliders */}
          <div className="space-y-6">
            {/* Amount Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Borrowing Amount
                </span>
                <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  ₦{calcAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={2500000}
                step={50000}
                value={calcAmount}
                onChange={(e) => setCalcAmount(parseInt(e.target.value))}
                aria-label="Borrowing Amount"
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-white/10 accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₦50,000</span>
                <span>Max: ₦2,500,000</span>
              </div>
            </div>

            {/* Duration Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Loan Tenure
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {calcDuration} Months
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={calcDuration}
                onChange={(e) => setCalcDuration(parseInt(e.target.value))}
                aria-label="Loan Tenure in Months"
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-white/10 accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 Month</span>
                <span>12 Months</span>
              </div>
            </div>
          </div>

          {/* Repayment Breakdown & Apply Button */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-4">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Monthly Repayment</span>
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  ₦{monthlyInstallment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  <span className="text-xs font-normal text-slate-400"> / mo</span>
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500">Total Interest (2.0%/mo)</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  ₦{totalInterest.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500">Total Payable Amount</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  ₦{totalPayable.toLocaleString()}
                </span>
              </div>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => {
                playHaptic('medium');
                setApplyModalOpen(true);
              }}
              className="w-full"
            >
              Apply for ₦{calcAmount.toLocaleString()} Instant Loan
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Apply Loan Modal */}
      <GlassModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Instant Loan Application"
        subtitle={`Requesting ₦${calcAmount.toLocaleString()} for ${calcDuration} months`}
        maxWidth="md"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4 pt-1 text-xs">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">
              Purpose of Loan
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold outline-none"
            >
              <option value="Business Inventory Expansion">Business Inventory Expansion</option>
              <option value="Personal / Medical Emergency">Personal / Medical Emergency</option>
              <option value="Rent / Housing Advance">Rent / Housing Advance</option>
              <option value="Tech Workstation Equipment">Tech Workstation Equipment</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <p className="font-bold text-emerald-600 dark:text-emerald-400">
              Pre-Approved Instant Credit
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Because your credit score is {loanEligibility.creditScore}, funds will disburse automatically into your primary NGN account immediately upon signing.
            </p>
          </div>

          <GlassButton
            variant="primary"
            size="lg"
            type="submit"
            loading={isApplying}
            className="w-full"
          >
            Sign & Accept Disbursement
          </GlassButton>
        </form>
      </GlassModal>

      {/* Repay Loan Modal */}
      <GlassModal
        isOpen={repayModalOpen}
        onClose={() => setRepayModalOpen(false)}
        title="Repay Loan Installment"
        subtitle="Repay from your available NGN wallet"
        maxWidth="sm"
      >
        <form onSubmit={handleRepaySubmit} className="space-y-4 pt-1">
          <GlassInput
            label="Amount to Repay (₦)"
            type="number"
            value={repayAmount}
            onChange={(e) => setRepayAmount(e.target.value)}
            currencyPrefix="₦"
          />

          <GlassButton
            variant="gold"
            size="lg"
            type="submit"
            loading={isRepaying}
            className="w-full"
          >
            Authorize Repayment
          </GlassButton>
        </form>
      </GlassModal>
    </div>
  );
};
