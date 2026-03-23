## 1. Feature Overview

- Name: Theme and Navigation Shell
- Summary (what it does in simple terms): Provides shared app chrome (headers/menus/layouts), role-aware navigation, and persistent light/dark theme controls.
- Target user: All visitors and authenticated users across landing, internal, and admin areas.
- Business value (why this exists): Creates consistent product structure and personalized navigation to improve discoverability and usability.

## 2. Problem Statement

- What problem this feature solves: Users need a coherent navigation model and visual preference persistence while moving across multiple product domains.
- What would happen if it didn’t exist: Navigation would be fragmented, role-specific access paths unclear, and UX consistency reduced.

## 3. Current Behavior

- What the system currently does:
- Root layout wraps all routes with `ThemeProvider`, `StoreProvider`, and `AuthProvider`.
- Theme state initializes from local storage and writes CSS class on `document.documentElement`.
- Landing layout shows top menu (`MenuHeader`) and footer.
- Internal/Admin layouts show side menu (`MenuInternal`) and authenticated header (`LoginHeader`).
- `MenuInternal` dynamically builds menu items by group membership (`user`, `blackdesert`, `financial`, `admin`).
- `ThemeControl` toggle is available in landing and authenticated headers.
- Selected side-menu state is managed per page by dispatching `setSelectedMenu`.

- Real behavior based on code:
- Theme is persisted under `localStorage.theme` and restored before render.
- Header unauthenticated actions include “Sign in/Sign up”, but linked signup flow is not fully wired in route structure.

- Key flows:
- Enter app -> theme restored -> proper shell rendered by route segment.
- User changes theme -> persisted and applied globally.
- Role-specific menu options appear/disappear based on fetched groups.

## 4. User Flows

### 4.1 Main Flow

1. User opens app.
2. System restores saved theme and applies it.
3. System renders landing or internal/admin shell depending on route.
4. If authenticated, menu displays role-specific items.
5. User navigates between feature pages via header/side menus.

### 4.2 Alternative Flows

1. User toggles theme icon; UI immediately switches light/dark and persists preference.
2. Admin user sees server and financial menu entries; standard user sees only permitted entries.

### 4.3 Error Scenarios

1. If theme context is consumed outside provider, hook throws runtime error.
2. If auth/group data not yet loaded, menu may render minimal base options temporarily.

## 5. Functional Requirements

- The system must render distinct shells for landing vs internal/admin route groups.
- The system must expose a theme toggle and persist selected theme.
- The system must build menus according to authentication status and groups.
- The system must allow pages to highlight active menu item through selected keys.
- The user can navigate to role-allowed destinations from menu entries.

## 6. Business Rules

- Base menu always includes Home.
- `user` group enables Account menu.
- `blackdesert` group enables Facetexture and Rank menus.
- `financial` group enables financial submenu (overview/contracts/invoices/payments/tags).
- `admin` group enables Server menu.
- Theme options are restricted to `light` and `dark`.

## 7. Data Model (Business View)

- Main entities:
- Theme preference: `light` or `dark`.
- Navigation state: selected menu keys.
- Access groups: array of user role strings.

- Relationships:
- Group membership drives menu composition.
- Theme state influences global design tokens and layout styling.

- Important fields (business meaning):
- `theme`: user presentation preference.
- `selectedMenu`: currently active navigation context.

## 8. Interfaces

- User interfaces (screens, pages):
- Landing header + footer shell.
- Internal/admin sider + header shell.
- Theme toggle control in headers.

- APIs (high-level, not low-level code):
- No direct feature-specific API; depends on auth/group data already loaded.

## 9. Dependencies

- Other features this depends on:
- Authentication/group loading.
- Feature pages dispatching selected menu updates.

- External systems (if any):
- Browser local storage.
- Ant Design theming system.

## 10. Limitations / Gaps

- Landing user dropdown contains a “Sair” entry without bound logout action.
- Header links reference routes that are not fully implemented (`/signin` for example).
- Theme system and color tokens are centralized but not all components appear fully aligned to tokens.

## 11. Opportunities

- Add fully wired account menu actions in landing header.
- Add route-safe guards for broken links in header actions.
- Add per-user server-side theme persistence for cross-device consistency.

## 12. Acceptance Criteria

- Given a returning user with saved theme, when app loads, then the saved theme is applied before main UI interaction.
- Given user toggles theme, when toggle action is clicked, then theme changes and persists in local storage.
- Given authenticated user groups, when side menu renders, then only authorized menu items are shown.
- Given page dispatches selected menu keys, when page mounts, then corresponding menu entry appears selected.

## 13. Assumptions

- Assumed group strings returned by backend are stable and complete.
- Assumed all route-level layouts remain the source of shell selection logic.
