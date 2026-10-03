'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, Music2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const inputStyle = { background: 'var(--surface-3)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'var(--gold)'; };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        router.push('/dashboard');
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Check your email to confirm your account, then log in.' });
        setMode('login');
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--ink)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <Image src="/logo.webp" alt="TOP Music School" width={48} height={48} className="h-12 w-12 object-contain" />
          <span className="text-2xl font-display font-bold tracking-widest uppercase" style={{ color: 'var(--ivory)' }}>
            TOP<span style={{ color: 'var(--gold)' }}>music</span>
          </span>
        </Link>

        <div className="p-8 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
          {/* Tab toggle */}
          <div className="flex mb-8 rounded-lg overflow-hidden" style={{ background: 'var(--surface-3)' }}>
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setMessage(null); }}
                className="flex-1 py-3 font-ui text-sm tracking-widest uppercase transition-all duration-200"
                style={{ background: mode === m ? 'var(--gold)' : 'transparent', color: mode === m ? 'var(--ink)' : 'var(--mist)', fontWeight: mode === m ? 700 : 400 }}>
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg font-ui text-sm outline-none transition-all duration-200"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" minLength={6}
                  className="w-full pl-10 pr-10 py-3 rounded-lg font-ui text-sm outline-none transition-all duration-200"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {message && (
              <p className="text-sm font-ui px-4 py-3 rounded-lg"
                style={{ background: message.type === 'error' ? 'rgba(220,53,69,0.1)' : 'rgba(92,184,138,0.1)', color: message.type === 'error' ? '#dc3545' : 'var(--success)', border: `1px solid ${message.type === 'error' ? 'rgba(220,53,69,0.3)' : 'rgba(92,184,138,0.3)'}` }}>
                {message.text}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-lg font-ui text-sm tracking-widest uppercase font-bold transition-all duration-200"
              style={{ background: loading ? 'var(--gold-muted)' : 'var(--gold)', color: 'var(--ink)' }}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center mt-5 text-sm font-ui" style={{ color: 'var(--mist)' }}>
              No account?{' '}
              <button onClick={() => setMode('signup')} style={{ color: 'var(--gold)' }}>Sign up</button>
            </p>
          )}
        </div>

        <p className="text-center mt-6 text-xs font-ui" style={{ color: 'var(--mist)' }}>
          <Link href="/" style={{ color: 'var(--gold)' }}>← Back to home</Link>
        </p>
      </div>
    </main>
  );
}
