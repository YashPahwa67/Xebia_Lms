import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Send, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/marketing/Reveal';
import { AnimatedHeading } from '@/components/marketing/AnimatedHeading';
import { MagneticButton } from '@/components/marketing/MagneticButton';
import { useToast } from '@/components/ui/Toast';

const FIELDS = [
  { name: 'firstName', label: 'First name', type: 'text', half: true, required: true },
  { name: 'lastName', label: 'Last name', type: 'text', half: true, required: true },
  { name: 'email', label: 'Email', type: 'email', half: true, required: true },
  { name: 'phone', label: 'Phone', type: 'tel', half: true },
  { name: 'subject', label: 'Subject', type: 'text', required: true },
];

const DETAILS = [
  { icon: Mail, label: 'Email us', value: 'support@xebia.com', href: 'mailto:support@xebia.com' },
  { icon: Phone, label: 'Call us', value: '+91 00000 00000', href: 'tel:+910000000000' },
  { icon: MapPin, label: 'Visit us', value: 'Somewhere in the world' },
];

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' };
const inputCls =
  'w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder-ink/35 ' +
  'transition-all focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/15';

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks! We'll get back to you shortly.");
    setForm(EMPTY);
  };

  return (
    <section id="contact" className="relative scroll-mt-20 bg-ink/[0.015] py-24 sm:py-32">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow">Get in touch</span>
          </Reveal>
          <AnimatedHeading
            className="display-2 mt-5"
            lines={[[{ text: "Let's" }, { text: 'start' }, { text: 'a' }], [{ text: 'conversation', accent: true }]]}
          />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Form */}
          <Reveal className="card-surface p-6 sm:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
                    <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium text-ink/70">
                      {f.label}
                    </label>
                    <input
                      id={f.name}
                      type={f.type}
                      required={f.required}
                      value={form[f.name]}
                      onChange={set(f.name)}
                      placeholder={f.label}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink/70">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Tell us how we can help…"
                  className={`${inputCls} resize-y`}
                />
              </div>
              <MagneticButton type="submit" className="btn w-full bg-teal px-6 py-3.5 text-base text-white hover:bg-teal-soft sm:w-auto">
                Send your message <Send size={16} />
              </MagneticButton>
            </form>
          </Reveal>

          {/* Info panel */}
          <div className="flex flex-col gap-4">
            <Reveal delay={0.1} className="relative flex-1 overflow-hidden rounded-3xl bg-plum-gradient p-7 text-white">
              <div aria-hidden="true" className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teal/30 blur-3xl" />
              <h3 className="relative font-display text-lg font-semibold">Reach us directly</h3>
              <ul className="relative mt-6 space-y-5">
                {DETAILS.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-3.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/60">{label}</p>
                      {href ? (
                        <a href={href} className="font-medium text-white hover:underline">
                          {value}
                        </a>
                      ) : (
                        <p className="font-medium text-white">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.18} className="card-surface flex items-center justify-between p-5">
              <span className="text-sm font-medium text-ink/70">Follow along</span>
              <div className="flex gap-2">
                {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social profile"
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-ink/55 transition-all hover:-translate-y-0.5 hover:border-plum hover:bg-plum hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <a
                href="mailto:support@xebia.com"
                className="group flex items-center justify-between rounded-3xl border border-teal/30 bg-teal/[0.06] p-5 text-teal transition-colors hover:bg-teal/10"
              >
                <span className="text-sm font-semibold">Prefer email? Write to us</span>
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
