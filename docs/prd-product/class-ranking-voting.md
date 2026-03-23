## 1. Feature Overview

- Name: Class Ranking and Voting
- Summary (what it does in simple terms): Lets users vote on Black Desert class questions and view aggregated ranking/summary results publicly.
- Target user: Public viewers (results) and authenticated `blackdesert` users (vote submission and personal history).
- Business value (why this exists): Generates community insight, user participation loops, and sticky recurring engagement.

## 2. Problem Statement

- What problem this feature solves: Community needs structured opinion collection and transparent class-performance perception.
- What would happen if it didn’t exist: Class sentiment would be fragmented and users would lose a key engagement mechanism.

## 3. Current Behavior

- What the system currently does:
- Public `/rank` page:
- Loads classes, votes by class, and answer summaries.
- Displays pie chart distribution of votes by class (non-zero classes).
- User selects class via query parameter `classId` to view Awakening/Succession average ratings by question text.
- Internal `/internal/rank` page:
- Shows informational copy and table of user’s latest answers (`getAllAnswers`).
- Includes link to voting flow.
- Internal `/internal/rank/vote` flow:
- Step 0 intro requires class and combat style selection.
- For class IDs 1, 17, 27, combat style auto-forces Awakening; class ID 28 auto-forces Succession.
- Each question is answered by 1-5 star rating and sent immediately using `registerAnswer` when clicking “Proximo”.
- User may skip questions.
- Completion view thanks user and links back.

- Real behavior based on code:
- Re-voting same class/style/question is expected to update previous vote (stated in UI copy; backend behavior implied by endpoint contract).
- Question details are rendered as HTML via `dangerouslySetInnerHTML`.

- Key flows:
- Public results exploration by class.
- Authenticated vote submission with optional question skip.
- Authenticated personal answer history viewing.

## 4. User Flows

### 4.1 Main Flow

1. Authenticated user opens `/internal/rank/vote`.
2. User selects class and combat profile.
3. User rates each question (or skips).
4. System submits each vote individually to backend.
5. User reaches completion screen.
6. Public results page reflects aggregated class summaries over time.

### 4.2 Alternative Flows

1. User visits `/rank` without voting, only consuming aggregated results.
2. User chooses a class from results grid and deep-dives into Awakening/Succession summaries.
3. User returns to vote flow later and submits updated ratings.

### 4.3 Error Scenarios

1. Failed vote submission shows backend error message and keeps user on current question.
2. Missing class/profile selection disables voting start.
3. If selected class has no summary data for a profile, UI shows “Sem dados”.

## 5. Functional Requirements

- The system must fetch questions, classes, vote distribution, and summary datasets from backend.
- The user can select class and combat style before answering.
- The user can rate questions from 1 to 5 stars.
- The user can skip individual questions.
- The system must submit vote payload with class, profile, question, and vote.
- The system must display success/error feedback after vote submission.
- The system should display public chart and class-specific summary views.
- The system should display user answer history in internal rank page.

## 6. Business Rules

- Combat style defaults:
- Classes 1, 17, 27 force profile 1 (Awakening).
- Class 28 forces profile 2 (Succession).
- Other classes require explicit profile selection.
- Votes are recorded per question and submitted one by one.
- Pie chart excludes classes with zero votes.
- Summary view is segmented by profile keys `1` and `2`.

## 7. Data Model (Business View)

- Main entities:
- Class: id, name, abbreviation, color, class image/symbol.
- Question: id, text, details HTML, vote (local transient selection).
- Answer: question, vote score, class, combat_style, created_at.
- Answer Summary: class id, profile bucket, averaged votes by text item.
- Vote Distribution: class label/color with vote count.

- Relationships:
- One class has many answers and summary rows.
- One user can submit many answers across class/profile combinations.

- Important fields (business meaning):
- `combat_style`: differentiates Awakening vs Succession insights.
- `avg_votes`: aggregate quality perception metric.

## 8. Interfaces

- User interfaces (screens, pages):
- `/rank` public ranking dashboard.
- `/internal/rank` user history and entry point.
- `/internal/rank/vote` guided questionnaire flow.

- APIs (high-level, not low-level code):
- `GET /classification/get-question/`.
- `GET /classification/get-answer/`.
- `POST /classification/register-answer/`.
- `GET /classification/get-class/`.
- `GET /classification/answer-by-class/`.
- `GET /classification/get-answer-summary/`.
- `GET /classification/total-votes/` (defined, currently not displayed).

## 9. Dependencies

- Other features this depends on:
- Authentication and group-based menu access for internal vote pages.
- Shared class configuration data.

- External systems (if any):
- Backend classification APIs.
- Chart.js for visualization.

## 10. Limitations / Gaps

- No client-side anti-duplicate submission guard besides loading messages.
- `totalVotes` endpoint is fetched in services but not actively displayed in current UI.
- Rendering HTML question details requires strict backend sanitization policy.

## 11. Opportunities

- Add progress persistence/resume for interrupted voting sessions.
- Add richer filters/comparisons on public results (time range, profile compare).
- Expose total votes and trend deltas in ranking dashboard.

## 12. Acceptance Criteria

- Given class and profile are selected, when user starts voting, then first question is shown.
- Given user rates a question and clicks next, when API succeeds, then success message is shown and flow advances.
- Given API rejects vote, when next is clicked, then error message is shown and question remains.
- Given user clicks skip, when action executes, then flow advances without submission.
- Given `/rank?classId={id}` with available summary, when page renders, then profile summaries are displayed.
- Given no summary for selected profile, when page renders, then “Sem dados” appears.

## 13. Assumptions

- Assumed backend owns idempotency/update behavior for repeated votes by same user/class/profile/question.
- Assumed class IDs used for forced profile mapping are domain-stable.
