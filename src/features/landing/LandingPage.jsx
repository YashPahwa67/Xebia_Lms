import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { ROLE_HOME } from '@/constants';
import { ScrollProgress } from '@/components/marketing/ScrollProgress';
import { Cursor } from '@/components/marketing/Cursor';
import { Noise } from '@/components/marketing/Backdrops';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import Stats from './sections/Stats';
import Features from './sections/Features';
import Timeline from './sections/Timeline';
import Testimonials from './sections/Testimonials';
import Faq from './sections/Faq';
import Contact from './sections/Contact';
import CtaSection from './sections/CtaSection';
import Footer from './sections/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  useSmoothScroll();

  // Authenticated users skip the marketing page.
  useEffect(() => {
    if (isAuthenticated && role && ROLE_HOME[role]) {
      navigate(ROLE_HOME[role], { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <ScrollProgress />
      <Cursor />
      <Noise />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Features />
        <Timeline />
        <Testimonials />
        <Faq />
        <Contact />
        <CtaSection />
      </main>
      <Footer />

      {/* Always-visible floating CTA to the public course catalog */}
      <motion.button
        onClick={() => navigate('/courses')}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="group fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3.5 text-sm font-semibold text-white shadow-float transition-colors hover:bg-plum-dark"
        aria-label="Explore courses"
      >
        <Sparkles size={16} className="text-white/90" />
        Explore courses
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </motion.button>
    </div>
  );
}
