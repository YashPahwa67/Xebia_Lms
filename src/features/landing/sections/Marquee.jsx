import { BookOpen, Video, Sparkles, Users, GraduationCap, ShieldCheck, BarChart3 } from 'lucide-react';

const ITEMS = [
  { icon: BookOpen, label: 'Course Authoring' },
  { icon: Video, label: 'Live Classes' },
  { icon: Sparkles, label: 'AI Assessments' },
  { icon: Users, label: 'Batches' },
  { icon: GraduationCap, label: 'Multi-tenant' },
  { icon: ShieldCheck, label: 'Role-based Access' },
  { icon: BarChart3, label: 'Progress Analytics' },
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section aria-label="Platform capabilities" className="border-y border-ink/[0.06] bg-white py-6">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-10 pr-10">
          {row.map(({ icon: Icon, label }, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2.5 text-ink/45">
              <Icon size={18} className="text-plum/70" />
              <span className="text-sm font-semibold tracking-tight">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
