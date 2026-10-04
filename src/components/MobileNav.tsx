'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calendar, User } from 'lucide-react';

const TABS = [
  { href: '/dashboard',         label: 'Home',    icon: Home },
  { href: '/dashboard/courses', label: 'Courses', icon: BookOpen },
  { href: '/dashboard?tab=book',label: 'Book',    icon: Calendar },
  { href: '/app/profile',       label: 'Profile', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
      <div className="flex">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href.split('?')[0]);
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-150"
              style={{ color: active ? 'var(--gold)' : 'var(--mist)' }}>
              <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
              <span className="text-[10px] font-ui tracking-wide" style={{ fontWeight: active ? 700 : 400 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
