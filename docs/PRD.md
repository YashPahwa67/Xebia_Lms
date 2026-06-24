# Product Requirements Document — Xebia LMS

## 1. Overview
A role-based Learning Management System enabling organizations/universities to
deliver training: course authoring & approval, content delivery, live classes,
AI-assisted assessments, enrollment/batch management, and analytics.

## 2. Personas & Roles

| Role | Description | Primary goals |
|------|-------------|---------------|
| **Admin** | Platform operator | Manage users, universities (tenants), approve courses, view platform analytics & activity logs, configure settings |
| **Trainer** | Course author / instructor | Create courses & content, run live classes, build assessments/exams (incl. AI generation), enroll/manage students & batches, view performance |
| **Learner** | Student | Discover & enroll in courses, consume content, attend live classes, take assessments, track progress |

Roles are stored on the user record (`role.name` or `roleName`) and enforced
both client-side (`PrivateRoute allowedRoles`) and server-side (inferred).

## 3. Feature inventory (by role)

### 3.1 Public / Unauthenticated
- Landing page (marketing) — `/`
- Login (email+password, Google OAuth, GitHub OAuth) — `/login`
- Forgot password (email reset link) — `/forgot-password`
- Reset password (token link) — `/reset-password/:token`
- OAuth success callback handler — `/success`
- Unauthorized (403) and Not-Found (404) pages

### 3.2 Admin (`/admin/*`)
- **Dashboard** — stat cards, login-time chart, live-classes chart, recent activity, notifications
- **Users** — list/search/filter, create single user, bulk upload via Excel→S3, update role, toggle active, delete; view student & trainer details with enrollments
- **Data Tables** — tabular views of platform entities
- **Universities** — CRUD tenants, bulk upload, toggle status, view details
- **Settings** — platform configuration
- **Course Approval** — review pending courses, approve/reject with reason
- **Analytics** — login analytics, user-activity trends; activity/login/user-creation logs

### 3.3 Trainer (`/trainer/*`)
- **Dashboard** — enhanced stats, performance charts, hours analytics, recent activity, notifications
- **Courses** — list, create (modules), course details, video/content manager, delete; request approval
- **Content Library** — upload (presigned S3), register, view, delete content by type
- **My Class** — enrolled students, enroll students (modal), student enrollment management
- **Assessments / Exams** — create (manual or AI-generated questions), attach file (S3 ≤10MB), edit, delete, view results, exam cards/tabs/search
- **Live Class Host** — host a live class room (`/trainer/live-class/:roomId`), camera/mic via getUserMedia, participants panel
- **Batches** — create/update/delete batches, add/remove students (by id or email), batch stats
- **Settings** — basic info, personal details, change password, notifications

### 3.4 Learner (`/learner/*`)
- **Dashboard** — stat cards, performance chart, recent activity, banner
- **Courses** — browse approved courses, course detail, enroll
- **My Learning** — ongoing/my courses, progress tracking, live classes
- **Assessments** — list, take assessment (start/submit), view result, download attachment
- **Resources** — enrolled content by category, view/download via presigned URL
- **Live Class Room** — join live class (`/learner/classroom/:id`), camera/mic
- **Settings** — profile, change password, notifications

## 4. Key user stories

1. *As an Admin* I bulk-import users from an Excel file so onboarding is fast.
2. *As an Admin* I approve or reject trainer-submitted courses with a reason so quality is controlled.
3. *As a Trainer* I generate assessment questions from a topic/difficulty/count using AI so authoring is faster.
4. *As a Trainer* I upload course videos/PDFs directly to S3 via presigned URLs so large files don't hit the API.
5. *As a Learner* I enroll in an approved course and my progress is tracked per content item.
6. *As a Learner* I take a timed assessment and immediately see my score against the passing threshold.
7. *As any user* I reset my password through an emailed token link.

## 5. Business rules (inferred)

- **Course lifecycle:** `draft → pending (request-approval) → approved | rejected(reason)`. Only **approved** courses are visible to learners (`/course/approved`).
- **Enrollment:** learners self-enroll in approved courses; trainers can also enroll students into a course or a batch. Progress is per-course and updatable.
- **Assessments:** have `dueDate`, `duration` (minutes, default 60), `passingScore` (default 70), questions array, optional file attachment. Learner flow is `start → submit(answers)`, then result is computed server-side against `passingScore`.
- **Lesson counting:** a course's "lesson count" = videos + pdfs + assignments across modules; duration estimated from modules (see `courseUtils`).
- **Roles:** exactly three — `Admin`, `Trainer`, `Learner`. Routes gate by role; inactive accounts are blocked (`isActive` check).
- **Multi-tenancy:** Universities act as tenants; users/courses are associated with a university.

## 6. Validations (inferred from client + error handling)

- Login: email + password required; server returns `{ token, user }`.
- User create: server-side validation returns `errors[]` with `{ path, message }`.
- Course create: `title` and `description` required; `modules` defaults to `[]`.
- Assessment create: `course` (ObjectId or resolvable title), `title`, `description`, `dueDate`, `duration`, `questions[]`, `passingScore`.
- File upload: type whitelist (`.xlsx/.xls/.csv` for users; documents/video for content); assessment file ≤ **10MB**.
- Password reset: token-bound; change-password requires `currentPassword` + `newPassword`.
- ObjectId format validated client-side via `/^[0-9a-fA-F]{24}$/`.

## 7. Non-functional requirements
- Resilience to Render cold starts (60s client timeout).
- Role-based authorization on every protected route and endpoint.
- Loading, empty and error states across data views (present in current UI).
- Responsive Tailwind UI.

## 8. Open questions / assumptions
- AI question generation provider is server-side (endpoint `/trainer/assessments/generate-questions`); provider unknown — **recommend Claude (`claude-opus-4-8`)** for the rebuild.
- Live classes use `getUserMedia` but no signaling library was found client-side; real-time transport (WebRTC/SFU/socket) is unconfirmed — appears to be a UI shell with a backend `join` endpoint.
- Notifications transport (poll vs websocket) is REST-poll in the observed code.
</content>
