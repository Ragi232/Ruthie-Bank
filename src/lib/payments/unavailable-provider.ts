import type { PaymentProvider, ProviderUnavailable } from "@/lib/payments/types";

const unavailable: ProviderUnavailable = {
  status: "UNAVAILABLE",
  provider: "unconfigured",
  message: "No approved payment provider is configured.",
};

/** Fail-closed adapter used until provider onboarding and credentials exist. */
export const unavailablePaymentProvider: PaymentProvider = {
  id: "unconfigured",
  available: false,
  async createCollectionIntent() { return unavailable; },
  async initiatePayout() { return unavailable; },
  async verifyPayment() { return unavailable; },
  async getPayoutStatus() { return unavailable; },
  async refund() { return unavailable; },
  async verifyWebhook() { return { valid: false, reason: "PROVIDER_NOT_CONFIGURED" }; },
};

/** No environment variable can enable a provider before a real adapter is reviewed. */
export function getPaymentProvider(): PaymentProvider {
  return unavailablePaymentProvider;
}
