"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassTabBar } from '@/components/glass/GlassTabBar';
import {
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Lock,
  Send,
  Plus,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Headphones,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { SupportTicketItem } from '@/types';

export const SupportScreen: React.FC = () => {
  const {
    supportTickets,
    playHaptic,
    showDynamicIsland,
  } = useBank();

  const [activeTab, setActiveTab] = useState<'tickets' | 'livechat' | 'faq'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [replyText, setReplyText] = useState('');

  // New ticket modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicketItem['category']>('transfer');
  const [newPriority, setNewPriority] = useState<SupportTicketItem['priority']>('medium');
  const [newMessage, setNewMessage] = useState('');

  // Live Concierge Chat state
  const [liveMessages, setLiveMessages] = useState<Array<{ id: string; sender: 'user' | 'agent'; text: string; time: string }>>([]);
  const [liveInput, setLiveInput] = useState('');

  // Emergency Lock Modal
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  // FAQ Accordion
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I use this preview to send or receive money?",
      a: "No. Deposits, transfers, withdrawals, and payments are unavailable. No funds are held or moved by this application.",
    },
    {
      q: "Are the balances, transaction history, rates, and product figures live?",
      a: "No. They are sample data used to demonstrate the interface and do not describe a real account, quote, or offer.",
    },
    {
      q: "Are savings, investments, or loans available?",
      a: "No. The screens are previews only. No rate, return, loan eligibility, approval, or disbursement is offered.",
    },
    {
      q: "Are deposits insured or protected by a banking partner?",
      a: "No banking partner, deposit-taking service, or insurance arrangement is connected to this development preview.",
    },
  ];
  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    showDynamicIsland({ title: 'Support service unavailable', subtitle: 'No ticket API is connected. Your message was not submitted.', type: 'security' });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    showDynamicIsland({ title: 'Support service unavailable', subtitle: 'No ticket API is connected. Your reply was not submitted.', type: 'security' });
  };

  const handleSendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveInput.trim()) return;

    showDynamicIsland({ title: 'Live support unavailable', subtitle: 'No chat service is connected. Your message was not sent.', type: 'security' });
  };

  const handleEmergencyFreeze = () => {
    playHaptic('warning');
    showDynamicIsland({
      title: 'Account restriction unavailable',
      subtitle: 'No server-side account lock or card controls are connected. No restriction was applied.',
      type: 'security',
      durationMs: 6000,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-28 md:pb-12">
      <div role="status" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-200">
        Sample tickets below are illustrative. New support messages and emergency account restrictions cannot be submitted here.
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Headphones size={16} />
            <span>Support preview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Customer Support & Concierge
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Support tickets, live chat, and account controls are not connected in this preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playHaptic('light');
              setCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Open New Ticket</span>
          </button>

          <button
            onClick={() => {
              playHaptic('warning');
              setEmergencyModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
          >
            <ShieldAlert size={15} />
            <span className="hidden sm:inline">Emergency Freeze</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <GlassTabBar
        tabs={[
          { id: 'tickets', label: 'Support Tickets', count: supportTickets.length },
          { id: 'livechat', label: 'Live Concierge Chat' },
          { id: 'faq', label: 'Knowledge Base & FAQ' },
        ]}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as any)}
      />

      {/* VIEW: TICKETS */}
      {activeTab === 'tickets' && (
        <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Your Tickets ({supportTickets.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No live support response time is available in this preview.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => {
                  playHaptic('light');
                  setSelectedTicket(ticket);
                }}
                className="flex items-start justify-between gap-4 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.03] px-3 rounded-2xl transition-colors cursor-pointer group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      #{ticket.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ticket.status === 'RESOLVED'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : ticket.status === 'IN_REVIEW'
                          ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {ticket.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {ticket.subject}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Latest: {ticket.messages[ticket.messages.length - 1]?.text}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {ticket.createdAt}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold group-hover:underline">
                    View Thread →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: LIVE CONCIERGE CHAT */}
      {activeTab === 'livechat' && (
        <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm flex flex-col h-[520px]">
          {/* Agent Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                SC
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Sola Clement</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </h3>
                <p className="text-[11px] text-slate-400">Senior Private Wealth Advisor · Sample interface only</p>
              </div>
            </div>

            <div className="text-right text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              No live chat session is connected
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-2">
            {liveMessages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendLiveMessage} className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Ask Sola anything regarding your accounts or wires..."
              value={liveInput}
              onChange={(e) => setLiveInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* VIEW: FAQ */}
      {activeTab === 'faq' && (
        <div className="rounded-[32px] p-6 bg-white/75 dark:bg-[#071726]/80 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Frequently Answered Inquiries
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => {
                      playHaptic('light');
                      setExpandedFaq(isOpen ? null : idx);
                    }}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 dark:text-white gap-3 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/40 dark:border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: TICKET THREAD & REPLY */}
      <GlassModal
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? `Ticket #${selectedTicket.id}` : 'Ticket'}
        subtitle={selectedTicket?.subject}
        maxWidth="lg"
      >
        {selectedTicket && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-emerald-500 uppercase">{selectedTicket.category}</span>
              <span>·</span>
              <span className="text-slate-400">Status: {selectedTicket.status}</span>
              <span>·</span>
              <span className="text-slate-400">Priority: {selectedTicket.priority}</span>
            </div>

            {/* Conversation Feed */}
            <div className="max-h-72 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10">
              {selectedTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl text-xs space-y-1 ${
                    m.sender === 'agent'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-slate-900 dark:text-slate-100'
                      : 'bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className={m.sender === 'agent' ? 'text-emerald-500' : 'text-slate-400'}>
                      {m.senderName}
                    </span>
                    <span className="text-slate-400 font-mono">{m.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                placeholder="Type your reply to this ticket thread..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
              <GlassButton variant="primary" size="sm" type="submit">
                Reply
              </GlassButton>
            </form>
          </div>
        )}
      </GlassModal>

      {/* MODAL: CREATE NEW TICKET */}
      <GlassModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Open Support Ticket"
        subtitle="No live support routing is connected."
        maxWidth="md"
      >
        <form onSubmit={handleCreateTicketSubmit} className="space-y-4 pt-2">
          <GlassInput
            label="Subject"
            placeholder="e.g. Inward Wire Delay / Limit Increase"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c243b] border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="transfer">Disputed Transfer / Wire</option>
                <option value="card">Virtual Card / POS</option>
                <option value="kyc">KYC & Tier Upgrade</option>
                <option value="general">General Advisory</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c243b] border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="low">Low (within 24h)</option>
                <option value="medium">Medium (within 2h)</option>
                <option value="high">High (within 15m)</option>
                <option value="urgent">Urgent Security Incident</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Detailed Description
            </label>
            <textarea
              rows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Describe what occurred, including reference codes, amounts, or merchant names..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              required
            />
          </div>

          <GlassButton variant="primary" size="lg" type="submit" className="w-full">
            Submit Support Request
          </GlassButton>
        </form>
      </GlassModal>

      {/* MODAL: EMERGENCY FREEZE */}
      <GlassModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        title="Account restriction unavailable"
        subtitle="No server-side account restriction is connected."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2 text-center text-xs">
          <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500">
            <AlertTriangle size={32} />
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            No transfer, card, or session controls are connected. This preview cannot restrict an account.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <GlassButton variant="glass" onClick={() => setEmergencyModalOpen(false)}>
              Cancel
            </GlassButton>
            <button
              onClick={handleEmergencyFreeze}
              className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg cursor-pointer"
            >
              Confirm Lock
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
