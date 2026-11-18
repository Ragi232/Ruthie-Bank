/**
 * Ruthie Bank Design System Tokens
 * Inspired by Apple's Liquid Glass, iOS 18 spatial UI, and high-end fintech aesthetics.
 */

export const colors = {
  // Midnight Navy Palette
  navy: {
    950: '#03080e',
    900: '#06121e',
    850: '#091a2b',
    800: '#0d2236',
    700: '#14314c',
    600: '#1c4265',
    500: '#275883',
  },
  // Emerald Green (Signature Banking Accent)
  emerald: {
    950: '#022c22',
    900: '#064e3b',
    800: '#065f46',
    700: '#047857',
    600: '#059669',
    500: '#10b981',
    400: '#34d399',
    300: '#6ee7b7',
    200: '#a7f3d0',
    100: '#d1fae5',
    50: '#ecfdf5',
  },
  // Champagne Gold (Wealth & Premium Highlights)
  gold: {
    900: '#78350f',
    800: '#92400e',
    700: '#b45309',
    600: '#d97706',
    500: '#f59e0b',
    400: '#fbbf24',
    300: '#fcd34d',
    200: '#fde68a',
    100: '#fef3c7',
  },
  // Soft White & Platinum Greys
  platinum: {
    900: '#0f172a',
    800: '#1e293b',
    700: '#334155',
    600: '#475569',
    500: '#64748b',
    400: '#94a3b8',
    300: '#cbd5e1',
    200: '#e2e8f0',
    100: '#f1f5f9',
    50: '#f8fafc',
  },
};

export const glassSurfaces = {
  // Dark mode surfaces
  dark: {
    card: 'bg-[#091a2b]/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
    cardHover: 'hover:bg-[#0d2236]/80 hover:border-white/20 transition-all duration-300',
    elevated: 'bg-[#0d2236]/80 backdrop-blur-3xl border border-white/15 shadow-[0_16px_48px_0_rgba(0,0,0,0.5)]',
    input: 'bg-white/[0.06] border border-white/10 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 text-white placeholder-white/30',
    pill: 'bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white',
    heroCard: 'bg-gradient-to-br from-[#064e3b]/80 via-[#0d2236]/90 to-[#06121e]/95 backdrop-blur-3xl border border-[#34d399]/30 shadow-[0_20px_60px_-15px_rgba(5,150,105,0.3)]',
  },
  // Light mode surfaces
  light: {
    card: 'bg-white/75 backdrop-blur-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]',
    cardHover: 'hover:bg-white/90 hover:border-slate-300 transition-all duration-300',
    elevated: 'bg-white/90 backdrop-blur-3xl border border-slate-200 shadow-[0_16px_40px_rgb(0,0,0,0.09)]',
    input: 'bg-slate-50/80 border border-slate-200 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 text-slate-900 placeholder-slate-400',
    pill: 'bg-slate-100/80 hover:bg-slate-200/80 backdrop-blur-md border border-slate-200 text-slate-700',
    heroCard: 'bg-gradient-to-br from-[#064e3b] via-[#09352c] to-[#061e19] backdrop-blur-3xl border border-emerald-400/30 text-white shadow-[0_20px_60px_-15px_rgba(6,78,59,0.35)]',
  },
};

export const springTransitions = {
  fluid: 'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
  bounce: 'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
  smooth: 'transition-all duration-200 ease-out',
};
