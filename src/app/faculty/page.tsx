'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Star } from 'lucide-react';

const faculty = [
  { name: 'Elena Marchetti', title: 'Piano & Music Theory', initials: 'EM', color: '#8B6FD4', specialty: 'Classical & Jazz Piano', education: 'Juilliard School, M.M.', experience: '15 years', bio: "Elena graduated with honors from the Juilliard School, where she studied under renowned pianist Jerome Lowenthal. She has performed at Carnegie Hall, Lincoln Center, and concert halls across Europe. Her teaching philosophy centers on building deep musical intuition — not just technical skill — so students can express themselves freely.", achievements: ['Carnegie Hall Soloist', 'Juilliard Faculty Fellowship', 'Winner — NY Young Artists Competition'] },
  { name: 'Marcus Rivera', title: 'Guitar & Bass', initials: 'MR', color: '#5B9ED4', specialty: 'Rock, Jazz & Fingerstyle', education: 'Berklee College of Music, B.M.', experience: '12 years', bio: "Marcus Rivera is a session guitarist whose credits include recordings with five Grammy-winning artists. He has toured internationally and performed on Late Night with network TV. An equally accomplished bassist, Marcus teaches the full spectrum of fretted instruments with warmth, humor, and exacting precision.", achievements: ['5 Grammy-Credited Sessions', 'International Tour Artist', 'Featured in Guitar World Magazine'] },
  { name: 'Sophia Chen', title: 'Voice', initials: 'SC', color: '#5BD4A8', specialty: 'Pop, Classical & Musical Theatre', education: 'Berklee College of Music, B.M.', experience: '10 years', bio: "Sophia trained as a classical soprano before falling in love with contemporary musical theatre and pop. She spent four years performing Off-Broadway and as a session singer on advertising campaigns. Her approach to vocal training is deeply individualized — she works to find and amplify each student's natural voice rather than mold them to a template.", achievements: ['Off-Broadway Performer', 'Published Vocal Method Book', '3x "Best Teacher" — TOPmusic Alumni Vote'] },
  { name: 'Jordan Williams', title: 'Drums & Percussion', initials: 'JW', color: '#D4845B', specialty: 'Jazz, Rock & Latin Percussion', education: 'Manhattan School of Music, M.M.', experience: '14 years', bio: "Jordan is a working jazz drummer and Latin percussionist who has collaborated with the New York Philharmonic, the Jazz at Lincoln Center Orchestra, and dozens of touring bands. He brings a rare combination of orchestral precision and street-level groove to his teaching, and has a special gift for making complex rhythmic concepts accessible.", achievements: ['NY Philharmonic Collaborator', 'Jazz at Lincoln Center', 'Latin Grammy Nominated Project'] },
  { name: 'Aisha Thompson', title: 'Music Production', initials: 'AT', color: '#D4C45B', specialty: 'Hip-Hop, Electronic & Film Scoring', education: 'Full Sail University, B.S. Recording Arts', experience: '9 years', bio: "Aisha is a producer, mixer, and sound designer whose music has appeared in Netflix originals, major ad campaigns, and platinum-selling albums. She teaches the full modern production workflow — from initial sketch to final master — and is passionate about helping students find their sonic signature without compromise.", achievements: ['Netflix Original Music Credit', 'Platinum Production Credit', 'Billboard-Charting Mix Engineer'] },
  { name: 'David Okonkwo', title: 'Guitar & Ensemble Director', initials: 'DO', color: '#D45B8B', specialty: 'Blues, Soul & Ensemble Performance', education: 'University of North Texas, M.M.', experience: '16 years', bio: "David grew up in the gospel tradition and spent a decade touring with soul and blues artists before transitioning to full-time teaching. He leads TOPmusic's ensemble program and brings a deeply soulful approach to guitar and music education — one rooted in listening, community, and serving the music.", achievements: ['Grammy Nominee — Best Gospel Album', 'Ensemble Program Founder', 'TEDx Talk: "Music as Community"'] },
];

export default function FacultyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>
        <div className="py-20 px-6 text-center" style={{ background: 'var(--surface)' }}>
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>The Artists Who Teach</p>
          <h1 className="text-5xl font-display mb-4" style={{ color: 'var(--ivory)' }}>Our Faculty</h1>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-xl mx-auto font-ui" style={{ color: 'var(--mist)' }}>Every teacher at TOPmusic is a working artist, performer, or producer. They do not just know music — they live it. And they bring that aliveness into every lesson.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
          {faculty.map((f) => (
            <div key={f.name} className="p-8 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Portrait */}
                <div className="text-center">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-display font-bold mx-auto mb-4" style={{ background: `${f.color}20`, color: f.color, border: `3px solid ${f.color}40` }}>{f.initials}</div>
                  <h2 className="text-xl font-display font-bold mb-1" style={{ color: 'var(--ivory)' }}>{f.name}</h2>
                  <p className="text-xs font-ui tracking-widest uppercase mb-2" style={{ color: f.color }}>{f.title}</p>
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={f.color} style={{ color: f.color }} />)}
                  </div>
                  <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{f.experience} teaching</p>
                  <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{f.education}</p>
                </div>

                {/* Bio */}
                <div className="lg:col-span-2">
                  <p className="font-ui leading-relaxed mb-5" style={{ color: 'var(--mist)' }}>{f.bio}</p>
                  <div>
                    <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>Highlights</p>
                    <ul className="space-y-2">
                      {f.achievements.map(a => (
                        <li key={a} className="flex items-center gap-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.color }} />{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col justify-between">
                  <div className="p-5 rounded-xl" style={{ background: 'var(--surface-3)', border: `1px solid ${f.color}25` }}>
                    <p className="text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Specialty</p>
                    <p className="font-display font-bold" style={{ color: f.color }}>{f.specialty}</p>
                  </div>
                  <Link href="/enroll" className="mt-4 py-4 rounded-xl font-ui text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200"
                    style={{ background: `${f.color}20`, color: f.color, border: `1px solid ${f.color}40` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${f.color}35`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${f.color}20`; }}>
                    Book a Lesson <ArrowRight size={14} />
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
