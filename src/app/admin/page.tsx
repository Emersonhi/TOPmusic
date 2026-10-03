'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { LogOut, Users, Calendar, MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react';

const ADMIN_EMAIL = 'info@topmusic.pro';

type Enrollment = {
  id: string; student_name: string; age: string; parent_name: string;
  email: string; phone: string; program: string; lesson_length: string;
  frequency: string; format: string; experience: string;
  preferred_days: string[]; notes: string; status: string; created_at: string;
};
type Booking = {
  id: string; user_email: string; date: string; time: string;
  program: string; status: string; created_at: string;
};
type Contact = {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; created_at: string;
};

type Tab = 'enrollments' | 'bookings' | 'contacts';

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Pending:   { bg: 'rgba(201,168,76,0.1)',   color: 'var(--gold)',    border: 'rgba(201,168,76,0.3)' },
  pending:   { bg: 'rgba(201,168,76,0.1)',   color: 'var(--gold)',    border: 'rgba(201,168,76,0.3)' },
  Confirmed: { bg: 'rgba(92,184,138,0.1)',   color: 'var(--success)', border: 'rgba(92,184,138,0.3)' },
  confirmed: { bg: 'rgba(92,184,138,0.1)',   color: 'var(--success)', border: 'rgba(92,184,138,0.3)' },
  Cancelled: { bg: 'rgba(220,53,69,0.1)',    color: '#dc3545',        border: 'rgba(220,53,69,0.3)' },
  cancelled: { bg: 'rgba(220,53,69,0.1)',    color: '#dc3545',        border: 'rgba(220,53,69,0.3)' },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS['Pending'];
  return (
    <span className="px-3 py-1 rounded-full text-xs font-ui tracking-widest uppercase whitespace-nowrap"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {status}
    </span>
  );
}

function fmt(dt: string) {
  return new Date(dt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('enrollments');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push('/login');
        return;
      }
      const [{ data: enr }, { data: bk }, { data: ct }] = await Promise.all([
        supabase.from('enrollments').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('date', { ascending: true }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      ]);
      setEnrollments(enr ?? []);
      setBookings(bk ?? []);
      setContacts(ct ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    setBookings(b => b.map(x => x.id === id ? { ...x, status } : x));

    if (status === 'confirmed') {
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        await fetch('/api/booking-confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: booking.user_email,
            program: booking.program,
            date: booking.date,
            time: booking.time,
          }),
        });
      }
    }
  };

  const updateEnrollmentStatus = async (id: string, status: string) => {
    await supabase.from('enrollments').update({ status }).eq('id', id);
    setEnrollments(e => e.map(x => x.id === id ? { ...x, status } : x));
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  const tabs = [
    { id: 'enrollments' as Tab, label: 'Enrollments', count: enrollments.length, icon: Users },
    { id: 'bookings'    as Tab, label: 'Bookings',    count: bookings.length,    icon: Calendar },
    { id: 'contacts'    as Tab, label: 'Contacts',    count: contacts.length,    icon: MessageSquare },
  ];

  return (
    <main className="min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.webp" alt="TOP Music School" width={40} height={40} className="h-10 w-10 object-contain" />
          <div>
            <span className="text-lg font-display font-bold tracking-widest uppercase" style={{ color: 'var(--ivory)' }}>
              TOP<span style={{ color: 'var(--gold)' }}>music</span>
            </span>
            <p className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--gold)' }}>Admin</p>
          </div>
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm transition-all duration-200"
          style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--mist)' }}>
          <LogOut size={14} /> Log out
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-display mb-2" style={{ color: 'var(--ivory)' }}>Admin Dashboard</h1>
        <p className="font-ui text-sm mb-8" style={{ color: 'var(--mist)' }}>All enrollments, bookings, and contact requests in one place.</p>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="p-5 rounded-xl text-left transition-all duration-200"
                style={{ background: tab === t.id ? 'rgba(201,168,76,0.1)' : 'var(--surface-2)', border: `1px solid ${tab === t.id ? 'var(--gold)' : 'rgba(201,168,76,0.12)'}` }}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={16} style={{ color: 'var(--gold)' }} />
                  <span className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--mist)' }}>{t.label}</span>
                </div>
                <p className="text-3xl font-display font-bold" style={{ color: 'var(--ivory)' }}>{t.count}</p>
              </button>
            );
          })}
        </div>

        {/* Enrollments */}
        {tab === 'enrollments' && (
          <div className="space-y-3">
            {enrollments.length === 0 && (
              <p className="text-center py-16 font-ui" style={{ color: 'var(--mist)' }}>No enrollments yet.</p>
            )}
            {enrollments.map(e => (
              <div key={e.id} className="p-6 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-display font-bold text-lg" style={{ color: 'var(--ivory)' }}>{e.student_name}</p>
                      <StatusBadge status={e.status ?? 'Pending'} />
                    </div>
                    <p className="text-sm font-ui" style={{ color: 'var(--gold)' }}>{e.program}</p>
                  </div>
                  <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{fmt(e.created_at)}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {[
                    ['Email', e.email],
                    ['Phone', e.phone || '—'],
                    ['Age', e.age || '—'],
                    ['Parent', e.parent_name || '—'],
                    ['Length', e.lesson_length],
                    ['Frequency', e.frequency],
                    ['Format', e.format],
                    ['Experience', e.experience],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs font-ui tracking-widest uppercase mb-0.5" style={{ color: 'var(--mist)' }}>{label}</p>
                      <p className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{val}</p>
                    </div>
                  ))}
                </div>

                {e.preferred_days?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-ui tracking-widest uppercase mb-1" style={{ color: 'var(--mist)' }}>Preferred Days</p>
                    <p className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{e.preferred_days.join(', ')}</p>
                  </div>
                )}
                {e.notes && (
                  <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--surface-3)' }}>
                    <p className="text-xs font-ui tracking-widest uppercase mb-1" style={{ color: 'var(--mist)' }}>Notes</p>
                    <p className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{e.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {['Pending', 'Confirmed', 'Cancelled'].map(s => (
                    <button key={s} onClick={() => updateEnrollmentStatus(e.id, s)}
                      className="px-4 py-2 rounded-lg font-ui text-xs tracking-widest uppercase transition-all duration-200"
                      style={{ background: e.status === s ? 'rgba(201,168,76,0.15)' : 'var(--surface-3)', border: `1px solid ${e.status === s ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`, color: e.status === s ? 'var(--gold)' : 'var(--mist)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings */}
        {tab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 && (
              <p className="text-center py-16 font-ui" style={{ color: 'var(--mist)' }}>No bookings yet.</p>
            )}
            {bookings.map(b => (
              <div key={b.id} className="p-6 rounded-xl flex items-center justify-between gap-4 flex-wrap"
                style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)' }}>
                    <Calendar size={18} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <p className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{b.program}</p>
                    <p className="text-sm font-ui mt-0.5" style={{ color: 'var(--mist)' }}>
                      {new Date(b.date).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })} at {b.time}
                    </p>
                    <p className="text-xs font-ui mt-0.5" style={{ color: 'var(--gold)' }}>{b.user_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => updateBookingStatus(b.id, 'confirmed')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-ui text-xs tracking-widest uppercase transition-all duration-200"
                        style={{ background: 'rgba(92,184,138,0.1)', color: 'var(--success)', border: '1px solid rgba(92,184,138,0.3)' }}>
                        <CheckCircle size={12} /> Confirm
                      </button>
                      <button onClick={() => updateBookingStatus(b.id, 'cancelled')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-ui text-xs tracking-widest uppercase transition-all duration-200"
                        style={{ background: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)' }}>
                        <XCircle size={12} /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contacts */}
        {tab === 'contacts' && (
          <div className="space-y-3">
            {contacts.length === 0 && (
              <p className="text-center py-16 font-ui" style={{ color: 'var(--mist)' }}>No contact messages yet.</p>
            )}
            {contacts.map(c => (
              <div key={c.id} className="p-6 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <p className="font-display font-bold text-lg" style={{ color: 'var(--ivory)' }}>{c.name}</p>
                    <p className="text-sm font-ui" style={{ color: 'var(--gold)' }}>{c.subject || 'General Inquiry'}</p>
                  </div>
                  <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{fmt(c.created_at)}</p>
                </div>
                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-xs font-ui tracking-widest uppercase mb-0.5" style={{ color: 'var(--mist)' }}>Email</p>
                    <a href={`mailto:${c.email}`} className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{c.email}</a>
                  </div>
                  {c.phone && (
                    <div>
                      <p className="text-xs font-ui tracking-widest uppercase mb-0.5" style={{ color: 'var(--mist)' }}>Phone</p>
                      <p className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{c.phone}</p>
                    </div>
                  )}
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'var(--surface-3)' }}>
                  <p className="text-sm font-ui whitespace-pre-wrap" style={{ color: 'var(--ivory)' }}>{c.message}</p>
                </div>
                <a href={`mailto:${c.email}`}
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg font-ui text-xs tracking-widest uppercase transition-all duration-200"
                  style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
                  Reply by Email
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
