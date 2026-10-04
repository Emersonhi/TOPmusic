'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, Plus, Search, Users, Eye, EyeOff, Pencil } from 'lucide-react';

type Course = {
  id: string; title: string; description: string; program: string;
  level: string; instructor_name: string; published: boolean; created_at: string;
  lesson_count?: number; enrollment_count?: number;
};

const LEVEL_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Beginner:     { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)' },
  Intermediate: { color: 'var(--gold)', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)' },
  Advanced:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)' },
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: coursesData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (!coursesData) { setLoading(false); return; }

    const ids = coursesData.map((c: any) => c.id);
    const [lessonsRes, enrollRes] = await Promise.all([
      supabase.from('course_lessons').select('id, course_id').in('course_id', ids),
      supabase.from('course_enrollments').select('id, course_id').in('course_id', ids),
    ]);

    const lessonCounts: Record<string, number> = {};
    const enrollCounts: Record<string, number> = {};
    (lessonsRes.data ?? []).forEach((l: any) => { lessonCounts[l.course_id] = (lessonCounts[l.course_id] ?? 0) + 1; });
    (enrollRes.data ?? []).forEach((e: any) => { enrollCounts[e.course_id] = (enrollCounts[e.course_id] ?? 0) + 1; });

    setCourses(coursesData.map((c: any) => ({
      ...c,
      lesson_count: lessonCounts[c.id] ?? 0,
      enrollment_count: enrollCounts[c.id] ?? 0,
    })));
    setLoading(false);
  }

  async function togglePublish(c: Course) {
    await supabase.from('courses').update({ published: !c.published }).eq('id', c.id);
    setCourses(prev => prev.map(x => x.id === c.id ? { ...x, published: !c.published } : x));
  }

  const filtered = courses.filter(c => {
    const q = query.toLowerCase();
    return !q || c.title.toLowerCase().includes(q) || c.program?.toLowerCase().includes(q) || c.instructor_name?.toLowerCase().includes(q);
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>Courses</h1>
          <p className="text-sm font-ui mt-1" style={{ color: 'var(--mist)' }}>{filtered.length} course{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search courses…"
              className="pl-9 pr-4 py-2.5 rounded-xl font-ui text-sm outline-none w-56"
              style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' }} />
          </div>
          <Link href="/admin/courses/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-ui text-sm font-bold transition-all duration-150"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
            <Plus size={15} /> New Course
          </Link>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
          <BookOpen size={32} className="mx-auto mb-3" style={{ color: 'var(--mist)' }} />
          <p className="font-ui font-semibold" style={{ color: 'var(--ivory)' }}>No courses yet</p>
          <p className="text-sm font-ui mt-1 mb-5" style={{ color: 'var(--mist)' }}>Create your first course to get started</p>
          <Link href="/admin/courses/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-ui text-sm font-bold"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
            <Plus size={14} /> New Course
          </Link>
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map(c => {
          const lc = LEVEL_COLORS[c.level] ?? LEVEL_COLORS.Beginner;
          return (
            <div key={c.id} className="rounded-2xl p-5 flex items-center gap-5 flex-wrap"
              style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)' }}>
                <BookOpen size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-ui font-semibold" style={{ color: 'var(--ivory)' }}>{c.title}</h3>
                  <span className="text-xs font-ui px-2 py-0.5 rounded-full"
                    style={{ background: lc.bg, color: lc.color, border: `1px solid ${lc.border}` }}>
                    {c.level}
                  </span>
                  <span className="text-xs font-ui px-2 py-0.5 rounded-full"
                    style={c.published
                      ? { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  {c.program && <span className="text-xs font-ui" style={{ color: 'var(--gold)' }}>{c.program}</span>}
                  {c.instructor_name && <span className="text-xs font-ui" style={{ color: 'var(--mist)' }}>by {c.instructor_name}</span>}
                  <span className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{c.lesson_count} lesson{c.lesson_count !== 1 ? 's' : ''}</span>
                  <span className="text-xs font-ui flex items-center gap-1" style={{ color: 'var(--mist)' }}>
                    <Users size={11} /> {c.enrollment_count} student{c.enrollment_count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(c)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-ui text-xs transition-all duration-150"
                  style={{ color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.1)' }}
                  title={c.published ? 'Unpublish' : 'Publish'}>
                  {c.published ? <EyeOff size={13} /> : <Eye size={13} />}
                  {c.published ? 'Unpublish' : 'Publish'}
                </button>
                <Link href={`/admin/courses/${c.id}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-ui text-xs transition-all duration-150"
                  style={{ background: 'var(--gold)', color: 'var(--ink)', fontWeight: 700 }}>
                  <Pencil size={13} /> Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
