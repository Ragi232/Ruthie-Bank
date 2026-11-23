# Security posture

Updated: 2026-11-20. This is an implementation status note, not a security certification.

## Implemented in source

- Passwords use Node.js scrypt with random salts, versioned work-factor parameters (`N=32768`, `r=8`, `p=1`), and timing-safe hash comparison. Review and benchmark the work factor on deployment hardware.
- Session tokens are random opaque values; only SHA-256 hashes are persisted. Cookies are HTTP-only, SameSite Strict, Secure in production, and expire after 12 hours. Logout and password reset revoke sessions.
- Email verification and password reset OTPs are scoped by purpose, HMAC-hashed with `AUTH_SECRET`, expire after ten minutes, and allow five attempts. OTP delivery is unavailable; development code exposure is opt-in and limited to non-production sandbox configuration.
- PostgreSQL-backed auth throttling uses hashed identity/IP buckets. A trusted proxy must overwrite forwarding headers; otherwise the IP bucket is not trustworthy.
- Authentication mutation routes validate a supplied Origin against the configured app origin. SameSite cookies are also enabled. Browser POST requests should send Origin; missing Origin is allowed for non-browser clients.
- The application sends `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` headers. Production responses also set HSTS.
- Client auth now starts unauthenticated, restores only from `/api/auth/session`, and does not accept a client-only PIN/passkey or database-offline fallback as proof of sign-in.
- Browser money, savings, investment, loan, booking, support, and admin actions fail closed while their server APIs are absent.

## Not implemented / production blockers

- Email/SMS OTP delivery, TOTP, WebAuthn enrollment/assertion verification, transaction PIN creation/verification, device session inventory, dedicated lockout state, and trusted-device management.
- Server-side customer, wallet, ledger, payment, KYC, AML, support, AI, and admin APIs. The current admin screen is sample data; there is no server role authorization or privileged operation to protect yet.
- A complete double-entry ledger, atomic posting service, database balancing/immutability constraints, idempotency scope, race/concurrency controls, reversal workflow, provider event store, or reconciliation service.
- A strict Content Security Policy, centralized structured logging, secret manager, error monitoring, security alerting, rate-limit bucket cleanup, backup/restore procedure, dependency scanning, and a production threat assessment.
- Independent penetration testing and production security review.

Never enable live transactions by setting an environment flag. Require authorized providers, legal/compliance approval, a reviewed ledger/posting design, sandbox verification, operational monitoring, and deployment-specific security review first.
