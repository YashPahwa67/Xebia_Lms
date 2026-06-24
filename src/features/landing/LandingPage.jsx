import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    </div>
  );
}
