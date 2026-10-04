'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, ChevronDown, ChevronUp, Mail, Phone, User } from 'lucide-react';

type Enrollment = {
  id: string; student_name: string; age: string; parent_name: string;
  email: string; phone: string; program: string; lesson_length: string;
  frequency: string; format: string; experience: string;
  preferred_days: string[]; notes: string; status: string; created_at: string;
};

type Student = {
  name: string; email: string; phone: string; parent_name: string; age: string;
  enrollments: Enrollment[];
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('enrollments').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        const map = new Map<string, Student>();
        for (const e of (data ?? []) as Enrollment[]) {
          const key = e.email.toLowerCase();
          if (!map.has(key)) {
            map.set(key, { name: e.student_name, email: e.email, phone: e.phone, parent_name: e.parent_name, age: e.age, enrollments: [] });
          }
          map.get(key)!.enrollments.push(e);
        }
        const list = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
        setStudents(list);
        setFiltered(list);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(students.filter(s =>
      s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.phone?.includes(q)
    ));
  }, [query, students]);

  const statusColor = (s: string) => {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>Students</h1>
          <p className="text-sm font-ui mt-1" style={{ color: 'var(--mist)' }}>{students.length} unique students</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, email, phone…"
            className="pl-9 pr-4 py-2.5 rounded-xl font-ui text-sm outline-none w-72"
            style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }} />
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16 font-ui" style={{ color: 'var(--mist)' }}>No students found.</p>
      )}

      <div className="space-y-3">
        {filtered.map(s => {
          const open = expanded === s.email;
          return (
            <div key={s.email} className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
              <button
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(open ? null : s.email)}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,168,76,0.15)' }}>
                  <User size={18} style={{ color: 'var(--gold)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-ui font-semibold text-sm" style={{ color: 'var(--ivory)' }}>{s.name}</p>
                  <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{s.email}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs font-ui px-2 py-1 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}>
                    {s.enrollments.length} enrollment{s.enrollments.length !== 1 ? 's' : ''}
                  </span>
                  {open ? <ChevronUp size={16} style={{ color: 'var(--mist)' }} /> : <ChevronDown size={16} style={{ color: 'var(--mist)' }} />}
                </div>
              </button>

              {open && (
                <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
                  <div className="px-6 py-4 grid grid-cols-2 gap-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                    <div>
                      <p className="text-xs font-ui tracking-widest uppercase mb-1" style={{ color: 'var(--mist)' }}>Age</p>
                      <p className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{s.age || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-ui tracking-widest uppercase mb-1" style={{ color: 'var(--mist)' }}>Parent / Guardian</p>
                      <p className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{s.parent_name || '—'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={13} style={{ color: 'var(--mist)' }} />
                      <a href={`mailto:${s.email}`} className="text-sm font-ui" style={{ color: 'var(--gold)' }}>{s.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} style={{ color: 'var(--mist)' }} />
                      <span className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{s.phone || '—'}</span>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Enrollments</p>
                    <div className="space-y-2">
                      {s.enrollments.map(e => {
                        const sc = statusColor(e.status);
                        return (
                          <div key={e.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.08)' }}>
                            <div>
                              <p className="text-sm font-ui font-medium" style={{ color: 'var(--ivory)' }}>{e.program}</p>
                              <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>
                                {e.lesson_length} · {e.frequency} · {e.format}
                              </p>
                            </div>
                            <span className="text-xs font-ui px-2 py-1 rounded-full"
                              style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                              {e.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
