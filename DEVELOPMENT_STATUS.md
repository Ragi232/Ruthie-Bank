# Ruthie Bank Development Status

Updated: 2026-11-20

## Release assessment

**Not production-ready. No live-money functionality is implemented or enabled.** This repository is a Next.js application with a sandbox UI, authentication foundation, and an early Prisma data model. The UI contains sample customer, balance, transaction, rate, savings, investment, loan, support, and admin data. These values are not account records or offers.

This status is based on a static repository audit. Node.js, npm, and Git are not available in the current shell, and no PostgreSQL connection is configured here. Runtime, migration, build, lint, and test behavior therefore remain unverified in this environment.

## Repository and stack audit

- 82 repository files were inventoried. The source is a single Next.js 15 App Router application; there is no separate NestJS/FastAPI service.
- `package.json` declares React 19, TypeScript 5.8, Tailwind CSS 4, Prisma 6, PostgreSQL, and Vitest 5. Dependencies are locked in `package-lock.json`.
- Scripts declared: `dev`, `build`, `start`, `lint` (`next lint`), `db:generate`, `db:migrate` (`prisma migrate dev`), `db:studio`, and `test` (`vitest run`). Script behavior was not executed.
- No `prisma/migrations` directory or initial migration is present. `prisma migrate deploy` has no checked-in migration history to deploy.
- Tests present: `src/lib/auth.test.ts`, `src/lib/otp.test.ts`, and `src/lib/auth.integration.test.ts`.
- API routes present: health; registration, login, logout, session, email verification, password reset request, and password reset completion. There are no customer, wallet, ledger, transaction, transfer, payment, KYC, notification, support, AI, or admin API routes.

## Verified code functionality

### Authentication foundation

- Registration validates a Nigerian phone number and password, stores a scrypt password hash, and creates a pending user.
- Email verification and password reset use six-digit, purpose-scoped HMAC hashes, ten-minute expiry, and a five-attempt limit. OTP delivery is not configured; a code is returned only under the explicit local sandbox setting `EXPOSE_DEV_OTP=true`.
- Successful email verification changes the user to active and creates an account plus an NGN wallet in a Prisma transaction.
- Login checks account status, password, and verified email. Sessions use opaque random tokens; only SHA-256 token hashes are stored. Cookies are HTTP-only, SameSite Strict, and Secure when `NODE_ENV=production`; session lifetime is 12 hours.
- Logout revokes the current session. Password reset revokes all of the user's sessions.
- Authentication attempts are counted in hashed database buckets for a 15-minute window, with a limit of ten attempts per bucket.
- These are code-path findings, not runtime-confirmed behavior. Email/SMS delivery, MFA, WebAuthn enrollment and verification, transaction PIN verification, device/session management screens, and a standalone account-lockout workflow are absent.

### Data model

The Prisma schema defines users, sessions, OTP challenges, authentication factors, auth-rate-limit buckets, accounts, currency wallets, transactions, wallet ledger entries, devices, exchange-rate observations, audit logs, support tickets, and admin assignments.

The financial model is incomplete:

- `Transaction.amount` and ledger entry amounts are `Decimal(20,4)`, but no implemented service enforces currency minor-unit precision or balanced postings.
- Ledger entries can only point to a wallet; there is no general ledger-account chart for cash, settlement, fees, suspense, or provider clearing.
- There are no database checks requiring positive amounts, balanced debits/credits, immutable posted entries, valid state transitions, or a provider reference unique per provider.
- The transaction idempotency key is globally unique but has no operation/customer scope. No route uses it.
- Provider events, reconciliation records, KYC cases, risk alerts, transaction limits, savings products, investments, loans, beneficiaries, and consent records are not modeled.
- There are no migration files, and schema changes have not been generated or applied.

## Frontend and product audit

- `BankContext.tsx` initializes customer data from `src/lib/mock-data.ts`; it does not load balances or transactions from an API.
- Transfers, withdrawals, conversions, bills, savings deposits, investment purchases, loan repayments/disbursements, and bookings mutate React state and construct local transactions marked `SUCCEEDED`. They do not call the server or a provider.
- The context also contains simulated support replies, administrator actions, and Ruthie AI answers. The admin dashboard has static metrics and customers, and has no server-side role enforcement.
- Screens include dashboard, wallets, transfers, withdrawals, savings, investments, loans, bills, bookings, AI, history, notifications, profile, support, and admin. Most banking screens are UI prototypes, not implemented backend features.
- Specific balances, beneficiaries, account requisites, FX rates, transaction outcomes, savings yields, investment returns, loan eligibility, insurance/NDIC statements, support answers, and admin statistics are sample or unsupported claims. They must not be presented as live facts or used for customer decisions.
- Receipts and transaction history are derived from local sample state; they are not proof of payment or ledger records.

## Security findings

- The existing auth code uses a configured scrypt work factor and timing-safe hash comparison. Production parameters still need deployment-hardware review.
- OTP issuance is not connected to an email/SMS provider. Registration and challenge creation are separate writes, so a challenge-creation failure can leave an unusable pending account.
- Rate limiting depends on forwarded-IP headers and requires a trusted reverse proxy that overwrites client-supplied values. There is no cleanup job for old buckets.
- There is no explicit Origin validation for cookie-authenticated POST routes. SameSite Strict helps but is not the only CSRF control expected for production.
- The root client context starts as authenticated and the auth UI contains sandbox/network fallbacks and client-only PIN/passkey completion paths. These are not server authorization and must fail closed.
- No financial or admin operation is authorized or enforced server-side because those APIs do not exist.
- No security headers beyond disabling the powered-by header, centralized structured logging, error monitoring, secrets manager, or audit policy is configured.

## Integrations and compliance readiness

- No payment, banking, FX, OTP, email, KYC, utility, AI, investment, loan, or booking provider adapter is connected. `.env.example` contains empty placeholder credentials only.
- No provider credentials, merchant onboarding, licensed banking partner, regulatory authorization, or compliance approval is available in the repository.
- A current Paystack and Flutterwave comparison is recorded in [Provider evaluation](docs/PROVIDER_EVALUATION.md). It is research only and does not select or enable a provider.
- KYC, AML/risk review, account restriction, consent, retention, admin review, and support workflows are not implemented as server-side workflows. Existing screens do not establish regulatory compliance.
- Ruthie AI has no server AI service or authorized account-data retrieval. The current mock replies invent financial facts and must not be treated as advice or customer data.

## Testing status

- Declared tests: 10 cases (8 unit/mock cases and 2 PostgreSQL integration cases gated by `AUTH_TEST_DATABASE_URL`).
- The integration suite requires a dedicated disposable PostgreSQL database and performs user/challenge/session writes.
- No ledger, transfer, payment, webhook, idempotency, concurrency, API authorization, KYC, admin, AI privacy, or end-to-end tests exist.
- `npm ci`, Prisma generation, TypeScript, tests, build, and lint have not run because Node/npm are unavailable and there is no database configuration. Do not interpret this as a pass.

## Deployment requirements and remaining work

1. Install a supported Node.js/npm toolchain and PostgreSQL; provision a dedicated test database.
2. Add and review an initial migration and migration deployment/rollback procedure; test backups and restore.
3. Add server-side authorization and Origin/CSRF protections; remove client-only auth fallbacks; connect OTP delivery and implement session/device, MFA, and PIN flows.
4. Replace the partial wallet-only entries with a balanced, immutable double-entry ledger using minor units or strictly validated decimals, transactional posting, idempotency scope, concurrency control, compensating reversals, and reconciliation.
5. Implement customer-owned account APIs and provider-independent payment ports, then add a sandbox adapter only after onboarding. Verify provider transactions and signatures before any ledger posting.
6. Implement server-enforced admin roles, audit logging, KYC/AML case review, limits, support, notifications, and safe AI account-data access.
7. Remove sample financial claims from customer screens or keep them clearly marked as non-live preview data. Do not expose fabricated rates, balances, approvals, yields, or insurance claims as real.
8. Configure deployment secrets (`DATABASE_URL`, strong `AUTH_SECRET`, `APP_ENV`, `NEXT_PUBLIC_APP_URL`), HTTPS, trusted proxy behavior, security headers, monitoring, log redaction, rate-limit retention, and operational alerts.
9. Run the requested install, generate, typecheck, test, build, and lint commands in a provisioned environment and record exact results.

## Readiness classification

- **Sandbox-ready:** visual preview and authentication code are present; runtime checks are pending. Provider operations are unavailable.
- **Production-ready:** no.
- **Live-money-ready:** no. No feature may accept deposits, hold funds, issue transfer instructions, execute payments, or represent transaction success.
