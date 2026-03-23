## 1. Feature Overview

* Name
  Financial Contracts Management
* Summary
  Admin module to list contracts, create new contracts, inspect contract totals, merge contracts, and include invoices under a contract.
* Purpose
  Organize financial obligations/income under contract entities and maintain rolled-up totals.
* Business value
  Gives a higher-level financial structure and supports reconciliation across invoices/payments.

## 2. Current Implementation

* How it works today
  Contracts list supports pagination and creation modal. Contract detail page loads contract metadata plus paginated invoices, and exposes actions for adding invoice and merging other contracts into the current one.
* Main flows
  List contracts -> optional “Novo” contract creation.
  Recalculate all values -> call `update_all_contracts_value` action.
  Detail page -> load contract + invoices + available contracts + tags.
  Include invoice -> modal form -> backend create -> refetch detail and invoice list.
  Merge contracts -> select multiple ids -> merge call -> refresh details.
* Entry points (routes, handlers, jobs)
  Routes: `/admin/financial/contracts`, `/admin/financial/contracts/details/[id]`.
* Key files involved (list with paths)
  `src/app/admin/financial/contracts/page.tsx`
  `src/app/admin/financial/contracts/details/[id]/page.tsx`
  `src/lib/features/financial/contract/index.ts`
  `src/lib/features/financial/contract/detail/index.ts`
  `src/components/contracts/modalNew/index.tsx`
  `src/components/contracts/modalNewInvoice/index.tsx`
  `src/components/financial/contracts/openModalNewContract/index.tsx`
  `src/services/financial/index.ts`

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend: contracts list/detail pages + Redux slices.
  Backend integration: `/financial/contract/*` and dependent invoice/tag endpoints.
* Data flow (step-by-step)
  List filters/pagination -> fetch contracts -> render table and totals.
  Detail route id -> fetch specific contract and invoice pagination -> modal actions trigger create/merge endpoints -> refetch affected datasets.
* External integrations
  AntD tables/forms/modals/dropdowns, dayjs.
* State management (if applicable)
  `financial.contract` slice for list/filter/modal; `financial.contractDetail` for detail, invoice sub-pagination, merge/newInvoice modals.

## 4. Data Model

* Entities involved
  Contract: `id,name,value,value_open,value_closed`.
  Contract detail invoice item: `id,name,status,installments,value,value_open,value_closed,date,tags[]`.
  Merge payload: `{ id, contracts:number[] }`.
* Database tables / schemas
  No frontend DB.
* Relationships
  Contract has many invoices; invoices have tags.
* Important fields
  `value_open`, `value_closed`, merge selected ids, invoice pagination metadata.

## 5. Business Rules

* Explicit rules implemented in code
  Merge options exclude current contract id.
  New invoice form captures type/name/date/installments/payment date/value/tags/fixed.
  Contract totals recalculation action available in list/header and server page.
* Edge cases handled
  Invoice list has independent loading state from contract detail loading.
* Validation logic
  New contract requires `name`.
  New invoice modal enforces required fields for most inputs.

## 6. User Flows

* Normal flow
  Admin opens contracts -> creates contract -> opens details -> adds invoices and/or merges contracts -> views updated totals.
* Error flow
  Most action calls lack explicit catch handlers in detail flow; failed requests may fail silently in UI.
* Edge cases
  Merge modal supports multi-select with search filtering.

## 7. API / Interfaces

* Endpoints
  `GET /financial/contract/`
  `POST /financial/contract/new`
  `GET /financial/contract/{id}/`
  `GET /financial/contract/{id}/invoices/`
  `POST /financial/contract/{id}/invoice/`
  `POST /financial/contract/{id}/merge/`
  `POST /financial/contract/update_all_contracts_value`
* Input/output
  Contract list/detail return pagination + monetary aggregates.
* Contracts
  Detail invoice fetch tracks local filters and updates nested pagination object.
* Internal interfaces
  Reducers: modal visibility, merge id selection, filter/pagination setters.

## 8. Problems & Limitations

* Technical debt
  Placeholder handlers (`save`, `changeName`) in detail page are no-op console logs.
* Bugs or inconsistencies
  Error handling is inconsistent; several promise chains omit catch blocks.
* Performance issues
  Multiple refetches triggered after invoice creation without batching.
* Missing validations
  No client validation for duplicate merge targets or self-merge beyond filtered options.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  High-impact financial operations (merge, recalc all contracts) are one-click frontend actions.
* External code execution
  None observed.
* Unsafe patterns
  Mutating operations rely on frontend role gating; must be server-authorized.
* Injection risks
  Low in UI layer; backend must validate numeric/date payloads.
* Hardcoded secrets
  None found.
* Unsafe file/system access
  None.

## 10. Improvement Opportunities

* Refactors
  Implement missing save/edit contract behavior or remove placeholder controls.
* Architecture improvements
  Centralize financial action notifications and error handling utilities.
* Scalability
  Add optimistic updates or partial cache invalidation instead of full refetch after mutations.
* UX improvements
  Add confirmations and impact previews for merge/recalculate actions.

## 11. Acceptance Criteria

* Functional
  Admin can list/create/view contracts, add invoice, and merge contracts.
  Contract detail totals refresh after mutations.
* Technical
  All contract mutations show success and failure feedback.
  No placeholder actions remain in production UI.
* Edge cases
  Merge cannot include current contract id.
  Empty invoice list still renders detail page safely.

## 12. Open Questions

* Unknown behaviors
  Backend merge semantics for invoices/payments ownership after merge are not visible.
* Missing clarity in code
  Whether contract name edits are intended but unfinished.
* Assumptions made
  Assumed backend recalculation endpoint is restricted and idempotent.
