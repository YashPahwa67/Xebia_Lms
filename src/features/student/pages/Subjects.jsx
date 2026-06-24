import { Link } from 'react-router-dom';
import { BookOpen, User, FileText, Plus } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { EmptyState } from '@/components/ui/States';
import { Badge } from '@/components/ui/Card';
import { Button, useToast } from '@/components/ui';
import { inr } from '@/utils/format';

export default function StudentSubjects() {
  const { user } = useAuth();
  const toast = useToast();
  const { studentSubjects, availableSubjects, userById, notesForSubject, enrollInCourse } = useData();
  const enrolled = studentSubjects(user.id);
  const available = availableSubjects(user.id);

  const enroll = (s) => {
    enrollInCourse(user.id, s.id);
    toast.success(`Enrolled in ${s.name} — ${inr(s.price)} added to your fees`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Courses" subtitle="Your enrolled courses and the catalog" />

      {/* Enrolled */}
      {!enrolled.length ? (
        <EmptyState title="No courses yet" message="Enrol from the catalog below to get started." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrolled.map((s) => {
            const teacher = userById(s.teacherId);
            return (
              <Link
                key={s.id}
                to={`/student/subjects/${s.id}`}
                className="block rounded-3xl border border-line/70 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-plum/40 hover:shadow-glow"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-plum/[0.07] text-plum"><BookOpen size={20} /></span>
                  <Badge tone="plum">{s.code}</Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate/75"><User size={14} /> {teacher?.name}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-sm text-slate/70">
                  <span className="flex items-center gap-1.5"><FileText size={14} /> {notesForSubject(s.id).length} notes</span>
                  <Badge tone="teal">Enrolled</Badge>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Catalog */}
      <Panel title="Course catalog" subtitle="Browse and enrol in more courses">
        {!available.length ? (
          <p className="py-6 text-center text-sm text-slate/60">You're enrolled in every available course. 🎓</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((s) => {
              const teacher = userById(s.teacherId);
              return (
                <div key={s.id} className="flex flex-col rounded-2xl border border-line/70 p-5">
                  <div className="flex items-start justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-magenta/[0.08] text-magenta"><BookOpen size={20} /></span>
                    <Badge tone="magenta">{s.code}</Badge>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate/75"><User size={14} /> {teacher?.name}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
                    <span className="font-display text-lg font-bold text-ink">{inr(s.price)}</span>
                    <Button size="sm" onClick={() => enroll(s)}><Plus size={15} /> Enrol</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
