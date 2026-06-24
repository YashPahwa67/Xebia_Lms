import { Link } from 'react-router-dom';
import { BookOpen, User, FileText } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { Badge } from '@/components/ui/Card';

export default function StudentSubjects() {
  const { user } = useAuth();
  const { studentSubjects, userById, studentAttendance, notesForSubject } = useData();
  const subjects = studentSubjects(user.id);

  return (
    <div>
      <PageHeader title="My Subjects" subtitle="Open a subject to view notes shared by your teacher" />
      {!subjects.length ? (
        <EmptyState title="No subjects yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => {
            const teacher = userById(s.teacherId);
            const noteCount = notesForSubject(s.id).length;
            return (
              <Link
                key={s.id}
                to={`/student/subjects/${s.id}`}
                className="block rounded-3xl border border-line/70 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-plum/40 hover:shadow-glow"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-plum/[0.07] text-plum">
                    <BookOpen size={20} />
                  </span>
                  <Badge tone="plum">{s.code}</Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate/75">
                  <User size={14} /> {teacher?.name}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-sm">
                  <span className="flex items-center gap-1.5 text-slate/70"><FileText size={14} /> {noteCount} notes</span>
                  <span className="font-semibold text-teal-soft">{studentAttendance(user.id).percent}%</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
