"use client";

import React from 'react';

interface GlassProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export const GlassProgressRing: React.FC<GlassProgressRingProps> = ({
  progress,
  size = 110,
  strokeWidth = 9,
  color = '#10b981',
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200/80 dark:text-white/10"
          fill="transparent"
        />
        {/* Progress indicator ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
          {Math.round(clampedProgress)}%
        </span>
        {label && <span className="text-[9px] text-slate-500 dark:text-slate-400 -mt-0.5">{label}</span>}
      </div>
    </div>
  );
};
