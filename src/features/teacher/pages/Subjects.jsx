import { Link } from 'react-router-dom';
import { BookOpen, Users, FileText } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Card';

export default function TeacherSubjects() {
  const { user } = useAuth();
  const { teacherSubjects, studentsInSubject, notesForSubject } = useData();
  const subjects = teacherSubjects(user.id);

  return (
    <div>
      <PageHeader title="My Subjects" subtitle="Open a subject to manage notes & resources" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <Link
            key={s.id}
            to={`/teacher/subjects/${s.id}`}
            className="block rounded-3xl border border-line/70 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-plum/40 hover:shadow-glow"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-plum/[0.07] text-plum"><BookOpen size={20} /></span>
              <Badge tone="plum">{s.code}</Badge>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.name}</h3>
            <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-sm text-slate/75">
              <span className="flex items-center gap-1.5"><Users size={14} /> {studentsInSubject(s.id).length}</span>
              <span className="flex items-center gap-1.5"><FileText size={14} /> {notesForSubject(s.id).length} notes</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
