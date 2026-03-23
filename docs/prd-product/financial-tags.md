## 1. Feature Overview

- Name: Financial Tags Management
- Summary (what it does in simple terms): Manages reusable tag catalog (name + color) used to classify invoices.
- Target user: Financial/admin users.
- Business value (why this exists): Enables categorization needed for reporting and spend/income segmentation.

## 2. Problem Statement

- What problem this feature solves: Financial records need semantic labels for analysis and organization.
- What would happen if it didn’t exist: Invoice classification and tag-based reporting would not be possible.

## 3. Current Behavior

- What the system currently does:
- `/admin/financial/tags` lists tags with id and colored label.
- “Novo” button opens modal to create tag.
- Create form requires `name`; `color` is optional color input.
- After successful creation, modal closes and list refreshes.
- Tags are consumed by invoice detail and contract-invoice creation forms.

- Real behavior based on code:
- Page breadcrumb/title text still says “Em aberto/Valores em aberto”, not tag-specific.

- Key flows:
- Load tag list.
- Create a new tag.
- Reuse tags in invoice tagging flows.

## 4. User Flows

### 4.1 Main Flow

1. User opens tags page.
2. System fetches current tags.
3. User opens new-tag modal and submits name/color.
4. System creates tag and refreshes list.

### 4.2 Alternative Flows

1. User creates tag without custom color (uses backend/default handling).
2. User closes modal without creating tag.

### 4.3 Error Scenarios

1. Tag creation errors are not explicitly handled in page code (no catch path).
2. Fetch failures result in loading/error behavior limited to Redux loading state.

## 5. Functional Requirements

- The system must list all tags.
- The user can create a tag with name and optional color.
- The system must display tag color in list entries.
- The system should refresh tag list after successful creation.

## 6. Business Rules

- Tag name is mandatory in create form.
- Tag color is stored as string and used for UI rendering.
- Tag records are shared across financial features that support tagging.

## 7. Data Model (Business View)

- Main entities:
- Tag: id, name, color.

- Relationships:
- Tags are assigned to invoices (many-to-many).

- Important fields (business meaning):
- `name`: classification label.
- `color`: visual coding for dashboards/tables.

## 8. Interfaces

- User interfaces (screens, pages):
- `/admin/financial/tags`.
- New tag modal.

- APIs (high-level, not low-level code):
- `GET /financial/tag/`.
- `POST /financial/tag/new`.

## 9. Dependencies

- Other features this depends on:
- Invoices feature (tag assignment).
- Overview analytics (invoice-by-tag chart).

- External systems (if any):
- Backend financial API.

## 10. Limitations / Gaps

- No edit/delete tag operations in UI.
- Missing explicit error feedback on create failure.
- Tag page labels are copied from financial open-values context and are semantically inaccurate.

## 11. Opportunities

- Add update/delete lifecycle for tags.
- Add duplicate-name validation and user feedback.
- Improve tag page terminology and information architecture.

## 12. Acceptance Criteria

- Given tags page loads, when fetch succeeds, then all tags are shown with color styling.
- Given user submits valid new tag, when API succeeds, then success message appears and tag list refreshes.
- Given modal cancel action, when user cancels, then modal closes without data changes.

## 13. Assumptions

- Assumed backend ensures tag uniqueness or handles duplicates according to server policy.
- Assumed color format accepted by backend matches HTML color input output.
