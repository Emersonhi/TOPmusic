'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function IntervalsChordsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', background: 'var(--ink)' }}>
        <iframe
          src="/intervals-chords.html"
          className="w-full"
          style={{ height: 'calc(100vh - 80px)', border: 'none', display: 'block' }}
          title="Intervals & Chords"
        />
      </main>
      <Footer />
    </>
  );
}
