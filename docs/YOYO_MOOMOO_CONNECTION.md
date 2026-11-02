# YOYO Capital — Moomoo Connection V1

## Security posture

V1 is **read-only**. Request only `quote:read` and `trade:read`. Do not request `trade:write`.

OAuth 2.1 + PKCE is used. The browser receives only the Moomoo authorization URL; access/refresh tokens must remain server-side and must never be committed to GitHub or returned to the frontend.

## Flow

1. Backend registers an OAuth client with Moomoo.
2. Backend generates `code_verifier`, `code_challenge`, and `state`.
3. Backend stores `client_id`, verifier and state in a server-side encrypted/session store.
4. Frontend opens the Moomoo authorization URL.
5. Moomoo redirects to the backend callback with `code` and `state`.
6. Backend validates `state` and immediately exchanges the one-time code for tokens.
7. Backend stores tokens securely and refreshes the access token when required.
8. YOYO reads SPY/QQQ quotes, options data and account/position data.

## Deployment requirement

The production callback must be an HTTPS endpoint on the deployed YOYO backend. Do not use a frontend-only Vercel deployment for token exchange/storage.

## Data rollout

Phase A: SPY/QQQ quote health check.
Phase B: expirations and option chain.
Phase C: bid/ask, IV, Delta/Gamma/Theta/Vega, volume and OI where the account's Moomoo market-data entitlement permits.
Phase D: account cash, ETF holdings and option positions.
Phase E: feed the normalized data into the Wheel Decision Engine.

## Status

OAuth helper implemented. Production callback/session/token persistence and quote endpoints remain to be wired into the existing backend framework before the Connect Moomoo button is enabled.
