import { useState } from 'react';
import { useData } from '@/features/data/DataContext';
import { useSimulatedLoad } from '@/hooks/useSimulatedLoad';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { SortableTable } from '@/components/dash/SortableTable';
import { ListSkeleton } from '@/components/dash/Skeleton';
import { Badge } from '@/components/ui/Card';
import { Modal, Button, Input, Select, useToast } from '@/components/ui';
import { inr } from '@/utils/format';

function RecordModal({ student, fee, onClose, onRecord }) {
  const due = fee.total - fee.paid;
  const [amount, setAmount] = useState(due);
  const [method, setMethod] = useState('UPI');
  return (
    <Modal
      open onClose={onClose} title={`Record payment — ${student.name}`}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button className="bg-plum text-white hover:bg-plum-dark" onClick={() => onRecord(Number(amount), method)}>Record</Button></>}
    >
      <p className="mb-4 text-sm text-slate/75">Outstanding: <span className="font-semibold text-cta">{inr(due)}</span></p>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Amount (₹)" type="number" min="1" max={due} value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Select label="Method" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>UPI</option><option>Card</option><option>Bank Transfer</option><option>Cash</option>
        </Select>
      </div>
    </Modal>
  );
}

export default function CounsellorFees() {
  const { students, feeFor, recordPayment } = useData();
  const loading = useSimulatedLoad();
  const toast = useToast();
  const [target, setTarget] = useState(null);

  const rows = students().map((s) => ({ ...s, fee: feeFor(s.id) })).filter((s) => s.fee);

  const columns = [
    { key: 'name', header: 'Student', render: (s) => <span className="font-medium text-ink">{s.name}</span> },
    { key: 'total', header: 'Total', align: 'right', sortValue: (s) => s.fee.total, render: (s) => inr(s.fee.total) },
    { key: 'paid', header: 'Paid', align: 'right', sortValue: (s) => s.fee.paid, render: (s) => inr(s.fee.paid) },
    {
      key: 'status', header: 'Status', sortValue: (s) => s.fee.total - s.fee.paid,
      render: (s) => { const due = s.fee.total - s.fee.paid; return due ? <Badge tone="orange">{inr(due)} due</Badge> : <Badge tone="teal">Paid</Badge>; },
    },
    {
      key: 'action', header: '', sortable: false, align: 'right',
      render: (s) => (s.fee.total - s.fee.paid > 0 ? <Button size="sm" variant="secondary" onClick={() => setTarget(s)}>Record payment</Button> : null),
    },
  ];

  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Fees" subtitle="Record payments and track dues" />
      {loading ? <ListSkeleton rows={5} /> : (
        <Panel bodyClassName="p-0">
          <SortableTable columns={columns} rows={rows} emptyMessage="No fee records" />
        </Panel>
      )}
      {target && (
        <RecordModal
          student={target}
          fee={feeFor(target.id)}
          onClose={() => setTarget(null)}
          onRecord={(amount, method) => {
            if (!amount || amount <= 0) return toast.error('Enter a valid amount');
            recordPayment(target.id, amount, method);
            setTarget(null);
            toast.success(`Recorded ${inr(amount)} for ${target.name}`);
          }}
        />
      )}
    </div>
  );
}
