import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Trash2, Users, UploadCloud } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { Badge } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/States';
import { Modal, Button, Input, useToast } from '@/components/ui';
import { formatDate, formatBytes } from '@/utils/format';

function UploadModal({ onClose, onUpload }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  return (
    <Modal
      open onClose={onClose} title="Upload notes"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button className="bg-plum text-white hover:bg-plum-dark" disabled={!title || !file} onClick={() => onUpload(title, file)}>Upload</Button></>}
    >
      <div className="space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Lecture 3 — Trees" />
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line px-6 py-8 text-center hover:border-plum/50">
          <UploadCloud className="h-8 w-8 text-slate/45" />
          <span className="text-sm text-slate">{file ? file.name : 'Choose a file (PDF, PPT, DOC…)'}</span>
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>
    </Modal>
  );
}

export default function TeacherSubjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const { subjectById, studentsInSubject, notesForSubject, addNote, removeNote } = useData();
  const [show, setShow] = useState(false);

  const subject = subjectById(id);
  if (!subject) return <PageHeader title="Subject not found" />;
  const owned = subject.teacherId === user.id;
  const notes = notesForSubject(id);
  const students = studentsInSubject(id);

  return (
    <div className="space-y-5 pt-2">
      <Link to="/teacher/subjects" className="inline-flex items-center gap-1.5 text-sm text-slate/70 hover:text-plum">
        <ArrowLeft size={16} /> Back to subjects
      </Link>
      <PageHeader
        title={subject.name}
        subtitle={`${subject.code}`}
        actions={owned && <Button className="bg-plum text-white hover:bg-plum-dark" onClick={() => setShow(true)}><Plus size={16} /> Upload notes</Button>}
      />

      <div className="flex flex-wrap gap-3">
        <Badge tone="plum">{subject.code}</Badge>
        <span className="inline-flex items-center gap-1.5 text-sm text-slate/75"><Users size={15} /> {students.length} students enrolled</span>
      </div>

      <Panel title="Notes & resources" subtitle="Visible to students enrolled in this subject" bodyClassName="p-0">
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
                {owned && (
                  <button onClick={() => { removeNote(n.id); toast.success('Note removed'); }} className="grid h-9 w-9 place-items-center rounded-lg text-slate/60 hover:bg-cta/10 hover:text-cta" aria-label="Delete note">
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-5">
            <EmptyState title="No notes yet" message={owned ? 'Upload your first set of notes for this subject.' : 'Notes will appear here once added.'} />
          </div>
        )}
      </Panel>

      {show && (
        <UploadModal
          onClose={() => setShow(false)}
          onUpload={(title, file) => {
            addNote(id, user.id, { title, fileName: file.name, fileSize: file.size });
            setShow(false);
            toast.success('Notes uploaded — students can now see them');
          }}
        />
      )}
    </div>
  );
}
