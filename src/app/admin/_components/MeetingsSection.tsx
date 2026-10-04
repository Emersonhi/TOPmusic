'use client';
import { useState } from 'react';
import { Video, Plus, Trash2, ExternalLink, Calendar, Clock, X, Pencil, Check } from 'lucide-react';

export type Meeting = {
  id: string;
  title: string;
  link: string;
  date: string;
  time: string;
  notes: string;
  created_at: string;
};

interface Props {
  meetings: Meeting[];
  onChange: (updated: Meeting[]) => void;
}

const blank = { title: '', link: '', date: '', time: '', notes: '' };

const inputCls = 'w-full px-3 py-2.5 rounded-lg font-ui text-sm outline-none transition-all duration-150';
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' };
const labelCls = 'block text-xs font-ui tracking-widest uppercase mb-1.5';

export default function MeetingsSection({ meetings, onChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blank);

  function handleAdd() {
    if (!form.title.trim()) return;
    const updated = [
      { id: crypto.randomUUID(), ...form, link: form.link.trim() || '', created_at: new Date().toISOString() },
      ...meetings,
    ];
    onChange(updated);
    setForm(blank);
    setShowForm(false);
  }

  function handleDelete(id: string) {
    onChange(meetings.filter(m => m.id !== id));
  }

  function handleEdit(updated: Meeting) {
    onChange(meetings.map(m => m.id === updated.id ? updated : m));
  }

  const today = new Date().toISOString().split('T')[0];
  const upcoming = meetings.filter(m => !m.date || m.date >= today);
  const past = meetings.filter(m => m.date && m.date < today);

  return (
    <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video size={15} style={{ color: '#10b981' }} />
          <h2 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Google Meet</h2>
        </div>
        <div className="flex gap-2">
          <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-ui text-xs transition-all duration-150"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
            <Video size={13} /> Start Instant Meet
          </a>
          <button onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-ui text-xs transition-all duration-150"
            style={{ background: showForm ? 'rgba(255,255,255,0.06)' : 'var(--gold)', color: showForm ? 'var(--mist)' : 'var(--ink)', fontWeight: 700 }}>
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? 'Cancel' : 'Log Meeting'}
          </button>
        </div>
      </div>

      {showForm && (
        <MeetingForm
          value={form}
          onChange={setForm}
          onSave={handleAdd}
          onCancel={() => { setShowForm(false); setForm(blank); }}
          saveLabel="Save Meeting"
        />
      )}

      {meetings.length === 0 && !showForm && (
        <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>No meetings logged yet.</p>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-2">
          {past.length > 0 && <p className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Upcoming</p>}
          {upcoming.map(m => (
            <MeetingCard key={m.id} meeting={m} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Past</p>
          {past.map(m => (
            <MeetingCard key={m.id} meeting={m} onDelete={handleDelete} onEdit={handleEdit} isPast />
          ))}
        </div>
      )}
    </div>
  );
}

function MeetingForm({ value, onChange, onSave, onCancel, saveLabel }: {
  value: typeof blank; onChange: (v: typeof blank) => void;
  onSave: () => void; onCancel: () => void; saveLabel: string;
}) {
  return (
    <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.1)' }}>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelCls} style={{ color: 'var(--mist)' }}>Meeting Title *</label>
          <input value={value.title} onChange={e => onChange({ ...value, title: e.target.value })}
            className={inputCls} style={inputStyle} placeholder="e.g. Intro lesson, Progress check…" />
        </div>
        <div className="col-span-2">
          <label className={labelCls} style={{ color: 'var(--mist)' }}>Google Meet Link</label>
          <input value={value.link} onChange={e => onChange({ ...value, link: e.target.value })}
            className={inputCls} style={inputStyle} placeholder="https://meet.google.com/xxx-xxxx-xxx" />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--mist)' }}>Date</label>
          <input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })}
            className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--mist)' }}>Time</label>
          <input type="time" value={value.time} onChange={e => onChange({ ...value, time: e.target.value })}
            className={inputCls} style={inputStyle} />
        </div>
        <div className="col-span-2">
          <label className={labelCls} style={{ color: 'var(--mist)' }}>Notes</label>
          <textarea value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })}
            rows={2} className={inputCls} style={{ ...inputStyle, resize: 'none' }}
            placeholder="Agenda, outcomes, follow-ups…" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} disabled={!value.title.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-bold transition-all duration-150"
          style={{ background: 'var(--gold)', color: 'var(--ink)', opacity: !value.title.trim() ? 0.5 : 1 }}>
          <Check size={13} /> {saveLabel}
        </button>
        <button onClick={onCancel}
          className="px-4 py-2 rounded-lg font-ui text-sm transition-all duration-150"
          style={{ color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.1)' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function MeetingCard({ meeting: m, onDelete, onEdit, isPast = false }: {
  meeting: Meeting; onDelete: (id: string) => void; onEdit: (m: Meeting) => void; isPast?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: m.title, link: m.link, date: m.date, time: m.time, notes: m.notes });

  function handleSave() {
    onEdit({ ...m, ...draft });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)' }}>
        <MeetingForm
          value={draft}
          onChange={setDraft}
          onSave={handleSave}
          onCancel={() => { setEditing(false); setDraft({ title: m.title, link: m.link, date: m.date, time: m.time, notes: m.notes }); }}
          saveLabel="Update"
        />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.08)', opacity: isPast ? 0.7 : 1 }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: isPast ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.12)' }}>
        <Video size={14} style={{ color: isPast ? 'var(--mist)' : '#10b981' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-ui font-semibold text-sm" style={{ color: 'var(--ivory)' }}>{m.title}</p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {m.date && (
            <span className="flex items-center gap-1 text-xs font-ui" style={{ color: 'var(--mist)' }}>
              <Calendar size={11} />
              {new Date(m.date + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          )}
          {m.time && (
            <span className="flex items-center gap-1 text-xs font-ui" style={{ color: 'var(--mist)' }}>
              <Clock size={11} />{m.time}
            </span>
          )}
        </div>
        {m.notes && <p className="text-xs font-ui mt-1" style={{ color: 'var(--mist)' }}>{m.notes}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {m.link && (
          <a href={m.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-ui text-xs font-bold transition-all duration-150"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
            <ExternalLink size={11} /> Join
          </a>
        )}
        <button onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg transition-all duration-150"
          style={{ color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.08)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--gold)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--mist)'}>
          <Pencil size={13} />
        </button>
        <button onClick={() => onDelete(m.id)} style={{ color: 'rgba(239,68,68,0.5)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.5)'}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
