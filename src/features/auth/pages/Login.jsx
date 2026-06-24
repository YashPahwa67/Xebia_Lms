import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Users, GraduationCap, Wallet, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { ROLES, ROLE_HOME } from '@/constants';
import { MeshBlobs, GridOverlay } from '@/components/marketing/Backdrops';
import xebiaLogo from '@/assets/landing/logo.png';

const OPTIONS = [
  { role: ROLES.DIRECTOR, icon: LayoutDashboard, desc: 'Institution-wide analytics, users & reports' },
  { role: ROLES.COUNSELLOR, icon: Wallet, desc: 'Students, fees, admissions & well-being' },
  { role: ROLES.TEACHER, icon: GraduationCap, desc: 'Create assessments, mark attendance, subjects' },
  { role: ROLES.STUDENT, icon: Users, desc: 'Subjects, assessments, attendance & fees' },
];

export default function Login() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && role && ROLE_HOME[role]) navigate(ROLE_HOME[role], { replace: true });
  }, [isAuthenticated, role, navigate]);

  // Go to the role's login page (multi-tenant sign-in), not straight into the app.
  const enter = (r) => navigate(`/login/${r}`);

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
          <h1 className="font-display text-4xl font-semibold leading-tight">
            One platform.<br />Every role.
          </h1>
          <p className="mt-4 max-w-sm text-white/70">
            Directors, counsellors, teachers and students — each with a workspace built precisely
            for what they do.
          </p>
        </div>
        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Xebia LMS</p>
      </div>

      {/* Role picker */}
      <div className="relative flex items-center justify-center px-6 py-12 sm:px-10">
        <MeshBlobs className="opacity-50" />
        <GridOverlay />
        <div className="relative z-10 w-full max-w-lg">
          <span className="eyebrow">
            <ShieldCheck size={13} /> Demo access
          </span>
          <h2 className="display-2 mt-5">
            Choose your <span className="text-gradient">workspace</span>
          </h2>
          <p className="lede mt-3 text-base">Select a role to explore its dashboard and permissions.</p>

          <div className="mt-8 space-y-3">
            {OPTIONS.map(({ role: r, icon: Icon, desc }, i) => (
              <motion.button
                key={r}
                onClick={() => enter(r)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.5 }}
                whileHover={{ x: 4 }}
                className="group flex w-full items-center gap-4 rounded-2xl border border-line/80 bg-white p-4 text-left shadow-sm transition-all hover:border-plum hover:shadow-glow"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-plum/[0.07] text-plum transition-colors group-hover:bg-plum group-hover:text-white">
                  <Icon size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">{r}</span>
                  <span className="block truncate text-sm text-slate/80">{desc}</span>
                </span>
                <ArrowRight size={18} className="shrink-0 text-slate/40 transition-all group-hover:translate-x-1 group-hover:text-plum" />
              </motion.button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate/70">
            <Link to="/" className="font-medium text-plum hover:underline">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
