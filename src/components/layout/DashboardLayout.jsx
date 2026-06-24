import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { accentFor } from '@/config/access';
import { NotificationBell } from '@/components/dash/NotificationBell';
import { ProfileMenu } from '@/components/dash/ProfileMenu';
import { initials } from '@/utils/format';
import { cn } from '@/utils/cn';
import { users as seedUsers } from '@/data/seed';

const ACTIVE_USERS = seedUsers.slice(0, 5);

// Per-role accent (brand palette only) — gives each workspace a distinct identity.
const ACCENTS = {
  plum: { grad: 'from-plum to-plum-dark', active: 'text-plum', avatar: 'bg-plum' },
  magenta: { grad: 'from-magenta to-plum-dark', active: 'text-magenta', avatar: 'bg-magenta' },
  teal: { grad: 'from-teal to-plum-dark', active: 'text-teal-soft', avatar: 'bg-teal' },
};

/**
 * Shared institution dashboard shell: a plum-gradient profile sidebar +
 * a clean topbar. navItems: [{ to, label, icon }] (absolute paths).
 */
export function DashboardLayout({ navItems, roleLabel, children }) {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const accent = ACCENTS[accentFor(role)] || ACCENTS.plum;

  const Sidebar = (
    <div className={cn('flex h-full flex-col bg-gradient-to-b text-white', accent.grad)}>
      {/* Profile card */}
      <div className="px-5 pb-6 pt-7 text-center">
        <div className="relative mx-auto h-16 w-16">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-xl font-semibold ring-4 ring-white/10">
            {initials(user?.fullName || 'U')}
          </div>
          <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-plum bg-teal" title="Online" />
        </div>
        <p className="mt-3 text-sm font-semibold">{user?.fullName}</p>
        <p className="truncate text-xs text-white/55">{user?.email}</p>
        <span className="mt-2 inline-block rounded-full bg-white/15 px-3 py-0.5 text-[11px] font-medium uppercase tracking-wider text-white/90">
          {roleLabel || role}
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                isActive ? `bg-white ${accent.active} shadow-sm` : 'text-white/75 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Active users */}
      <div className="mx-3 mt-4 rounded-xl bg-white/[0.06] px-3.5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Active now</p>
        <div className="mt-2 flex items-center">
          {ACTIVE_USERS.map((u, i) => (
            <span
              key={u.id}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-[10px] font-semibold ring-2 ring-plum"
              style={{ marginLeft: i ? -8 : 0 }}
              title={u.name}
            >
              {initials(u.name)}
            </span>
          ))}
          <span className="ml-2 text-xs text-white/55">+12</span>
        </div>
      </div>

      <button
        onClick={logout}
        className="m-3 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-[18px] w-[18px]" /> Sign out
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-64 shrink-0 p-3 lg:block">
        <div className="sticky top-3 h-[calc(100vh-1.5rem)] overflow-hidden rounded-3xl shadow-float">{Sidebar}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 p-3">
            <div className="h-full overflow-hidden rounded-3xl">{Sidebar}</div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 sm:px-6">
          <button
            className="rounded-lg p-2 text-slate hover:bg-white lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="relative hidden flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-slate/50" />
            <input
              placeholder="Search…"
              aria-label="Search"
              className="w-full max-w-xs rounded-full border border-line bg-white py-2 pl-10 pr-4 text-sm placeholder-slate/45 focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/15"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
            <ProfileMenu avatarClass={accent.avatar} />
          </div>
        </header>

        <main className="flex-1 px-4 pb-8 sm:px-6">
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
