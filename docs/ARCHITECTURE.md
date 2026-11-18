# Architecture and phased delivery

## System shape

```text
Browser (Next.js UI)
  -> server route handlers (authentication, authorization, Zod validation)
  -> domain services (ledger, limits, risk, idempotency)
  -> provider ports (payments, KYC, OTP, FX, utilities; sandbox until configured)
  -> PostgreSQL / Prisma
  -> Redis queue (planned for async callbacks, notifications, scheduled jobs)
```

Route handlers must remain thin. Domain services own business rules. Provider results are untrusted inputs and must be authenticated, validated, and reconciled before posting ledger entries. Any operation that changes money uses a database transaction, idempotency key, row-level concurrency control, and balanced debit/credit entries. Corrections use compensating entries; posted entries are never edited or deleted.

## Initial domain boundaries

- Identity: users, verified contact channels, devices, authentication factors, sessions, OTP challenges, KYC cases.
- Money: accounts, currency wallets, transactions, ledger entries, limits, beneficiaries, reconciliation records.
- Product: savings plans, investment orders/positions, loans/repayments, utility purchases, bookings.
- Operations: provider configuration, risk alerts, admin assignments, audit logs, notifications, support tickets.

The first Prisma schema provides the durable core only. Add migrations incrementally as each product phase is implemented. Financial amounts use PostgreSQL `Decimal`; never use floating point for money.

## Phases

1. Architecture and project foundation — **complete**.
2. Branding and responsive frontend — **complete for the dashboard preview** (custom mark, responsive navigation, theme toggle, loading shell); authenticated onboarding screens added in Phase 3.
3. Authentication and security — **foundation complete** (scrypt password hashes, database-backed sessions and auth throttling, email challenge and reset flows); OTP delivery and passkey/TOTP factors pending.
4. Database and ledger — core schema started; posting/reconciliation pending.
5. Wallet and multi-currency — pending; no rates are fabricated.
6–12. Savings, investments, loans, payments, lifestyle, assistant, admin, provider integrations — pending.
13. Tests and quality assurance — pending.
14. Security review and deployment preparation — pending.

## Runtime modes

`APP_ENV=sandbox` is the default. In sandbox mode all financial provider operations must be unavailable or explicitly labeled simulated. Production mode is not a switch that makes integrations safe: require provider credentials, verified webhook signatures, product/legal approval, operational monitoring, and compliance sign-off before enabling a capability.
