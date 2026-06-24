import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { BookOpen, Award, CalendarCheck, Wallet, ClipboardList } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { useSimulatedLoad } from '@/hooks/useSimulatedLoad';
import { GradientStat } from '@/components/dash/GradientStat';
import { Panel } from '@/components/dash/Panel';
import { HeroCard } from '@/components/dash/HeroCard';
import { ChartTooltip } from '@/components/dash/ChartTooltip';
import { StatSkeleton, ChartSkeleton, ListSkeleton } from '@/components/dash/Skeleton';
import { Reveal } from '@/components/marketing/Reveal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Card';
import { STATUS } from '@/constants/palette';
import { formatDate, inr } from '@/utils/format';

export default function StudentDashboard() {
  const { user } = useAuth();
  const loading = useSimulatedLoad();
  const { studentSubjects, assessmentsForSubjects, submission, studentAttendance, feeFor, subjectById } = useData();

  const subjects = studentSubjects(user.id);
  const assessments = assessmentsForSubjects(subjects.map((s) => s.id));
  const graded = assessments.map((a) => ({ a, sub: submission(a.id, user.id) })).filter((x) => x.sub);
  const avg = graded.length ? Math.round(graded.reduce((s, x) => s + (x.sub.marks / x.a.totalMarks) * 100, 0) / graded.length) : 0;
  const att = studentAttendance(user.id);
  const fee = feeFor(user.id);
  const due = fee ? fee.total - fee.paid : 0;

  const marksData = graded.map((x) => ({ name: subjectById(x.a.subjectId)?.code, score: Math.round((x.sub.marks / x.a.totalMarks) * 100) }));
  const attData = [{ name: 'Present', value: att.present }, { name: 'Absent', value: Math.max(att.total - att.present, 0) }];
  const upcoming = assessments.filter((a) => !submission(a.id, user.id)).sort((x, y) => x.dueDate.localeCompare(y.dueDate));

  const today = [
    ...upcoming.slice(0, 2).map((a) => ({ icon: ClipboardList, title: a.title, meta: `${subjectById(a.subjectId)?.name} · due ${formatDate(a.dueDate)}`, tone: 'plum' })),
    ...(due ? [{ icon: Wallet, title: 'Fee payment pending', meta: `${inr(due)} due by ${formatDate(fee.dueDate)}`, tone: 'orange' }] : []),
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title={`Welcome, ${user.fullName.split(' ')[0]}`} subtitle="Here's your academic snapshot" />

      <HeroCard
        name={user.fullName}
        role="Student"
        subtitle={`${user.batch} · ${user.roll}`}
        metrics={[
          { label: 'Subjects', value: subjects.length },
          { label: 'Avg score', value: `${avg}%` },
          { label: 'Attendance', value: `${att.percent}%` },
        ]}
        today={today}
      />

      {loading ? <StatSkeleton /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GradientStat label="Subjects" count={subjects.length} icon={BookOpen} tone="velvet" />
          <GradientStat label="Avg score" count={avg} suffix="%" icon={Award} tone="plum" delay={0.05} />
          <GradientStat label="Attendance" count={att.percent} suffix="%" icon={CalendarCheck} tone="emerald" delay={0.1} />
          <GradientStat label="Fees due" value={due ? inr(due, true) : 'Clear'} hint={due ? `due ${formatDate(fee.dueDate)}` : 'All paid'} icon={Wallet} tone="slate" delay={0.15} />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {loading ? <ChartSkeleton className="lg:col-span-2" /> : (
          <Reveal className="lg:col-span-2">
            <Panel title="Scores by subject" subtitle="Graded assessments">
              <div className="h-72" role="img" aria-label={`Bar chart of assessment scores by subject. ${marksData.map((d) => `${d.name}: ${d.score} percent`).join(', ') || 'No data yet'}`}>
                {marksData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marksData} barSize={34}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EDECF2" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip cursor={{ fill: '#F7F8FC' }} content={<ChartTooltip format={(v) => `${v}%`} />} />
                      <Bar dataKey="score" name="Score" radius={[6, 6, 0, 0]} fill="#6C1D5F" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="grid h-full place-items-center text-sm text-slate/60">No graded assessments yet.</p>}
              </div>
            </Panel>
          </Reveal>
        )}

        {loading ? <ChartSkeleton /> : (
          <Reveal delay={0.1}>
            <Panel title="Attendance">
              <div className="h-72" role="img" aria-label={`Attendance donut chart. ${att.present} present out of ${att.total} sessions, ${att.percent} percent`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={attData} dataKey="value" innerRadius={58} outerRadius={84} paddingAngle={3} startAngle={90} endAngle={-270}>
                      <Cell fill={STATUS.positive} />
                      <Cell fill={STATUS.attention} />
                    </Pie>
                    <Legend iconType="circle" />
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </Reveal>
        )}
      </div>

      {loading ? <ListSkeleton /> : (
        <Reveal delay={0.15}>
          <Panel title="Upcoming assessments" bodyClassName="p-0">
            <ul className="divide-y divide-line/60">
              {upcoming.length ? upcoming.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-slate/70">{subjectById(a.subjectId)?.name} · {a.totalMarks} marks</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone="orange">due {formatDate(a.dueDate)}</Badge>
                    <Badge tone="plum">{a.type}</Badge>
                  </div>
                </li>
              )) : <li className="px-5 py-6 text-center text-sm text-slate/60">You're all caught up. 🎉</li>}
            </ul>
          </Panel>
        </Reveal>
      )}
    </div>
  );
}
