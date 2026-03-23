## 1. Feature Overview

* Name
  Financial Tags Management
* Summary
  Admin module to create and list tags used for invoice classification.
* Purpose
  Enable category-based reporting and filtering dimensions for invoices.
* Business value
  Improves financial insight quality and grouping for analytics.

## 2. Current Implementation

* How it works today
  Tags page fetches tag list and opens modal for creating a new tag (`name` + `color`). After creation it refreshes list.
* Main flows
  List tags -> open modal -> submit new tag -> success message -> refetch.
* Entry points (routes, handlers, jobs)
  Route: `/admin/financial/tags`.
* Key files involved (list with paths)
  `src/app/admin/financial/tags/page.tsx`
  `src/lib/features/financial/tag/index.ts`
  `src/components/tags/modalNew/index.tsx`
  `src/services/financial/index.ts`

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend: page + Redux tag slice + modal component.
  Backend integration: `/financial/tag/` and `/financial/tag/new`.
* Data flow (step-by-step)
  Page mount -> `fetchTags` thunk -> table render.
  Modal submit -> `includeNewTagService` -> toast -> close modal -> refetch tags.
* External integrations
  AntD table/modal and color input.
* State management (if applicable)
  `financial.tag` slice for list/loading/modal visibility.

## 4. Data Model

* Entities involved
  Tag: `id,name,color`.
* Database tables / schemas
  No frontend DB.
* Relationships
  Tags are consumed by invoice and contract detail pages.
* Important fields
  `name`, `color`.

## 5. Business Rules

* Explicit rules implemented in code
  Tag name is required in creation form.
  Tag color is optional in UI (no required rule).
* Edge cases handled
  Modal visibility toggled by reducer regardless of loading state.
* Validation logic
  Minimal client validation only for `name` presence.

## 6. User Flows

* Normal flow
  Admin opens tags page -> creates new tag -> sees tag in list.
* Error flow
  No explicit catch path in creation handler; failures may not show user feedback.
* Edge cases
  Existing tags list still displayed when modal open/close toggles quickly.

## 7. API / Interfaces

* Endpoints
  `GET /financial/tag/`
  `POST /financial/tag/new`
* Input/output
  Creation payload currently typed in service as `{ name: string }`, while page sends `{ name, color }`.
* Contracts
  Service typing and caller payload are inconsistent for `color` field.
* Internal interfaces
  `changeVisibleModalTag`, `fetchTags`.

## 8. Problems & Limitations

* Technical debt
  Typing mismatch (`includeNewTagService` signature omits `color`) can hide regressions.
* Bugs or inconsistencies
  UI sends color but service type does not declare it.
* Performance issues
  Full list refetch after each create; no optimistic append.
* Missing validations
  No validation for color format or duplicate tag names.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  None beyond standard admin mutation surface.
* External code execution
  None observed.
* Unsafe patterns
  Missing explicit error handling can conceal backend rejection reasons.
* Injection risks
  Low in client; backend should validate color/name inputs.
* Hardcoded secrets
  None found.
* Unsafe file/system access
  None.

## 10. Improvement Opportunities

* Refactors
  Align service types with actual payload (`{name,color}`).
* Architecture improvements
  Add shared validation schema for tag creation.
* Scalability
  Add search/sort for large tag sets.
* UX improvements
  Show create loading state and inline validation for duplicate names/invalid color.

## 11. Acceptance Criteria

* Functional
  Admin can create tags with name and color and see them in list.
* Technical
  Service and UI payload typing are consistent.
  Errors on create are surfaced to user.
* Edge cases
  Invalid color values are rejected gracefully.
  Duplicate names are handled deterministically.

## 12. Open Questions

* Unknown behaviors
  Backend uniqueness constraints for tag names are not visible.
* Missing clarity in code
  Whether color is mandatory by business rule.
* Assumptions made
  Assumed tags are global and shared across financial entities.
