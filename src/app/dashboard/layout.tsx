import MobileNav from '@/components/MobileNav';
import MobileHeader from '@/components/MobileHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Mobile-only header — hidden on desktop */}
      <MobileHeader />
      {/* Bottom padding on mobile for the nav bar; desktop handles its own spacing */}
      <div className="lg:pb-0 pb-24">
        {children}
      </div>
      {/* Mobile-only bottom nav */}
      <MobileNav />
    </div>
  );
}
