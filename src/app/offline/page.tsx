import Image from 'next/image';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--ink)' }}>
      <Image src="/logo.webp" alt="TOPmusic" width={64} height={64} className="h-16 w-16 object-contain mb-6 opacity-60" />
      <h1 className="text-2xl font-display font-bold mb-2" style={{ color: 'var(--ivory)' }}>You're offline</h1>
      <p className="text-sm font-ui mb-8" style={{ color: 'var(--mist)' }}>
        Check your internet connection and try again.
      </p>
      <Link href="/dashboard"
        className="px-6 py-3 rounded-xl font-ui text-sm font-bold"
        style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
        Try again
      </Link>
    </main>
  );
}
