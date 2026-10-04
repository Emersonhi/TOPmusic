'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Mail, Phone, Save, Plus, Trash2 } from 'lucide-react';
import MeetingsSection, { type Meeting } from '@/app/admin/_components/MeetingsSection';

type Enrollment = {
  id: string; student_name: string; age: string; parent_name: string;
  email: string; phone: string; program: string; lesson_length: string;
  frequency: string; format: string; experience: string;
  preferred_days: string[]; notes: string; status: string; created_at: string;
};

type Profile = { email: string; admin_notes: string; meetings: string; updated_at: string };
type Note = { text: string; created_at: string };

const PROGRAMS = ['Piano', 'Guitar', 'Voice / Singing', 'Drums / Percussion', 'Music Production', 'Group Ensembles'];
const LESSONS = ['30 minutes', '45 minutes', '60 minutes'];
const FREQUENCIES = ['Once a week', 'Twice a week', 'Bi-weekly'];
const FORMATS = ['In-person', 'Online', 'Hybrid'];
const STATUSES = ['Pending', 'Confirmed', 'Cancelled'];

export default function StudentProfile() {
  const params = useParams();
  const router = useRouter();
  const email = decodeURIComponent(params.email as string);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [info, setInfo] = useState({ student_name: '', age: '', parent_name: '', phone: '' });
  const [notes, setNotes] = useState<Note[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [saved, setSaved] = useState(false);
  const [updatingEnrollment, setUpdatingEnrollment] = useState<string | null>(null);

  useEffect(() => { load(); }, [email]);

  async function load() {
    const [enrRes, profRes] = await Promise.all([
      supabase.from('enrollments').select('*').eq('email', email).order('created_at', { ascending: false }),
      supabase.from('student_profiles').select('*').eq('email', email).maybeSingle(),
    ]);

    const enrs = (enrRes.data ?? []) as Enrollment[];
    setEnrollments(enrs);

    if (enrs.length > 0) {
      const e = enrs[0];
      setInfo({ student_name: e.student_name, age: e.age ?? '', parent_name: e.parent_name ?? '', phone: e.phone ?? '' });
    }

    const prof = profRes.data as Profile | null;
    if (prof) {
      try { setNotes(prof.admin_notes ? JSON.parse(prof.admin_notes) : []); } catch { setNotes([]); }
      try { setMeetings(prof.meetings ? JSON.parse(prof.meetings) : []); } catch { setMeetings([]); }
    }

    setLoading(false);
  }

  async function saveInfo() {
    setSavingInfo(true);
    await Promise.all(
      enrollments.map(e =>
        supabase.from('enrollments').update({
          student_name: info.student_name,
          age: info.age,
          parent_name: info.parent_name,
          phone: info.phone,
        }).eq('id', e.id)
      )
    );
    setSavingInfo(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function saveMeetings(updated: Meeting[]) {
    setMeetings(updated);
    await supabase.from('student_profiles').upsert({ email, meetings: JSON.stringify(updated), updated_at: new Date().toISOString() });
  }

  async function addNote() {
    if (!newNote.trim()) return;
    setSavingNote(true);
    const updated = [{ text: newNote.trim(), created_at: new Date().toISOString() }, ...notes];
    await supabase.from('student_profiles').upsert({ email, admin_notes: JSON.stringify(updated), updated_at: new Date().toISOString() });
    setNotes(updated);
    setNewNote('');
    setSavingNote(false);
  }

  async function deleteNote(idx: number) {
    const updated = notes.filter((_, i) => i !== idx);
    await supabase.from('student_profiles').upsert({ email, admin_notes: JSON.stringify(updated), updated_at: new Date().toISOString() });
    setNotes(updated);
  }

  async function updateEnrollmentStatus(id: string, status: string) {
    setUpdatingEnrollment(id);
    await supabase.from('enrollments').update({ status }).eq('id', id);
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    setUpdatingEnrollment(null);
  }

  const statusStyle = (s: string) => {
    const l = s.toLowerCase();
    if (l === 'confirmed') return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' };
    if (l === 'cancelled') return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' };
    return { color: 'var(--gold)', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)' };
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-lg font-ui text-sm outline-none transition-all duration-150';
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' };
  const labelCls = 'block text-xs font-ui tracking-widest uppercase mb-1.5';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (enrollments.length === 0) return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/students" className="flex items-center gap-2 text-sm font-ui mb-6" style={{ color: 'var(--mist)' }}>
        <ArrowLeft size={14} /> Back to Students
      </Link>
      <p className="font-ui" style={{ color: 'var(--mist)' }}>Student not found.</p>
    </div>
  );

  const initials = info.student_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/students" className="flex items-center gap-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
        <ArrowLeft size={14} /> Back to Students
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-display font-bold flex-shrink-0"
          style={{ background: 'rgba(201,168,76,0.2)', color: 'var(--gold)' }}>
          {initials || '?'}
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>{info.student_name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-xs font-ui" style={{ color: 'var(--gold)' }}>
              <Mail size={12} />{email}
            </a>
            {info.phone && <span className="flex items-center gap-1.5 text-xs font-ui" style={{ color: 'var(--mist)' }}><Phone size={12} />{info.phone}</span>}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
        <h2 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Full Name</label>
            <input value={info.student_name} onChange={e => setInfo(i => ({ ...i, student_name: e.target.value }))}
              className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Age</label>
            <input value={info.age} onChange={e => setInfo(i => ({ ...i, age: e.target.value }))}
              className={inputCls} style={inputStyle} placeholder="—" />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Parent / Guardian</label>
            <input value={info.parent_name} onChange={e => setInfo(i => ({ ...i, parent_name: e.target.value }))}
              className={inputCls} style={inputStyle} placeholder="—" />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Phone</label>
            <input value={info.phone} onChange={e => setInfo(i => ({ ...i, phone: e.target.value }))}
              className={inputCls} style={inputStyle} placeholder="—" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={saveInfo} disabled={savingInfo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-ui text-sm font-bold transition-all duration-150"
            style={{ background: saved ? 'rgba(16,185,129,0.2)' : 'var(--gold)', color: saved ? '#10b981' : 'var(--ink)', opacity: savingInfo ? 0.6 : 1 }}>
            <Save size={14} />{savingInfo ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Meetings */}
      <MeetingsSection meetings={meetings} onChange={saveMeetings} />

      {/* Notes */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
        <h2 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Admin Notes</h2>
        <div className="flex gap-2">
          <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
            rows={2} placeholder="Add a note about this student…"
            className="flex-1 px-3 py-2.5 rounded-lg font-ui text-sm outline-none"
            style={{ ...inputStyle, resize: 'none' }}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote(); }} />
          <button onClick={addNote} disabled={savingNote || !newNote.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-ui text-sm font-bold self-start transition-all duration-150"
            style={{ background: 'var(--gold)', color: 'var(--ink)', opacity: (!newNote.trim() || savingNote) ? 0.5 : 1 }}>
            <Plus size={14} /> Add
          </button>
        </div>
        {notes.length === 0 && <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>No notes yet.</p>}
        <div className="space-y-2">
          {notes.map((n, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.08)' }}>
              <div className="flex-1">
                <p className="text-sm font-ui whitespace-pre-wrap" style={{ color: 'var(--ivory)', lineHeight: '1.6' }}>{n.text}</p>
                <p className="text-xs font-ui mt-1" style={{ color: 'var(--mist)' }}>
                  {new Date(n.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button onClick={() => deleteNote(i)} className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(239,68,68,0.5)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.5)'}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollments */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
        <h2 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Enrollments</h2>
        <div className="space-y-3">
          {enrollments.map(e => {
            const sc = statusStyle(e.status);
            return (
              <div key={e.id} className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.08)' }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-ui font-semibold text-sm" style={{ color: 'var(--ivory)' }}>{e.program}</p>
                    <p className="text-xs font-ui mt-0.5" style={{ color: 'var(--mist)' }}>
                      {e.lesson_length} · {e.frequency} · {e.format}
                    </p>
                  </div>
                  <span className="text-xs font-ui px-2 py-1 rounded-full"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {e.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {STATUSES.map(st => (
                    <button key={st} disabled={e.status === st || updatingEnrollment === e.id}
                      onClick={() => updateEnrollmentStatus(e.id, st)}
                      className="px-3 py-1 rounded-lg font-ui text-xs transition-all duration-150"
                      style={{
                        background: e.status === st ? statusStyle(st).bg : 'rgba(255,255,255,0.04)',
                        color: e.status === st ? statusStyle(st).color : 'var(--mist)',
                        border: `1px solid ${e.status === st ? statusStyle(st).border : 'rgba(255,255,255,0.08)'}`,
                        opacity: updatingEnrollment === e.id ? 0.5 : 1,
                      }}>
                      {st}
                    </button>
                  ))}
                </div>
                {e.preferred_days?.length > 0 && (
                  <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>Preferred: {e.preferred_days.join(', ')}</p>
                )}
                {e.notes && <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>Notes: {e.notes}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
