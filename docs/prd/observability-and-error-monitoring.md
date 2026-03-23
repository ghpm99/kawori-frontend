## 1. Feature Overview

* Name
  Observability and Error Monitoring
* Summary
  Integrates Sentry and Vercel telemetry for frontend/runtime error capture and performance instrumentation.
* Purpose
  Detect, triage, and monitor production issues across client/server/edge runtime paths.
* Business value
  Reduces MTTR and improves reliability visibility.

## 2. Current Implementation

* How it works today
  Sentry initialized in client/server/edge config files. Global error boundary reports exceptions. Axios interceptors report failed requests after retry exhaustion. Instrumentation conditionally registers Sentry in production.
* Main flows
  Runtime error -> Sentry capture.
  API/network errors -> Axios interceptor retries then captures.
  Global app error boundary -> captures and renders fallback UI.
* Entry points (routes, handlers, jobs)
  `src/instrumentation.ts`
  `src/app/global-error.tsx`
  Axios interceptors in `src/services/index.ts` and `src/services/auth/index.ts`.
* Key files involved (list with paths)
  `sentry.client.config.ts`
  `sentry.server.config.ts`
  `sentry.edge.config.ts`
  `src/instrumentation.ts`
  `src/app/global-error.tsx`
  `src/services/index.ts`
  `src/services/auth/index.ts`
  `next.config.js` (Sentry build plugin wrapper)

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend and server runtime instrumentation only (no backend code in repo).
* Data flow (step-by-step)
  App boot in production -> instrumentation imports Sentry runtime config -> Sentry client captures exceptions/events -> build pipeline uploads source maps via plugin config.
* External integrations
  `@sentry/nextjs`, Vercel Analytics, Vercel Speed Insights.
* State management (if applicable)
  Not stateful in Redux; observability cross-cutting concern.

## 4. Data Model

* Entities involved
  Exception events, traces, replay samples, retry metadata (`_retryCount`).
* Database tables / schemas
  External SaaS storage (Sentry/Vercel).
* Relationships
  Axios error handling is linked to auth refresh logic and captures final failures.
* Important fields
  DSN env var, traces sample rate, replay sample settings.

## 5. Business Rules

* Explicit rules implemented in code
  Sentry runtime registration only in production.
  Axios retries up to 3 times for 401/408/500/504 before capturing exception.
  Unauthorized response triggers refresh flow before final rejection.
* Edge cases handled
  Concurrent refresh token requests are deduplicated.
* Validation logic
  None specific; telemetry config is env-driven.

## 6. User Flows

* Normal flow
  User interacts with app; telemetry passively captures performance/errors in background.
* Error flow
  Unhandled error shows global fallback and logs to Sentry.
* Edge cases
  Network failures with no response still enter retry logic then capture.

## 7. API / Interfaces

* Endpoints
  External Sentry DSN ingestion endpoints (through SDK).
* Input/output
  Input: runtime exceptions and request errors.
  Output: monitoring events/traces/replays.
* Contracts
  `withSentryConfig` build integration uses env `SENTRY_AUTH_TOKEN` and project/org metadata.
* Internal interfaces
  `errorInterceptor`, `refreshTokenAsync`, `GlobalError` component.

## 8. Problems & Limitations

* Technical debt
  Sampling rates are high (`tracesSampleRate: 1`) which may be costly in production.
* Bugs or inconsistencies
  Some catch blocks only `console.error` without contextual metadata enrichment.
* Performance issues
  Aggressive retries and high tracing sample rate can increase overhead.
* Missing validations
  No guardrails in code for missing DSN/auth token envs beyond SDK defaults.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  Source map upload and rich telemetry can expose sensitive context if scrubbers are insufficient.
* External code execution
  None observed.
* Unsafe patterns
  Potential leakage via captured error payloads if PII is included in thrown errors.
* Injection risks
  Low direct injection risk.
* Hardcoded secrets
  No hardcoded secret values, but build config references `SENTRY_AUTH_TOKEN` env.
* Unsafe file/system access
  None in runtime; build-time upload needs secure CI secret handling.

## 10. Improvement Opportunities

* Refactors
  Centralize error normalization and redaction before capture.
* Architecture improvements
  Add structured logging correlation IDs across requests/retries.
* Scalability
  Tune sampling rates by environment and route criticality.
* UX improvements
  Replace generic global error text with localized/helpful recovery guidance.

## 11. Acceptance Criteria

* Functional
  Runtime errors from client/server/edge are captured in monitoring platform.
  Global error boundary displays fallback UI without app crash loop.
* Technical
  Retry policy executes as defined and stops after max attempts.
  Sensitive payload fields are redacted before telemetry emission.
* Edge cases
  Missing DSN does not break app runtime.
  Refresh-token failures are captured and produce controlled signout flow.

## 12. Open Questions

* Unknown behaviors
  Current production sampling and data-retention policies are not visible in repo.
* Missing clarity in code
  PII redaction strategy is not explicitly implemented in client code.
* Assumptions made
  Assumed organization-level Sentry settings apply additional scrubbing/controls.
