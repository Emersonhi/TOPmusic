'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Mail, Phone, Save, Plus, Trash2 } from 'lucide-react';

type Contact = {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; admin_notes: string; created_at: string;
};

type Note = { text: string; created_at: string };

export default function ContactProfile() {
  const params = useParams();
  const id = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, [id]);

  async function load() {
    const { data } = await supabase.from('contacts').select('*').eq('id', id).maybeSingle();
    if (data) {
      const c = data as Contact;
      setContact(c);
      setForm({ name: c.name, email: c.email, phone: c.phone ?? '', subject: c.subject ?? '', message: c.message ?? '' });
      try { setNotes(c.admin_notes ? JSON.parse(c.admin_notes) : []); } catch { setNotes([]); }
    }
    setLoading(false);
  }

  async function saveInfo() {
    setSavingInfo(true);
    await supabase.from('contacts').update({ ...form }).eq('id', id);
    setSavingInfo(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function addNote() {
    if (!newNote.trim()) return;
    setSavingNote(true);
    const updated = [{ text: newNote.trim(), created_at: new Date().toISOString() }, ...notes];
    await supabase.from('contacts').update({ admin_notes: JSON.stringify(updated) }).eq('id', id);
    setNotes(updated);
    setNewNote('');
    setSavingNote(false);
  }

  async function deleteNote(idx: number) {
    const updated = notes.filter((_, i) => i !== idx);
    await supabase.from('contacts').update({ admin_notes: JSON.stringify(updated) }).eq('id', id);
    setNotes(updated);
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-lg font-ui text-sm outline-none transition-all duration-150';
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' };
  const labelCls = 'block text-xs font-ui tracking-widest uppercase mb-1.5';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!contact) return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/contacts" className="flex items-center gap-2 text-sm font-ui mb-6" style={{ color: 'var(--mist)' }}>
        <ArrowLeft size={14} /> Back to Contacts
      </Link>
      <p className="font-ui" style={{ color: 'var(--mist)' }}>Contact not found.</p>
    </div>
  );

  const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/contacts" className="flex items-center gap-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
        <ArrowLeft size={14} /> Back to Contacts
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-display font-bold flex-shrink-0"
          style={{ background: 'rgba(201,168,76,0.2)', color: 'var(--gold)' }}>
          {initials || '?'}
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>{form.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <a href={`mailto:${form.email}`} className="flex items-center gap-1.5 text-xs font-ui" style={{ color: 'var(--gold)' }}>
              <Mail size={12} />{form.email}
            </a>
            {form.phone && <span className="flex items-center gap-1.5 text-xs font-ui" style={{ color: 'var(--mist)' }}><Phone size={12} />{form.phone}</span>}
          </div>
          <p className="text-xs font-ui mt-1" style={{ color: 'var(--mist)' }}>
            Received {new Date(contact.created_at).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
        <h2 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Contact Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className={inputCls} style={inputStyle} placeholder="—" />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Subject</label>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className={inputCls} style={inputStyle} placeholder="—" />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Message</label>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={4} className={inputCls} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={saveInfo} disabled={savingInfo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-ui text-sm font-bold transition-all duration-150"
            style={{ background: saved ? 'rgba(16,185,129,0.2)' : 'var(--gold)', color: saved ? '#10b981' : 'var(--ink)', opacity: savingInfo ? 0.6 : 1 }}>
            <Save size={14} />{savingInfo ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
          <a href={`mailto:${form.email}?subject=Re: ${encodeURIComponent(form.subject)}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-ui text-sm transition-all duration-150"
            style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
            <Mail size={14} /> Reply by Email
          </a>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
        <h2 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Admin Notes</h2>
        <div className="flex gap-2">
          <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
            rows={2} placeholder="Add a note about this contact…"
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
    </div>
  );
}
