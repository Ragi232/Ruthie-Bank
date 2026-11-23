export type LedgerCurrency =
  | "NGN" | "USD" | "GBP" | "EUR" | "CAD"
  | "GHS" | "KES" | "ZAR" | "AED" | "XAF";

const minorUnits: Record<LedgerCurrency, number> = {
  NGN: 2,
  USD: 2,
  GBP: 2,
  EUR: 2,
  CAD: 2,
  GHS: 2,
  KES: 2,
  ZAR: 2,
  AED: 2,
  XAF: 0,
};

/** Parse a positive major-unit string exactly, without converting through Number. */
export function parseAmountToMinorUnits(value: string, currency: LedgerCurrency): bigint {
  const normalized = value.trim();
  if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(normalized)) {
    throw new Error("Amount must be a positive decimal string.");
  }

  const [whole, fraction = ""] = normalized.split(".");
  const precision = minorUnits[currency];
  if (whole.length > 18 || fraction.length > precision) {
    throw new Error(`Amount has too many digits for ${currency}.`);
  }

  const unit = 10n ** BigInt(precision);
  const fractionalMinor = precision === 0
    ? 0n
    : BigInt(fraction.padEnd(precision, "0") || "0");
  const result = BigInt(whole) * unit + fractionalMinor;
  if (result <= 0n) throw new Error("Amount must be greater than zero.");
  return result;
}

export function formatMinorUnits(amount: bigint, currency: LedgerCurrency): string {
  const precision = minorUnits[currency];
  const unit = 10n ** BigInt(precision);
  const negative = amount < 0n;
  const absolute = negative ? -amount : amount;
  const whole = (absolute / unit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (precision === 0) return `${negative ? "-" : ""}${whole}`;

  const fraction = (absolute % unit).toString().padStart(precision, "0");
  return `${negative ? "-" : ""}${whole}.${fraction}`;
}
