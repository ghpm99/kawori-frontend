## 1. Feature Overview

- Name: Authentication, Session, and Access Control
- Summary (what it does in simple terms): Lets users create accounts, sign in/out, recover passwords, keep sessions active, and restrict route access by authentication state and role groups.
- Target user: Anonymous visitors, registered users, and admins.
- Business value (why this exists): Enables secure gated usage of internal/admin capabilities and supports user onboarding and retention.

## 2. Problem Statement

- What problem this feature solves: Users need controlled access to personalized and privileged features, with reliable session continuity and account recovery.
- What would happen if it didn’t exist: Internal and admin areas would be exposed or unusable, users could not persist sessions, and lost-password recovery would be blocked.

## 3. Current Behavior

- What the system currently does:
- Home page exposes login and signup forms when user is unauthenticated.
- Signup (`/auth/signup`) creates a user and then attempts immediate login with entered credentials.
- Signin (`/auth/token/`) stores refresh token expiration in `localStorage` key `lifetimetoken`.
- On app load, auth provider checks `lifetimetoken` expiration and, if valid, calls token verify (`/auth/token/verify/`).
- When authenticated, provider fetches profile (`/profile/`) and groups (`/profile/groups/`).
- Axios interceptors retry recoverable errors and refresh auth tokens on 401.
- If token refresh fails with 403, browser event `tokenRefreshFailed` triggers redirect to `/signout`.
- `/signout` always dispatches signout (`/auth/signout`) then redirects home.
- Password reset flow:
- Request reset (`/auth/password-reset/request/`) always shows success message to avoid email enumeration.
- Token validation (`/auth/password-reset/validate/`) gates reset form.
- Confirm reset (`/auth/password-reset/confirm/`) updates password and redirects home.
- Middleware route behavior:
- Private routes (`/internal`, `/admin`, `/financial`) redirect to `/signout` if cookie `lifetimetoken` missing.
- Authenticated users visiting `/facetexture` are redirected to `/internal/facetexture`.
- Layout-level role checks:
- Internal layout redirects to `/` if unauthenticated or inactive user.
- Admin layout redirects to `/` if unauthenticated, non-superuser, or missing `admin` group.

- Real behavior based on code: Session validity is hybrid (cookie + localStorage expiration marker). Routing uses cookie checks in middleware, while client initialization uses localStorage expiration before verify.

- Key flows:
- Signup -> success message -> auto login dispatch.
- Signin -> authenticated status -> profile/groups loaded.
- Session verify/refresh -> continue session.
- Refresh failure -> signout route.
- Reset password request/validate/confirm flow.

## 4. User Flows

### 4.1 Main Flow

1. User opens home and submits login credentials.
2. System sends signin request and, on success, marks user authenticated.
3. System stores refresh token expiration in local storage.
4. System loads profile and groups.
5. User accesses authorized internal/admin pages based on role checks.

### 4.2 Alternative Flows

1. User signs up first, then system auto-submits login.
2. User returns later with valid local token timestamp, system verifies token and restores session silently.
3. User clicks “Esqueci minha senha”, requests reset link, validates token, and sets a new password.

### 4.3 Error Scenarios

1. Invalid login sets `auth/signin` failure and shows “Usuario ou senha incorretos”.
2. API 401 triggers refresh attempt; repeated failures reject request.
3. Refresh 403 dispatches `tokenRefreshFailed`, forcing signout redirect.
4. Reset token invalid/expired shows error result page with action to request a new link.
5. Reset confirm API error displays backend detail when available.

## 5. Functional Requirements

- The system must allow user signup with required fields and password confirmation.
- The system must authenticate users via username/password.
- The system must persist session-expiration metadata locally after successful signin.
- The system must verify token on app startup when local token expiration is still valid.
- The system must fetch user profile and user groups after successful authentication.
- The system must refresh tokens automatically on unauthorized responses.
- The system must redirect users to signout when token refresh irrecoverably fails.
- The system must support password reset request, token validation, and password confirmation.
- The system must guard private routes and role-sensitive layouts.
- The user can sign out from landing and internal/admin headers.

## 6. Business Rules

- Local token timestamp must be greater than current time to trigger verify on startup.
- Private route access requires cookie `lifetimetoken`.
- `/facetexture` should redirect authenticated users to `/internal/facetexture`.
- Internal pages require authenticated status and active user.
- Admin pages require authenticated status, `is_superuser=true`, and `admin` group.
- Signup form enforces email format and minimum password length (8).
- Password reset request always returns generic success message regardless of account existence.
- Password reset confirmation requires matching password and confirmation fields.

## 7. Data Model (Business View)

- Main entities:
- User: id, name, username, first_name, last_name, email, active/superuser flags, last_login, date_joined, image.
- Session: auth status, refresh expiration timestamp in local storage, auth cookies.
- Group membership: list of role groups (`admin`, `financial`, `blackdesert`, `user`).
- Password reset token: token passed by query string for reset validation/confirmation.

- Relationships:
- One user can belong to multiple groups.
- Session state determines access to user-scoped and admin-scoped features.

- Important fields (business meaning):
- `is_active`: enables/blocks internal usage.
- `is_superuser` + `groups`: gates admin layout.
- `refresh_token_expiration`: session continuity cutoff.

## 8. Interfaces

- User interfaces (screens, pages):
- `/` login/signup panel.
- `/signout` forced/logout page.
- `/reset-password` reset request and token-based reset.

- APIs (high-level, not low-level code):
- `POST /auth/token/`, `POST /auth/token/verify/`, `POST /auth/token/refresh/`, `GET /auth/signout`.
- `POST /auth/signup`.
- `POST /auth/password-reset/request/`, `GET /auth/password-reset/validate/`, `POST /auth/password-reset/confirm/`.
- `GET /profile/`, `GET /profile/groups/`.

## 9. Dependencies

- Other features this depends on:
- Menu and layout rendering.
- User profile page.
- Role-restricted features (financial, facetexture, ranking).

- External systems (if any):
- Backend auth/profile APIs.
- Browser `localStorage`.
- Next.js middleware cookie handling.

## 10. Limitations / Gaps

- Signin button references `/signin` in header, but dedicated page is not implemented in app routes.
- Logout entry in landing menu dropdown is static text and does not trigger signout directly.
- Some auth guard logic is duplicated across middleware and client layouts.
- Error copy is inconsistent across endpoints and partly backend-dependent.

## 11. Opportunities

- Consolidate auth guard logic into shared guard abstraction.
- Add dedicated signin/signup routes for consistency with header links.
- Add explicit loading/error states for profile/group fetches in UI.
- Add post-login redirect memory to return users to intended private page.

## 12. Acceptance Criteria

- Given valid credentials, when a user submits login, then status becomes authenticated and profile/groups are loaded.
- Given invalid credentials, when login is submitted, then login error state is shown.
- Given valid local token expiration, when app initializes, then token verify is executed.
- Given private route access without auth cookie, when middleware runs, then request is redirected to `/signout`.
- Given token refresh failure with forbidden response, when interceptor handles the error, then user is redirected to signout flow.
- Given password reset request, when any email is submitted, then generic success feedback is shown.
- Given invalid reset token, when token validation runs, then invalid-token state is rendered.
- Given matching new passwords and valid token, when reset confirm succeeds, then user sees success and is redirected home.

## 13. Assumptions

- Assumed backend sets/maintains auth cookies required by middleware.
- Assumed role group strings are authoritative and stable (`admin`, `financial`, `blackdesert`, `user`).
- Assumed local `lifetimetoken` stores expiration timestamp string from backend in client-compatible format.
