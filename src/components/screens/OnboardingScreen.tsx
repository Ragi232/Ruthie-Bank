"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassButton } from '@/components/glass/GlassButton';
import { Globe2, ShieldCheck, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen, setAuthSubView, playHaptic } = useBank();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to Ruthie Bank',
      subtitle: 'Development Preview',
      description: 'Explore a visual prototype of a banking application. No banking service or customer account is connected.',
      icon: Sparkles,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      tag: 'Sandbox Preview',
    },
    {
      title: 'Your Money Across the World',
      subtitle: 'Illustrative Wallet Screens',
      description: 'Currency balances and exchange figures in this preview are sample data. No wallets, transfers, or live exchange rates are available.',
      icon: Globe2,
      gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      tag: 'No Live Wallets',
    },
    {
      title: 'Save and Grow Your Wealth',
      subtitle: 'Savings and Investment Previews',
      description: 'Savings and investment examples are not current offers. No deposits, investment orders, rates, or returns are available.',
      icon: TrendingUp,
      gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      tag: 'No Live Offers',
    },
    {
      title: 'Your Security Comes First',
      subtitle: 'Security Work in Progress',
      description: 'Server-side passkeys, card controls, account restrictions, and fraud monitoring are not connected in this preview.',
      icon: ShieldCheck,
      gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
      tag: 'Server Security Pending',
    },
  ];

  const handleNext = () => {
    playHaptic('medium');
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      setAuthSubView('signup');
      setCurrentScreen('auth');
    }
  };

  const handleSkip = () => {
    playHaptic('light');
    setAuthSubView('login');
    setCurrentScreen('auth');
  };

  const current = slides[slide];
  const Icon = current.icon;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-br from-[#020b12] via-[#051827] to-[#010911] text-white overflow-hidden select-none">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl" />

      {/* Top Bar: Logo & Skip */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-sm border border-emerald-400/30">
            r.
          </div>
          <span className="font-bold text-sm tracking-tight">ruthiebank</span>
        </div>

        {slide < slides.length - 1 && (
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Slide Illustration Card */}
      <div className="my-auto max-w-md mx-auto w-full space-y-8 z-10 text-center">
        {/* Animated Spatial Icon Sphere */}
        <div className="relative flex justify-center">
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br from-[#064e3b]/40 via-[#0a273e]/60 to-[#020d18]/80 border border-emerald-400/30 shadow-[0_20px_60px_rgba(5,150,105,0.3)] backdrop-blur-2xl">
            <div className="absolute inset-2 rounded-full border border-white/10" />
            <Icon size={56} className="text-emerald-400 drop-shadow-[0_4px_16px_rgba(16,185,129,0.5)]" />
          </div>
        </div>

        {/* Text copy */}
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[11px] font-bold text-emerald-300">
            {current.tag}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {current.title}
          </h2>
          <p className="text-xs uppercase tracking-widest text-emerald-400/90 font-semibold">
            {current.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            {current.description}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                playHaptic('light');
                setSlide(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                slide === i ? 'w-8 bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="max-w-md mx-auto w-full space-y-3 z-10 pt-4">
        <GlassButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="w-full"
          icon={<ChevronRight size={18} />}
          iconPosition="right"
        >
          {slide === slides.length - 1 ? 'Get Started' : 'Continue'}
        </GlassButton>

        <p className="text-center text-[11px] text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => {
              playHaptic('light');
              setAuthSubView('login');
              setCurrentScreen('auth');
            }}
            className="text-emerald-400 font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
