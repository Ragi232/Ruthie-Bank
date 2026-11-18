"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassTabBar } from '@/components/glass/GlassTabBar';
import { GlassModal } from '@/components/glass/GlassModal';
import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  GraduationCap,
  Globe,
  Droplets,
  CheckCircle2,
  Copy,
} from 'lucide-react';

export const BillsScreen: React.FC = () => {
  const { payBillOrAirtime, playHaptic, showDynamicIsland } = useBank();

  const [activeTab, setActiveTab] = useState<'airtime' | 'data' | 'electricity' | 'cable' | 'internet'>('airtime');

  // Telco state
  const [selectedTelco, setSelectedTelco] = useState('MTN Nigeria');
  const [phone, setPhone] = useState('08123456789');
  const [airtimeAmount, setAirtimeAmount] = useState('1000');
  const [dataPlan, setDataPlan] = useState('10GB Monthly (₦3,500)');

  // Utility state
  const [disco, setDisco] = useState('Ikeja Electric (IKEDC)');
  const [meterNo, setMeterNo] = useState('45109284719');
  const [electricityAmount, setElectricityAmount] = useState('15000');

  // Cable state
  const [cableProvider, setCableProvider] = useState('DStv Premium & Compact');
  const [smartcardNo, setSmartcardNo] = useState('1092847192');
  const [cablePlan, setCablePlan] = useState('DStv Compact Plus (₦19,800)');

  // Loading & token states
  const [isPaying, setIsPaying] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const telcoProviders = [
    { name: 'MTN Nigeria', code: 'MTN', color: 'bg-yellow-400 text-slate-950' },
    { name: 'Airtel Nigeria', code: 'AIR', color: 'bg-red-500 text-white' },
    { name: 'Glo (Globacom)', code: 'GLO', color: 'bg-emerald-600 text-white' },
    { name: '9mobile Nigeria', code: '9MB', color: 'bg-emerald-800 text-white' },
  ];

  const handleAirtimePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(airtimeAmount);
    if (amt <= 0 || !phone) return;

    setIsPaying(true);
    playHaptic('medium');

    const res = await payBillOrAirtime({
      providerId: selectedTelco.toLowerCase().replace(/\s+/g, '-'),
      providerName: selectedTelco,
      category: 'telco',
      beneficiaryNumber: phone,
      amount: amt,
      planName: 'Airtime Recharge',
    });

    setIsPaying(false);
    if (res.success) {
      setAirtimeAmount('');
    }
  };

  const handleDataPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsPaying(true);
    playHaptic('medium');

    const res = await payBillOrAirtime({
      providerId: selectedTelco.toLowerCase().replace(/\s+/g, '-'),
      providerName: selectedTelco,
      category: 'telco',
      beneficiaryNumber: phone,
      amount: 3500,
      planName: dataPlan,
    });

    setIsPaying(false);
  };

  const handleElectricityPay = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(electricityAmount);
    if (amt <= 0 || !meterNo) return;

    setIsPaying(true);
    playHaptic('medium');

    const res = await payBillOrAirtime({
      providerId: disco.toLowerCase().replace(/\s+/g, '-'),
      providerName: disco,
      category: 'electricity',
      beneficiaryNumber: meterNo,
      amount: amt,
      planName: 'Prepaid Token',
    });

    setIsPaying(false);
    if (res.token) {
      setGeneratedToken(res.token);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">
          <Zap size={16} />
          <span>Utilities & Telecommunications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Airtime, Data & Utility Bills
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Instant recharge across all Nigerian networks, prepaid meter token generation, and cable renewals
        </p>
      </div>

      {/* Category Tabs */}
      <GlassTabBar
        tabs={[
          { id: 'airtime', label: 'Airtime', icon: <Smartphone size={16} /> },
          { id: 'data', label: 'Data Bundles', icon: <Wifi size={16} /> },
          { id: 'electricity', label: 'Electricity', icon: <Zap size={16} /> },
          { id: 'cable', label: 'Cable TV', icon: <Tv size={16} /> },
          { id: 'internet', label: 'Starlink / ISP', icon: <Globe size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setGeneratedToken(null);
        }}
      />

      {/* TAB 1: AIRTIME */}
      {activeTab === 'airtime' && (
        <form
          onSubmit={handleAirtimePay}
          className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-6"
        >
          {/* Telco Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Select Network Operator
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {telcoProviders.map((telco) => (
                <button
                  key={telco.name}
                  type="button"
                  onClick={() => {
                    playHaptic('light');
                    setSelectedTelco(telco.name);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    selectedTelco === telco.name
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-emerald-500 shadow-md font-bold'
                      : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${telco.color}`}>
                    {telco.code}
                  </span>
                  <span className="text-xs truncate">{telco.name}</span>
                </button>
              ))}
            </div>
          </div>

          <GlassInput
            label="Mobile Number"
            placeholder="08012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Quick Amount Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">
              Recharge Amount (₦)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['500', '1000', '2000', '5000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    playHaptic('light');
                    setAirtimeAmount(amt);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    airtimeAmount === amt
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ₦{parseInt(amt).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <GlassInput
            label="Custom Amount (₦ NGN)"
            type="number"
            value={airtimeAmount}
            onChange={(e) => setAirtimeAmount(e.target.value)}
            currencyPrefix="₦"
          />

          <GlassButton variant="primary" size="lg" type="submit" loading={isPaying} className="w-full">
            Recharge ₦{parseFloat(airtimeAmount || '0').toLocaleString()} Airtime
          </GlassButton>
        </form>
      )}

      {/* TAB 2: DATA BUNDLES */}
      {activeTab === 'data' && (
        <form
          onSubmit={handleDataPay}
          className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-6"
        >
          {/* Telco Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Select Network Operator
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {telcoProviders.map((telco) => (
                <button
                  key={telco.name}
                  type="button"
                  onClick={() => {
                    playHaptic('light');
                    setSelectedTelco(telco.name);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    selectedTelco === telco.name
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-emerald-500 shadow-md font-bold'
                      : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${telco.color}`}>
                    {telco.code}
                  </span>
                  <span className="text-xs truncate">{telco.name}</span>
                </button>
              ))}
            </div>
          </div>

          <GlassInput
            label="Recipient Mobile Number"
            placeholder="08012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Data Plans */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">
              Select Data Plan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: '2.5GB 2-Day (₦600)', price: '₦600' },
                { name: '10GB Monthly (₦3,500)', price: '₦3,500' },
                { name: '25GB Monthly (₦8,000)', price: '₦8,000' },
                { name: '50GB Monthly (₦15,000)', price: '₦15,000' },
                { name: '100GB Ultra (₦25,000)', price: '₦25,000' },
                { name: 'Unlimited Broadband (₦35,000)', price: '₦35,000' },
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    playHaptic('light');
                    setDataPlan(p.name);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    dataPlan === p.name
                      ? 'bg-emerald-500/15 border-emerald-500 font-bold text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{p.name}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    Instant Activation
                  </p>
                </button>
              ))}
            </div>
          </div>

          <GlassButton variant="primary" size="lg" type="submit" loading={isPaying} className="w-full">
            Purchase {dataPlan}
          </GlassButton>
        </form>
      )}

      {/* TAB 3: ELECTRICITY */}
      {activeTab === 'electricity' && (
        <form
          onSubmit={handleElectricityPay}
          className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-6"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">
              Select Electricity Distribution Company (DISCO)
            </label>
            <select
              value={disco}
              onChange={(e) => setDisco(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold outline-none"
            >
              <option value="Ikeja Electric (IKEDC)">Ikeja Electric (IKEDC)</option>
              <option value="Eko Electricity (EKEDC)">Eko Electricity (EKEDC)</option>
              <option value="Abuja Electricity (AEDC)">Abuja Electricity (AEDC)</option>
              <option value="Ibadan Electricity (IBEDC)">Ibadan Electricity (IBEDC)</option>
              <option value="Enugu Electricity (EEDC)">Enugu Electricity (EEDC)</option>
            </select>
          </div>

          <GlassInput
            label="Prepaid / Postpaid Meter Number"
            placeholder="e.g. 45109284719"
            value={meterNo}
            onChange={(e) => setMeterNo(e.target.value)}
          />

          <GlassInput
            label="Amount (₦ NGN)"
            type="number"
            value={electricityAmount}
            onChange={(e) => setElectricityAmount(e.target.value)}
            currencyPrefix="₦"
          />

          <GlassButton variant="primary" size="lg" type="submit" loading={isPaying} className="w-full">
            Generate Electricity Token
          </GlassButton>

          {/* Generated Token Result Display */}
          {generatedToken && (
            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
              <span className="text-[11px] uppercase font-bold text-amber-600 dark:text-amber-400">
                Prepaid Meter Token Generated
              </span>
              <p className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-slate-900 dark:text-white">
                {generatedToken}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Units: 68.4 kWh · Meter: {meterNo} · Receipt saved
              </p>
            </div>
          )}
        </form>
      )}

      {/* TAB 4: CABLE TV */}
      {activeTab === 'cable' && (
        <div className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">
              Select Cable TV Provider
            </label>
            <select
              value={cableProvider}
              onChange={(e) => setCableProvider(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold outline-none"
            >
              <option value="DStv Premium & Compact">DStv Premium & Compact</option>
              <option value="GOtv Supa+">GOtv Supa+</option>
              <option value="StarTimes Nigeria">StarTimes Nigeria</option>
            </select>
          </div>

          <GlassInput
            label="Smartcard / IUC Number"
            placeholder="1092847192"
            value={smartcardNo}
            onChange={(e) => setSmartcardNo(e.target.value)}
          />

          <GlassButton
            variant="primary"
            size="lg"
            onClick={() => {
              playHaptic('medium');
              showDynamicIsland('Cable Renewed', `${cableProvider} activated for ${smartcardNo}`, 'success');
            }}
            className="w-full"
          >
            Renew Subscription
          </GlassButton>
        </div>
      )}

      {/* TAB 5: STARLINK / INTERNET */}
      {activeTab === 'internet' && (
        <div className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 text-white border border-white/10">
            <Globe size={24} className="text-emerald-400" />
            <div>
              <p className="text-sm font-bold">Starlink High-Speed Satellite Internet</p>
              <p className="text-xs text-slate-400">Direct integration with Starlink Nigeria accounts</p>
            </div>
          </div>

          <GlassInput
            label="Starlink Account Number or Kit ID"
            placeholder="KIT-NG-0918492"
          />

          <GlassButton
            variant="primary"
            size="lg"
            onClick={() => {
              playHaptic('medium');
              showDynamicIsland('Starlink Recharged', '₦38,000 monthly service renewed', 'success');
            }}
            className="w-full"
          >
            Pay ₦38,000 Monthly Service
          </GlassButton>
        </div>
      )}
    </div>
  );
};
