'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, Mail, Phone, Plus, X } from 'lucide-react';

type Contact = {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; role: string; created_at: string;
};

const ROLE_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  contact: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.3)' },
  student: { color: 'var(--gold)', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)' },
  teacher: { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)' },
  user:    { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)' },
  admin:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)' },
};

const blank = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filtered, setFiltered] = useState<Contact[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    setContacts((data ?? []) as Contact[]);
    setLoading(false);
  }

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(contacts.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q)
    ));
  }, [query, contacts]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('contacts').insert([{
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
          <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>Contacts</h1>
          <p className="text-sm font-ui mt-1" style={{ color: 'var(--mist)' }}>{filtered.length} message{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search name, email, subject…"
              className="pl-9 pr-4 py-2.5 rounded-xl font-ui text-sm outline-none w-64"
              style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }} />
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-ui text-sm font-bold transition-all duration-150"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
            <Plus size={15} /> Add Contact
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16 font-ui" style={{ color: 'var(--mist)' }}>No messages yet.</p>
      )}

      <div className="space-y-4">
        {filtered.map(c => (
          <div key={c.id} className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-ui font-semibold" style={{ color: 'var(--ivory)' }}>{c.name}</h3>
                  {(() => { const rs = ROLE_STYLES[c.role ?? 'contact'] ?? ROLE_STYLES.contact; return (
                    <span className="text-xs font-ui px-2 py-0.5 rounded-full capitalize font-semibold"
                      style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}>
                      {c.role ?? 'contact'}
                    </span>
                  ); })()}
                </div>
                <p className="text-xs font-ui mt-0.5" style={{ color: 'var(--mist)' }}>
                  {new Date(c.created_at).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/contacts/${c.id}`}
                  className="px-4 py-2 rounded-lg font-ui text-xs transition-all duration-150"
                  style={{ color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  View Profile
                </Link>
                <a href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-xs transition-all duration-150"
                  style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
                  <Mail size={12} /> Reply
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Mail size={13} style={{ color: 'var(--mist)' }} />
                <a href={`mailto:${c.email}`} className="text-sm font-ui" style={{ color: 'var(--gold)' }}>{c.email}</a>
              </div>
              {c.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} style={{ color: 'var(--mist)' }} />
                  <span className="text-sm font-ui" style={{ color: 'var(--ivory)' }}>{c.phone}</span>
                </div>
              )}
            </div>

            {c.subject && (
              <p className="text-sm font-ui font-medium" style={{ color: 'var(--ivory)' }}>
                Subject: <span style={{ color: 'var(--gold)' }}>{c.subject}</span>
              </p>
            )}

            <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.08)' }}>
              <p className="text-sm font-ui whitespace-pre-wrap" style={{ color: 'var(--ivory)', lineHeight: '1.7' }}>{c.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
              <h2 className="font-display font-bold text-lg tracking-wide" style={{ color: 'var(--ivory)' }}>Add Contact</h2>
              <button onClick={() => { setShowModal(false); setForm(blank); setError(''); }}
                style={{ color: 'var(--mist)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAdd} className="overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} style={{ color: 'var(--mist)' }}>Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="Full name" />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--mist)' }}>Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="contact@email.com" />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--mist)' }}>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="(819) 000-0000" />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--mist)' }}>Subject</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="Reason for contact" />
                </div>
              </div>

              <div>
                <label className={labelCls} style={{ color: 'var(--mist)' }}>Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={4} className={inputCls} style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Message or notes…" />
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
                {saving ? 'Saving…' : 'Add Contact'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
