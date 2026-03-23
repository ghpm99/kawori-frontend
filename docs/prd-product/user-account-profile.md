## 1. Feature Overview

- Name: User Account Profile
- Summary (what it does in simple terms): Provides authenticated users a profile page with personal/account metadata and quick signout.
- Target user: Logged-in users with `user` group access.
- Business value (why this exists): Gives users transparency into account state and identity data, improving trust and self-service.

## 2. Problem Statement

- What problem this feature solves: Users need to view core account details without contacting support.
- What would happen if it didn’t exist: Users would lack visibility into profile information and account status context.

## 3. Current Behavior

- What the system currently does:
- Internal menu exposes “Conta” for `user` group members.
- `/internal/user` displays avatar, name, username, email, first/last name, last login, join date, and active status.
- Avatar border color is mapped by group priority: admin (blue), financial (violet), blackdesert (green), user (red).
- “Deslogar” button navigates to `/signout`.
- Landing page user panel also shows basic profile summary and quick-access links.

- Real behavior based on code:
- First/last name UI appears editable (`Typography.Paragraph editable`) but no persistence handler is implemented.
- Password area only displays static “Alterar senha” text.

- Key flows:
- Authenticated user opens profile from internal menu.
- User reads account info and optionally signs out.

## 4. User Flows

### 4.1 Main Flow

1. User signs in and accesses internal area.
2. User clicks “Conta” in left menu.
3. System renders profile details from auth store.
4. User can sign out from page action.

### 4.2 Alternative Flows

1. User checks summary from landing user panel instead of internal profile page.
2. User accesses quick links in landing panel to jump to profile/facetexture/rank pages.

### 4.3 Error Scenarios

1. If user data is not yet available, fields render empty strings.
2. If unauthorized/inactive, internal layout redirects user to home before profile page use.

## 5. Functional Requirements

- The system must display authenticated user identity fields and account timestamps.
- The system must show a visible active/inactive indicator in landing panel and active status in profile.
- The user can navigate to signout from profile page.
- The system should provide group-aware visual identity (avatar border color) on profile page.

## 6. Business Rules

- Access to profile page requires authenticated user via internal layout guard.
- Menu entry “Conta” is shown only if groups include `user`.
- Group color precedence for profile border is evaluated in order: admin, financial, blackdesert, user.

## 7. Data Model (Business View)

- Main entities:
- User: name, username, first_name, last_name, email, date_joined, last_login, image, is_active.
- User Groups: collection of role strings.

- Relationships:
- One user has many group labels.
- Group membership influences page/menu visibility and visual styling.

- Important fields (business meaning):
- `is_active`: operational account state.
- `date_joined`, `last_login`: lifecycle indicators.

## 8. Interfaces

- User interfaces (screens, pages):
- `/internal/user` profile screen.
- Landing user panel in `/` when authenticated.

- APIs (high-level, not low-level code):
- Relies on auth provider-loaded profile and groups from `/profile/` and `/profile/groups/`.

## 9. Dependencies

- Other features this depends on:
- Authentication/session feature.
- Internal layout and role-based menu rendering.

- External systems (if any):
- Backend profile endpoints.

## 10. Limitations / Gaps

- Editable name fields do not persist changes.
- Password change is not implemented from profile UI.
- Status text in profile page is hardcoded “Ativo” and does not reflect `is_active` dynamically there.

## 11. Opportunities

- Add profile update API integration for editable fields.
- Add password change workflow entry from profile page.
- Unify status display logic between landing panel and profile page.

## 12. Acceptance Criteria

- Given an authenticated user with `user` group, when visiting `/internal/user`, then profile details are displayed.
- Given user group combinations, when profile renders, then avatar border color follows configured precedence.
- Given user clicks “Deslogar” on profile page, when action executes, then user is redirected through signout flow.
- Given unauthenticated or inactive user, when attempting internal access, then user is redirected to `/`.

## 13. Assumptions

- Assumed profile data is already fetched by auth provider before or during page use.
- Assumed current editable fields are intentionally non-persistent placeholders.
