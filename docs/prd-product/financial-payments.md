## 1. Feature Overview

- Name: Financial Payments Management
- Summary (what it does in simple terms): Manages payment records with filtering, pagination, detail editing, and single/bulk payoff operations.
- Target user: Financial/admin users.
- Business value (why this exists): Tracks cash movement and operationally closes open payments.

## 2. Problem Statement

- What problem this feature solves: Teams need a structured way to monitor open/closed payments and execute payment settlement workflows.
- What would happen if it didn’t exist: Payment lifecycle control would be manual, error-prone, and hard to audit.

## 3. Current Behavior

- What the system currently does:
- `/admin/financial/payments` lists payments with filters and table summary totals.
- Default filters include `active=true`, `status=0`, `page=1`, `page_size=20`.
- Filters supported: name, contract, status, type, date range, payment date range.
- Filter state syncs to URL query params via router push.
- Single payoff can be triggered from row action for open items only.
- Bulk payoff:
- User selects multiple open rows.
- Modal shows queued rows and processing status.
- “Processar” executes payoff calls for each selected payment and updates modal row descriptions.
- Detail page `/admin/financial/payments/details/[id]` allows editing name/type/payment date/value/fixed/active and saving.
- Detail page supports payoff action when status is open.

- Real behavior based on code:
- Bulk payoff marks each row status in modal but does not block repeated trigger during execution.
- In payment detail, value update ignores `0` due falsy guard (`if (!event) return`).

- Key flows:
- Query and filter open payments.
- Settle one payment from list/detail.
- Settle multiple payments from bulk modal.
- Edit payment attributes from detail page.

## 4. User Flows

### 4.1 Main Flow

1. User opens payments list.
2. System loads paginated open payments with default filters.
3. User applies filters and reviews results.
4. User settles a payment (single or bulk) and receives status feedback.
5. User opens details for deeper edits and saves.

### 4.2 Alternative Flows

1. User selects multiple payments, opens bulk modal, and processes all.
2. User edits payment attributes first, then performs payoff from detail page.
3. User clears filters to reset list to defaults.

### 4.3 Error Scenarios

1. Payoff API failure in bulk mode updates row description with backend error/fallback text.
2. Payoff API failure in single mode may leave row visually stale until next fetch.
3. Invalid filter combinations can produce empty lists without explicit guidance.

## 5. Functional Requirements

- The system must list payments with pagination and table summaries.
- The user can filter payments by text, status, type, contract, and date intervals.
- The system must support payoff action for open payments.
- The user can select multiple open payments and process payoff in bulk.
- The system must support payment detail editing and save.
- The system should disable bulk selection for already closed payments.

## 6. Business Rules

- Payment status: `0 = Em aberto`, `1 = Baixado`.
- Payment type: `0 = Credito`, `1 = Debito`.
- Row payoff action appears only for status `0`.
- Bulk selection checkboxes are disabled for status `1` rows.
- Table summary computes net total as credits minus debits and also per-type totals.
- List filters are URL-synchronized and re-fetch on any filter/pagination change.

## 7. Data Model (Business View)

- Main entities:
- Payment: id, status, type, name, date, installments, payment_date, fixed, active, value.
- Payment Detail: payment + linked invoice and contract references.
- Payoff Batch Row: id, status, processing description.

- Relationships:
- Payment belongs to one invoice and one contract (via detail references).
- Multiple payments can be batch-processed for payoff.

- Important fields (business meaning):
- `status`: open vs settled lifecycle.
- `fixed`: recurring/monthly indicator.
- `active`: operational enablement flag.

## 8. Interfaces

- User interfaces (screens, pages):
- `/admin/financial/payments` list page with filters and bulk payoff modal.
- `/admin/financial/payments/details/[id]` detail edit page.

- APIs (high-level, not low-level code):
- `GET /financial/payment/` (with filters).
- `GET /financial/payment/{id}/`.
- `POST /financial/payment/{id}/save`.
- `POST /financial/payment/{id}/payoff`.

## 9. Dependencies

- Other features this depends on:
- Financial contracts and invoices for contextual linking.
- Financial tags indirectly through invoice relationships.

- External systems (if any):
- Backend financial APIs.

## 10. Limitations / Gaps

- Payment creation modal component exists but is not wired in payments page UX.
- List shows “Em aberto” breadcrumb/title labels that are reused across other pages (inconsistent semantics).
- Value field cannot be set to zero in detail editor due guard condition.

## 11. Opportunities

- Add explicit bulk-processing progress lock and completion summary.
- Add create-payment flow directly in payments page.
- Add optimistic row update rollback for failed single payoff.
- Expand filters (invoice, tag, value range).

## 12. Acceptance Criteria

- Given payments page opens, when initial load finishes, then open payments are listed with default filters.
- Given user changes filters, when apply action runs, then URL query and table data update accordingly.
- Given open payment row, when user confirms payoff, then payment status changes to closed in list state.
- Given selected open rows, when user runs bulk process, then each row in modal receives progress/result status.
- Given payment detail edits, when user saves, then success feedback is shown.

## 13. Assumptions

- Assumed backend payoff endpoint enforces idempotency for repeated calls.
- Assumed filter parameter names are part of stable backend contract.
