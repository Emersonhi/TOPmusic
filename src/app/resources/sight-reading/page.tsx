'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLang } from '@/context/LanguageContext';

export default function SightReadingPage() {
  const { lang } = useLang();

  const hero = {
    en: { eyebrow: 'Practice Tool', title: 'Note Explorer', sub: 'Train your note-reading skills on the treble and bass clef. Choose your difficulty, set a timer, and challenge yourself.' },
    fr: { eyebrow: 'Outil de pratique', title: 'Explorateur de Notes', sub: 'Entraîne ta lecture de notes en clé de sol et de fa. Choisis ton niveau, règle le minuteur et relève le défi.' },
  };
  const tr = hero[lang];

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>

        {/* Hero */}
        <div className="py-16 px-6 text-center" style={{ background: 'var(--surface)' }}>
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>{tr.eyebrow}</p>
          <h1 className="text-5xl font-display mb-4" style={{ color: 'var(--ivory)' }}>{tr.title}</h1>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-xl mx-auto font-ui" style={{ color: 'var(--mist)' }}>{tr.sub}</p>
        </div>

        {/* Game iframe */}
        <div className="w-full" style={{ background: 'var(--ink)' }}>
          <iframe
            src="/note-explorer.html"
            className="w-full border-0"
            style={{ minHeight: '900px', display: 'block' }}
            title="TOPmusic Note Explorer"
          />
        </div>

      </main>
      <Footer />
    </>
  );
}
