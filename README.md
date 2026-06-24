# Xebia LMS — Frontend

Production-grade React (JavaScript) frontend for the Xebia Learning Management
System, reverse-engineered from the live deployment and rebuilt against the real
backend API. Full reverse-engineering docs live in [docs/](./docs).

## Stack
React 18 · Vite · React Router v6 · TanStack Query · Axios · Tailwind CSS ·
Recharts · lucide-react · SheetJS (xlsx).

## Getting started
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Environment (`.env`)
```
VITE_API_URL=https://lms-xebia.onrender.com/api
VITE_API_TIMEOUT=60000
VITE_AWS_REGION=ap-south-1
VITE_S3_BUCKET=xebiausercreatebucket
```
The app talks to the live backend by default. Point `VITE_API_URL` at a local
backend to develop offline.

## Architecture
```
src/
├── app/            App shell, router, providers
├── config/         Typed env access
├── lib/            apiClient (axios), s3Upload, queryClient, storage
├── services/       One module per API domain (auth, users, courses, …)
├── hooks/          Reusable hooks (useAsyncAction, useDebouncedValue)
├── components/
│   ├── ui/         Design-system primitives (Button, Modal, DataTable, …)
│   └── layout/     DashboardLayout (shared sidebar/topbar shell)
├── features/
│   ├── auth/       AuthContext + login/forgot/reset/oauth pages
│   ├── landing/    Public landing page
│   ├── admin/      Admin dashboard, users, universities, approvals, …
│   ├── trainer/    Trainer dashboard, courses, content, assessments, live class
│   ├── learner/    Learner dashboard, courses, learning, assessments, resources
│   ├── live/       Shared in-browser live-class stage (getUserMedia)
│   └── settings/   Shared account settings (profile + password)
├── routes/         ProtectedRoute (auth + role gating)
├── constants/      Roles, storage keys, course/assessment defaults
└── utils/          cn, format, courseUtils
```

### Key patterns
- **Services** centralize every backend call and normalize errors (`toApiError`).
- **TanStack Query** handles server state, caching and refetch.
- **`useAsyncAction`** wraps mutations with loading + toast handling — no
  duplicated try/catch in components.
- **Loading / empty / error** states are first-class via shared components.
- **Role-based routing** mirrors the original: `/admin/*`, `/trainer/*`,
  `/learner/*` each guarded by `ProtectedRoute`.
- **3-step presigned S3 uploads** centralized in `lib/s3Upload.js`.

## Auth
JWT bearer token persisted in `localStorage`, attached via an axios interceptor;
`401` responses clear the session and redirect to `/login`. Google/GitHub OAuth
redirect back to `/success?token=…`.
