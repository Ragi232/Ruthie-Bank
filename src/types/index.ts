export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'EUR' | 'CAD' | 'GHS' | 'KES';

export type ScreenType =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'dashboard'
  | 'wallets'
  | 'transfers'
  | 'withdrawals'
  | 'savings'
  | 'investments'
  | 'loans'
  | 'bills'
  | 'bookings'
  | 'ai'
  | 'history'
  | 'notifications'
  | 'profile'
  | 'support'
  | 'admin';

export type AuthSubView =
  | 'login'
  | 'signup'
  | 'pin'
  | 'otp'
  | '2fa'
  | 'biometric'
  | 'forgot-password'
  | 'reset-password'
  | 'device-verify';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountNumber: string;
  tag: string;
  avatarUrl?: string;
  tier: 1 | 2 | 3;
  bvnVerified: boolean;
  ninVerified: boolean;
  addressVerified: boolean;
  biometricsEnabled: boolean;
  twoFactorEnabled: boolean;
  defaultCurrency: CurrencyCode;
  language: string;
  theme: 'dark' | 'light';
}

export interface WalletBalance {
  currency: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  balance: number;
  availableBalance: number;
  ledgerBalance: number;
  rateToNgn: number;
  accountNumber?: string;
  iban?: string;
  routingNo?: string;
  sortCode?: string;
  bicSwift?: string;
}

export type TransactionType =
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN'
  | 'WITHDRAWAL'
  | 'EXCHANGE'
  | 'BILL_PAYMENT'
  | 'AIRTIME'
  | 'SAVINGS_DEPOSIT'
  | 'SAVINGS_WITHDRAWAL'
  | 'INVESTMENT_PURCHASE'
  | 'LOAN_DISBURSEMENT'
  | 'LOAN_REPAYMENT'
  | 'BOOKING';

export type TransactionStatus = 'SUCCEEDED' | 'PENDING' | 'FAILED' | 'REVERSED' | 'PREVIEW';

export interface TransactionRecord {
  id: string;
  reference: string;
  idempotencyKey: string;
  type: TransactionType;
  title: string;
  description: string;
  recipientOrSender: string;
  amount: number;
  fee: number;
  currency: CurrencyCode;
  timestamp: string;
  status: TransactionStatus;
  category: 'transfer' | 'bills' | 'savings' | 'investment' | 'lifestyle' | 'fx';
  metadata?: Record<string, any>;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  tag?: string;
  avatarInitials: string;
  isRuthieTag?: boolean;
  recent: boolean;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: CurrencyCode;
  category: 'vault' | 'target' | 'flexi';
  interestRate: number; // APY e.g. 16.5%
  maturityDate: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  autoSaveAmount?: number;
  status: 'ACTIVE' | 'MATURED' | 'CLOSED';
  colorGradient: [string, string];
}

export interface InvestmentProduct {
  id: string;
  name: string;
  issuer: string;
  category: 'treasury' | 'eurobond' | 'equity' | 'agriculture' | 'mutual_fund';
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  projectedReturn: number; // e.g. 18.5%
  tenureDays: number;
  minInvestment: number;
  currency: CurrencyCode;
  pricePerUnit: number;
  totalVolume: string;
  availableUnits: number;
  description: string;
}

export interface UserInvestment {
  id: string;
  productId: string;
  productName: string;
  units: number;
  investedAmount: number;
  currentValue: number;
  accruedReturn: number;
  currency: CurrencyCode;
  startDate: string;
  maturityDate: string;
  status: 'ACTIVE' | 'MATURED';
}

export interface LoanEligibility {
  creditScore: number;
  maxAmount: number;
  currentActiveLoan?: {
    id: string;
    principal: number;
    interestRate: number;
    amountDue: number;
    repaidAmount: number;
    nextDueDate: string;
    durationMonths: number;
    monthlyInstallment: number;
    status: 'ACTIVE' | 'REPAID' | 'DEFAULTED';
  };
}

export interface UtilityProvider {
  id: string;
  name: string;
  category: 'telco' | 'electricity' | 'cable' | 'internet' | 'water' | 'education';
  logoPlaceholder: string;
  brandColor: string;
  plans?: { id: string; name: string; amount: number; description: string }[];
}

export interface BookingItem {
  id: string;
  category: 'flight' | 'hotel' | 'transport' | 'event' | 'movie' | 'subscription' | 'giftcard';
  title: string;
  subtitle: string;
  badge?: string;
  price: number;
  currency: CurrencyCode;
  rating?: number;
  imageUrl?: string;
  details?: Record<string, string>;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  actionLink?: { label: string; screen: ScreenType; payload?: any };
  dataCard?: {
    type: 'spending' | 'projection' | 'rate' | 'tip';
    title: string;
    value?: string;
    details?: string[];
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'security' | 'transaction' | 'fx' | 'savings' | 'promo';
}

export interface DeviceInfo {
  id: string;
  deviceName: string;
  os: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export type DynamicIslandType =
  | 'incoming'
  | 'outgoing'
  | 'status'
  | 'security'
  | 'savings'
  | 'investment'
  | 'ai'
  | 'success';

export interface DynamicIslandAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface DynamicIslandState {
  active: boolean;
  title: string;
  subtitle?: string;
  type: DynamicIslandType;
  expanded?: boolean;
  progress?: number; // 0 - 100 for live transaction status
  amount?: string;
  reference?: string;
  category?: string;
  primaryAction?: DynamicIslandAction;
  secondaryAction?: DynamicIslandAction;
  autoDismissMs?: number;
}

export interface SupportTicketItem {
  id: string;
  subject: string;
  category: 'dispute' | 'card' | 'transfer' | 'kyc' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  createdAt: string;
  messages: {
    id: string;
    sender: 'user' | 'agent';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}
