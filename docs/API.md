# API reference

The current API is implemented as Next.js App Router handlers under `/api`. Responses are JSON. Errors currently use `{ "error": { "code": "...", "message": "..." } }`; request IDs and a formal OpenAPI schema are not implemented.

## Health

### `GET /api/health`

Performs a database query. Returns `200` with `status: "ok"` and `database: "ready"` when PostgreSQL is reachable; returns `503` when it is not. `financialOperations` is always `"unavailable"`.

## Authentication

| Method | Path | Behavior |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Validates a profile, then atomically creates a pending user and email OTP challenge. Email delivery is unavailable. |
| `POST` | `/api/auth/verify-email` | Validates and consumes a single-use OTP, activates the user, creates an account and NGN wallet, then issues a session cookie in the same request flow. |
| `POST` | `/api/auth/login` | Checks password, active status, and verified email, then issues an opaque HTTP-only session cookie. |
| `POST` | `/api/auth/logout` | Revokes the current session and expires its cookie. |
| `GET` | `/api/auth/session` | Returns the verified session profile or `401`; response is `Cache-Control: no-store`. |
| `POST` | `/api/auth/password-reset/request` | Returns a generic `202`; stores a challenge only for an existing user. Delivery is unavailable. |
| `POST` | `/api/auth/password-reset` | Consumes a valid reset challenge, updates the password, and revokes all user sessions. |

All authentication POST handlers reject a present `Origin` that does not match `APP_URL` or `NEXT_PUBLIC_APP_URL` (or the request host when no configured URL exists). Requests without an `Origin` are allowed for non-browser clients. Deployments must keep browser endpoints same-origin and protect non-browser access independently.

Auth rate limiting uses hashed identity and forwarded-IP buckets in PostgreSQL. Configure a trusted reverse proxy that overwrites `X-Forwarded-For`; direct untrusted forwarding headers can defeat IP-based controls. OTPs expire after ten minutes and allow at most five attempts. A development OTP is returned only when `APP_ENV=sandbox`, `NODE_ENV` is not production, and `EXPOSE_DEV_OTP=true`.

## Financial, payment, support, AI, and admin operations

No API routes exist for money movement, customer wallet/ledger reads, provider payments, KYC, support, AI, or administrative operations. The browser preview's corresponding context actions return unavailable and do not mutate balances or create successful transactions. Do not infer an operation from UI state.

The payment port and integer minor-unit/journal validation helpers are foundations only. There is no provider adapter, ledger posting service, webhook endpoint, provider reconciliation, or live credential. See [provider evaluation](PROVIDER_EVALUATION.md).
