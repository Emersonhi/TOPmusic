'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Calendar, Clock } from 'lucide-react';

type Booking = {
  id: string; user_email: string; date: string; time: string;
  program: string; status: string; created_at: string;
};

const STATUSES = ['All', 'pending', 'confirmed', 'cancelled'];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from('bookings').select('*').order('date', { ascending: true });
    setBookings((data ?? []) as Booking[]);
    setLoading(false);
  }

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(bookings.filter(b => {
      const isUpcoming = b.date >= today;
      const matchTab = tab === 'upcoming' ? isUpcoming : !isUpcoming;
      const matchQ = !q || b.user_email.toLowerCase().includes(q) || b.program.toLowerCase().includes(q);
      const matchS = statusFilter === 'All' || b.status === statusFilter;
      return matchTab && matchQ && matchS;
    }));
  }, [query, statusFilter, bookings, tab]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const booking = bookings.find(b => b.id === id);
    if (status === 'confirmed' && booking) {
      await fetch('/api/booking-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: booking.user_email, program: booking.program, date: booking.date, time: booking.time }),
      });
    }
    await supabase.from('bookings').update({ status }).eq('id', id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setUpdating(null);
  }

  const statusStyle = (s: string) => {
    if (s === 'confirmed') return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'Confirmed' };
    if (s === 'cancelled' || s === 'canceled') return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Cancelled' };
    return { color: 'var(--gold)', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)', label: 'Pending' };
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>Bookings</h1>
        <p className="text-sm font-ui mt-1" style={{ color: 'var(--mist)' }}>{filtered.length} shown</p>
      </div>

      {/* Upcoming / Past tabs */}
      <div className="flex rounded-xl overflow-hidden w-fit" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
        {(['upcoming', 'past'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-6 py-2.5 font-ui text-sm tracking-widest uppercase transition-all duration-150"
            style={{
              background: tab === t ? 'var(--gold)' : 'transparent',
              color: tab === t ? 'var(--ink)' : 'var(--mist)',
              fontWeight: tab === t ? 700 : 400,
            }}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search email, program…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl font-ui text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }} />
        </div>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-xl font-ui text-xs capitalize transition-all duration-150"
              style={{
                background: statusFilter === s ? 'var(--gold)' : 'var(--surface)',
                color: statusFilter === s ? 'var(--ink)' : 'var(--mist)',
                border: statusFilter === s ? 'none' : '1px solid rgba(201,168,76,0.2)',
                fontWeight: statusFilter === s ? 700 : 400,
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16 font-ui" style={{ color: 'var(--mist)' }}>No bookings found.</p>
      )}

      <div className="space-y-3">
        {filtered.map(b => {
          const sc = statusStyle(b.status);
          const isToday = b.date === today;
          return (
            <div key={b.id} className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: `1px solid ${isToday ? 'rgba(201,168,76,0.35)' : 'rgba(201,168,76,0.12)'}` }}>
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-ui font-semibold text-sm" style={{ color: 'var(--ivory)' }}>{b.program}</span>
                    {isToday && <span className="text-xs font-ui px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold)' }}>Today</span>}
                    <span className="text-xs font-ui px-2 py-1 rounded-full" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-xs font-ui mt-1" style={{ color: 'var(--mist)' }}>{b.user_email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} style={{ color: 'var(--mist)' }} />
                      <span className="text-xs font-ui" style={{ color: 'var(--ivory)' }}>
                        {new Date(b.date + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} style={{ color: 'var(--mist)' }} />
                      <span className="text-xs font-ui" style={{ color: 'var(--ivory)' }}>{b.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {b.status !== 'confirmed' && (
                    <button disabled={updating === b.id} onClick={() => updateStatus(b.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-lg font-ui text-xs transition-all duration-150"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', opacity: updating === b.id ? 0.5 : 1 }}>
                      {updating === b.id ? 'Saving…' : 'Confirm'}
                    </button>
                  )}
                  {b.status !== 'cancelled' && (
                    <button disabled={updating === b.id} onClick={() => updateStatus(b.id, 'cancelled')}
                      className="px-3 py-1.5 rounded-lg font-ui text-xs transition-all duration-150"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', opacity: updating === b.id ? 0.5 : 1 }}>
                      Cancel
                    </button>
                  )}
                  <a href={`mailto:${b.user_email}`}
                    className="px-3 py-1.5 rounded-lg font-ui text-xs transition-all duration-150"
                    style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
                    Email
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
