import { useState } from 'react';
import { Megaphone, Send, Users } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { Badge } from '@/components/ui/Card';
import { Input, Textarea, Select, Button, useToast } from '@/components/ui';
import { ROLES } from '@/constants';
import { formatDateTime } from '@/utils/format';

const AUDIENCES = ['All', ROLES.STUDENT, ROLES.TEACHER, ROLES.COUNSELLOR];
const EMPTY = { audience: 'All', title: '', message: '' };

export default function DirectorAnnouncements() {
  const { user } = useAuth();
  const toast = useToast();
  const { announcements, broadcast } = useData();
  const [form, setForm] = useState(EMPTY);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const send = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return toast.error('Add a title and message');
    broadcast({ ...form, from: user.fullName });
    setForm(EMPTY);
    toast.success(`Announcement sent to ${form.audience === 'All' ? 'everyone' : `${form.audience}s`}`);
  };

  const list = announcements();

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Announcements" subtitle="Broadcast to the institution" />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="New announcement">
          <form onSubmit={send} className="space-y-4">
            <Select label="Audience" value={form.audience} onChange={set('audience')}>
              {AUDIENCES.map((a) => <option key={a} value={a}>{a === 'All' ? 'Everyone' : `${a}s`}</option>)}
            </Select>
            <Input label="Title" value={form.title} onChange={set('title')} placeholder="e.g. Exam timetable released" />
            <Textarea label="Message" value={form.message} onChange={set('message')} placeholder="Write your announcement…" />
            <Button type="submit"><Send size={16} /> Send announcement</Button>
          </form>
        </Panel>

        <Panel title="Sent" bodyClassName="p-0">
          <ul className="divide-y divide-line/60">
            {list.map((a) => (
              <li key={a.id} className="flex gap-3 px-5 py-4">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-plum/[0.07] text-plum">
                  <Megaphone size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{a.title}</p>
                    <Badge tone={a.audience === 'All' ? 'plum' : 'teal'}>{a.audience === 'All' ? 'Everyone' : a.audience}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-slate/70">{a.message}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate/45">
                    <Users size={12} /> {a.from} · {formatDateTime(a.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
