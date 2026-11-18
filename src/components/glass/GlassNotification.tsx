"use client";

import React from 'react';
import { useBank } from '@/context/BankContext';
import { GlassModal } from './GlassModal';
import { ShieldCheck, ArrowDownLeft, TrendingUp, Sparkles, CheckCheck } from 'lucide-react';
import { NotificationItem } from '@/types';

interface GlassNotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlassNotification: React.FC<GlassNotificationProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, playHaptic } = useBank();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'security':
        return <ShieldCheck size={16} className="text-amber-400" />;
      case 'transaction':
        return <ArrowDownLeft size={16} className="text-emerald-400" />;
      case 'fx':
        return <TrendingUp size={16} className="text-teal-400" />;
      case 'savings':
      default:
        return <Sparkles size={16} className="text-emerald-400" />;
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications & Alerts"
      subtitle="Real-time account activity and security logs"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-white/10">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {notifications.filter((n) => !n.read).length} unread updates
          </span>
          <button
            onClick={() => {
              playHaptic('light');
              markAllNotificationsRead();
            }}
            className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                playHaptic('light');
                markNotificationRead(n.id);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-slate-50/60 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/5 opacity-80'
                  : 'bg-emerald-500/[0.07] dark:bg-emerald-500/[0.12] border-emerald-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassModal>
  );
};
