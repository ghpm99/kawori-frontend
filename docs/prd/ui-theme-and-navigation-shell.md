## 1. Feature Overview

* Name
  UI Theme and Navigation Shell
* Summary
  Provides global app shell: layout wrappers, role-aware menus, theme persistence/toggle, and shared providers (Redux, AntD, auth bootstrap).
* Purpose
  Deliver consistent navigation and visual mode across landing/internal/admin sections.
* Business value
  Improves usability, discoverability of modules, and personalized UI preferences.

## 2. Current Implementation

* How it works today
  Root layout wraps app with `ThemeProvider`, Redux `StoreProvider`, and `AuthProvider`. Theme is persisted in localStorage and applied to document class. Menu entries are generated from authenticated user groups.
* Main flows
  App boot -> inline script sets initial html class from localStorage.
  Theme toggle -> dispatch `CHANGE_THEME` -> persist theme + update html class.
  Menu render -> depends on auth status + groups (`user`, `blackdesert`, `financial`, `admin`).
* Entry points (routes, handlers, jobs)
  Layouts: `src/app/layout.tsx`, `src/app/(landing)/layout.tsx`, `src/app/internal/layout.tsx`, `src/app/admin/layout.tsx`.
* Key files involved (list with paths)
  `src/app/layout.tsx`
  `src/components/themeProvider/index.tsx`
  `src/components/themeControl/index.tsx`
  `src/components/menuHeader/index.tsx`
  `src/components/menuInternal/Index.tsx`
  `src/components/loginHeader/Index.tsx`
  `src/styles/theme.ts`
  `styles/globals.scss`

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend-only shell layer consuming auth/group state from Redux.
* Data flow (step-by-step)
  ThemeProvider initializes theme from localStorage -> ConfigProvider applies AntD tokens -> UI components read `theme` from context -> toggles dispatch context action and persist.
  Auth slice groups -> menu item builder -> route links available per group.
* External integrations
  Ant Design theme system.
* State management (if applicable)
  Context for theme state + Redux for auth/menu selected keys.

## 4. Data Model

* Entities involved
  Theme state: `{ theme: 'light'|'dark', status: 'loading'|'idle' }`.
  Menu item keys and selected menu path array.
  Auth group list for role-based menu composition.
* Database tables / schemas
  No DB; localStorage key `theme`.
* Relationships
  Auth groups determine menu modules; theme context determines styling variants.
* Important fields
  `state.theme`, `auth.selectedMenu`, `auth.groups`.

## 5. Business Rules

* Explicit rules implemented in code
  Menu sections appear only when matching group is present.
  Theme toggles between light and dark only.
  Internal/admin layouts redirect unauthorized users to home.
* Edge cases handled
  ThemeProvider delays rendering children until status becomes `idle`.
* Validation logic
  Saved theme values outside `dark` fallback to `light`.

## 6. User Flows

* Normal flow
  User logs in -> sees role-specific side menu -> toggles theme -> preference persists on reload.
* Error flow
  Missing auth permissions triggers redirect from protected layouts.
* Edge cases
  Unauthenticated users only see base navigation options.

## 7. API / Interfaces

* Endpoints
  No dedicated shell endpoint; consumes auth/profile data from auth feature.
* Input/output
  Theme input from localStorage, output applied as html class and AntD tokens.
* Contracts
  Menu key union type constrains selected menu values.
* Internal interfaces
  `useTheme` context hook and `setSelectedMenu` auth reducer.

## 8. Problems & Limitations

* Technical debt
  Multiple layouts duplicate similar auth redirect logic.
* Bugs or inconsistencies
  Some header links (`/signin`, `/admin/user`) may not match existing route implementations.
* Performance issues
  Initial inline script + provider hydration can cause brief visual transitions.
* Missing validations
  No guard against malformed group values from backend.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  Root layout injects inline script via `dangerouslySetInnerHTML` for theme bootstrap.
* External code execution
  No dynamic eval, but inline script path increases CSP sensitivity.
* Unsafe patterns
  Several external links with `target='_blank'` omit `rel='noopener noreferrer'`.
* Injection risks
  Low in current shell data path; inline script is static but still bypasses strict CSP unless nonce/hash is configured.
* Hardcoded secrets
  None found.
* Unsafe file/system access
  None.

## 10. Improvement Opportunities

* Refactors
  Extract shared protected-layout guard hook used by internal/admin layouts.
* Architecture improvements
  Replace inline theme script with CSP-safe strategy (nonce/hash or server-rendered class).
* Scalability
  Support additional theme tokens and accessibility preferences.
* UX improvements
  Provide clear route fallback for broken links and missing pages.

## 11. Acceptance Criteria

* Functional
  Theme toggle persists and applies correctly across all layouts.
  Menu options are role-aware and route users to accessible pages.
* Technical
  Unauthorized access redirects are consistent across protected layouts.
  No invalid menu links remain.
* Edge cases
  Invalid stored theme values fallback gracefully.
  Group-less authenticated users still render safe minimal navigation.

## 12. Open Questions

* Unknown behaviors
  Expected behavior for users with overlapping groups and conflicting route access.
* Missing clarity in code
  Whether `/signin` and `/admin/user` are intentionally pending routes.
* Assumptions made
  Assumed backend groups are authoritative and stable.
