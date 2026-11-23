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

    playHaptic('medium');
    investInProduct(selectedProduct.id, units);
    setBuyModalOpen(false);
  };

  const getRiskBadge = (level: InvestmentProduct['riskLevel']) => {
    switch (level) {
      case 'LOW':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
            Illustrative only
          </span>
        );
      case 'MODERATE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
            Illustrative only
          </span>
        );
      case 'HIGH':
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/25">
            Illustrative only
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
          <span>Investment preview</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Investment information
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Product examples are sample data. No investments, securities, or return figures are available.
        </p>
      </div>

      {/* Hero Portfolio Overview */}
      <div className="rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#0a2336] via-[#051824] to-[#010911] border border-blue-500/30 text-white shadow-[0_20px_50px_rgba(30,58,138,0.3)] backdrop-blur-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold">
            <Sparkles size={14} />
            <span>Preview data · no live investment service</span>
          </div>
          <p className="text-xs uppercase tracking-wider text-slate-300 font-medium">
            Investment balance
          </p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-mono">
            Not available
          </h2>
          <p className="text-xs text-emerald-400 font-semibold">
            No holdings or returns are connected.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
          <p className="text-[11px] text-slate-300 font-medium">Asset Allocation</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Asset allocation</span>
              <span className="font-bold font-mono">Unavailable</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Investment provider</span>
              <span className="font-bold font-mono">Not connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sample catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Illustrative Product Catalog
          </h2>
          <span className="text-xs text-slate-400">No active offers</span>
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
                  <span className="text-xs text-slate-400 block">Returns</span>
                  <span className="text-sm font-bold text-slate-500">Unavailable</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {prod.description}
              </p>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Tenure</span>
                  <span className="font-bold text-slate-900 dark:text-white">Unavailable</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Min Entry</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Unavailable
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Price / Unit</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    Unavailable
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  No live offer
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
          Investment holdings
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
              {userInvestments.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center font-sans text-slate-500">No investment account or holdings are connected.</td></tr>
              ) : userInvestments.map((inv) => (
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
                Investment information
              </span>
              <p className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                Not available
              </p>
            </div>

            <GlassInput
              label="Requested units (no live offer or pricing is available)"
              type="number"
              value={unitsToBuy}
              onChange={(e) => setUnitsToBuy(e.target.value)}
            />

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pricing</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                  Unavailable
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Settlement</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Unavailable
                </span>
              </div>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              onClick={handleExecuteInvestment}
              className="w-full mt-2"
            >
              Investment unavailable
            </GlassButton>
          </div>
        )}
      </GlassModal>
    </div>
  );
};
