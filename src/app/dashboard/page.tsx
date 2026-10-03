'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { LogOut, Calendar, Music2, Clock, BookOpen, CheckCircle, ChevronRight } from 'lucide-react';

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
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<'overview' | 'book'>('overview');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const days = nextDays(14);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserEmail(session.user.email ?? '');

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
      setLoading(false);
    }
    load();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleBook = async () => {
    if (!selectedDay || !selectedTime || !selectedProgram) return;
    setBooking(true);
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('bookings').insert({
      user_email: session?.user.email,
      date: selectedDay,
      time: selectedTime,
      program: selectedProgram,
      status: 'pending',
    });
    const { data: bk } = await supabase.from('bookings').select('*').eq('user_email', session?.user.email).order('date', { ascending: true });
    setBookings(bk ?? []);
    setBookingSuccess(true);
    setSelectedDay(''); setSelectedTime(''); setSelectedProgram('');
    setBooking(false);
    setTimeout(() => { setBookingSuccess(false); setTab('overview'); }, 2500);
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
        <h1 className="text-3xl font-display mb-2" style={{ color: 'var(--ivory)' }}>My Dashboard</h1>
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
                  {bookings.map(b => (
                    <div key={b.id} className="p-5 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)' }}>
                          <Calendar size={16} style={{ color: 'var(--gold)' }} />
                        </div>
                        <div>
                          <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{b.program}</p>
                          <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>{new Date(b.date).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })} at {b.time}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-ui tracking-widest uppercase"
                        style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
                        {b.status}
                      </span>
                    </div>
                  ))}
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
                <div>
                  <h2 className="text-2xl font-display mb-1" style={{ color: 'var(--ivory)' }}>Book a Lesson Slot</h2>
                  <p className="font-ui text-sm" style={{ color: 'var(--mist)' }}>Pick a day, time, and program. We will confirm within 24 hours.</p>
                </div>

                {/* Program */}
                <div>
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
                </div>

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
                  <Calendar size={16} /> {booking ? 'Booking…' : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
