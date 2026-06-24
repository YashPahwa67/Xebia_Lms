import { useState } from 'react';
import { Search } from 'lucide-react';
import { useData } from '@/features/data/DataContext';
import { useSimulatedLoad } from '@/hooks/useSimulatedLoad';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { SortableTable } from '@/components/dash/SortableTable';
import { ListSkeleton } from '@/components/dash/Skeleton';
import { Badge } from '@/components/ui/Card';
import { Input } from '@/components/ui';
import { initials, inr } from '@/utils/format';

export default function CounsellorStudents() {
  const { students, studentAttendance, feeFor } = useData();
  const loading = useSimulatedLoad();
  const [q, setQ] = useState('');
  const list = students().filter((s) => `${s.name} ${s.roll} ${s.batch}`.toLowerCase().includes(q.toLowerCase()));

  const columns = [
    {
      key: 'name', header: 'Student',
      render: (s) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-plum/10 text-xs font-semibold text-plum">{initials(s.name)}</span>
          <div><p className="font-medium text-ink">{s.name}</p><p className="text-xs text-slate/60">{s.roll}</p></div>
        </div>
      ),
    },
    { key: 'batch', header: 'Batch' },
    { key: 'attendance', header: 'Attendance', sortValue: (s) => studentAttendance(s.id).percent, render: (s) => <Badge tone={studentAttendance(s.id).percent >= 75 ? 'teal' : 'orange'}>{studentAttendance(s.id).percent}%</Badge> },
    {
      key: 'fees', header: 'Fees', sortValue: (s) => { const f = feeFor(s.id); return f ? f.total - f.paid : 0; },
      render: (s) => { const f = feeFor(s.id); const due = f ? f.total - f.paid : 0; return due ? <span className="text-cta">{inr(due)} due</span> : <Badge tone="teal">Clear</Badge>; },
    },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Students" subtitle="All enrolled students" />
      <div className="max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate/45" />
          <Input className="pl-9" placeholder="Search students…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search students" />
        </div>
      </div>
      {loading ? <ListSkeleton rows={5} /> : (
        <Panel bodyClassName="p-0">
          <SortableTable columns={columns} rows={list} emptyMessage="No students found" />
        </Panel>
      )}
    </div>
  );
}
