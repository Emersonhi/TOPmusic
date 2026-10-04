'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { LogOut, Calendar, Music2, CheckCircle, X, RefreshCw, Video, ExternalLink } from 'lucide-react';

type Enrollment = {
  id: string;
  program: string;
  lesson_length: string;
  frequency: string;
  format: string;
  experience: string;
  created_at: string;
  status: string;
};

type Booking = {
  id: string;
  date: string;
  time: string;
  program: string;
  status: string;
};

type Meeting = {
  id: string;
  title: string;
  link: string;
  date: string;
  time: string;
  notes: string;
  created_at: string;
};

const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

function nextDays(n: number) {
  const days = [];
  for (let i = 1; i <= n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    if (d.getDay() !== 0) days.push(d);
  }
  return days.slice(0, n);
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tab, setTab] = useState<'overview' | 'book'>('overview');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);

  const days = nextDays(14);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserEmail(session.user.email ?? '');
      setUserName(session.user.user_metadata?.full_name ?? '');

      const { data: enr } = await supabase
        .from('enrollments')
        .select('*')
        .eq('email', session.user.email)
        .order('created_at', { ascending: false });
      setEnrollments(enr ?? []);

      const { data: bk } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_email', session.user.email)
        .order('date', { ascending: true });
      setBookings(bk ?? []);

      const { data: prof } = await supabase
        .from('student_profiles')
        .select('meetings')
        .eq('email', session.user.email)
        .maybeSingle();
      try { setMeetings(prof?.meetings ? JSON.parse(prof.meetings) : []); } catch { setMeetings([]); }

      setLoading(false);
    }
    load();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const refreshBookings = async (email: string) => {
    const { data: bk } = await supabase.from('bookings').select('*').eq('user_email', email).order('date', { ascending: true });
    setBookings(bk ?? []);
  };

  const handleBook = async () => {
    if (!selectedDay || !selectedTime || !selectedProgram) return;
    setBooking(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (reschedulingId) {
      await supabase.from('bookings').update({ date: selectedDay, time: selectedTime, status: 'pending' }).eq('id', reschedulingId);
      setReschedulingId(null);
    } else {
      await supabase.from('bookings').insert({
        user_email: session?.user.email,
        date: selectedDay,
        time: selectedTime,
        program: selectedProgram,
        status: 'pending',
      });
    }

    await refreshBookings(session?.user.email ?? '');
    setBookingSuccess(true);
    setSelectedDay(''); setSelectedTime(''); setSelectedProgram('');
    setBooking(false);
    setTimeout(() => { setBookingSuccess(false); setTab('overview'); }, 2500);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    setBookings(b => b.map(x => x.id === id ? { ...x, status: 'cancelled' } : x));
  };

  const handleReschedule = (b: Booking) => {
    setReschedulingId(b.id);
    setSelectedProgram(b.program);
    setSelectedDay('');
    setSelectedTime('');
    setTab('book');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <main className="min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.webp" alt="TOP Music School" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="text-lg font-display font-bold tracking-widest uppercase" style={{ color: 'var(--ivory)' }}>TOP<span style={{ color: 'var(--gold)' }}>music</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-ui" style={{ color: 'var(--mist)' }}>{userEmail}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm transition-all duration-200"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--mist)' }}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-display mb-2" style={{ color: 'var(--ivory)' }}>
          Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}
        </h1>
        <p className="font-ui text-sm mb-8" style={{ color: 'var(--mist)' }}>Manage your enrollments and lessons.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[{ id: 'overview', label: 'Overview' }, { id: 'book', label: 'Book a Lesson' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className="px-5 py-2.5 rounded-lg font-ui text-sm tracking-widest uppercase transition-all duration-200"
              style={{ background: tab === t.id ? 'var(--gold)' : 'var(--surface-2)', color: tab === t.id ? 'var(--ink)' : 'var(--mist)', fontWeight: tab === t.id ? 700 : 400, border: tab === t.id ? 'none' : '1px solid rgba(201,168,76,0.15)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Enrollments */}
            <section>
              <h2 className="text-lg font-display mb-4" style={{ color: 'var(--ivory)' }}>My Enrollments</h2>
              {enrollments.length === 0 ? (
                <div className="p-8 rounded-2xl text-center" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                  <Music2 size={32} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
                  <p className="font-ui mb-4" style={{ color: 'var(--mist)' }}>No enrollments yet.</p>
                  <Link href="/enroll" className="inline-block px-6 py-3 rounded-lg font-ui text-sm tracking-widest uppercase font-bold"
                    style={{ background: 'var(--gold)', color: 'var(--ink)' }}>Enroll Now</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.map(e => (
                    <div key={e.id} className="p-5 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                      <div>
                        <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{e.program}</p>
                        <p className="text-sm font-ui mt-1" style={{ color: 'var(--mist)' }}>{e.lesson_length} · {e.frequency} · {e.format}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-ui tracking-widest uppercase"
                        style={{ background: 'rgba(92,184,138,0.15)', color: 'var(--success)', border: '1px solid rgba(92,184,138,0.3)' }}>
                        {e.status ?? 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Meetings */}
            {meetings.length > 0 && (() => {
              const today = new Date().toISOString().split('T')[0];
              const upcoming = meetings.filter(m => !m.date || m.date >= today);
              const past = meetings.filter(m => m.date && m.date < today);
              return (
                <section>
                  <h2 className="text-lg font-display mb-4" style={{ color: 'var(--ivory)' }}>Google Meet Sessions</h2>
                  <div className="space-y-3">
                    {upcoming.map(m => (
                      <div key={m.id} className="p-5 rounded-xl flex items-center justify-between gap-4 flex-wrap"
                        style={{ background: 'var(--surface-2)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(16,185,129,0.12)' }}>
                            <Video size={16} style={{ color: '#10b981' }} />
                          </div>
                          <div>
                            <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{m.title}</p>
                            <p className="text-sm font-ui mt-0.5" style={{ color: 'var(--mist)' }}>
                              {m.date ? new Date(m.date + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Date TBD'}
                              {m.time ? ` at ${m.time}` : ''}
                            </p>
                            {m.notes && <p className="text-xs font-ui mt-1" style={{ color: 'var(--mist)' }}>{m.notes}</p>}
                          </div>
                        </div>
                        {m.link ? (
                          <a href={m.link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-ui text-sm font-bold transition-all duration-200"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>
                            <ExternalLink size={14} /> Join Meeting
                          </a>
                        ) : (
                          <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-ui text-sm font-bold transition-all duration-200"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>
                            <Video size={14} /> Start Meeting
                          </a>
                        )}
                      </div>
                    ))}
                    {past.map(m => (
                      <div key={m.id} className="p-5 rounded-xl flex items-center justify-between gap-4 flex-wrap"
                        style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.08)', opacity: 0.6 }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Video size={16} style={{ color: 'var(--mist)' }} />
                          </div>
                          <div>
                            <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{m.title}</p>
                            <p className="text-sm font-ui mt-0.5" style={{ color: 'var(--mist)' }}>
                              {m.date ? new Date(m.date + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
                              {m.time ? ` at ${m.time}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-ui px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--mist)' }}>Past</span>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Upcoming bookings */}
            <section>
              <h2 className="text-lg font-display mb-4" style={{ color: 'var(--ivory)' }}>Upcoming Lessons</h2>
              {bookings.length === 0 ? (
                <div className="p-8 rounded-2xl text-center" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                  <Calendar size={32} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
                  <p className="font-ui mb-4" style={{ color: 'var(--mist)' }}>No lessons booked yet.</p>
                  <button onClick={() => setTab('book')} className="inline-block px-6 py-3 rounded-lg font-ui text-sm tracking-widest uppercase font-bold"
                    style={{ background: 'var(--gold)', color: 'var(--ink)' }}>Book a Lesson</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map(b => {
                    const isCancelled = b.status === 'cancelled';
                    return (
                      <div key={b.id} className="p-5 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)', opacity: isCancelled ? 0.6 : 1 }}>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)' }}>
                              <Calendar size={16} style={{ color: 'var(--gold)' }} />
                            </div>
                            <div>
                              <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{b.program}</p>
                              <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>{new Date(b.date).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })} at {b.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-ui tracking-widest uppercase"
                              style={{ background: isCancelled ? 'rgba(220,53,69,0.1)' : 'rgba(201,168,76,0.1)', color: isCancelled ? '#dc3545' : 'var(--gold)', border: `1px solid ${isCancelled ? 'rgba(220,53,69,0.3)' : 'rgba(201,168,76,0.3)'}` }}>
                              {b.status}
                            </span>
                            {!isCancelled && (
                              <>
                                <button onClick={() => handleReschedule(b)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-ui text-xs tracking-widest uppercase transition-all duration-200"
                                  style={{ background: 'rgba(201,168,76,0.08)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.2)' }}>
                                  <RefreshCw size={11} /> Reschedule
                                </button>
                                <button onClick={() => handleCancel(b.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-ui text-xs tracking-widest uppercase transition-all duration-200"
                                  style={{ background: 'rgba(220,53,69,0.08)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.2)' }}>
                                  <X size={11} /> Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Book tab */}
        {tab === 'book' && (
          <div className="p-8 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
            {bookingSuccess ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--success)' }} />
                <h3 className="text-2xl font-display mb-2" style={{ color: 'var(--ivory)' }}>Lesson Booked!</h3>
                <p className="font-ui" style={{ color: 'var(--mist)' }}>We will confirm your slot within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-7">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-display mb-1" style={{ color: 'var(--ivory)' }}>
                      {reschedulingId ? 'Reschedule Lesson' : 'Book a Lesson Slot'}
                    </h2>
                    <p className="font-ui text-sm" style={{ color: 'var(--mist)' }}>
                      {reschedulingId ? 'Pick a new day and time. We will re-confirm within 24 hours.' : 'Pick a day, time, and program. We will confirm within 24 hours.'}
                    </p>
                  </div>
                  {reschedulingId && (
                    <button onClick={() => { setReschedulingId(null); setTab('overview'); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-ui text-xs tracking-widest uppercase"
                      style={{ border: '1px solid rgba(201,168,76,0.2)', color: 'var(--mist)' }}>
                      <X size={12} /> Cancel
                    </button>
                  )}
                </div>

                {/* Program */}
                {!reschedulingId && <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Program</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Piano', 'Guitar & Bass', 'Drums & Percussion', 'Voice', 'Music Production', 'Ensembles'].map(p => (
                      <button key={p} onClick={() => setSelectedProgram(p)}
                        className="py-3 px-4 rounded-lg font-ui text-sm text-left transition-all duration-200"
                        style={{ background: selectedProgram === p ? 'rgba(201,168,76,0.15)' : 'var(--surface-3)', border: `1px solid ${selectedProgram === p ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`, color: selectedProgram === p ? 'var(--gold)' : 'var(--mist)' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>}

                {/* Day */}
                <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Day</label>
                  <div className="flex flex-wrap gap-2">
                    {days.map(d => {
                      const iso = d.toISOString().split('T')[0];
                      return (
                        <button key={iso} onClick={() => setSelectedDay(iso)}
                          className="px-4 py-2.5 rounded-lg font-ui text-sm transition-all duration-200"
                          style={{ background: selectedDay === iso ? 'rgba(201,168,76,0.15)' : 'var(--surface-3)', border: `1px solid ${selectedDay === iso ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`, color: selectedDay === iso ? 'var(--gold)' : 'var(--mist)' }}>
                          {d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Time</label>
                  <div className="flex flex-wrap gap-2">
                    {TIMES.map(t => (
                      <button key={t} onClick={() => setSelectedTime(t)}
                        className="px-4 py-2.5 rounded-lg font-ui text-sm transition-all duration-200"
                        style={{ background: selectedTime === t ? 'rgba(201,168,76,0.15)' : 'var(--surface-3)', border: `1px solid ${selectedTime === t ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`, color: selectedTime === t ? 'var(--gold)' : 'var(--mist)' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleBook} disabled={!selectedDay || !selectedTime || !selectedProgram || booking}
                  className="w-full py-4 rounded-lg font-ui text-sm tracking-widest uppercase font-bold flex items-center justify-center gap-2 transition-all duration-200"
                  style={{ background: (!selectedDay || !selectedTime || !selectedProgram) ? 'var(--surface-3)' : 'var(--gold)', color: (!selectedDay || !selectedTime || !selectedProgram) ? 'var(--mist)' : 'var(--ink)', cursor: (!selectedDay || !selectedTime || !selectedProgram) ? 'not-allowed' : 'pointer' }}>
                  <Calendar size={16} /> {booking ? 'Saving…' : reschedulingId ? 'Confirm Reschedule' : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
