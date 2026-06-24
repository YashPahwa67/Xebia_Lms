# Component Tree & Route Map — Xebia LMS

## 1. Route map (complete)

### Top-level (`App.jsx`)
| Path | Component | Guard |
|------|-----------|-------|
| `/` | `LandingPage` | public |
| `/login` | `Login` | public |
| `/forgot-password` | `ForgotPassword` | public |
| `/reset-password/:token` | `ResetPassword` | public |
| `/success` | `OAuthSuccess` | public (OAuth callback) |
| `/admin/dashboard` | `Dashboard` | Admin |
| `/admin/users` | `Users` | Admin |
| `/admin/data-tables` | `DataTables` | Admin |
| `/admin/settings` | `Settings` | Admin |
| `/admin/universities` | `Universities` | Admin |
| `/trainer/*` | `TrainerLayout` | Trainer |
| `/trainer/live-class/:roomId` | `LiveClassHost` | Trainer |
| `/learner/*` | `LearnerLayout` | Learner |
| `/unauthorized` | `UnauthorizedPage` | — |
| `*` | `NotFoundPage` | — |

### Trainer nested (`TrainerLayout`)
`/trainer/dashboard` · `/trainer/courses` · `/trainer/courses/:id` ·
`/trainer/myclass` · `/trainer/assesment` · `/trainer/exams` ·
`/trainer/content` · `/trainer/settings/*`

### Learner nested (`LearnerLayout`)
`/learner/dashboard` · `/learner/courses` · `/learner/courses/:id` ·
`/learner/learning` · `/learner/assessments` · `/learner/assessments/:id` ·
`/learner/resources` · `/learner/settings/*` · `/learner/classroom/:id`

## 2. Component hierarchy

```
main.jsx
└── BrowserRouter
    └── App
        └── AuthProvider (Context + useReducer)
            └── Routes
                ├── LandingPage
                ├── Login (email/pw + Google/GitHub OAuth)
                ├── ForgotPassword
                ├── ResetPassword
                ├── OAuthSuccess
                ├── PrivateRoute[Admin]
                │   ├── Dashboard (admin)
                │   │   ├── DashboardSidebar
                │   │   ├── StatsCards
                │   │   ├── LoginTimeChart (recharts)
                │   │   ├── LiveclassesChart (recharts)
                │   │   ├── RecentActivity
                │   │   ├── NotificationPanel
                │   │   └── Actionpanel
                │   ├── Users
                │   │   ├── BulkUploadUsers (xlsx → S3)
                │   │   └── (create/edit/role/active/delete)
                │   ├── DataTables
                │   ├── Settings (admin)
                │   ├── Universities
                │   │   ├── CreateUniversityModal
                │   │   ├── EditUniversityModal
                │   │   ├── BulkUploadUniversityModal
                │   │   └── UniversityDetailsModal
                │   └── CourseApproval (approve/reject)
                ├── PrivateRoute[Trainer]
                │   └── TrainerLayout (Sidebar + Topbar)
                │       ├── TrainerDashboard
                │       │   ├── EnhancedStatsCards
                │       │   └── RecentActivity
                │       ├── Courses (trainer)
                │       │   ├── CoursesTabs
                │       │   ├── CourseCard / CreateCourseCard
                │       │   ├── CreateCourseModal
                │       │   └── SearchBar
                │       ├── CourseDetails
                │       │   └── CourseVideoManager
                │       ├── MyClass
                │       │   └── StudentEnrollmentModal
                │       ├── Assesment
                │       │   ├── CreateAssessmentModal (AI generate)
                │       │   └── FileUpload
                │       ├── Exams
                │       │   ├── ExamTabs / ExamSearchBar
                │       │   ├── ExamCard / AddExamModal
                │       │   └── ExamDetailsModal
                │       ├── Content
                │       │   └── ContentLibrary
                │       ├── Settings (trainer)
                │       │   ├── SettingsBasicInfo
                │       │   ├── SettingsPersonalDetails
                │       │   ├── SettingsChangePassword
                │       │   └── SettingsNotification
                │       └── LiveClassCard
                │   └── LiveClassHost (/trainer/live-class/:roomId)
                └── PrivateRoute[Learner]
                    └── LearnerLayout (Sidebar + Header)
                        ├── Dashboard (learner)
                        │   ├── Banner
                        │   ├── LearnerPerformanceChart (recharts)
                        │   └── LearnerRecentActivity
                        ├── Courses (learner)
                        │   ├── CourseCardLayout
                        │   ├── MyCourses / OngoingCourses
                        ├── CourseDetail (enroll)
                        ├── MyLearning
                        │   ├── StatCard
                        │   └── LiveClasses
                        ├── Assessments
                        ├── TakeAssessment (start/submit, timer)
                        ├── Resources (view/download)
                        ├── Settings (learner)
                        └── LiveClassRoom (/learner/classroom/:id)
```

## 3. Shared / reusable building blocks observed
- Charts: `LoginTimeChart`, `LiveclassesChart`, `LearnerPerformanceChart` (recharts).
- Modals: course/university/exam/assessment/enrollment create/edit/details.
- Upload: `FileUpload`, `BulkUploadUsers`, `BulkUploadUniversityModal`.
- Panels: `NotificationPanel`, `RecentActivity`, `StatsCards`/`EnhancedStatsCards`.
- Hooks: `useDashboardStats`, `useTrainerDashboard`, `useTrainerServices`.
</content>
