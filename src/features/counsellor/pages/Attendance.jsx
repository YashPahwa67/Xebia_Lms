import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { Badge } from '@/components/ui/Card';
import { initials } from '@/utils/format';

export default function CounsellorAttendance() {
  const { students, studentAttendance } = useData();
  const list = students()
    .map((s) => ({ ...s, att: studentAttendance(s.id) }))
    .sort((a, b) => a.att.percent - b.att.percent);

  return (
    <div>
      <PageHeader title="Attendance overview" subtitle="Institution-wide attendance, lowest first" />
      <Panel bodyClassName="p-0">
        <ul className="divide-y divide-line/60">
          {list.map((s) => (
            <li key={s.id} className="flex items-center gap-4 px-5 py-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-plum/10 text-xs font-semibold text-plum">{initials(s.name)}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">{s.name} <span className="text-xs text-slate/60">· {s.batch}</span></p>
                  <Badge tone={s.att.percent >= 75 ? 'teal' : 'orange'}>{s.att.percent}%</Badge>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist/60">
                  <div className={`h-full rounded-full ${s.att.percent >= 75 ? 'bg-teal' : 'bg-cta'}`} style={{ width: `${s.att.percent}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
