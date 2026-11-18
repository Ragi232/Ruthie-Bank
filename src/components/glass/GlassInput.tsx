"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  currencyPrefix?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  hint,
  icon,
  type = 'text',
  value,
  onChange,
  clearable = false,
  onClear,
  currencyPrefix,
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-700 dark:text-slate-300 ml-1"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center rounded-2xl transition-all duration-200">
        {currencyPrefix && (
          <span className="absolute left-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 select-none">
            {currencyPrefix}
          </span>
        )}

        {icon && !currencyPrefix && (
          <span className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          className={`w-full rounded-2xl bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-200/90 dark:border-white/10 focus:border-emerald-500/80 dark:focus:border-emerald-400/80 focus:ring-4 focus:ring-emerald-500/15'
          } px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200 ${
            currencyPrefix ? 'pl-9' : icon ? 'pl-11' : ''
          } ${clearable || isPassword ? 'pr-11' : ''} ${className}`}
          {...props}
        />

        {clearable && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 dark:text-rose-400 ml-1 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">{hint}</p>
      ) : null}
    </div>
  );
};
