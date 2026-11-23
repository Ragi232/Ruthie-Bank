"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  AIMessage,
  AuthSubView,
  Beneficiary,
  BookingItem,
  CurrencyCode,
  DeviceInfo,
  DynamicIslandAction,
  DynamicIslandState,
  DynamicIslandType,
  InvestmentProduct,
  LoanEligibility,
  NotificationItem,
  SavingsGoal,
  ScreenType,
  SupportTicketItem,
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

  // Subtab navigation for Bills
  billsActiveTab: 'airtime' | 'data' | 'electricity' | 'cable' | 'internet';
  setBillsActiveTab: (tab: 'airtime' | 'data' | 'electricity' | 'cable' | 'internet') => void;

  // Support Tickets
  supportTickets: SupportTicketItem[];
  createSupportTicket: (params: {
    subject: string;
    category: SupportTicketItem['category'];
    priority: SupportTicketItem['priority'];
    message: string;
  }) => void;
  sendTicketReply: (ticketId: string, text: string) => void;

  // Admin Console State & Actions
  adminUsers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    tier: number;
    status: 'ACTIVE' | 'LOCKED';
    balance: string;
    kycVerified: boolean;
    joinedDate: string;
  }>;
  adminUpdateUserStatus: (userId: string, status: 'ACTIVE' | 'LOCKED') => void;
  adminApproveKyc: (userId: string, tier: 1 | 2 | 3) => void;

  // Dynamic Island
  dynamicIsland: DynamicIslandState;
  showDynamicIsland: (
    titleOrPayload:
      | string
      | {
          title: string;
          subtitle?: string;
          type?: DynamicIslandType;
          amount?: string;
          reference?: string;
          expanded?: boolean;
          progress?: number;
          durationMs?: number;
          primaryAction?: DynamicIslandAction;
          secondaryAction?: DynamicIslandAction;
        },
    subtitle?: string,
    type?: DynamicIslandType,
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

  withdrawMoney: (params: {
    method: 'atm' | 'bank';
    amount: number;
    currency: CurrencyCode;
    bankName?: string;
    accountNumber?: string;
    recipientName?: string;
    description?: string;
  }) => Promise<{ success: boolean; cashCode?: string; transaction?: TransactionRecord; error?: string }>;

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
  const [isAuthenticated, setAuthenticatedState] = useState<boolean>(false);
  const authRevision = useRef(0);
  const setIsAuthenticated = (authenticated: boolean) => {
    authRevision.current += 1;
    setAuthenticatedState(authenticated);
  };
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

  // Subtab navigation for Bills
  const [billsActiveTab, setBillsActiveTab] = useState<'airtime' | 'data' | 'electricity' | 'cable' | 'internet'>('airtime');

  // Customer Support Tickets
  const [supportTickets] = useState<SupportTicketItem[]>([
    {
      id: 'TICK-8092',
      subject: 'Virtual Card Foreign Currency Limit Extension',
      category: 'card',
      priority: 'medium',
      status: 'IN_REVIEW',
      createdAt: 'Today, 14:22',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          senderName: 'Ruthie Adebayo',
          text: 'Hello, I need to raise my USD card monthly limit for international software subscriptions.',
          timestamp: '14:22',
        },
        {
          id: 'm2',
          sender: 'agent',
          senderName: 'Chiamaka (Ruthie Concierge)',
          text: 'Greetings Ruthie. Your Tier 3 status qualifies you for an instant increase up to $25,000/month. Our compliance desk is finalizing the approval.',
          timestamp: '14:25',
        },
      ],
    },
    {
      id: 'TICK-7934',
      subject: 'Eurobond Coupon Payment Schedule Confirmation',
      category: 'general',
      priority: 'low',
      status: 'RESOLVED',
      createdAt: 'Yesterday, 10:15',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          senderName: 'Ruthie Adebayo',
          text: 'Please confirm when the next 9.85% FRN Eurobond coupon distribution settles.',
          timestamp: '10:15',
        },
        {
          id: 'm2',
          sender: 'agent',
          senderName: 'Emeka (Securities Desk)',
          text: 'The coupon pays semiannually on June 15 and December 15 directly to your USD wallet.',
          timestamp: '10:18',
        },
      ],
    },
  ]);

  // Executive Admin Mock Data
  const [adminUsers, setAdminUsers] = useState([
    {
      id: 'usr_1',
      name: 'Ruthie Adebayo',
      email: 'ruthie.adebayo@ruthiebank.com',
      phone: '+234 812 345 6789',
      tier: 3,
      status: 'ACTIVE' as const,
      balance: '₦8,245,950.00',
      kycVerified: true,
      joinedDate: '12 Jan 2026',
    },
    {
      id: 'usr_2',
      name: 'Amina Yusuf',
      email: 'amina.yusuf@acme.ng',
      phone: '+234 803 111 2233',
      tier: 2,
      status: 'ACTIVE' as const,
      balance: '₦1,420,000.00',
      kycVerified: true,
      joinedDate: '04 Mar 2026',
    },
    {
      id: 'usr_3',
      name: 'Chukwuma Eze',
      email: 'chukwuma.eze@techcorp.io',
      phone: '+234 809 998 7766',
      tier: 1,
      status: 'ACTIVE' as const,
      balance: '₦320,500.00',
      kycVerified: false,
      joinedDate: '15 May 2026',
    },
    {
      id: 'usr_4',
      name: 'Damilola Adeleke',
      email: 'dami.adeleke@lagosfin.com',
      phone: '+234 701 555 4433',
      tier: 2,
      status: 'ACTIVE' as const,
      balance: '₦4,850,000.00',
      kycVerified: true,
      joinedDate: '22 Aug 2026',
    },
    {
      id: 'usr_5',
      name: 'Kelechi Nwosu',
      email: 'k.nwosu@horizon.ng',
      phone: '+234 818 222 9900',
      tier: 1,
      status: 'LOCKED' as const,
      balance: '₦15,000.00',
      kycVerified: false,
      joinedDate: '01 Nov 2026',
    },
  ]);

  // Dynamic Island
  const [dynamicIsland, setDynamicIsland] = useState<DynamicIslandState>({
    active: false,
    title: '',
    type: 'success',
  });

  // AI Chat Messages
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: "ai_unavailable",
      sender: "assistant",
      content: "Ruthie AI is not connected. It cannot access account data, verify payments, or make recommendations.",
      timestamp: "Now",
    },
  ]);  const [isAITyping, setIsAITyping] = useState<boolean>(false);

  // Synchronize theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const revision = authRevision.current;
    let active = true;

    fetch('/api/auth/session', { cache: 'no-store' })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || authRevision.current !== revision) return;
        if (data?.user) {
          setUser((current) => ({ ...current, ...data.user }));
          setAuthenticatedState(true);
        } else {
          setAuthenticatedState(false);
        }
      })
      .catch(() => {
        if (active && authRevision.current === revision) setAuthenticatedState(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
    titleOrPayload:
      | string
      | {
          title: string;
          subtitle?: string;
          type?: DynamicIslandType;
          amount?: string;
          reference?: string;
          expanded?: boolean;
          progress?: number;
          durationMs?: number;
          primaryAction?: DynamicIslandAction;
          secondaryAction?: DynamicIslandAction;
        },
    subtitle?: string,
    type: DynamicIslandType = 'success',
    durationMs: number = 4500
  ) => {
    let newState: DynamicIslandState;
    let timer = durationMs;

    if (typeof titleOrPayload === 'object') {
      newState = {
        active: true,
        title: titleOrPayload.title,
        subtitle: titleOrPayload.subtitle,
        type: titleOrPayload.type || 'success',
        amount: titleOrPayload.amount,
        reference: titleOrPayload.reference,
        expanded: titleOrPayload.expanded,
        progress: titleOrPayload.progress,
        primaryAction: titleOrPayload.primaryAction,
        secondaryAction: titleOrPayload.secondaryAction,
      };
      if (titleOrPayload.durationMs) timer = titleOrPayload.durationMs;
    } else {
      newState = {
        active: true,
        title: titleOrPayload,
        subtitle,
        type,
        expanded: false,
      };
    }

    setDynamicIsland(newState);
    playHaptic(newState.type === 'security' ? 'warning' : 'success');

    setTimeout(() => {
      setDynamicIsland((prev) => ({ ...prev, active: false }));
    }, timer);
  };

  const dismissDynamicIsland = () => {
    setDynamicIsland((prev) => ({ ...prev, active: false }));
  };

  const showUnavailableOperation = (operation: string) => {
    showDynamicIsland({
      title: `${operation} unavailable`,
      subtitle: 'Sandbox preview only. No provider is connected and no changes were made.',
      type: 'security',
      durationMs: 6000,
    });
  };

  // Money Movement: Withdrawal (ATM Cardless or Bank Wire Cash Out)
  const withdrawMoney: BankContextType["withdrawMoney"] = async (_params) => {
    showUnavailableOperation("Withdrawal");
    return { success: false, error: "FINANCIAL_OPERATIONS_UNAVAILABLE" };
  };
  // Support Ticket Actions
  const createSupportTicket: BankContextType['createSupportTicket'] = (_params) => {
    showUnavailableOperation('Support request');
  };

  const sendTicketReply: BankContextType['sendTicketReply'] = (_ticketId, text) => {
    if (text.trim()) showUnavailableOperation('Support reply');
  };

  // Admin Actions
  const adminUpdateUserStatus: BankContextType["adminUpdateUserStatus"] = (_userId, _status) => {
    showUnavailableOperation("Administrator action");
  };

  const adminApproveKyc: BankContextType["adminApproveKyc"] = (_userId, _tier) => {
    showUnavailableOperation("KYC review");
  };
  // Money Movement: Transfer
  const transferMoney: BankContextType["transferMoney"] = async (_params) => {
    showUnavailableOperation("Transfer");
    return { success: false, error: "FINANCIAL_OPERATIONS_UNAVAILABLE" };
  };
  // Currency Conversion
  const convertCurrency: BankContextType["convertCurrency"] = async (_params) => {
    showUnavailableOperation("Currency conversion");
    return { success: false, error: "FINANCIAL_OPERATIONS_UNAVAILABLE" };
  };
  // Pay Utility Bill or Airtime
  const payBillOrAirtime: BankContextType["payBillOrAirtime"] = async (_params) => {
    showUnavailableOperation("Bill payment");
    return { success: false };
  };
  // Savings Goal creation & deposit
  const createSavingsGoal: BankContextType["createSavingsGoal"] = (_goal) => {
    showUnavailableOperation("Savings goal");
  };

  const depositToSavings: BankContextType["depositToSavings"] = (_goalId, _amount) => {
    showUnavailableOperation("Savings deposit");
  };
  // Investment
  const investInProduct: BankContextType["investInProduct"] = (_productId, _units) => {
    showUnavailableOperation("Investment purchase");
  };
  // Loan Repayment
  const repayActiveLoan: BankContextType["repayActiveLoan"] = (_amount) => {
    showUnavailableOperation("Loan repayment");
  };

  const applyForLoan: BankContextType["applyForLoan"] = (_amount, _tenureMonths, _purpose) => {
    showUnavailableOperation("Loan application");
  };
  // Lifestyle Booking
  const bookService: BankContextType["bookService"] = (_item) => {
    showUnavailableOperation("Booking");
  };
  // Ruthie AI Financial Intelligence responder
  const sendAIMessage: BankContextType["sendAIMessage"] = (text) => {
    const normalized = text.trim();
    if (!normalized) return;

    const now = new Date().toLocaleTimeString();
    setAiMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), sender: "user", content: normalized, timestamp: now },
      {
        id: crypto.randomUUID(),
        sender: "assistant",
        content: "Ruthie AI is not connected. It cannot access account data, verify payments, or make recommendations. Check verified transaction records or contact customer support.",
        timestamp: now,
      },
    ]);
    setIsAITyping(false);
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
        billsActiveTab,
        setBillsActiveTab,
        supportTickets,
        createSupportTicket,
        sendTicketReply,
        adminUsers,
        adminUpdateUserStatus,
        adminApproveKyc,
        dynamicIsland,
        showDynamicIsland,
        dismissDynamicIsland,
        activeReceipt,
        setActiveReceipt,
        transferMoney,
        withdrawMoney,
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
