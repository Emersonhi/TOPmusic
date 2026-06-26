'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, FileMusic, ArrowRight, X } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { shopPageT } from '@/translations';
import dynamic from 'next/dynamic';

// Load viewer only client-side (OSMD uses browser APIs)
const SheetMusicViewer = dynamic(() => import('@/components/SheetMusicViewer'), { ssr: false });

type Sheet = { title: string; level: string; image?: string; musicxml?: string; file?: string };

// ── Add sheets here ──────────────────────────────────────────────────────────
const SHEETS: Record<string, Sheet[]> = {
  piano: [
    { title: 'Holiday Time', level: 'Beginner', musicxml: '/holiday-time.mxl', file: '/holiday-time.pdf' },
  ],
  guitar: [],
  voice: [],
  theory: [],
  drums: [],
  production: [],
};
// ─────────────────────────────────────────────────────────────────────────────

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLang();
  const tr = shopPageT[lang];
  const [active, setActive] = useState<Sheet | null>(null);

  const category = tr.categories.find(c => c.id === id);
  if (!category) {
    return (
      <>
        <Navbar />
        <main style={{ background: 'var(--ink)', paddingTop: '80px', minHeight: '60vh' }} className="flex items-center justify-center">
          <div className="text-center">
            <p className="font-ui text-xl mb-6" style={{ color: 'var(--mist)' }}>Category not found.</p>
            <Link href="/shop" className="font-ui text-sm tracking-widest uppercase" style={{ color: 'var(--gold)' }}>← Back to Shop</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const categorySheets = SHEETS[id] || [];
  const emptyLabel   = lang === 'fr' ? 'Les partitions arrivent bientôt.' : 'Sheet music coming soon.';
  const backLabel    = lang === 'fr' ? 'Retour à la boutique' : 'Back to Shop';
  const levelLabel   = lang === 'fr' ? 'Niveau' : 'Level';
  const openLabel    = lang === 'fr' ? 'Ouvrir' : 'Open';
  const downloadLabel = lang === 'fr' ? 'Télécharger PDF' : 'Download PDF';
  const closeLabel   = lang === 'fr' ? 'Fermer' : 'Close';

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>

        {/* Back */}
        <div className="max-w-6xl mx-auto px-6 pt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-ui text-sm tracking-widest uppercase transition-colors duration-200"
            style={{ color: 'var(--mist)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; }}
          >
            <ArrowLeft size={14} /> {backLabel}
          </Link>
        </div>

        {/* Header */}
        <div className="py-14 px-6 text-center" style={{ background: 'var(--surface)', marginTop: '24px' }}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: `${category.color}20` }}>
            <FileMusic size={26} style={{ color: category.color }} />
          </div>
          <h1 className="text-5xl font-display mb-3" style={{ color: 'var(--ivory)' }}>{category.label}</h1>
          <div className="w-16 mx-auto my-4" style={{ height: '2px', background: category.color }} />
          <p className="max-w-lg mx-auto font-ui" style={{ color: 'var(--mist)' }}>{category.desc}</p>
        </div>

        {/* Sheet viewer modal */}
        {active && (
          <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(13,11,15,0.97)' }}>
            {/* Modal toolbar */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              <div>
                <p className="font-display text-lg" style={{ color: 'var(--ivory)' }}>{active.title}</p>
                <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{levelLabel}: {active.level}</p>
              </div>
              <div className="flex items-center gap-3">
                {active.file && (
                  <a
                    href={active.file}
                    download
                    className="px-4 py-2 rounded-lg font-ui text-xs tracking-widest uppercase transition-all duration-200"
                    style={{ background: `${category.color}20`, color: category.color, border: `1px solid ${category.color}30` }}
                  >
                    {downloadLabel}
                  </a>
                )}
                <button
                  onClick={() => setActive(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-xs tracking-widest uppercase transition-all duration-200"
                  style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.2)' }}
                >
                  <X size={14} /> {closeLabel}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {active.musicxml ? (
                <SheetMusicViewer src={active.musicxml} color={category.color} />
              ) : active.file ? (
                <iframe
                  src={active.file}
                  className="w-full rounded-2xl"
                  style={{ height: 'calc(100vh - 120px)', border: 'none' }}
                  title={active.title}
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="font-ui" style={{ color: 'var(--mist)' }}>No file available.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sheets grid */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {categorySheets.length === 0 ? (
            <div className="text-center py-24 rounded-2xl" style={{ background: 'var(--surface-2)', border: `1px solid ${category.color}20` }}>
              <FileMusic size={48} style={{ color: category.color, opacity: 0.3, margin: '0 auto 16px' }} />
              <p className="font-ui" style={{ color: 'var(--mist)' }}>{emptyLabel}</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl font-ui text-sm tracking-widest uppercase transition-all duration-200"
                style={{ background: `${category.color}20`, color: category.color, border: `1px solid ${category.color}30` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${category.color}35`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${category.color}20`; }}
              >
                {lang === 'fr' ? 'Suggérer une partition' : 'Suggest a Sheet'} <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorySheets.map((sheet, i) => (
                <button
                  key={i}
                  onClick={() => setActive(sheet)}
                  className="p-6 rounded-2xl flex flex-col text-left transition-all duration-200"
                  style={{ background: 'var(--surface-2)', border: `1px solid ${category.color}25` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${category.color}60`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${category.color}25`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  {sheet.image ? (
                    <div className="w-full h-44 rounded-xl mb-4 overflow-hidden" style={{ background: '#fff' }}>
                      <img src={sheet.image} alt={sheet.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-44 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${category.color}10`, border: `1px dashed ${category.color}40` }}>
                      <FileMusic size={40} style={{ color: category.color, opacity: 0.5 }} />
                    </div>
                  )}
                  <h3 className="font-ui font-semibold mb-1 leading-snug" style={{ color: 'var(--ivory)' }}>{sheet.title}</h3>
                  <span className="text-xs font-ui mb-4" style={{ color: 'var(--mist)' }}>{levelLabel}: {sheet.level}</span>
                  <span className="mt-auto text-xs font-ui tracking-widest uppercase flex items-center gap-1" style={{ color: category.color }}>
                    {openLabel} <ArrowRight size={12} />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </>
  );
}
