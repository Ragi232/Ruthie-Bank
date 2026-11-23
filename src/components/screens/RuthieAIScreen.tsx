"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassButton } from '@/components/glass/GlassButton';
import { Sparkles, Send, TrendingUp, PiggyBank, ArrowLeftRight, Bot } from 'lucide-react';

export const RuthieAIScreen: React.FC = () => {
  const { aiMessages, sendAIMessage, isAITyping, playHaptic, setCurrentScreen } = useBank();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isAITyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendAIMessage(inputText);
    setInputText('');
  };

  const handleSuggestionClick = (prompt: string) => {
    playHaptic('light');
    sendAIMessage(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] space-y-4 pb-20 md:pb-4">
      {/* Top AI Indicator Bar with Apple Intelligence Glow */}
      <div className="relative rounded-3xl p-4 bg-gradient-to-r from-emerald-600/20 via-teal-500/20 to-indigo-600/20 backdrop-blur-3xl border border-emerald-400/30 shadow-[0_10px_30px_rgba(5,150,105,0.2)] flex items-center justify-between shrink-0 overflow-hidden">
        {/* Glowing edge light */}
        <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-400/30 to-purple-500/20 blur-md" />

        <div className="relative flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-lg border border-emerald-300/40">
            <Sparkles size={20} className="animate-spin" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Ruthie AI Intelligence</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-400/30">
                NOT CONNECTED
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Account data and AI services are not connected.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span>Unavailable</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 pr-3">
        {aiMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed backdrop-blur-2xl ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-[0_8px_25px_rgba(5,150,105,0.3)]'
                    : 'bg-white/80 dark:bg-[#071726]/85 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
                    <Sparkles size={12} />
                    <span>Ruthie Advisor</span>
                  </div>
                )}

                <p>{msg.content}</p>

                {/* Embedded Diagnostic Data Card */}
                {msg.dataCard && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-white/[0.04] border border-emerald-500/20 text-xs space-y-2 text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {msg.dataCard.title}
                      </span>
                      {msg.dataCard.value && (
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {msg.dataCard.value}
                        </span>
                      )}
                    </div>
                    {msg.dataCard.details && (
                      <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {msg.dataCard.details.map((d, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <span className="text-[10px] opacity-60 block mt-2 text-right">
                  {msg.timestamp}
                </span>
              </div>

              {/* Suggestions Chips underneath Assistant Messages */}
              {!isUser && msg.suggestions && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-w-[85%]">
                  {msg.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-emerald-500/15 hover:text-emerald-500 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 transition-colors text-left"
                    >
                      {suggestion} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing Animation */}
        {isAITyping && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-white/70 dark:bg-[#071726]/75 border border-slate-200 dark:border-white/10 w-32 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-2 rounded-3xl bg-white/80 dark:bg-[#071726]/85 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 shadow-lg shrink-0"
      >
        <input
          type="text"
          placeholder="Ask Ruthie AI about your finances, vault savings, or Eurobonds..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
        />
        <GlassButton
          variant="primary"
          size="icon"
          type="submit"
          disabled={!inputText.trim() || isAITyping}
        >
          <Send size={16} />
        </GlassButton>
      </form>
    </div>
  );
};
