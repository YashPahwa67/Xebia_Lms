# API Specification — Xebia LMS (inferred)

Base URL: `https://lms-xebia.onrender.com/api`
Auth: `Authorization: Bearer <JWT>` (from `localStorage.token`); `withCredentials: true`.
Conventions: JSON bodies; list endpoints accept query params (`page`, `limit`,
`search`, `status`, filters) serialized via `URLSearchParams`.
Errors: `{ message: string }` or `{ errors: [{ path, message }] }`; `401` → client clears auth and redirects to `/login`.

> Every endpoint below is **directly referenced** by the frontend API client
> (`src/api/index.js`) or feature modules. Methods/paths are exact; request
> bodies are inferred from call sites; responses are inferred from usage.

## Auth — `/auth`
| Method | Path | Body | Notes |
|--------|------|------|-------|
| POST | `/auth/login` | `{ email, password }` | → `{ token, user }` |
| GET | `/auth/google` | — | OAuth redirect (Passport) |
| GET | `/auth/github` | — | OAuth redirect (Passport) |
| — | `/success?token=` | — | Frontend route; backend redirects here with JWT |
| POST | `/auth/forgot-password` | `{ email }` | sends reset email |
| PUT | `/auth/reset-password/:token` | `{ password }` | token-bound reset |
| PUT | `/auth/change-password` | `{ currentPassword, newPassword }` | authenticated |

JWT payload (decoded client-side): `{ id/_id, email, fullName/name, role|roleName }`.

## Users — `/users` (Admin)
| Method | Path | Body | Notes |
|--------|------|------|-------|
| GET | `/users` | — (`?search,page,limit,role,status`) | list |
| POST | `/users/create` | user fields | create single |
| PUT | `/users/:id/update-role` | `{ roleName }` | |
| DELETE | `/users/:id` | — | |
| PUT | `/users/:id/toggle-active` | — | activate/deactivate |
| POST | `/users/upload-users/presigned` | `{ filename }` | → `{ url, objectKey }` (S3 PUT) |
| POST | `/users/upload-users` | `{ key, filename }` | process uploaded Excel |
| GET | `/users/dashboard-stats` | — | admin dashboard cards |
| PUT | `/users/me` | profile fields | update own profile |
| GET | `/users/students-details` | params | students + enrollments |
| GET | `/users/trainers` | params | trainer list |
| GET | `/users/trainers/:id/details` | — | trainer detail |

## Courses — `/course`
| Method | Path | Body | Notes |
|--------|------|------|-------|
| GET | `/course` | params | list (Admin/Trainer) → `{ courses: [...] }` |
| POST | `/course` | `{ title, description, modules[] }` | create (Trainer) |
| GET | `/course/:id` | — | detail |
| DELETE | `/course/:id` | — | delete |
| GET | `/course/approved` | params | approved (Learner) |
| GET | `/course/pending` | params | pending approval (Admin) |
| PUT | `/course/:id/approve` | `{}` | Admin |
| PUT | `/course/:id/reject` | `{ reason }` | Admin |
| POST | `/course/:id/request-approval` | — | Trainer submits |
| GET | `/course/:id/stats` | — | course statistics |
| GET | `/course/:id/content` | `?contentType=` | list content |
| POST | `/course/:id/content/presign` | `{ filename, contentType, fileSize }` | → `{ url, objectKey }` |
| POST | `/course/:id/content` | content metadata | register uploaded content |
| GET | `/course/:id/content/:contentId/view` | — | → `{ url }` presigned view |
| DELETE | `/course/:id/content/:contentId` | — | delete content |
| POST | `/course/:id/enroll-students` | `{ studentIds[] }` | Trainer bulk enroll |
| GET | `/course/:id/enrollments` | — | Trainer |
| DELETE | `/course/:id/enrollments/:studentId` | — | remove student |

Content metadata: `{ objectKey, title, description, type, fileSize, mimeType, originalName, category, isPublic }`.

## Learner — `/learner`
| Method | Path | Body | Notes |
|--------|------|------|-------|
| GET | `/learner/content` | params | enrolled content |
| GET | `/learner/content/category/:category` | params | by category |
| GET | `/learner/course/:courseId/content/:contentId/access` | — | → `{ url, metadata }` |
| POST | `/learner/courses/:courseId/enroll` | — | self-enroll |
| GET | `/learner/courses/enrolled` | params | enrolled courses |
| GET | `/learner/courses/:courseId/progress` | — | progress |
| PUT | `/learner/courses/:courseId/progress` | progress data | update |
| GET | `/learner/dashboard-stats` | params | main dashboard |
| GET | `/learner/analytics/dashboard-stats` | params | analytics |
| GET | `/learner/analytics/performance` | params | performance chart |
| GET | `/learner/analytics/recent-activity` | params | activity feed |
| GET | `/learner/assessments` | params | list |
| GET | `/learner/assessments/:id` | — | detail |
| POST | `/learner/assessments/:id/start` | — | begin attempt |
| POST | `/learner/assessments/:id/submit` | `{ answers }` | submit |
| GET | `/learner/assessments/:id/result` | — | result |
| GET | `/learner/assessments/:id/files/:fileKey/download` | — | presigned download |

## Trainer — `/trainer`
| Method | Path | Body | Notes |
|--------|------|------|-------|
| GET | `/trainer/students` | params | students in trainer's courses |
| GET | `/trainer/hours-analytics` | params | hours |
| GET | `/trainer/notifications` | params | notifications |
| GET | `/trainer/analytics/dashboard-stats` | params | dashboard |
| GET | `/trainer/analytics/performance` | params | performance |
| GET | `/trainer/analytics/recent-activity` | params | activity |
| GET | `/trainer/batches` | params | list |
| POST | `/trainer/batches` | batch data | create |
| PUT | `/trainer/batches/:id` | batch data | update |
| DELETE | `/trainer/batches/:id` | — | delete |
| GET | `/trainer/batches/:id/stats` | — | stats |
| POST | `/trainer/batches/:id/students` | `{ studentId }` or `{ email }` | add |
| PUT | `/trainer/batches/:id/students/:studentId` | status data | update status |
| DELETE | `/trainer/batches/:id/students/:studentId` | — | remove |
| GET | `/trainer/assessments` | params | list |
| POST | `/trainer/assessments` | assessment payload | create |
| GET | `/trainer/assessments/:id` | — | detail |
| PUT | `/trainer/assessments/:id` | data | update |
| DELETE | `/trainer/assessments/:id` | — | delete |
| GET | `/trainer/assessments/:id/results` | — | results |
| POST | `/trainer/assessments/upload/presign` | `{ filename, contentType, fileSize }` | → `{ uploadUrl, objectKey }` |
| GET | `/trainer/assessments/:id/files/:fileKey/access` | — | presigned access |
| POST | `/trainer/assessments/generate-questions` | `{ topic, difficulty, numberOfQuestions, ... }` | **AI generation** |

Assessment payload: `{ course, title, description, dueDate, duration, questions[], passingScore, attachments[] }`.

## Live Classes — `/live-classes`
| Method | Path | Body |
|--------|------|------|
| GET | `/live-classes` | — |
| POST | `/live-classes` | class data |
| PUT | `/live-classes/:id` | class data |
| DELETE | `/live-classes/:id` | — |
| POST | `/live-classes/:id/join` | — |

## Universities — `/university` (Admin)
| Method | Path | Body |
|--------|------|------|
| GET | `/university` | — |
| GET | `/university/:id` | — |
| POST | `/university` | data |
| POST | `/university/bulk` | bulk data |
| PATCH | `/university/:id` | data |
| PATCH | `/university/:id/status` | — (toggle) |

## Notifications — `/notifications`
| Method | Path | Body |
|--------|------|------|
| GET | `/notifications/` | `?page,limit` |
| PUT | `/notifications/:id/read` | — |
| PUT | `/notifications/mark-all-read` | — |
| DELETE | `/notifications/:id` | — |

## Admin Activity & Analytics — `/admin`, `/analytics`
| Method | Path |
|--------|------|
| GET | `/admin/activities` |
| GET | `/admin/activities/login` |
| GET | `/admin/activities/user-created` |
| GET | `/analytics/login-analytics` |
| GET | `/analytics/user-activity-trend` |
| GET | `/analytics/trainer-stats` |

## S3 direct (not API)
`PUT <presignedUrl>` with raw file body and `Content-Type` header — used for
user bulk upload, course content, and assessment attachments. Bucket
`xebiausercreatebucket`, region `ap-south-1`.
</content>
