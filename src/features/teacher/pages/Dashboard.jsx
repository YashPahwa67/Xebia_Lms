import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BookOpen, Users, ClipboardList, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { useSimulatedLoad } from '@/hooks/useSimulatedLoad';
import { GradientStat } from '@/components/dash/GradientStat';
import { Panel } from '@/components/dash/Panel';
import { AnnouncementsPanel } from '@/components/dash/AnnouncementsPanel';
import { HeroCard } from '@/components/dash/HeroCard';
import { ChartTooltip } from '@/components/dash/ChartTooltip';
import { StatSkeleton, ChartSkeleton, ListSkeleton } from '@/components/dash/Skeleton';
import { Reveal } from '@/components/marketing/Reveal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Card';
import { formatDate } from '@/utils/format';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const loading = useSimulatedLoad();
  const { teacherSubjects, studentsInSubject, assessmentsForSubjects, attendanceForSubject, db } = useData();

  const subjects = teacherSubjects(user.id);
  const subjectIds = subjects.map((s) => s.id);
  const studentSet = new Set();
  subjects.forEach((s) => studentsInSubject(s.id).forEach((st) => studentSet.add(st.id)));
  const assessments = assessmentsForSubjects(subjectIds);
  const sessions = subjectIds.reduce((n, id) => n + attendanceForSubject(id).length, 0);

  const perf = subjects.map((s) => {
    const subA = assessments.filter((a) => a.subjectId === s.id);
    let total = 0; let count = 0;
    subA.forEach((a) => db.submissions.filter((x) => x.assessmentId === a.id).forEach((x) => { total += (x.marks / a.totalMarks) * 100; count += 1; }));
    return { name: s.code, avg: count ? Math.round(total / count) : 0 };
  });

  const today = [
    ...assessments.slice(0, 2).map((a) => ({ icon: ClipboardList, title: `Review: ${a.title}`, meta: `due ${formatDate(a.dueDate)}`, tone: 'plum' })),
    { icon: CalendarCheck, title: 'Mark today’s attendance', meta: `${subjects.length} subjects`, tone: 'teal' },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title={`Welcome, ${user.fullName.split(' ')[0]}`} subtitle="Your teaching overview" />

      <HeroCard
        name={user.fullName}
        role="Teacher"
        subtitle="Computer Science Dept."
        metrics={[
          { label: 'Subjects', value: subjects.length },
          { label: 'Students', value: studentSet.size },
          { label: 'Assessments', value: assessments.length },
        ]}
        today={today}
      />

      {loading ? <StatSkeleton /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GradientStat label="Subjects" count={subjects.length} icon={BookOpen} tone="velvet" />
          <GradientStat label="Students" count={studentSet.size} icon={Users} tone="plum" delay={0.05} />
          <GradientStat label="Assessments" count={assessments.length} icon={ClipboardList} tone="emerald" delay={0.1} />
          <GradientStat label="Sessions held" count={sessions} icon={CalendarCheck} tone="slate" delay={0.15} />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {loading ? <ChartSkeleton className="lg:col-span-2" /> : (
          <Reveal className="lg:col-span-2">
            <Panel title="Class average by subject" subtitle="Across graded assessments">
              <div className="h-72" role="img" aria-label={`Bar chart of class average score by subject. ${perf.map((d) => `${d.name}: ${d.avg} percent`).join(', ')}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={perf} barSize={42}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDECF2" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F7F8FC' }} content={<ChartTooltip format={(v) => `${v}%`} />} />
                    <Bar dataKey="avg" name="Avg score" radius={[6, 6, 0, 0]} fill="#84117C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </Reveal>
        )}

        {loading ? <ListSkeleton /> : (
          <Reveal delay={0.1}>
            <Panel title="Recent assessments" bodyClassName="p-0">
              <ul className="divide-y divide-line/60">
                {assessments.slice(0, 6).map((a) => (
                  <li key={a.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{a.title}</p>
                      <p className="text-xs text-slate/70">due {formatDate(a.dueDate)}</p>
                    </div>
                    <Badge tone="plum">{a.type}</Badge>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        )}
      </div>
      <AnnouncementsPanel />
    </div>
  );
}
