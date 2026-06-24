import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/format';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const COLOR = {
  present: 'bg-teal text-white',
  late: 'bg-teal/50 text-white',
  absent: 'bg-cta text-white',
};

function iso(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function MonthGrid({ year, month, records, today }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <p className="mb-2 text-center text-sm font-semibold text-ink">{MONTHS[month]} {year}</p>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="grid h-6 place-items-center text-[10px] font-medium text-slate/45">{d}</span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`b${i}`} />;
          const key = iso(year, month, day);
          const status = records[key];
          const future = new Date(year, month, day) > today;
          return (
            <span
              key={key}
              title={status ? `${formatDate(key)} — ${status}` : formatDate(key)}
              className={`grid h-8 place-items-center rounded-lg text-xs ${
                status ? COLOR[status] : future ? 'text-slate/25' : 'bg-mist/40 text-slate/60'
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Navigable two-month attendance calendar.
export function AttendanceCalendar({ records = {} }) {
  const today = new Date();
  // anchor = the latest (rightmost) month shown; start on the current month.
  const [anchor, setAnchor] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const shift = (delta) => {
    setAnchor((a) => {
      const d = new Date(a.y, a.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  // Show three months ending on the anchor month.
  const months = [2, 1, 0].map((back) => {
    const d = new Date(anchor.y, anchor.m - back, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => shift(-1)} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate transition-colors hover:border-plum hover:text-plum" aria-label="Previous months">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-slate/70">
          {MONTHS[months[0].m].slice(0, 3)} – {MONTHS[months[2].m].slice(0, 3)} {months[2].y}
        </span>
        <button onClick={() => shift(1)} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate transition-colors hover:border-plum hover:text-plum" aria-label="Next months">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* keep the 3 months on one line; scroll horizontally if the screen is too narrow */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex gap-4 sm:gap-6">
          {months.map((mo) => (
            <div key={`${mo.y}-${mo.m}`} className="min-w-[230px] flex-1">
              <MonthGrid year={mo.y} month={mo.m} records={records} today={today} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-line/60 pt-4 text-xs text-slate/60">
        <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-teal" /> Present</span>
        <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-cta" /> Absent</span>
        <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-mist/40" /> No class</span>
      </div>
    </div>
  );
}
