import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import xebiaLogo from '@/assets/landing/logo.png';

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Live Classes', href: '#features' },
      { label: 'Assessments', href: '#features' },
      { label: 'Analytics', href: '#features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Achievements', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
];

const CONTACTS = [
  { icon: Mail, value: 'hello@xebia.com', href: 'mailto:hello@xebia.com' },
  { icon: Phone, value: '+91 1234567890', href: 'tel:+911234567890' },
  { icon: MapPin, value: 'Somewhere in the world' },
];

const SOCIALS = [Facebook, Twitter, Linkedin];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink/[0.07] bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-plum/40 to-transparent"
      />

      <div className="shell py-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2.5fr]">
          {/* Brand block */}
          <div className="max-w-sm">
            <Link to="/" aria-label="Xebia home" className="-ml-3 -mt-8 inline-flex items-center">
              <img src={xebiaLogo} alt="Xebia" className="h-28 w-auto object-contain" />
            </Link>
            <p className="-mt-3 text-sm leading-relaxed text-ink/55">
              A premium learning platform for corporate and university training.
            </p>
            <ul className="mt-6 space-y-3">
              {CONTACTS.map(({ icon: Icon, value, href }) => (
                <li key={value}>
                  <span className="flex items-center gap-3 text-sm text-ink/60">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-plum/[0.06] text-plum">
                      <Icon size={15} />
                    </span>
                    {href ? (
                      <a href={href} className="transition-colors hover:text-plum">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns + newsletter */}
          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/40">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="group inline-flex items-center gap-1 text-sm text-ink/65 transition-colors hover:text-plum"
                      >
                        {l.label}
                        <ArrowRight
                          size={13}
                          className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink/[0.07]">
        <div className="shell flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-ink/45">© {new Date().getFullYear()} Xebia. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {SOCIALS.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social profile"
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/55 transition-all hover:-translate-y-0.5 hover:border-plum hover:bg-plum hover:text-white"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
