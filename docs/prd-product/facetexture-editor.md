## 1. Feature Overview

- Name: Facetexture Editor
- Summary (what it does in simple terms): Allows Black Desert players to configure character selection visuals by managing character slots, class icons, custom image mapping, background, preview, and downloadable export.
- Target user: Authenticated users in `blackdesert` group.
- Business value (why this exists): Core product differentiator that delivers game customization value and user engagement.

## 2. Problem Statement

- What problem this feature solves: Users need an easier way to generate and manage custom facetexture assets for game character selection screens.
- What would happen if it didn’t exist: Users would rely on manual file editing, increasing complexity and reducing adoption.

## 3. Current Behavior

- What the system currently does:
- Landing page markets facetexture and links to `/admin/facetexture` (route target appears inconsistent with active implementation under `/internal/facetexture`).
- Internal facetexture page loads classes and existing characters from backend (`/facetexture/`, `/facetexture/class`).
- Background image is persisted in Dexie (`background` table); default `/media/background.jpg` is seeded if missing.
- Character images are resolved from local Dexie `image` table by filename when available.
- Character board supports drag-and-drop reorder and backend persistence (`/facetexture/{id}/reorder`).
- Selected character can be edited:
- Change class (`/change-class`).
- Toggle class icon visibility (`/change-visible`).
- Upload facetexture file (updates local preview URL and backend name via `/change-name`).
- Delete character (`/delete`).
- New character modal creates slots with class, visibility flag, and uploaded file name (`/facetexture/new`).
- Max character count is enforced at 44.
- Preview panel requests rendered image blob (`/facetexture/preview`) with icon style `P` (silver) or `G` (gold).
- Download action requests ZIP blob (`/facetexture/download`) and saves as `export.zip`.

- Real behavior based on code:
- Reorder logic currently blocks destination index `0` due `if (!indexDestination)` check.
- New character flow stores only uploaded file name in modal; no direct blob upload occurs in modal code.
- Uploaded replacement images are cached locally in Dexie by file name.

- Key flows:
- Load existing setup -> select character -> edit properties.
- Add/delete/reorder character entries.
- Update background -> generate preview -> download export.

## 4. User Flows

### 4.1 Main Flow

1. User opens `/internal/facetexture`.
2. System loads character/class data and local background.
3. User edits selected character (class, visibility, image reference) and/or reorders entries.
4. User updates preview with chosen icon style.
5. User downloads generated ZIP.

### 4.2 Alternative Flows

1. User adds a new character through modal and then edits it.
2. User changes only background and downloads without editing characters.
3. User restores visual consistency from local cached images after reload.

### 4.3 Error Scenarios

1. Backend request failures surface Ant message errors (class change, reorder, delete, preview, download).
2. Initial fetch failure sets facetexture error state and page loading flow ends.
3. Preview/download buttons are disabled when no character entries exist.

## 5. Functional Requirements

- The system must load existing facetexture characters and class catalog.
- The user can select character slots and modify class/icon visibility.
- The user can upload replacement image files per character.
- The user can add and delete character slots.
- The user can reorder characters via drag-and-drop.
- The system must persist custom background locally and support background cropping.
- The system must generate a preview image using selected icon style.
- The user can download generated facetexture export ZIP.
- The system should enforce a maximum of 44 characters.

## 6. Business Rules

- Character creation is invalid until class is selected and file name length is greater than 5.
- New character button is disabled at 44 characters.
- Icon style options are restricted to `P` and `G`.
- Default background is auto-seeded from `/media/background.jpg` when absent locally.
- Character image cache is keyed by file name in local database.

## 7. Data Model (Business View)

- Main entities:
- Facetexture Character: id, name, class, show flag, order, image preview URL.
- Class: id, name, abbreviation, class image/symbol.
- Background: image blob.
- Local Image Cache: file name + blob.
- Export Artifact: preview blob or zip file.

- Relationships:
- Each character references one class.
- Preview/export consume current character set + background + icon style.

- Important fields (business meaning):
- `show`: whether class icon appears in generated result.
- `order`: display/export order of characters.
- `classId`: output class mapping for each character slot.

## 8. Interfaces

- User interfaces (screens, pages):
- `/internal/facetexture` editor workspace.
- Components: Characters board, character properties, background uploader, preview/download panel.

- APIs (high-level, not low-level code):
- `GET /facetexture/`, `GET /facetexture/class`.
- `POST /facetexture/new`.
- `POST /facetexture/{id}/reorder`, `/change-class`, `/change-name`, `/change-visible`, `/delete`.
- `POST /facetexture/preview`, `POST /facetexture/download`.

## 9. Dependencies

- Other features this depends on:
- Authentication and role gating.
- Internal layout and menu.

- External systems (if any):
- Backend facetexture APIs.
- Browser IndexedDB (Dexie) for local media persistence.
- FileSaver for ZIP download.

## 10. Limitations / Gaps

- Marketing page links to `/admin/facetexture`, but active editor route is `/internal/facetexture`.
- Drag-and-drop reorder cannot place item at index 0 due falsy check.
- New character modal does not upload blob directly, only stores file name metadata.
- Some success messages depend entirely on backend response payload shape.

## 11. Opportunities

- Fix reorder index-zero bug.
- Align CTA links with real route structure.
- Add explicit upload validation (type/size/dimensions).
- Add save-history/undo UX for safer iterative editing.

## 12. Acceptance Criteria

- Given authorized user opens editor, when page loads, then characters, classes, and background are loaded.
- Given user updates background, when upload completes, then background preview updates and is persisted locally.
- Given user changes character class or visibility, when action succeeds, then selected character properties update in UI.
- Given user drags character to a valid destination, when reorder succeeds, then order is updated and success feedback is shown.
- Given user requests preview, when API returns blob, then preview image is displayed.
- Given user clicks download, when API returns blob, then `export.zip` is saved locally.

## 13. Assumptions

- Assumed backend derives actual image mapping from file names and server-side assets/workflow.
- Assumed local Dexie cache is intended only for UX continuity, not canonical storage.
