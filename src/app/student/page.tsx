'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Music2, Calendar, CreditCard, BookOpen, Star,
  LogOut, Bell, ChevronRight, Play, Clock,
  TrendingUp, FileMusic, Award, MessageCircle
} from 'lucide-react';

const nav = [
  { icon: Calendar, label: 'Schedule' },
  { icon: TrendingUp, label: 'Progress' },
  { icon: FileMusic, label: 'Resources' },
  { icon: CreditCard, label: 'Billing' },
  { icon: MessageCircle, label: 'Messages' },
];

const upcomingLessons = [
  { day: 'Tuesday', date: 'Jun 25', time: '4:00 PM', teacher: 'Elena Marchetti', subject: 'Piano — Advanced Technique', duration: '60 min', type: 'In-Person' },
  { day: 'Thursday', date: 'Jun 27', time: '5:00 PM', teacher: 'Elena Marchetti', subject: 'Piano — Chopin Etude', duration: '60 min', type: 'In-Person' },
  { day: 'Tuesday', date: 'Jul 2', time: '4:00 PM', teacher: 'Elena Marchetti', subject: 'Piano — Sight Reading', duration: '60 min', type: 'Online' },
];

const recentProgress = [
  { skill: 'Scales & Arpeggios', level: 82 },
  { skill: 'Sight Reading', level: 67 },
  { skill: 'Music Theory', level: 75 },
  { skill: 'Repertoire', level: 90 },
];

const resources = [
  { title: 'Chopin Nocturne Op.9 No.2 — Sheet Music', type: 'PDF', size: '1.2 MB' },
  { title: 'Technique Exercise — Hanon No.1-10', type: 'PDF', size: '890 KB' },
  { title: 'Theory Homework — Week 24', type: 'PDF', size: '340 KB' },
  { title: 'Recorded Lesson — Jun 18', type: 'Video', size: '180 MB' },
];

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('Schedule');

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ink)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: 'var(--surface)', borderRight: '1px solid rgba(201,168,76,0.12)', minHeight: '100vh' }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(201,168,76,0.12)' }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-muted))' }}>
              <Music2 size={16} color="#0D0B0F" strokeWidth={2.5} />
            </div>
            <span className="text-lg tracking-[0.12em] uppercase font-display font-bold">
              TOP<span style={{ color: 'var(--gold)' }}>music</span>
            </span>
          </Link>
        </div>

        {/* Student info */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(201,168,76,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-display text-lg font-bold" style={{ background: 'rgba(139,111,212,0.2)', color: '#8B6FD4', border: '2px solid rgba(139,111,212,0.4)' }}>
              JS
            </div>
            <div>
              <p className="font-display font-bold text-sm" style={{ color: 'var(--ivory)' }}>Jamie Sullivan</p>
              <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>Piano · Year 3</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ icon: Icon, label }) => (
            <button key={label} onClick={() => setActiveTab(label)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left font-ui text-sm"
              style={{
                background: activeTab === label ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: activeTab === label ? 'var(--gold)' : 'var(--mist)',
                borderLeft: activeTab === label ? '2px solid var(--gold)' : '2px solid transparent',
              }}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <Link href="/login" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-ui text-sm transition-colors" style={{ color: 'var(--mist)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}>
            <LogOut size={16} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-5 sticky top-0 z-10" style={{ background: 'rgba(13,11,15,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div>
            <h1 className="text-2xl font-display" style={{ color: 'var(--ivory)' }}>Student Portal</h1>
            <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>Welcome back, Jamie</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg transition-colors" style={{ color: 'var(--mist)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}>
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Next Lesson', value: 'Tomorrow 4 PM', icon: Calendar, color: '#8B6FD4' },
              { label: 'Lessons This Month', value: '8 Completed', icon: Star, color: 'var(--gold)' },
              { label: 'Practice Hours', value: '24 hrs', icon: Clock, color: '#5BD4A8' },
              { label: 'Overall Progress', value: '78%', icon: TrendingUp, color: '#5B9ED4' },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--mist)' }}>{stat.label}</p>
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
                <p className="text-xl font-display font-bold" style={{ color: 'var(--ivory)' }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Schedule Tab */}
          {activeTab === 'Schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>Upcoming Lessons</h2>
                <div className="space-y-3">
                  {upcomingLessons.map((lesson, i) => (
                    <div key={i} className="p-5 rounded-xl flex items-center justify-between transition-all duration-200" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.1)'; }}>
                      <div className="flex items-center gap-4">
                        <div className="text-center w-12">
                          <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{lesson.day.slice(0, 3)}</p>
                          <p className="text-xl font-display font-bold" style={{ color: 'var(--gold)' }}>{lesson.date.split(' ')[1]}</p>
                        </div>
                        <div style={{ width: '1px', height: 40, background: 'rgba(201,168,76,0.2)' }} />
                        <div>
                          <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{lesson.subject}</p>
                          <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>{lesson.teacher} · {lesson.time} · {lesson.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-ui" style={{ background: lesson.type === 'Online' ? 'rgba(91,184,168,0.15)' : 'rgba(201,168,76,0.15)', color: lesson.type === 'Online' ? '#5BD4A8' : 'var(--gold)' }}>{lesson.type}</span>
                        <ChevronRight size={16} style={{ color: 'var(--mist)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>Teacher Note</h2>
                <div className="p-5 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold" style={{ background: 'rgba(139,111,212,0.2)', color: '#8B6FD4' }}>EM</div>
                    <div>
                      <p className="font-display font-bold text-sm" style={{ color: 'var(--ivory)' }}>Elena Marchetti</p>
                      <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>Jun 18, 2024</p>
                    </div>
                  </div>
                  <p className="text-sm font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>
                    Jamie is making excellent progress on the Chopin Nocturne. Focus this week on the left-hand voicing in bars 12–16 and the rubato feel in the B section. Practice the Hanon exercises at 120 BPM before each session.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'Progress' && (
            <div>
              <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>Skill Progress</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recentProgress.map((item, i) => (
                  <div key={i} className="p-6 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-display" style={{ color: 'var(--ivory)' }}>{item.skill}</p>
                      <p className="font-display font-bold" style={{ color: 'var(--gold)' }}>{item.level}%</p>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.level}%`, background: 'linear-gradient(90deg, var(--gold-muted), var(--gold))' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'Resources' && (
            <div>
              <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>Practice Resources</h2>
              <div className="space-y-3">
                {resources.map((r, i) => (
                  <div key={i} className="p-5 rounded-xl flex items-center justify-between transition-all duration-200" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.1)'; }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: r.type === 'Video' ? 'rgba(91,184,168,0.15)' : 'rgba(201,168,76,0.1)' }}>
                        {r.type === 'Video' ? <Play size={16} style={{ color: '#5BD4A8' }} /> : <FileMusic size={16} style={{ color: 'var(--gold)' }} />}
                      </div>
                      <div>
                        <p className="font-ui text-sm font-medium" style={{ color: 'var(--ivory)' }}>{r.title}</p>
                        <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{r.type} · {r.size}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg font-ui text-xs tracking-widest uppercase transition-colors" style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'Billing' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>Billing & Invoices</h2>
              <div className="p-6 rounded-xl mb-6" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.15)' }}>
                <p className="text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Current Plan</p>
                <p className="text-2xl font-display font-bold mb-1" style={{ color: 'var(--ivory)' }}>Advanced Piano — 4 lessons/mo</p>
                <p className="font-display text-lg" style={{ color: 'var(--gold)' }}>$320 / month</p>
                <p className="text-sm font-ui mt-2" style={{ color: 'var(--mist)' }}>Next billing: July 1, 2024 · Visa ending 4242</p>
              </div>
              <div className="space-y-3">
                {[
                  { date: 'Jun 1, 2024', desc: '4 Piano Lessons', amount: '$320.00', status: 'Paid' },
                  { date: 'May 1, 2024', desc: '4 Piano Lessons', amount: '$320.00', status: 'Paid' },
                  { date: 'Apr 1, 2024', desc: '4 Piano Lessons', amount: '$320.00', status: 'Paid' },
                ].map((inv, i) => (
                  <div key={i} className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.08)' }}>
                    <div>
                      <p className="font-ui text-sm font-medium" style={{ color: 'var(--ivory)' }}>{inv.desc}</p>
                      <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{inv.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{inv.amount}</p>
                      <span className="px-3 py-1 rounded-full text-xs font-ui" style={{ background: 'rgba(92,184,138,0.15)', color: 'var(--success)' }}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'Messages' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>Messages</h2>
              <div className="space-y-3">
                {[
                  { from: 'Elena Marchetti', preview: "Great work on Tuesday! Don't forget to practice the rubato section...", time: '2 hrs ago', unread: true },
                  { from: 'TOPmusic Admin', preview: 'Your June schedule is confirmed. Click here to view all upcoming lessons.', time: 'Jun 20', unread: false },
                  { from: 'Elena Marchetti', preview: 'Here is the sheet music for our next session. See you Tuesday!', time: 'Jun 18', unread: false },
                ].map((msg, i) => (
                  <div key={i} className="p-5 rounded-xl flex items-start gap-4 cursor-pointer transition-all duration-200" style={{ background: 'var(--surface-2)', border: `1px solid ${msg.unread ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'}` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = msg.unread ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'; }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold flex-shrink-0" style={{ background: 'rgba(139,111,212,0.2)', color: '#8B6FD4' }}>
                      {msg.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-display font-bold text-sm" style={{ color: 'var(--ivory)' }}>{msg.from}</p>
                        <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{msg.time}</p>
                      </div>
                      <p className="text-sm font-ui truncate" style={{ color: msg.unread ? 'var(--ivory)' : 'var(--mist)' }}>{msg.preview}</p>
                    </div>
                    {msg.unread && <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--gold)' }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
