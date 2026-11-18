# Development status

Updated: 2026-11-18

## Release audit update

- Confirmed Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Prisma, and PostgreSQL schema. The app currently uses Next.js route handlers and client-side mock state; NestJS/FastAPI/Redis/mobile services are not present.
- Ruthie Island is mounted on authenticated app screens. It now remains visible when there is no active notification, identifies the sandbox state, expands/collapses accessibly, and respects the mobile safe area.
- Added a CSS fallback for browsers without backdrop-filter and global reduced-motion handling.
- `git diff --check` passed. Runtime/build/browser checks remain unavailable because Node.js, npm, PostgreSQL CLI, and Docker are absent.
- Financial workflows in `BankContext.tsx` remain client-side simulated state; they are not ledger-backed and must not be used for real funds. No live provider integrations are configured.
- Launch status: not production-ready. Resolve the fake financial workflows, server-side authorization/admin enforcement, database migrations/integration tests, and release verification before deployment.
- Dashboard now derives date and greeting from browser local time, updates each minute, and no longer shows hardcoded November 2026 values. Midnight falls into the evening greeting period.
- Removed fabricated dashboard FX quotes, portfolio return claims, AI-generated surplus advice, and fake investment FX aggregation. Savings and account labels now identify sample/demo data.

## Completed

- Complete Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS v4 banking application architecture.
- Full Liquid Glass design system with frosted glass surfaces (`.liquid-glass`), specular refraction highlights, midnight navy (`#03080e`), emerald green (`#10b981`), and champagne gold accents for both dark and light modes.
- **Interactive Ruthie Island Component (`DynamicIsland.tsx`)**:
  - Compact capsule and expanded interactive modes with spring drop-down animation.
  - Full support for 8 event types: Incoming payment, Outgoing transfer, Live transaction status with real-time settlement progress bar, Security alerts with emergency lock, Savings milestones, Investment allocations, Ruthie AI companion prompts, and Success ledger confirmations.
- **Complete Suite of 27 Application Screens**:
  1. Splash Screen (`SplashScreen.tsx`): Liquid glass logo orb, 0-100% enclave loader, NDIC insurance badges.
  2. Onboarding Screen (`OnboardingScreen.tsx`): 4-slide carousel with spatial spheres, pagination indicators, Skip and Continue flows.
  3. Registration Screen (`AuthScreen.tsx`): Nigerian phone validation, password strength requirements, direct `/api/auth/register` integration with dev fallback.
  4. Login Screen (`AuthScreen.tsx`): 256-bit TLS indicator, `/api/auth/login` integration, Face ID shortcut, password recovery link.
  5. OTP Verification Screen (`AuthScreen.tsx`): 6-digit segmented input, automated development code injection.
  6. Password and PIN Screens (`AuthScreen.tsx`, `ProfileSettingsScreen.tsx`): Interactive 6-digit glass keypad, password update modals.
  7. Biometric Authentication Screen (`AuthScreen.tsx`): Face ID hardware enclave scanning simulation with pulse halo.
  8. Main Dashboard (`DashboardScreen.tsx`): Multi-currency balance card with eye visibility toggle, Ruthie AI companion shortcut, 10 functioning quick actions, live institutional FX ticker, recent activity feed, savings progress ring, and cash flow chart.
  9. Wallets Screen (`WalletsScreen.tsx`): Dedicated cards for NGN, USD, GBP, EUR, CAD, GHS, KES.
  10. Multi-Currency Banking (`WalletsScreen.tsx`): Dedicated local and international wire requisites (US Routing, UK Sort Code, European IBAN).
  11. Transfers Screen (`TransfersScreen.tsx`): Bank transfers, Ruthie @tag instant transfers, international wires, beneficiary quick-pick, account name auto-resolution, review modal, and PIN authorization keypad.
  12. Withdrawals Screen (`WithdrawalsScreen.tsx`): ATM cardless cash out with 8-digit OTP cash code generator, 15-minute live expiration countdown timer, touchless ATM QR scanner, external bank wire cash-out, and daily limit tracking.
  13. Savings Screen (`SavingsScreen.tsx`): Ruthie Vault at 18.5% APY, active goal cards, progress rings, goal creation modal, and deposit funding modal.
  14. Investments Screen (`InvestmentsScreen.tsx`): Capital markets portfolio summary, risk badges (low sovereign, moderate, high growth), product catalog (FGN Eurobonds, T-Bills, Tech Titans equity), and unit purchase modal.
  15. Loans Screen (`LoansScreen.tsx`): Credit score gauge (785/850 prime), active loan repayment widget, loan calculator with duration/amount sliders, and instant credit disbursement.
  16. Airtime Screen (`BillsScreen.tsx`): Airtime recharge across MTN, Airtel, Glo, and 9mobile with denomination chips.
  17. Data Screen (`BillsScreen.tsx`): Data bundle selection across Nigerian telcos.
  18. Bills and Utilities Screen (`BillsScreen.tsx`): Prepaid electricity token generator for IKEDC/EKEDC/etc., with token display and copy.
  19. Subscriptions Screen (`BookingsScreen.tsx`): Digital entertainment & streaming subscriptions management (Netflix, Spotify, Starlink).
  20. Bookings Screen (`BookingsScreen.tsx`): Flights, luxury hotels, tech conference tickets, and concierge reservation checkout.
  21. Ruthie AI Screen (`RuthieAIScreen.tsx`): Apple Intelligence gradient glow header, chat stream, financial diagnostics data cards, prompt suggestions, and real-time response simulation.
  22. Transaction History Screen (`TransactionHistoryScreen.tsx`): Full ledger search, filter tabs (All, Inflow, Outflow, Pending), and statement export.
  23. Transaction Receipts (`TransactionReceiptModal.tsx`): Official electronic proof of payment, reference copy with toast, PDF download simulation, and Web Share API integration.
  24. Notifications Screen (`NotificationsScreen.tsx`): Full activity center with category filters, unread badge counters, mark-all-read, and deep links.
  25. Profile and Settings Screen (`ProfileSettingsScreen.tsx`): KYC verification tier status, biometric toggles, authorized devices manager with session revocation, and theme switcher.
  26. Customer Support Screen (`SupportScreen.tsx`): 24/7 VIP Concierge live chat simulation, ticket tracking with thread replies, new ticket modal, FAQ accordion, and emergency account freeze.
  27. Admin Dashboard (`AdminDashboardScreen.tsx`): Executive operations cockpit, key metrics (Total Deposits, 24h Cleared Volume, Active Profiles, AML Shield), customer management table with lock/unlock and KYC tier upgrades, live ledger audit stream, and FX rate governance.
- Responsive design across mobile phones (<640px), tablets (640px-1024px), and desktop computers (>1024px) with safe area padding.
- Prisma PostgreSQL schema for users, sessions, OTP challenges, auth factors, accounts, wallets, ledger entries, rates, audit logs, and support.
- Backend API authentication endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/session`, `/api/auth/verify-email`, `/api/auth/password-reset`).

## In progress

- Live external banking provider adapter integrations (Interswitch, NIBSS, Flutterwave, Paystack, Mono).
- Automated end-to-end database-backed test suite.
- Atomic OTP claim and protected operation transaction with unit coverage for replay and failed attempts.
- Email verification challenge consumption, account activation, and initial NGN wallet creation now share one database transaction.
- Added PostgreSQL integration tests for protected-operation rollback, single-use under concurrent requests, password update, and session revocation (`src/lib/auth.integration.test.ts`).

## Remaining

- OTP delivery; TOTP, WebAuthn/passkeys, transaction PIN, device and login-history management.
- Ledger posting/reversal/reconciliation APIs, concurrency controls, and idempotent provider operations.
- Authorized provider adapters for FX, deposits, withdrawals, transfers, bills, airtime, and bookings.
- Savings, investments, loans, AI service, real-time Island events, support workflows, and admin authorization/console.
- OpenAPI, deployment hardening, Redis/BullMQ, mobile app, and operational monitoring.

## Known limitations

- Dashboard product data uses local mock data; no live financial operation is available.
- OTP delivery is not connected. Development code exposure is limited to explicit isolated sandbox configuration.
- API routes currently use Next.js route handlers; NestJS and FastAPI services are not present in this repository.
- No live provider credentials or exchange-rate values are configured.

## Tests

- Not run: `npm` and `node` are not installed or available on PATH in this environment.
- Auth unit coverage includes password hash primitives, request validation, and mocked OTP transaction/replay behavior. PostgreSQL OTP integration tests require `AUTH_TEST_DATABASE_URL` pointed at a dedicated disposable test database and were not run in this environment.

## Next development task

- Extend PostgreSQL integration coverage to email verification/account provisioning, then continue auth session/device management.
