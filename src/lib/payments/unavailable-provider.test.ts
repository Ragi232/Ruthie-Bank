import { describe, expect, it } from "vitest";
import { getPaymentProvider } from "@/lib/payments/unavailable-provider";

describe("unconfigured payment provider", () => {
  it("fails closed for collection, payout, verification, status, and refund operations", async () => {
    const provider = getPaymentProvider();
    const amount = { currency: "NGN" as const, amountMinor: 10000n };
    const results = await Promise.all([
      provider.createCollectionIntent({ reference: "test-ref", amount, customerEmail: "test@example.com" }),
      provider.initiatePayout({ reference: "test-ref", amount, destination: {} }),
      provider.verifyPayment("test-ref"),
      provider.getPayoutStatus("test-ref"),
      provider.refund({ reference: "test-ref", amount }),
    ]);

    expect(provider.available).toBe(false);
    expect(results.every((result) => result.status === "UNAVAILABLE")).toBe(true);
  });

  it("rejects webhooks until an approved adapter is configured", async () => {
    const provider = getPaymentProvider();
    await expect(provider.verifyWebhook(new Uint8Array(), new Headers())).resolves.toEqual({
      valid: false,
      reason: "PROVIDER_NOT_CONFIGURED",
    });
  });
});
