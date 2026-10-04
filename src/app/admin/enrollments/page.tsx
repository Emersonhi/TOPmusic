'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter } from 'lucide-react';

type Enrollment = {
  id: string; student_name: string; age: string; parent_name: string;
  email: string; phone: string; program: string; lesson_length: string;
  frequency: string; format: string; experience: string;
  preferred_days: string[]; notes: string; status: string; created_at: string;
};

const STATUSES = ['All', 'Pending', 'Confirmed', 'Cancelled'];

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filtered, setFiltered] = useState<Enrollment[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from('enrollments').select('*').order('created_at', { ascending: false });
    setEnrollments((data ?? []) as Enrollment[]);
    setLoading(false);
  }

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(enrollments.filter(e => {
      const matchQ = !q || e.student_name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.program.toLowerCase().includes(q);
      const matchS = statusFilter === 'All' || e.status === statusFilter;
      return matchQ && matchS;
    }));
  }, [query, statusFilter, enrollments]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await supabase.from('enrollments').update({ status }).eq('id', id);
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    setUpdating(null);
  }

  const statusStyle = (s: string) => {
    const l = s.toLowerCase();
    if (l === 'confirmed') return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' };
    if (l === 'cancelled' || l === 'canceled') return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' };
    return { color: 'var(--gold)', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)' };
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>Enrollments</h1>
        <p className="text-sm font-ui mt-1" style={{ color: 'var(--mist)' }}>{filtered.length} of {enrollments.length} shown</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search student, email, program…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl font-ui text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }} />
        </div>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-4 py-2.5 rounded-xl font-ui text-sm transition-all duration-150"
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
        <p className="text-center py-16 font-ui" style={{ color: 'var(--mist)' }}>No enrollments match your filters.</p>
      )}

      <div className="space-y-4">
        {filtered.map(e => {
          const sc = statusStyle(e.status);
          return (
            <div key={e.id} className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-ui font-semibold" style={{ color: 'var(--ivory)' }}>{e.student_name}</h3>
                    <span className="text-xs font-ui px-2 py-1 rounded-full"
                      style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {e.status}
                    </span>
                  </div>
                  <p className="text-xs font-ui mt-1" style={{ color: 'var(--mist)' }}>
                    {new Date(e.created_at).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {['Pending', 'Confirmed', 'Cancelled'].map(st => (
                    <button key={st} disabled={e.status === st || updating === e.id}
                      onClick={() => updateStatus(e.id, st)}
                      className="px-3 py-1.5 rounded-lg font-ui text-xs transition-all duration-150"
                      style={{
                        background: e.status === st ? statusStyle(st).bg : 'rgba(255,255,255,0.04)',
                        color: e.status === st ? statusStyle(st).color : 'var(--mist)',
                        border: `1px solid ${e.status === st ? statusStyle(st).border : 'rgba(255,255,255,0.08)'}`,
                        opacity: updating === e.id ? 0.5 : 1,
                      }}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                {[
                  ['Program', e.program],
                  ['Lesson Length', e.lesson_length],
                  ['Frequency', e.frequency],
                  ['Format', e.format],
                  ['Email', e.email],
                  ['Phone', e.phone],
                  ['Age', e.age],
                  ['Parent / Guardian', e.parent_name],
                  ['Experience', e.experience],
                ].map(([label, val]) => val ? (
                  <div key={label as string}>
                    <p className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--mist)' }}>{label}</p>
                    <p className="text-sm font-ui mt-0.5" style={{ color: 'var(--ivory)' }}>{val}</p>
                  </div>
                ) : null)}
                {e.preferred_days?.length > 0 && (
                  <div>
                    <p className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Preferred Days</p>
                    <p className="text-sm font-ui mt-0.5" style={{ color: 'var(--ivory)' }}>{e.preferred_days.join(', ')}</p>
                  </div>
                )}
              </div>

              {e.notes && (
                <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.08)' }}>
                  <p className="text-xs font-ui tracking-widest uppercase mb-1" style={{ color: 'var(--mist)' }}>Notes</p>
                  <p className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{e.notes}</p>
                </div>
              )}

              <a href={`mailto:${e.email}`}
                className="inline-flex items-center gap-2 text-xs font-ui px-4 py-2 rounded-lg transition-all duration-150"
                style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
                Reply by Email
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
