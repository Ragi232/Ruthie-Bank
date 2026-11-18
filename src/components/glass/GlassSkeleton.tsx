"use client";

import React from 'react';

interface GlassSkeletonProps {
  className?: string;
}

export const GlassSkeleton: React.FC<GlassSkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/[0.08] backdrop-blur-md ${className}`}
    />
  );
};
