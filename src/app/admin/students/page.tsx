'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, ChevronDown, ChevronUp, Mail, Phone, User, Plus, X } from 'lucide-react';

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

const PROGRAMS = ['Piano', 'Guitar', 'Voice / Singing', 'Drums / Percussion', 'Music Production', 'Group Ensembles'];
const LESSONS = ['30 minutes', '45 minutes', '60 minutes'];
const FREQUENCIES = ['Once a week', 'Twice a week', 'Bi-weekly'];
const FORMATS = ['In-person', 'Online', 'Hybrid'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const blank = { student_name: '', age: '', parent_name: '', email: '', phone: '', program: PROGRAMS[0], lesson_length: LESSONS[0], frequency: FREQUENCIES[0], format: FORMATS[0], experience: '', preferred_days: [] as string[], notes: '', status: 'Confirmed' };

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from('enrollments').select('*').order('created_at', { ascending: false });
    buildStudents((data ?? []) as Enrollment[]);
    setLoading(false);
  }

  function buildStudents(data: Enrollment[]) {
    const map = new Map<string, Student>();
    for (const e of data) {
      const key = e.email.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { name: e.student_name, email: e.email, phone: e.phone, parent_name: e.parent_name, age: e.age, enrollments: [] });
      }
      map.get(key)!.enrollments.push(e);
    }
    const list = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    setStudents(list);
    setFiltered(list);
  }

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(students.filter(s =>
      s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.phone?.includes(q)
    ));
  }, [query, students]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('enrollments').insert([{
      ...form,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }]);
    if (err) { setError(err.message); setSaving(false); return; }
    await load();
    setShowModal(false);
    setForm(blank);
    setSaving(false);
  }

  function toggleDay(day: string) {
    setForm(f => ({
      ...f,
      preferred_days: f.preferred_days.includes(day) ? f.preferred_days.filter(d => d !== day) : [...f.preferred_days, day],
    }));
  }

  const statusColor = (s: string) => {
    const l = s.toLowerCase();
    if (l === 'confirmed') return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' };
    if (l === 'cancelled' || l === 'canceled') return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' };
    return { color: 'var(--gold)', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)' };
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-lg font-ui text-sm outline-none transition-all duration-150';
  const inputStyle = { background: 'var(--surface-3, #1a1820)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' };
  const labelCls = 'block text-xs font-ui tracking-widest uppercase mb-1.5';

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
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, email, phone…"
              className="pl-9 pr-4 py-2.5 rounded-xl font-ui text-sm outline-none w-64"
              style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }} />
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-ui text-sm font-bold transition-all duration-150"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
            <Plus size={15} /> Add Student
          </button>
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

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
              <h2 className="font-display font-bold text-lg tracking-wide" style={{ color: 'var(--ivory)' }}>Add Student</h2>
              <button onClick={() => { setShowModal(false); setForm(blank); setError(''); }}
                style={{ color: 'var(--mist)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAdd} className="overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} style={{ color: 'var(--mist)' }}>Student Name *</label>
                  <input required value={form.student_name} onChange={e => setForm(f => ({ ...f, student_name: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="Full name" />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--mist)' }}>Age</label>
                  <input value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="e.g. 12" />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--mist)' }}>Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="student@email.com" />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--mist)' }}>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="(819) 000-0000" />
                </div>
                <div className="col-span-2">
                  <label className={labelCls} style={{ color: 'var(--mist)' }}>Parent / Guardian</label>
                  <input value={form.parent_name} onChange={e => setForm(f => ({ ...f, parent_name: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="Parent or guardian name" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {([['Program', 'program', PROGRAMS], ['Lesson Length', 'lesson_length', LESSONS], ['Frequency', 'frequency', FREQUENCIES], ['Format', 'format', FORMATS]] as const).map(([label, key, opts]) => (
                  <div key={key}>
                    <label className={labelCls} style={{ color: 'var(--mist)' }}>{label}</label>
                    <select value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className={inputCls} style={inputStyle}>
                      {(opts as readonly string[]).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <label className={labelCls} style={{ color: 'var(--mist)' }}>Preferred Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(d => (
                    <button key={d} type="button" onClick={() => toggleDay(d)}
                      className="px-3 py-1.5 rounded-lg font-ui text-xs transition-all duration-150"
                      style={{
                        background: form.preferred_days.includes(d) ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                        color: form.preferred_days.includes(d) ? 'var(--ink)' : 'var(--mist)',
                        border: form.preferred_days.includes(d) ? 'none' : '1px solid rgba(201,168,76,0.2)',
                        fontWeight: form.preferred_days.includes(d) ? 700 : 400,
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls} style={{ color: 'var(--mist)' }}>Experience / Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3} className={inputCls} style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Any relevant background or notes…" />
              </div>

              <div>
                <label className={labelCls} style={{ color: 'var(--mist)' }}>Status</label>
                <div className="flex gap-2">
                  {['Pending', 'Confirmed'].map(s => (
                    <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                      className="px-4 py-2 rounded-lg font-ui text-sm transition-all duration-150"
                      style={{
                        background: form.status === s ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                        color: form.status === s ? 'var(--ink)' : 'var(--mist)',
                        border: form.status === s ? 'none' : '1px solid rgba(201,168,76,0.2)',
                        fontWeight: form.status === s ? 700 : 400,
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm font-ui px-4 py-3 rounded-lg" style={{ background: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)' }}>{error}</p>}
            </form>

            <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
              <button type="button" onClick={() => { setShowModal(false); setForm(blank); setError(''); }}
                className="px-5 py-2.5 rounded-xl font-ui text-sm" style={{ color: 'var(--mist)', border: '1px solid rgba(201,168,76,0.2)' }}>
                Cancel
              </button>
              <button onClick={handleAdd} disabled={saving}
                className="px-5 py-2.5 rounded-xl font-ui text-sm font-bold transition-all duration-150"
                style={{ background: saving ? 'rgba(201,168,76,0.5)' : 'var(--gold)', color: 'var(--ink)' }}>
                {saving ? 'Saving…' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
