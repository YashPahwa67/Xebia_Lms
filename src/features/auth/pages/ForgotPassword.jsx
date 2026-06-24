import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { Button, Input, useToast } from '@/components/ui';
import { MeshBlobs, GridOverlay } from '@/components/marketing/Backdrops';
import xebiaLogo from '@/assets/landing/logo.png';

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('If the email exists, a reset link has been sent.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      <MeshBlobs className="opacity-50" />
      <GridOverlay />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-line/70 bg-white p-8 shadow-glow">
        <Link to="/" aria-label="Xebia home">
          <img src={xebiaLogo} alt="Xebia" className="-ml-2 h-14 w-auto object-contain" />
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Reset your password</h1>
        <p className="mt-1 text-sm text-slate/75">Enter your email and we'll send you a reset link.</p>

        {sent ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-teal/30 bg-teal/[0.06] p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-soft" />
            <p className="text-sm text-teal-soft">Check your inbox for the password reset link.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-9 text-slate/40" />
              <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="you@example.com" />
            </div>
            <Button type="submit" loading={submitting} className="w-full">Send reset link</Button>
          </form>
        )}

        <Link to="/login" className="mt-6 block text-center text-sm font-medium text-plum hover:underline">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
