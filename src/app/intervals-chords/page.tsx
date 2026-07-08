'use client';
import { useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLang } from '@/context/LanguageContext';

export default function IntervalsChordsPage() {
  const { lang } = useLang();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const send = () => iframe.contentWindow?.postMessage({ lang }, '*');
    if (iframe.contentDocument?.readyState === 'complete') {
      send();
    } else {
      iframe.addEventListener('load', send, { once: true });
    }
  }, [lang]);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', background: 'var(--ink)' }}>
        <iframe
          ref={iframeRef}
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
