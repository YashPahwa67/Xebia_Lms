import { useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { Badge } from '@/components/ui/Card';
import { Modal, Button, Input, Select, useToast } from '@/components/ui';
import { formatDate } from '@/utils/format';

function CreateModal({ subjects, onClose, onCreate }) {
  const [f, setF] = useState({ title: '', subjectId: subjects[0]?.id || '', type: 'Quiz', totalMarks: 20, dueDate: '' });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  return (
    <Modal
      open onClose={onClose} title="Create assessment"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button className="bg-plum text-white hover:bg-plum-dark" onClick={() => onCreate({ ...f, totalMarks: Number(f.totalMarks) })}>Create</Button></>}
    >
      <div className="space-y-4">
        <Input label="Title" value={f.title} onChange={set('title')} required />
        <Select label="Subject" value={f.subjectId} onChange={set('subjectId')}>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <div className="grid grid-cols-3 gap-3">
          <Select label="Type" value={f.type} onChange={set('type')}>
            <option>Quiz</option><option>Test</option><option>Assignment</option>
          </Select>
          <Input label="Marks" type="number" min="1" value={f.totalMarks} onChange={set('totalMarks')} />
          <Input label="Due date" type="date" value={f.dueDate} onChange={set('dueDate')} />
        </div>
      </div>
    </Modal>
  );
}

export default function TeacherAssessments() {
  const { user } = useAuth();
  const toast = useToast();
  const { teacherSubjects, assessmentsForSubjects, createAssessment, subjectById, db, studentsInSubject } = useData();
  const [show, setShow] = useState(false);

  const subjects = teacherSubjects(user.id);
  const assessments = assessmentsForSubjects(subjects.map((s) => s.id)).sort((a, b) => b.dueDate.localeCompare(a.dueDate));

  const stats = (a) => {
    const subs = db.submissions.filter((x) => x.assessmentId === a.id);
    const enrolled = studentsInSubject(a.subjectId).length;
    const avg = subs.length ? Math.round(subs.reduce((s, x) => s + (x.marks / a.totalMarks) * 100, 0) / subs.length) : 0;
    return { submitted: subs.length, enrolled, avg };
  };

  return (
    <div>
      <PageHeader
        title="Assessments" subtitle="Create assessments and review submissions"
        actions={<Button className="bg-plum text-white hover:bg-plum-dark" onClick={() => setShow(true)}><Plus size={16} /> New assessment</Button>}
      />
      <Panel bodyClassName="p-0">
        <ul className="divide-y divide-line/60">
          {assessments.map((a) => {
            const s = stats(a);
            return (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-plum/[0.07] text-plum"><ClipboardList size={18} /></span>
                  <div>
                    <p className="text-sm font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-slate/70">{subjectById(a.subjectId)?.name} · {a.totalMarks} marks · due {formatDate(a.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate/70">{s.submitted}/{s.enrolled} submitted</span>
                  <Badge tone="teal">avg {s.avg}%</Badge>
                  <Badge tone="plum">{a.type}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      {show && (
        <CreateModal
          subjects={subjects}
          onClose={() => setShow(false)}
          onCreate={(data) => {
            if (!data.title) return toast.error('Title is required');
            createAssessment(data);
            setShow(false);
            toast.success('Assessment created');
          }}
        />
      )}
    </div>
  );
}
