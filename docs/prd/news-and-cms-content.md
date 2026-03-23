## 1. Feature Overview

* Name
  News and CMS Content Delivery
* Summary
  Delivers public news feed and individual news pages backed by Prismic documents and slices.
* Purpose
  Publish platform updates/articles with dynamic metadata and reusable CMS slices.
* Business value
  Supports SEO/content marketing and keeps users informed about updates.

## 2. Current Implementation

* How it works today
  News data is fetched from Prismic (`platform_news` type), mapped to lightweight feed objects, and rendered on home/news pages. Individual news pages render slice-based content using SliceZone.
* Main flows
  Home feed: dispatch `fetchNewsFeedThunk` -> `fetchNewsFeedData` -> list render.
  Article page: route `/news/[uid]` -> `generateMetadata` + page fetch by UID -> slice rendering + recent list.
  Preview flow: `/api/preview` and `/api/exit-preview` integrate Prismic preview mode.
* Entry points (routes, handlers, jobs)
  Routes: `/news/[uid]`, `/` (feed widget).
  API handlers: `/api/preview`, `/api/exit-preview`, `src/app/api/news.ts`.
* Key files involved (list with paths)
  `src/app/(landing)/news/[uid]/page.tsx`
  `src/components/landing/news/index.tsx`
  `src/lib/features/news/index.ts`
  `src/app/api/lib/news.ts`
  `src/prismicio.ts`
  `src/slices/index.ts`
  `src/slices/*/index.tsx`

## 3. Architecture & Design

* Layers involved (frontend/backend)
  Frontend server components fetch Prismic via SDK; client-side feed state handled in Redux on home page.
* Data flow (step-by-step)
  Prismic client initialized with route resolver -> fetch by type or UID -> map to `{first_publication_date,url,title}` -> UI list or article detail -> SliceZone dynamically loads slice components.
* External integrations
  `@prismicio/client`, `@prismicio/next`, `@prismicio/react`, Slice Machine.
* State management (if applicable)
  Redux `news` slice tracks feed data/status for home page.

## 4. Data Model

* Entities involved
  News item: `first_publication_date`, `url`, `title`.
  Prismic document: `platform_news` with metadata and `slices` array.
* Database tables / schemas
  No local DB; remote CMS documents only.
* Relationships
  Feed list references article URLs resolved by Prismic route resolver (`/news/:uid`).
* Important fields
  `meta_title`, `meta_description`, `first_publication_date`, `uid`, `slices`.

## 5. Business Rules

* Explicit rules implemented in code
  News feed uses `/` as fallback URL when Prismic item URL is null.
  Article page statically generates params from all `platform_news` docs.
* Edge cases handled
  Empty news feed shows “No news available”.
* Validation logic
  Minimal frontend validation; relies on Prismic content model consistency.

## 6. User Flows

* Normal flow
  Visitor opens home -> sees latest links -> opens article -> sees breadcrumbs, publish date, slice-rendered content.
* Error flow
  Not-found/error behavior depends on Prismic fetch exceptions and global error boundary.
* Edge cases
  Missing article metadata can degrade title/description rendering.

## 7. API / Interfaces

* Endpoints
  Prismic SDK calls:
  `getAllByType('platform_news')`
  `getByUID('platform_news', uid)`
  Internal API routes:
  `GET /api/preview`
  `GET /api/exit-preview`
* Input/output
  Feed output: mapped lightweight array used by home/news lists.
* Contracts
  `fetchNewsFeedData` is wrapped with `react` cache for memoized fetch behavior.
* Internal interfaces
  Slice component registry in `src/slices/index.ts` with dynamic imports.

## 8. Problems & Limitations

* Technical debt
  `src/app/api/news.ts` has legacy API handler returning raw value instead of writing `res.json`, and unused GET export style mismatch.
* Bugs or inconsistencies
  `next/head` usage appears inside App Router server component, which is non-idiomatic in modern App Router.
* Performance issues
  Home still uses client dispatch for feed despite available server component patterns.
* Missing validations
  No explicit fallback strategy for missing `meta_title`/`meta_description` beyond direct access.

## 9. Security Concerns ⚠️

* Any suspicious behavior
  CMS content is untrusted and rendered through rich-text/slice components; renderers should avoid unsafe HTML injection.
* External code execution
  None observed.
* Unsafe patterns
  External links in content/components may open in new tabs without `rel` hardening in some places.
* Injection risks
  Low-to-medium; controlled mainly by Prismic rich text renderers, but custom slice code must avoid `dangerouslySetInnerHTML` with raw CMS input.
* Hardcoded secrets
  None in source; repository/environment names are non-secret.
* Unsafe file/system access
  None.

## 10. Improvement Opportunities

* Refactors
  Replace legacy `/api/news.ts` with a proper App Router route handler (`route.ts`) or remove if unused.
* Architecture improvements
  Move home news feed to server-fetch + streaming where possible.
* Scalability
  Add pagination/incremental loading if article volume grows.
* UX improvements
  Add loading skeleton and error state for feed fetch failures.

## 11. Acceptance Criteria

* Functional
  Home page lists CMS news items and links correctly.
  `/news/[uid]` renders article metadata and slices.
* Technical
  Preview and exit-preview routes function for draft content.
  Feed mapping safely handles null URL values.
* Edge cases
  Empty CMS results produce a clear empty-state message.
  Missing document UID is handled with proper 404 behavior.

## 12. Open Questions

* Unknown behaviors
  Whether `/api/news.ts` is actively used by any external consumers.
* Missing clarity in code
  Desired caching/revalidation policy for Prismic content is not explicit.
* Assumptions made
  Assumed Prismic content model `platform_news` is stable and managed outside this repo.
