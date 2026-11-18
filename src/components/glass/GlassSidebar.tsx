"use client";

import React from 'react';
import { useBank } from '@/context/BankContext';
import { GlassAvatar } from './GlassAvatar';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Zap,
  Compass,
  Sparkles,
  History,
  Settings,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { ScreenType } from '@/types';

export const GlassSidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, user, theme, toggleTheme, playHaptic, setIsAuthenticated } = useBank();

  const navGroups: {
    title: string;
    items: { label: string; screen: ScreenType; icon: React.ElementType; badge?: string }[];
  }[] = [
    {
      title: 'CORE BANKING',
      items: [
        { label: 'Overview', screen: 'dashboard', icon: LayoutDashboard },
        { label: 'Wallets & FX', screen: 'wallets', icon: Wallet },
        { label: 'Transfers', screen: 'transfers', icon: ArrowLeftRight },
        { label: 'Transaction History', screen: 'history', icon: History },
      ],
    },
    {
      title: 'GROWTH & CREDIT',
      items: [
        { label: 'Ruthie Vault & Savings', screen: 'savings', icon: PiggyBank, badge: '18.5%' },
        { label: 'Investments', screen: 'investments', icon: TrendingUp },
        { label: 'Digital Loans', screen: 'loans', icon: CreditCard },
      ],
    },
    {
      title: 'LIFESTYLE & INTELLIGENCE',
      items: [
        { label: 'Airtime & Utilities', screen: 'bills', icon: Zap },
        { label: 'Bookings & Lifestyle', screen: 'bookings', icon: Compass },
        { label: 'Ruthie AI Assistant', screen: 'ai', icon: Sparkles, badge: '✦ AI' },
      ],
    },
  ];

  const handleNavClick = (screen: ScreenType) => {
    playHaptic('light');
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    playHaptic('medium');
    setIsAuthenticated(false);
    setCurrentScreen('auth');
  };

  return (
    <aside
      aria-label="Desktop Sidebar"
      className="hidden md:flex flex-col w-72 shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#061423]/80 backdrop-blur-3xl px-5 py-6 select-none transition-colors duration-300"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 mb-7 px-1">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 shadow-[0_8px_20px_rgba(5,150,105,0.35)] border border-emerald-300/40 text-white font-black text-xl tracking-tighter">
          r.
          <div className="absolute -inset-0.5 rounded-2xl bg-emerald-400 opacity-20 blur-sm pointer-events-none" />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-bold tracking-tight text-lg text-slate-900 dark:text-white">
              ruthie
            </span>
            <span className="font-bold tracking-tight text-lg text-emerald-600 dark:text-emerald-400">
              bank
            </span>
          </div>
          <p className="text-[10px] font-medium tracking-wider uppercase text-slate-600 dark:text-slate-300">
            Your Money. Your Future.
          </p>
        </div>
      </div>

      {/* User profile miniature */}
      <button
        onClick={() => handleNavClick('profile')}
        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 text-left mb-6 ${
          currentScreen === 'profile'
            ? 'bg-emerald-500/10 border-emerald-500/40 dark:bg-emerald-500/15'
            : 'bg-slate-100/70 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
        }`}
      >
        <GlassAvatar name={`${user.firstName} ${user.lastName}`} size="md" tier={user.tier} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
            {user.tag} · Tier {user.tier}
          </p>
        </div>
        <Settings size={16} className="text-slate-400 hover:text-slate-600 dark:hover:text-white shrink-0" />
      </button>

      {/* Navigation Sections */}
      <div className="space-y-6 flex-1">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 px-3 mb-2">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.screen;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.screen)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-[0_8px_20px_rgba(5,150,105,0.3)] font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer controls & security */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-3">
        {/* Security badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/60 dark:bg-white/[0.03] text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
          <span className="truncate">Hardware Enclave Encrypted</span>
        </div>

        {/* Theme and Logout Buttons */}
        <div className="flex items-center justify-between gap-2 px-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log out of Ruthie Bank"
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
