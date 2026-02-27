# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start dev server on port 3000
yarn build        # Production build
yarn lint         # ESLint
yarn format       # Prettier (src/**/*.{js,jsx,ts,tsx})
yarn compile      # TypeScript type check
yarn test         # Jest (unit/integration tests)
yarn test:ci      # Jest in CI mode
yarn coverage     # Jest with coverage report
yarn cypress      # Open Cypress E2E tests
yarn slicemachine # Start Prismic Slice Machine UI
make check        # Runs format + lint + compile
```

To run a single test file:
```bash
yarn test src/path/to/file.test.tsx
```

## Architecture

### Tech Stack
- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Redux Toolkit** for global state
- **Ant Design (antd)** UI library — requires `transpilePackages` in `next.config.js`
- **Prismic CMS** for landing page and news content (via Slice Machine)
- **Dexie** (IndexedDB wrapper) for client-side image storage (`src/util/db.ts`)
- **Pusher** for real-time features
- **axios** for all API calls, configured with retry/token-refresh logic
- **Sentry** for error monitoring, **Vercel Analytics** and **Speed Insights**
- **SCSS** for styling with CSS custom properties for theming

### Route Structure (`src/app/`)
- `(landing)/` — public landing page (Prismic-powered)
- `(public)/` — unauthenticated pages: `/facetexture`, `/rank`, `/news`, `/signout`, `/signup`
- `internal/` — authenticated user area: facetexture, rank, user profile
- `admin/` — admin area: facetexture management, financial (contracts, invoices, payments, tags, overview)
- `api/` — Next.js API routes: `news.ts`, `preview.ts`, `exit-preview.ts`

### Authentication & Middleware (`src/middleware.ts`)
Route protection is handled by Next.js middleware checking for a `lifetimetoken` cookie. Private routes (`/internal`, `/admin`, `/financial`) redirect to `/signout` when unauthenticated. The `/facetexture` public route redirects authenticated users to `/internal/facetexture`.

### Redux Store (`src/lib/`)
- `store.ts` — configures the store; use `store()` factory (not singleton)
- `hooks.ts` — typed hooks: `useAppDispatch`, `useAppSelector`, `useAppThunkDispatch`
- `features/auth` — auth state, signin/signout/token-verify thunks
- `features/financial` — nested store for overview, contract, invoice, payment, tag
- `features/facetexture`, `features/classification`, `features/loading`, `features/configuration`, `features/status`, `features/news`

### Service Layer (`src/services/`)
- `index.ts` — exports `apiDjango`: an axios instance targeting `NEXT_PUBLIC_API_URL` with HttpOnly cookies, automatic token refresh on 401, and retry on `[401, 408, 504, 500]` up to 3 times with 1.5s delay
- `auth/` — separate `apiAuth` instance for auth endpoints
- `financial/`, `facetexture/`, `classification/`, `remote/` — domain-specific service modules

### Theme System (`src/styles/theme.ts`, `src/components/themeProvider/`)
Themes are `"light" | "dark"`. The active theme class is set on `<html>` (injected inline script prevents flash). CSS custom properties are defined via `addStyle()` at module load. Ant Design themes are configured via `antdThemes` record keyed by theme name.

### Path Alias
`@/` maps to `src/`. Use `@/components/...`, `@/lib/...`, etc. throughout.

### Testing (`src/util/test-utils.tsx`)
Use `renderWithProviders(ui, options)` instead of RTL's `render` to wrap components with the Redux Provider. Tests use `jsdom` environment. Coverage thresholds: 80% branches, 65% functions, 50% lines/statements. The `src/slices/` and `src/instrumentation.ts` are excluded from coverage.

### Constants (`src/components/constants/index.ts`)
- `LOCAL_STORE_ITEM_NAME = "lifetimetoken"` — localStorage key for token expiration
- `MAXIMUM_FACETEXTURE_CHARACTERS = 44` — character limit for facetexture names

### Prismic Integration
- `src/prismicio.ts` — creates the Prismic client; repository name from `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` or `slicemachine.config.json`
- `src/slices/` — Slice Machine components (AlternateGrid, CallToAction, Header, Hero, etc.)
- News articles use the `platform_news` document type routed at `/news/:uid`

### Environment Variables
- `NEXT_PUBLIC_API_URL` — base URL for the Django backend API
- `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` — Prismic repository name override
- `SENTRY_AUTH_TOKEN` — for source map uploads during CI builds
