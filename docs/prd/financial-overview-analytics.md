## 1. Feature Overview

* Name
  Financial Overview Analytics
* Summary
  Dashboard showing aggregate payment metrics, monthly totals, and multiple charts (payments trend, fixed values, invoice-by-tag, accumulated vs reserve).
* Purpose
  Provide at-a-glance financial health indicators for admins.
* Business value
  Accelerates decision-making with consolidated KPIs and trend visualizations.

## 2. Current Implementation

* How it works today
  Overview page dispatches multiple report thunks on mount and binds outputs to cards, summary table, and chart components.
* Main flows
  Mount -> fetch count/amount/open/closed/payment-report/invoice-by-tag/forecast/monthly data -> render KPIs and charts.
* Entry points (routes, handlers, jobs)
  Route: `/admin/financial/overview`.
* Key files involved (list with paths)
  `src/app/admin/financial/overview/page.tsx`
  `src/lib/features/financial/overview/index.ts`
  `src/services/financial/overview/index.ts`
  `src/components/overview/cards/index.tsx`
  `src/components/overview/paymentWithFixed/index.tsx`
  `src/components/overview/paymentWithoutFixed/index.tsx`
  `src/components/overview/paymentFixed/index.tsx`
  `src/components/overview/invoiceByTag/index.tsx`

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend: dashboard page + reusable chart widgets + Redux overview slice.
  Backend integration: `/financial/report/*` and `/financial/payment/month/`.
* Data flow (step-by-step)
  Dispatch all report thunks -> reducers map response fragments into overview state -> components consume store slices and render.
* External integrations
  Chart.js + react-chartjs-2, AntD tables/cards/tags.
* State management (if applicable)
  `financial.overview` maintains all KPI and chart datasets.

## 4. Data Model

* Entities involved
  `IPaymentCharts`, `IPaymentMonth`, `IInvoiceByTag`, scalar KPI counters/amounts.
* Database tables / schemas
  No frontend DB.
* Relationships
  Monthly table and line charts derive from payment report datasets; invoice-by-tag chart derives from tag aggregate amounts.
* Important fields
  `fixed_credit`, `fixed_debit`, `amountForecastValue`, `amountPaymentOpen`, `amountPaymentClosed`.

## 5. Business Rules

* Explicit rules implemented in code
  Overview sets selected menu path to `financial/overview`.
  Table summary computes totals for credit/debit/open/closed/payments across visible rows.
* Edge cases handled
  Cards and table support loading state via overview slice loading flag.
* Validation logic
  No explicit validation; assumes backend returns numeric-compatible values.

## 6. User Flows

* Normal flow
  Admin opens overview -> sees KPI cards and charts populated after data fetch.
* Error flow
  No explicit per-widget error UI; failures rely on global loading/effects state.
* Edge cases
  Zero/empty datasets still render chart containers.

## 7. API / Interfaces

* Endpoints
  `GET /financial/report/`
  `GET /financial/report/count_payment`
  `GET /financial/report/amount_payment`
  `GET /financial/report/amount_payment_open`
  `GET /financial/report/amount_payment_closed`
  `GET /financial/report/amount_invoice_by_tag`
  `GET /financial/report/amount_forecast_value`
  `GET /financial/payment/month/`
* Input/output
  Outputs include aggregated numeric values and time-series arrays.
* Contracts
  Reducers expect responses with `{ data: ... }` shape.
* Internal interfaces
  Overview slice extraReducers map each report thunk individually.

## 8. Problems & Limitations

* Technical debt
  Many independent calls on mount increase coupling and request fan-out.
* Bugs or inconsistencies
  Overview loading flag is only tied strongly to payment report thunk, not all report calls.
* Performance issues
  Parallel report requests can stress backend and increase initial dashboard latency.
* Missing validations
  No numeric guards before chart rendering.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  Exposes sensitive financial aggregates in frontend; strict backend role enforcement required.
* External code execution
  None observed.
* Unsafe patterns
  No explicit client-side authorization checks beyond layout role gating.
* Injection risks
  Low in chart rendering layer.
* Hardcoded secrets
  None found.
* Unsafe file/system access
  None.

## 10. Improvement Opportunities

* Refactors
  Consolidate report fetches into single backend aggregate endpoint.
* Architecture improvements
  Add per-widget request/error states and fallback datasets.
* Scalability
  Introduce caching/revalidation windows for expensive report endpoints.
* UX improvements
  Render partial data progressively with explicit widget-level skeleton/error badges.

## 11. Acceptance Criteria

* Functional
  Dashboard displays all defined KPIs, monthly table, and charts.
* Technical
  Report fetch failures are visible per widget without breaking whole page.
  Loading state reflects completion of all required data sources.
* Edge cases
  Empty datasets render non-crashing chart placeholders.
  Currency formatting remains consistent for zero/negative values.

## 12. Open Questions

* Unknown behaviors
  Expected refresh cadence and staleness tolerance for financial report data.
* Missing clarity in code
  Whether forecast value should be user-configurable or fixed server-calculated.
* Assumptions made
  Assumed report endpoints are pre-aggregated and optimized server-side.
