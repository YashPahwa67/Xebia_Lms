import {
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Users, Wallet, AlertCircle, TrendingUp } from 'lucide-react';
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
import { STATUS } from '@/constants/palette';
import { inr } from '@/utils/format';

export default function CounsellorDashboard() {
  const { user } = useAuth();
  const loading = useSimulatedLoad();
  const { students, db } = useData();
  const all = students();
  const totalBilled = db.fees.reduce((s, f) => s + f.total, 0);
  const collected = db.fees.reduce((s, f) => s + f.paid, 0);
  const due = totalBilled - collected;
  const defaulters = db.fees.filter((f) => f.paid < f.total);

  const feeData = [{ name: 'Collected', value: collected }, { name: 'Outstanding', value: due }];
  const byStudent = db.fees.map((f) => {
    const u = all.find((s) => s.id === f.studentId);
    return { name: u?.name.split(' ')[0] || f.studentId, paid: Math.round(f.paid / 1000), due: Math.round((f.total - f.paid) / 1000) };
  });

  const today = defaulters.slice(0, 3).map((f) => {
    const u = all.find((s) => s.id === f.studentId);
    return { icon: AlertCircle, title: `Follow up: ${u?.name}`, meta: `${inr(f.total - f.paid)} outstanding`, tone: 'orange' };
  });

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Counsellor Dashboard" subtitle="Fees, students & well-being at a glance" />

      <HeroCard
        name={user.fullName}
        role="Counsellor"
        subtitle="Student services"
        metrics={[
          { label: 'Students', value: all.length },
          { label: 'Collected', value: inr(collected, true) },
          { label: 'Defaulters', value: defaulters.length },
        ]}
        today={today}
      />

      {loading ? <StatSkeleton /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GradientStat label="Students" count={all.length} icon={Users} tone="velvet" />
          <GradientStat label="Collected" value={inr(collected, true)} icon={Wallet} tone="emerald" delay={0.05} />
          <GradientStat label="Outstanding" value={inr(due, true)} icon={AlertCircle} tone="plum" delay={0.1} />
          <GradientStat label="Defaulters" count={defaulters.length} hint="pending dues" icon={TrendingUp} tone="slate" delay={0.15} />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {loading ? <ChartSkeleton /> : (
          <Reveal>
            <Panel title="Fee collection">
              <div className="h-72" role="img" aria-label={`Donut chart of fee collection. ${inr(collected)} collected, ${inr(due)} outstanding`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={feeData} dataKey="value" innerRadius={58} outerRadius={84} paddingAngle={3}>
                      <Cell fill={STATUS.positive} />
                      <Cell fill={STATUS.attention} />
                    </Pie>
                    <Legend iconType="circle" />
                    <Tooltip content={<ChartTooltip format={(v) => inr(v)} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </Reveal>
        )}

        {loading ? <ChartSkeleton className="lg:col-span-2" /> : (
          <Reveal delay={0.1} className="lg:col-span-2">
            <Panel title="Fees by student" subtitle="₹ in thousands">
              <div className="h-72" role="img" aria-label="Stacked bar chart of paid versus due fees per student, in thousands of rupees">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byStudent} barSize={26}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDECF2" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F7F8FC' }} content={<ChartTooltip format={(v) => `₹${v}k`} />} />
                    <Legend iconType="circle" />
                    <Bar dataKey="paid" name="Paid" stackId="a" fill="#6C1D5F" />
                    <Bar dataKey="due" name="Due" stackId="a" fill="#D3CCEC" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </Reveal>
        )}
      </div>
    </div>
  );
}
