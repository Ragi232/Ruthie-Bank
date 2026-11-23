import type { LedgerCurrency } from "@/lib/money";

export type ProviderMoney = {
  currency: LedgerCurrency;
  amountMinor: bigint;
};

export type ProviderUnavailable = {
  status: "UNAVAILABLE";
  provider: string;
  message: string;
};

export type PaymentProvider = {
  readonly id: string;
  readonly available: boolean;
  createCollectionIntent(input: { reference: string; amount: ProviderMoney; customerEmail: string }): Promise<ProviderUnavailable>;
  initiatePayout(input: { reference: string; amount: ProviderMoney; destination: Record<string, string> }): Promise<ProviderUnavailable>;
  verifyPayment(reference: string): Promise<ProviderUnavailable>;
  getPayoutStatus(reference: string): Promise<ProviderUnavailable>;
  refund(input: { reference: string; amount?: ProviderMoney }): Promise<ProviderUnavailable>;
  verifyWebhook(rawBody: Uint8Array, headers: Headers): Promise<{ valid: false; reason: "PROVIDER_NOT_CONFIGURED" }>;
};
