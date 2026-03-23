## 1. Feature Overview

- Name: Financial Invoices Management
- Summary (what it does in simple terms): Lists invoices, shows invoice financial status, allows tag assignment, and exposes linked payment records.
- Target user: Financial/admin users.
- Business value (why this exists): Tracks receivable/payable document state and categorization for reporting and operational workflows.

## 2. Problem Statement

- What problem this feature solves: Teams need invoice-level tracking and category tagging to monitor outstanding value and payment breakdown.
- What would happen if it didn’t exist: Financial analysis and payment traceability would be weaker and less auditable.

## 3. Current Behavior

- What the system currently does:
- `/admin/financial/invoices` shows paginated invoice list with value totals and tags.
- Default filters include `status=0`, page, and page size.
- Invoice detail `/admin/financial/invoices/details/[id]` displays:
- Invoice metadata (contract, name, status, installments, date, totals).
- Editable name UI (non-persistent currently).
- Tags multi-select; updates persisted by API call.
- Paginated linked payments table with links to payment details.
- Header dropdown includes “Incluir nova nota” entry but action is placeholder.

- Real behavior based on code:
- Tag updates are saved immediately through `saveInvoiceTagsService` and success/error messages are displayed.
- Dropdown save/name-edit handlers are stubs (`console.log`) and do not persist invoice fields.

- Key flows:
- Review invoice list and totals.
- Drill into one invoice.
- Assign/remove tags.
- Inspect linked payments and navigate to payment details.

## 4. User Flows

### 4.1 Main Flow

1. User opens invoices list.
2. System loads paginated invoice records with summary row.
3. User opens invoice detail.
4. User adjusts tags and reviews associated payments.

### 4.2 Alternative Flows

1. User navigates from invoice detail to linked contract detail.
2. User navigates from invoice detail payment rows to payment detail page.

### 4.3 Error Scenarios

1. Tag-save API failure shows “Falhou em atualizar tags”.
2. Invoice detail save/name actions currently do nothing (no persistence).
3. If invoice has no linked payments, table renders empty without specific helper text.

## 5. Functional Requirements

- The system must list invoices with pagination and summary totals.
- The system must display invoice financial breakdown (total, open, closed).
- The user can assign tags to an invoice.
- The system must show linked payments for an invoice with pagination.
- The user can navigate to related contract and payment details.

## 6. Business Rules

- Invoice status mapping: `0 = Em aberto`, otherwise displayed as `Baixado`.
- Invoice list default filter includes open status.
- Tag assignment endpoint receives selected tag IDs as payload.
- Summary row on list computes table-page totals for `value`, `value_open`, and `value_closed`.

## 7. Data Model (Business View)

- Main entities:
- Invoice: id, status, name, installments, value, value_open, value_closed, date, contract reference, tags.
- Invoice Payment: payment rows linked to invoice.
- Tag: id, name, color.

- Relationships:
- One contract has many invoices.
- One invoice has many payments.
- Many-to-many relation between invoices and tags.

- Important fields (business meaning):
- `value_open`: outstanding invoice amount.
- `tags`: business categorization for analysis.

## 8. Interfaces

- User interfaces (screens, pages):
- `/admin/financial/invoices`.
- `/admin/financial/invoices/details/[id]`.

- APIs (high-level, not low-level code):
- `GET /financial/invoice/`.
- `GET /financial/invoice/{id}/`.
- `GET /financial/invoice/{id}/payments/`.
- `POST /financial/invoice/{id}/tags`.

## 9. Dependencies

- Other features this depends on:
- Tags feature for classification.
- Payments feature for child transaction visibility.
- Contracts feature for parent linkage.

- External systems (if any):
- Backend financial APIs.

## 10. Limitations / Gaps

- Invoice field editing save flow is unfinished.
- “Incluir nova nota” action in detail dropdown is placeholder.
- List page has a filter button that currently has no implemented filter logic.

## 11. Opportunities

- Complete invoice metadata edit/save workflow.
- Implement invoice-creation from invoice detail dropdown.
- Add full filter controls on list page (name/date/status/tag).

## 12. Acceptance Criteria

- Given invoices page load, when API returns records, then invoice list and summary totals are shown.
- Given user opens invoice detail, when data loads, then invoice metadata and linked payments are displayed.
- Given user changes invoice tags, when save API succeeds, then success message is shown and tags remain selected.
- Given user clicks linked payment or contract references, when navigation occurs, then corresponding detail page opens.

## 13. Assumptions

- Assumed backend validates tag IDs and returns standard success/error schema used by UI messages.
- Assumed invoice status lifecycle changes are managed primarily through payment settlement and backend logic.
