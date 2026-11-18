"use client";

import React from 'react';
import { useBank } from '@/context/BankContext';
import { LayoutDashboard, Wallet, ArrowLeftRight, Sparkles, User } from 'lucide-react';
import { ScreenType } from '@/types';

export const GlassNavigationBar: React.FC = () => {
  const { currentScreen, setCurrentScreen, playHaptic } = useBank();

  // Navigation items per specs:
  // 1. Home
  // 2. Wallet
  // 3. Activity (transfers / history)
  // 4. Ruthie AI
  // 5. Profile
  const navItems: { label: string; screen: ScreenType; icon: React.ElementType; badge?: string }[] = [
    { label: 'Home', screen: 'dashboard', icon: LayoutDashboard },
    { label: 'Wallets', screen: 'wallets', icon: Wallet },
    { label: 'Activity', screen: 'history', icon: ArrowLeftRight },
    { label: 'Ruthie AI', screen: 'ai', icon: Sparkles, badge: '✦' },
    { label: 'Profile', screen: 'profile', icon: User },
  ];

  const handleSelect = (screen: ScreenType) => {
    playHaptic('light');
    setCurrentScreen(screen);
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 md:hidden pointer-events-none"
    >
      <div className="liquid-glass pointer-events-auto flex items-center justify-around w-full max-w-md px-3 py-2 rounded-full bg-slate-900/80 dark:bg-[#071726]/85 text-white backdrop-blur-3xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.screen ||
            (item.screen === 'dashboard' &&
              (currentScreen === 'transfers' ||
                currentScreen === 'withdrawals' ||
                currentScreen === 'savings' ||
                currentScreen === 'investments' ||
                currentScreen === 'loans' ||
                currentScreen === 'bills' ||
                currentScreen === 'bookings' ||
                currentScreen === 'support' ||
                currentScreen === 'admin')) ||
            (item.screen === 'profile' && currentScreen === 'notifications');

          return (
            <button
              key={item.label}
              onClick={() => handleSelect(item.screen)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 ease-out ${
                isActive
                  ? 'text-emerald-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-5 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              )}
              <div className="relative">
                <Icon size={20} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] font-bold text-emerald-300">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
