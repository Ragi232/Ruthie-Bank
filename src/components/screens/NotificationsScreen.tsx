"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassTabBar } from '@/components/glass/GlassTabBar';
import { GlassButton } from '@/components/glass/GlassButton';
import {
  Bell,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  ArrowLeftRight,
  PiggyBank,
  Sparkles,
  Trash2,
  CheckCheck,
  Search,
  Filter,
} from 'lucide-react';
import { NotificationItem } from '@/types';

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentScreen,
    playHaptic,
    showDynamicIsland,
  } = useBank();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>(notifications);

  // Sync with context notifications if new ones arrive
  React.useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  const filtered = localNotifications.filter((n) => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'security':
        return <ShieldCheck size={18} className="text-amber-400 shrink-0" />;
      case 'transaction':
        return <ArrowUpRight size={18} className="text-emerald-400 shrink-0" />;
      case 'fx':
        return <ArrowLeftRight size={18} className="text-sky-400 shrink-0" />;
      case 'savings':
        return <PiggyBank size={18} className="text-emerald-400 shrink-0" />;
      case 'promo':
      default:
        return <Sparkles size={18} className="text-purple-400 shrink-0" />;
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    playHaptic('light');
    markNotificationRead(item.id);

    // Deep link based on type
    if (item.type === 'transaction') {
      setCurrentScreen('history');
    } else if (item.type === 'fx') {
      setCurrentScreen('wallets');
    } else if (item.type === 'savings') {
      setCurrentScreen('savings');
    } else if (item.type === 'security') {
      setCurrentScreen('profile');
    }
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playHaptic('light');
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    showDynamicIsland('Notification Removed', undefined, 'success');
  };

  const handleClearAll = () => {
    playHaptic('medium');
    setLocalNotifications([]);
    showDynamicIsland('Inbox Cleared', 'All notifications cleared', 'success');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Bell size={16} />
            <span>Activity Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Notifications Center</span>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time security alerts, transaction receipts, institutional FX movements, and vault milestones
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => {
                playHaptic('light');
                markAllNotificationsRead();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-800 dark:text-white transition-all shadow-sm"
            >
              <CheckCheck size={15} className="text-emerald-500" />
              <span>Mark all read</span>
            </button>
          )}

          {localNotifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-white/10 hover:bg-rose-500/10 border border-slate-200 dark:border-white/15 text-xs font-semibold text-rose-500 transition-all shadow-sm"
            >
              <Trash2 size={15} />
              <span>Clear inbox</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <GlassTabBar
            tabs={[
              { id: 'all', label: 'All', count: localNotifications.length },
              { id: 'security', label: 'Security' },
              { id: 'transaction', label: 'Transactions' },
              { id: 'fx', label: 'FX Rates' },
              { id: 'savings', label: 'Vault' },
            ]}
            activeTab={filterType}
            onChange={(tab) => setFilterType(tab)}
          />
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="rounded-[32px] p-4 sm:p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-3">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`flex items-start justify-between gap-4 p-4 rounded-2xl transition-all cursor-pointer group ${
                  !item.read
                    ? 'bg-emerald-500/[0.06] hover:bg-emerald-500/[0.1]'
                    : 'hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 flex items-center justify-center shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-xs sm:text-sm tracking-tight truncate ${
                          !item.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_#10b981]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDeleteNotification(item.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Notification"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">You&apos;re All Caught Up</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No new alerts or pending security notifications at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
