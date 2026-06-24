import { useState } from 'react';
import { Megaphone, Plus, Send } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { Panel } from '@/components/dash/Panel';
import { Badge } from '@/components/ui/Card';
import { Modal, Button, Input, Textarea, Select, useToast } from '@/components/ui';
import { formatDateTime } from '@/utils/format';

// Who each role may announce to. Students aren't listed -> view only.
const AUDIENCES = {
  Director: [['All', 'Everyone'], ['Student', 'Students'], ['Teacher', 'Teachers'], ['Counsellor', 'Counsellors']],
  Counsellor: [['Student', 'Students'], ['Teacher', 'Teachers'], ['StudentsAndTeachers', 'Students & Teachers']],
  Teacher: [['MyStudents', 'My students']],
};

function Composer({ user, options, onClose, onSend }) {
  const [form, setForm] = useState({ audience: options[0][0], title: '', message: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <Modal
      open
      onClose={onClose}
      title="New announcement"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSend(form)}><Send size={15} /> Send</Button></>}
    >
      <div className="space-y-4">
        <Select label="Send to" value={form.audience} onChange={set('audience')}>
          {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Input label="Title" value={form.title} onChange={set('title')} placeholder="e.g. Class rescheduled" />
        <Textarea label="Message" value={form.message} onChange={set('message')} placeholder="Write your announcement…" />
      </div>
    </Modal>
  );
}

export function AnnouncementsPanel({ limit = 5 }) {
  const { user } = useAuth();
  const toast = useToast();
  const { announcementsFor, broadcast } = useData();
  const [composing, setComposing] = useState(false);

  const options = AUDIENCES[user.role];
  const canCompose = !!options;
  const items = announcementsFor(user).slice(0, limit);

  const send = ({ audience, title, message }) => {
    if (!title.trim() || !message.trim()) return toast.error('Add a title and message');
    const label = options.find(([v]) => v === audience)?.[1] || audience;
    broadcast({ audience, audienceLabel: label, title, message, from: { id: user.id, name: user.fullName, role: user.role } });
    setComposing(false);
    toast.success('Announcement sent');
  };

  return (
    <Panel
      title="Announcements"
      action={canCompose && <Button size="sm" onClick={() => setComposing(true)}><Plus size={15} /> New</Button>}
      bodyClassName="p-0"
    >
      {items.length ? (
        <ul className="divide-y divide-line/60">
          {items.map((a) => (
            <li key={a.id} className="flex gap-3 px-5 py-4">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-plum/[0.07] text-plum">
                <Megaphone size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{a.title}</p>
                  {a.audienceLabel && <Badge tone="teal">{a.audienceLabel}</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-slate/70">{a.message}</p>
                <p className="mt-1 text-xs text-slate/45">{a.from} · {a.fromRole} · {formatDateTime(a.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-slate/55">No announcements yet.</p>
      )}

      {composing && <Composer user={user} options={options} onClose={() => setComposing(false)} onSend={send} />}
    </Panel>
  );
}
