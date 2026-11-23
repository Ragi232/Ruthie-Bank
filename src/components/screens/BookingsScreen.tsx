"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassTabBar } from '@/components/glass/GlassTabBar';
import { GlassModal } from '@/components/glass/GlassModal';
import { BookingItem } from '@/types';
import {
  Plane,
  Building,
  Ticket,
  Film,
  Sparkles,
  CreditCard,
  Gift,
  Star,
  CheckCircle2,
} from 'lucide-react';

export const BookingsScreen: React.FC = () => {
  const { bookings, bookService, playHaptic, showDynamicIsland } = useBank();

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'flight' | 'hotel' | 'event' | 'subscription' | 'giftcard'
  >('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  const filteredBookings =
    activeCategory === 'all'
      ? bookings
      : bookings.filter((b) => b.category === activeCategory);

  const handleBookClick = (item: BookingItem) => {
    playHaptic('medium');
    setSelectedBooking(item);
  };

  const handleConfirmPurchase = () => {
    if (!selectedBooking) return;
    bookService(selectedBooking);
    setSelectedBooking(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-500 mb-1">
          <Plane size={16} />
          <span>Concierge & Lifestyle</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Bookings & Lifestyle Subscriptions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Book flights, luxury hotels, tech conferences, and manage digital entertainment subscriptions
        </p>
      </div>

      {/* Categories Bar */}
      <GlassTabBar
        tabs={[
          { id: 'all', label: 'All Experiences' },
          { id: 'flight', label: 'Flights', icon: <Plane size={15} /> },
          { id: 'hotel', label: 'Hotels', icon: <Building size={15} /> },
          { id: 'event', label: 'Events & Tech', icon: <Ticket size={15} /> },
          { id: 'subscription', label: 'Subscriptions', icon: <CreditCard size={15} /> },
        ]}
        activeTab={activeCategory}
        onChange={(cat) => setActiveCategory(cat as any)}
      />

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBookings.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl p-6 bg-white/70 dark:bg-[#071726]/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {item.badge || item.category.toUpperCase()}
                </span>
                {item.rating && (
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star size={13} fill="currentColor" />
                    <span>{item.rating}</span>
                  </div>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {item.subtitle}
              </p>

              {item.details && (
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1 text-[11px]">
                  {Object.entries(item.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-white/10">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Price</span>
                <p className="text-lg font-black font-mono text-slate-900 dark:text-white">
                  ₦{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => handleBookClick(item)}
              >
                Book Now
              </GlassButton>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Booking Modal */}
      <GlassModal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title="Confirm Booking & Reservation"
        subtitle="Booking checkout is unavailable. No reservation or payment will be made."
        maxWidth="md"
      >
        {selectedBooking && (
          <div className="space-y-4 pt-1 text-xs">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Reservation Total
              </span>
              <p className="text-3xl font-black font-mono text-purple-600 dark:text-purple-400 mt-0.5">
                ₦{selectedBooking.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {selectedBooking.title}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Experience Type</span>
                <span className="font-bold text-slate-900 dark:text-white uppercase">
                  {selectedBooking.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Concierge Desk</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Ruthie Luxury Lifestyle VIP
                </span>
              </div>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              onClick={handleConfirmPurchase}
              className="w-full mt-2"
            >
              Confirm & Issue E-Ticket
            </GlassButton>
          </div>
        )}
      </GlassModal>
    </div>
  );
};
