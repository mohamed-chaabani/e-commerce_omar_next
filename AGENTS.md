# AGENTS.md

## Commands

- `npm run dev` — start dev server on localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint (next/core-web-vitals)
- `npm run start` — serve production build

No test suite, typecheck, or formatter is configured.

## Architecture

**Next.js 16 (App Router) + React 19 + Tailwind CSS 3.4** — JavaScript only, no TypeScript.

- `app/` — App Router: all live routes, server components for data fetching
- `pages/` — **legacy Pages Router files, not used as routes**. These are client components imported into App Router pages. Do not treat `pages/` files as page routes.
- `components/` — shared UI components (cart, categories, home, layout, product, ui)
- `services/` — API service modules (one per entity: product, categoryLvl2/3/4, logoSlider, slider)
- `context/` — React Context providers: Cart, Theme, Search, InitialData
- `functions/` — utility helpers and REST API wrappers (axios-based)
- `public/` — static assets

## Data Fetching — Two Patterns

This project uses **two data fetching patterns** depending on where code runs:

1. **Server Components** (in `app/` pages): use native `fetch()` with `cache: "no-store"` or `cache: "force-cache"` + `next: { revalidate }`. Functions are exported with a `Fetch` suffix (e.g., `getProductsPaginatedFetch`, `getCategoryBySlugFetch`).

2. **Client Components** (with `"use client"`): use axios wrappers from `functions/restApi.js` (`post`, `get_All`, `update`, `update_put`, `deleteApi`). These return the full axios response — access data via `.data`.

**API base URL** is hardcoded in each service file (currently `https://backend-omar-5d89.onrender.com/api`). There is no `.env` file. If switching backends, update the `API_URL` in each service file under `services/`.

## Key Conventions

- **Dark mode**: `darkMode: "class"` — toggle via `useTheme()` hook. Dark variants use `dark:` prefix.
- **Path alias**: `@/*` maps to project root (configured in `jsconfig.json`).
- **Custom Tailwind theme**: `primary` and `secondary` color scales, `customRed: #cc0000`, custom fonts (`sans` = Inter, `serif-display` = Playfair Display, `sans-condensed` = Oswald, `bebas` = Bebas Neue).
- **Providers**: wrapped in `app/providers.jsx` (Theme → Cart → Search + ToastContainer).
- **Cart**: stored in `localStorage`, keyed by `${_id}-${selectedColor}`. Use `useCart()` hook.
- **Category hierarchy**: 4 levels (Lvl2 → Lvl3 → Lvl4), each with its own service file.
- **UI libraries**: framer-motion (animations), lucide-react (icons), Swiper (carousels), react-toastify (notifications), react-infinite-logo-slider.
- **Font Awesome** loaded via CDN in `app/layout.js` (not via npm).

## Gotchas

- `pages/` directory is misleading. Files there are `"use client"` components, not page routes. Do not add routes there.
- No environment variables — all config is hardcoded. No `.env` loading.
- The `functions/restApi.js` `get_All` returns the full axios response, not just data. Client-side consumers must use `response.data`.
- `app/page.js` (home) does server-side data fetching via `Promise.all` with axios-based services — these will fail in a pure server environment without a browser. If converting to fully server-rendered, switch to `Fetch`-suffix functions.
- No pre-commit hooks, no CI workflows.
- Search context (`useSearch`) and pagination use `searchParams` from `next/navigation` — in Next.js 15+ these are Promises that must be awaited.
