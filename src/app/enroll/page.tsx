'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Check, ChevronRight, Music2, CheckCircle } from 'lucide-react';

const steps = ['Student Info', 'Program', 'Schedule', 'Confirm'];

const programs = [
  { id: 'piano', label: 'Piano', desc: 'Classical, jazz, pop — all styles', color: '#8B6FD4' },
  { id: 'guitar', label: 'Guitar', desc: 'Acoustic & electric', color: '#5B9ED4' },
  { id: 'bass', label: 'Bass', desc: 'Electric & upright bass', color: '#5B9ED4' },
  { id: 'drums', label: 'Drums', desc: 'All styles, all levels', color: '#D4845B' },
  { id: 'voice', label: 'Voice', desc: 'Pop, classical, musical theatre', color: '#5BD4A8' },
  { id: 'production', label: 'Music Production', desc: 'Ableton, Logic, mixing', color: '#D4C45B' },
];

const lessonLengths = ['30 min', '45 min', '60 min'];
const frequencies = ['1 lesson / week', '2 lessons / week', '3 lessons / week'];

export default function EnrollPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    studentName: '', age: '', parentName: '', email: '', phone: '',
    program: '', length: '45 min', frequency: '1 lesson / week',
    format: 'In-Person', experience: 'Beginner', notes: '',
    days: [] as string[],
  });

  const toggleDay = (d: string) => setData(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d] }));

  const inputStyle = {
    background: 'var(--surface-3)',
    border: '1px solid rgba(201,168,76,0.2)',
    color: 'var(--ivory)',
  };

  const inputClass = 'w-full px-4 py-3 rounded-lg font-ui text-sm outline-none transition-all duration-200';

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'var(--gold)'; };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; };

  if (done) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--ink)', paddingTop: '80px' }}>
        <div className="max-w-lg w-full text-center p-10 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(92,184,138,0.3)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(92,184,138,0.15)' }}>
            <CheckCircle size={32} style={{ color: 'var(--success)' }} />
          </div>
          <h2 className="text-3xl font-display mb-3" style={{ color: 'var(--ivory)' }}>You&apos;re Enrolled!</h2>
          <p className="font-ui leading-relaxed mb-8" style={{ color: 'var(--mist)' }}>
            Welcome to TOPmusic, {data.studentName}! We will reach out to {data.email} within 24 hours to confirm your first lesson and match you with the perfect teacher.
          </p>
          <div className="p-4 rounded-xl mb-6 text-left space-y-2" style={{ background: 'var(--surface-3)' }}>
            <div className="flex justify-between text-sm font-ui"><span style={{ color: 'var(--mist)' }}>Program</span><span style={{ color: 'var(--ivory)' }}>{programs.find(p => p.id === data.program)?.label}</span></div>
            <div className="flex justify-between text-sm font-ui"><span style={{ color: 'var(--mist)' }}>Lesson Length</span><span style={{ color: 'var(--ivory)' }}>{data.length}</span></div>
            <div className="flex justify-between text-sm font-ui"><span style={{ color: 'var(--mist)' }}>Frequency</span><span style={{ color: 'var(--ivory)' }}>{data.frequency}</span></div>
            <div className="flex justify-between text-sm font-ui"><span style={{ color: 'var(--mist)' }}>Format</span><span style={{ color: 'var(--ivory)' }}>{data.format}</span></div>
          </div>
          <a href="/" className="inline-block px-8 py-3 rounded-lg font-ui text-sm tracking-widest uppercase" style={{ background: 'var(--gold)', color: 'var(--ink)', fontWeight: 700 }}>Back to Home</a>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>
        <div className="py-16 px-6 text-center" style={{ background: 'var(--surface)' }}>
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>Join TOPmusic</p>
          <h1 className="text-5xl font-display mb-4" style={{ color: 'var(--ivory)' }}>Enroll Today</h1>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-md mx-auto font-ui" style={{ color: 'var(--mist)' }}>Your first 30-minute lesson is completely free. No credit card required.</p>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-16">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-ui text-sm font-bold transition-all duration-300"
                  style={{
                    background: i < step ? 'var(--gold)' : i === step ? 'var(--gold)' : 'var(--surface-3)',
                    color: i <= step ? 'var(--ink)' : 'var(--mist)',
                  }}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className="hidden sm:block text-xs font-ui tracking-widest uppercase" style={{ color: i === step ? 'var(--ivory)' : 'var(--mist)' }}>{s}</span>
                {i < steps.length - 1 && <div className="hidden sm:block ml-2 flex-1" style={{ width: 40, height: 1, background: i < step ? 'var(--gold)' : 'rgba(201,168,76,0.2)' }} />}
              </div>
            ))}
          </div>

          <div className="p-8 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
            {/* Step 0: Student Info */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-display mb-6" style={{ color: 'var(--ivory)' }}>About the Student</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Student Name *</label>
                    <input value={data.studentName} onChange={e => setData(f => ({ ...f, studentName: e.target.value }))} placeholder="Full name" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Age</label>
                    <input value={data.age} onChange={e => setData(f => ({ ...f, age: e.target.value }))} placeholder="e.g. 12" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Parent / Guardian Name (if student is under 18)</label>
                  <input value={data.parentName} onChange={e => setData(f => ({ ...f, parentName: e.target.value }))} placeholder="Parent name" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Email *</label>
                    <input value={data.email} onChange={e => setData(f => ({ ...f, email: e.target.value }))} type="email" placeholder="you@email.com" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Phone</label>
                    <input value={data.phone} onChange={e => setData(f => ({ ...f, phone: e.target.value }))} type="tel" placeholder="(555) 000-0000" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Program */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-display mb-6" style={{ color: 'var(--ivory)' }}>Choose Your Program</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {programs.map(p => (
                    <button key={p.id} onClick={() => setData(f => ({ ...f, program: p.id }))}
                      className="p-4 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: data.program === p.id ? `${p.color}20` : 'var(--surface-3)',
                        border: `1px solid ${data.program === p.id ? p.color : 'rgba(201,168,76,0.15)'}`,
                      }}>
                      <p className="font-display font-bold text-sm mb-1" style={{ color: data.program === p.id ? p.color : 'var(--ivory)' }}>{p.label}</p>
                      <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{p.desc}</p>
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Experience Level</label>
                  <select value={data.experience} onChange={e => setData(f => ({ ...f, experience: e.target.value }))} className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Professional</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Schedule */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--ivory)' }}>Schedule Preferences</h2>
                <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Lesson Length</label>
                  <div className="flex gap-3">
                    {lessonLengths.map(l => (
                      <button key={l} onClick={() => setData(f => ({ ...f, length: l }))} className="flex-1 py-3 rounded-lg font-ui text-sm transition-all duration-200"
                        style={{ background: data.length === l ? 'rgba(201,168,76,0.15)' : 'var(--surface-3)', border: `1px solid ${data.length === l ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`, color: data.length === l ? 'var(--gold)' : 'var(--mist)' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Frequency</label>
                  <div className="flex flex-col gap-2">
                    {frequencies.map(f => (
                      <button key={f} onClick={() => setData(d => ({ ...d, frequency: f }))} className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-ui text-sm"
                        style={{ background: data.frequency === f ? 'rgba(201,168,76,0.1)' : 'var(--surface-3)', border: `1px solid ${data.frequency === f ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`, color: data.frequency === f ? 'var(--gold)' : 'var(--mist)' }}>
                        <div className="w-4 h-4 rounded-full border flex items-center justify-center" style={{ borderColor: data.frequency === f ? 'var(--gold)' : 'var(--mist)' }}>
                          {data.frequency === f && <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />}
                        </div>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Preferred Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                      <button key={d} onClick={() => toggleDay(d)} className="px-4 py-2 rounded-lg font-ui text-sm transition-all duration-200"
                        style={{ background: data.days.includes(d) ? 'rgba(201,168,76,0.15)' : 'var(--surface-3)', border: `1px solid ${data.days.includes(d) ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`, color: data.days.includes(d) ? 'var(--gold)' : 'var(--mist)' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Lesson Format</label>
                  <div className="flex gap-3">
                    {['In-Person', 'Online', 'Hybrid'].map(fmt => (
                      <button key={fmt} onClick={() => setData(f => ({ ...f, format: fmt }))} className="flex-1 py-3 rounded-lg font-ui text-sm transition-all duration-200"
                        style={{ background: data.format === fmt ? 'rgba(201,168,76,0.15)' : 'var(--surface-3)', border: `1px solid ${data.format === fmt ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`, color: data.format === fmt ? 'var(--gold)' : 'var(--mist)' }}>
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-display mb-6" style={{ color: 'var(--ivory)' }}>Confirm Enrollment</h2>
                <div className="space-y-3 mb-6 p-5 rounded-xl" style={{ background: 'var(--surface-3)' }}>
                  {[
                    ['Student', data.studentName],
                    ['Program', programs.find(p => p.id === data.program)?.label || '—'],
                    ['Experience', data.experience],
                    ['Lesson Length', data.length],
                    ['Frequency', data.frequency],
                    ['Format', data.format],
                    ['Preferred Days', data.days.join(', ') || '—'],
                    ['Email', data.email],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm font-ui">
                      <span style={{ color: 'var(--mist)' }}>{k}</span>
                      <span style={{ color: 'var(--ivory)' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <div className="flex items-center gap-2">
                    <Music2 size={16} style={{ color: 'var(--gold)' }} />
                    <p className="text-sm font-ui" style={{ color: 'var(--gold)' }}>Your first 30-minute lesson is completely free. No credit card required.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Additional Notes (optional)</label>
                  <textarea value={data.notes} onChange={e => setData(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Anything else we should know?" className="w-full px-4 py-3 rounded-lg font-ui text-sm outline-none resize-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-lg font-ui text-sm tracking-widest uppercase transition-colors" style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--mist)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ivory)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; }}>
                  Back
                </button>
              ) : <div />}
              {step < steps.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 px-8 py-3 rounded-lg font-ui text-sm tracking-widest uppercase transition-all duration-200"
                  style={{ background: 'var(--gold)', color: 'var(--ink)', fontWeight: 700 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold-light)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; }}>
                  Continue <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={() => setDone(true)} className="flex items-center gap-2 px-8 py-3 rounded-lg font-ui text-sm tracking-widest uppercase transition-all duration-200"
                  style={{ background: 'var(--gold)', color: 'var(--ink)', fontWeight: 700 }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold-light)'; el.style.boxShadow = '0 8px 30px rgba(201,168,76,0.4)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold)'; el.style.boxShadow = 'none'; }}>
                  <CheckCircle size={14} /> Confirm Enrollment
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
