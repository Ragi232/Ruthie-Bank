"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassButton } from '@/components/glass/GlassButton';
import { CheckCircle2, Download, Share2, Copy, Check, ShieldCheck } from 'lucide-react';

export const TransactionReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, playHaptic, showDynamicIsland } = useBank();
  const [downloading, setDownloading] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  if (!activeReceipt) return null;

  const handleCopyReference = () => {
    navigator.clipboard.writeText(activeReceipt.reference);
    setCopiedRef(true);
    playHaptic('success');
    showDynamicIsland('Copied', 'Transaction reference code copied', 'success');
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleDownload = () => {
    playHaptic('medium');
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      playHaptic('success');
      showDynamicIsland('Receipt Saved', `Receipt ${activeReceipt.reference}.pdf downloaded`, 'success');
    }, 1200);
  };

  const handleShare = () => {
    playHaptic('light');
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `Ruthie Bank Receipt - ${activeReceipt.reference}`,
        text: `Transaction of ${activeReceipt.currency} ${activeReceipt.amount} to ${activeReceipt.recipientOrSender} was successful.`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Ruthie Bank Receipt\nRef: ${activeReceipt.reference}\nAmount: ${activeReceipt.currency} ${activeReceipt.amount}\nTo: ${activeReceipt.recipientOrSender}\nStatus: ${activeReceipt.status}`
      );
      showDynamicIsland('Receipt Copied', 'Receipt summary copied to clipboard', 'success');
    }
  };

  return (
    <GlassModal
      isOpen={Boolean(activeReceipt)}
      onClose={() => setActiveReceipt(null)}
      title="Transaction Receipt"
      subtitle="Sandbox Demonstration Record · Non-Settled Preview"
      maxWidth="md"
    >
      <div className="space-y-5 pt-2">
        {/* Sandbox Indicator Notice */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-center justify-between">
          <span className="font-semibold">Development Sandbox Simulation</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 font-bold">Preview Only</span>
        </div>

        {/* Success Banner */}
        <div className="flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.5)] mb-3">
            <CheckCircle2 size={32} />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
            Sandbox Simulation Completed
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono mt-1">
            {activeReceipt.currency} {activeReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeReceipt.title}
          </p>
        </div>

        {/* Detailed Receipt Fields */}
        <div className="rounded-2xl bg-slate-50/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Recipient / Counterparty</span>
            <span className="font-semibold text-slate-900 dark:text-white text-right">
              {activeReceipt.recipientOrSender}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Execution Date</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {activeReceipt.timestamp}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Network Fee</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {activeReceipt.fee === 0 ? '₦0.00 (Zero Fee)' : `₦${activeReceipt.fee.toFixed(2)}`}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Audit Reference</span>
            <button
              onClick={handleCopyReference}
              className="flex items-center gap-1.5 font-mono font-semibold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors"
            >
              <span>{activeReceipt.reference}</span>
              {copiedRef ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Clearing Status</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sandbox Reconciled
            </span>
          </div>

          {activeReceipt.metadata?.token && (
            <div className="flex items-center justify-between py-1.5 px-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-600 dark:text-amber-400 font-bold">Simulated Prepaid Token</span>
              <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                {activeReceipt.metadata.token}
              </span>
            </div>
          )}
        </div>

        {/* Security verification stamp */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 select-none text-center">
          <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
          <span>Ruthie Bank Development Sandbox · Live interbank clearing provider not connected</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <GlassButton
            variant="glass"
            onClick={handleDownload}
            loading={downloading}
            icon={<Download size={15} />}
          >
            Download PDF
          </GlassButton>

          <GlassButton
            variant="primary"
            onClick={handleShare}
            icon={<Share2 size={15} />}
          >
            Share Receipt
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
