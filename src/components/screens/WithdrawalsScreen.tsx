"use client";

import React, { useState, useEffect } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassPinKeypad } from '@/components/glass/GlassPinKeypad';
import {
  ArrowDownLeft,
  Building2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  AlertCircle,
  Smartphone,
  CreditCard,
  RefreshCw,
} from 'lucide-react';

export const WithdrawalsScreen: React.FC = () => {
  const {
    wallets,
    withdrawMoney,
    playHaptic,
    showDynamicIsland,
    user,
  } = useBank();

  const [method, setMethod] = useState<'atm' | 'bank'>('atm');
  const [amount, setAmount] = useState('20000');
  const [bankName, setBankName] = useState('GTBank (Guaranty Trust)');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [resolvedName, setResolvedName] = useState('Ruthie Adebayo');
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);

  // Cash code state
  const [activeCashCode, setActiveCashCode] = useState<string | null>(null);
  const [codeExpiresIn, setCodeExpiresIn] = useState<number>(900); // 15 mins in sec
  const [copiedCode, setCopiedCode] = useState(false);

  // Security authorization modal
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const ngnWallet = wallets.find((w) => w.currency === 'NGN') || wallets[0];
  const numAmount = parseFloat(amount) || 0;
  const dailyLimit = 500000;
  const dailyUsed = 120000;
  const remainingLimit = dailyLimit - dailyUsed;

  // Countdown timer for active ATM cash code
  useEffect(() => {
    if (!activeCashCode || codeExpiresIn <= 0) return;
    const interval = setInterval(() => {
      setCodeExpiresIn((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveCashCode(null);
          showDynamicIsland({
            title: 'Cash Code Expired',
            subtitle: 'The 15-minute cash-out window has elapsed',
            type: 'security',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCashCode, codeExpiresIn, showDynamicIsland]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAccountChange = (val: string) => {
    setAccountNumber(val);
    if (val.length === 10) {
      setIsVerifyingAccount(true);
      playHaptic('light');
      setTimeout(() => {
        setIsVerifyingAccount(false);
        setResolvedName('Ruthie O. Adebayo');
      }, 600);
    } else {
      setResolvedName('');
    }
  };

  const handleStartWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      showDynamicIsland({
        title: 'Invalid Amount',
        subtitle: 'Enter a valid amount to withdraw',
        type: 'security',
      });
      return;
    }
    if (numAmount > ngnWallet.availableBalance) {
      showDynamicIsland({
        title: 'Insufficient Balance',
        subtitle: `Available balance: ₦${ngnWallet.availableBalance.toLocaleString()}`,
        type: 'security',
      });
      return;
    }
    if (numAmount > remainingLimit) {
      showDynamicIsland({
        title: 'Limit Exceeded',
        subtitle: `Maximum daily remaining limit is ₦${remainingLimit.toLocaleString()}`,
        type: 'security',
      });
      return;
    }

    playHaptic('medium');
    setPin('');
    setPinModalOpen(true);
  };

  const handlePinSubmit = async (enteredPin: string) => {
    setPin(enteredPin);
    if (enteredPin.length === 6) {
      setIsSubmitting(true);
      playHaptic('medium');

      const res = await withdrawMoney({
        method,
        amount: numAmount,
        currency: 'NGN',
        bankName: method === 'bank' ? bankName : undefined,
        accountNumber: method === 'bank' ? accountNumber : undefined,
        recipientName: method === 'bank' ? resolvedName || 'Ruthie Adebayo' : undefined,
      });

      setIsSubmitting(false);
      setPinModalOpen(false);

      if (res.success && method === 'atm' && res.cashCode) {
        setActiveCashCode(res.cashCode);
        setCodeExpiresIn(900);
      }
    }
  };

  const handleCopyCashCode = () => {
    if (!activeCashCode) return;
    navigator.clipboard.writeText(activeCashCode.replace(/\s+/g, ''));
    setCopiedCode(true);
    playHaptic('success');
    showDynamicIsland('Copied', 'ATM cash code copied to clipboard', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <ArrowDownLeft size={16} />
            <span>Liquid Cash Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Withdrawals & ATM Cash Out
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Cardless cash extraction at 25,000+ partner ATMs nationwide or direct external settlement
          </p>
        </div>

        <button
          onClick={() => {
            playHaptic('light');
            setQrModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-800 dark:text-white transition-all shadow-sm"
        >
          <QrCode size={16} className="text-emerald-500" />
          <span>Scan ATM QR</span>
        </button>
      </div>

      {/* Daily Limits & Balance Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#071726]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available to Withdraw</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₦{ngnWallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Primary NGN Wallet</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#071726]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily ATM Cash Limit</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₦{dailyLimit.toLocaleString()}
          </p>
          <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              style={{ width: `${(dailyUsed / dailyLimit) * 100}%` }}
              className="bg-emerald-500 h-full rounded-full"
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">₦{remainingLimit.toLocaleString()} remaining today</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#071726]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Zero Cash-Out Fee</p>
            <p className="text-[11px] text-slate-400">Ruthie Bank subsidizes standard Interswitch/NIBSS ATM fees</p>
          </div>
        </div>
      </div>

      {/* Active ATM Code Banner (if generated) */}
      {activeCashCode && (
        <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-500/20 via-teal-600/20 to-slate-900/90 border-2 border-emerald-400/50 backdrop-blur-3xl shadow-[0_16px_40px_rgba(16,185,129,0.3)] animate-in fade-in slide-in-from-top-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                Active ATM Cash Code Ready
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 border border-emerald-400/30 text-xs font-mono font-bold text-emerald-300">
              <Clock size={13} />
              <span>Expires in {formatTimer(codeExpiresIn)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <div>
              <p className="text-xs text-slate-300">Punch this 8-digit one-time code on any partner ATM screen:</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-[0.25em] text-white bg-slate-950/70 px-5 py-2.5 rounded-2xl border border-white/20 select-all">
                  {activeCashCode}
                </span>
                <button
                  onClick={handleCopyCashCode}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
                  title="Copy Cash Code"
                  aria-label="Copy Code"
                >
                  {copiedCode ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-300 sm:text-right space-y-1">
              <p className="font-semibold text-white">Amount: ₦{numAmount.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400">Step: Select &quot;Quickteller / Cardless&quot; on ATM</p>
              <p className="text-[11px] text-slate-400">Enter code + your 4-digit card PIN</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Withdrawal Box */}
      <div className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-6">
        {/* Method Toggle Buttons */}
        <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
          <button
            type="button"
            onClick={() => {
              playHaptic('light');
              setMethod('atm');
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              method === 'atm'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone size={16} />
            <span>Cardless ATM Cash Out</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playHaptic('light');
              setMethod('bank');
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              method === 'bank'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 size={16} />
            <span>External Bank Cash Out</span>
          </button>
        </div>

        {/* Withdrawal Form */}
        <form onSubmit={handleStartWithdrawal} className="space-y-6">
          {/* Amount input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Withdrawal Amount (NGN)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ₦
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="1000"
                step="500"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-2xl font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['5000', '10000', '20000', '50000', '100000'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    playHaptic('light');
                    setAmount(chip);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    amount === chip
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  ₦{parseInt(chip).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* External Bank Details (when method === 'bank') */}
          {method === 'bank' && (
            <div className="space-y-4 pt-2 border-t border-slate-200/60 dark:border-white/10">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Destination Commercial Bank
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#071d33] border border-slate-200/80 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="GTBank (Guaranty Trust)">GTBank (Guaranty Trust)</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                  <option value="Kuda Microfinance Bank">Kuda Microfinance Bank</option>
                  <option value="Moniepoint MFB">Moniepoint Microfinance Bank</option>
                  <option value="Stanbic IBTC">Stanbic IBTC</option>
                </select>
              </div>

              <div>
                <GlassInput
                  label="10-Digit NUBAN Account Number"
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  maxLength={10}
                  icon={<CreditCard size={16} />}
                />

                {isVerifyingAccount && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <RefreshCw size={12} className="animate-spin text-emerald-500" />
                    <span>Resolving NIBSS account name...</span>
                  </p>
                )}

                {resolvedName && !isVerifyingAccount && (
                  <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span>Beneficiary: {resolvedName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ATM Partner Network Guide (when method === 'atm') */}
          {method === 'atm' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-2 text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Supported ATM Terminals</span>
            <p className="text-slate-500 dark:text-slate-400">
              Valid at all ATMs with the Quickteller, PayAttitude, or Interswitch logo: GTBank, Zenith Bank, Access, First Bank, UBA, Sterling, and Stanbic IBTC.
            </p>
          </div>
        )}

        <GlassButton
          variant="primary"
          size="lg"
          type="submit"
          className="w-full mt-4"
        >
          {method === 'atm' ? 'Generate 8-Digit ATM Cash Code' : 'Authorize Cash Out'}
        </GlassButton>
      </form>
    </div>

    {/* Security PIN Confirmation Modal */}
    <GlassModal
      isOpen={pinModalOpen}
      onClose={() => setPinModalOpen(false)}
      title="Enter Transaction PIN"
      subtitle={`Authorize withdrawal of ₦${numAmount.toLocaleString()}`}
      maxWidth="sm"
    >
      <div className="space-y-4 pt-2">
        <GlassPinKeypad
          pin={pin}
          onChange={handlePinSubmit}
        />
        {isSubmitting && (
          <p className="text-center text-xs text-slate-400 animate-pulse">
            Signing cryptographic withdrawal payload...
          </p>
        )}
      </div>
    </GlassModal>

    {/* Touchless ATM QR Scanner Modal */}
    <GlassModal
      isOpen={qrModalOpen}
      onClose={() => setQrModalOpen(false)}
      title="ATM Touchless Cash Scanner"
      subtitle="Point camera at ATM screen QR code"
      maxWidth="sm"
    >
      <div className="space-y-4 text-center py-4">
        <div className="relative w-48 h-48 mx-auto rounded-3xl border-2 border-dashed border-emerald-400 flex items-center justify-center bg-black/40">
          <QrCode size={64} className="text-emerald-400 opacity-60 animate-pulse" />
          <div className="absolute inset-x-4 top-1/2 h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] animate-bounce" />
        </div>
        <p className="text-xs text-slate-400">
          Select &quot;Ruthie Touchless QR Cash&quot; on ATM screen to dispense instantly without touching buttons.
        </p>
        <GlassButton
          variant="glass"
          onClick={() => setQrModalOpen(false)}
          className="w-full"
        >
          Close Scanner
        </GlassButton>
      </div>
    </GlassModal>
  </div>
);
};
