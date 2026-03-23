## 1. Feature Overview

* Name
  Facetexture Editor
* Summary
  Allows users to manage Black Desert character face textures, reorder character cards, set class visibility, generate preview image, and export ZIP package.
* Purpose
  Provide a guided UI for customizing game character selection visuals.
* Business value
  Core differentiator of the product and main retained-use feature for Black Desert users.

## 2. Current Implementation

* How it works today
  The internal page loads class + character data from backend, merges local Dexie-stored image/background blobs, and renders a 3-panel editor (characters, background, preview). Character modifications call backend APIs immediately. Background/image blobs are cached client-side.
* Main flows
  Initial load: fetch classes + characters -> resolve local image overrides from IndexedDB -> render.
  Add character: modal class/visibility/file name -> `facetexture/new`.
  Reorder: drag/drop -> `facetexture/{id}/reorder`.
  Change class/visibility/name: dedicated API endpoints per selected character.
  Background update: upload/crop image -> persist blob in Dexie -> update preview state.
  Preview/export: POST multipart-like payload (background + icon style) -> receive blob preview or ZIP download.
* Entry points (routes, handlers, jobs)
  Route: `/internal/facetexture`.
  Redirect route: `/admin/facetexture` -> internal page.
* Key files involved (list with paths)
  `src/app/internal/facetexture/page.tsx`
  `src/lib/features/facetexture/index.ts`
  `src/services/facetexture/index.ts`
  `src/components/facetexture/characters/index.tsx`
  `src/components/facetexture/characters/info/index.tsx`
  `src/components/facetexture/characters/newModal/index.tsx`
  `src/components/facetexture/background/index.tsx`
  `src/components/facetexture/preview/index.tsx`
  `src/util/db.ts`

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend: Redux slice + Ant Design + React DnD + Dexie IndexedDB.
  Backend integration: `/facetexture/*` endpoints via `apiDjango`.
* Data flow (step-by-step)
  Page mount -> dispatch `fetchFacetexture` -> backend returns classes + characters -> store normalized with `image=class.class_image` -> client checks Dexie for local image by character name and background blob -> UI uses blended source of backend metadata + local binary assets -> user changes call API thunks -> Redux updates state.
* External integrations
  Dexie, `react-beautiful-dnd`, `antd-img-crop`, `file-saver`, Sentry.
* State management (if applicable)
  Redux `facetexture` slice tracks classes, characters, selected character id, modal state, loading/error, edited flag, and background URL.

## 4. Data Model

* Entities involved
  Character (`id`, `name`, `class`, `show`, `image`, `order`), class list, background blob, local image blob map by `name`, modal payload (`name`, `classId`, `visible`).
* Database tables / schemas
  Dexie DB `kawori`:
  `background`: `{ id, image: Blob }`
  `image`: `{ id, name, imagem: Blob }`
  `facetexture` table exists in schema but is not actively used by current page flow.
* Relationships
  Character references class object; local image cache is matched by character `name`.
* Important fields
  `order`, `show`, `class.class_image`, modal `classId`, preview `icon_style` (`P`/`G`).

## 5. Business Rules

* Explicit rules implemented in code
  Max characters limited by constant `MAXIMUM_FACETEXTURE_CHARACTERS = 44`.
  New character modal save disabled when class is unset or file name length <= 5.
  Preview/download buttons disabled when no characters exist.
  Default background `/media/background.jpg` is inserted into Dexie if absent.
* Edge cases handled
  If selected character is undefined, edit actions no-op.
  Character update/reorder operations show loading/success/failure toast with stable message key.
* Validation logic
  Client validates minimal modal fields (class + filename length).
  No file extension/type validation is enforced in UI upload handlers.

## 6. User Flows

* Normal flow
  User opens editor -> sees characters/background -> selects character -> updates class/show/image -> drags order -> updates preview -> downloads ZIP.
* Error flow
  API failures in class/name/show/delete/reorder/preview/download show generic failure messages.
* Edge cases
  Local image exists with same filename -> Dexie record updated.
  Reorder logic ignores destination index `0` because of truthy check (`if (!indexDestination) return`), preventing move-to-first position.

## 7. API / Interfaces

* Endpoints
  `GET /facetexture/`
  `GET /facetexture/class`
  `POST /facetexture/new`
  `POST /facetexture/{id}/reorder`
  `POST /facetexture/{id}/change-class`
  `POST /facetexture/{id}/change-name`
  `POST /facetexture/{id}/change-visible`
  `POST /facetexture/{id}/delete`
  `POST /facetexture/preview` (blob)
  `POST /facetexture/download` (blob zip)
* Input/output
  Preview/download inputs include background blob and icon style.
  Character mutation outputs are applied to Redux state optimistically/after fulfillment.
* Contracts
  Blob responses handled with Axios `responseType: 'blob'`.
* Internal interfaces
  Redux reducers for local UI state plus async thunks from `services/facetexture`.

## 8. Problems & Limitations

* Technical debt
  Character image persistence depends on matching by mutable `name` field.
  `facetexture` IndexedDB table is declared but not consistently used in main flow.
* Bugs or inconsistencies
  Reorder check blocks destination index `0`.
  No cleanup of object URLs (`URL.revokeObjectURL`) can leak memory in long sessions.
* Performance issues
  Recreating object URLs repeatedly for preview/character images can increase memory footprint.
* Missing validations
  Upload size/type constraints are absent.
  No guard for missing background in preview call before dereferencing `background.image`.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  Feature accepts arbitrary local files and forwards blobs to backend; server-side strict file validation is required.
* External code execution
  None observed in frontend.
* Unsafe patterns
  No client-side MIME/extension validation for uploaded images.
* Injection risks
  Limited in this module; no HTML injection path directly in facetexture components.
* Hardcoded secrets
  None found.
* Unsafe file/system access
  Browser local file uploads and local blob caching are expected but should be constrained by backend validation and quotas.

## 10. Improvement Opportunities

* Refactors
  Replace name-based image lookup with stable character-id keyed cache.
* Architecture improvements
  Introduce explicit upload validation layer and preview request schema typing.
* Scalability
  Add object URL lifecycle cleanup and background/image blob pruning.
* UX improvements
  Show per-field validation errors for modal uploads and unsupported file types.

## 11. Acceptance Criteria

* Functional
  User can add/delete/reorder/edit characters and download generated ZIP.
  Background upload and preview update work end-to-end.
* Technical
  Reordering supports moving to any index including first position.
  Dexie fallback initializes default background only once.
* Edge cases
  Invalid upload types are rejected with explicit message.
  API failures never leave modal in permanent loading state.

## 12. Open Questions

* Unknown behaviors
  Backend expected format/size/type limits for preview/download payloads are not explicit in frontend.
* Missing clarity in code
  Whether character `name` must equal filesystem filename for backend processing.
* Assumptions made
  Assumed backend performs authoritative validation on uploaded blobs and reorder indices.
