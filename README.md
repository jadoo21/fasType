# fasType

A typing-test single-page app: take timed typing tests (words / quotes / code), track WPM and accuracy over time, and view statistics on a dashboard.

Built with **React 18 + TypeScript** (Create React App, `react-scripts 5`), styled with **Tailwind CSS** (Bootstrap/Reactstrap loaded for compatibility).

## Quick start

```bash
npm install --legacy-peer-deps
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Local mock demo

With `REACT_APP_API_MODE=mock` (the default), sign in as `demo` or
`demo@example.com` using `demo123` to inspect the populated dashboard. This
account exists only in the in-memory development mock API and is not a
production credential.

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_MODE` | No (defaults to `mock`) | `mock` for the in-memory dev API, `real` for the .NET API. Any other value throws at startup. |
| `REACT_APP_API_BASE_URL` | Only when mode is `real` | Base URL of the backend. Missing value throws at startup. |

Validation lives in `src/config.ts`.

## Architecture

```
src/index.tsx          → <BrowserRouter> → src/App.tsx
src/App.tsx            → AuthProvider + TypingTestContext + Layout + RouteHandler
src/components/
  RouteHandler.tsx     → route table via React Router v6 useRoutes
  common/              → shared UI (Button, Card, Input, Modal, PageHeader, …)
  layout/              → Header, Footer, Brand, MobileNavigation, Layout
src/contexts/          → AuthContext (auth/session), TypingTestContext (test state)
src/pages/             → Home, Login, Signup, Statistics, About, Contact
src/services/api.ts    → facade selecting the mock or real adapter
src/services/mockApi.ts→ in-memory mock backend (demo data, simulated latency)
src/api/apiClient.ts   → Axios instance configured with REACT_APP_API_BASE_URL
src/config.ts          → env parsing/validation, exports apiMode + apiBaseUrl
src/types/             → shared TypeScript types
```

**API access:** components import from `src/services/api.ts`, which exports
`authApi`, `statisticsApi`, `typingTestApi`, and `contactApi` bound to either
`mockApi.ts` or the Axios-backed real client depending on `apiMode`. Mock data
is a development aid only — not a production fallback.

**Routes:** `/` (typing test), `/login`, `/signup`, `/statistics` (loads per-user
data when signed in, empty state otherwise), `/about`, `/contact`.

**Expected backend endpoints** (when `REACT_APP_API_MODE=real`):
`POST /login`, `POST /signup`, `POST /logout`, `GET /users/:id/statistics`,
`GET /users/:id/statistics/trend`, `POST /typing-tests/results`, `POST /contact`.

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
The page reloads on edits; ESLint (`react-app` preset) issues appear in the console.

### `npm test`

Launches the Jest test runner in interactive watch mode
(`@testing-library/react`, `src/App.test.tsx`, setup in `src/setupTests.ts`).

### `npm run build`

Builds the optimized production bundle to the `build/` folder.

### `npm run eject`

**One-way operation — you can't go back.** Copies webpack, Babel, and ESLint
config into the project. Only needed if you want to customize the build tooling.

## Type checking

```bash
npx tsc --noEmit
```

`tsconfig.json` runs with `strict: true`. CI runs this before tests and build.

## Continuous Integration / Deployment

Workflows live in `.github/workflows/`:

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | push / PR to `main`, `develop` | `npm ci --legacy-peer-deps`, `tsc --noEmit`, tests, production build, uploads the `build/` artifact |
| `pr-lint.yml` | PR opened / edited / updated | Validates the PR title against Conventional Commits |
| `codeql.yml` | push / PR to `main`, `develop`, weekly schedule | CodeQL security analysis |
| `deploy.yml` | push to `main` (or manual dispatch) | Builds with `PUBLIC_URL=/<repo>`, adds a `404.html` SPA fallback, deploys to GitHub Pages |

## Tech stack

- **Framework:** React 18, React Router v6 (`useRoutes`)
- **Language:** TypeScript 5 (`strict: true`)
- **Styling:** Tailwind CSS 3 (+ `clsx` / `tailwind-merge` via `src/utils/cn.ts`), Bootstrap 5 + Reactstrap
- **HTTP:** Axios
- **Testing:** Jest + React Testing Library (CRA built-in)

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

## License

[MIT](LICENSE)
