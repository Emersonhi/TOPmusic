'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Users, ClipboardList, Calendar, MessageSquare, Clock, CheckCircle, TrendingUp } from 'lucide-react';

type Counts = { students: number; pendingEnrollments: number; todayBookings: number; newContacts: number };
type RecentItem = { id: string; type: 'enrollment' | 'booking' | 'contact'; label: string; sub: string; status?: string; time: string };

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({ students: 0, pendingEnrollments: 0, todayBookings: 0, newContacts: 0 });
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0];
      const [enrRes, bkRes, ctRes] = await Promise.all([
        supabase.from('enrollments').select('id, student_name, program, status, created_at').order('created_at', { ascending: false }),
        supabase.from('bookings').select('id, user_email, program, date, status, created_at').order('created_at', { ascending: false }),
        supabase.from('contacts').select('id, name, subject, created_at').order('created_at', { ascending: false }),
      ]);

      const enrollments = enrRes.data ?? [];
      const bookings = bkRes.data ?? [];
      const contacts = ctRes.data ?? [];

      const uniqueStudents = new Set(enrollments.map((e: any) => e.student_name?.toLowerCase())).size;
      const pendingEnrollments = enrollments.filter((e: any) => e.status === 'Pending').length;
      const todayBookings = bookings.filter((b: any) => b.date === today).length;

      setCounts({ students: uniqueStudents, pendingEnrollments, todayBookings, newContacts: contacts.length });

      const recentItems: RecentItem[] = [
        ...enrollments.slice(0, 5).map((e: any) => ({
          id: e.id, type: 'enrollment' as const,
          label: e.student_name, sub: e.program,
          status: e.status, time: e.created_at,
        })),
        ...bookings.slice(0, 5).map((b: any) => ({
          id: b.id, type: 'booking' as const,
          label: b.user_email, sub: `${b.program} — ${b.date}`,
          status: b.status, time: b.created_at,
        })),
        ...contacts.slice(0, 5).map((c: any) => ({
          id: c.id, type: 'contact' as const,
          label: c.name, sub: c.subject,
          time: c.created_at,
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

      setRecent(recentItems);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Total Students', value: counts.students, icon: Users, href: '/admin/students', color: 'var(--gold)' },
    { label: 'Pending Enrollments', value: counts.pendingEnrollments, icon: ClipboardList, href: '/admin/enrollments', color: '#f59e0b' },
    { label: "Today's Bookings", value: counts.todayBookings, icon: Calendar, href: '/admin/bookings', color: '#10b981' },
    { label: 'Contact Messages', value: counts.newContacts, icon: MessageSquare, href: '/admin/contacts', color: '#6366f1' },
  ];

  const typeHref = (t: RecentItem['type']) => t === 'enrollment' ? '/admin/enrollments' : t === 'booking' ? '/admin/bookings' : '/admin/contacts';
  const typeLabel = (t: RecentItem['type']) => t === 'enrollment' ? 'Enrollment' : t === 'booking' ? 'Booking' : 'Contact';

  const statusColor = (s?: string) => {
    if (!s) return 'var(--mist)';
    const l = s.toLowerCase();
    if (l === 'confirmed') return '#10b981';
    if (l === 'cancelled' || l === 'canceled') return '#ef4444';
    return 'var(--gold)';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>Dashboard</h1>
        <p className="text-sm font-ui mt-1" style={{ color: 'var(--mist)' }}>Overview of your school activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="p-5 rounded-2xl flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-ui tracking-widest uppercase" style={{ color: 'var(--mist)' }}>{label}</span>
              <Icon size={16} style={{ color }} />
            </div>
            <span className="text-3xl font-display font-bold" style={{ color: 'var(--ivory)' }}>{value}</span>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <TrendingUp size={16} style={{ color: 'var(--gold)' }} />
          <h2 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--ivory)' }}>Recent Activity</h2>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm font-ui" style={{ color: 'var(--mist)' }}>No activity yet.</p>
        ) : (
          <ul>
            {recent.map((item, i) => (
              <li key={item.id}
                style={{ borderBottom: i < recent.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none' }}>
                <Link href={typeHref(item.type)} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-ui px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}>
                        {typeLabel(item.type)}
                      </span>
                      {item.status && (
                        <span className="text-xs font-ui" style={{ color: statusColor(item.status) }}>{item.status}</span>
                      )}
                    </div>
                    <p className="text-sm font-ui font-medium mt-1 truncate" style={{ color: 'var(--ivory)' }}>{item.label}</p>
                    <p className="text-xs font-ui truncate" style={{ color: 'var(--mist)' }}>{item.sub}</p>
                  </div>
                  <span className="text-xs font-ui flex-shrink-0" style={{ color: 'var(--mist)' }}>
                    {new Date(item.time).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
