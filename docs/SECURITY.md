# Security baseline

- Store passwords using a modern adaptive hash (Argon2id preferred) with parameters reviewed for deployment hardware. Never log passwords, OTPs, PINs, tokens, or provider secrets.
- The current auth foundation uses Node.js scrypt with per-password random salts and versioned parameters. Benchmark and review the work factor on production hardware; consider Argon2id before production.
- Enforce verified email/phone challenges, login throttling, session rotation and expiry, CSRF protection where cookie sessions are used, and step-up confirmation for sensitive actions.
- Store transaction PINs as a separate salted hash and apply stricter throttles. OTPs are short-lived, single-use, hashed at rest, and scoped to a purpose.
- WebAuthn stores credential IDs and public keys. Device authenticators perform biometric checks locally; Ruthie Bank must never receive raw fingerprint or face data.
- Session cookies are random opaque values, HTTP-only, SameSite=Strict, Secure in production; only SHA-256 hashes are stored. Sessions expire after 12 hours and are revoked at logout and password reset.
- Verification/reset OTPs are six digits, HMAC-hashed with `AUTH_SECRET`, expire after ten minutes, and allow at most five guesses. Delivery is not connected. `EXPOSE_DEV_OTP` only exposes a test code in isolated local sandbox mode and must remain false elsewhere.
- Apply deny-by-default authorization in server handlers. Admin roles and permissions are checked server-side and every privileged action is audited.
- Use TLS, secure/HttpOnly/SameSite cookies, secret management, database least privilege, encrypted backups, dependency scanning, and data minimization.
- The ledger is append-only. Use idempotency constraints, serializable/appropriately locked posting, balanced-entry checks, reconciliation, and compensating entries for reversals.
- Validate webhook signatures and replay windows. Never trust browser-supplied balances or provider status fields without verification.

This is an implementation baseline, not a compliance certification. Obtain a threat model and independent security review before production use.
