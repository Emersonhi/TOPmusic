import Link from 'next/link';
import { Music2, Share2, Globe, Link as LinkIcon, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-muted))' }}
              >
                <Music2 size={18} color="#0D0B0F" strokeWidth={2.5} />
              </div>
              <span className="text-xl tracking-[0.15em] uppercase font-display font-bold">
                TOP<span style={{ color: 'var(--gold)' }}>music</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--mist)' }}>
              Where musical journeys begin. World-class instruction for all ages, all styles, all ambitions.
            </p>
            <div className="flex gap-4 mt-6">
              {[Share2, Globe, LinkIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--mist)' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'var(--gold)';
                    el.style.color = 'var(--gold)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(201,168,76,0.3)';
                    el.style.color = 'var(--mist)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-5 font-ui" style={{ color: 'var(--gold)' }}>Programs</h4>
            <ul className="space-y-3">
              {['Piano', 'Guitar & Bass', 'Drums & Percussion', 'Voice', 'Music Production', 'Early Childhood Music', 'Group Ensembles', 'Summer Intensives'].map(p => (
                <li key={p}>
                  <Link href="/programs" className="text-sm transition-colors duration-200 font-ui" style={{ color: 'var(--mist)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}
                  >{p}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-5 font-ui" style={{ color: 'var(--gold)' }}>Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/faculty', label: 'Our Faculty' },
                { href: '/enroll', label: 'Enroll' },
                { href: '/contact', label: 'Contact' },
                { href: '/login', label: 'Student Login' },
                { href: '/login?role=parent', label: 'Parent Login' },
                { href: '/#faq', label: 'FAQ' },
                { href: '/#about', label: 'About Us' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors duration-200 font-ui" style={{ color: 'var(--mist)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-5 font-ui" style={{ color: 'var(--gold)' }}>Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
                <span className="text-sm font-ui" style={{ color: 'var(--mist)' }}>123 Harmony Avenue<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <a href="tel:+12125550100" className="text-sm font-ui transition-colors" style={{ color: 'var(--mist)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}
                >(212) 555-0100</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <a href="mailto:hello@topmusic.com" className="text-sm font-ui transition-colors" style={{ color: 'var(--mist)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}
                >hello@topmusic.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-line my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>
            © {new Date().getFullYear()} TOPmusic. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map(t => (
              <Link key={t} href="#" className="text-xs font-ui transition-colors" style={{ color: 'var(--mist)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}
              >{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
