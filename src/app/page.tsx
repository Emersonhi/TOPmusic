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

function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const stats = [
    { n: '500+', label: 'Active Students' },
    { n: '18', label: 'Master Teachers' },
    { n: '12', label: 'Years of Excellence' },
    { n: '6', label: 'Disciplines' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--ink)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute left-0 right-0" style={{ top: `${30 + i * 6}%`, height: '1px', background: `rgba(201,168,76,${0.03 + i * 0.005})` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full font-ui text-xs tracking-[0.25em] uppercase" style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.6s ease' }}>
          <Music2 size={12} />
          New York&apos;s Premier Music School
        </div>

        <h1 className="font-display leading-none mb-6" style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)', color: 'var(--ivory)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease 0.1s', letterSpacing: '-0.02em' }}>
          Where Music<br />
          <span style={{ background: 'linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Becomes Art.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-10 font-ui" style={{ color: 'var(--mist)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease 0.2s' }}>
          Piano, Guitar, Bass, Drums, Voice, and Music Production — taught by world-class artists with personalized methods for every age, every style, every dream.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease 0.3s' }}>
          <Link href="/enroll" className="group px-8 py-4 rounded font-ui text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all duration-300" style={{ background: 'var(--gold)', color: 'var(--ink)', fontWeight: 600 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold-light)'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 30px rgba(201,168,76,0.4)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
            Begin Your Journey <ArrowRight size={16} />
          </Link>
          <Link href="/#programs" className="px-8 py-4 rounded font-ui text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all duration-300" style={{ border: '1px solid rgba(201,168,76,0.4)', color: 'var(--ivory)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.background = 'rgba(201,168,76,0.08)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.4)'; el.style.background = 'transparent'; }}>
            <Play size={14} /> Explore Programs
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.15)', opacity: visible ? 1 : 0, transition: 'all 1s ease 0.5s' }}>
          {stats.map((s, i) => (
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

const programs = [
  { icon: Piano, title: 'Piano', description: 'Classical to jazz, beginner to conservatory level. Technique, theory, and musicianship woven together in every lesson.', levels: ['Children', 'Adult', 'Advanced'], color: '#8B6FD4' },
  { icon: Guitar, title: 'Guitar & Bass', description: 'Classical, acoustic, electric, and bass. From chord voicings to full shredding — every style has a home here.', levels: ['Acoustic', 'Electric', 'Bass'], color: '#5B9ED4' },
  { icon: Drum, title: 'Drums & Percussion', description: 'Groove, technique, and timing. Rock, jazz, Latin, and world percussion explored with master drummers.', levels: ['Beginner', 'Jazz', 'Advanced'], color: '#D4845B' },
  { icon: Mic2, title: 'Voice', description: 'Develop your unique sound. Breath control, resonance, range extension, and performance confidence.', levels: ['Pop', 'Classical', 'Musical Theatre'], color: '#5BD4A8' },
  { icon: Headphones, title: 'Music Production', description: 'Ableton, Logic, mixing, mastering, and sound design. Turn your ideas into professional-grade records.', levels: ['Beatmaking', 'Songwriting', 'Engineering'], color: '#D4C45B' },
  { icon: Users, title: 'Ensembles & Groups', description: 'Band workshops, chamber groups, choir, and jam sessions. Music is better together.', levels: ['Band', 'Chamber', 'Choir'], color: '#D45B8B' },
];

function Programs() {
  return (
    <section id="programs" className="py-28 px-6" style={{ background: 'var(--ink)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>What We Teach</p>
          <h2 className="text-5xl font-display mb-5" style={{ color: 'var(--ivory)' }}>Our Programs</h2>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-xl mx-auto font-ui" style={{ color: 'var(--mist)' }}>Six disciplines, infinite possibilities. Every program is built around your goals, your pace, and your musical voice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog, i) => {
            const Icon = prog.icon;
            return (
              <div key={i} className="p-8 rounded-xl transition-all duration-300 cursor-pointer" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.35)'; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.1)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ background: `${prog.color}20` }}>
                  <Icon size={22} style={{ color: prog.color }} />
                </div>
                <h3 className="text-xl font-display mb-3" style={{ color: 'var(--ivory)' }}>{prog.title}</h3>
                <p className="text-sm leading-relaxed mb-5 font-ui" style={{ color: 'var(--mist)' }}>{prog.description}</p>
                <div className="flex flex-wrap gap-2">
                  {prog.levels.map(l => (
                    <span key={l} className="px-3 py-1 rounded-full text-xs font-ui tracking-wide" style={{ background: `${prog.color}15`, color: prog.color, border: `1px solid ${prog.color}30` }}>{l}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/programs" className="inline-flex items-center gap-2 px-8 py-4 rounded font-ui text-sm tracking-widest uppercase transition-all duration-200" style={{ border: '1px solid var(--gold-muted)', color: 'var(--gold)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            View All Programs <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function About() {
  const pillars = [
    { icon: Award, title: 'Master Teachers', desc: 'Every instructor is a performing artist with advanced degrees and a passion for teaching.' },
    { icon: Heart, title: 'Personalized Method', desc: 'No two students learn alike. Lessons are tailored to your learning style, goals, and timeline.' },
    { icon: Clock, title: 'Flexible Scheduling', desc: 'Morning, evening, or weekend — in-person or online. Music fits your life, not the other way around.' },
    { icon: Music2, title: 'All Ages Welcome', desc: 'From toddlers discovering rhythm to adults returning to a lifelong dream — everyone belongs here.' },
  ];

  return (
    <section id="about" className="py-28 px-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>Our Philosophy</p>
            <h2 className="text-5xl font-display leading-tight mb-6" style={{ color: 'var(--ivory)' }}>Music is a language<br />everyone can speak.</h2>
            <div className="gold-line mb-6" style={{ width: '80px' }} />
            <p className="font-ui leading-relaxed mb-4" style={{ color: 'var(--mist)' }}>TOPmusic was founded on a simple belief: that musical excellence is not reserved for the gifted few. It is cultivated through the right guidance, the right environment, and an unwavering commitment to the student&apos;s individual voice.</p>
            <p className="font-ui leading-relaxed mb-8" style={{ color: 'var(--mist)' }}>Our teachers are not just instructors — they are working musicians, composers, and producers who bring the energy of the stage into every lesson. We teach technique, but more importantly, we teach listening, expression, and joy.</p>
            <Link href="/enroll" className="inline-flex items-center gap-2 font-ui text-sm tracking-widest uppercase transition-colors duration-200" style={{ color: 'var(--gold)' }}>
              Start Your Trial Lesson <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
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
    </section>
  );
}

const faculty = [
  { name: 'Elena Marchetti', title: 'Piano & Music Theory', bio: 'Graduate of Juilliard. Performed at Carnegie Hall. 15 years of transformative teaching.', specialty: 'Classical & Jazz Piano', initials: 'EM', color: '#8B6FD4' },
  { name: 'Marcus Rivera', title: 'Guitar & Bass', bio: 'Session guitarist for major-label artists. Toured internationally. Expert in all genres.', specialty: 'Rock, Jazz & Fingerstyle', initials: 'MR', color: '#5B9ED4' },
  { name: 'Sophia Chen', title: 'Vocal Coach', bio: 'Berklee alumna. Broadway background. Specializes in developing unique vocal identity.', specialty: 'Pop, Classical & Theatre', initials: 'SC', color: '#5BD4A8' },
  { name: 'Jordan Williams', title: 'Drums & Percussion', bio: 'Jazz drummer and Latin percussionist. Collaborates with orchestras and big bands.', specialty: 'Jazz, Rock & Latin', initials: 'JW', color: '#D4845B' },
];

function Faculty() {
  return (
    <section id="faculty" className="py-28 px-6" style={{ background: 'var(--ink)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>The Artists Who Teach</p>
          <h2 className="text-5xl font-display mb-5" style={{ color: 'var(--ivory)' }}>Meet Our Faculty</h2>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-xl mx-auto font-ui" style={{ color: 'var(--mist)' }}>Every teacher at TOPmusic is an active performer and recording artist — bringing real-world mastery into each lesson.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {faculty.map((f, i) => (
            <div key={i} className="p-6 rounded-xl text-center transition-all duration-300" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.35)'; el.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.1)'; el.style.transform = 'translateY(0)'; }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-display font-bold" style={{ background: `${f.color}20`, color: f.color, border: `2px solid ${f.color}40` }}>{f.initials}</div>
              <h3 className="font-display text-lg mb-1" style={{ color: 'var(--ivory)' }}>{f.name}</h3>
              <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>{f.title}</p>
              <p className="text-sm font-ui leading-relaxed mb-4" style={{ color: 'var(--mist)' }}>{f.bio}</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-ui" style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }}>{f.specialty}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/faculty" className="inline-flex items-center gap-2 px-8 py-4 rounded font-ui text-sm tracking-widest uppercase transition-all duration-200" style={{ border: '1px solid var(--gold-muted)', color: 'var(--gold)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            Meet All 18 Teachers <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { quote: "My daughter started piano at age 5 with no experience. Three years later she performed Chopin at her recital. The teachers at TOPmusic are genuinely exceptional.", name: "Sarah K.", role: "Parent of Student", stars: 5 },
  { quote: "I picked up the guitar at 47, convinced I was too old to learn. My teacher proved me completely wrong. I'm playing in a band now. This school is magic.", name: "David M.", role: "Adult Student", stars: 5 },
  { quote: "The music production program is on par with what I learned at a conservatory. Marcus showed me techniques I use in every session now.", name: "Aaliyah T.", role: "Music Producer & Alumni", stars: 5 },
  { quote: "My son was struggling to focus in school. Since joining drums at TOPmusic, his grades improved and his confidence is through the roof. Music heals.", name: "Michael R.", role: "Parent of Student", stars: 5 },
];

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx(i => (i + 1) % testimonials.length);
  const t = testimonials[idx];

  return (
    <section className="py-28 px-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>Student Stories</p>
        <h2 className="text-5xl font-display mb-12" style={{ color: 'var(--ivory)' }}>What Our Community Says</h2>
        <div className="p-10 rounded-2xl relative" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <Quote size={40} style={{ color: 'rgba(201,168,76,0.2)', margin: '0 auto 24px' }} />
          <p className="text-xl font-display leading-relaxed mb-8" style={{ color: 'var(--ivory)' }}>&ldquo;{t.quote}&rdquo;</p>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(t.stars)].map((_, i) => <Star key={i} size={14} fill="var(--gold)" style={{ color: 'var(--gold)' }} />)}
          </div>
          <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{t.name}</p>
          <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>{t.role}</p>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200" style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--mist)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.3)'; el.style.color = 'var(--mist)'; }}>
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
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

const faqs = [
  { q: 'What age do you start teaching?', a: 'We welcome students as young as 3 years old in our Early Childhood Music program, all the way through adults of any age. It is never too early or too late.' },
  { q: 'Do I need my own instrument?', a: 'Practice instruments are available for use during your first month. We provide guidance on purchasing the right instrument for your goals and budget.' },
  { q: 'How long are lessons?', a: 'Lessons are available in 30, 45, or 60-minute formats. We recommend 45 minutes for most students. Lesson length can be adjusted as your needs evolve.' },
  { q: 'Can I switch teachers?', a: 'Absolutely. The student-teacher relationship is fundamental. If the fit is not right, we will work with you to find a better match at no extra cost.' },
  { q: 'Do you offer online lessons?', a: 'Yes. All of our programs are available fully online, hybrid, or in-person. Our virtual lesson platform is optimized for music instruction with low-latency audio.' },
  { q: 'How do I pay?', a: 'Monthly tuition is billed automatically through the student or parent portal. We accept all major credit cards, ACH, and select payment plans for annual enrollment.' },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-28 px-6" style={{ background: 'var(--ink)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>Common Questions</p>
          <h2 className="text-5xl font-display" style={{ color: 'var(--ivory)' }}>FAQ</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
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
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--ink) 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)' }} />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl font-display mb-5" style={{ color: 'var(--ivory)' }}>Your first lesson is <span style={{ color: 'var(--gold)' }}>on us.</span></h2>
        <p className="max-w-xl mx-auto font-ui mb-10" style={{ color: 'var(--mist)' }}>Book a free 30-minute trial lesson with one of our master teachers. No commitment, no pressure — just music.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/enroll" className="px-10 py-4 rounded font-ui text-sm tracking-[0.15em] uppercase transition-all duration-300" style={{ background: 'var(--gold)', color: 'var(--ink)', fontWeight: 600 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold-light)'; el.style.boxShadow = '0 8px 30px rgba(201,168,76,0.4)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold)'; el.style.boxShadow = 'none'; }}>
            Claim Your Free Lesson
          </Link>
          <Link href="/contact" className="px-10 py-4 rounded font-ui text-sm tracking-[0.15em] uppercase transition-all duration-200" style={{ border: '1px solid rgba(201,168,76,0.4)', color: 'var(--ivory)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)'; }}>
            Talk to an Advisor
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {['No credit card required', 'Cancel anytime', 'In-person or online'].map(t => (
            <div key={t} className="flex items-center gap-2">
              <Check size={14} style={{ color: 'var(--gold)' }} />
              <span className="text-sm font-ui" style={{ color: 'var(--mist)' }}>{t}</span>
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
