## 1. Feature Overview

* Name
  Authentication, Session, and Access Control
* Summary
  Handles sign-in, sign-up, sign-out, token verification/refresh, password reset, and route access gating for landing/internal/admin areas.
* Purpose
  Ensure only authenticated/authorized users can access protected areas while keeping session continuity across page loads.
* Business value
  Enables account lifecycle and permissioned access to core product modules (financial, facetexture, rank, admin tools).

## 2. Current Implementation

* How it works today
  Client-side Redux thunks call `/auth/*` and `/profile/*` endpoints via Axios instances with cookie credentials. Middleware checks `lifetimetoken` cookie for private routes. `AuthProvider` verifies token (based on localStorage expiration), fetches user details/groups, and redirects to `/signout` when token refresh fails.
* Main flows
  Sign-in: login form -> `signinThunk` (`auth/token/`) -> localStorage expiration persisted -> status authenticated -> user/profile/groups fetch.
  Sign-up: sign-up form -> `signupService` (`auth/signup`) -> auto login attempt.
  Session restore: `AuthProvider` checks localStorage expiration -> `verifyTokenThunk` -> load profile/groups.
  Refresh flow: Axios interceptors on 401 -> `refreshTokenAsync` -> retry original request.
  Sign-out: `signoutThunk` -> reset auth slice -> remove localStorage token -> redirect home.
  Password reset: request link (`password-reset/request/`), token validation (`password-reset/validate/`), confirm password (`password-reset/confirm/`).
* Entry points (routes, handlers, jobs)
  Route: `/` (login/signup panel), `/signout`, `/reset-password`.
  Middleware: `src/middleware.ts`.
  Provider hook flow: `src/components/authProvider/index.tsx`.
* Key files involved (list with paths)
  `src/lib/features/auth/index.ts`
  `src/services/auth/index.ts`
  `src/services/auth/resetPassword.ts`
  `src/components/authProvider/index.tsx`
  `src/app/(landing)/page.tsx`
  `src/app/(landing)/signout/page.tsx`
  `src/app/(landing)/reset-password/page.tsx`
  `src/middleware.ts`
  `src/components/signin/index.tsx`
  `src/components/signup/index.tsx`

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend: Next.js App Router pages + Redux Toolkit slices/thunks + providers.
  Backend integration: Django API via Axios (`apiAuth`, `apiDjango`) with cookies.
* Data flow (step-by-step)
  User submits login form -> thunk dispatch -> API response includes refresh expiration -> Redux status/authenticated + localStorage write -> AuthProvider loads profile/groups -> layouts/menu render based on roles/groups.
* External integrations
  Axios, Sentry (`captureException`), Next middleware.
* State management (if applicable)
  Redux `auth` slice (`user`, `status`, `loading`, `selectedMenu`, `groups`) and `loading` slice lifecycle tracking.

## 4. Data Model

* Entities involved
  `IUser`, auth status, group list, login credentials, new user payload, reset token/new password payload.
* Database tables / schemas
  No local DB table for auth; browser storage uses localStorage key `lifetimetoken` and cookies.
* Relationships
  User -> groups (array from `profile/groups/`) controls menu and admin/internal routing logic.
* Important fields
  `user.is_superuser`, `user.is_active`, `groups[]`, `refresh_token_expiration`, `lifetimetoken`.

## 5. Business Rules

* Explicit rules implemented in code
  Middleware denies `/internal`, `/admin`, `/financial` without cookie token.
  Authenticated users visiting `/facetexture` are redirected to `/internal/facetexture`.
  Admin layout requires `status=authenticated`, `user.is_superuser`, and `groups` containing `admin`.
  Internal layout redirects if unauthenticated or inactive account.
  Password reset request always shows success message (anti-email-enumeration UX).
* Edge cases handled
  Concurrent refresh requests are deduplicated via shared promise.
  Refresh 403 dispatches `tokenRefreshFailed` event and forces sign-out redirect.
* Validation logic
  Login fields required.
  Signup validates email format, max lengths, password min length, and password confirmation.
  Reset password validates token flow and confirms matching passwords.

## 6. User Flows

* Normal flow
  User signs in -> token verified -> profile/groups loaded -> internal/admin navigation unlocked per groups.
* Error flow
  Wrong credentials -> login error state.
  API auth failures -> interceptor refresh attempt; if refresh fails, event-triggered redirect to `/signout`.
  Invalid reset token -> invalid token result page.
* Edge cases
  Local token exists but expired -> skip verify and remain unauthenticated.
  Pending auth requests block redirect logic in layouts until loading effects settle.

## 7. API / Interfaces

* Endpoints
  `POST /auth/token/`
  `POST /auth/token/verify/`
  `POST /auth/token/refresh/`
  `GET /auth/signout`
  `POST /auth/signup`
  `GET /profile/`
  `GET /profile/groups/`
  `POST /auth/password-reset/request/`
  `GET /auth/password-reset/validate/`
  `POST /auth/password-reset/confirm/`
* Input/output
  Login input: `{ username, password, remember }`.
  Login output includes `refresh_token_expiration`.
  Profile output mapped into `IUser`.
* Contracts
  Axios instances use `withCredentials: true`; interceptors retry 401/408/500/504 for `apiDjango`.
* Internal interfaces
  Redux thunks (`signinThunk`, `verifyTokenThunk`, `userDetailThunk`, `userGroupsThunk`, `signoutThunk`).

## 8. Problems & Limitations

* Technical debt
  Authorization is duplicated across middleware/layout/provider logic.
  `apiAuth.get('/csrf/')` has no explicit lifecycle/error handling.
* Bugs or inconsistencies
  Middleware only checks cookie existence, not token validity/claims.
  Some menu links (`/admin/user`) do not match existing route structure.
* Performance issues
  Multiple sequential auth/profile dispatches at startup can increase initial render latency.
* Missing validations
  No client-side password strength beyond min length.
  Limited defensive handling when profile/groups calls fail after auth success.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  Route protection in middleware is token-presence based only (`lifetimetoken` cookie), which is weak if cookie is stale/forged.
* External code execution
  None in auth flow.
* Unsafe patterns
  Session expiration trust is partially based on localStorage timestamp, which is client-modifiable.
* Injection risks
  No direct injection vector identified in auth forms.
* Hardcoded secrets
  None found in source; relies on env vars.
* Unsafe file/system access
  None.

## 10. Improvement Opportunities

* Refactors
  Centralize access-control decisions in one policy layer shared by middleware/layout.
* Architecture improvements
  Validate auth/role on server-side session endpoint rather than only cookie presence in middleware.
* Scalability
  Cache profile/groups fetch or bundle them into one endpoint.
* UX improvements
  Explicit auth error states for network failures and refresh failure reasons.

## 11. Acceptance Criteria

* Functional
  User can sign up, sign in, sign out, request reset link, validate token, and set new password.
  Unauthorized users cannot access `/internal/*` or `/admin/*`.
* Technical
  401 responses trigger single refresh flow for concurrent requests.
  Auth state persists across reload when token is valid.
* Edge cases
  Expired/invalid reset tokens render invalid-token UI.
  Refresh failure triggers deterministic redirect to `/signout`.

## 12. Open Questions

* Unknown behaviors
  Whether backend enforces CSRF/session protection consistently for all auth endpoints.
* Missing clarity in code
  Exact semantics of `remember` flag server-side are not visible in frontend code.
* Assumptions made
  Assumed backend applies authoritative authorization checks beyond frontend gating.
