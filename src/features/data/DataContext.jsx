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
      availableSubjects: (studentId) =>
        db.subjects.filter((s) => !(db.enrollments[studentId] || []).includes(s.id)),
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
      announcements: () => [...db.announcements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      // Director sees every announcement; everyone else sees ones addressed to them.
      announcementsFor: (user) =>
        [...db.announcements]
          .filter((a) => user.role === 'Director' || (a.userIds || []).includes(user.id))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
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

  // Student buys/enrols in a course -> adds it to their courses and bills the price to their fees.
  const enrollInCourse = useCallback((studentId, subjectId) => {
    setDb((p) => {
      const current = p.enrollments[studentId] || [];
      if (current.includes(subjectId)) return p;
      const subject = p.subjects.find((s) => s.id === subjectId);
      const price = subject?.price || 0;
      const enrollments = { ...p.enrollments, [studentId]: [...current, subjectId] };

      const hasFee = p.fees.some((f) => f.studentId === studentId);
      const fees = hasFee
        ? p.fees.map((f) => (f.studentId === studentId ? { ...f, total: f.total + price } : f))
        : [...p.fees, { studentId, total: price, paid: 0, dueDate: '2026-07-15', payments: [] }];

      const counsellorIds = p.users.filter((u) => u.role === 'Counsellor').map((u) => u.id);
      const student = p.users.find((u) => u.id === studentId);
      const notif = makeNotif(counsellorIds, 'fee', `${student?.name?.split(' ')[0] || 'A student'} enrolled in ${subject?.name}`, `₹${price.toLocaleString('en-IN')} added to fees`);

      return { ...p, enrollments, fees, notifications: [notif, ...p.notifications] };
    });
  }, []);

  // Director adds a new course/subject and assigns a teacher.
  const addSubject = useCallback(({ name, code, teacherId, price }) => {
    const subject = { id: nextId('sub'), name, code, teacherId, price: Number(price) || 0 };
    setDb((p) => ({ ...p, subjects: [...p.subjects, subject] }));
    return subject;
  }, []);

  // Post an announcement. `audience` is resolved to recipients here, scoped to
  // who the sender is allowed to reach. `from` = { id, name, role }.
  const broadcast = useCallback(({ audience, audienceLabel, title, message, from }) => {
    setDb((p) => {
      const byRole = (r) => p.users.filter((u) => u.role === r);
      let recipients = [];
      if (audience === 'All') recipients = p.users.filter((u) => u.role !== 'Director');
      else if (audience === 'Student') recipients = byRole('Student');
      else if (audience === 'Teacher') recipients = byRole('Teacher');
      else if (audience === 'Counsellor') recipients = byRole('Counsellor');
      else if (audience === 'StudentsAndTeachers') recipients = [...byRole('Student'), ...byRole('Teacher')];
      else if (audience === 'MyStudents') {
        const myCourses = p.subjects.filter((s) => s.teacherId === from.id).map((s) => s.id);
        recipients = byRole('Student').filter((u) => (p.enrollments[u.id] || []).some((id) => myCourses.includes(id)));
      }
      const userIds = recipients.map((u) => u.id).filter((id) => id !== from.id);

      const ann = { id: nextId('an'), title, message, audienceLabel, from: from.name, fromRole: from.role, userIds, createdAt: new Date().toISOString() };
      const notif = makeNotif(userIds, 'system', title, message);
      return { ...p, announcements: [ann, ...p.announcements], notifications: [notif, ...p.notifications] };
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
    () => ({ db, ...selectors, createAssessment, submitAssessment, saveAttendance, recordPayment, addNote, removeNote, addSubject, enrollInCourse, broadcast, markNotifRead, markAllNotifRead }),
    [db, selectors, createAssessment, submitAssessment, saveAttendance, recordPayment, addNote, removeNote, addSubject, enrollInCourse, broadcast, markNotifRead, markAllNotifRead],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
