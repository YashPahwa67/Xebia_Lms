# Database Design — Xebia LMS (inferred)

Inferred datastore: **MongoDB** (Mongoose). Evidence: 24-hex ObjectId
validation (`/^[0-9a-fA-F]{24}$/`), `_id` usage, `roleName`/`role.name`
duality, embedded `modules`/`questions` arrays, validation `errors[{path,message}]`.

IDs are `ObjectId`. Timestamps `createdAt`/`updatedAt` assumed on all.

## Collections

### `users`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `fullName` | String | |
| `email` | String | unique, login identity |
| `password` | String | bcrypt hash (null for pure-OAuth) |
| `role` | ObjectId→`roles` \| String | `Admin`/`Trainer`/`Learner` |
| `university` | ObjectId→`universities` | tenant association |
| `isActive` | Boolean | gates login/routes |
| `oauthProvider` | String | `google`/`github`/null |
| `oauthId` | String | provider subject |
| `resetPasswordToken` | String | for forgot/reset |
| `resetPasswordExpires` | Date | |
| `lastLoginAt` | Date | feeds login analytics |
| `profile` | Object | personal details, avatar, notification prefs |

### `roles`
`{ _id, name: 'Admin'|'Trainer'|'Learner', permissions[] }` (RBAC).

### `universities` (tenants)
`{ _id, name, code, status: 'active'|'inactive', contact, address, metadata, createdBy }`.

### `courses`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `title` | String | required |
| `description` | String | required |
| `trainer` | ObjectId→`users` | owner/author |
| `university` | ObjectId→`universities` | |
| `modules` | Array | embedded (below) |
| `status` | String | `draft`/`pending`/`approved`/`rejected` |
| `rejectionReason` | String | when rejected |
| `approvedBy` | ObjectId→`users` | admin |
| `approvedAt` | Date | |
| `stats` | Object | enrollments, completion |

`modules[]` (embedded): `{ _id, title, order, videos[], pdfs[], assignments[] }`
where each item ~ `{ _id, title, objectKey, mimeType, fileSize, duration }`.

### `course_content` (or embedded content records)
`{ _id, course→courses, objectKey, title, description, type, category, mimeType, fileSize, originalName, isPublic, uploadedBy }`.

### `enrollments`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `learner` | ObjectId→`users` | |
| `course` | ObjectId→`courses` | |
| `batch` | ObjectId→`batches` | optional |
| `enrolledBy` | ObjectId→`users` | self or trainer |
| `status` | String | active/completed/removed |
| `progress` | Object/Number | per-content completion %, see below |
| `enrolledAt` | Date | |

`progress`: `{ percentage, completedContentIds[], lastAccessedAt }`.

### `batches`
`{ _id, name, trainer→users, course→courses, students:[{ user→users, status, addedAt }], startDate, endDate, stats }`.

### `assessments`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `course` | ObjectId→`courses` | required |
| `trainer` | ObjectId→`users` | author |
| `title` / `description` | String | |
| `dueDate` | Date | |
| `duration` | Number | minutes (default 60) |
| `passingScore` | Number | percent (default 70) |
| `questions` | Array | embedded (below) |
| `attachments` | Array | `{ filename, objectKey, size, mimeType }` |
| `aiGenerated` | Boolean | if from generate-questions |

`questions[]`: `{ _id, text, type (mcq/...), options[], correctAnswer, difficulty, marks }`.

### `assessment_attempts` / `results`
`{ _id, assessment→assessments, learner→users, startedAt, submittedAt, answers[], score, passed: Boolean, durationTaken }`.

### `live_classes`
`{ _id, title, course→courses, trainer→users, roomId, scheduledAt, duration, status (scheduled/live/ended), participants:[user→users], joinUrl }`.

### `notifications`
`{ _id, user→users, type, title, message, isRead: Boolean, link, createdAt }`.

### `activity_logs`
`{ _id, user→users, action, type (login/user-created/...), entity, entityId, metadata, ip, userAgent, createdAt }` — powers admin activity & login analytics.

## Relationship summary

```
universities 1───* users
roles        1───* users
users(trainer) 1───* courses ───* modules(embedded)
courses      1───* course_content
courses      *───* users(learners)  via enrollments
courses      1───* batches ───* users(students)
courses      1───* assessments ───* questions(embedded)
assessments  1───* assessment_attempts ───1 users(learner)
courses      1───* live_classes ───* users(participants)
users        1───* notifications
users        1───* activity_logs
```

## Indexes (recommended)
- `users.email` unique; `users.role`, `users.university`, `users.isActive`.
- `courses.status`, `courses.trainer`, `courses.university`.
- `enrollments` compound unique `{ learner, course }`.
- `assessment_attempts` compound `{ assessment, learner }`.
- `notifications` `{ user, isRead }`; `activity_logs` `{ type, createdAt }`.
</content>
