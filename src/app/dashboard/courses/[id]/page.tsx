'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, CheckCircle, Circle, Video, FileText, ChevronRight, Pencil, Download, Paperclip } from 'lucide-react';

type Course = {
  id: string; title: string; description: string; program: string;
  level: string; instructor_name: string;
};

type Doc = { name: string; url: string; size: number; type: string };

type Lesson = {
  id: string; title: string; content: string; video_url: string; position: number; documents?: string;
};

function getEmbedUrl(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id = u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : '';
    }
  } catch { }
  return '';
}

export default function CourseViewerPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const email = session.user.email!;
      setStudentEmail(email);
      if (email === 'info@topmusic.pro') setIsAdmin(true);

      const [cRes, lRes, pRes] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).maybeSingle(),
        supabase.from('course_lessons').select('*').eq('course_id', courseId).order('position'),
        supabase.from('lesson_progress').select('lesson_id').ilike('student_email', email),
      ]);

      if (cRes.data) setCourse(cRes.data as Course);
      const ls = (lRes.data ?? []) as Lesson[];
      setLessons(ls);
      setCompleted(new Set((pRes.data ?? []).map((p: any) => p.lesson_id)));
      if (ls.length > 0) setActiveLesson(ls[0].id);
      setLoading(false);
    }
    load();
  }, [courseId]);

  async function toggleComplete(lessonId: string) {
    if (marking) return;
    setMarking(true);
    if (completed.has(lessonId)) {
      await supabase.from('lesson_progress').delete()
        .eq('lesson_id', lessonId).ilike('student_email', studentEmail);
      setCompleted(prev => { const n = new Set(prev); n.delete(lessonId); return n; });
    } else {
      await supabase.from('lesson_progress').insert([{
        lesson_id: lessonId, student_email: studentEmail, completed_at: new Date().toISOString(),
      }]);
      setCompleted(prev => new Set(prev).add(lessonId));
      // Auto-advance to next
      const idx = lessons.findIndex(l => l.id === lessonId);
      if (idx < lessons.length - 1) setActiveLesson(lessons[idx + 1].id);
    }
    setMarking(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!course) return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/courses" className="flex items-center gap-2 text-sm font-ui mb-6" style={{ color: 'var(--mist)' }}>
        <ArrowLeft size={14} /> My Courses
      </Link>
      <p className="font-ui" style={{ color: 'var(--mist)' }}>Course not found.</p>
    </div>
  );

  const activeL = lessons.find(l => l.id === activeLesson);
  const embedUrl = activeL ? getEmbedUrl(activeL.video_url) : '';
  const pct = lessons.length > 0 ? Math.round((completed.size / lessons.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/courses" className="flex items-center gap-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
          <ArrowLeft size={14} /> My Courses
        </Link>
        {isAdmin && (
          <Link href={`/admin/courses/${courseId}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-ui text-xs transition-all duration-150"
            style={{ background: 'var(--gold)', color: 'var(--ink)', fontWeight: 700 }}>
            <Pencil size={12} /> Edit in Admin
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>{course.title}</h1>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {course.program && <span className="text-xs font-ui" style={{ color: 'var(--gold)' }}>{course.program}</span>}
          {course.instructor_name && <span className="text-xs font-ui" style={{ color: 'var(--mist)' }}>with {course.instructor_name}</span>}
          <span className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{completed.size}/{lessons.length} lessons complete</span>
          <span className="text-xs font-ui font-semibold" style={{ color: pct === 100 ? '#10b981' : 'var(--gold)' }}>{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : 'var(--gold)' }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Lesson list */}
        <div className="lg:col-span-2 space-y-1.5">
          {lessons.map((l, i) => {
            const done = completed.has(l.id);
            const active = activeLesson === l.id;
            return (
              <button key={l.id} onClick={() => setActiveLesson(l.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150"
                style={{
                  background: active ? 'rgba(201,168,76,0.12)' : 'var(--surface-2)',
                  border: `1px solid ${active ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.06)'}`,
                }}>
                <div className="flex-shrink-0">
                  {done
                    ? <CheckCircle size={18} style={{ color: '#10b981' }} />
                    : <Circle size={18} style={{ color: active ? 'var(--gold)' : 'var(--mist)' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-ui truncate" style={{ color: active ? 'var(--gold)' : 'var(--ivory)', fontWeight: active ? 600 : 400 }}>
                    <span className="mr-1.5" style={{ color: 'var(--mist)', fontSize: '0.7rem' }}>{i + 1}.</span>
                    {l.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {l.video_url && <Video size={10} style={{ color: 'var(--mist)' }} />}
                    {l.content && <FileText size={10} style={{ color: 'var(--mist)' }} />}
                  </div>
                </div>
                {active && <ChevronRight size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />}
              </button>
            );
          })}
          {lessons.length === 0 && (
            <p className="text-sm font-ui px-4 py-6 text-center" style={{ color: 'var(--mist)' }}>No lessons yet.</p>
          )}
        </div>

        {/* Lesson content */}
        <div className="lg:col-span-3 space-y-4">
          {activeL ? (
            <>
              <div className="rounded-2xl p-5" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs font-ui tracking-widest uppercase mb-1" style={{ color: 'var(--mist)' }}>
                      Lesson {lessons.findIndex(l => l.id === activeL.id) + 1}
                    </p>
                    <h2 className="text-xl font-display font-bold" style={{ color: 'var(--ivory)' }}>{activeL.title}</h2>
                  </div>
                  <button onClick={() => toggleComplete(activeL.id)} disabled={marking}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-ui text-sm font-bold transition-all duration-150 flex-shrink-0"
                    style={completed.has(activeL.id)
                      ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                      : { background: 'var(--gold)', color: 'var(--ink)' }}>
                    {completed.has(activeL.id)
                      ? <><CheckCircle size={14} /> Completed</>
                      : <><Circle size={14} /> Mark Complete</>}
                  </button>
                </div>
              </div>

              {embedUrl && (
                <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <iframe src={embedUrl} className="w-full h-full" allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                </div>
              )}

              {activeL.content && (
                <div className="rounded-2xl p-5" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.08)' }}>
                  <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Notes</p>
                  <p className="text-sm font-ui whitespace-pre-wrap" style={{ color: 'var(--ivory)', lineHeight: '1.8' }}>{activeL.content}</p>
                </div>
              )}

              {(() => {
                let docs: Doc[] = [];
                try { docs = activeL.documents ? JSON.parse(activeL.documents) : []; } catch {}
                if (!docs.length) return null;
                return (
                  <div className="rounded-2xl p-5" style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.08)' }}>
                    <p className="text-xs font-ui tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Downloads</p>
                    <div className="space-y-2">
                      {docs.map(doc => (
                        <a key={doc.url} href={doc.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150"
                          style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
                          <Paperclip size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                          <span className="flex-1 text-sm font-ui truncate" style={{ color: 'var(--ivory)' }}>{doc.name}</span>
                          <span className="text-xs font-ui flex-shrink-0" style={{ color: 'var(--mist)' }}>
                            {doc.size < 1024 * 1024 ? `${Math.round(doc.size / 1024)} KB` : `${(doc.size / 1024 / 1024).toFixed(1)} MB`}
                          </span>
                          <Download size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="flex items-center justify-center rounded-2xl py-20"
              style={{ background: 'var(--surface-2)', border: '1px solid rgba(201,168,76,0.08)' }}>
              <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>Select a lesson to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
