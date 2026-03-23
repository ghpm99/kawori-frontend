## 1. Feature Overview

* Name
  Class Ranking and Voting
* Summary
  Collects user votes for BDO classes/questions and presents ranking visualizations, class summaries, and vote history.
* Purpose
  Enable community-driven class evaluation by combat profile (Despertar/Sucessão).
* Business value
  Increases engagement and recurring visits via participatory ranking content.

## 2. Current Implementation

* How it works today
  Internal vote flow fetches classes/questions, captures per-question star votes, and submits each answer. Public rank page loads aggregated vote-by-class and answer summary datasets for charts and per-class detail cards.
* Main flows
  Voting: intro selects class/profile -> question panels set score (`Rate`) -> `registerAnswer` API call per question -> finished screen.
  Internal history: `/internal/rank` table shows user's recent answers.
  Public analytics: `/rank` renders Pie chart and class-specific summaries from aggregate endpoints.
* Entry points (routes, handlers, jobs)
  Routes: `/internal/rank`, `/internal/rank/vote`, `/rank`.
* Key files involved (list with paths)
  `src/app/internal/rank/page.tsx`
  `src/app/internal/rank/vote/page.tsx`
  `src/app/(landing)/rank/page.tsx`
  `src/components/rank/intro/index.tsx`
  `src/components/rank/question/index.tsx`
  `src/lib/features/classification/index.ts`
  `src/services/classification/index.ts`

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend: Next pages + Redux `classification` slice + chart components.
  Backend integration: `/classification/*` endpoints.
* Data flow (step-by-step)
  User enters vote page -> fetch questions/classes -> set selected class/profile -> set local vote per question in store -> submit answer thunk -> server persists or updates existing answer -> UI advances panel. Rank pages fetch aggregate endpoints and map datasets for Chart.js.
* External integrations
  Chart.js, react-chartjs-2, AntD `Rate` and tables.
* State management (if applicable)
  `classification` store: `questions`, `answers`, `class`, `selectedBdoClass`, `votesByClass`, `answerSummary`, `totalVotes`.

## 4. Data Model

* Entities involved
  Question (`id`, `question_text`, `question_details`, `vote`), Answer (`question`, `vote`, `bdo_class`, `combat_style`), Class (`id`, `name`, `abbreviation`, `class_image`, `class_symbol`, `color`), summary blocks per profile.
* Database tables / schemas
  No frontend DB; API-backed entities only.
* Relationships
  Answer links question + class + combat style profile.
  Summary groups answers by class and profile id (`1`/`2`).
* Important fields
  `combat_style`, `avg_votes`, `answers_count`, `color`, `question_details` HTML.

## 5. Business Rules

* Explicit rules implemented in code
  Certain classes auto-derive profile and disable profile selector (class ids 1/17/27 -> profile 1, id 28 -> profile 2).
  Selecting new class resets all question votes to undefined.
  Vote submission uses one API call per question with class/profile/question/value.
* Edge cases handled
  Questions can be skipped without submission.
  Rejected answer submission shows API error message.
* Validation logic
  Vote intro blocks start until class and profile are selected (or auto-derived).

## 6. User Flows

* Normal flow
  User selects class/profile -> answers ratings -> receives success messages -> sees completion result.
  Public visitor views vote distribution and class-specific summary.
* Error flow
  Register answer failure displays backend error and does not auto-advance.
* Edge cases
  Public rank summary shows “Sem dados” when selected class lacks summary entries.

## 7. API / Interfaces

* Endpoints
  `GET /classification/get-question/`
  `GET /classification/get-answer/`
  `POST /classification/register-answer/`
  `GET /classification/get-class/`
  `GET /classification/total-votes/`
  `GET /classification/answer-by-class/`
  `GET /classification/get-answer-summary/`
* Input/output
  Register input: `{ question_id, bdo_class_id, combat_style, vote }`.
  Aggregation outputs mapped to chart datasets.
* Contracts
  `registerAnswer` rejects with backend `msg` when available.
* Internal interfaces
  `setQuestionVote`, `setSelectedBdoClass`, async thunks from service module.

## 8. Problems & Limitations

* Technical debt
  Class-id special-case logic is hardcoded in UI.
* Bugs or inconsistencies
  Internal vote page says old vote is edited, but client has no explicit conflict resolution logic; behavior depends fully on backend.
* Performance issues
  Public rank page loads multiple aggregate endpoints on mount; no batching.
* Missing validations
  Next question can be submitted even with missing vote value depending on backend handling.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  `question.question_details` is rendered via `dangerouslySetInnerHTML` in `Question` component.
* External code execution
  No explicit dynamic eval.
* Unsafe patterns
  Untrusted HTML from backend can create XSS risk if backend sanitization is weak.
* Injection risks
  High XSS risk path on vote page due raw HTML injection.
* Hardcoded secrets
  None found.
* Unsafe file/system access
  None.

## 10. Improvement Opportunities

* Refactors
  Move class/profile special rules to backend metadata instead of client hardcoding.
* Architecture improvements
  Provide typed sanitize-safe question content format (markdown/structured rich text).
* Scalability
  Consolidate ranking endpoints into one aggregated payload.
* UX improvements
  Disable “Próximo” until vote is selected or explicit skip is chosen.

## 11. Acceptance Criteria

* Functional
  User can complete full vote flow and receive success result.
  Public ranking page displays class distribution and per-class summary.
* Technical
  Answer submission errors are surfaced without losing current question state.
  Profile auto-selection for specific classes works deterministically.
* Edge cases
  No-summary classes show explicit empty-state block.
  HTML question content is safely sanitized before render.

## 12. Open Questions

* Unknown behaviors
  Whether backend deduplicates prior answers by user/class/profile/question exactly as UI text implies.
* Missing clarity in code
  Expected minimum/maximum vote constraints at API boundary are not explicit in frontend.
* Assumptions made
  Assumed backend stores historical answers and calculates aggregate endpoints.
