'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogOut, Mail, Phone, BookOpen, Calendar, Music2, ChevronRight, Bell, Shield } from 'lucide-react';

type Profile = { name: string; email: string; phone: string };

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({ name: '', email: '', phone: '' });
  const [enrollCount, setEnrollCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const email = session.user.email!;
      const name = session.user.user_metadata?.full_name ?? '';

      const { data: enr } = await supabase.from('enrollments').select('id').eq('email', email);
      const { data: ce } = await supabase.from('course_enrollments').select('id').ilike('student_email', email);

      let phone = '';
      if ((enr?.length ?? 0) > 0) {
        const { data: full } = await supabase.from('enrollments').select('phone').eq('email', email).maybeSingle();
        phone = full?.phone ?? '';
      }

      setProfile({ name, email, phone });
      setEnrollCount(enr?.length ?? 0);
      setCourseCount(ce?.length ?? 0);
      setLoading(false);
    }
    load();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const initials = profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="space-y-6 pb-2">
      {/* Avatar + name */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display font-bold mb-3"
          style={{ background: 'rgba(221,118,52,0.2)', color: 'var(--gold)', border: '2px solid rgba(221,118,52,0.4)' }}>
          {initials}
        </div>
        <h1 className="text-xl font-display font-bold" style={{ color: 'var(--ivory)' }}>{profile.name || 'Student'}</h1>
        <p className="text-sm font-ui mt-0.5" style={{ color: 'var(--gold)' }}>{profile.email}</p>
        {profile.phone && <p className="text-xs font-ui mt-0.5" style={{ color: 'var(--mist)' }}>{profile.phone}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
          <p className="text-2xl font-display font-bold" style={{ color: 'var(--gold)' }}>{enrollCount}</p>
          <p className="text-xs font-ui mt-1" style={{ color: 'var(--mist)' }}>Enrollment{enrollCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
          <p className="text-2xl font-display font-bold" style={{ color: 'var(--gold)' }}>{courseCount}</p>
          <p className="text-xs font-ui mt-1" style={{ color: 'var(--mist)' }}>Course{courseCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Menu links */}
      <div className="rounded-2xl overflow-hidden divide-y" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
        {[
          { href: '/dashboard/courses', icon: BookOpen, label: 'My Courses' },
          { href: '/dashboard?tab=book', icon: Calendar, label: 'Book a Lesson' },
          { href: '/programs', icon: Music2, label: 'Programs' },
          { href: '/enroll', icon: Music2, label: 'Enroll in a Program' },
          { href: '/contact', icon: Mail, label: 'Contact Us' },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]">
            <Icon size={18} style={{ color: 'var(--gold)' }} />
            <span className="flex-1 text-sm font-ui" style={{ color: 'var(--ivory)' }}>{label}</span>
            <ChevronRight size={16} style={{ color: 'var(--mist)' }} />
          </Link>
        ))}
      </div>

      {/* App info */}
      <div className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.08)' }}>
        <Image src="/logo.webp" alt="TOPmusic" width={36} height={36} className="h-9 w-9 object-contain" />
        <div>
          <p className="text-sm font-display font-bold" style={{ color: 'var(--ivory)' }}>
            TOP<span style={{ color: 'var(--gold)' }}>music</span> School
          </p>
          <p className="text-xs font-ui" style={{ color: 'var(--mist)' }}>255 Gamelin, Gatineau J8Y 1W8</p>
          <a href="tel:+18195980808" className="text-xs font-ui" style={{ color: 'var(--gold)' }}>(819) 598 0808</a>
        </div>
      </div>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-ui text-sm transition-all duration-150"
        style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
        <LogOut size={16} /> Log Out
      </button>
    </div>
  );
}
