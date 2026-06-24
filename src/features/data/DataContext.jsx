import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { cloneSeed } from '@/data/seed';

const DataContext = createContext(null);

let idSeq = 1000;
const nextId = (p) => `${p}${++idSeq}`;

const enrolledStudentIds = (db, subjectId) =>
  db.users.filter((u) => u.role === 'Student' && (db.enrollments[u.id] || []).includes(subjectId)).map((u) => u.id);

const makeNotif = (userIds, type, title, meta) => ({
  id: nextId('no'),
  userIds,
  type,
  title,
  meta,
  createdAt: new Date().toISOString(),
  readBy: [],
});

export function DataProvider({ children }) {
  const [db, setDb] = useState(cloneSeed);

  // ---- selectors ----
  const selectors = useMemo(() => {
    const subjectById = (id) => db.subjects.find((s) => s.id === id);
    const userById = (id) => db.users.find((u) => u.id === id);
    return {
      subjectById,
      userById,
      teacherSubjects: (teacherId) => db.subjects.filter((s) => s.teacherId === teacherId),
      studentSubjects: (studentId) =>
        (db.enrollments[studentId] || []).map(subjectById).filter(Boolean),
      studentsInSubject: (subjectId) =>
        db.users.filter((u) => u.role === 'Student' && (db.enrollments[u.id] || []).includes(subjectId)),
      assessmentsForSubjects: (subjectIds) =>
        db.assessments.filter((a) => subjectIds.includes(a.subjectId)),
      submission: (assessmentId, studentId) =>
        db.submissions.find((s) => s.assessmentId === assessmentId && s.studentId === studentId),
      attendanceForSubject: (subjectId) => db.attendance.filter((a) => a.subjectId === subjectId),
      studentAttendance: (studentId) => {
        let present = 0;
        let total = 0;
        db.attendance.forEach((sess) => {
          if (studentId in sess.records) {
            total += 1;
            if (sess.records[studentId] !== 'absent') present += 1;
          }
        });
        return { present, total, percent: total ? Math.round((present / total) * 100) : 0 };
      },
      feeFor: (studentId) => db.fees.find((f) => f.studentId === studentId),
      notesForSubject: (subjectId) =>
        db.notes.filter((n) => n.subjectId === subjectId).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
      notificationsFor: (userId) =>
        db.notifications
          .filter((n) => n.userIds.includes(userId))
          .map((n) => ({ ...n, read: n.readBy.includes(userId) }))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      students: () => db.users.filter((u) => u.role === 'Student'),
      teachers: () => db.users.filter((u) => u.role === 'Teacher'),
      counsellors: () => db.users.filter((u) => u.role === 'Counsellor'),
    };
  }, [db]);

  // ---- actions ----
  const createAssessment = useCallback((data) => {
    const a = { id: nextId('a'), totalMarks: 20, type: 'Quiz', ...data };
    setDb((p) => {
      const subject = p.subjects.find((s) => s.id === a.subjectId);
      const notif = makeNotif(enrolledStudentIds(p, a.subjectId), 'assessment', `New assessment: ${a.title}`, `${subject?.name || ''} · ${a.totalMarks} marks`);
      return { ...p, assessments: [a, ...p.assessments], notifications: [notif, ...p.notifications] };
    });
    return a;
  }, []);

  const submitAssessment = useCallback((assessmentId, studentId, marks) => {
    setDb((p) => {
      const rest = p.submissions.filter((s) => !(s.assessmentId === assessmentId && s.studentId === studentId));
      const a = p.assessments.find((x) => x.id === assessmentId);
      const subject = p.subjects.find((s) => s.id === a?.subjectId);
      const student = p.users.find((u) => u.id === studentId);
      const notes = [];
      if (subject?.teacherId) {
        notes.push(makeNotif([subject.teacherId], 'submission', `${student?.name?.split(' ')[0] || 'A student'} submitted ${a?.title}`, `scored ${marks} / ${a?.totalMarks}`));
      }
      return { ...p, submissions: [...rest, { assessmentId, studentId, marks, status: 'graded' }], notifications: [...notes, ...p.notifications] };
    });
  }, []);

  const saveAttendance = useCallback((subjectId, date, records) => {
    setDb((p) => {
      const existing = p.attendance.find((a) => a.subjectId === subjectId && a.date === date);
      if (existing) {
        return {
          ...p,
          attendance: p.attendance.map((a) => (a.id === existing.id ? { ...a, records } : a)),
        };
      }
      return { ...p, attendance: [...p.attendance, { id: nextId('at'), subjectId, date, records }] };
    });
  }, []);

  const addNote = useCallback((subjectId, teacherId, { title, fileName, fileSize }) => {
    const note = {
      id: nextId('n'),
      subjectId,
      title,
      fileName,
      fileSize,
      addedBy: teacherId,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    setDb((p) => {
      const subject = p.subjects.find((s) => s.id === subjectId);
      const notif = makeNotif(enrolledStudentIds(p, subjectId), 'note', `New notes in ${subject?.name || 'your subject'}`, title);
      return { ...p, notes: [note, ...p.notes], notifications: [notif, ...p.notifications] };
    });
    return note;
  }, []);

  const removeNote = useCallback((noteId) => {
    setDb((p) => ({ ...p, notes: p.notes.filter((n) => n.id !== noteId) }));
  }, []);

  const recordPayment = useCallback((studentId, amount, method) => {
    setDb((p) => {
      const notif = makeNotif([studentId], 'fee', 'Payment recorded', `${method} · received`);
      return {
        ...p,
        fees: p.fees.map((f) =>
          f.studentId === studentId
            ? { ...f, paid: Math.min(f.total, f.paid + amount), payments: [...f.payments, { date: new Date().toISOString().slice(0, 10), amount, method }] }
            : f,
        ),
        notifications: [notif, ...p.notifications],
      };
    });
  }, []);

  const markNotifRead = useCallback((id, userId) => {
    setDb((p) => ({
      ...p,
      notifications: p.notifications.map((n) => (n.id === id && !n.readBy.includes(userId) ? { ...n, readBy: [...n.readBy, userId] } : n)),
    }));
  }, []);

  const markAllNotifRead = useCallback((userId) => {
    setDb((p) => ({
      ...p,
      notifications: p.notifications.map((n) => (n.userIds.includes(userId) && !n.readBy.includes(userId) ? { ...n, readBy: [...n.readBy, userId] } : n)),
    }));
  }, []);

  const value = useMemo(
    () => ({ db, ...selectors, createAssessment, submitAssessment, saveAttendance, recordPayment, addNote, removeNote, markNotifRead, markAllNotifRead }),
    [db, selectors, createAssessment, submitAssessment, saveAttendance, recordPayment, addNote, removeNote, markNotifRead, markAllNotifRead],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
