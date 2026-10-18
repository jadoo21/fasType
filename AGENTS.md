# fasType

TypeScript React SPA (CRA, react-scripts 5). No lib folder, no monorepo. CI/CD via GitHub Actions in `.github/workflows/`.

## Commands

| Command | Action |
|---------|--------|
| `npm start` | Dev server at localhost:3000 |
| `npm test` | Jest in watch mode (react-scripts) |
| `npm run build` | Production build to `build/` |

ESLint preset (`react-app` + `react-app/jest`) runs inline during `start`. No separate lint/formatter script.

## Gotchas

- **`.env.example`** — Set `REACT_APP_API_MODE=real` and provide `REACT_APP_API_BASE_URL` when connecting the .NET API.
- **`src/services/api.ts`** — Components use this mode-selected service facade; mock data is not a production fallback.
- **`tsconfig.json`** — `strict: true` enabled.
- **Branch:** `develop` (default).

## Architecture

`src/index.tsx` → `<BrowserRouter>` → `src/App.tsx` (wraps Header + RouteHandler + Footer). Routes via React Router v6 `useRoutes`. Auth via React Context (`src/contexts/AuthContext.tsx`). API access goes through `src/services/api.ts`, selecting the typed mock or Axios-backed real adapter. Styling uses Tailwind CSS with Bootstrap loaded for compatibility.
