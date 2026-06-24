# Xebia LMS — Reverse-Engineering Documentation

> Source of truth: reverse-engineered from the live deployment
> `https://lms-xebia-mac.onrender.com` (Vite dev build, source maps exposed)
> and its backend API `https://lms-xebia.onrender.com/api`.

## 1. What this product is

Xebia LMS is a multi-tenant **Learning Management System** for a corporate /
university training context. It supports three user roles — **Admin**,
**Trainer**, and **Learner** — each with a dedicated dashboard and feature set:

- **Admins** manage users, universities (tenants), course approvals, platform
  settings and analytics.
- **Trainers** author courses & content, run live classes, create AI-assisted
  assessments/exams, enroll students and manage batches.
- **Learners** browse approved courses, enroll, consume content, attend live
  classes, take assessments and track their own progress.

## 2. Confirmed tech stack

| Layer | Technology (observed) |
|-------|-----------------------|
| Build tool | Vite |
| UI framework | React 18 (`createRoot`, `StrictMode`) |
| Routing | `react-router-dom` v6 (`BrowserRouter`, nested `Routes`) |
| HTTP client | `axios` (instance + interceptors) + native `fetch` for S3 |
| Icons | `lucide-react` |
| Charts | `recharts` |
| Spreadsheets | `xlsx` (SheetJS) for bulk upload / templates |
| Styling | Tailwind CSS (utility classes throughout) |
| State | React Context + `useReducer` (auth), local hooks elsewhere |
| Auth | JWT (Bearer) in `localStorage` + OAuth (Google, GitHub) |
| File storage | AWS S3 (`xebiausercreatebucket`, `ap-south-1`) via presigned URLs |
| Backend (inferred) | Node.js + Express + MongoDB/Mongoose, JWT, Passport OAuth |
| Hosting | Render.com (frontend + backend, prone to cold starts → 60s timeout) |

## 3. Environment variables (frontend)

```
VITE_API_URL      = https://lms-xebia.onrender.com/api
VITE_API_TIMEOUT  = 60000   (default; 60s for Render cold starts)
VITE_AWS_REGION   = ap-south-1
VITE_S3_BUCKET    = xebiausercreatebucket
```

## 4. Documentation index

| Doc | Purpose |
|-----|---------|
| [PRD.md](./PRD.md) | Product requirements, personas, features, user stories |
| [TECHNICAL_DESIGN.md](./TECHNICAL_DESIGN.md) | Architecture, auth flow, data flows, infra |
| [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | Inferred MongoDB collections & relationships |
| [API_SPECIFICATION.md](./API_SPECIFICATION.md) | Full inferred REST API surface |
| [COMPONENT_TREE.md](./COMPONENT_TREE.md) | Route map + React component hierarchy |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Actual + proposed folder structure |

## 5. How this was reconstructed

The deployment serves an **unminified Vite dev build** that exposes
`/src/*.jsx` modules with inline base64 source maps containing original source.
A recursive crawler followed every `import` from `/src/main.jsx`, decoding
`sourcesContent` from each module's source map — yielding ~87 original source
files. The complete client-side API layer (`src/api/index.js`, 1765 lines)
enumerates every backend endpoint the frontend calls, from which the backend
contract, database schema, validations and business rules were inferred.

> ⚠️ **Security note for the owner:** the production deployment is shipping a
> dev build with full source maps and verbose `console.log` of tokens/roles.
> This should be a minified production build with source maps disabled.

## 6. Status

Documentation phase complete. **No implementation has begun.** Implementation
awaits explicit approval (see end of the conversation / PRD §Open Questions).
</content>
</invoke>
