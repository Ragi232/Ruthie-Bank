"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassInput } from '@/components/glass/GlassInput';
import { InvestmentProduct } from '@/types';
import {
  TrendingUp,
  ShieldCheck,
  Building,
  Sparkles,
  Calendar,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export const InvestmentsScreen: React.FC = () => {
  const {
    investments,
    userInvestments,
    investInProduct,
    playHaptic,
    showDynamicIsland,
  } = useBank();

  const [selectedProduct, setSelectedProduct] = useState<InvestmentProduct | null>(null);
  const [unitsToBuy, setUnitsToBuy] = useState('10');
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [isInvesting, setIsInvesting] = useState(false);

  // Portfolio total
  const totalInvestedNGN = userInvestments.reduce((acc, inv) => acc + (inv.currency === 'NGN' ? inv.currentValue : 0), 0);

  const totalAccruedReturn = userInvestments.reduce((acc, inv) => acc + (inv.currency === 'NGN' ? inv.accruedReturn : 0), 0);

  const handleOpenBuy = (p: InvestmentProduct) => {
    playHaptic('light');
    setSelectedProduct(p);
    setUnitsToBuy('10');
    setBuyModalOpen(true);
  };

  const handleExecuteInvestment = () => {
    if (!selectedProduct) return;
    const units = parseInt(unitsToBuy) || 0;
    if (units <= 0) return;

    setIsInvesting(true);
    playHaptic('medium');

    setTimeout(() => {
      investInProduct(selectedProduct.id, units);
      setIsInvesting(false);
      setBuyModalOpen(false);
    }, 800);
  };

  const getRiskBadge = (level: InvestmentProduct['riskLevel']) => {
    switch (level) {
      case 'LOW':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
            Low Risk (Sovereign)
          </span>
        );
      case 'MODERATE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
            Moderate Risk
          </span>
        );
      case 'HIGH':
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/25">
            High Growth
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">
          <TrendingUp size={16} />
          <span>Capital Markets & Sovereign Debt</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Investment Portfolio & Securities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Institutional-grade fixed income, Federal Government Eurobonds, and curated US equities
        </p>
      </div>

      {/* Hero Portfolio Overview */}
      <div className="rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#0a2336] via-[#051824] to-[#010911] border border-blue-500/30 text-white shadow-[0_20px_50px_rgba(30,58,138,0.3)] backdrop-blur-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold">
            <Sparkles size={14} />
            <span>SEC Regulated & Sovereign Backed</span>
          </div>
          <p className="text-xs uppercase tracking-wider text-slate-300 font-medium">
            Active Investment Value (NGN Consolidated)
          </p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-mono">
            ₦{totalInvestedNGN.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-xs text-emerald-400 font-semibold">
            +₦{totalAccruedReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })} total accrued returns
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
          <p className="text-[11px] text-slate-300 font-medium">Asset Allocation</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">FRN Eurobonds (USD)</span>
              <span className="font-bold font-mono">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">High-Yield T-Bills</span>
              <span className="font-bold font-mono">32%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Securities Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Available Institutional Products
          </h2>
          <span className="text-xs text-slate-400">Vetted & Licensed Issuers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {investments.map((prod) => (
            <div
              key={prod.id}
              className="rounded-3xl p-6 bg-white/70 dark:bg-[#071726]/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-blue-500/40 transition-all duration-300 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getRiskBadge(prod.riskLevel)}
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {prod.currency}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Issuer: {prod.issuer}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block">Expected Return</span>
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    +{prod.projectedReturn}%
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">Annualized</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {prod.description}
              </p>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Tenure</span>
                  <span className="font-bold text-slate-900 dark:text-white">{prod.tenureDays} Days</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Min Entry</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {prod.currency} {prod.minInvestment.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Price / Unit</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {prod.currency} {prod.pricePerUnit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Available: {prod.availableUnits.toLocaleString()} units
                </span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenBuy(prod)}
                  icon={<ChevronRight size={14} />}
                  iconPosition="right"
                >
                  Invest Now
                </GlassButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Active Positions Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Your Active Holdings ({userInvestments.length})
        </h2>

        <div className="rounded-3xl bg-white/70 dark:bg-[#071726]/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/10 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Security Name</th>
                <th className="pb-3">Invested Principal</th>
                <th className="pb-3">Current Valuation</th>
                <th className="pb-3">Accrued Return</th>
                <th className="pb-3">Maturity Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
              {userInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <td className="py-3.5 font-sans font-bold text-slate-900 dark:text-white">
                    {inv.productName}
                  </td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300">
                    {inv.currency} {inv.investedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                    {inv.currency} {inv.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                    +{inv.currency} {inv.accruedReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 font-sans text-slate-500 dark:text-slate-400">
                    {inv.maturityDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buy Investment Units Modal */}
      <GlassModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        title={`Subscribe: ${selectedProduct?.name}`}
        subtitle={`Issuer: ${selectedProduct?.issuer}`}
        maxWidth="md"
      >
        {selectedProduct && (
          <div className="space-y-4 pt-1 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Annualized Compound Yield
              </span>
              <p className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                +{selectedProduct.projectedReturn}% APY
              </p>
            </div>

            <GlassInput
              label={`Number of Units (Price: ${selectedProduct.currency} ${selectedProduct.pricePerUnit} / unit)`}
              type="number"
              value={unitsToBuy}
              onChange={(e) => setUnitsToBuy(e.target.value)}
            />

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Investment Cost</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                  {selectedProduct.currency}{' '}
                  {((parseInt(unitsToBuy) || 0) * selectedProduct.pricePerUnit).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Settlement Currency</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedProduct.currency} Wallet
                </span>
              </div>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              loading={isInvesting}
              onClick={handleExecuteInvestment}
              className="w-full mt-2"
            >
              Confirm Subscription
            </GlassButton>
          </div>
        )}
      </GlassModal>
    </div>
  );
};
