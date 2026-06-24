import { CalendarCheck, Users, AlertCircle } from 'lucide-react';
import { useData } from '@/features/data/DataContext';
import { useSimulatedLoad } from '@/hooks/useSimulatedLoad';
import { GradientStat } from '@/components/dash/GradientStat';
import { Panel } from '@/components/dash/Panel';
import { SortableTable } from '@/components/dash/SortableTable';
import { StatSkeleton, ListSkeleton } from '@/components/dash/Skeleton';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Card';
import { initials } from '@/utils/format';

export default function DirectorAttendance() {
  const loading = useSimulatedLoad();
  const { students, studentAttendance, db, subjectById } = useData();

  const rows = students().map((s) => ({ ...s, att: studentAttendance(s.id) }));
  const avg = rows.length ? Math.round(rows.reduce((n, r) => n + r.att.percent, 0) / rows.length) : 0;
  const lowAttendance = rows.filter((r) => r.att.percent < 75).length;

  // per-subject session count
  const sessions = db.attendance.length;

  const columns = [
    {
      key: 'name', header: 'Student',
      render: (r) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-plum/10 text-xs font-semibold text-plum">{initials(r.name)}</span>
          <div><p className="font-medium text-ink">{r.name}</p><p className="text-xs text-slate/60">{r.roll}</p></div>
        </div>
      ),
    },
    { key: 'batch', header: 'Batch' },
    { key: 'present', header: 'Attended', align: 'right', sortValue: (r) => r.att.present, render: (r) => `${r.att.present}/${r.att.total}` },
    { key: 'percent', header: 'Attendance', align: 'right', sortValue: (r) => r.att.percent, render: (r) => <Badge tone={r.att.percent >= 75 ? 'teal' : 'orange'}>{r.att.percent}%</Badge> },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Attendance" subtitle="Institution-wide attendance overview" />

      {loading ? <StatSkeleton /> : (
        <div className="grid gap-4 sm:grid-cols-3">
          <GradientStat label="Avg attendance" count={avg} suffix="%" icon={CalendarCheck} tone="velvet" />
          <GradientStat label="Sessions held" count={sessions} icon={Users} tone="emerald" delay={0.05} />
          <GradientStat label="Below 75%" count={lowAttendance} hint="students at risk" icon={AlertCircle} tone="plum" delay={0.1} />
        </div>
      )}

      {loading ? <ListSkeleton rows={5} /> : (
        <Panel title="By student" bodyClassName="p-0">
          <SortableTable columns={columns} rows={rows} emptyMessage="No attendance records" />
        </Panel>
      )}
    </div>
  );
}
