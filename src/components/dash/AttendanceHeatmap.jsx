import { formatDate } from '@/utils/format';

// GitHub-style calendar heatmap over the last `weeks` weeks.
// records: { 'YYYY-MM-DD': 'present' | 'absent' | 'late' }
const COLOR = {
  present: 'bg-teal',
  late: 'bg-teal/50',
  absent: 'bg-cta',
};

function isoDay(d) {
  return d.toISOString().slice(0, 10);
}

export function AttendanceHeatmap({ records = {}, weeks = 8 }) {
  const today = new Date();
  // start from the Sunday `weeks` weeks ago
  const start = new Date(today);
  start.setDate(today.getDate() - (weeks * 7 - 1));
  start.setDate(start.getDate() - start.getDay());

  const columns = [];
  const cursor = new Date(start);
  for (let w = 0; w < weeks + 1; w += 1) {
    const col = [];
    for (let d = 0; d < 7; d += 1) {
      const key = isoDay(cursor);
      const status = records[key];
      const future = cursor > today;
      col.push({ key, status, future });
      cursor.setDate(cursor.getDate() + 1);
    }
    columns.push(col);
  }

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((cell) => (
              <span
                key={cell.key}
                title={cell.status ? `${formatDate(cell.key)} — ${cell.status}` : formatDate(cell.key)}
                className={`h-3.5 w-3.5 rounded-[3px] ${cell.future ? 'bg-transparent' : cell.status ? COLOR[cell.status] : 'bg-mist/50'}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-slate/60">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-teal" /> Present</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-cta" /> Absent</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-mist/50" /> No class</span>
      </div>
    </div>
  );
}
