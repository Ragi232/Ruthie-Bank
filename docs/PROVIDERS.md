# Provider integration guide

Provider ports are not connected in this phase. Add one server-only adapter per capability and define explicit `sandbox`, `available`, and `unavailable` behavior. Missing credentials must fail closed and must never return a fabricated success.

Required capability families: Nigerian account/transfer partner, collection provider, authorized BVN/NIN and KYC provider, SMS/OTP, email, exchange-rate provider, airtime/data and utility aggregator, investment manager, licensed lending partner, and booking provider.

For each adapter document licensing/contract status, sandbox credentials source, authentication, request/response schemas, idempotency support, webhook signature verification, timeout/retry policy, reconciliation method, data residency/retention, and escalation contact. Keep credentials in environment or managed secret storage. Never commit secrets or use production credentials in local development.

FX observations must persist source, quote, and timestamp. The UI must show the observation time and avoid implying live rates when the provider is stale or unavailable.
