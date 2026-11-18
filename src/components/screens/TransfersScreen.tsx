"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassTabBar } from '@/components/glass/GlassTabBar';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassPinKeypad } from '@/components/glass/GlassPinKeypad';
import { CurrencyCode } from '@/types';
import {
  ArrowUpRight,
  Building2,
  AtSign,
  Globe2,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Clock,
  Plus,
} from 'lucide-react';

export const TransfersScreen: React.FC = () => {
  const {
    wallets,
    beneficiaries,
    transferMoney,
    playHaptic,
    showDynamicIsland,
  } = useBank();

  const [transferType, setTransferType] = useState<'bank' | 'ruthie' | 'international'>('bank');
  const [bankName, setBankName] = useState('GTBank (Guaranty Trust)');
  const [accountNumber, setAccountNumber] = useState('');
  const [ruthieTag, setRuthieTag] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('NGN');

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  // Flow modals
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nigerianBanks = [
    'GTBank (Guaranty Trust)',
    'Zenith Bank',
    'Access Bank',
    'First Bank of Nigeria',
    'United Bank for Africa (UBA)',
    'Kuda Microfinance Bank',
    'Moniepoint Microfinance Bank',
    'Stanbic IBTC',
    'Fidelity Bank',
    'Sterling Bank',
  ];

  const activeWallet = wallets.find((w) => w.currency === selectedCurrency) || wallets[0];
  const numAmount = parseFloat(amount) || 0;
  const fee = transferType === 'ruthie' ? 0 : transferType === 'international' ? 25.0 : 0.0;

  // Auto-resolve account number simulation
  const handleAccountChange = (val: string) => {
    setAccountNumber(val);
    if (val.length === 10) {
      setIsVerifying(true);
      playHaptic('light');
      setTimeout(() => {
        setIsVerifying(false);
        const resolved = 'Olumide Fashola';
        setVerifiedName(resolved);
        setRecipientName(resolved);
      }, 700);
    } else {
      setVerifiedName(null);
    }
  };

  // Auto-resolve tag simulation
  const handleTagChange = (val: string) => {
    const formatted = val.startsWith('@') ? val : `@${val}`;
    setRuthieTag(formatted);
    if (formatted.length >= 4) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        const resolved = formatted === '@amina_y' ? 'Amina Yusuf' : 'Chukwuma Eze';
        setVerifiedName(resolved);
        setRecipientName(resolved);
      }, 500);
    } else {
      setVerifiedName(null);
    }
  };

  // Pick Beneficiary
  const handleSelectBeneficiary = (b: typeof beneficiaries[0]) => {
    playHaptic('light');
    setRecipientName(b.name);
    setVerifiedName(b.name);
    if (b.isRuthieTag && b.tag) {
      setTransferType('ruthie');
      setRuthieTag(b.tag);
    } else {
      setTransferType('bank');
      setBankName(b.bankName);
      setAccountNumber(b.accountNumber);
    }
  };

  const handleStartReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || numAmount <= 0) {
      showDynamicIsland('Check Details', 'Please enter a valid amount and recipient', 'security');
      return;
    }
    if (numAmount > activeWallet.availableBalance) {
      showDynamicIsland('Insufficient Funds', `You only have ${activeWallet.symbol}${activeWallet.availableBalance.toLocaleString()}`, 'security');
      return;
    }
    playHaptic('medium');
    setReviewModalOpen(true);
  };

  const handleConfirmReview = () => {
    setReviewModalOpen(false);
    setPin('');
    setPinModalOpen(true);
  };

  const handlePinSubmit = async (enteredPin: string) => {
    setPin(enteredPin);
    if (enteredPin.length === 6) {
      setIsSubmitting(true);
      playHaptic('medium');

      const res = await transferMoney({
        recipientName: verifiedName || recipientName,
        accountOrTag: transferType === 'ruthie' ? ruthieTag : accountNumber,
        bankName: transferType === 'ruthie' ? 'Ruthie Bank' : bankName,
        amount: numAmount,
        currency: selectedCurrency,
        description,
        fee,
      });

      setIsSubmitting(false);
      setPinModalOpen(false);

      if (res.success) {
        setAmount('');
        setDescription('');
        setAccountNumber('');
        setRuthieTag('');
        setVerifiedName(null);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <ArrowUpRight size={16} />
          <span>Money Movement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Transfer & Send Money
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Instant zero-fee Ruthie transfers, NIP local interbank, and SWIFT international rails
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <GlassTabBar
        tabs={[
          { id: 'bank', label: 'Other Banks', icon: <Building2 size={16} /> },
          { id: 'ruthie', label: 'Ruthie to Ruthie', icon: <AtSign size={16} /> },
          { id: 'international', label: 'International Wire', icon: <Globe2 size={16} /> },
        ]}
        activeTab={transferType}
        onChange={(t) => {
          setTransferType(t);
          setVerifiedName(null);
        }}
      />

      {/* Recent Beneficiary Quick Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Recent Beneficiaries
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer">
            Manage List
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 select-none">
          {beneficiaries.map((b) => (
            <button
              key={b.id}
              onClick={() => handleSelectBeneficiary(b)}
              className="flex items-center gap-3 p-2.5 pr-4 rounded-2xl bg-white/70 dark:bg-white/[0.04] hover:bg-white/95 dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shrink-0 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {b.avatarInitials}
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {b.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {b.isRuthieTag ? b.tag : b.bankName}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Transfer Form Box */}
      <form
        onSubmit={handleStartReview}
        className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Destination Bank / Rail */}
          {transferType === 'bank' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">
                Select Destination Bank
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-slate-200/90 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
              >
                {nigerianBanks.map((b) => (
                  <option key={b} value={b} className="bg-slate-900 text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Account Number or Ruthie Tag */}
          {transferType === 'bank' && (
            <div className="space-y-1.5">
              <GlassInput
                label="Account Number (10 digits)"
                placeholder="0123456789"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => handleAccountChange(e.target.value)}
              />
            </div>
          )}

          {transferType === 'ruthie' && (
            <div className="md:col-span-2 space-y-1.5">
              <GlassInput
                label="Ruthie Tag or Username"
                placeholder="@amina_y or @ruthie"
                value={ruthieTag}
                onChange={(e) => handleTagChange(e.target.value)}
                icon={<AtSign size={16} />}
              />
            </div>
          )}

          {transferType === 'international' && (
            <>
              <GlassInput
                label="Beneficiary IBAN or Account Number"
                placeholder="GB29 XAAA 2004 1574 8291 03"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <GlassInput
                label="SWIFT / BIC Code"
                placeholder="BARCGB22"
                onChange={() => {}}
              />
            </>
          )}
        </div>

        {/* Resolved Account Name Banner */}
        {isVerifying ? (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500">
            <span className="w-3 h-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <span>Verifying beneficiary details with Nigerian Inter-Bank Settlement System...</span>
          </div>
        ) : verifiedName ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <UserCheck size={16} />
              <span>Verified Account Name: {verifiedName}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/20">
              Validated
            </span>
          </div>
        ) : null}

        {/* Amount Entry & Currency Selection */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Enter Amount</span>
            <span>
              Available: {activeWallet.symbol}
              {activeWallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {activeWallet.symbol}
            </span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white outline-none"
            />
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
              aria-label="Currency for Transfer"
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#0c243b] text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-white/15 outline-none cursor-pointer"
            >
              {wallets.map((w) => (
                <option key={w.currency} value={w.currency}>
                  {w.flag} {w.currency}
                </option>
              ))}
            </select>
          </div>

          {/* Quick amount chips */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto">
            {['10000', '25000', '50000', '100000', '250000'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  playHaptic('light');
                  setAmount(chip);
                }}
                className="px-3 py-1 rounded-xl bg-white dark:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-emerald-500 transition-colors"
              >
                +₦{parseInt(chip).toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Narrative / Description */}
        <GlassInput
          label="Payment Note / Description (Optional)"
          placeholder="e.g. Office Equipment / Invoice #402"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <GlassButton variant="primary" size="lg" type="submit" className="w-full">
          Review Transfer Details
        </GlassButton>
      </form>

      {/* Modal 1: Review Transfer Details */}
      <GlassModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review Transfer"
        subtitle="Confirm all details before authorizing transaction"
        maxWidth="md"
      >
        <div className="space-y-4 pt-1 text-xs">
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Total Transfer Amount
            </span>
            <p className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {activeWallet.symbol}
              {numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Recipient</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {verifiedName || recipientName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Destination</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {transferType === 'ruthie' ? 'Ruthie Bank Direct' : bankName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Account / Tag</span>
              <span className="font-mono text-slate-900 dark:text-white">
                {transferType === 'ruthie' ? ruthieTag : accountNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Transfer Fee</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {fee === 0 ? '₦0.00 (Free)' : `₦${fee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Estimated Delivery</span>
              <span className="font-semibold text-slate-900 dark:text-white">Instant (0s)</span>
            </div>
          </div>

          <GlassButton
            variant="primary"
            size="lg"
            onClick={handleConfirmReview}
            className="w-full"
          >
            Authorize with PIN
          </GlassButton>
        </div>
      </GlassModal>

      {/* Modal 2: 6-Digit PIN Security Step */}
      <GlassModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Authorize Transaction"
        subtitle="Enter your 6-digit transaction PIN to post entry"
        maxWidth="sm"
      >
        <div className="py-2">
          <GlassPinKeypad
            pin={pin}
            onChange={handlePinSubmit}
            showBiometric={true}
            onBiometric={() => handlePinSubmit('123456')}
          />
        </div>
      </GlassModal>
    </div>
  );
};
