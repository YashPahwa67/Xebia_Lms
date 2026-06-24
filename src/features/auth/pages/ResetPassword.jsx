import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { Button, Input, useToast } from '@/components/ui';
import { MeshBlobs, GridOverlay } from '@/components/marketing/Backdrops';
import xebiaLogo from '@/assets/landing/logo.png';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    setSubmitting(true);
    try {
      await authService.resetPassword(token, form.password);
      toast.success('Password reset. Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key, label) => (
    <div className="relative">
      <Lock size={16} className="pointer-events-none absolute left-3.5 top-9 text-slate/40" />
      <Input label={label} type="password" required value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="pl-10" placeholder="••••••••" />
    </div>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      <MeshBlobs className="opacity-50" />
      <GridOverlay />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-line/70 bg-white p-8 shadow-glow">
        <Link to="/" aria-label="Xebia home">
          <img src={xebiaLogo} alt="Xebia" className="-ml-2 h-14 w-auto object-contain" />
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Set a new password</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {field('password', 'New password')}
          {field('confirm', 'Confirm password')}
          <Button type="submit" loading={submitting} className="w-full">Reset password</Button>
        </form>
        <Link to="/login" className="mt-6 block text-center text-sm font-medium text-plum hover:underline">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
