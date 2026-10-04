import MobileNav from '@/components/MobileNav';
import MobileHeader from '@/components/MobileHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile layout */}
      <div className="lg:hidden min-h-screen flex flex-col" style={{ background: 'var(--ink)' }}>
        <MobileHeader />
        <main className="flex-1 px-4 py-4 pb-28 max-w-2xl mx-auto w-full overflow-auto">
          {children}
        </main>
        <MobileNav />
      </div>

      {/* Desktop layout — children render their own full-page layout */}
      <div className="hidden lg:block">
        {children}
      </div>
    </>
  );
}
