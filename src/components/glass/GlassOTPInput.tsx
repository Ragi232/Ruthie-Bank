"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useBank } from '@/context/BankContext';

interface GlassOTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  onResend?: () => void;
  resendSeconds?: number;
}

export const GlassOTPInput: React.FC<GlassOTPInputProps> = ({
  length = 6,
  onComplete,
  onResend,
  resendSeconds = 45,
}) => {
  const { playHaptic } = useBank();
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const [timeLeft, setTimeLeft] = useState(resendSeconds);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (!/^\d*$/.test(char)) return;

    playHaptic('light');
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === length && !newDigits.includes('')) {
      playHaptic('success');
      if (onComplete) onComplete(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    playHaptic('success');
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);

    if (pasted.length === length && onComplete) {
      onComplete(pasted);
    }
  };

  const handleResendClick = () => {
    if (timeLeft === 0) {
      playHaptic('medium');
      setTimeLeft(resendSeconds);
      if (onResend) onResend();
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* 6 OTP boxes */}
      <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-2xl bg-white/70 dark:bg-white/[0.07] border border-slate-200/90 dark:border-white/10 text-slate-900 dark:text-white backdrop-blur-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-200"
          />
        ))}
      </div>

      {/* Resend Link & Timer */}
      <div className="text-center text-xs">
        {timeLeft > 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            Resend security code in <span className="font-semibold text-emerald-500 font-mono">0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Resend OTP code
          </button>
        )}
      </div>
    </div>
  );
};
