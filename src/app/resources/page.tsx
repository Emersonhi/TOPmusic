'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, BookOpen, Music2 } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

const tools = [
  {
    href: '/sight-reading',
    icon: Music2,
    color: '#8B6FD4',
    title: { en: 'Sight Reading', fr: 'Lecture de Notes' },
    desc: {
      en: 'Train your ability to read and name notes on the staff. Choose your clef, difficulty level, and timer — then name every note as fast as you can.',
      fr: "Entraînez votre capacité à lire et nommer les notes sur la portée. Choisissez votre clé, votre niveau de difficulté et le minuteur — puis nommez chaque note le plus vite possible.",
    },
  },
  {
    href: '/intervals-chords',
    icon: BookOpen,
    color: '#dd7634',
    title: { en: 'Intervals & Chords', fr: 'Intervalles & Accords' },
    desc: {
      en: 'A complete interactive reference for intervals, scales, triads, seventh chords, diatonic harmony, and inversions — across all twelve keys. Everything makes sound.',
      fr: "Une référence interactive complète sur les intervalles, les gammes, les triades, les accords de septième, l'harmonie diatonique et les renversements — dans les douze tonalités. Tout produit du son.",
    },
  },
];

export default function ResourcesPage() {
  const { lang } = useLang();

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px', minHeight: '100vh' }}>

        {/* Hero */}
        <div className="relative py-24 px-6 text-center overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(221,118,52,0.08) 0%, transparent 70%)',
          }} />
          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full" style={{ background: 'rgba(221,118,52,0.08)', border: '1px solid rgba(221,118,52,0.2)' }}>
              <BookOpen size={14} style={{ color: 'var(--gold)' }} />
              <span className="text-xs font-ui tracking-[0.3em] uppercase" style={{ color: 'var(--gold)' }}>
                {lang === 'fr' ? 'Outils pédagogiques' : 'Learning Tools'}
              </span>
            </div>
            <h1 className="text-5xl font-display mb-4" style={{ color: 'var(--ivory)' }}>
              {lang === 'fr' ? 'Ressources' : 'Resources'}
            </h1>
            <div className="gold-line w-24 mx-auto mb-5" />
            <p className="font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>
              {lang === 'fr'
                ? 'Des outils interactifs pour apprendre à lire la musique, explorer les intervalles et maîtriser les accords — à utiliser en complément de vos cours.'
                : 'Interactive tools to help you read music, explore intervals, and master chords — designed to complement your lessons.'}
            </p>
          </div>
        </div>

        {/* Tool cards */}
        <div className="max-w-4xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-8 rounded-2xl flex flex-col transition-all duration-200"
                style={{ background: 'var(--surface-2)', border: `1px solid ${tool.color}25` }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${tool.color}60`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${tool.color}25`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${tool.color}15` }}>
                  <Icon size={22} style={{ color: tool.color }} />
                </div>
                <h2 className="text-2xl font-display mb-3" style={{ color: 'var(--ivory)' }}>
                  {tool.title[lang]}
                </h2>
                <p className="font-ui leading-relaxed flex-1" style={{ color: 'var(--mist)', fontSize: '0.97rem' }}>
                  {tool.desc[lang]}
                </p>
                <div className="flex items-center gap-2 mt-6 font-ui text-sm tracking-widest uppercase" style={{ color: tool.color }}>
                  {lang === 'fr' ? 'Ouvrir' : 'Open'} <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>

      </main>
      <Footer />
    </>
  );
}
