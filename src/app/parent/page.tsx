'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Music2, Calendar, CreditCard, TrendingUp,
  LogOut, Bell, ChevronRight, MessageCircle,
  Users, Star, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

const nav = [
  { icon: Calendar, label: 'Schedule' },
  { icon: TrendingUp, label: 'Progress' },
  { icon: CreditCard, label: 'Billing' },
  { icon: MessageCircle, label: 'Messages' },
  { icon: Users, label: 'My Children' },
];

const children = [
  { name: 'Emma Sullivan', instrument: 'Piano', teacher: 'Elena Marchetti', level: 'Advanced', initials: 'ES', color: '#8B6FD4' },
  { name: 'Liam Sullivan', instrument: 'Drums', teacher: 'Jordan Williams', level: 'Intermediate', initials: 'LS', color: '#D4845B' },
];

const upcoming = [
  { child: 'Emma', subject: 'Piano — Chopin Etude', date: 'Tue Jun 25', time: '4:00 PM', type: 'In-Person' },
  { child: 'Liam', subject: 'Drums — Jazz Coordination', date: 'Wed Jun 26', time: '5:30 PM', type: 'In-Person' },
  { child: 'Emma', subject: 'Piano — Sight Reading', date: 'Thu Jun 27', time: '4:00 PM', type: 'Online' },
];

export default function ParentPortal() {
  const [activeTab, setActiveTab] = useState('Schedule');
  const [selectedChild, setSelectedChild] = useState(0);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ink)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: 'var(--surface)', borderRight: '1px solid rgba(201,168,76,0.12)', minHeight: '100vh' }}>
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

        <div className="p-6 border-b" style={{ borderColor: 'rgba(201,168,76,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-display text-lg font-bold" style={{ background: 'rgba(91,158,212,0.2)', color: '#5B9ED4', border: '2px solid rgba(91,158,212,0.4)' }}>
              RS
            </div>
            <div>
              <p className="font-display font-bold text-sm" style={{ color: 'var(--ivory)' }}>Rachel Sullivan</p>
              <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>Parent · 2 Students</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ icon: Icon, label }) => (
            <button key={label} onClick={() => setActiveTab(label)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left font-ui text-sm"
              style={{
                background: activeTab === label ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: activeTab === label ? 'var(--gold)' : 'var(--mist)',
                borderLeft: activeTab === label ? '2px solid var(--gold)' : '2px solid transparent',
              }}>
              <Icon size={16} /> {label}
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
        <header className="flex items-center justify-between px-8 py-5 sticky top-0 z-10" style={{ background: 'rgba(13,11,15,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div>
            <h1 className="text-2xl font-display" style={{ color: 'var(--ivory)' }}>Parent Portal</h1>
            <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>Welcome, Rachel</p>
          </div>
          <button className="relative p-2 rounded-lg transition-colors" style={{ color: 'var(--mist)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}>
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
          </button>
        </header>

        <div className="p-8">
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Children Enrolled', value: '2 Students', icon: Users, color: '#5B9ED4' },
              { label: 'This Month', value: '16 Lessons', icon: Star, color: 'var(--gold)' },
              { label: 'Next Lesson', value: 'Tomorrow 4 PM', icon: Clock, color: '#8B6FD4' },
              { label: 'Balance', value: '$0 Due', icon: CreditCard, color: '#5BD4A8' },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--mist)' }}>{s.label}</p>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <p className="text-xl font-display font-bold" style={{ color: 'var(--ivory)' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Schedule Tab */}
          {activeTab === 'Schedule' && (
            <div>
              <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>Upcoming Lessons</h2>
              <div className="space-y-3">
                {upcoming.map((l, i) => (
                  <div key={i} className="p-5 rounded-xl flex items-center justify-between transition-all duration-200" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.1)'; }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold flex-shrink-0" style={{ background: l.child === 'Emma' ? 'rgba(139,111,212,0.2)' : 'rgba(212,132,91,0.2)', color: l.child === 'Emma' ? '#8B6FD4' : '#D4845B' }}>
                        {l.child[0]}
                      </div>
                      <div>
                        <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{l.subject}</p>
                        <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>{l.child} · {l.date} · {l.time}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-ui" style={{ background: l.type === 'Online' ? 'rgba(91,184,168,0.15)' : 'rgba(201,168,76,0.15)', color: l.type === 'Online' ? '#5BD4A8' : 'var(--gold)' }}>{l.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'Progress' && (
            <div>
              {/* Child selector */}
              <div className="flex gap-3 mb-6">
                {children.map((c, i) => (
                  <button key={i} onClick={() => setSelectedChild(i)}
                    className="px-5 py-2.5 rounded-lg font-ui text-sm transition-all duration-200"
                    style={{ background: selectedChild === i ? 'rgba(201,168,76,0.15)' : 'var(--surface-2)', color: selectedChild === i ? 'var(--gold)' : 'var(--mist)', border: `1px solid ${selectedChild === i ? 'var(--gold)' : 'rgba(201,168,76,0.1)'}` }}>
                    {c.name}
                  </button>
                ))}
              </div>

              {(() => {
                const child = children[selectedChild];
                return (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.15)' }}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-display font-bold" style={{ background: `${child.color}20`, color: child.color, border: `2px solid ${child.color}40` }}>{child.initials}</div>
                        <div>
                          <h3 className="text-xl font-display font-bold" style={{ color: 'var(--ivory)' }}>{child.name}</h3>
                          <p className="font-ui text-sm" style={{ color: 'var(--mist)' }}>{child.instrument} · {child.level} · Teacher: {child.teacher}</p>
                        </div>
                      </div>
                      {[
                        { skill: 'Technical Proficiency', pct: selectedChild === 0 ? 82 : 65 },
                        { skill: 'Musical Expression', pct: selectedChild === 0 ? 90 : 70 },
                        { skill: 'Music Theory', pct: selectedChild === 0 ? 75 : 55 },
                        { skill: 'Practice Consistency', pct: selectedChild === 0 ? 88 : 80 },
                      ].map((item, j) => (
                        <div key={j} className="mb-4">
                          <div className="flex justify-between mb-2">
                            <p className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{item.skill}</p>
                            <p className="text-sm font-display font-bold" style={{ color: 'var(--gold)' }}>{item.pct}%</p>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                            <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: `linear-gradient(90deg, ${child.color}80, ${child.color})` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
                      <h4 className="font-display font-bold mb-3" style={{ color: 'var(--ivory)' }}>Teacher&apos;s Note</h4>
                      <p className="text-sm font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>
                        {selectedChild === 0
                          ? "Emma continues to impress with her musical sensitivity and dedication. She is ready to begin working on her recital piece. Encourage daily 30-minute practice sessions at home."
                          : "Liam has great natural rhythm and enthusiasm. We are working on developing independence between hands and feet. His progress this month has been excellent."}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'Billing' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>Billing Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {children.map((c, i) => (
                  <div key={i} className="p-5 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                    <p className="font-display font-bold mb-1" style={{ color: 'var(--ivory)' }}>{c.name}</p>
                    <p className="text-sm font-ui mb-3" style={{ color: 'var(--mist)' }}>{c.instrument} · 4 lessons/mo</p>
                    <p className="text-xl font-display font-bold" style={{ color: 'var(--gold)' }}>$320 / mo</p>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(92,184,138,0.08)', border: '1px solid rgba(92,184,138,0.2)' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                  <p className="font-ui text-sm font-medium" style={{ color: 'var(--success)' }}>All payments up to date. Next billing: July 1, 2024 — $640.00</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { date: 'Jun 1, 2024', desc: 'Emma + Liam — June Tuition', amount: '$640.00', status: 'Paid' },
                  { date: 'May 1, 2024', desc: 'Emma + Liam — May Tuition', amount: '$640.00', status: 'Paid' },
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

          {/* Messages */}
          {activeTab === 'Messages' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>Messages</h2>
              <div className="space-y-3">
                {[
                  { from: 'Elena Marchetti', re: "Re: Emma", preview: "Emma had a wonderful lesson today. I've attached the sheet music for next week.", time: '3 hrs ago', unread: true },
                  { from: 'Jordan Williams', re: "Re: Liam", preview: "Liam is really finding his groove! I'd like to discuss moving him to an advanced group session.", time: 'Jun 21', unread: true },
                  { from: 'TOPmusic Admin', re: "Summer Schedule", preview: "Our summer intensive program registration is now open. Early enrollment discount available.", time: 'Jun 20', unread: false },
                ].map((msg, i) => (
                  <div key={i} className="p-5 rounded-xl flex items-start gap-4 cursor-pointer transition-all duration-200" style={{ background: 'var(--surface-2)', border: `1px solid ${msg.unread ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'}` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = msg.unread ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'; }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold flex-shrink-0" style={{ background: 'rgba(139,111,212,0.2)', color: '#8B6FD4' }}>
                      {msg.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="font-display font-bold text-sm" style={{ color: 'var(--ivory)' }}>{msg.from}</p>
                        <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{msg.time}</p>
                      </div>
                      <p className="text-xs font-ui mb-1" style={{ color: 'var(--gold)' }}>{msg.re}</p>
                      <p className="text-sm font-ui truncate" style={{ color: msg.unread ? 'var(--ivory)' : 'var(--mist)' }}>{msg.preview}</p>
                    </div>
                    {msg.unread && <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--gold)' }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Children */}
          {activeTab === 'My Children' && (
            <div>
              <h2 className="text-lg font-display mb-5" style={{ color: 'var(--ivory)' }}>My Children</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {children.map((c, i) => (
                  <div key={i} className="p-6 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-display font-bold" style={{ background: `${c.color}20`, color: c.color, border: `2px solid ${c.color}40` }}>{c.initials}</div>
                      <div>
                        <h3 className="font-display text-lg font-bold" style={{ color: 'var(--ivory)' }}>{c.name}</h3>
                        <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>{c.instrument} · {c.level}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
                      <div className="flex justify-between"><span>Teacher</span><span style={{ color: 'var(--ivory)' }}>{c.teacher}</span></div>
                      <div className="flex justify-between"><span>Program</span><span style={{ color: 'var(--ivory)' }}>4 lessons / month</span></div>
                      <div className="flex justify-between"><span>Status</span><span style={{ color: 'var(--success)' }}>Active</span></div>
                    </div>
                    <button className="mt-5 w-full py-2.5 rounded-lg font-ui text-sm tracking-widest uppercase transition-all duration-200" style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                      View Full Profile
                    </button>
                  </div>
                ))}
                <div className="p-6 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200" style={{ border: '2px dashed rgba(201,168,76,0.2)', minHeight: 200 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)'; }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ border: '2px dashed rgba(201,168,76,0.3)' }}>
                    <span style={{ color: 'var(--gold-muted)', fontSize: 24 }}>+</span>
                  </div>
                  <p className="font-ui text-sm" style={{ color: 'var(--mist)' }}>Enroll Another Child</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
