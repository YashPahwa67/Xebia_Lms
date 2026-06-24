import { useState, useMemo, useId } from 'react';
import { motion } from 'framer-motion';
import { Check, X, CheckCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { AttendanceHeatmap } from '@/components/dash/AttendanceHeatmap';
import { Select, Input, Button, useToast } from '@/components/ui';
import { ATTENDANCE_STATUS } from '@/constants';

const today = new Date().toISOString().slice(0, 10);

// Two-state segmented control with a sliding indicator.
function Toggle({ present, onSet }) {
  const id = useId();
  return (
    <div className="relative flex rounded-xl bg-paper p-0.5">
      {[
        { key: ATTENDANCE_STATUS.PRESENT, label: 'Present', on: present, Icon: Check, tone: 'bg-teal' },
        { key: ATTENDANCE_STATUS.ABSENT, label: 'Absent', on: !present, Icon: X, tone: 'bg-cta' },
      ].map(({ key, label, on, Icon, tone }) => (
        <button key={key} onClick={() => onSet(key)} className="relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold">
          {on && <motion.span layoutId={`att-ind-${id}`} className={`absolute inset-0 -z-10 rounded-lg ${tone}`} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
          <Icon size={13} className={on ? 'text-white' : 'text-slate/60'} />
          <span className={on ? 'text-white' : 'text-slate/60'}>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function TeacherAttendance() {
  const { user } = useAuth();
  const toast = useToast();
  const { teacherSubjects, studentsInSubject, attendanceForSubject, saveAttendance } = useData();
  const subjects = teacherSubjects(user.id);

  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [date, setDate] = useState(today);
  const [marks, setMarks] = useState({});
  const students = studentsInSubject(subjectId);

  const existing = useMemo(() => attendanceForSubject(subjectId).find((a) => a.date === date), [attendanceForSubject, subjectId, date]);
  const current = (id) => marks[id] ?? existing?.records?.[id] ?? ATTENDANCE_STATUS.PRESENT;
  const setStatus = (id, status) => setMarks((m) => ({ ...m, [id]: status }));
  const markAllPresent = () => setMarks(Object.fromEntries(students.map((s) => [s.id, ATTENDANCE_STATUS.PRESENT])));

  const presentCount = students.filter((s) => current(s.id) !== ATTENDANCE_STATUS.ABSENT).length;
  const pct = students.length ? Math.round((presentCount / students.length) * 100) : 0;

  const save = () => {
    const records = {};
    students.forEach((s) => { records[s.id] = current(s.id); });
    saveAttendance(subjectId, date, records);
    toast.success('Attendance saved');
  };

  // recent sessions heatmap for the selected subject (class-level present rate)
  const heatmap = {};
  attendanceForSubject(subjectId).forEach((sess) => {
    const ids = Object.keys(sess.records);
    const present = ids.filter((k) => sess.records[k] !== ATTENDANCE_STATUS.ABSENT).length;
    heatmap[sess.date] = ids.length && present / ids.length >= 0.75 ? 'present' : 'absent';
  });

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Mark Attendance" subtitle="Record attendance per subject and date" />

      <Panel
        title="Session"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={markAllPresent}><CheckCheck size={16} /> All present</Button>
            <Button onClick={save}>Save</Button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Subject" value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setMarks({}); }}>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Input label="Date" type="date" value={date} onChange={(e) => { setDate(e.target.value); setMarks({}); }} />
          <div className="flex items-end">
            <div className="w-full">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate/70">Present</span>
                <motion.span key={presentCount} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="font-semibold text-teal-soft">{presentCount}/{students.length} · {pct}%</motion.span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-mist/60">
                <motion.div className="h-full rounded-full bg-teal" animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} />
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel bodyClassName="p-0" title="Students">
        <ul className="divide-y divide-line/60">
          {students.map((s) => (
            <li key={s.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-ink">{s.name}</p>
                <p className="text-xs text-slate/70">{s.roll}</p>
              </div>
              <Toggle present={current(s.id) !== ATTENDANCE_STATUS.ABSENT} onSet={(status) => setStatus(s.id, status)} />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Recent sessions" subtitle="Class attendance for this subject">
        <AttendanceHeatmap records={heatmap} weeks={6} />
      </Panel>
    </div>
  );
}
