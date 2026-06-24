import { useState } from 'react';
import { useData } from '@/features/data/DataContext';
import { useSimulatedLoad } from '@/hooks/useSimulatedLoad';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { SortableTable } from '@/components/dash/SortableTable';
import { ListSkeleton } from '@/components/dash/Skeleton';
import { Badge } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';

const TABS = ['All', 'Student', 'Teacher', 'Counsellor', 'Director'];
const TONE = { Student: 'plum', Teacher: 'teal', Counsellor: 'magenta', Director: 'orange' };

export default function DirectorUsers() {
  const { db } = useData();
  const loading = useSimulatedLoad();
  const [tab, setTab] = useState('All');
  const list = db.users.filter((u) => tab === 'All' || u.role === tab);

  const columns = [
    {
      key: 'name', header: 'Name',
      render: (u) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-plum/10 text-xs font-semibold text-plum">{initials(u.name)}</span>
          <span className="font-medium text-ink">{u.name}</span>
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (u) => <Badge tone={TONE[u.role]}>{u.role}</Badge> },
    { key: 'detail', header: 'Detail', sortable: false, render: (u) => u.batch || (u.subjects ? `${u.subjects.length} subjects` : '—') },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Users" subtitle="Everyone in the institution" />
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn('rounded-full px-4 py-1.5 text-sm font-medium transition-colors', tab === t ? 'bg-plum text-white' : 'bg-white text-slate hover:text-plum')}
          >
            {t}
          </button>
        ))}
      </div>
      {loading ? <ListSkeleton rows={6} /> : (
        <Panel bodyClassName="p-0">
          <SortableTable columns={columns} rows={list} emptyMessage="No users in this role" />
        </Panel>
      )}
    </div>
  );
}
