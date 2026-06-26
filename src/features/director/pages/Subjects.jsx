import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { SortableTable } from '@/components/dash/SortableTable';
import { Badge } from '@/components/ui/Card';
import { Modal, Button, Input, Select, useToast } from '@/components/ui';

function AddCourseModal({ teachers, onClose, onCreate }) {
  const [f, setF] = useState({ name: '', code: '', teacherId: teachers[0]?.id || '' });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  return (
    <Modal
      open
      onClose={onClose}
      title="Add course"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onCreate(f)}>Create course</Button></>}
    >
      <div className="space-y-4">
        <Input label="Course name" value={f.name} onChange={set('name')} placeholder="e.g. Machine Learning" />
        <Input label="Code" value={f.code} onChange={set('code')} placeholder="CS205" />
        <Select label="Assign teacher" value={f.teacherId} onChange={set('teacherId')}>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </Select>
      </div>
    </Modal>
  );
}

export default function DirectorSubjects() {
  const { db, userById, studentsInSubject, teachers, addSubject } = useData();
  const toast = useToast();
  const [show, setShow] = useState(false);

  const columns = [
    { key: 'code', header: 'Code', render: (s) => <Badge tone="plum">{s.code}</Badge> },
    { key: 'name', header: 'Course', render: (s) => <span className="font-medium text-ink">{s.name}</span> },
    { key: 'teacher', header: 'Faculty', sortValue: (s) => userById(s.teacherId)?.name, render: (s) => userById(s.teacherId)?.name },
    { key: 'enrolled', header: 'Enrolled', align: 'right', sortValue: (s) => studentsInSubject(s.id).length, render: (s) => studentsInSubject(s.id).length },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader
        title="Courses"
        subtitle="All courses offered by Xebia"
        actions={<Button onClick={() => setShow(true)}><Plus size={16} /> Add course</Button>}
      />
      <Panel bodyClassName="p-0">
        <SortableTable columns={columns} rows={db.subjects} emptyMessage="No courses yet" />
      </Panel>

      {show && (
        <AddCourseModal
          teachers={teachers()}
          onClose={() => setShow(false)}
          onCreate={(data) => {
            if (!data.name.trim() || !data.code.trim()) return toast.error('Add a name and code');
            addSubject(data);
            setShow(false);
            toast.success('Course added');
          }}
        />
      )}
    </div>
  );
}
