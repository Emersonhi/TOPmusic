'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Music2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    router.push(role === 'student' ? '/student' : '/parent');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--ink)' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(201,168,76,0.05) 0%, transparent 60%)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 mb-10 font-ui text-sm tracking-widest uppercase transition-colors" style={{ color: 'var(--mist)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}>
          <ArrowLeft size={14} /> Back to Site
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-muted))' }}>
              <Music2 size={20} color="#0D0B0F" strokeWidth={2.5} />
            </div>
            <span className="text-2xl tracking-[0.15em] uppercase font-display font-bold">
              TOP<span style={{ color: 'var(--gold)' }}>music</span>
            </span>
          </Link>
          <h1 className="text-3xl font-display mb-2" style={{ color: 'var(--ivory)' }}>Welcome Back</h1>
          <p className="font-ui text-sm" style={{ color: 'var(--mist)' }}>Sign in to your portal</p>
        </div>

        <div className="p-8 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.15)' }}>
          {/* Role Toggle */}
          <div className="flex rounded-lg overflow-hidden mb-8 p-1" style={{ background: 'var(--surface-3)' }}>
            {(['student', 'parent'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)} className="flex-1 py-2.5 rounded-md font-ui text-sm tracking-widest uppercase transition-all duration-200"
                style={{
                  background: role === r ? 'var(--gold)' : 'transparent',
                  color: role === r ? 'var(--ink)' : 'var(--mist)',
                  fontWeight: role === r ? 700 : 400,
                }}>
                {r === 'student' ? 'Student' : 'Parent'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-4 py-3 rounded-lg font-ui text-sm outline-none transition-all duration-200"
                style={{ background: 'var(--surface-3)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
              />
            </div>
            <div>
              <label className="block text-xs font-ui tracking-widest uppercase mb-2" style={{ color: 'var(--mist)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-lg font-ui text-sm outline-none transition-all duration-200"
                  style={{ background: 'var(--surface-3)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--mist)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm font-ui px-3 py-2 rounded-lg" style={{ color: 'var(--error)', background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.2)' }}>{error}</p>}

            <div className="flex justify-end">
              <Link href="#" className="text-xs font-ui tracking-wide transition-colors" style={{ color: 'var(--gold-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gold-muted)')}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-ui text-sm tracking-[0.15em] uppercase transition-all duration-200"
              style={{ background: loading ? 'var(--gold-muted)' : 'var(--gold)', color: 'var(--ink)', fontWeight: 700 }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--gold-light)'; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; }}
            >
              {loading ? 'Signing in…' : `Sign in as ${role === 'student' ? 'Student' : 'Parent'}`}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm font-ui" style={{ color: 'var(--mist)' }}>
          Not enrolled yet?{' '}
          <Link href="/enroll" className="transition-colors" style={{ color: 'var(--gold)' }}>
            Start your free trial lesson
          </Link>
        </p>
      </div>
    </div>
  );
}
