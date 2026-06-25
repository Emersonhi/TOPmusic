'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  const Field = ({ label, name, type = 'text', placeholder }: { label: string; name: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>{label}</label>
      <input
        type={type}
        value={form[name as keyof typeof form]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg font-ui text-sm outline-none transition-all duration-200"
        style={{ background: 'var(--surface-3)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
      />
    </div>
  );

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>
        {/* Header */}
        <div className="py-20 px-6 text-center" style={{ background: 'var(--surface)' }}>
          <p className="text-xs font-ui tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>Get in Touch</p>
          <h1 className="text-5xl font-display mb-4" style={{ color: 'var(--ivory)' }}>Contact Us</h1>
          <div className="gold-line w-24 mx-auto mb-5" />
          <p className="max-w-lg mx-auto font-ui" style={{ color: 'var(--mist)' }}>Have a question about enrollment, pricing, or lessons? Our team is happy to help — usually within 24 hours.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-display mb-6" style={{ color: 'var(--ivory)' }}>We&apos;d love to hear from you.</h2>
                <p className="font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>
                  Whether you are ready to enroll, exploring options for your child, or just curious about what we offer — reach out. No pressure, no sales pitch.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  { icon: MapPin, label: 'Studio Location', value: '255 Gamelin\nGatineau, J8Y 1W8' },
                  { icon: Phone, label: 'Phone', value: '(819) 598 0808' },
                  { icon: Mail, label: 'Email', value: 'hello@topmusic.com' },
                  { icon: Clock, label: 'Hours', value: 'Mon–Fri: 9am – 9pm\nSat–Sun: 10am – 6pm' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(201,168,76,0.1)' }}>
                        <Icon size={16} style={{ color: 'var(--gold)' }} />
                      </div>
                      <div>
                        <p className="text-xs font-ui tracking-widest uppercase mb-1" style={{ color: 'var(--mist)' }}>{item.label}</p>
                        <p className="font-ui text-sm whitespace-pre-line" style={{ color: 'var(--ivory)' }}>{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="p-10 rounded-2xl text-center" style={{ background: 'var(--surface-2)', border: '1px solid rgba(92,184,138,0.3)' }}>
                  <CheckCircle size={48} style={{ color: 'var(--success)', margin: '0 auto 20px' }} />
                  <h3 className="text-2xl font-display mb-3" style={{ color: 'var(--ivory)' }}>Message Sent!</h3>
                  <p className="font-ui" style={{ color: 'var(--mist)' }}>Thank you for reaching out. We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 rounded-2xl space-y-5" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name" name="name" placeholder="Your name" />
                    <Field label="Email" name="email" type="email" placeholder="you@email.com" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Phone (optional)" name="phone" type="tel" placeholder="(555) 000-0000" />
                    <div>
                      <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Subject</label>
                      <select
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg font-ui text-sm outline-none transition-all duration-200"
                        style={{ background: 'var(--surface-3)', border: '1px solid rgba(201,168,76,0.2)', color: form.subject ? 'var(--ivory)' : 'var(--mist)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
                      >
                        <option value="" disabled>Select a topic</option>
                        <option value="enrollment">Enrollment Inquiry</option>
                        <option value="trial">Free Trial Lesson</option>
                        <option value="pricing">Pricing & Plans</option>
                        <option value="programs">Program Information</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={5}
                      placeholder="Tell us about yourself, your experience level, and what you are looking for..."
                      className="w-full px-4 py-3 rounded-lg font-ui text-sm outline-none transition-all duration-200 resize-none"
                      style={{ background: 'var(--surface-3)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 rounded-lg font-ui text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all duration-200"
                    style={{ background: loading ? 'var(--gold-muted)' : 'var(--gold)', color: 'var(--ink)', fontWeight: 700 }}
                    onMouseEnter={e => { if (!loading) { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold-light)'; el.style.boxShadow = '0 8px 30px rgba(201,168,76,0.4)'; } }}
                    onMouseLeave={e => { if (!loading) { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--gold)'; el.style.boxShadow = 'none'; } }}>
                    <Send size={16} />
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
