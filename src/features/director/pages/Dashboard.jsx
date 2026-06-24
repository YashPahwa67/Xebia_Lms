import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Users, GraduationCap, BookOpen, Wallet, UserPlus, AlertCircle } from 'lucide-react';
import { useData } from '@/features/data/DataContext';
import { useAuth } from '@/features/auth/AuthContext';
import { useSimulatedLoad } from '@/hooks/useSimulatedLoad';
import { GradientStat } from '@/components/dash/GradientStat';
import { Panel } from '@/components/dash/Panel';
import { HeroCard } from '@/components/dash/HeroCard';
import { ChartTooltip } from '@/components/dash/ChartTooltip';
import { StatSkeleton, ChartSkeleton } from '@/components/dash/Skeleton';
import { Reveal } from '@/components/marketing/Reveal';
import { PageHeader } from '@/components/ui/PageHeader';
import { CHART_COLORS } from '@/constants/palette';
import { inr } from '@/utils/format';

const TREND = [
  { m: 'Jan', students: 180 }, { m: 'Feb', students: 220 }, { m: 'Mar', students: 260 },
  { m: 'Apr', students: 300 }, { m: 'May', students: 340 }, { m: 'Jun', students: 380 },
];

export default function DirectorDashboard() {
  const { user } = useAuth();
  const loading = useSimulatedLoad();
  const { students, teachers, counsellors, db } = useData();
  const collected = db.fees.reduce((s, f) => s + f.paid, 0);
  const defaulters = db.fees.filter((f) => f.paid < f.total).length;

  const split = [
    { name: 'Students', value: students().length },
    { name: 'Teachers', value: teachers().length },
    { name: 'Counsellors', value: counsellors().length },
  ];

  const today = [
    { icon: UserPlus, title: '3 admission applications', meta: 'awaiting review', tone: 'plum' },
    { icon: AlertCircle, title: `${defaulters} fee defaulters`, meta: 'flagged by counsellor', tone: 'orange' },
    { icon: GraduationCap, title: 'Faculty review due', meta: 'end of term', tone: 'teal' },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Director Dashboard" subtitle="Institution overview & key metrics" />

      <HeroCard
        name={user.fullName}
        role="Director"
        subtitle="Office of the Director"
        metrics={[
          { label: 'Students', value: students().length },
          { label: 'Faculty', value: teachers().length },
          { label: 'Subjects', value: db.subjects.length },
        ]}
        today={today}
      />

      {loading ? <StatSkeleton /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GradientStat label="Students" count={students().length} icon={Users} tone="velvet" />
          <GradientStat label="Teachers" count={teachers().length} icon={GraduationCap} tone="plum" delay={0.05} />
          <GradientStat label="Subjects" count={db.subjects.length} icon={BookOpen} tone="emerald" delay={0.1} />
          <GradientStat label="Fees collected" value={inr(collected, true)} icon={Wallet} tone="slate" delay={0.15} />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {loading ? <ChartSkeleton className="lg:col-span-2" /> : (
          <Reveal className="lg:col-span-2">
            <Panel title="Enrolment trend" subtitle="Last 6 months">
              <div className="h-72" role="img" aria-label={`Area chart of student enrolment over the last 6 months, from ${TREND[0].students} to ${TREND[TREND.length - 1].students} students`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TREND}>
                    <defs>
                      <linearGradient id="encol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6C1D5F" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#6C1D5F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDECF2" vertical={false} />
                    <XAxis dataKey="m" tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ stroke: '#DADCEA' }} content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="students" name="Students" stroke="#6C1D5F" strokeWidth={2.5} fill="url(#encol)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </Reveal>
        )}

        {loading ? <ChartSkeleton /> : (
          <Reveal delay={0.1}>
            <Panel title="People split">
              <div className="h-72" role="img" aria-label={`Donut chart of people by role. ${split.map((s) => `${s.value} ${s.name}`).join(', ')}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={split} dataKey="value" innerRadius={56} outerRadius={84} paddingAngle={3}>
                      {split.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
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
    </div>
  );
}
