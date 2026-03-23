## 1. Feature Overview

- Name: Server Maintenance - Contract Recalculation
- Summary (what it does in simple terms): Provides an admin-only action to recompute contract financial values in bulk.
- Target user: Admin users.
- Business value (why this exists): Ensures contract aggregates can be repaired/re-synced when transactional drift occurs.

## 2. Problem Statement

- What problem this feature solves: Contract totals may need explicit recalculation after data migrations, corrections, or backend inconsistencies.
- What would happen if it didn’t exist: Operators would rely on manual recalculation or inconsistent stale totals.

## 3. Current Behavior

- What the system currently does:
- `/admin/server` renders one primary action button: “Calcular valores contratos”.
- Clicking action shows loading message and calls `POST /financial/contract/update_all_contracts_value`.
- Success response message is displayed with shared message key.
- Same recalculation action is also exposed in contracts list area.

- Real behavior based on code:
- Action has no explicit error handling path on this page.
- No progress detail or affected-record count is displayed.

- Key flows:
- Admin enters server page -> triggers contract recalculation -> receives success toast.

## 4. User Flows

### 4.1 Main Flow

1. Admin opens server page.
2. Admin clicks recalculation button.
3. System runs backend recalculation endpoint.
4. System shows completion message.

### 4.2 Alternative Flows

1. Admin runs same recalculation from contracts page shortcut.

### 4.3 Error Scenarios

1. If API fails, page currently has no explicit error message handler.
2. User cannot inspect partial success/failure details from UI.

## 5. Functional Requirements

- The system must expose a privileged trigger for contract total recalculation.
- The system must display operation-in-progress feedback.
- The system should display completion feedback message from backend.

## 6. Business Rules

- Feature is available only in admin navigation context.
- Recalculation operation is global (all contracts), not scoped by filter.

## 7. Data Model (Business View)

- Main entities:
- Recalculation Job Trigger: admin action invoking backend process.
- Contract Aggregate Values: value, value_open, value_closed fields recalculated server-side.

- Relationships:
- Trigger affects all contract records.

- Important fields (business meaning):
- Aggregate values represent source-of-truth totals used across financial pages.

## 8. Interfaces

- User interfaces (screens, pages):
- `/admin/server` button action.
- Secondary trigger in `/admin/financial/contracts` header component.

- APIs (high-level, not low-level code):
- `POST /financial/contract/update_all_contracts_value`.

## 9. Dependencies

- Other features this depends on:
- Contracts, invoices, and payments data integrity.

- External systems (if any):
- Backend recalculation routine.

## 10. Limitations / Gaps

- No error handling in current trigger implementation.
- No confirmation dialog before global recalculation.
- No audit log or result summary in UI.

## 11. Opportunities

- Add confirmation and impact messaging before execution.
- Add completion report (contracts recalculated, duration, failures).
- Add role-based secondary permission for operation-critical actions.

## 12. Acceptance Criteria

- Given admin opens server page, when clicking recalculation, then loading feedback appears.
- Given backend success response, when recalculation finishes, then success message is shown.
- Given non-admin user, when attempting to access admin context, then user is redirected away by admin guard.

## 13. Assumptions

- Assumed backend operation is idempotent and safe to trigger multiple times.
- Assumed recalculation endpoint returns user-facing `msg` string.
