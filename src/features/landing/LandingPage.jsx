import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import {
  GraduationCap, ArrowRight, LayoutDashboard, BookOpen, ClipboardList, CalendarCheck,
  Megaphone, Wallet, ShieldCheck, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Send, Sparkles,
  Moon, Sun,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { ROLE_HOME } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { Reveal } from '@/components/marketing/Reveal';
import { Counter } from '@/components/marketing/Counter';
import { MeshBlobs, GridOverlay, Noise } from '@/components/marketing/Backdrops';
import { ScrollProgress } from '@/components/marketing/ScrollProgress';
import { MagneticButton } from '@/components/marketing/MagneticButton';
import { TiltCard } from '@/components/marketing/TiltCard';
import { useToast } from '@/components/ui';
import xebiaLogo from '@/assets/landing/logo.png';
import heroArt from '@/assets/landing/hero-illustration.svg';

const STATS = [
  { value: 4, suffix: '', label: 'Role workspaces' },
  { value: 6, suffix: '+', label: 'Core modules' },
  { value: 100, suffix: '%', label: 'On one platform' },
];

const NAV = [{ label: 'Features', href: '#features' }, { label: 'Contact', href: '#contact' }];

function Navbar({ navigate, dark, toggle }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 16));
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3"
    >
      <nav className={`flex w-full max-w-container items-center justify-between rounded-full px-4 py-2 transition-all duration-500 ${scrolled ? 'glass shadow-float' : 'bg-transparent'}`}>
        <Link to="/" aria-label="Xebia home" className="flex items-center">
          <img src={xebiaLogo} alt="Xebia" className={`-my-4 h-24 w-auto object-contain ${dark ? 'brightness-0 invert' : ''}`} />
        </Link>
        <div className="hidden items-center gap-1 sm:flex">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/[0.04] hover:text-ink dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-slate transition-colors hover:border-plum hover:text-plum dark:border-white/15 dark:text-white/80 dark:hover:border-teal dark:hover:text-teal"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <MagneticButton onClick={() => navigate('/login')} className="btn-primary px-5 py-2.5 shadow-glow">Sign in</MagneticButton>
        </div>
      </nav>
    </motion.header>
  );
}

// Floating hero illustration.
function HeroVisual() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto mt-14 w-full max-w-3xl">
      <div aria-hidden="true" className="absolute inset-x-0 -top-6 bottom-0 -z-10 rounded-[3rem] bg-gradient-to-b from-plum/15 via-magenta/10 to-transparent blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        <TiltCard max={6}>
          <motion.div
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-float backdrop-blur dark:border-white/10 dark:bg-white/[0.04]"
          >
            <img src={heroArt} alt="Xebia LMS dashboard preview" className="w-full" />
          </motion.div>
        </TiltCard>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, dark, className = '' }) {
  return (
    <TiltCard className={`h-full ${className}`}>
      <article className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-6 ${dark ? 'bg-plum-gradient text-white' : 'card-surface'}`}>
        {dark && <div aria-hidden="true" className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-teal/30 blur-3xl" />}
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${dark ? 'bg-white/15 text-white' : 'bg-plum/[0.07] text-plum'}`}><Icon size={22} /></span>
        <h3 className={`mt-5 font-display text-lg font-semibold ${dark ? 'text-white' : 'text-ink dark:text-white'}`}>{title}</h3>
        <p className={`mt-1.5 text-sm leading-relaxed ${dark ? 'text-white/75' : 'text-slate/70 dark:text-white/70'}`}>{desc}</p>
      </article>
    </TiltCard>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { dark, toggle } = useTheme();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (isAuthenticated && role && ROLE_HOME[role]) navigate(ROLE_HOME[role], { replace: true });
  }, [isAuthenticated, role, navigate]);

  return (
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 ${dark ? 'dark bg-plum-deep text-white' : 'bg-white text-ink'}`}>
      <ScrollProgress />
      <Noise />
      <Navbar navigate={navigate} dark={dark} toggle={toggle} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-plum/[0.04] via-white to-white pt-28 dark:from-plum/25 dark:via-plum-deep dark:to-plum-deep">
        <MeshBlobs />
        <GridOverlay />
        <div className="shell relative pb-8 text-center">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="eyebrow">
            <Sparkles size={13} /> Learning Management System
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="display-1 mx-auto mt-6 max-w-3xl"
          >
            Run your institute on <span className="text-gradient">one platform</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }} className="lede mx-auto mt-6 max-w-xl">
            Courses, assessments, attendance, fees and announcements — a dedicated, beautifully simple workspace for every role.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton onClick={() => navigate('/login')} className="btn-primary px-7 py-3.5 text-base shadow-glow">Get started <ArrowRight size={18} /></MagneticButton>
            <a href="#features" className="btn-ghost px-6 py-3.5 text-base">Explore features</a>
          </motion.div>

          <HeroVisual />
        </div>
      </section>

      {/* Stats */}
      <section className="shell py-14">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line/70 bg-line/60 dark:border-white/10 dark:bg-white/10 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-white dark:bg-plum-deep">
              <div className="flex flex-col items-center gap-1 px-6 py-10 text-center">
                <span className="font-display text-4xl font-bold tracking-tightest text-gradient"><Counter value={s.value} suffix={s.suffix} /></span>
                <span className="text-sm font-medium text-slate/60 dark:text-white/60">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features — bento */}
      <section id="features" className="shell scroll-mt-20 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal><span className="eyebrow">The platform</span></Reveal>
          <Reveal delay={0.05}><h2 className="display-2 mt-5">Everything an institute needs</h2></Reveal>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Reveal className="md:col-span-2"><FeatureCard dark icon={LayoutDashboard} title="Role-based workspaces" desc="Director, counsellor, teacher and student each get a workspace built precisely for what they do — clean navigation, the right data, nothing extra." className="md:min-h-[15rem]" /></Reveal>
          <Reveal delay={0.05}><FeatureCard icon={BookOpen} title="Courses & content" desc="Organise courses and share notes with enrolled students." /></Reveal>
          <Reveal delay={0.1}><FeatureCard icon={ClipboardList} title="Assessments" desc="Create assessments; students take them and see results instantly." /></Reveal>
          <Reveal delay={0.15}><FeatureCard icon={CalendarCheck} title="Attendance" desc="Mark attendance per session and track it across the term." /></Reveal>
          <Reveal delay={0.2}><FeatureCard icon={Megaphone} title="Announcements" desc="Broadcast updates to a class, a role, or everyone." /></Reveal>
          <Reveal className="md:col-span-2"><FeatureCard icon={Wallet} title="Fees & records" desc="Counsellors manage fees and dues with clear summaries and history; students always know where they stand." className="md:min-h-[12rem]" /></Reveal>
        </div>
      </section>

      <Contact />

      {/* CTA */}
      <section className="shell pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-plum-gradient px-6 py-16 text-center text-white sm:px-12">
          <motion.div aria-hidden="true" className="absolute -left-16 top-0 h-60 w-60 rounded-full bg-teal/25 blur-3xl" animate={reduce ? undefined : { x: [0, 50, 0], y: [0, 24, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div aria-hidden="true" className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-magenta/40 blur-3xl" animate={reduce ? undefined : { x: [0, -40, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="absolute inset-0 bg-grid-faint bg-[size:48px_48px] opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <ShieldCheck className="relative mx-auto h-9 w-9 text-white/80" />
          <h2 className="relative mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold">Ready to get started?</h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/75">Sign in to your workspace and pick up where your institute left off.</p>
          <MagneticButton onClick={() => navigate('/login')} className="btn relative mt-8 bg-white px-7 py-3.5 text-base text-plum hover:bg-white/90">Sign in <ArrowRight size={18} /></MagneticButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line/70 dark:border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <img src={xebiaLogo} alt="Xebia" className="-my-2 h-12 w-auto object-contain" />
          <p className="text-sm text-slate/55 dark:text-white/55">© {new Date().getFullYear()} Xebia LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const FIELDS = [
  { name: 'firstName', label: 'First name', type: 'text', half: true },
  { name: 'lastName', label: 'Last name', type: 'text', half: true },
  { name: 'email', label: 'Email', type: 'email', half: true },
  { name: 'phone', label: 'Phone', type: 'tel', half: true },
  { name: 'subject', label: 'Subject', type: 'text' },
];
const DETAILS = [
  { icon: Mail, label: 'Email us', value: 'support@xebia.edu' },
  { icon: Phone, label: 'Call us', value: '+91 00000 00000' },
  { icon: MapPin, label: 'Visit us', value: 'Somewhere in the world' },
];
const EMPTY = { firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' };
const inputCls = 'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder-slate/35 transition-all focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/15 dark:border-white/12 dark:bg-white/[0.04] dark:text-white dark:placeholder-white/30';

function Contact() {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); toast.success("Thanks! We'll get back to you shortly."); setForm(EMPTY); };

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-paper py-20 dark:bg-white/[0.02]">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal><span className="eyebrow">Get in touch</span></Reveal>
          <Reveal delay={0.05}><h2 className="display-2 mt-5">We'd love to hear from you</h2></Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal className="card-surface p-6 sm:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
                    <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium text-ink/70 dark:text-white/70">{f.label}</label>
                    <input id={f.name} type={f.type} value={form[f.name]} onChange={set(f.name)} placeholder={f.label} className={inputCls} required={f.name !== 'phone'} />
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink/70 dark:text-white/70">Message</label>
                <textarea id="message" rows={4} required value={form.message} onChange={set('message')} placeholder="How can we help?" className={`${inputCls} resize-y`} />
              </div>
              <MagneticButton type="submit" className="btn bg-teal px-6 py-3.5 text-base text-white hover:bg-teal-soft">Send message <Send size={16} /></MagneticButton>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-4">
            <div className="relative flex-1 overflow-hidden rounded-3xl bg-plum-gradient p-7 text-white">
              <div aria-hidden="true" className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teal/30 blur-3xl" />
              <h3 className="relative font-display text-lg font-semibold">Reach us directly</h3>
              <ul className="relative mt-6 space-y-5">
                {DETAILS.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15"><Icon size={18} /></span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/60">{label}</p>
                      <p className="font-medium text-white">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-surface flex items-center justify-between p-5">
              <span className="text-sm font-medium text-slate/70 dark:text-white/70">Follow along</span>
              <div className="flex gap-2">
                {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social profile" className="grid h-10 w-10 place-items-center rounded-full border border-line text-slate/55 transition-all dark:border-white/15 dark:text-white/65 hover:-translate-y-0.5 hover:border-plum hover:bg-plum hover:text-white"><Icon size={16} /></a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
