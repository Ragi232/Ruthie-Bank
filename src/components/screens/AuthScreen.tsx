"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassOTPInput } from '@/components/glass/GlassOTPInput';
import {
  Mail,
  Lock,
  Phone,
  User,
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Fingerprint,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const {
    authSubView,
    setAuthSubView,
    setCurrentScreen,
    setIsAuthenticated,
    showDynamicIsland,
    playHaptic,
    updateUser,
  } = useBank();

  // Sign up & Login fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');

  // Password reset fields
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validation helpers matching backend rules
  const validateNigerianPhone = (val: string) => {
    return /^\+234[0-9]{10}$|^0[0-9]{10}$/.test(val.trim());
  };

  const validatePasswordRules = (val: string) => {
    if (val.length < 12) return 'Password must be at least 12 characters long';
    if (!/[a-z]/.test(val)) return 'Password needs at least one lowercase letter';
    if (!/[A-Z]/.test(val)) return 'Password needs at least one uppercase letter';
    if (!/[0-9]/.test(val)) return 'Password needs at least one number';
    return null;
  };

  // Handle Login with Real Backend API Integration
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }
    setError('');
    setLoading(true);
    playHaptic('medium');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLoading(false);
        setError(data?.error?.message || 'Email or password is incorrect, or the account is not verified.');
        return;
      }

      if (data?.user) {
        updateUser({
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          phone: data.user.phone ?? '',
        });
      }

      setLoading(false);
      setIsAuthenticated(true);
      setCurrentScreen('dashboard');
      showDynamicIsland({ title: `Welcome, ${data?.user?.firstName ?? 'back'}`, subtitle: 'Signed in with your server-verified account.', type: 'success' });
    } catch {
      setLoading(false);
      setError('Unable to reach the sign-in service. No session was created. Please try again.');
    }
  };

  // Handle Sign Up with Real Backend API Integration
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      setError('All registration fields are required');
      return;
    }
    if (!validateNigerianPhone(phone)) {
      setError('Enter a valid Nigerian mobile number (e.g. 08012345678 or +2348012345678)');
      return;
    }
    const passwordErr = validatePasswordRules(password);
    if (passwordErr) {
      setError(passwordErr);
      return;
    }

    setError('');
    setLoading(true);
    playHaptic('medium');

    try {
      const formattedPhone = phone.startsWith('+234') ? phone : `+234${phone.slice(1)}`;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone: formattedPhone, password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLoading(false);
        setError(data?.error?.message || 'Registration failed. Please check details and try again.');
        return;
      }

      if (data?.verification?.code) {
        setDevOtp(data.verification.code);
      }

      setLoading(false);
      updateUser({ firstName, lastName, email, phone: formattedPhone });
      setAuthSubView('otp');
    } catch {
      setLoading(false);
      setError('Unable to reach the registration service. No account was created. Please try again.');
    }
  };

  // Handle OTP completion with Real Backend API Integration
  const handleOtpComplete = async (code: string) => {
    setOtp(code);
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLoading(false);
        setError(data?.error?.message || 'The verification code is invalid or expired.');
        return;
      }

      setLoading(false);
      setIsAuthenticated(true);
      setCurrentScreen('dashboard');
      showDynamicIsland({
        title: 'Email Verified',
        subtitle: 'Your account was verified by the server.',
        type: 'success',
      });
    } catch {
      setLoading(false);
      setError('Unable to reach the verification service. Your account was not activated. Please try again.');
    }
  };

  // Password Reset Request (Stage 1)
  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Enter your registered email address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLoading(false);
        setError(data?.error?.message || 'Could not initiate password reset.');
        return;
      }

      if (data?.developmentCode) {
        setDevOtp(data.developmentCode);
        setResetCode(data.developmentCode);
      }

      setLoading(false);
      setAuthSubView('reset-password');
      showDynamicIsland({
        title: 'Password reset request received',
        subtitle: 'No email delivery provider is connected, so reset instructions are unavailable.',
        type: 'security',
      });
    } catch {
      setLoading(false);
      setError('Unable to reach the password-reset service. No reset request was completed. Please try again.');
    }
  };

  // Password Reset Completion (Stage 2)
  const handlePasswordResetComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode || !newPassword) {
      setError('Please provide the reset code and your new password');
      return;
    }
    const passwordErr = validatePasswordRules(newPassword);
    if (passwordErr) {
      setError(passwordErr);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: resetCode, password: newPassword }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLoading(false);
        setError(data?.error?.message || 'The reset code is invalid or expired.');
        return;
      }

      setLoading(false);
      setResetSuccessMessage('Password updated successfully. Please sign in with your new password.');
      setAuthSubView('login');
      showDynamicIsland('Password Updated', 'Sign in with your new credentials', 'success');
    } catch {
      setLoading(false);
      setError('Unable to reach the password-reset service. Your password was not changed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-br from-[#020b12] via-[#051827] to-[#010911] text-white overflow-hidden select-none">
      {/* Background ambient radial glows */}
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
                setError('');
                setAuthSubView('login');
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Sign In</span>
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
            <span>Server session</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {resetSuccessMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-start gap-2">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-relaxed">{resetSuccessMessage}</span>
          </div>
        )}

        {/* SUBVIEW: LOGIN */}
        {authSubView === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Sign In</h2>
              <p className="text-xs text-slate-400">Access your Ruthie Bank multi-currency account</p>
            </div>

            <div className="space-y-3 pt-2">
              <GlassInput
                label="Email Address"
                type="text"
                placeholder="name@ruthiebank.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                icon={<Mail size={16} />}
                required
              />

              <GlassInput
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                icon={<Lock size={16} />}
                required
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError('Passkey sign-in is not configured on the server. Use your password to sign in.');
                  }}
                  className="text-emerald-400 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Fingerprint size={14} />
                  <span>Passkey / Biometric</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAuthSubView('forgot-password');
                  }}
                  className="text-slate-400 hover:text-white cursor-pointer"
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
              Sign In
            </GlassButton>

            <div className="pt-2 text-center text-xs text-slate-400">
              New to Ruthie Bank?{' '}
              <button
                type="button"
                onClick={() => {
                  playHaptic('light');
                  setError('');
                  setAuthSubView('signup');
                }}
                className="text-emerald-400 font-bold hover:underline cursor-pointer"
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

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <GlassInput
                  label="First Name"
                  placeholder="Ruthie"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  icon={<User size={15} />}
                  required
                />
                <GlassInput
                  label="Last Name"
                  placeholder="Adebayo"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <GlassInput
                label="Email Address"
                type="email"
                placeholder="ruthie@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                required
              />

              <GlassInput
                label="Mobile Number (Nigeria)"
                placeholder="+234 812 345 6789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone size={16} />}
                required
              />

              <div>
                <GlassInput
                  label="Create Password"
                  type="password"
                  placeholder="At least 12 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={16} />}
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Must include 12+ characters, lowercase, uppercase, and a number.
                </p>
              </div>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              type="submit"
              loading={loading}
              className="w-full mt-2"
            >
              Create Account
            </GlassButton>

            <div className="pt-2 text-center text-xs text-slate-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  playHaptic('light');
                  setError('');
                  setAuthSubView('login');
                }}
                className="text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* SUBVIEW: OTP VERIFICATION */}
        {authSubView === 'otp' && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400 mb-2">
                <Smartphone size={24} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Verify Your Account</h2>
              <p className="text-xs text-slate-400">
                Enter the verification code for <span className="text-white font-medium">{email}</span>
              </p>
            </div>

            <GlassOTPInput onComplete={handleOtpComplete} />

            {devOtp ? (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200">
                <p className="font-semibold">Local Development OTP Code:</p>
                <p className="font-mono text-base font-bold text-amber-300 tracking-widest mt-0.5">{devOtp}</p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 text-[11px] text-slate-400">
                Email delivery is not configured. Verification cannot complete until a delivery provider is connected or an isolated local test code is explicitly enabled by the server operator.
              </div>
            )}
          </div>
        )}

        {/* SUBVIEW: FORGOT PASSWORD (STAGE 1) */}
        {authSubView === 'forgot-password' && (
          <form onSubmit={handlePasswordResetRequest} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
              <p className="text-xs text-slate-400">Enter your registered email. Reset email delivery is currently unavailable.</p>
            </div>

            <GlassInput
              label="Registered Email Address"
              type="email"
              placeholder="name@ruthiebank.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
            />

            <GlassButton
              variant="primary"
              size="lg"
              type="submit"
              loading={loading}
              className="w-full"
            >
              Send Reset Code
            </GlassButton>
          </form>
        )}

        {/* SUBVIEW: RESET PASSWORD COMPLETION (STAGE 2) */}
        {authSubView === 'reset-password' && (
          <form onSubmit={handlePasswordResetComplete} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Create New Password</h2>
              <p className="text-xs text-slate-400">
                Enter your reset code for <span className="text-white">{email}</span> and your new password
              </p>
            </div>

            {devOtp && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200">
                <span className="font-semibold">Local Development Reset Code: </span>
                <span className="font-mono font-bold text-amber-300">{devOtp}</span>
              </div>
            )}

            {!devOtp && (
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 text-[11px] text-slate-400">
                No email provider is connected. A reset code will not be delivered in this environment.
              </div>
            )}

            <GlassInput
              label="6-Digit Reset Code"
              placeholder="123456"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              maxLength={6}
              required
            />

            <div>
              <GlassInput
                label="New Password"
                type="password"
                placeholder="At least 12 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock size={16} />}
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Must include 12+ characters, lowercase, uppercase, and a number.
              </p>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              type="submit"
              loading={loading}
              className="w-full"
            >
              Update Password
            </GlassButton>
          </form>
        )}
      </div>
    </div>
  );
};
