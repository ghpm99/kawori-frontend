## 1. Feature Overview

- Name: Financial Contracts Management
- Summary (what it does in simple terms): Maintains financial contracts, their aggregated values, linked invoices, and contract merge operations.
- Target user: Financial/admin users.
- Business value (why this exists): Provides top-level financial grouping and roll-up control for downstream invoice/payment tracking.

## 2. Problem Statement

- What problem this feature solves: Teams need a parent-level structure to organize invoices/payments and monitor contract-level exposure.
- What would happen if it didn’t exist: Financial records would be fragmented with limited aggregate visibility and maintenance controls.

## 3. Current Behavior

- What the system currently does:
- `/admin/financial/contracts` lists contracts with totals (`value`, `value_open`, `value_closed`) and pagination.
- Users can open modal to create new contract by name.
- Contract list includes “Calcular valores contratos” trigger (update-all recalculation endpoint).
- Contract detail page `/admin/financial/contracts/details/[id]` shows contract totals and paginated invoice list.
- Contract detail actions available from dropdown:
- Include new invoice (modal form with type/name/date/installments/payment date/value/tags/fixed).
- Merge contract (select multiple other contracts and merge into current one).
- Invoice table links to invoice detail page.

- Real behavior based on code:
- Editable contract name exists in UI but save handler is stubbed (no persistence).
- Contract merge modal supports search and multi-select, then posts selected contract IDs.
- Contract recalc action is duplicated in contracts page and separate server page.

- Key flows:
- Browse and paginate contracts.
- Create contract.
- Open contract detail, add invoice, or merge contracts.
- Trigger full contract value recalculation.

## 4. User Flows

### 4.1 Main Flow

1. User opens contracts list.
2. User selects a contract to inspect details.
3. System shows financial rollups and related invoices.
4. User adds new invoice or merges contracts as needed.

### 4.2 Alternative Flows

1. User creates a new contract directly from list modal.
2. User recalculates all contracts before analysis.
3. User navigates from contract invoice row to invoice detail for deeper operations.

### 4.3 Error Scenarios

1. Merge or new-invoice API failures are not consistently surfaced with explicit error handling in page logic.
2. Contract name edit does not persist due missing save implementation.
3. Loading states can hide partial update failures from user context.

## 5. Functional Requirements

- The system must list contracts with paginated aggregate values.
- The user can create a contract with a required name.
- The system must display contract-level totals (total, open, closed).
- The user can view invoices tied to a contract.
- The user can add a new invoice to a contract from detail page.
- The user can merge one or more contracts into the current contract.
- The system should allow triggering global contract-value recalculation.

## 6. Business Rules

- Contract list filters include page and page size (default 20).
- Contract detail invoice list defaults to page 1, page size 20.
- Merge options exclude current contract itself.
- New invoice created from contract detail is initialized with `status=0` and `active=true`.
- Monetary columns are displayed formatted in BRL.

## 7. Data Model (Business View)

- Main entities:
- Contract: id, name, value, value_open, value_closed.
- Contract Invoice: invoice records attached to contract with totals, tags, and schedule fields.
- Merge Request: target contract id + array of source contract ids.

- Relationships:
- One contract has many invoices.
- Contract merge consolidates multiple contracts into one target.

- Important fields (business meaning):
- `value_open`: outstanding exposure per contract.
- `value_closed`: settled amount per contract.

## 8. Interfaces

- User interfaces (screens, pages):
- `/admin/financial/contracts`.
- `/admin/financial/contracts/details/[id]`.
- New contract modal, new invoice modal, merge contract modal.

- APIs (high-level, not low-level code):
- `GET /financial/contract/`.
- `POST /financial/contract/new`.
- `GET /financial/contract/{id}/`.
- `GET /financial/contract/{id}/invoices/`.
- `POST /financial/contract/{id}/invoice/`.
- `POST /financial/contract/{id}/merge/`.
- `POST /financial/contract/update_all_contracts_value`.

## 9. Dependencies

- Other features this depends on:
- Invoice feature (creation/listing/detail drill-down).
- Tags feature (invoice tagging).

- External systems (if any):
- Backend financial APIs.

## 10. Limitations / Gaps

- Contract name edit UI does not persist to backend.
- Minimal explicit error handling for some mutation flows.
- Duplicate access point for global recalc action may confuse ownership.

## 11. Opportunities

- Implement contract name persistence and validation.
- Add post-merge preview/impact summary before confirmation.
- Add conflict safeguards when merging contracts with overlapping structures.

## 12. Acceptance Criteria

- Given contracts page load, when API returns data, then contracts list and totals are displayed with pagination.
- Given valid contract name, when user submits new contract modal, then new contract appears in list.
- Given contract detail page load, when API succeeds, then contract totals and invoice table are shown.
- Given invoice form submission on contract detail, when API succeeds, then invoice list refreshes.
- Given merge selection, when user confirms merge, then success feedback appears and contract details refresh.

## 13. Assumptions

- Assumed backend merge behavior defines source-contract archival or lifecycle post-merge.
- Assumed recalculation endpoint is authoritative for contract rollup correctness.
