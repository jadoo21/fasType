# fasType

TypeScript React SPA (CRA, react-scripts 5). No lib folder, no monorepo, no CI/CD.

## Commands

| Command | Action |
|---------|--------|
| `npm start` | Dev server at localhost:3000 |
| `npm test` | Jest in watch mode (react-scripts) |
| `npm run build` | Production build to `build/` |

ESLint preset (`react-app` + `react-app/jest`) runs inline during `start`. No separate lint/formatter script.

## Gotchas

- **`src/api/apiClient.ts:4`** — `baseURL` is a placeholder (`https://your-api-base-url.com`). All API calls fail until replaced with a real backend URL.
- **`src/components/Header.tsx:17`** — `isLoggedIn` hardcoded to `false`. Header never reads `AuthContext`.
- **`src/App.test.tsx`** — Stale CRA test (checks for "learn react" link that no longer exists). Will fail as-is.
- **`src/.env`** — Empty and unused. CRA expects `.env` at project root, not in `src/`.
- **`tsconfig.json`** — `strict: true` enabled.
- **Branch:** `develop` (default).

## Architecture

`src/index.tsx` → `<BrowserRouter>` → `src/App.tsx` (wraps Header + RouteHandler + Footer). Routes via React Router v6 `useRoutes`: `/login`, `/signup`. Auth via React Context (`src/contexts/AuthContext.tsx`). HTTP via Axios (`src/api/apiClient.ts`). Styling with reactstrap + Bootstrap 5.
