"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AIMessage,
  AuthSubView,
  Beneficiary,
  BookingItem,
  CurrencyCode,
  DeviceInfo,
  DynamicIslandState,
  InvestmentProduct,
  LoanEligibility,
  NotificationItem,
  SavingsGoal,
  ScreenType,
  TransactionRecord,
  UserInvestment,
  UserProfile,
  UtilityProvider,
  WalletBalance,
} from '@/types';
import {
  bookingCatalog,
  initialBeneficiaries,
  initialInvestments,
  initialLoanEligibility,
  initialNotifications,
  initialSavingsGoals,
  initialTransactions,
  initialUser,
  initialUserInvestments,
  initialWallets,
  userDevices,
  utilityProviders,
} from '@/lib/mock-data';

interface BankContextType {
  // Navigation & Screen
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  authSubView: AuthSubView;
  setAuthSubView: (view: AuthSubView) => void;

  // User & Theme
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;

  // Financial State
  balanceVisible: boolean;
  setBalanceVisible: (visible: boolean) => void;
  toggleBalanceVisible: () => void;
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (curr: CurrencyCode) => void;
  wallets: WalletBalance[];
  transactions: TransactionRecord[];
  beneficiaries: Beneficiary[];
  savingsGoals: SavingsGoal[];
  investments: InvestmentProduct[];
  userInvestments: UserInvestment[];
  loanEligibility: LoanEligibility;
  providers: UtilityProvider[];
  bookings: BookingItem[];
  notifications: NotificationItem[];
  devices: DeviceInfo[];

  // Dynamic Island
  dynamicIsland: DynamicIslandState;
  showDynamicIsland: (
    title: string,
    subtitle?: string,
    type?: DynamicIslandState['type'],
    durationMs?: number
  ) => void;
  dismissDynamicIsland: () => void;

  // Active Receipt Modal
  activeReceipt: TransactionRecord | null;
  setActiveReceipt: (receipt: TransactionRecord | null) => void;

  // Actions
  transferMoney: (params: {
    recipientName: string;
    accountOrTag: string;
    bankName: string;
    amount: number;
    currency: CurrencyCode;
    description: string;
    fee?: number;
  }) => Promise<{ success: boolean; transaction?: TransactionRecord; error?: string }>;

  convertCurrency: (params: {
    fromCurrency: CurrencyCode;
    toCurrency: CurrencyCode;
    fromAmount: number;
    toAmount: number;
    rate: number;
  }) => Promise<{ success: boolean; transaction?: TransactionRecord; error?: string }>;

  payBillOrAirtime: (params: {
    providerId: string;
    providerName: string;
    category: 'telco' | 'electricity' | 'cable' | 'internet' | 'water' | 'education';
    beneficiaryNumber: string;
    amount: number;
    planName?: string;
  }) => Promise<{ success: boolean; transaction?: TransactionRecord; token?: string }>;

  createSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'status' | 'currentAmount'>) => void;
  depositToSavings: (goalId: string, amount: number) => void;
  investInProduct: (productId: string, units: number) => void;
  repayActiveLoan: (amount: number) => void;
  applyForLoan: (amount: number, tenureMonths: number, purpose: string) => void;
  bookService: (item: BookingItem) => void;

  // Ruthie AI
  aiMessages: AIMessage[];
  sendAIMessage: (text: string) => void;
  isAITyping: boolean;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Haptics simulation
  playHaptic: (type?: 'light' | 'medium' | 'success' | 'warning') => void;
}

const BankContext = createContext<BankContextType | null>(null);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [authSubView, setAuthSubView] = useState<AuthSubView>('login');
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('NGN');

  const [wallets, setWallets] = useState<WalletBalance[]>(initialWallets);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
  const [investments] = useState<InvestmentProduct[]>(initialInvestments);
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>(initialUserInvestments);
  const [loanEligibility, setLoanEligibility] = useState<LoanEligibility>(initialLoanEligibility);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeReceipt, setActiveReceipt] = useState<TransactionRecord | null>(null);

  // Dynamic Island
  const [dynamicIsland, setDynamicIsland] = useState<DynamicIslandState>({
    active: false,
    title: '',
    type: 'success',
  });

  // AI Chat Messages
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'ai_welcome',
      sender: 'assistant',
      content:
        'Hello Ruthie! ✦ I am your Ruthie AI Financial Intelligence companion. I have reviewed your portfolio across your NGN, USD, and GBP accounts. Your net liquid wealth grew by +14.2% this quarter. How can I assist you with your investments, FX conversions, or savings goals today?',
      timestamp: 'Just now',
      suggestions: [
        'Analyze my spending this month',
        'How can I save ₦500,000 for travel in 3 months?',
        'What are the best Eurobond yields right now?',
        'Simulate converting $2,000 to NGN',
      ],
      dataCard: {
        type: 'projection',
        title: 'Ruthie Intelligence Snapshot',
        value: '₦10,845,950 Liquid Portfolio',
        details: [
          'High-yield Vault active at 18.5% APY',
          'FX Exposure: 64% NGN, 24% USD, 12% GBP',
          'Credit Score: 785/850 (Tier 1 Prime)',
        ],
      },
    },
  ]);
  const [isAITyping, setIsAITyping] = useState<boolean>(false);

  // Synchronize theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleBalanceVisible = () => {
    playHaptic('light');
    setBalanceVisible((prev) => !prev);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const playHaptic = (type: 'light' | 'medium' | 'success' | 'warning' = 'light') => {
    if (typeof window === 'undefined') return;
    try {
      if ('vibrate' in navigator) {
        if (type === 'light') navigator.vibrate(10);
        else if (type === 'medium') navigator.vibrate(25);
        else if (type === 'success') navigator.vibrate([15, 50, 20]);
        else if (type === 'warning') navigator.vibrate([40, 40, 40]);
      }
    } catch {
      // Ignore vibration error on unsupported hardware
    }
  };

  const showDynamicIsland = (
    title: string,
    subtitle?: string,
    type: DynamicIslandState['type'] = 'success',
    durationMs: number = 4000
  ) => {
    setDynamicIsland({ active: true, title, subtitle, type, expanded: true });
    playHaptic('success');
    setTimeout(() => {
      setDynamicIsland((prev) => ({ ...prev, active: false }));
    }, durationMs);
  };

  const dismissDynamicIsland = () => {
    setDynamicIsland((prev) => ({ ...prev, active: false }));
  };

  // Money Movement: Transfer
  const transferMoney = async ({
    recipientName,
    accountOrTag,
    bankName,
    amount,
    currency,
    description,
    fee = 0,
  }: {
    recipientName: string;
    accountOrTag: string;
    bankName: string;
    amount: number;
    currency: CurrencyCode;
    description: string;
    fee?: number;
  }) => {
    playHaptic('medium');

    const wallet = wallets.find((w) => w.currency === currency);
    if (!wallet || wallet.availableBalance < amount + fee) {
      showDynamicIsland('Transfer Declined', 'Insufficient available funds in this wallet', 'security');
      return { success: false, error: 'Insufficient funds' };
    }

    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: `REF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      idempotencyKey: crypto.randomUUID(),
      type: 'TRANSFER_OUT',
      title: bankName === 'Ruthie Bank' ? 'Ruthie Instant Send' : `Bank Transfer · ${bankName}`,
      description: description || `Transfer to ${recipientName}`,
      recipientOrSender: `${recipientName} (${accountOrTag})`,
      amount,
      fee,
      currency,
      timestamp: 'Just now',
      status: 'SUCCEEDED',
      category: 'transfer',
      metadata: { bankName, accountOrTag },
    };

    // Deduct balance
    setWallets((prev) =>
      prev.map((w) =>
        w.currency === currency
          ? {
              ...w,
              balance: w.balance - (amount + fee),
              availableBalance: w.availableBalance - (amount + fee),
            }
          : w
      )
    );

    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceipt(newTx);

    showDynamicIsland(
      'Transfer Completed',
      `${wallet.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} sent to ${recipientName}`,
      'success'
    );

    return { success: true, transaction: newTx };
  };

  // Currency Conversion
  const convertCurrency = async ({
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    rate,
  }: {
    fromCurrency: CurrencyCode;
    toCurrency: CurrencyCode;
    fromAmount: number;
    toAmount: number;
    rate: number;
  }) => {
    playHaptic('medium');

    const sourceWallet = wallets.find((w) => w.currency === fromCurrency);
    if (!sourceWallet || sourceWallet.availableBalance < fromAmount) {
      showDynamicIsland('Conversion Failed', 'Insufficient balance in source wallet', 'security');
      return { success: false, error: 'Insufficient source funds' };
    }

    const newTx: TransactionRecord = {
      id: `tx_fx_${Date.now()}`,
      reference: `FX-${Date.now().toString().slice(-8)}`,
      idempotencyKey: crypto.randomUUID(),
      type: 'EXCHANGE',
      title: 'Currency Conversion',
      description: `Exchanged ${sourceWallet.symbol}${fromAmount.toLocaleString()} to ${toCurrency} @ rate ${rate.toLocaleString()}`,
      recipientOrSender: `Ruthie FX Desk (${fromCurrency} → ${toCurrency})`,
      amount: toAmount,
      fee: 0,
      currency: toCurrency,
      timestamp: 'Just now',
      status: 'SUCCEEDED',
      category: 'fx',
    };

    setWallets((prev) =>
      prev.map((w) => {
        if (w.currency === fromCurrency) {
          return {
            ...w,
            balance: w.balance - fromAmount,
            availableBalance: w.availableBalance - fromAmount,
          };
        }
        if (w.currency === toCurrency) {
          return {
            ...w,
            balance: w.balance + toAmount,
            availableBalance: w.availableBalance + toAmount,
          };
        }
        return w;
      })
    );

    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceipt(newTx);

    showDynamicIsland(
      'FX Swap Completed',
      `Converted to ${toCurrency} ${toAmount.toLocaleString()}`,
      'success'
    );

    return { success: true, transaction: newTx };
  };

  // Pay Utility Bill or Airtime
  const payBillOrAirtime = async ({
    providerId,
    providerName,
    category,
    beneficiaryNumber,
    amount,
    planName,
  }: {
    providerId: string;
    providerName: string;
    category: 'telco' | 'electricity' | 'cable' | 'internet' | 'water' | 'education';
    beneficiaryNumber: string;
    amount: number;
    planName?: string;
  }) => {
    playHaptic('medium');

    const ngnWallet = wallets.find((w) => w.currency === 'NGN');
    if (!ngnWallet || ngnWallet.availableBalance < amount) {
      showDynamicIsland('Payment Failed', 'Insufficient Naira balance', 'security');
      return { success: false };
    }

    const token =
      category === 'electricity'
        ? `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
            1000 + Math.random() * 9000
          )}-${Math.floor(1000 + Math.random() * 9000)}`
        : undefined;

    const newTx: TransactionRecord = {
      id: `tx_bill_${Date.now()}`,
      reference: `BILL-${Date.now().toString().slice(-8)}`,
      idempotencyKey: crypto.randomUUID(),
      type: category === 'telco' ? 'AIRTIME' : 'BILL_PAYMENT',
      title: `${providerName} ${planName ? `· ${planName}` : ''}`,
      description: token ? `Prepaid Token: ${token}` : `${category.toUpperCase()} for ${beneficiaryNumber}`,
      recipientOrSender: `${beneficiaryNumber} (${providerName})`,
      amount,
      fee: category === 'electricity' ? 100 : 0,
      currency: 'NGN',
      timestamp: 'Just now',
      status: 'SUCCEEDED',
      category: 'bills',
      metadata: { token, providerId, planName },
    };

    setWallets((prev) =>
      prev.map((w) =>
        w.currency === 'NGN'
          ? {
              ...w,
              balance: w.balance - (amount + (category === 'electricity' ? 100 : 0)),
              availableBalance: w.availableBalance - (amount + (category === 'electricity' ? 100 : 0)),
            }
          : w
      )
    );

    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceipt(newTx);

    showDynamicIsland(
      `${providerName} Successful`,
      token ? `Token: ${token}` : `₦${amount.toLocaleString()} recharged`,
      'success'
    );

    return { success: true, transaction: newTx, token };
  };

  // Savings Goal creation & deposit
  const createSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'status' | 'currentAmount'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `sav_${Date.now()}`,
      currentAmount: 0,
      status: 'ACTIVE',
    };
    setSavingsGoals((prev) => [newGoal, ...prev]);
    showDynamicIsland('Savings Goal Created', `Target: ${newGoal.title}`, 'success');
  };

  const depositToSavings = (goalId: string, amount: number) => {
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal) return;

    setWallets((prev) =>
      prev.map((w) =>
        w.currency === goal.currency
          ? { ...w, balance: w.balance - amount, availableBalance: w.availableBalance - amount }
          : w
      )
    );

    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );

    const newTx: TransactionRecord = {
      id: `tx_sav_${Date.now()}`,
      reference: `SAV-${Date.now().toString().slice(-8)}`,
      idempotencyKey: crypto.randomUUID(),
      type: 'SAVINGS_DEPOSIT',
      title: `Deposit to ${goal.title}`,
      description: `Compounding at ${goal.interestRate}% APY`,
      recipientOrSender: `Ruthie Vault / ${goal.title}`,
      amount,
      fee: 0,
      currency: goal.currency,
      timestamp: 'Just now',
      status: 'SUCCEEDED',
      category: 'savings',
    };

    setTransactions((prev) => [newTx, ...prev]);
    showDynamicIsland('Vault Funded', `₦${amount.toLocaleString()} added to ${goal.title}`, 'success');
  };

  // Investment
  const investInProduct = (productId: string, units: number) => {
    const prod = investments.find((p) => p.id === productId);
    if (!prod) return;

    const totalCost = units * prod.pricePerUnit;
    const wallet = wallets.find((w) => w.currency === prod.currency);
    if (!wallet || wallet.availableBalance < totalCost) {
      showDynamicIsland('Investment Declined', 'Insufficient balance in investment currency', 'security');
      return;
    }

    setWallets((prev) =>
      prev.map((w) =>
        w.currency === prod.currency
          ? { ...w, balance: w.balance - totalCost, availableBalance: w.availableBalance - totalCost }
          : w
      )
    );

    const newInv: UserInvestment = {
      id: `uinv_${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      units,
      investedAmount: totalCost,
      currentValue: totalCost,
      accruedReturn: 0,
      currency: prod.currency,
      startDate: 'Today',
      maturityDate: `${prod.tenureDays} days`,
      status: 'ACTIVE',
    };

    setUserInvestments((prev) => [newInv, ...prev]);

    const newTx: TransactionRecord = {
      id: `tx_inv_${Date.now()}`,
      reference: `INV-${Date.now().toString().slice(-8)}`,
      idempotencyKey: crypto.randomUUID(),
      type: 'INVESTMENT_PURCHASE',
      title: prod.name,
      description: `Purchased ${units} units @ ${prod.currency} ${prod.pricePerUnit}`,
      recipientOrSender: prod.issuer,
      amount: totalCost,
      fee: 0,
      currency: prod.currency,
      timestamp: 'Just now',
      status: 'SUCCEEDED',
      category: 'investment',
    };

    setTransactions((prev) => [newTx, ...prev]);
    showDynamicIsland('Investment Allocated', `${units} units of ${prod.name}`, 'success');
  };

  // Loan Repayment
  const repayActiveLoan = (amount: number) => {
    const active = loanEligibility.currentActiveLoan;
    if (!active) return;

    setWallets((prev) =>
      prev.map((w) =>
        w.currency === 'NGN'
          ? { ...w, balance: w.balance - amount, availableBalance: w.availableBalance - amount }
          : w
      )
    );

    const updatedRemaining = Math.max(0, active.amountDue - amount);
    setLoanEligibility((prev: LoanEligibility) => ({
      ...prev,
      creditScore: Math.min(850, prev.creditScore + 10),
      currentActiveLoan: prev.currentActiveLoan
        ? {
            ...prev.currentActiveLoan,
            amountDue: updatedRemaining,
            repaidAmount: prev.currentActiveLoan.repaidAmount + amount,
            status: updatedRemaining === 0 ? 'REPAID' : 'ACTIVE',
          }
        : undefined,
    }));

    const newTx: TransactionRecord = {
      id: `tx_loan_${Date.now()}`,
      reference: `LN-REP-${Date.now().toString().slice(-8)}`,
      idempotencyKey: crypto.randomUUID(),
      type: 'LOAN_REPAYMENT',
      title: 'Loan Installment Repaid',
      description: 'Prime Credit Facility installment',
      recipientOrSender: 'Ruthie Microfinance Credit Desk',
      amount,
      fee: 0,
      currency: 'NGN',
      timestamp: 'Just now',
      status: 'SUCCEEDED',
      category: 'bills',
    };

    setTransactions((prev) => [newTx, ...prev]);
    showDynamicIsland('Loan Repaid', `₦${amount.toLocaleString()} paid. Credit score +10!`, 'success');
  };

  const applyForLoan = (amount: number, tenureMonths: number, purpose: string) => {
    const interest = amount * 0.02 * tenureMonths;
    const totalDue = amount + interest;

    setWallets((prev) =>
      prev.map((w) =>
        w.currency === 'NGN'
          ? { ...w, balance: w.balance + amount, availableBalance: w.availableBalance + amount }
          : w
      )
    );

    setLoanEligibility((prev: LoanEligibility) => ({
      ...prev,
      currentActiveLoan: {
        id: `ln_${Date.now()}`,
        principal: amount,
        interestRate: 2.0,
        amountDue: totalDue,
        repaidAmount: 0,
        nextDueDate: '18 Dec 2026',
        durationMonths: tenureMonths,
        monthlyInstallment: totalDue / tenureMonths,
        status: 'ACTIVE',
      },
    }));

    const newTx: TransactionRecord = {
      id: `tx_disb_${Date.now()}`,
      reference: `LN-DISB-${Date.now().toString().slice(-8)}`,
      idempotencyKey: crypto.randomUUID(),
      type: 'LOAN_DISBURSEMENT',
      title: 'Credit Facility Disbursed',
      description: `Approved for ${purpose}`,
      recipientOrSender: 'Ruthie Credit Desk',
      amount,
      fee: 0,
      currency: 'NGN',
      timestamp: 'Just now',
      status: 'SUCCEEDED',
      category: 'transfer',
    };

    setTransactions((prev) => [newTx, ...prev]);
    showDynamicIsland('Loan Disbursed', `₦${amount.toLocaleString()} credited to your wallet`, 'success');
  };

  // Lifestyle Booking
  const bookService = (item: BookingItem) => {
    const wallet = wallets.find((w) => w.currency === item.currency);
    if (!wallet || wallet.availableBalance < item.price) {
      showDynamicIsland('Booking Failed', 'Insufficient funds', 'security');
      return;
    }

    setWallets((prev) =>
      prev.map((w) =>
        w.currency === item.currency
          ? { ...w, balance: w.balance - item.price, availableBalance: w.availableBalance - item.price }
          : w
      )
    );

    const newTx: TransactionRecord = {
      id: `tx_bk_${Date.now()}`,
      reference: `BOOK-${Date.now().toString().slice(-8)}`,
      idempotencyKey: crypto.randomUUID(),
      type: 'BOOKING',
      title: item.title,
      description: item.subtitle,
      recipientOrSender: `Ruthie Concierge · ${item.category.toUpperCase()}`,
      amount: item.price,
      fee: 0,
      currency: item.currency,
      timestamp: 'Just now',
      status: 'SUCCEEDED',
      category: 'lifestyle',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceipt(newTx);
    showDynamicIsland('Booking Confirmed', item.title, 'success');
  };

  // Ruthie AI Financial Intelligence responder
  const sendAIMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsAITyping(true);
    playHaptic('light');

    setTimeout(() => {
      let replyContent = '';
      let suggestions: string[] = [];
      let dataCard: AIMessage['dataCard'] = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('spend') || lower.includes('budget') || lower.includes('analyze')) {
        replyContent =
          'I analyzed your spending patterns over the last 30 days. You have allocated ₦284,500 across utilities, travel, and transfers. Your discretionary spending is down 11%, leaving an extra ₦150,000 surplus this month. I recommend sweeping ₦100,000 into the Ruthie Vault at 18.5% APY.';
        suggestions = ['Move ₦100k to Vault now', 'View category breakdown', 'Set ₦50k weekly budget'];
        dataCard = {
          type: 'spending',
          title: 'Monthly Cash Flow Diagnostic',
          value: '+₦150,000 Net Surplus',
          details: [
            'Fixed Bills: ₦68,000 (24%)',
            'Transfers & Lifestyle: ₦145,000 (51%)',
            'Savings & Investments: ₦71,500 (25%)',
          ],
        };
      } else if (lower.includes('save') || lower.includes('500') || lower.includes('travel')) {
        replyContent =
          'To reach ₦500,000 in 90 days, you need to save ₦41,666 weekly or ₦166,666 monthly. With Ruthie Vault compounding at 16.5% APY, you will also earn ₦12,450 in passive interest over that duration, shortening your target date by 6 days!';
        suggestions = ['Set up ₦41,666 weekly auto-save', 'Lock ₦200k lump sum upfront', 'Explore Eurobonds'];
        dataCard = {
          type: 'projection',
          title: '3-Month Target Savings Trajectory',
          value: '₦512,450 Projected Balance',
          details: [
            'Target: ₦500,000.00',
            'Accrued Interest: +₦12,450.00',
            'Recommended Frequency: Weekly auto-debit',
          ],
        };
      } else if (lower.includes('eurobond') || lower.includes('invest') || lower.includes('yield')) {
        replyContent =
          'The Federal Republic of Nigeria 2029 Eurobond is currently yielding 9.85% in pure USD terms, backed by sovereign oil receipts. Alternatively, our Ruthie High-Yield Treasury Bills fund offers 21.4% APY in NGN. Since you hold $4,850 in your USD wallet, investing $1,500 would generate ~$147 USD annual passive yield with zero exchange rate volatility.';
        suggestions = ['Invest $1,000 in FRN Eurobond', 'Invest ₦250k in Treasury Bills', 'Compare Risk Profiles'];
        dataCard = {
          type: 'projection',
          title: 'Investment Yield Comparison',
          value: '9.85% USD / 21.4% NGN',
          details: [
            'FRN Eurobond 2029: 9.85% USD (Sovereign Guaranteed)',
            'Ruthie T-Bills Fund: 21.4% NGN (Zero default history)',
            'Tech Titans Index: 28.6% (Moderate equity risk)',
          ],
        };
      } else if (lower.includes('convert') || lower.includes('dollar') || lower.includes('fx')) {
        replyContent =
          'The current mid-market rate is ₦1,540.50 per 1 USD with 0% conversion markup on Ruthie Bank. Converting $2,000 USD right now yields exactly ₦3,081,000.00 NGN directly credited to your primary wallet. Over the past 7 days, USD has strengthened by +0.8%.';
        suggestions = ['Convert $2,000 now', 'Set FX rate alert for ₦1,550', 'View 30-day FX chart'];
        dataCard = {
          type: 'rate',
          title: 'Live Exchange Execution Rate',
          value: '1 USD = ₦1,540.50 NGN',
          details: [
            'Institutional Spread: 0.00%',
            'Settlement Speed: Instant (0 seconds)',
            'Quote Expiry: 60 seconds guaranteed',
          ],
        };
      } else {
        replyContent = `Understood! I've analyzed your question regarding "${text}". As your private banking AI, I can execute transfers, rebalance your currency allocations, optimize your credit score (currently 785/850), or automatically compound your excess cash. What would you like me to prioritize?`;
        suggestions = ['Analyze my spending', 'Compare savings yields', 'Check exchange rates'];
      }

      const aiMsg: AIMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        content: replyContent,
        timestamp: 'Just now',
        suggestions,
        dataCard,
      };

      setAiMessages((prev) => [...prev, aiMsg]);
      setIsAITyping(false);
      playHaptic('light');
    }, 900);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <BankContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        authSubView,
        setAuthSubView,
        user,
        updateUser,
        theme,
        setTheme,
        toggleTheme,
        isAuthenticated,
        setIsAuthenticated,
        balanceVisible,
        setBalanceVisible,
        toggleBalanceVisible,
        selectedCurrency,
        setSelectedCurrency,
        wallets,
        transactions,
        beneficiaries,
        savingsGoals,
        investments,
        userInvestments,
        loanEligibility,
        providers: utilityProviders,
        bookings: bookingCatalog,
        notifications,
        devices: userDevices,
        dynamicIsland,
        showDynamicIsland,
        dismissDynamicIsland,
        activeReceipt,
        setActiveReceipt,
        transferMoney,
        convertCurrency,
        payBillOrAirtime,
        createSavingsGoal,
        depositToSavings,
        investInProduct,
        repayActiveLoan,
        applyForLoan,
        bookService,
        aiMessages,
        sendAIMessage,
        isAITyping,
        markNotificationRead,
        markAllNotificationsRead,
        playHaptic,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
