'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Check } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { programsPageT } from '@/translations';

const programIds = ['piano', 'guitar', 'drums', 'voice', 'production', 'ensembles'];

const colors = ['#8B6FD4', '#5B9ED4', '#D4845B', '#5BD4A8', '#D4C45B', '#D45B8B'];

export default function ProgramsPage() {
  const { lang } = useLang();
  const tr = programsPageT[lang];

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>
        <div className="py-20 px-6 text-center" style={{ background: 'var(--surface)' }}>
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>{tr.eyebrow}</p>
          <h1 className="text-5xl font-display mb-4" style={{ color: 'var(--ivory)' }}>{tr.title}</h1>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-xl mx-auto font-ui" style={{ color: 'var(--mist)' }}>{tr.sub}</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
          {tr.programs.map((prog, i) => {
            const color = colors[i];
            return (
              <div key={prog.id} id={prog.id} className="p-8 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }} >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-10 rounded-full" style={{ background: color }} />
                      <div>
                        <h2 className="text-3xl font-display" style={{ color: 'var(--ivory)' }}>{prog.title}</h2>
                        <p className="font-ui text-sm italic" style={{ color }}>{prog.tagline}</p>
                      </div>
                    </div>
                    <p className="font-ui leading-relaxed mb-6" style={{ color: 'var(--mist)' }}>{prog.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>{tr.stylesLabel}</p>
                        <ul className="space-y-2">
                          {prog.styles.map(s => (
                            <li key={s} className="flex items-center gap-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
                              <Check size={12} style={{ color, flexShrink: 0 }} /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>{tr.levelsLabel}</p>
                        <ul className="space-y-2">
                          {prog.levels.map(l => (
                            <li key={l} className="flex items-center gap-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} /> {l}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="p-5 rounded-xl" style={{ background: 'var(--surface-3)', border: `1px solid ${color}30` }}>
                      <p className="text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>{tr.pricingLabel}</p>
                      <p className="text-2xl font-display font-bold mb-1" style={{ color }}>{prog.pricing}</p>
                      <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{tr.pricingNote}</p>
                      <div className="gold-line my-4" />
                      <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{tr.firstLesson}</p>
                    </div>
                    <Link href={`/enroll?program=${programIds[i]}`}
                      className="mt-4 py-4 rounded-xl font-ui text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200"
                      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}35`; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}20`; }}>
                      {tr.startBtn(prog.title)} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
