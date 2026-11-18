# API contract (Phase 1)

All endpoints are versioned under `/api` as the backend grows. JSON requests will be validated with Zod and errors will use a stable `{ error: { code, message, requestId } }` shape. Authentication and financial routes are not implemented yet.

## Available

### `GET /api/health`

Returns service readiness metadata, for example:

```json
{"status":"ok","environment":"sandbox","financialOperations":"sandbox-unavailable"}
```

## Authentication endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Validates and creates a pending profile; creates a short-lived email OTP challenge. OTP delivery is unavailable until an adapter is configured. |
| `POST` | `/api/auth/verify-email` | Consumes a matching, unexpired email challenge, activates the profile, creates an NGN wallet, and sets a session cookie. |
| `POST` | `/api/auth/login` | Verifies the password and active/verified account state, then sets an opaque HTTP-only session cookie. |
| `POST` | `/api/auth/logout` | Revokes the current session and clears its cookie. |
| `GET` | `/api/auth/session` | Returns the authenticated profile or `401`. |
| `POST` | `/api/auth/password-reset/request` | Always returns a generic `202`; stores a reset challenge only for an existing email. |
| `POST` | `/api/auth/password-reset` | Consumes a valid reset challenge, updates the password, and revokes all sessions. |

Development may expose an OTP only when both `APP_ENV=sandbox` and `EXPOSE_DEV_OTP=true` are set and `NODE_ENV` is not production. No OTP is delivered through a real provider yet.

## Planned conventions

- Auth endpoints are rate-limited using hashed IP/identity buckets, generic for password-reset account discovery, and use secure session cookies.
- Money movement: authenticated request, step-up confirmation, UUID `Idempotency-Key`, server-side limit/risk check, transactionally posted ledger entries, and a status response that distinguishes pending from final.
- Provider callbacks: signed webhook endpoint, replay protection, durable event record, idempotent processing, reconciliation.
- Admin APIs: separate authorization policy checked on every server request, audit event on privileged changes.

An OpenAPI document will be generated when the concrete endpoints are introduced so its schemas match implemented behavior.
