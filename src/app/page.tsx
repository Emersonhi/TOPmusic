'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Music2, ChevronDown, Star, Play, ArrowRight,
  Piano, Mic2, Guitar, Drum, Headphones, Users,
  Clock, Award, Heart, ChevronRight, ChevronLeft,
  Check, Quote
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLang } from '@/context/LanguageContext';
import { t } from '@/translations';

const programIcons = [Piano, Guitar, Drum, Mic2, Headphones, Users];
const programColors = ['#8B6FD4', '#5B9ED4', '#D4845B', '#5BD4A8', '#D4C45B', '#D45B8B'];
const programIds = ['piano', 'guitar', 'drums', 'voice', 'production', 'ensembles'];
const pillarIcons = [Award, Heart, Clock, Music2];
const facultyColors = ['#8B6FD4', '#5B9ED4', '#5BD4A8', '#D4845B'];
const facultyInitials = ['EM', 'MR', 'SC', 'JW'];

function Hero() {
  const [visible, setVisible] = useState(false);
  const { lang } = useLang();
  const tr = t[lang].hero;

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--ink)' }}>
      <div className="absolute inset-0">
        <img src="/key.jpg" alt="" className="w-full h-full object-cover" style={{ opacity: 0.18 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,11,15,0.5) 0%, rgba(13,11,15,0.7) 60%, var(--ink) 100%)' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute left-0 right-0" style={{ top: `${30 + i * 6}%`, height: '1px', background: `rgba(201,168,76,${0.03 + i * 0.005})` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full font-ui text-xs tracking-[0.25em] uppercase" style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.6s ease' }}>
          <Music2 size={12} />
          {tr.badge}
        </div>

        <h1 className="font-display leading-none mb-6" style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)', color: 'var(--ivory)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease 0.1s', letterSpacing: '-0.02em' }}>
          {tr.headline1}<br />
          <span style={{ background: 'linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {tr.headline2}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-10 font-ui" style={{ color: 'var(--mist)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease 0.2s' }}>
          {tr.sub}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease 0.3s' }}>
          <Link href="/enroll" className="group px-8 py-4 rounded font-ui text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all duration-300" style={{ background: 'var(--gold)', color: 'var(--ink)', fontWeight: 600 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold-light)'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 30px rgba(201,168,76,0.4)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
            {tr.cta1} <ArrowRight size={16} />
          </Link>
          <Link href="/#programs" className="px-8 py-4 rounded font-ui text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all duration-300" style={{ border: '1px solid rgba(201,168,76,0.4)', color: 'var(--ivory)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.background = 'rgba(201,168,76,0.08)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.4)'; el.style.background = 'transparent'; }}>
            <Play size={14} /> {tr.cta2}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.15)', opacity: visible ? 1 : 0, transition: 'all 1s ease 0.5s' }}>
          {tr.stats.map((s, i) => (
            <div key={i} className="py-6 px-4 text-center" style={{ background: 'rgba(30,26,34,0.8)' }}>
              <div className="text-3xl font-display mb-1" style={{ color: 'var(--gold)' }}>{s.n}</div>
              <div className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--mist)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <a href="#programs" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{ color: 'var(--gold-muted)' }}>
        <span className="text-xs font-ui tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </a>
    </section>
  );
}

function Programs() {
  const { lang } = useLang();
  const tr = t[lang].programs;

  return (
    <section id="programs" className="py-28 px-6" style={{ background: 'var(--ink)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>{tr.eyebrow}</p>
          <h2 className="text-5xl font-display mb-5" style={{ color: 'var(--ivory)' }}>{tr.title}</h2>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-xl mx-auto font-ui" style={{ color: 'var(--mist)' }}>{tr.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tr.items.map((prog, i) => {
            const Icon = programIcons[i];
            const color = programColors[i];
            return (
              <Link key={i} href={`/enroll?program=${programIds[i]}`} className="block p-8 rounded-xl transition-all duration-300" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.35)'; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.1)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ background: `${color}20` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-xl font-display mb-3" style={{ color: 'var(--ivory)' }}>{prog.title}</h3>
                <p className="text-sm leading-relaxed mb-5 font-ui" style={{ color: 'var(--mist)' }}>{prog.description}</p>
                <div className="flex flex-wrap gap-2">
                  {prog.levels.map(l => (
                    <span key={l} className="px-3 py-1 rounded-full text-xs font-ui tracking-wide" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{l}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/programs" className="inline-flex items-center gap-2 px-8 py-4 rounded font-ui text-sm tracking-widest uppercase transition-all duration-200" style={{ border: '1px solid var(--gold-muted)', color: 'var(--gold)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            {tr.viewAll} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function About() {
  const { lang } = useLang();
  const tr = t[lang].about;

  return (
    <section id="about" className="py-28 px-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>{tr.eyebrow}</p>
            <h2 className="text-5xl font-display leading-tight mb-6" style={{ color: 'var(--ivory)' }}>
              {tr.headline.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>
            <div className="gold-line mb-6" style={{ width: '80px' }} />
            <p className="font-ui leading-relaxed mb-4" style={{ color: 'var(--mist)' }}>{tr.p1}</p>
            <p className="font-ui leading-relaxed mb-8" style={{ color: 'var(--mist)' }}>{tr.p2}</p>
            <Link href="/enroll" className="inline-flex items-center gap-2 font-ui text-sm tracking-widest uppercase transition-colors duration-200" style={{ color: 'var(--gold)' }}>
              {tr.cta} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            <div className="relative w-full rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
              <img
                src="/piano-student.jpg"
                alt="Student learning piano at TOPmusic"
                className="w-full h-full object-cover rounded-xl"
                style={{ maxHeight: '340px' }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tr.pillars.map((p, i) => {
                const Icon = pillarIcons[i];
                return (
                  <div key={i} className="p-6 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(201,168,76,0.1)' }}>
                      <Icon size={18} style={{ color: 'var(--gold)' }} />
                    </div>
                    <h4 className="font-display text-lg mb-2" style={{ color: 'var(--ivory)' }}>{p.title}</h4>
                    <p className="text-sm font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faculty() {
  const { lang } = useLang();
  const tr = t[lang].faculty;

  return (
    <section id="faculty" className="py-28 px-6" style={{ background: 'var(--ink)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>{tr.eyebrow}</p>
          <h2 className="text-5xl font-display mb-5" style={{ color: 'var(--ivory)' }}>{tr.title}</h2>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-xl mx-auto font-ui" style={{ color: 'var(--mist)' }}>{tr.sub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tr.members.map((f, i) => (
            <div key={i} className="p-6 rounded-xl text-center transition-all duration-300" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.35)'; el.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.1)'; el.style.transform = 'translateY(0)'; }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-display font-bold" style={{ background: `${facultyColors[i]}20`, color: facultyColors[i], border: `2px solid ${facultyColors[i]}40` }}>{facultyInitials[i]}</div>
              <h3 className="font-display text-lg mb-1" style={{ color: 'var(--ivory)' }}>{f.name}</h3>
              <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>{f.title}</p>
              <p className="text-sm font-ui leading-relaxed mb-4" style={{ color: 'var(--mist)' }}>{f.bio}</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-ui" style={{ background: `${facultyColors[i]}15`, color: facultyColors[i], border: `1px solid ${facultyColors[i]}30` }}>{f.specialty}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const { lang } = useLang();
  const tr = t[lang].testimonials;
  const items = tr.items;

  useEffect(() => { setIdx(0); }, [lang]);

  const prev = () => setIdx(i => (i - 1 + items.length) % items.length);
  const next = () => setIdx(i => (i + 1) % items.length);
  const item = items[idx];

  return (
    <section className="py-28 px-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>{tr.eyebrow}</p>
        <h2 className="text-5xl font-display mb-12" style={{ color: 'var(--ivory)' }}>{tr.title}</h2>
        <div className="p-10 rounded-2xl relative" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <Quote size={40} style={{ color: 'rgba(201,168,76,0.2)', margin: '0 auto 24px' }} />
          <p className="text-xl font-display leading-relaxed mb-8" style={{ color: 'var(--ivory)' }}>&ldquo;{item.quote}&rdquo;</p>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--gold)" style={{ color: 'var(--gold)' }} />)}
          </div>
          <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{item.name}</p>
          <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>{item.role}</p>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200" style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--mist)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.3)'; el.style.color = 'var(--mist)'; }}>
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2 items-center">
            {items.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className="rounded-full transition-all duration-200" style={{ width: i === idx ? 24 : 8, height: 8, background: i === idx ? 'var(--gold)' : 'rgba(201,168,76,0.3)' }} />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200" style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--mist)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.3)'; el.style.color = 'var(--mist)'; }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { lang } = useLang();
  const tr = t[lang].faq;

  useEffect(() => { setOpen(null); }, [lang]);

  return (
    <section id="faq" className="py-28 px-6" style={{ background: 'var(--ink)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>{tr.eyebrow}</p>
          <h2 className="text-5xl font-display" style={{ color: 'var(--ivory)' }}>{tr.title}</h2>
        </div>
        <div className="space-y-3">
          {tr.items.map((faq, i) => (
            <div key={i} className="rounded-xl overflow-hidden transition-all duration-200" style={{ border: `1px solid ${open === i ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)'}`, background: 'var(--surface-2)' }}>
              <button className="w-full flex justify-between items-center p-6 text-left" onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-display text-lg pr-4" style={{ color: 'var(--ivory)' }}>{faq.q}</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200" style={{ background: open === i ? 'var(--gold)' : 'rgba(201,168,76,0.15)', transform: open === i ? 'rotate(45deg)' : 'rotate(0)' }}>
                  <span style={{ color: open === i ? 'var(--ink)' : 'var(--gold)', fontSize: 16, lineHeight: 1 }}>+</span>
                </div>
              </button>
              {open === i && <div className="px-6 pb-6"><p className="font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>{faq.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  const { lang } = useLang();
  const tr = t[lang].cta;

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--ink) 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)' }} />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl font-display mb-5" style={{ color: 'var(--ivory)' }}>{tr.headline1} <span style={{ color: 'var(--gold)' }}>{tr.headline2}</span></h2>
        <p className="max-w-xl mx-auto font-ui mb-10" style={{ color: 'var(--mist)' }}>{tr.sub}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/enroll" className="px-10 py-4 rounded font-ui text-sm tracking-[0.15em] uppercase transition-all duration-300" style={{ background: 'var(--gold)', color: 'var(--ink)', fontWeight: 600 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold-light)'; el.style.boxShadow = '0 8px 30px rgba(201,168,76,0.4)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold)'; el.style.boxShadow = 'none'; }}>
            {tr.btn1}
          </Link>
          <Link href="/contact" className="px-10 py-4 rounded font-ui text-sm tracking-[0.15em] uppercase transition-all duration-200" style={{ border: '1px solid rgba(201,168,76,0.4)', color: 'var(--ivory)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)'; }}>
            {tr.btn2}
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {tr.perks.map(p => (
            <div key={p} className="flex items-center gap-2">
              <Check size={14} style={{ color: 'var(--gold)' }} />
              <span className="text-sm font-ui" style={{ color: 'var(--mist)' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Programs />
      <About />
      <Faculty />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
    </>
  );
}
