# Nigeria payment provider evaluation

Research snapshot: 2026-11-20. Sources below are provider documentation and pricing pages. Fees, supported payment methods, onboarding rules, and settlement schedules can change; confirm them with the provider during business onboarding. This is an evaluation only. No provider is selected, credentials are not configured, and no live processing is enabled.

## Scope and conclusion

Paystack and Flutterwave document Nigerian merchant collections, transfers/payouts, transaction verification, webhooks, and refunds. Those capabilities can support a merchant payment flow after approval. They do not, by themselves, establish that Ruthie Bank is authorized to take deposits, hold customer funds, operate stored-value wallets, or provide banking services. A licensed bank or other appropriately authorized partner and legal/compliance approval are still required for any such product.

Do not select either provider as the platform's bank or ledger. Run commercial, legal, settlement, reconciliation, data-protection, and technical due diligence with each provider and a licensed banking partner before implementation.

## Comparison

| Area | Paystack (Nigeria) | Flutterwave (Nigeria) |
| --- | --- | --- |
| Merchant availability | Paystack lists Nigeria, Ghana, South Africa, and Kenya as active business markets; Côte d'Ivoire and Egypt are described as private beta. | Nigeria is an active country market; Flutterwave lists Starter, registered-business, and other-entity onboarding paths. |
| Collection methods | Cards and market-enabled channels; Nigerian businesses can use transfer, USSD, and dedicated virtual accounts. Pay with Transfer is available in Nigeria and Ghana. | Nigerian page lists local cards, bank account, USSD, bank transfer, POS, Visa QR, and wallet channels such as eNaira/Opay. |
| Currency limits | Supported-currency documentation lists NGN in Nigeria, USD for Nigeria and Kenya, GHS in Ghana, ZAR in South Africa, plus other markets/currencies. Account activation is market-specific. For Nigerian USD payouts, Paystack says a Zenith USD domiciliary account is required. | Flutterwave advertises 30+ currencies globally, but Nigerian payout rules are capability-specific: its Nigerian bank-transfer guide requires NGN for the local payout. Confirm collection and settlement currencies for the specific merchant account before offering multi-currency balances. |
| Transfers / payouts | Disbursement docs cover NUBAN recipients and single/bulk transfers from the Paystack merchant balance. Transfer fees currently listed are NGN 10 (up to 5,000), NGN 25 (5,001–50,000), and NGN 50 (above 50,000). A separate NGN 50 stamp duty currently applies to qualifying transfers of at least NGN 10,000, subject to stated exceptions. | Payout docs cover bank accounts, mobile money, Flutterwave accounts, and bulk flows across supported countries. Nigerian transfers require approved KYC, API transfers enabled, server IP allowlisting, and sufficient balance. Local bank payout currency is NGN in the Nigerian guide. |
| Collection pricing | Nigeria local: 1.5% + NGN 100, capped at NGN 2,000; the NGN 100 is waived below NGN 2,500. International card rates are higher; check the pricing page and account terms. | Nigeria local: 2% total (shown as 1.4% transaction fee + 0.6% platform fee). International: 4.8%. The pricing page says fees are subject to 7.5% VAT. |
| Settlement | Paystack advertises automatic settlement within 24 hours; exact timing, reserve, and payout terms must be confirmed for the approved account. | Flutterwave's Nigeria onboarding page says local settlement completes in one business day and international settlement in five business days, to the merchant's Flutterwave MFB account. Confirm the applicable account schedule and holidays. |
| API and verification | Secret-key Bearer API. Verify a transaction by reference and check amount, currency, and status. Paystack says success webhooks are preferred but webhooks currently cover successful payment events; other states require verification/status enquiry. | Secret-key API. Its docs explicitly require server-side transaction verification against the expected reference, status, currency, and amount before granting value. Transfer/payout status enquiry is also available. |
| Webhooks | Public endpoint; verify the exact raw body. Current signing guidance uses `Paystack-Signature` HMAC-SHA512 with a timestamp and 300-second replay window; support rotation overlap. The deprecated `X-Paystack-Signature` has no timestamp. Process only after signature verification and durable event deduplication. | Public endpoint; current v4 documentation describes `flutterwave-signature` as HMAC-SHA256 over the raw body using the configured secret hash. Older V3 guidance uses `verif-hash`; confirm which webhook version the merchant account emits. Verify the transaction with the API before ledger posting. |
| Refunds / reversals | Refund API supports full and partial refunds with unique references; status can remain pending/processing, require attention, fail, or become processed. Some completed refunds may take up to 10 business days to reach customers. | Refund API supports full/partial refunds and status lookup/webhook notification. Refunds debit available provider balance and are asynchronous. |
| Onboarding | Paystack's Nigeria checklist for starter businesses includes government ID, BVN, personal bank account, and owner/contact information. Registered businesses require entity-specific documents and approval. Restricted/regulated business activity may require more review. | Flutterwave's Nigerian requirements vary by entity. The published company requirements include CAC and incorporation documents, representative/director BVN and NIN, proof of address, website/business details, valid IDs, and an operating license where the activity is regulated. Starter businesses have a separate checklist. |

## Implementation requirements before sandbox work

1. Confirm the legal entity, product scope, and permitted use with the provider and a licensed banking partner. Obtain written approval for collection, payout, customer sub-ledger, and any wallet/stored-value use cases.
2. Complete provider business verification. Obtain test credentials, test merchant/account IDs, API scopes, webhook signing configuration, test settlement destination, and support/escalation contacts.
3. Store server-side credentials in a secret manager or deployment secrets. Never put secret or webhook keys in `NEXT_PUBLIC_*` variables or browser code.
4. Use integer minor units at provider boundaries. Persist the provider, merchant account, request reference, provider reference, amount, currency, event ID, and final status.
5. Verify every webhook signature against the raw request bytes. Deduplicate durable provider event IDs and idempotency references. Re-query provider transaction or payout status before granting value or posting a final ledger event.
6. Model pending, successful, failed, reversed, and refund states separately. Reconcile provider statements and settlement reports against ledger control accounts; never infer success from a redirect or browser response.
7. Run the complete sandbox test matrix, including delayed callbacks, duplicate callbacks, invalid signatures, mismatched amount/currency/reference, failed payout, reversal, refund, timeout, and reconciliation differences.

## Sources

- [Paystack supported currencies](https://paystack.com/docs/v2/api/supported-currencies)
- [Paystack Nigeria pricing](https://paystack.com/pricing)
- [Paystack transfers/disbursements](https://paystack.com/docs/v2/disbursements/)
- [Paystack payment verification](https://paystack.com/docs/payments/verify-payments/)
- [Paystack webhooks and signature verification](https://paystack.com/docs/payments/webhooks/)
- [Paystack refunds](https://paystack.com/docs/payments/refunds/)
- [Paystack Nigeria compliance requirements](https://support.paystack.com/en/articles/2123970)
- [Flutterwave Nigeria pricing and settlement](https://www.flutterwave.com/ng/pricing)
- [Flutterwave Nigeria onboarding requirements](https://flutterwave.com/us/support/onboarding/onboarding-requirements-for-using-flutterwave-in-nigeria)
- [Flutterwave Nigerian bank transfers](https://developer.flutterwave.com/docs/nigerian-bank-account-transfer)
- [Flutterwave payouts](https://developer.flutterwave.com/docs/payout-outflow/introduction)
- [Flutterwave transaction verification](https://developer.flutterwave.com/docs/transaction-verification)
- [Flutterwave v4 webhooks](https://developer.flutterwave.com/v4.0.0/docs/webhooks)
- [Flutterwave refunds](https://developer.flutterwave.com/docs/payment-operations/refunds)
