import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, User, ArrowRight, Mail, Check } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useData } from '@/features/data/DataContext';
import { Modal, Button, Input, useToast } from '@/components/ui';
import { MeshBlobs, GridOverlay } from '@/components/marketing/Backdrops';
import { inr } from '@/utils/format';
import xebiaLogo from '@/assets/landing/logo.png';

function Checkout({ course, onClose, onConfirm }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <Modal
      open
      onClose={onClose}
      title="Enrol in this course"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onConfirm(form)}>Pay {inr(course.price)} &amp; enrol</Button>
        </>
      }
    >
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-paper px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-ink">{course.name}</p>
          <p className="text-xs text-slate/60">{course.code}</p>
        </div>
        <span className="font-display text-lg font-bold text-plum">{inr(course.price)}</span>
      </div>
      <div className="space-y-4">
        <Input label="Full name" value={form.name} onChange={set('name')} placeholder="Your name" />
        <div className="relative">
          <Mail size={16} className="pointer-events-none absolute left-3 top-9 text-slate/40" />
          <Input label="Gmail" type="email" value={form.email} onChange={set('email')} className="pl-9" placeholder="you@gmail.com" />
        </div>
        <p className="flex items-center gap-1.5 text-xs text-slate/55">
          <Check size={12} className="text-teal" /> Your account is created on purchase — sign in any time with this email.
        </p>
      </div>
    </Modal>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, role, loginAs } = useAuth();
  const { db, userById, studentSubjects, enrollInCourse } = useData();
  const [checkout, setCheckout] = useState(null);

  const isStudent = isAuthenticated && role === 'Student';

  const onEnrol = (course) => {
    if (isStudent) {
      enrollInCourse('s1', course.id);
      toast.success(`Enrolled in ${course.name}`);
      navigate('/student/subjects');
      return;
    }
    setCheckout(course);
  };

  const confirmPurchase = ({ name, email }) => {
    if (!email) return toast.error('Enter your Gmail to continue');
    // Demo: purchase creates the student session, then enrols the course.
    const { user } = loginAs('Student');
    enrollInCourse(user.id, checkout.id);
    setCheckout(null);
    toast.success(`Payment successful — welcome${name ? `, ${name.split(' ')[0]}` : ''}!`);
    navigate('/student/subjects');
  };

  const enrolledIds = isStudent ? studentSubjects('s1').map((s) => s.id) : [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <MeshBlobs className="opacity-40" />
      <GridOverlay />

      <header className="relative z-10 mx-auto flex max-w-container items-center justify-between px-6 py-4">
        <Link to="/" aria-label="Xebia home"><img src={xebiaLogo} alt="Xebia" className="h-16 w-auto object-contain" /></Link>
        <Link to="/login" className="btn-primary px-5 py-2.5 text-sm">Sign in</Link>
      </header>

      <section className="relative z-10 mx-auto max-w-container px-6 pb-20 pt-6">
        <span className="eyebrow"><BookOpen size={13} /> Course catalog</span>
        <h1 className="display-2 mt-4">Courses built by <span className="text-gradient">Xebia</span></h1>
        <p className="lede mt-3 max-w-xl">Pick a course, enrol with your Gmail, and start learning. Your account is created the moment you purchase.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {db.subjects.map((c, i) => {
            const teacher = userById(c.teacherId);
            const owned = enrolledIds.includes(c.id);
            return (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex flex-col rounded-3xl border border-line/70 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-plum/[0.07] text-plum"><BookOpen size={22} /></span>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{c.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate/70"><User size={14} /> {teacher?.name}</p>
                <p className="mt-3 text-xs text-slate/55">{c.code}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4">
                  <span className="font-display text-xl font-bold text-ink">{inr(c.price)}</span>
                  {owned ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-soft"><Check size={15} /> Enrolled</span>
                  ) : (
                    <Button size="sm" onClick={() => onEnrol(c)}>Enrol <ArrowRight size={15} /></Button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {checkout && <Checkout course={checkout} onClose={() => setCheckout(null)} onConfirm={confirmPurchase} />}
    </div>
  );
}
