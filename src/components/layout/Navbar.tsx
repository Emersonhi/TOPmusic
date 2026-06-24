'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Music2 } from 'lucide-react';

const links = [
  { href: '/#programs', label: 'Programs' },
  { href: '/#faculty', label: 'Faculty' },
  { href: '/#about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(13,11,15,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-muted))' }}
          >
            <Music2 size={18} color="#0D0B0F" strokeWidth={2.5} />
          </div>
          <span
            className="text-xl tracking-[0.15em] uppercase font-display font-bold"
            style={{ color: 'var(--ivory)' }}
          >
            TOP<span style={{ color: 'var(--gold)' }}>music</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 font-ui text-sm tracking-widest uppercase">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors duration-200"
              style={{ color: 'var(--mist)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded font-ui text-sm tracking-widest uppercase transition-all duration-200"
            style={{ color: 'var(--gold)', border: '1px solid var(--gold-muted)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            Login
          </Link>
          <Link
            href="/enroll"
            className="px-5 py-2 rounded font-ui text-sm tracking-widest uppercase transition-all duration-200"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--gold-light)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--gold)';
            }}
          >
            Enroll
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          style={{ color: 'var(--ivory)' }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 pb-8 pt-4 flex flex-col gap-5"
          style={{ background: 'rgba(13,11,15,0.98)', borderTop: '1px solid rgba(201,168,76,0.15)' }}
        >
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="font-ui text-sm tracking-widest uppercase"
              style={{ color: 'var(--ivory)' }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="font-ui text-sm tracking-widest uppercase" style={{ color: 'var(--gold)' }} onClick={() => setOpen(false)}>Login</Link>
          <Link
            href="/enroll"
            className="px-5 py-3 rounded font-ui text-sm tracking-widest uppercase text-center"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            onClick={() => setOpen(false)}
          >
            Enroll Now
          </Link>
        </div>
      )}
    </header>
  );
}
