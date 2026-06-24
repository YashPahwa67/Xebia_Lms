import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { GradientStat } from '@/components/dash/GradientStat';
import { EmptyState } from '@/components/ui/States';
import { Button, useToast } from '@/components/ui';
import { Wallet, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';
import { formatDate, inr } from '@/utils/format';

export default function StudentFees() {
  const { user } = useAuth();
  const toast = useToast();
  const { feeFor, recordPayment } = useData();
  const fee = feeFor(user.id);

  if (!fee) return <><PageHeader title="Fees" /><EmptyState title="No fee record" /></>;

  const due = fee.total - fee.paid;
  const pct = Math.round((fee.paid / fee.total) * 100);

  const payNow = () => {
    recordPayment(user.id, due, 'Card');
    toast.success(`Payment of ${inr(due)} successful`);
  };

  return (
    <div>
      <PageHeader
        title="Fees"
        subtitle="Your fee summary and payment history"
        actions={due > 0 && <Button onClick={payNow}><CreditCard size={16} /> Pay {inr(due)}</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <GradientStat label="Total fee" value={inr(fee.total)} icon={Wallet} tone="velvet" />
        <GradientStat label="Paid" value={inr(fee.paid)} icon={CheckCircle2} tone="emerald" delay={0.05} />
        <GradientStat label="Due" value={due ? inr(due) : 'Clear'} hint={due ? `by ${formatDate(fee.dueDate)}` : 'Fully paid'} icon={AlertCircle} tone="slate" delay={0.1} />
      </div>

      <Panel title="Payment progress" className="mt-5">
        <div className="flex items-center justify-between text-sm text-slate/70">
          <span>{pct}% paid</span>
          <span>{inr(fee.paid)} / {inr(fee.total)}</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-mist/60">
          <div className="h-full rounded-full bg-gradient-to-r from-magenta to-plum" style={{ width: `${pct}%` }} />
        </div>
      </Panel>

      <Panel title="Payment history" className="mt-5" bodyClassName="p-0">
        {fee.payments.length ? (
          <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-paper text-left text-slate/60">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {fee.payments.map((p, i) => (
                <tr key={i}>
                  <td className="px-5 py-3 text-slate">{formatDate(p.date)}</td>
                  <td className="px-5 py-3 text-slate">{p.method}</td>
                  <td className="px-5 py-3 text-right font-semibold text-ink">{inr(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p className="px-5 py-6 text-center text-sm text-slate/60">No payments recorded yet.</p>
        )}
      </Panel>
    </div>
  );
}
