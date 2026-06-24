import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { Badge } from '@/components/ui/Card';
import { Button, useToast } from '@/components/ui';
import { formatDate } from '@/utils/format';
import { TakeAssessmentModal } from '../TakeAssessmentModal';

export default function StudentAssessments() {
  const { user } = useAuth();
  const toast = useToast();
  const { studentSubjects, assessmentsForSubjects, submission, submitAssessment, subjectById } = useData();
  const [taking, setTaking] = useState(null);

  const subjectIds = studentSubjects(user.id).map((s) => s.id);
  const assessments = assessmentsForSubjects(subjectIds).sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div>
      <PageHeader title="Assessments" subtitle="Take assessments and review your results" />
      <Panel bodyClassName="p-0">
        <ul className="divide-y divide-line/60">
          {assessments.map((a) => {
            const sub = submission(a.id, user.id);
            const pct = sub ? Math.round((sub.marks / a.totalMarks) * 100) : null;
            return (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-plum/[0.07] text-plum">
                    <ClipboardList size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-slate/70">{subjectById(a.subjectId)?.name} · {a.totalMarks} marks · due {formatDate(a.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="plum">{a.type}</Badge>
                  {sub ? (
                    <span className="text-sm font-semibold text-teal-soft">{sub.marks}/{a.totalMarks} · {pct}%</span>
                  ) : (
                    <Button size="sm" className="bg-plum text-white hover:bg-plum-dark" onClick={() => setTaking(a)}>
                      Take
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      {taking && (
        <TakeAssessmentModal
          assessment={taking}
          onClose={() => setTaking(null)}
          onSubmit={(marks) => {
            submitAssessment(taking.id, user.id, marks);
            toast.success(`Submitted — you scored ${marks}/${taking.totalMarks}`);
          }}
        />
      )}
    </div>
  );
}
