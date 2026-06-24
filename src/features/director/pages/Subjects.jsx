import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { SortableTable } from '@/components/dash/SortableTable';
import { Badge } from '@/components/ui/Card';

export default function DirectorSubjects() {
  const { db, userById, studentsInSubject } = useData();

  const columns = [
    { key: 'code', header: 'Code', render: (s) => <Badge tone="plum">{s.code}</Badge> },
    { key: 'name', header: 'Subject', render: (s) => <span className="font-medium text-ink">{s.name}</span> },
    { key: 'teacher', header: 'Faculty', sortValue: (s) => userById(s.teacherId)?.name, render: (s) => userById(s.teacherId)?.name },
    { key: 'credits', header: 'Credits', align: 'right' },
    { key: 'enrolled', header: 'Enrolled', align: 'right', sortValue: (s) => studentsInSubject(s.id).length, render: (s) => studentsInSubject(s.id).length },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Subjects" subtitle="All subjects offered this term" />
      <Panel bodyClassName="p-0">
        <SortableTable columns={columns} rows={db.subjects} emptyMessage="No subjects" />
      </Panel>
    </div>
  );
}
