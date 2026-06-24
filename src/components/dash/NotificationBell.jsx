import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, FileText, ClipboardList, Wallet, CheckCheck, Inbox } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';

const ICONS = { note: FileText, assessment: ClipboardList, submission: ClipboardList, fee: Wallet, system: Bell };

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function NotificationBell() {
  const { user } = useAuth();
  const { notificationsFor, markNotifRead, markAllNotifRead } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const items = notificationsFor(user.id);
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-slate shadow-sm transition-colors hover:text-plum"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-cta px-1 text-[10px] font-bold text-white"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-line/70 bg-white shadow-float"
          >
            <div className="flex items-center justify-between border-b border-line/60 px-4 py-3">
              <p className="text-sm font-semibold text-ink">Notifications</p>
              {unread > 0 && (
                <button onClick={() => markAllNotifRead(user.id)} className="inline-flex items-center gap-1 text-xs font-medium text-plum hover:underline">
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.length ? (
                items.map((n) => {
                  const Icon = ICONS[n.type] || Bell;
                  return (
                    <button
                      key={n.id}
                      onClick={() => markNotifRead(n.id, user.id)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-paper ${n.read ? '' : 'bg-plum/[0.03]'}`}
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-plum/[0.07] text-plum">
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-ink">{n.title}</span>
                        <span className="block truncate text-xs text-slate/65">{n.meta}</span>
                        <span className="text-[11px] text-slate/45">{timeAgo(n.createdAt)}</span>
                      </span>
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cta" />}
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <Inbox className="h-8 w-8 text-mist" />
                  <p className="text-sm text-slate/55">You're all caught up</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
