"use client";

import React from 'react';
import { BankProvider, useBank } from '@/context/BankContext';
import { DynamicIsland } from '@/components/glass/DynamicIsland';
import { GlassSidebar } from '@/components/glass/GlassSidebar';
import { GlassNavigationBar } from '@/components/glass/GlassNavigationBar';
import { TransactionReceiptModal } from '@/components/receipts/TransactionReceiptModal';

// Screens
import { SplashScreen } from '@/components/screens/SplashScreen';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { DashboardScreen } from '@/components/screens/DashboardScreen';
import { WalletsScreen } from '@/components/screens/WalletsScreen';
import { TransfersScreen } from '@/components/screens/TransfersScreen';
import { SavingsScreen } from '@/components/screens/SavingsScreen';
import { InvestmentsScreen } from '@/components/screens/InvestmentsScreen';
import { LoansScreen } from '@/components/screens/LoansScreen';
import { BillsScreen } from '@/components/screens/BillsScreen';
import { BookingsScreen } from '@/components/screens/BookingsScreen';
import { RuthieAIScreen } from '@/components/screens/RuthieAIScreen';
import { TransactionHistoryScreen } from '@/components/screens/TransactionHistoryScreen';
import { ProfileSettingsScreen } from '@/components/screens/ProfileSettingsScreen';

function BankAppContent() {
  const { currentScreen, isAuthenticated } = useBank();

  // Full-screen flows
  if (currentScreen === 'splash') {
    return <SplashScreen />;
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen />;
  }

  if (currentScreen === 'auth' || !isAuthenticated) {
    return <AuthScreen />;
  }

  // Active Screen Selector inside Main Banking Layout
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'wallets':
        return <WalletsScreen />;
      case 'transfers':
        return <TransfersScreen />;
      case 'savings':
        return <SavingsScreen />;
      case 'investments':
        return <InvestmentsScreen />;
      case 'loans':
        return <LoansScreen />;
      case 'bills':
        return <BillsScreen />;
      case 'bookings':
        return <BookingsScreen />;
      case 'ai':
        return <RuthieAIScreen />;
      case 'history':
        return <TransactionHistoryScreen />;
      case 'profile':
        return <ProfileSettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex bg-slate-50 dark:bg-[#030a12] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Ambient background light gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-ambient-glow opacity-80" />

      {/* Dynamic Island Contextual Status */}
      <DynamicIsland />

      {/* Desktop Executive Sidebar */}
      <GlassSidebar />

      {/* Main Responsive Viewport */}
      <main className="relative z-10 flex-1 min-w-0 px-4 sm:px-8 py-5 md:py-7 overflow-y-auto min-h-screen">
        {renderScreen()}
      </main>

      {/* Mobile Floating Liquid Glass Navigation Bar */}
      <GlassNavigationBar />

      {/* Global Electronic Receipt Modal */}
      <TransactionReceiptModal />
    </div>
  );
}

export default function Home() {
  return (
    <BankProvider>
      <BankAppContent />
    </BankProvider>
  );
}
