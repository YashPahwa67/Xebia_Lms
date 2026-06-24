# Technical Design Document — Xebia LMS

## 1. System architecture

```
┌─────────────────────────────────────────────┐
│ Browser (React SPA, Vite)                    │
│  react-router-dom · axios · Context(auth)    │
│  recharts · lucide-react · xlsx              │
└───────────┬───────────────────┬──────────────┘
            │ HTTPS JSON         │ HTTPS PUT (presigned)
            │ Bearer JWT         │ raw file body
            ▼                    ▼
┌───────────────────────┐   ┌──────────────────┐
│ API (Express, Node)   │   │ AWS S3           │
│ /api/* REST           │   │ xebiausercreate- │
│ JWT auth · Passport   │──▶│ bucket (ap-south-1)│
│ OAuth (Google/GitHub) │   │ presigned URLs   │
│ RBAC middleware       │   └──────────────────┘
└───────────┬───────────┘
            ▼
   ┌──────────────────┐      ┌─────────────────┐
   │ MongoDB (Mongoose)│     │ Email service   │
   │ users, courses... │     │ (password reset)│
   └──────────────────┘      └─────────────────┘
            │
            ▼ (AI question generation)
   ┌──────────────────────────────────────────┐
   │ LLM provider (recommend Claude opus-4-8)  │
   └──────────────────────────────────────────┘
```

Both frontend and backend are hosted on **Render.com**. Client timeout is 60s
to absorb backend cold starts.

## 2. Authentication & authorization

### 2.1 Mechanism
- **JWT Bearer tokens** issued by `/auth/login` and OAuth callbacks; stored in
  `localStorage` (`token`, `user`, `role`).
- Axios request interceptor injects `Authorization: Bearer <token>`.
- Response interceptor: on `401`, clears storage and redirects to `/login`.
- `withCredentials: true` — cookies also supported server-side (session capable).

### 2.2 OAuth flow
1. Client redirects to `/api/auth/google` or `/api/auth/github` (Passport).
2. Provider authenticates; backend redirects to frontend `/success?token=<JWT>`.
3. `OAuthSuccess.jsx` reads token, decodes payload client-side (no `/users/me`),
   derives user, stores it, dispatches `LOGIN_SUCCESS`.

### 2.3 Authorization
- **Client:** `PrivateRoute allowedRoles={[...]}` checks `isAuthenticated`,
  role membership, and `isActive`; redirects to `/login` or `/unauthorized`.
- **Server (inferred):** JWT verification middleware + role-guard middleware per
  route group (`/admin/*` Admin, `/trainer/*` Trainer, `/learner/*` Learner).

### 2.4 Auth state
`AuthContext` uses `useReducer` with actions
`LOGIN_START/SUCCESS/FAILURE`, `LOGOUT`, `REFRESH_USER`, `CLEAR_ERROR`.
Initialized from `localStorage` on mount.

## 3. Data-flow patterns

### 3.1 Standard read
Component → feature hook (e.g. `useDashboardStats`) → `*API.method()` →
`axios` instance → REST → render with loading/empty/error states.

### 3.2 File upload (3-step presigned)
1. `POST .../presign` → `{ url|uploadUrl, objectKey }`.
2. `PUT` file directly to S3 (native fetch, correct `Content-Type`).
3. `POST` register metadata with `objectKey`.
Used for: user bulk upload, course content, assessment attachments.
Constraints: assessment file ≤ 10MB; user upload `.xlsx/.xls/.csv` only.

### 3.3 File access/download
`GET .../access` or `.../view` → `{ url, metadata }` presigned GET → open in new
tab / anchor download.

### 3.4 AI assessment generation
Trainer supplies `{ topic, difficulty, numberOfQuestions }` →
`POST /trainer/assessments/generate-questions` → backend calls LLM → returns
`questions[]` pre-filled into the create form before persistence.

## 4. Frontend architecture

- **Feature-based modules:** `src/features/{admin,trainer,learner}` each with
  `Pages/` and `Components/` and nested `Routes`.
- **Centralized API layer:** `src/api/index.js` exports domain API objects
  (`authAPI`, `usersAPI`, `coursesAPI`, `enrollmentAPI`, `assessmentAPI`,
  `liveClassesAPI`, `batchesAPI`, `notificationsAPI`, `analyticsAPI`,
  `universitiesAPI`, …). Single axios instance + interceptors.
- **Hooks:** `useDashboardStats`, `useTrainerDashboard`, `useTrainerServices`
  encapsulate data fetching.
- **Utils:** `courseUtils` (lesson count, duration), `dataTransformers`.
- **Routing:** top-level role gates in `App.jsx`; nested routes inside layout
  components (`TrainerLayout`, `LearnerLayout`).

## 5. Cross-cutting concerns
- **Error handling:** every API method wraps in try/catch and normalizes
  `error.response.data.message` / `errors[]` into thrown `Error`.
- **Loading/empty states:** spinners and placeholders throughout (e.g.
  `LoadingSpinner` in `PrivateRoute`).
- **Charts:** `recharts` for login-time, live-classes, performance charts.

## 6. Known issues / hardening recommendations (for the rebuild)
1. Ship a **production build**; disable source maps (currently fully exposed).
2. Remove `console.log` of tokens/roles/headers.
3. Move JWT to **httpOnly cookie** to mitigate XSS token theft (already
   `withCredentials`-ready).
4. Add a `/auth/me` endpoint instead of decoding JWT client-side for user data.
5. Enforce server-side RBAC + ownership checks on every `/trainer` and
   `/learner` resource (don't trust client role).
6. Validate S3 presign requests (filename/contentType/size allow-lists).
7. Rate-limit auth & generation endpoints.

## 7. Proposed rebuild stack
React 18 + Vite + TypeScript, TanStack Query for server state, React Router v6,
Tailwind, Zod for validation, Axios; backend Node/Express + Mongoose + Zod +
Passport, `@anthropic-ai/sdk` (`claude-opus-4-8`) for question generation,
AWS SDK v3 for S3 presigning.
</content>
