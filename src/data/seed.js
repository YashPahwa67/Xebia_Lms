// Sample data for the demo. Same shape the API would return so we can swap
// DataContext for real services later.

import { ROLES } from '@/constants';

export const CURRENT = {
  [ROLES.DIRECTOR]: 'd1',
  [ROLES.COUNSELLOR]: 'c1',
  [ROLES.TEACHER]: 't1',
  [ROLES.STUDENT]: 's1',
};

export const users = [
  { id: 'd1', name: 'Dr. Anita Rao', email: 'director@xebia.edu', role: ROLES.DIRECTOR },
  { id: 'c1', name: 'Rohan Verma', email: 'counsellor@xebia.edu', role: ROLES.COUNSELLOR },
  { id: 't1', name: 'Meera Iyer', email: 'teacher@xebia.edu', role: ROLES.TEACHER, subjects: ['sub1', 'sub2'] },
  { id: 't2', name: 'Vikram Shah', email: 'vikram@xebia.edu', role: ROLES.TEACHER, subjects: ['sub3'] },
  { id: 't3', name: 'Neha Gupta', email: 'neha@xebia.edu', role: ROLES.TEACHER, subjects: ['sub4'] },
  { id: 's1', name: 'Aarav Mehta', email: 'student@xebia.edu', role: ROLES.STUDENT, batch: 'CS-2A', roll: 'CS22-014' },
  { id: 's2', name: 'Sara Khan', email: 'sara@xebia.edu', role: ROLES.STUDENT, batch: 'CS-2A', roll: 'CS22-021' },
  { id: 's3', name: 'Daniel Okafor', email: 'daniel@xebia.edu', role: ROLES.STUDENT, batch: 'CS-2A', roll: 'CS22-033' },
  { id: 's4', name: 'Priya Sharma', email: 'priya@xebia.edu', role: ROLES.STUDENT, batch: 'CS-2B', roll: 'CS22-048' },
  { id: 's5', name: 'Liam Walsh', email: 'liam@xebia.edu', role: ROLES.STUDENT, batch: 'CS-2B', roll: 'CS22-052' },
];

export const subjects = [
  { id: 'sub1', name: 'Data Structures', code: 'CS201', teacherId: 't1', credits: 4 },
  { id: 'sub2', name: 'Operating Systems', code: 'CS202', teacherId: 't1', credits: 4 },
  { id: 'sub3', name: 'Database Systems', code: 'CS203', teacherId: 't2', credits: 3 },
  { id: 'sub4', name: 'Computer Networks', code: 'CS204', teacherId: 't3', credits: 3 },
];

// student -> enrolled subject ids
export const enrollments = {
  s1: ['sub1', 'sub2', 'sub3', 'sub4'],
  s2: ['sub1', 'sub2', 'sub3'],
  s3: ['sub1', 'sub2', 'sub4'],
  s4: ['sub1', 'sub3', 'sub4'],
  s5: ['sub2', 'sub3', 'sub4'],
};

export const assessments = [
  { id: 'a1', subjectId: 'sub1', title: 'Arrays & Linked Lists Quiz', type: 'Quiz', totalMarks: 20, dueDate: '2026-07-02' },
  { id: 'a2', subjectId: 'sub1', title: 'Trees Assignment', type: 'Assignment', totalMarks: 50, dueDate: '2026-07-10' },
  { id: 'a3', subjectId: 'sub2', title: 'Process Scheduling Test', type: 'Test', totalMarks: 30, dueDate: '2026-07-05' },
  { id: 'a4', subjectId: 'sub3', title: 'SQL Joins Quiz', type: 'Quiz', totalMarks: 20, dueDate: '2026-06-28' },
  { id: 'a5', subjectId: 'sub4', title: 'OSI Model Assignment', type: 'Assignment', totalMarks: 40, dueDate: '2026-07-12' },
];

// submissions keyed by `${assessmentId}:${studentId}`
export const submissions = [
  { assessmentId: 'a1', studentId: 's1', marks: 18, status: 'graded' },
  { assessmentId: 'a4', studentId: 's1', marks: 15, status: 'graded' },
  { assessmentId: 'a1', studentId: 's2', marks: 16, status: 'graded' },
  { assessmentId: 'a3', studentId: 's3', marks: 22, status: 'graded' },
];

// attendance sessions: each has per-student status
export const attendance = [
  { id: 'at1', subjectId: 'sub1', date: '2026-06-16', records: { s1: 'present', s2: 'present', s3: 'absent' } },
  { id: 'at2', subjectId: 'sub1', date: '2026-06-18', records: { s1: 'present', s2: 'absent', s3: 'present' } },
  { id: 'at3', subjectId: 'sub2', date: '2026-06-17', records: { s1: 'present', s2: 'present', s5: 'present' } },
  { id: 'at4', subjectId: 'sub2', date: '2026-06-19', records: { s1: 'absent', s2: 'present', s5: 'present' } },
];

export const fees = [
  { studentId: 's1', total: 120000, paid: 90000, dueDate: '2026-07-15', payments: [{ date: '2026-01-10', amount: 60000, method: 'Bank Transfer' }, { date: '2026-04-12', amount: 30000, method: 'UPI' }] },
  { studentId: 's2', total: 120000, paid: 120000, dueDate: '2026-07-15', payments: [{ date: '2026-01-09', amount: 120000, method: 'Bank Transfer' }] },
  { studentId: 's3', total: 120000, paid: 45000, dueDate: '2026-07-15', payments: [{ date: '2026-02-01', amount: 45000, method: 'UPI' }] },
  { studentId: 's4', total: 110000, paid: 110000, dueDate: '2026-07-15', payments: [{ date: '2026-01-15', amount: 110000, method: 'Card' }] },
  { studentId: 's5', total: 110000, paid: 0, dueDate: '2026-07-15', payments: [] },
];

// Notes uploaded by teachers, visible to students enrolled in the subject.
export const notes = [
  { id: 'n1', subjectId: 'sub1', title: 'Lecture 1 — Arrays & Complexity', fileName: 'ds-arrays.pdf', fileSize: 1240000, addedBy: 't1', uploadedAt: '2026-06-12' },
  { id: 'n2', subjectId: 'sub1', title: 'Linked Lists — slides', fileName: 'linked-lists.pdf', fileSize: 980000, addedBy: 't1', uploadedAt: '2026-06-15' },
  { id: 'n3', subjectId: 'sub2', title: 'Process Scheduling notes', fileName: 'os-scheduling.pdf', fileSize: 1560000, addedBy: 't1', uploadedAt: '2026-06-14' },
];

// Notifications target specific users; `readBy` tracks per-user read state.
export const notifications = [
  { id: 'no1', userIds: ['s1'], type: 'note', title: 'New notes in Data Structures', meta: 'Linked Lists — slides', createdAt: '2026-06-15T09:00', readBy: [] },
  { id: 'no2', userIds: ['s1'], type: 'assessment', title: 'New assessment: SQL Joins Quiz', meta: 'Database Systems · due Jun 28', createdAt: '2026-06-20T10:00', readBy: [] },
  { id: 'no3', userIds: ['t1'], type: 'submission', title: 'Aarav submitted Arrays Quiz', meta: 'scored 18 / 20', createdAt: '2026-06-18T14:00', readBy: [] },
  { id: 'no4', userIds: ['c1'], type: 'fee', title: 'Fee dues reminder', meta: '2 students pending payment', createdAt: '2026-06-19T08:00', readBy: [] },
  { id: 'no5', userIds: ['d1'], type: 'system', title: 'Monthly report ready', meta: 'June enrolment up 12%', createdAt: '2026-06-22T08:00', readBy: [] },
];

// Deep clone so session mutations never corrupt the seed module.
export const cloneSeed = () => ({
  users: structuredClone(users),
  subjects: structuredClone(subjects),
  enrollments: structuredClone(enrollments),
  assessments: structuredClone(assessments),
  submissions: structuredClone(submissions),
  attendance: structuredClone(attendance),
  fees: structuredClone(fees),
  notes: structuredClone(notes),
  notifications: structuredClone(notifications),
});
