import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Banknote, TrendingUp, AlertCircle, PiggyBank } from 'lucide-react';
import { useData } from '@/features/data/DataContext';
import { useSimulatedLoad } from '@/hooks/useSimulatedLoad';
import { GradientStat } from '@/components/dash/GradientStat';
import { Panel } from '@/components/dash/Panel';
import { SortableTable } from '@/components/dash/SortableTable';
import { StatSkeleton, ChartSkeleton } from '@/components/dash/Skeleton';
import { ChartTooltip } from '@/components/dash/ChartTooltip';
import { Reveal } from '@/components/marketing/Reveal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Card';
import { inr } from '@/utils/format';

export default function DirectorFinance() {
  const loading = useSimulatedLoad();
  const { db, students } = useData();

  const billed = db.fees.reduce((s, f) => s + f.total, 0);
  const collected = db.fees.reduce((s, f) => s + f.paid, 0);
  const outstanding = billed - collected;
  const rate = billed ? Math.round((collected / billed) * 100) : 0;

  // group by batch for the chart
  const byBatch = {};
  db.fees.forEach((f) => {
    const stu = students().find((s) => s.id === f.studentId);
    const batch = stu?.batch || '—';
    byBatch[batch] = byBatch[batch] || { name: batch, collected: 0, outstanding: 0 };
    byBatch[batch].collected += f.paid / 1000;
    byBatch[batch].outstanding += (f.total - f.paid) / 1000;
  });
  const chartData = Object.values(byBatch).map((b) => ({ ...b, collected: Math.round(b.collected), outstanding: Math.round(b.outstanding) }));

  const defaulters = db.fees
    .filter((f) => f.paid < f.total)
    .map((f) => ({ ...f, student: students().find((s) => s.id === f.studentId) }));

  const columns = [
    { key: 'name', header: 'Student', sortValue: (r) => r.student?.name, render: (r) => <span className="font-medium text-ink">{r.student?.name}</span> },
    { key: 'batch', header: 'Batch', sortValue: (r) => r.student?.batch, render: (r) => r.student?.batch },
    { key: 'total', header: 'Total', align: 'right', sortValue: (r) => r.total, render: (r) => inr(r.total) },
    { key: 'due', header: 'Outstanding', align: 'right', sortValue: (r) => r.total - r.paid, render: (r) => <Badge tone="orange">{inr(r.total - r.paid)}</Badge> },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Finance" subtitle="Institution-wide fee revenue & dues" />

      {loading ? <StatSkeleton /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GradientStat label="Total billed" value={inr(billed, true)} icon={Banknote} tone="velvet" />
          <GradientStat label="Collected" value={inr(collected, true)} icon={PiggyBank} tone="emerald" delay={0.05} />
          <GradientStat label="Outstanding" value={inr(outstanding, true)} icon={AlertCircle} tone="plum" delay={0.1} />
          <GradientStat label="Collection rate" count={rate} suffix="%" icon={TrendingUp} tone="slate" delay={0.15} />
        </div>
      )}

      {loading ? <ChartSkeleton /> : (
        <Reveal>
          <Panel title="Collected vs outstanding by batch" subtitle="₹ in thousands">
            <div className="h-72" role="img" aria-label="Bar chart of collected versus outstanding fees by batch, in thousands of rupees">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDECF2" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#F7F8FC' }} content={<ChartTooltip format={(v) => `₹${v}k`} />} />
                  <Legend iconType="circle" />
                  <Bar dataKey="collected" name="Collected" stackId="a" fill="#6C1D5F" />
                  <Bar dataKey="outstanding" name="Outstanding" stackId="a" fill="#D3CCEC" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <Panel title="Outstanding payments" bodyClassName="p-0">
          <SortableTable columns={columns} rows={defaulters} emptyMessage="No outstanding fees" />
        </Panel>
      </Reveal>
    </div>
  );
}
