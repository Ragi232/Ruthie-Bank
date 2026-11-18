"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassPinKeypad } from '@/components/glass/GlassPinKeypad';
import { GlassOTPInput } from '@/components/glass/GlassOTPInput';
import {
  Mail,
  Lock,
  Phone,
  User,
  ScanFace,
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  KeyRound,
} from 'lucide-react';
import { AuthSubView } from '@/types';

export const AuthScreen: React.FC = () => {
  const {
    authSubView,
    setAuthSubView,
    setCurrentScreen,
    setIsAuthenticated,
    showDynamicIsland,
    playHaptic,
    user,
    updateUser,
  } = useBank();

  // Sign up fields
  const [firstName, setFirstName] = useState('Ruthie');
  const [lastName, setLastName] = useState('Adebayo');
  const [email, setEmail] = useState('ruthie.adebayo@ruthiebank.com');
  const [phone, setPhone] = useState('+234 812 345 6789');
  const [password, setPassword] = useState('RuthieBank2026!');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in your credentials');
      return;
    }
    setError('');
    setLoading(true);
    playHaptic('medium');

    setTimeout(() => {
      setLoading(false);
      // Advance to 6-digit PIN screen
      setAuthSubView('pin');
    }, 600);
  };

  // Handle Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required');
      return;
    }
    setError('');
    setLoading(true);
    playHaptic('medium');

    setTimeout(() => {
      setLoading(false);
      updateUser({ firstName, lastName, email, phone });
      setAuthSubView('otp');
    }, 700);
  };

  // Handle PIN completion
  const handlePinChange = (newPin: string) => {
    setPin(newPin);
    if (newPin.length === 6) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');
        showDynamicIsland('Welcome Back, Ruthie', 'Biometrics & Session Confirmed', 'success');
      }, 500);
    }
  };

  // Handle OTP completion
  const handleOtpComplete = (code: string) => {
    setOtp(code);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthSubView('pin');
      showDynamicIsland('Phone Verified', 'Set up your 6-digit transaction PIN', 'success');
    }, 600);
  };

  // Biometric Unlock simulation
  const handleBiometricAuth = () => {
    playHaptic('medium');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAuthenticated(true);
      setCurrentScreen('dashboard');
      showDynamicIsland('Face ID Authenticated', 'Hardware security enclave verified', 'success');
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-br from-[#020b12] via-[#051827] to-[#010911] text-white overflow-hidden select-none">
      {/* Background radial glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-600/15 blur-3xl" />

      {/* Floating Spatial Container */}
      <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-white/[0.06] backdrop-blur-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-10 space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          {authSubView !== 'login' && authSubView !== 'signup' ? (
            <button
              onClick={() => {
                playHaptic('light');
                setAuthSubView('login');
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-sm border border-emerald-400/30">
                r.
              </div>
              <span className="font-bold text-sm tracking-tight">ruthiebank</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20">
            <ShieldCheck size={13} />
            <span>256-bit TLS</span>
          </div>
        </div>

        {/* SUBVIEW: LOGIN */}
        {authSubView === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Sign In</h2>
              <p className="text-xs text-slate-400">Access your Ruthie Bank multi-currency account</p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <GlassInput
                label="Email or Phone Number"
                type="text"
                placeholder="name@ruthiebank.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
              />

              <GlassInput
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setAuthSubView('biometric')}
                  className="text-emerald-400 font-medium hover:underline flex items-center gap-1"
                >
                  <ScanFace size={14} />
                  <span>Use Face ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthSubView('forgot-password')}
                  className="text-slate-400 hover:text-white"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              type="submit"
              loading={loading}
              className="w-full mt-2"
            >
              Continue to PIN
            </GlassButton>

            <div className="pt-2 text-center text-xs text-slate-400">
              New to Ruthie Bank?{' '}
              <button
                type="button"
                onClick={() => {
                  playHaptic('light');
                  setAuthSubView('signup');
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Open an Account
              </button>
            </div>
          </form>
        )}

        {/* SUBVIEW: SIGN UP */}
        {authSubView === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
              <p className="text-xs text-slate-400">Open a high-yield international digital bank account</p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <GlassInput
                  label="First Name"
                  placeholder="Ruthie"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  icon={<User size={15} />}
                />
                <GlassInput
                  label="Last Name"
                  placeholder="Adebayo"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <GlassInput
                label="Email Address"
                type="email"
                placeholder="ruthie@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
              />

              <GlassInput
                label="Mobile Number (Nigeria)"
                placeholder="+234 812 345 6789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone size={16} />}
              />

              <GlassInput
                label="Create Password"
                type="password"
                placeholder="At least 12 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
              />
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              type="submit"
              loading={loading}
              className="w-full mt-2"
            >
              Verify Contact
            </GlassButton>

            <div className="pt-2 text-center text-xs text-slate-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  playHaptic('light');
                  setAuthSubView('login');
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* SUBVIEW: 6-DIGIT PIN */}
        {authSubView === 'pin' && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400 mb-2">
                <KeyRound size={24} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Enter Transaction PIN</h2>
              <p className="text-xs text-slate-400">
                Enter your 6-digit security code to authenticate session
              </p>
            </div>

            <GlassPinKeypad
              pin={pin}
              onChange={handlePinChange}
              onBiometric={handleBiometricAuth}
            />
          </div>
        )}

        {/* SUBVIEW: OTP VERIFICATION */}
        {authSubView === 'otp' && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400 mb-2">
                <Smartphone size={24} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Verify Phone Number</h2>
              <p className="text-xs text-slate-400">
                We sent a 6-digit code to <span className="text-white font-medium">{phone}</span>
              </p>
            </div>

            <GlassOTPInput onComplete={handleOtpComplete} />

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 text-[11px] text-slate-400">
              Development simulation: enter any 6 digits (e.g. <span className="font-mono text-emerald-400">123456</span>) to proceed.
            </div>
          </div>
        )}

        {/* SUBVIEW: BIOMETRIC UNLOCK */}
        {authSubView === 'biometric' && (
          <div className="space-y-6 text-center py-4">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-slate-900/80 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                <ScanFace size={48} className="animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-white">Face ID Authentication</h2>
              <p className="text-xs text-slate-400">
                Scan your face to securely authorize Ruthie Bank session
              </p>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              onClick={handleBiometricAuth}
              loading={loading}
              className="w-full"
            >
              Authenticate with Face ID
            </GlassButton>

            <button
              onClick={() => setAuthSubView('pin')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Use 6-digit PIN instead
            </button>
          </div>
        )}

        {/* SUBVIEW: FORGOT PASSWORD */}
        {authSubView === 'forgot-password' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
              <p className="text-xs text-slate-400">Enter your registered email to receive recovery instructions</p>
            </div>

            <GlassInput
              label="Email Address"
              placeholder="name@ruthiebank.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
            />

            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => {
                playHaptic('success');
                showDynamicIsland('Reset Link Dispatched', `Instructions sent to ${email}`, 'success');
                setAuthSubView('login');
              }}
              className="w-full"
            >
              Send Reset Link
            </GlassButton>
          </div>
        )}
      </div>
    </div>
  );
};
