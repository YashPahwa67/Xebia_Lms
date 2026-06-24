import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { AttendanceCalendar } from '@/components/dash/AttendanceCalendar';
import { Badge } from '@/components/ui/Card';
import { ATTENDANCE_STATUS } from '@/constants';
import { formatDate } from '@/utils/format';

function Ring({ percent }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto" role="img" aria-label={`Overall attendance ${percent} percent`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="#DADCEA" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none" stroke="#01AC9F" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (c * percent) / 100} transform="rotate(-90 70 70)"
      />
      <text x="70" y="76" textAnchor="middle" className="fill-ink font-display text-2xl font-bold">{percent}%</text>
    </svg>
  );
}

export default function StudentAttendance() {
  const { user } = useAuth();
  const { studentSubjects, attendanceForSubject, studentAttendance, db } = useData();
  const subjects = studentSubjects(user.id);
  const overall = studentAttendance(user.id);

  // per-date status across all subjects for the heatmap
  const heatmap = {};
  db.attendance.forEach((sess) => {
    if (user.id in sess.records) {
      const status = sess.records[user.id];
      if (status === ATTENDANCE_STATUS.ABSENT || !heatmap[sess.date]) heatmap[sess.date] = status;
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Attendance" subtitle="Your attendance across subjects" />

      <Panel title="Activity" subtitle="Daily attendance by month">
        <AttendanceCalendar records={heatmap} />
      </Panel>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Overall">
          <Ring percent={overall.percent} />
          <p className="mt-3 text-center text-sm text-slate/70">{overall.present} of {overall.total} sessions attended</p>
        </Panel>

        <Panel title="By subject" className="lg:col-span-2" bodyClassName="p-0">
          <ul className="divide-y divide-line/60">
            {subjects.map((s) => {
              const sessions = attendanceForSubject(s.id).filter((a) => user.id in a.records);
              const present = sessions.filter((a) => a.records[user.id] !== ATTENDANCE_STATUS.ABSENT).length;
              const pct = sessions.length ? Math.round((present / sessions.length) * 100) : 0;
              return (
                <li key={s.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{s.name}</p>
                      <p className="text-xs text-slate/70">{s.code}</p>
                    </div>
                    <Badge tone={pct >= 75 ? 'teal' : 'orange'}>{pct}%</Badge>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist/60">
                    <div className="h-full rounded-full bg-plum" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate/60">
                    {sessions.length} sessions · last {sessions.length ? formatDate(sessions[sessions.length - 1].date) : '—'}
                  </p>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
