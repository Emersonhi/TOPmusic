import MobileNav from '@/components/MobileNav';
import MobileHeader from '@/components/MobileHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ink)' }}>
      <MobileHeader />
      <main className="flex-1 px-4 py-4 pb-28 max-w-2xl mx-auto w-full">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
