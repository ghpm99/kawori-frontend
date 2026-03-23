## 1. Feature Overview

- Name: News and CMS Content
- Summary (what it does in simple terms): Displays platform news from Prismic on home and dedicated article pages with metadata and related recent items.
- Target user: Public visitors and authenticated users.
- Business value (why this exists): Keeps users informed with announcements/updates and supports content-led engagement.

## 2. Problem Statement

- What problem this feature solves: Product needs a non-code publishing channel for updates and long-form content.
- What would happen if it didn’t exist: Announcements would require manual releases or external channels, reducing content agility.

## 3. Current Behavior

- What the system currently does:
- Home page dispatches news feed fetch and shows a list of recent items.
- News feed items contain publication date, URL, and title.
- Dynamic article page `/news/[uid]` fetches a Prismic `platform_news` document.
- Article page renders breadcrumb, publication date, slices (`SliceZone`), and a side list of recent posts.
- Metadata (`title`, `description`) is generated from CMS fields.
- Static params are generated from all news UIDs.
- Preview API routes exist for Prismic preview start/exit.

- Real behavior based on code:
- News fetch uses a cached server function (`fetchNewsFeedData`) via Redux thunk.
- Empty state is explicit (“No news available”); loading state is plain text (“Loading…”).

- Key flows:
- App load -> fetch feed -> list latest posts.
- User opens post -> article content rendered from CMS slices.
- Content editors use preview endpoints for draft checking.

## 4. User Flows

### 4.1 Main Flow

1. User opens home page.
2. System loads news feed and renders linked list.
3. User clicks a news item.
4. System opens `/news/{uid}` with article body and metadata.

### 4.2 Alternative Flows

1. User directly opens a specific `/news/{uid}` URL.
2. User navigates among recent articles from side list on article page.
3. Editor initiates preview route and is redirected to preview URL.

### 4.3 Error Scenarios

1. If feed request fails, status becomes `error` and feed list is not shown.
2. If no records are returned, component renders “No news available”.
3. If CMS record is missing/invalid for UID, page fetch may fail server-side.

## 5. Functional Requirements

- The system must fetch and display a list of CMS news items on home.
- The user can open detailed news pages by UID.
- The system must render Prismic slices for article body.
- The system must show publication date and breadcrumb context on article pages.
- The system should generate metadata from CMS fields.
- The system should support CMS preview enter/exit endpoints.

## 6. Business Rules

- News source type is fixed to Prismic document type `platform_news`.
- Route resolver maps `platform_news` to `/news/:uid`.
- Feed items use `meta_title` as display title.
- Fallback link for missing URL is `/` in feed mapping.

## 7. Data Model (Business View)

- Main entities:
- News Article: uid, url, first_publication_date, meta_title, meta_description, slices.

- Relationships:
- Feed is a collection of article summaries.
- Article detail references full CMS content and can link to other feed items.

- Important fields (business meaning):
- `meta_title`: headline shown in lists and page title.
- `first_publication_date`: displayed publish date.
- `slices`: structured article body content blocks.

## 8. Interfaces

- User interfaces (screens, pages):
- Home news list on `/`.
- News detail page `/news/[uid]`.

- APIs (high-level, not low-level code):
- Prismic client calls `getAllByType("platform_news")` and `getByUID("platform_news", uid)`.
- Preview endpoints: `GET /api/preview`, `GET/handler /api/exit-preview`.

## 9. Dependencies

- Other features this depends on:
- Landing page composition.
- Redux store news slice.

- External systems (if any):
- Prismic CMS repository and preview support.

## 10. Limitations / Gaps

- `/app/api/news.ts` returns arrays directly and is not used by primary UI flow.
- Error state UX is minimal for feed and article fetch failures.
- News list ordering behavior is delegated to CMS response order (no explicit sort in UI code).

## 11. Opportunities

- Add explicit sorting/filtering controls for news feed.
- Add richer loading/error skeleton states.
- Add search and category/tag browsing for content scalability.

## 12. Acceptance Criteria

- Given published news exists, when home page loads, then a list with date and title links is displayed.
- Given user clicks a news link, when detail page loads, then article slices and publication date are shown.
- Given no feed items, when news section renders, then empty-state message is shown.
- Given preview route is called with valid preview context, when endpoint executes, then user is redirected to preview URL.

## 13. Assumptions

- Assumed Prismic schema for `platform_news` includes `meta_title`, `meta_description`, and slices.
- Assumed caching behavior for feed fetch is acceptable for current freshness requirements.
