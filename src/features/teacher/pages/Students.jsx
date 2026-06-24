import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { useSimulatedLoad } from '@/hooks/useSimulatedLoad';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { SortableTable } from '@/components/dash/SortableTable';
import { ListSkeleton } from '@/components/dash/Skeleton';
import { Badge } from '@/components/ui/Card';
import { initials } from '@/utils/format';

export default function TeacherStudents() {
  const { user } = useAuth();
  const loading = useSimulatedLoad();
  const { teacherSubjects, studentsInSubject, studentAttendance } = useData();

  const map = new Map();
  teacherSubjects(user.id).forEach((s) => studentsInSubject(s.id).forEach((st) => {
    if (!map.has(st.id)) map.set(st.id, { ...st, subjects: [] });
    map.get(st.id).subjects.push(s.code);
  }));
  const rows = [...map.values()];

  const columns = [
    {
      key: 'name', header: 'Student',
      render: (s) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-plum/10 text-xs font-semibold text-plum">{initials(s.name)}</span>
          <span className="font-medium text-ink">{s.name}</span>
        </div>
      ),
    },
    { key: 'roll', header: 'Roll' },
    { key: 'subjects', header: 'Subjects', sortable: false, render: (s) => <div className="flex flex-wrap gap-1">{s.subjects.map((c) => <Badge key={c} tone="plum">{c}</Badge>)}</div> },
    { key: 'attendance', header: 'Attendance', align: 'right', sortValue: (s) => studentAttendance(s.id).percent, render: (s) => <Badge tone={studentAttendance(s.id).percent >= 75 ? 'teal' : 'orange'}>{studentAttendance(s.id).percent}%</Badge> },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Students" subtitle="Learners enrolled in your subjects" />
      {loading ? <ListSkeleton rows={5} /> : (
        <Panel bodyClassName="p-0">
          <SortableTable columns={columns} rows={rows} emptyMessage="No students enrolled" />
        </Panel>
      )}
    </div>
  );
}
