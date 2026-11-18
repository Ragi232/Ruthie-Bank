"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassAvatar } from '@/components/glass/GlassAvatar';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassInput } from '@/components/glass/GlassInput';
import {
  User,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Lock,
  Moon,
  Sun,
  Globe,
  Bell,
  HelpCircle,
  LogOut,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const ProfileSettingsScreen: React.FC = () => {
  const {
    user,
    updateUser,
    theme,
    toggleTheme,
    devices,
    setCurrentScreen,
    setIsAuthenticated,
    showDynamicIsland,
    playHaptic,
  } = useBank();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogout = () => {
    playHaptic('medium');
    setIsAuthenticated(false);
    setCurrentScreen('auth');
    showDynamicIsland('Logged Out', 'Your session has been securely ended', 'security');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    playHaptic('success');
    setPasswordModalOpen(false);
    showDynamicIsland('Password Updated', 'Your security password was changed successfully', 'success');
  };

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    playHaptic('success');
    setPinModalOpen(false);
    showDynamicIsland('PIN Updated', 'New 6-digit transaction PIN set', 'success');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <User size={16} />
          <span>Account & Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Profile & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your identity verification, biometric credentials, hardware enclave, and theme preferences
        </p>
      </div>

      {/* User Hero Banner */}
      <div className="rounded-[32px] p-6 sm:p-8 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <GlassAvatar name={`${user.firstName} ${user.lastName}`} size="xl" tier={user.tier} />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Tier {user.tier} Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.email} · {user.phone}
          </p>
          <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Account: {user.accountNumber} · Tag: {user.tag}
          </p>
        </div>

        <GlassButton variant="danger" size="sm" onClick={handleLogout} icon={<LogOut size={15} />}>
          Sign Out
        </GlassButton>
      </div>

      {/* KYC Tier Status Grid */}
      <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              KYC & Regulatory Compliance
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            MAX LIMITS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Bank Verification Number (BVN)', status: 'Verified', date: 'Linked' },
            { label: 'National Identity Number (NIN)', status: 'Verified', date: 'Linked' },
            { label: 'Proof of Address / Utility Bill', status: 'Approved', date: 'Tier 3 Active' },
          ].map((k) => (
            <div
              key={k.label}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {k.label}
                </span>
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {k.status} ({k.date})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Services & Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => {
            playHaptic('light');
            setCurrentScreen('notifications');
          }}
          className="p-4 rounded-2xl bg-white/70 dark:bg-[#071726]/80 hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <Bell size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">View All →</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Notifications Center</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage transaction alerts & security notices</p>
        </button>

        <button
          onClick={() => {
            playHaptic('light');
            setCurrentScreen('support');
          }}
          className="p-4 rounded-2xl bg-white/70 dark:bg-[#071726]/80 hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <HelpCircle size={18} className="text-sky-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-sky-500">24/7 Care →</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Concierge & Support</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Open dispute tickets or live chat with wealth advisor</p>
        </button>

        <button
          onClick={() => {
            playHaptic('light');
            setCurrentScreen('admin');
          }}
          className="p-4 rounded-2xl bg-white/70 dark:bg-[#071726]/80 hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-purple-500">Console →</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Admin Management</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Staff audit ledger, KYC queue & FX spreads</p>
        </button>
      </div>

      {/* Security & Biometrics Section */}
      <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Security & Authentication Enclave
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
          {/* Biometrics Toggle */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Biometric Sign-In (Face ID / Fingerprint)</p>
              <p className="text-slate-400 text-[11px]">Authorize app unlock and transfers using hardware biometrics</p>
            </div>
            <button
              onClick={() => {
                playHaptic('light');
                updateUser({ biometricsEnabled: !user.biometricsEnabled });
                showDynamicIsland(
                  user.biometricsEnabled ? 'Biometrics Disabled' : 'Biometrics Activated',
                  'Security preference updated',
                  'security'
                );
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                user.biometricsEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/20'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  user.biometricsEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* 2FA Toggle */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Two-Step Verification (2FA)</p>
              <p className="text-slate-400 text-[11px]">Require OTP challenge for high-volume transactions above ₦500k</p>
            </div>
            <button
              onClick={() => {
                playHaptic('light');
                updateUser({ twoFactorEnabled: !user.twoFactorEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                user.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/20'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  user.twoFactorEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Change PIN button */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Transaction PIN</p>
              <p className="text-slate-400 text-[11px]">6-digit PIN used to authorize all transfers and payments</p>
            </div>
            <GlassButton
              variant="glass"
              size="sm"
              onClick={() => {
                playHaptic('light');
                setPinModalOpen(true);
              }}
              icon={<KeyRound size={14} />}
            >
              Change PIN
            </GlassButton>
          </div>

          {/* Change Password button */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Account Password</p>
              <p className="text-slate-400 text-[11px]">Last changed 30 days ago</p>
            </div>
            <GlassButton
              variant="glass"
              size="sm"
              onClick={() => {
                playHaptic('light');
                setPasswordModalOpen(true);
              }}
              icon={<Lock size={14} />}
            >
              Change Password
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Authorized Devices */}
      <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Authorized Devices ({devices.length})
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
          {devices.map((dev) => (
            <div key={dev.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-slate-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 dark:text-white">{dev.deviceName}</p>
                    {dev.current && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                        This Device
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {dev.os} · {dev.location}
                  </p>
                </div>
              </div>

              {!dev.current && (
                <button
                  onClick={() => {
                    playHaptic('warning');
                    showDynamicIsland('Device Revoked', `${dev.deviceName} disconnected`, 'security');
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Services & Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => {
            playHaptic('light');
            setCurrentScreen('notifications');
          }}
          className="p-4 rounded-2xl bg-white/70 dark:bg-[#071726]/80 hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <Bell size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">View All →</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Notifications Center</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage transaction alerts & security notices</p>
        </button>

        <button
          onClick={() => {
            playHaptic('light');
            setCurrentScreen('support');
          }}
          className="p-4 rounded-2xl bg-white/70 dark:bg-[#071726]/80 hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <HelpCircle size={18} className="text-sky-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-sky-500">24/7 Care →</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Concierge & Support</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Open dispute tickets or live chat with wealth advisor</p>
        </button>

        <button
          onClick={() => {
            playHaptic('light');
            setCurrentScreen('admin');
          }}
          className="p-4 rounded-2xl bg-white/70 dark:bg-[#071726]/80 hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-purple-500">Console →</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Admin Management</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Staff audit ledger, KYC queue & FX spreads</p>
        </button>
      </div>

      {/* Appearance & Preferences */}
      <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Appearance & App Language
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-400" />}
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Visual Theme</p>
                <p className="text-slate-400 text-[11px]">{theme === 'dark' ? 'Midnight Navy' : 'Frosted Light'}</p>
              </div>
            </div>
            <GlassButton variant="glass" size="sm" onClick={toggleTheme}>
              Switch Theme
            </GlassButton>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe size={18} className="text-emerald-500" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">App Language</p>
                <p className="text-slate-400 text-[11px]">English (Nigeria & Global)</p>
              </div>
            </div>
            <select
              aria-label="Language selection"
              className="bg-transparent text-xs font-bold text-emerald-600 dark:text-emerald-400 outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="yo">Yorùbá</option>
              <option value="ha">Hausa</option>
              <option value="ig">Igbo</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <GlassModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Change Security Password"
        subtitle="Password must be at least 12 characters"
        maxWidth="sm"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4 pt-1">
          <GlassInput
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <GlassInput
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <GlassButton variant="primary" size="lg" type="submit" className="w-full">
            Update Password
          </GlassButton>
        </form>
      </GlassModal>

      {/* Change PIN Modal */}
      <GlassModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Set 6-Digit PIN"
        subtitle="Enter new numeric transaction PIN"
        maxWidth="sm"
      >
        <form onSubmit={handlePinChange} className="space-y-4 pt-1">
          <GlassInput
            label="New 6-Digit PIN"
            type="password"
            maxLength={6}
            placeholder="••••••"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
          />
          <GlassButton variant="primary" size="lg" type="submit" className="w-full">
            Save PIN
          </GlassButton>
        </form>
      </GlassModal>
    </div>
  );
};
