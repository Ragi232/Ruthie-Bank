"use client";

import React, { useEffect, useState } from 'react';
import { useBank } from '@/context/BankContext';
import { Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, isAuthenticated } = useBank();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentScreen(isAuthenticated ? 'dashboard' : 'onboarding');
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [setCurrentScreen, isAuthenticated]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#020b12] via-[#041524] to-[#01080e] text-white overflow-hidden select-none">
      {/* Liquid glass background ambient orbs */}
      <div className="pointer-events-none absolute w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl -top-20 -left-20 animate-pulse-glow" />
      <div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-3xl -bottom-32 -right-20" />
      <div className="pointer-events-none absolute w-72 h-72 rounded-full bg-amber-500/10 blur-2xl top-1/3 right-1/4" />

      {/* Main Glass Orb & Logo Reveal */}
      <div className="relative flex flex-col items-center text-center space-y-6 max-w-sm z-10">
        <div className="relative group">
          {/* Glowing refractive halo */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-700" />

          {/* Liquid Glass Icon */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#065f46] via-[#09352c] to-[#031520] border border-emerald-400/50 backdrop-blur-3xl shadow-[0_20px_50px_rgba(5,150,105,0.4)] flex items-center justify-center">
            <span className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              r.
            </span>
            <div className="absolute top-2 right-2">
              <Sparkles size={14} className="text-emerald-300 animate-spin" />
            </div>
          </div>
        </div>

        {/* Brand Typography */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span>ruthie</span>
            <span className="text-emerald-400">bank</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold">
            Your Money. Your World. Your Future.
          </p>
        </div>

        {/* Liquid Glass Loading Bar */}
        <div className="w-56 space-y-2 pt-6">
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden backdrop-blur-md p-0.5 border border-white/10">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_#34d399] transition-all duration-300 ease-out"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider">
            Initializing Secure Enclave {progress}%
          </p>
        </div>
      </div>

      {/* Footer Credentials */}
      <div className="absolute bottom-6 text-center text-[10px] text-slate-400 tracking-wider">
        <span>Development Preview</span>
        <span className="mx-2">·</span>
        <span>No live banking services</span>
      </div>
    </div>
  );
};
