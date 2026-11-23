import type { LedgerCurrency } from "@/lib/money";

export type JournalLine = {
  side: "DEBIT" | "CREDIT";
  currency: LedgerCurrency;
  amountMinor: bigint;
};

/** Validate an in-memory journal before a database posting transaction. */
export function assertBalancedJournal(lines: readonly JournalLine[]) {
  if (lines.length < 2) throw new Error("A journal needs at least two entries.");

  const totals = new Map<LedgerCurrency, { debit: bigint; credit: bigint }>();
  for (const line of lines) {
    if (line.amountMinor <= 0n) throw new Error("Journal entry amounts must be positive.");
    const total = totals.get(line.currency) ?? { debit: 0n, credit: 0n };
    total[line.side === "DEBIT" ? "debit" : "credit"] += line.amountMinor;
    totals.set(line.currency, total);
  }

  for (const [currency, total] of totals) {
    if (total.debit !== total.credit) {
      throw new Error(`Journal is not balanced in ${currency}.`);
    }
  }
}
