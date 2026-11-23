import { describe, expect, it } from "vitest";
import { assertBalancedJournal } from "@/lib/ledger";
import { formatMinorUnits, parseAmountToMinorUnits } from "@/lib/money";

describe("exact minor-unit amounts", () => {
  it("parses decimal strings without floating-point arithmetic", () => {
    expect(parseAmountToMinorUnits("100.05", "NGN")).toBe(10005n);
    expect(parseAmountToMinorUnits("0.10", "USD")).toBe(10n);
  });

  it("formats large amounts and zero-decimal currencies exactly", () => {
    expect(formatMinorUnits(123456789n, "NGN")).toBe("1,234,567.89");
    expect(parseAmountToMinorUnits("12000", "XAF")).toBe(12000n);
    expect(formatMinorUnits(12000n, "XAF")).toBe("12,000");
  });

  it("rejects zero, negative, malformed, over-precision, and overlong amounts", () => {
    for (const amount of ["0", "-1", "1e3", "1.001", "1234567890123456789"]) {
      expect(() => parseAmountToMinorUnits(amount, "NGN")).toThrow();
    }
    expect(() => parseAmountToMinorUnits("1.1", "XAF")).toThrow();
  });
});

describe("balanced journal validation", () => {
  it("accepts balanced debits and credits per currency", () => {
    expect(() => assertBalancedJournal([
      { side: "DEBIT", currency: "NGN", amountMinor: 10000n },
      { side: "CREDIT", currency: "NGN", amountMinor: 10000n },
    ])).not.toThrow();
  });

  it("rejects imbalance, a single line, and nonpositive entries", () => {
    expect(() => assertBalancedJournal([
      { side: "DEBIT", currency: "NGN", amountMinor: 10000n },
      { side: "CREDIT", currency: "NGN", amountMinor: 9999n },
    ])).toThrow(/not balanced/);
    expect(() => assertBalancedJournal([{ side: "DEBIT", currency: "NGN", amountMinor: 1n }])).toThrow(/at least two/);
    expect(() => assertBalancedJournal([
      { side: "DEBIT", currency: "NGN", amountMinor: 0n },
      { side: "CREDIT", currency: "NGN", amountMinor: 0n },
    ])).toThrow(/positive/);
  });

  it("does not net imbalances across currencies", () => {
    expect(() => assertBalancedJournal([
      { side: "DEBIT", currency: "NGN", amountMinor: 100n },
      { side: "CREDIT", currency: "USD", amountMinor: 100n },
    ])).toThrow();
  });
});
