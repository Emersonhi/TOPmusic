'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Users, ClipboardList, Calendar, MessageSquare, LogOut, Menu, X } from 'lucide-react';

export const ADMIN_EMAIL = 'info@topmusic.pro';

const NAV = [
  { href: '/admin',             label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/students',    label: 'Students',    icon: Users },
  { href: '/admin/enrollments', label: 'Enrollments', icon: ClipboardList },
  { href: '/admin/bookings',    label: 'Bookings',    icon: Calendar },
  { href: '/admin/contacts',    label: 'Contacts',    icon: MessageSquare },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push('/login');
      } else {
        setReady(true);
      }
    });
  }, [router]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : ''}`}>
      <div className="p-6 mb-2">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.webp" alt="TOP Music" width={36} height={36} className="h-9 w-9 object-contain" />
          <div>
            <p className="text-base font-display font-bold tracking-widest uppercase leading-tight" style={{ color: 'var(--ivory)' }}>
              TOP<span style={{ color: 'var(--gold)' }}>music</span>
            </p>
            <p className="text-xs font-ui tracking-[0.2em] uppercase" style={{ color: 'var(--gold)' }}>Admin CRM</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-ui text-sm transition-all duration-200"
              style={{ background: active ? 'rgba(201,168,76,0.15)' : 'transparent', color: active ? 'var(--gold)' : 'var(--mist)', fontWeight: active ? 600 : 400, borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent' }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-ui text-sm transition-all duration-200"
          style={{ color: 'var(--mist)', border: '1px solid rgba(201,168,76,0.2)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ivory)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; }}>
          <LogOut size={16} /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ink)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: 'var(--surface)', borderRight: '1px solid rgba(201,168,76,0.12)' }}>
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col" style={{ background: 'var(--surface)', borderRight: '1px solid rgba(201,168,76,0.12)' }}>
            <Sidebar mobile />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
          style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <button onClick={() => setOpen(true)} style={{ color: 'var(--ivory)' }}><Menu size={22} /></button>
          <span className="font-display font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--ivory)' }}>
            TOP<span style={{ color: 'var(--gold)' }}>music</span> Admin
          </span>
          <div className="w-6" />
        </div>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
