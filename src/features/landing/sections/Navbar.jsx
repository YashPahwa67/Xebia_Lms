import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { MagneticButton } from '@/components/marketing/MagneticButton';
import xebiaLogo from '@/assets/landing/logo.png';

const LINKS = [
  { label: 'Experience', href: '#features' },
  { label: 'Journey', href: '#timeline' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  // Navigate home; if already there, smooth-scroll back to the top.
  const goHome = () => {
    setOpen(false);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`relative flex w-full max-w-container items-center justify-between rounded-full px-4 py-2 transition-all duration-500 ${
          scrolled ? 'glass shadow-float' : 'border border-transparent bg-transparent'
        }`}
        aria-label="Primary"
      >
        <button onClick={goHome} className="flex items-center" aria-label="Xebia home">
          <img src={xebiaLogo} alt="Xebia" className="-my-4 h-28 w-auto object-contain" />
        </button>

        {/* Centered nav links, independent of side widths */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-5 py-2.5 text-base font-medium text-ink/70 transition-colors hover:bg-ink/[0.04] hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="hidden rounded-full px-5 py-2.5 text-base font-medium text-ink/70 transition-colors hover:text-plum sm:block"
          >
            Sign in
          </button>
          <MagneticButton
            onClick={() => navigate('/login')}
            className="btn-primary px-7 py-3 text-base shadow-glow"
          >
            Get started
          </MagneticButton>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-ink md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass absolute left-4 right-4 top-20 rounded-3xl p-4 shadow-float md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-ink/80 hover:bg-ink/[0.04]"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
