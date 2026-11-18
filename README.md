# Ruthie Bank

**Your Money. Your World. Your Future.**

Ruthie Bank is being developed as a secure, multi-currency financial platform. This repository currently contains the Phase 1 foundation and a sandbox dashboard preview. It does not provide live banking, payment, investment, lending, or FX services.

## Architecture

- **Web:** Next.js App Router, React, TypeScript, Tailwind CSS.
- **API:** Next.js route handlers with Zod request validation; provider adapters will be isolated behind server-only interfaces.
- **Data:** PostgreSQL through Prisma. Financial balances are derived from immutable double-entry ledger entries, never frontend arithmetic.
- **Security:** password hashes only, short-lived verified challenges, WebAuthn credentials (public keys only), role-based authorization, and append-only audit events. Raw biometrics are never collected or stored.
- **Async work:** add Redis and a durable queue when provider callbacks, notifications, and scheduled work are introduced.
- **External services:** sandbox adapters only until licensed providers and credentials are configured.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/SECURITY.md](docs/SECURITY.md), and [docs/PROVIDERS.md](docs/PROVIDERS.md).

## Local setup

Requirements: Node.js 20+, npm, and PostgreSQL 15+.

1. `cp .env.example .env`, set `DATABASE_URL`, and set `AUTH_SECRET` to `openssl rand -hex 32` output.
2. `npm install`
3. `npm run db:generate`
4. `npm run db:migrate`
5. `npm run dev`

Open `http://localhost:3000`. `/api/health` reports service mode. Keep `APP_ENV=sandbox` during development. No provider keys are supplied. OTP delivery is not connected; for isolated local development only, set `EXPOSE_DEV_OTP=true` to display generated test codes. Never enable this for shared or production environments.

## Current scope

- **Complete:** Phase 1 architecture foundation; Phase 2 Ruthie brand mark, responsive dashboard, mobile navigation, persistent theme toggle, loading shell; Phase 3 registration, scrypt password hashing, database-backed HTTP-only sessions, email verification and password-reset OTP challenge handling, database-backed auth throttling, and auth screens; core relational model and sandbox docs.
- **Remaining:** OTP delivery provider, passkeys/TOTP and transaction PIN, complete security controls, ledger posting and reconciliation, provider-backed FX/payments, savings, investments, loans, bills/airtime/bookings, AI assistant, support workflows, admin authorization/console, OpenAPI, automated tests, deployment hardening.

## Important operating boundary

This is not a licensed bank and this development preview must not be used to accept deposits, hold customer funds, execute transfers, offer credit, or sell investments. Those capabilities require appropriate CBN authorization, licensed partners, compliance review, and provider integration. Do not display fabricated exchange rates or mark a provider operation successful without verified provider evidence.
