import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, User, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { Badge } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/States';
import { useToast } from '@/components/ui';
import { formatDate, formatBytes } from '@/utils/format';

export default function StudentSubjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const { subjectById, userById, notesForSubject, studentSubjects, studentAttendance } = useData();

  const subject = subjectById(id);
  const enrolled = studentSubjects(user.id).some((s) => s.id === id);
  if (!subject || !enrolled) {
    return (
      <div className="pt-2">
        <Link to="/student/subjects" className="inline-flex items-center gap-1.5 text-sm text-slate/70 hover:text-plum">
          <ArrowLeft size={16} /> Back
        </Link>
        <EmptyState title="Subject unavailable" message="You're not enrolled in this subject." />
      </div>
    );
  }

  const teacher = userById(subject.teacherId);
  const notes = notesForSubject(id);

  return (
    <div className="space-y-5 pt-2">
      <Link to="/student/subjects" className="inline-flex items-center gap-1.5 text-sm text-slate/70 hover:text-plum">
        <ArrowLeft size={16} /> Back to subjects
      </Link>
      <PageHeader title={subject.name} subtitle={`${subject.code} · ${subject.credits} credits`} />

      <div className="flex flex-wrap items-center gap-4">
        <Badge tone="plum">{subject.code}</Badge>
        <span className="inline-flex items-center gap-1.5 text-sm text-slate/75"><User size={15} /> {teacher?.name}</span>
        <span className="inline-flex items-center gap-1.5 text-sm text-slate/75"><CalendarCheck size={15} /> {studentAttendance(user.id).percent}% attendance</span>
      </div>

      <Panel title="Notes & resources" subtitle={`Shared by ${teacher?.name}`} bodyClassName="p-0">
        {notes.length ? (
          <ul className="divide-y divide-line/60">
            {notes.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-plum/[0.07] text-plum"><FileText size={18} /></span>
                  <div>
                    <p className="text-sm font-medium text-ink">{n.title}</p>
                    <p className="text-xs text-slate/70">{n.fileName} · {formatBytes(n.fileSize)} · {formatDate(n.uploadedAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.success(`Downloading ${n.fileName}…`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-slate transition-colors hover:border-plum hover:text-plum"
                >
                  <Download size={15} /> Download
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-5">
            <EmptyState title="No notes yet" message="Your teacher hasn't shared any notes for this subject." />
          </div>
        )}
      </Panel>
    </div>
  );
}
