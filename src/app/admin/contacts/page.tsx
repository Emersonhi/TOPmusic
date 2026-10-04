'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Mail, Phone } from 'lucide-react';

type Contact = {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; created_at: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filtered, setFiltered] = useState<Contact[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('contacts').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        setContacts((data ?? []) as Contact[]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(contacts.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q)
    ));
  }, [query, contacts]);

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
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search name, email, subject…"
            className="pl-9 pr-4 py-2.5 rounded-xl font-ui text-sm outline-none w-72"
            style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }} />
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
                <h3 className="font-ui font-semibold" style={{ color: 'var(--ivory)' }}>{c.name}</h3>
                <p className="text-xs font-ui mt-0.5" style={{ color: 'var(--mist)' }}>
                  {new Date(c.created_at).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <a href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-xs transition-all duration-150"
                style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
                <Mail size={12} /> Reply
              </a>
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
    </div>
  );
}
