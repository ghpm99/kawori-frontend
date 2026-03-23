## 1. Feature Overview

- Name: Financial Overview Analytics
- Summary (what it does in simple terms): Provides dashboard metrics and charts for payment totals, open/closed amounts, fixed entries, invoice-by-tag distribution, and accumulated difference trends.
- Target user: Financial/admin users.
- Business value (why this exists): Gives decision-ready visibility over financial performance and exposure.

## 2. Problem Statement

- What problem this feature solves: Stakeholders need consolidated financial insights without manually aggregating data.
- What would happen if it didn’t exist: Monitoring would be slower, less accurate, and dependent on external spreadsheets.

## 3. Current Behavior

- What the system currently does:
- `/admin/financial/overview` triggers multiple report fetches on load:
- Payment report series.
- Count of payments.
- Total payment amount.
- Open amount.
- Closed amount.
- Invoice amount by tag.
- Forecast reserve amount.
- Monthly payment aggregates.
- Dashboard renders:
- KPI cards for count and value totals.
- Monthly totals table with summary row.
- Multi-line chart (credit/debit/difference by month).
- Pie chart (invoice value by tag).
- Accumulated chart (accumulated difference vs forecast value).
- Fixed payments bar chart (fixed credit vs fixed debit).

- Real behavior based on code:
- Loading flag is mostly tied to payment report thunk lifecycle; secondary metrics may update after loading false.
- Charts adapt background style based on current theme.

- Key flows:
- Open overview -> fetch all report endpoints -> render cards/table/charts.

## 4. User Flows

### 4.1 Main Flow

1. User opens overview page.
2. System loads all report datasets.
3. User reviews KPI cards, monthly table, and charts.
4. User uses visuals to identify trends and category concentrations.

### 4.2 Alternative Flows

1. User switches theme; charts update styling while preserving data.
2. User cross-checks table totals against cards and chart series.

### 4.3 Error Scenarios

1. Partial report failures can produce incomplete dashboard sections without section-specific error messaging.
2. Empty datasets render charts with minimal/no data context.

## 5. Functional Requirements

- The system must fetch and display financial KPI cards.
- The system must show monthly aggregate table with totals summary.
- The system must render payment trend chart (credit/debit/difference).
- The system must render invoice-by-tag distribution chart.
- The system must render accumulated value vs reserve chart.
- The system must render fixed-payment comparison chart.

## 6. Business Rules

- Monthly table “Total” cell displays separate credit (+green) and debit (-volcano) tags.
- Summary row aggregates current table dataset values.
- KPI amounts are formatted in BRL.
- Accumulated chart overlays constant reserve line from `amountForecastValue`.

## 7. Data Model (Business View)

- Main entities:
- KPI Metrics: countPayment, amountPayment, amountPaymentOpen, amountPaymentClosed.
- Payment Chart Point: label (month), debit, credit, difference, accumulated.
- Fixed Metrics: fixed_credit, fixed_debit.
- Invoice-by-Tag metric: tag id/name/color + amount.
- Monthly Rollup row: total_value_credit/debit/open/closed and total_payments.

- Relationships:
- Dashboard combines independent report datasets into unified analytical view.

- Important fields (business meaning):
- `difference` and `accumulated`: net movement and cumulative trajectory.
- `amountForecastValue`: threshold/reserve benchmark.

## 8. Interfaces

- User interfaces (screens, pages):
- `/admin/financial/overview` dashboard.
- Cards + table + charts components.

- APIs (high-level, not low-level code):
- `GET /financial/report/`.
- `GET /financial/report/count_payment`.
- `GET /financial/report/amount_payment`.
- `GET /financial/report/amount_payment_open`.
- `GET /financial/report/amount_payment_closed`.
- `GET /financial/report/amount_invoice_by_tag`.
- `GET /financial/report/amount_forecast_value`.
- `GET /financial/payment/month/`.

## 9. Dependencies

- Other features this depends on:
- Payments, invoices, and tags domain data quality.

- External systems (if any):
- Backend reporting endpoints.
- Chart.js visualization library.

## 10. Limitations / Gaps

- No configurable date range filters on overview page.
- Incomplete per-widget error handling for partial API failures.
- No drill-down interaction from charts/cards to transactional lists.

## 11. Opportunities

- Add period filtering and comparison mode.
- Add click-through drill-down from metrics to payments/invoices lists.
- Add explicit widget-level loading/error states.

## 12. Acceptance Criteria

- Given overview page load, when report APIs succeed, then KPI cards, table, and all charts render with returned data.
- Given monthly table data, when summary row renders, then totals equal sum of displayed rows.
- Given tag report data, when invoice-by-tag chart renders, then slices use tag names and colors.
- Given forecast value exists, when accumulated chart renders, then reserve line is shown across all labels.

## 13. Assumptions

- Assumed backend report endpoints return mutually consistent periods and currency semantics.
- Assumed reserve/forecast amount is a single scalar policy value for current dashboard scope.
