## 1. Feature Overview

* Name
  Financial Invoices Management
* Summary
  Admin module to list invoices, inspect invoice-level amounts, manage tags, and view linked payments.
* Purpose
  Track invoice state and its payment breakdown.
* Business value
  Enables reconciliation between contract obligations and payment execution.

## 2. Current Implementation

* How it works today
  Invoice list page fetches paginated invoices and shows summary totals. Invoice detail page loads invoice metadata + paginated payment rows and supports tag assignment updates.
* Main flows
  List invoices -> paginate and open detail links.
  Detail invoice -> load invoice and payments -> edit tags via multi-select -> save tags through API.
* Entry points (routes, handlers, jobs)
  Routes: `/admin/financial/invoices`, `/admin/financial/invoices/details/[id]`.
* Key files involved (list with paths)
  `src/app/admin/financial/invoices/page.tsx`
  `src/app/admin/financial/invoices/details/[id]/page.tsx`
  `src/lib/features/financial/invoice/index.ts`
  `src/lib/features/financial/invoice/detail/index.ts`
  `src/services/financial/index.ts`

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend: list/detail pages + Redux invoice slices.
  Backend integration: `/financial/invoice/*` and `/financial/tag/*`.
* Data flow (step-by-step)
  List page sets filters/pagination -> fetch invoices -> render table.
  Detail page loads invoice + payments + tags -> tag select triggers save API -> payment pagination fetches page-by-page.
* External integrations
  AntD table/select/dropdown components.
* State management (if applicable)
  `financial.invoice` for list; `financial.invoiceDetail` for detail/payments; `financial.tag` reused for tag options.

## 4. Data Model

* Entities involved
  Invoice: `id,status,name,installments,value,value_open,value_closed,date,contract,tags[]`.
  Invoice detail payments reuse payment row fields.
  Tag: `id,name,color`.
* Database tables / schemas
  No frontend DB.
* Relationships
  Invoice belongs to contract; invoice has many payments; invoice has many tags.
* Important fields
  `status`, monetary split fields, `tags` array, payments pagination.

## 5. Business Rules

* Explicit rules implemented in code
  Tags are saved as list of selected tag ids to `POST /financial/invoice/{id}/tags`.
  Invoice detail payment table supports page/page_size fetch updates.
* Edge cases handled
  Tag save displays success only when HTTP status is 200.
* Validation logic
  Tag selector accepts freeform `mode='tags'`, but save maps selected options to ids.

## 6. User Flows

* Normal flow
  Admin opens invoices list -> opens invoice detail -> reviews payments -> adjusts tags.
* Error flow
  Tag save failure logs error and shows generic failure message.
* Edge cases
  Invoice detail includes placeholder menu action “Incluir nova nota” but action is not implemented.

## 7. API / Interfaces

* Endpoints
  `GET /financial/invoice/`
  `GET /financial/invoice/{id}/`
  `GET /financial/invoice/{id}/payments/`
  `POST /financial/invoice/{id}/tags`
  `GET /financial/tag/`
* Input/output
  Tags update payload: `number[]` of tag ids.
* Contracts
  Invoice payments thunk type prefix is malformed (`"financial/"`), but reducer still references thunk action objects.
* Internal interfaces
  Invoice reducers for filter/pagination + detail thunks.

## 8. Problems & Limitations

* Technical debt
  Detail page has placeholder `save`, `changeName`, and include-new-invoice handlers doing only `console.log`.
* Bugs or inconsistencies
  `Select` uses `defaultValue` for tags from initial data; may not react to async data changes as expected.
  Invoice list header has filter button with no implemented filter modal.
* Performance issues
  Frequent full-detail reloads may occur without memoization.
* Missing validations
  No explicit validation of selected tag values before submit.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  Tag mutation endpoint is directly callable from UI without secondary confirmation.
* External code execution
  None observed.
* Unsafe patterns
  Console logging in production paths can leak operational details in browser console.
* Injection risks
  Low in current UI; backend should validate tag ids and invoice ownership.
* Hardcoded secrets
  None found.
* Unsafe file/system access
  None.

## 10. Improvement Opportunities

* Refactors
  Complete or remove placeholder detail actions.
* Architecture improvements
  Normalize invoice detail edit operations under typed command handlers.
* Scalability
  Add server-side filtering/sorting for invoice list similar to payments.
* UX improvements
  Replace `defaultValue` with controlled `value` for tag selector and show in-flight save indicator.

## 11. Acceptance Criteria

* Functional
  Admin can list invoices, open detail, and update tags successfully.
  Linked payments table paginates correctly.
* Technical
  Placeholder actions are resolved or hidden.
  Invoice payments thunk uses clear/valid action type prefix.
* Edge cases
  Tag load/save failures are surfaced with actionable error feedback.
  Empty payments list renders cleanly.

## 12. Open Questions

* Unknown behaviors
  Whether invoice name/status editing is planned for this page.
* Missing clarity in code
  Expected semantics of “Incluir nova nota” action inside invoice detail.
* Assumptions made
  Assumed backend enforces tag membership constraints and auth checks.
