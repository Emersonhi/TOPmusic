'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TITLES: Record<string, string> = {
  '/dashboard': 'Home',
  '/dashboard/courses': 'My Courses',
  '/app/profile': 'Profile',
};

function titleFor(path: string) {
  if (TITLES[path]) return TITLES[path];
  if (path.startsWith('/dashboard/courses/')) return 'Course';
  return 'TOPmusic';
}

export default function MobileHeader() {
  const pathname = usePathname();
  const title = titleFor(pathname);

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        paddingTop: 'env(safe-area-inset-top)',
      }}>
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.webp" alt="TOPmusic" width={28} height={28} className="h-7 w-7 object-contain" />
      </Link>
      <p className="text-sm font-display font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2" style={{ color: 'var(--ivory)' }}>
        {title}
      </p>
      <div className="w-7" />
    </header>
  );
}
