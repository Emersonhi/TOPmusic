'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, CheckCircle } from 'lucide-react';

type Course = {
  id: string; title: string; description: string; program: string;
  level: string; instructor_name: string;
  total_lessons: number; completed_lessons: number;
};

const LEVEL_COLORS: Record<string, { color: string; bg: string }> = {
  Beginner:     { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  Intermediate: { color: 'var(--gold)', bg: 'rgba(201,168,76,0.1)' },
  Advanced:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
};

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const email = session.user.email!;

      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .ilike('student_email', email);

      if (!enrollments || enrollments.length === 0) { setLoading(false); return; }
      const ids = enrollments.map((e: any) => e.course_id);

      const [cRes, lRes, pRes] = await Promise.all([
        supabase.from('courses').select('*').in('id', ids).eq('published', true),
        supabase.from('course_lessons').select('id, course_id').in('course_id', ids),
        supabase.from('lesson_progress').select('lesson_id').ilike('student_email', email),
      ]);

      const lessonsMap: Record<string, string[]> = {};
      (lRes.data ?? []).forEach((l: any) => {
        if (!lessonsMap[l.course_id]) lessonsMap[l.course_id] = [];
        lessonsMap[l.course_id].push(l.id);
      });
      const completedSet = new Set((pRes.data ?? []).map((p: any) => p.lesson_id));

      setCourses((cRes.data ?? []).map((c: any) => {
        const total = lessonsMap[c.id]?.length ?? 0;
        const done = lessonsMap[c.id]?.filter((id: string) => completedSet.has(id)).length ?? 0;
        return { ...c, total_lessons: total, completed_lessons: done };
      }));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (courses.length === 0) return (
    <div className="text-center py-20">
      <BookOpen size={40} className="mx-auto mb-4" style={{ color: 'var(--mist)' }} />
      <p className="font-display font-bold text-lg" style={{ color: 'var(--ivory)' }}>No courses yet</p>
      <p className="text-sm font-ui mt-1" style={{ color: 'var(--mist)' }}>Your teacher will enroll you in courses soon.</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>My Courses</h1>
        <p className="text-sm font-ui mt-1" style={{ color: 'var(--mist)' }}>{courses.length} course{courses.length !== 1 ? 's' : ''} enrolled</p>
      </div>

      <div className="space-y-4">
        {courses.map(c => {
          const lc = LEVEL_COLORS[c.level] ?? LEVEL_COLORS.Beginner;
          const pct = c.total_lessons > 0 ? Math.round((c.completed_lessons / c.total_lessons) * 100) : 0;
          const complete = pct === 100 && c.total_lessons > 0;
          return (
            <Link key={c.id} href={`/dashboard/courses/${c.id}`}
              className="block rounded-2xl p-5 transition-all duration-150 hover:scale-[1.01]"
              style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: complete ? 'rgba(16,185,129,0.15)' : 'rgba(201,168,76,0.12)' }}>
                  {complete
                    ? <CheckCircle size={20} style={{ color: '#10b981' }} />
                    : <BookOpen size={20} style={{ color: 'var(--gold)' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold" style={{ color: 'var(--ivory)' }}>{c.title}</h3>
                    <span className="text-xs font-ui px-2 py-0.5 rounded-full"
                      style={{ background: lc.bg, color: lc.color }}>{c.level}</span>
                  </div>
                  {c.program && <p className="text-xs font-ui mt-0.5" style={{ color: 'var(--gold)' }}>{c.program}</p>}
                  {c.instructor_name && <p className="text-xs font-ui mt-0.5" style={{ color: 'var(--mist)' }}>with {c.instructor_name}</p>}
                  {c.description && <p className="text-sm font-ui mt-2 line-clamp-2" style={{ color: 'var(--mist)' }}>{c.description}</p>}

                  {c.total_lessons > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-ui" style={{ color: 'var(--mist)' }}>
                          {c.completed_lessons}/{c.total_lessons} lessons
                        </span>
                        <span className="text-xs font-ui font-semibold" style={{ color: complete ? '#10b981' : 'var(--gold)' }}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: complete ? '#10b981' : 'var(--gold)' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
