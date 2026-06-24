import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { EmptyState } from '@/components/ui/States';

/**
 * Sticky-header, sortable table.
 * columns: [{ key, header, render?(row), sortValue?(row), align?, sortable? }]
 */
export function SortableTable({ columns, rows, rowKey = (r) => r.id, emptyMessage = 'No records' }) {
  const [sort, setSort] = useState({ key: null, dir: 1 });

  const sorted = useMemo(() => {
    if (!sort.key) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const val = (r) => (col.sortValue ? col.sortValue(r) : r[sort.key]);
    return [...rows].sort((a, b) => {
      const x = val(a);
      const y = val(b);
      if (x === y) return 0;
      return (x > y ? 1 : -1) * sort.dir;
    });
  }, [rows, sort, columns]);

  const toggle = (key) => setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));

  if (!rows.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 z-10 bg-paper text-left text-slate/60">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`px-5 py-3 font-medium ${c.align === 'right' ? 'text-right' : ''}`}>
                {c.sortable === false ? (
                  c.header
                ) : (
                  <button
                    onClick={() => toggle(c.key)}
                    className={`inline-flex items-center gap-1 transition-colors hover:text-plum ${c.align === 'right' ? 'flex-row-reverse' : ''}`}
                  >
                    {c.header}
                    {sort.key === c.key ? (
                      sort.dir === 1 ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                    ) : (
                      <ChevronsUpDown size={13} className="text-slate/35" />
                    )}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60">
          {sorted.map((r, i) => (
            <tr key={rowKey(r)} className={`transition-colors hover:bg-paper ${i % 2 ? 'bg-paper/40' : 'bg-white'}`}>
              {columns.map((c) => (
                <td key={c.key} className={`px-5 py-3 ${c.align === 'right' ? 'text-right' : ''} ${c.className || 'text-slate'}`}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
