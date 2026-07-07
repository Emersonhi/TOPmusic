'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { resourcesPageT } from '@/translations';

export default function ResourcesPage() {
  const { lang } = useLang();
  const tr = resourcesPageT[lang];

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

        {/* Resource list */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tr.items.map(item => (
              <Link
                key={item.id}
                href={`/resources/${item.id}`}
                className="p-6 rounded-2xl transition-all duration-200 group"
                style={{ background: 'var(--surface-2)', border: `1px solid ${item.color}25` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${item.color}60`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${item.color}25`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}20` }}>
                    <BookOpen size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg mb-1" style={{ color: 'var(--ivory)' }}>{item.label}</h3>
                    <p className="text-sm font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-4 pt-4" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
                  <span className="text-xs font-ui tracking-widest uppercase flex items-center gap-1 transition-all duration-200" style={{ color: item.color }}>
                    {lang === 'fr' ? 'Ouvrir' : 'Open'} <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
