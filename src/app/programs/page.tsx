'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Check } from 'lucide-react';

const programs = [
  {
    id: 'piano',
    title: 'Piano',
    tagline: 'The foundation of all music.',
    description: 'Our piano program is built for every stage of the musical journey. From a child pressing a key for the first time, to an adult rediscovering a lifelong passion, to an advanced student preparing for conservatory auditions — we meet every student where they are and build from there.',
    styles: ['Classical', 'Jazz', 'Pop & Contemporary', 'Improvisation', 'Music Theory', 'Composition'],
    levels: ['Early Childhood (3+)', 'Beginner', 'Intermediate', 'Advanced', 'Pre-Conservatory'],
    color: '#8B6FD4',
    pricing: 'From $75/lesson',
  },
  {
    id: 'guitar',
    title: 'Guitar & Bass',
    tagline: 'Six strings, infinite possibilities.',
    description: 'Our guitar program spans the full breadth of the instrument — from fingerpicking folk to shred technique, from acoustic singer-songwriter to jazz chord melody. Bass students explore grooves, walking lines, and slap technique with master players who have toured the world.',
    styles: ['Classical', 'Rock', 'Jazz', 'Blues', 'Acoustic / Folk', 'Fingerstyle', 'Bass — Funk & R&B'],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    color: '#5B9ED4',
    pricing: 'From $70/lesson',
  },
  {
    id: 'drums',
    title: 'Drums & Percussion',
    tagline: 'Rhythm is the heartbeat of music.',
    description: 'Drums go beyond patterns — we build fully musical drummers with deep timing, dynamics, and creativity. Our teachers bring experience in jazz, rock, Latin, classical percussion, and world drumming traditions. We also offer apartment-friendly practice strategies for urban students.',
    styles: ['Rock & Metal', 'Jazz', 'Latin & Afro-Cuban', 'Funk & R&B', 'Classical Percussion', 'Electronic Drumming'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Professional Development'],
    color: '#D4845B',
    pricing: 'From $75/lesson',
  },
  {
    id: 'voice',
    title: 'Voice',
    tagline: 'Your instrument is already inside you.',
    description: 'Every voice has its own character. Our vocal teachers help students discover and develop that character — building technique without erasing personality. Whether you want to perform on Broadway, record your original music, or simply sing better in the shower, there is a place for you here.',
    styles: ['Pop & Contemporary', 'Classical / Opera', 'Musical Theatre', 'R&B & Soul', 'Songwriting', 'Audition Prep'],
    levels: ['All Ages', 'Teen & Young Adult', 'Adult Beginner', 'Advanced', 'Pre-Professional'],
    color: '#5BD4A8',
    pricing: 'From $80/lesson',
  },
  {
    id: 'production',
    title: 'Music Production',
    tagline: 'Turn ideas into records.',
    description: 'Our production program teaches the full modern workflow: beat making, song arrangement, recording, mixing, and mastering. Students work in Ableton Live and Logic Pro with instructors who have credits on major-label releases. Sessions include studio time on our professional in-house rig.',
    styles: ['Hip-Hop / Trap', 'Electronic / EDM', 'Singer-Songwriter Production', 'Film Scoring', 'Mixing & Mastering', 'Sound Design'],
    levels: ['Beginner (no DAW experience required)', 'Intermediate', 'Advanced', 'Professional Development'],
    color: '#D4C45B',
    pricing: 'From $90/lesson',
  },
  {
    id: 'ensembles',
    title: 'Ensembles & Groups',
    tagline: 'Music is better together.',
    description: 'Our group programs bring students together to rehearse, perform, and create as a unit. From jazz combo to rock band to chamber ensemble — playing with others accelerates growth in ways private lessons alone cannot. Group sessions meet weekly and culminate in live performances.',
    styles: ['Rock Band Workshop', 'Jazz Combo', 'Chamber Ensemble', 'Adult Choir', 'Early Childhood Music', 'Summer Band Intensive'],
    levels: ['Kids (5–12)', 'Teens (13–17)', 'Adults (18+)', 'Mixed-Age Ensembles'],
    color: '#D45B8B',
    pricing: 'From $40/session',
  },
];

export default function ProgramsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>
        <div className="py-20 px-6 text-center" style={{ background: 'var(--surface)' }}>
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>What We Offer</p>
          <h1 className="text-5xl font-display mb-4" style={{ color: 'var(--ivory)' }}>Our Programs</h1>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-xl mx-auto font-ui" style={{ color: 'var(--mist)' }}>Six disciplines, hundreds of styles, one-on-one instruction tailored to your goals. Every program includes a free 30-minute trial lesson.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
          {programs.map((prog, i) => (
            <div key={prog.id} id={prog.id} className="p-8 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-10 rounded-full" style={{ background: prog.color }} />
                    <div>
                      <h2 className="text-3xl font-display" style={{ color: 'var(--ivory)' }}>{prog.title}</h2>
                      <p className="font-ui text-sm italic" style={{ color: prog.color }}>{prog.tagline}</p>
                    </div>
                  </div>
                  <p className="font-ui leading-relaxed mb-6" style={{ color: 'var(--mist)' }}>{prog.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>Styles & Focus Areas</p>
                      <ul className="space-y-2">
                        {prog.styles.map(s => (
                          <li key={s} className="flex items-center gap-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
                            <Check size={12} style={{ color: prog.color, flexShrink: 0 }} /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>Levels Available</p>
                      <ul className="space-y-2">
                        {prog.levels.map(l => (
                          <li key={l} className="flex items-center gap-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: prog.color }} /> {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="p-5 rounded-xl" style={{ background: 'var(--surface-3)', border: `1px solid ${prog.color}30` }}>
                    <p className="text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Pricing</p>
                    <p className="text-2xl font-display font-bold mb-1" style={{ color: prog.color }}>{prog.pricing}</p>
                    <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>30, 45, or 60-min sessions available</p>
                    <div className="gold-line my-4" />
                    <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>First lesson free. No commitment required.</p>
                  </div>
                  <Link href="/enroll"
                    className="mt-4 py-4 rounded-xl font-ui text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200"
                    style={{ background: `${prog.color}20`, color: prog.color, border: `1px solid ${prog.color}40` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${prog.color}35`; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${prog.color}20`; }}>
                    Start {prog.title} Lessons <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
