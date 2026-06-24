# Folder Structure — Xebia LMS

## 1. Actual structure (reverse-engineered from deployment, ~87 source files)

```
src/
├── main.jsx                      # entry: BrowserRouter + App
├── App.jsx                       # top-level routes + role guards
├── index.css                     # Tailwind
├── LandingPage.jsx
├── Login.jsx
├── Forgot.jsx
├── Reset.jsx
├── OAuthSuccess.jsx
├── api/
│   └── index.js                  # ALL domain API clients (axios) — 1765 lines
├── contexts/
│   └── AuthContext.jsx           # auth reducer/provider/useAuth
├── routes/
│   └── PrivateRoute.jsx          # role + active gating
├── Hooks/                        # (note: capital H)
│   ├── useDashboardStats.js
│   └── useTrainerDashboard.js
├── utils/
│   ├── courseUtils.js            # lesson count, duration
│   └── dataTransformers.js
├── components/                   # admin/shared components
│   ├── DashboardSidebar.jsx  StatsCards.jsx  Actionpanel.jsx
│   ├── LoginTimeChart.jsx  LiveclassesChart.jsx  NotificationPanel.jsx
│   ├── BulkUploadUsers.jsx  CourseApproval.jsx
│   ├── CreateUniversityModal.jsx  EditUniversityModal.jsx
│   ├── BulkUploadUniversityModal.jsx  UniversityDetailsModal.jsx
└── features/
    ├── admin/
    │   ├── dashboard.jsx  Users.jsx  manage.jsx  settings.jsx
    │   ├── datatable.jsx  Universities.jsx
    ├── trainer/
    │   ├── Components/   (Layout, Sidebar, Topbar, cards, modals,
    │   │                 Settings*, FileUpload, Exam*, hooks/useTrainerServices.js)
    │   └── Pages/        (TrainerDashboard, Courses, CourseDetails, MyClass,
    │                      Assesment, Exams, Content, Settings, LiveClassHost)
    └── learner/
        ├── components/  (LearnerLayout, Sidebar, Header, Banner, charts,
        │                 coursesSection/*, myLearning/*)
        └── pages/       (Dashboard, Courses, CourseDetail, MyLearning,
                          Assessments, TakeAssessment, Resources, Settings,
                          LiveClassRoom)
```

### Inconsistencies noted (to fix in rebuild)
- Mixed casing: `Hooks/` vs `utils/`, `Components/` (trainer) vs `components/` (learner).
- Page files mix `PascalCase` and `lowercase` (`dashboard.jsx`, `manage.jsx`).
- `manage.jsx` exported as `Management` but no route wired (legacy/unused).
- Typo `Assesment` (single s) in trainer pages.
- Monolithic `api/index.js` mixing many domains.

## 2. Proposed structure for the production rebuild (TypeScript)

```
src/
├── main.tsx
├── app/
│   ├── App.tsx
│   ├── router.tsx                # route config (lazy-loaded)
│   └── providers.tsx             # Auth + QueryClient + Theme
├── config/
│   └── env.ts                    # typed env (VITE_API_URL, S3, region)
├── lib/
│   ├── apiClient.ts              # axios instance + interceptors
│   ├── queryClient.ts            # TanStack Query
│   └── s3Upload.ts               # presigned 3-step helper (reusable)
├── types/                        # shared domain types (User, Course, ...)
├── services/                     # one file per domain (typed)
│   ├── auth.service.ts   users.service.ts   courses.service.ts
│   ├── enrollment.service.ts  assessment.service.ts  batch.service.ts
│   ├── liveClass.service.ts  notification.service.ts
│   ├── analytics.service.ts  university.service.ts
├── hooks/                        # reusable query/mutation hooks
│   ├── useAuth.ts  useCourses.ts  useAssessments.ts  useUpload.ts ...
├── components/                   # shared UI primitives
│   ├── ui/ (Button, Modal, Table, Spinner, EmptyState, ErrorState)
│   ├── charts/  forms/  upload/
├── features/
│   ├── auth/        (Login, Forgot, Reset, OAuthSuccess)
│   ├── admin/       (pages + components)
│   ├── trainer/     (pages + components)
│   └── learner/     (pages + components)
├── routes/
│   └── ProtectedRoute.tsx
└── utils/  (courseUtils.ts, formatters.ts, validators/zod schemas)
```

Principles for the rebuild: strong typing (TS + Zod), one service per domain
(no monolith), reusable hooks (TanStack Query), shared UI primitives for
loading/empty/error/accessibility, feature-based foldering, lazy-loaded routes.
</content>
