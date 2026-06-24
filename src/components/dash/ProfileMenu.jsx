import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, LogOut, Lock } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Modal, Button, Input, useToast } from '@/components/ui';
import { initials } from '@/utils/format';
import { cn } from '@/utils/cn';

// Demo account password (matches the pre-filled credential on the login page).
const DEMO_PASSWORD = 'demo1234';
const EMPTY = { current: '', next: '', confirm: '' };

function ChangePasswordModal({ onClose }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.current !== DEMO_PASSWORD) next.current = 'Current password is incorrect';
    if (form.next.length < 6) next.next = 'Must be at least 6 characters';
    if (form.next && form.next === form.current) next.next = 'Choose a different password';
    if (form.next !== form.confirm) next.confirm = 'Passwords do not match';
    setErrors(next);
    if (Object.keys(next).length) return;
    // Demo: no backend persistence — confirm the change client-side.
    toast.success('Password changed successfully');
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Change password"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button form="change-pw" type="submit">Update password</Button>
        </>
      }
    >
      <form id="change-pw" onSubmit={submit} className="space-y-4">
        <Input label="Current password" type="password" required value={form.current} onChange={set('current')} error={errors.current} placeholder="••••••••" />
        <Input label="New password" type="password" required value={form.next} onChange={set('next')} error={errors.next} placeholder="At least 6 characters" />
        <Input label="Confirm new password" type="password" required value={form.confirm} onChange={set('confirm')} error={errors.confirm} placeholder="••••••••" />
        <p className="flex items-center gap-1.5 text-xs text-slate/55"><Lock size={12} /> You'll need your current password to set a new one.</p>
      </form>
    </Modal>
  );
}

export function ProfileMenu({ avatarClass }) {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn('grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white transition-transform hover:scale-105', avatarClass)}
        aria-label="Account menu"
        aria-expanded={open}
      >
        {initials(user?.fullName || 'U')}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 z-50 w-60 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-line/70 bg-white shadow-float"
          >
            <div className="flex items-center gap-3 border-b border-line/60 px-4 py-3">
              <span className={cn('grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white', avatarClass)}>
                {initials(user?.fullName || 'U')}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{user?.fullName}</p>
                <p className="truncate text-xs text-slate/60">{role}</p>
              </div>
            </div>
            <div className="p-1.5">
              <button
                onClick={() => { setShowPw(true); setOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
              >
                <KeyRound size={16} className="text-plum" /> Change password
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cta transition-colors hover:bg-cta/[0.06]"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPw && <ChangePasswordModal onClose={() => setShowPw(false)} />}
    </div>
  );
}
