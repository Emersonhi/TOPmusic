'use client';
import { use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, FileMusic, ArrowRight } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { shopPageT } from '@/translations';

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLang();
  const tr = shopPageT[lang];

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

  // Sheets can be added here per category id
  const sheets: Record<string, { title: string; level: string; image?: string; file?: string }[]> = {
    piano: [
      { title: 'Holiday Time', level: 'Beginner', file: '/holiday-time.pdf' },
    ],
    guitar: [],
    voice: [],
    theory: [],
    drums: [],
    production: [],
  };

  const categorySheets = sheets[id] || [];

  const emptyLabel = lang === 'fr' ? 'Les partitions pour cette catégorie arrivent bientôt.' : 'Sheet music for this category coming soon.';
  const backLabel = lang === 'fr' ? 'Retour à la boutique' : 'Back to Shop';
  const levelLabel = lang === 'fr' ? 'Niveau' : 'Level';

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>

        {/* Back link */}
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
              {categorySheets.map((sheet, i) => {
                const CardTag = sheet.file ? 'a' : 'div';
                const cardProps = sheet.file ? { href: sheet.file, target: '_blank', rel: 'noopener noreferrer' } : {};
                return (
                  <CardTag
                    key={i}
                    {...cardProps}
                    className="p-6 rounded-2xl flex flex-col transition-all duration-200"
                    style={{ background: 'var(--surface-2)', border: `1px solid ${category.color}25`, cursor: sheet.file ? 'pointer' : 'default', textDecoration: 'none' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { if (sheet.file) { (e.currentTarget as HTMLElement).style.borderColor = `${category.color}60`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; } }}
                    onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { if (sheet.file) { (e.currentTarget as HTMLElement).style.borderColor = `${category.color}25`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; } }}
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
                    <h3 className="font-ui font-semibold mb-2 leading-snug" style={{ color: 'var(--ivory)' }}>{sheet.title}</h3>
                    <span className="text-xs font-ui mb-3" style={{ color: 'var(--mist)' }}>{levelLabel}: {sheet.level}</span>
                    {sheet.file && (
                      <span className="mt-auto text-xs font-ui tracking-widest uppercase flex items-center gap-1" style={{ color: category.color }}>
                        {lang === 'fr' ? 'Ouvrir le PDF' : 'Open PDF'} <ArrowRight size={12} />
                      </span>
                    )}
                  </CardTag>
                );
              })}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </>
  );
}
