import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mail, Lock, LayoutDashboard, Wallet, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { ROLES, ROLE_HOME } from '@/constants';
import { users as seedUsers, CURRENT } from '@/data/seed';
import { MeshBlobs, GridOverlay } from '@/components/marketing/Backdrops';
import xebiaLogo from '@/assets/landing/logo.png';
import heroArt from '@/assets/landing/hero-illustration.svg';

const META = {
  [ROLES.DIRECTOR]: { icon: LayoutDashboard, tagline: 'Institution-wide analytics, users & reports' },
  [ROLES.COUNSELLOR]: { icon: Wallet, tagline: 'Students, fees, admissions & well-being' },
  [ROLES.TEACHER]: { icon: GraduationCap, tagline: 'Assessments, attendance & subjects' },
  [ROLES.STUDENT]: { icon: Users, tagline: 'Subjects, assessments, attendance & fees' },
};

export default function RoleLogin() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { loginAs, isAuthenticated, role: authRole } = useAuth();

  const valid = Object.values(ROLES).includes(role);
  const meta = META[role];
  const demoEmail = valid ? seedUsers.find((u) => u.id === CURRENT[role])?.email : '';

  const [form, setForm] = useState({ email: demoEmail, password: 'demo1234' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && authRole && ROLE_HOME[authRole]) navigate(ROLE_HOME[authRole], { replace: true });
  }, [isAuthenticated, authRole, navigate]);

  if (!valid) {
    navigate('/login', { replace: true });
    return null;
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const Icon = meta.icon;

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Demo auth: accept any credentials and enter the chosen role's workspace.
    setTimeout(() => {
      const { role: chosen } = loginAs(role);
      navigate(ROLE_HOME[chosen], { replace: true });
    }, 450);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[0.85fr_1.15fr]">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-plum-gradient px-12 pb-10 pt-6 text-white lg:flex">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-faint bg-[size:54px_54px] opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
          <motion.div className="absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-teal/25 blur-3xl" animate={{ y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-magenta/40 blur-3xl" animate={{ y: [0, -26, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
        <Link to="/" className="relative">
          <img src={xebiaLogo} alt="Xebia" className="h-32 w-auto object-contain brightness-0 invert" />
        </Link>
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 rounded-3xl border border-white/15 bg-white/10 p-3 shadow-float backdrop-blur"
          >
            <motion.img
              src={heroArt} alt="Xebia LMS dashboard preview"
              className="w-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          <h1 className="font-display text-4xl font-semibold leading-tight">Learn. Teach.<br />Grow with Xebia.</h1>
          <p className="mt-4 max-w-sm text-white/70">Xebia&apos;s learning academy — courses built by Xebia, taught by our trainers, and tracked end to end.</p>
        </div>
        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Xebia LMS</p>
      </div>

      {/* Login form */}
      <div className="relative flex items-center justify-center px-6 py-12 sm:px-10">
        <MeshBlobs className="opacity-50" />
        <GridOverlay />
        <div className="relative z-10 w-full max-w-md">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate/70 hover:text-plum">
            <ArrowLeft size={16} /> Choose a different role
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-plum/[0.07] text-plum">
              <Icon size={22} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate/55">{role} portal</p>
              <h2 className="font-display text-2xl font-semibold text-ink">Sign in</h2>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate/70">{meta.tagline}</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Email</span>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-3 text-slate/40" />
                <input type="email" required value={form.email} onChange={set('email')} className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder-slate/35 focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/15" placeholder="you@institution.edu" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Password</span>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-3 text-slate/40" />
                <input type="password" required value={form.password} onChange={set('password')} className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder-slate/35 focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/15" placeholder="••••••••" />
              </div>
            </label>

            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-plum-dark disabled:opacity-60">
              {submitting ? 'Signing in…' : <>Sign in to {role} workspace <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="mt-5 rounded-xl border border-line/70 bg-paper px-4 py-2.5 text-center text-xs text-slate/65">
            Demo credentials are pre-filled — just click <span className="font-medium text-plum">Sign in</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
