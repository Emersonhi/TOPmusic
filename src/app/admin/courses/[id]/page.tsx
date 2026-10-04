'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft, Save, Plus, Trash2, Video, FileText,
  ChevronUp, ChevronDown, Users, X, Check, Eye, EyeOff, ExternalLink
} from 'lucide-react';

type Course = {
  id: string; title: string; description: string; program: string;
  level: string; instructor_name: string; instructor_email: string;
  published: boolean; thumbnail_url: string;
};

type Lesson = {
  id: string; course_id: string; title: string; content: string;
  video_url: string; position: number;
};

type Enrollment = { id: string; student_email: string; enrolled_at: string };

const PROGRAMS = ['Piano', 'Guitar', 'Voice / Singing', 'Drums / Percussion', 'Music Production', 'Group Ensembles'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const blankCourse: Omit<Course, 'id'> = {
  title: '', description: '', program: '', level: 'Beginner',
  instructor_name: '', instructor_email: '', published: false, thumbnail_url: '',
};

const inputCls = 'w-full px-3 py-2.5 rounded-lg font-ui text-sm outline-none transition-all duration-150';
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--ivory)' };
const labelCls = 'block text-xs font-ui tracking-widest uppercase mb-1.5';

export default function CourseEditor() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';
  const courseId = isNew ? null : (params.id as string);

  const [course, setCourse] = useState<Omit<Course, 'id'>>(blankCourse);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [tab, setTab] = useState<'content' | 'students'>('content');

  useEffect(() => {
    if (!isNew && courseId) load(courseId);
  }, [courseId]);

  async function load(id: string) {
    const [cRes, lRes, eRes] = await Promise.all([
      supabase.from('courses').select('*').eq('id', id).maybeSingle(),
      supabase.from('course_lessons').select('*').eq('course_id', id).order('position'),
      supabase.from('course_enrollments').select('*').eq('course_id', id).order('enrolled_at', { ascending: false }),
    ]);
    if (cRes.data) {
      const { id: _id, ...rest } = cRes.data as Course;
      setCourse(rest);
    }
    setLessons((lRes.data ?? []) as Lesson[]);
    setEnrollments((eRes.data ?? []) as Enrollment[]);
    setLoading(false);
  }

  async function saveCourse() {
    setSaving(true);
    if (isNew) {
      const { data, error } = await supabase.from('courses').insert([{ ...course, created_at: new Date().toISOString() }]).select().single();
      if (!error && data) {
        router.replace(`/admin/courses/${data.id}`);
        return;
      }
    } else {
      await supabase.from('courses').update({ ...course }).eq('id', courseId!);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function addLesson() {
    if (!courseId) return;
    const pos = lessons.length;
    const { data } = await supabase.from('course_lessons').insert([{
      course_id: courseId, title: 'New Lesson', content: '', video_url: '', position: pos,
    }]).select().single();
    if (data) {
      setLessons(prev => [...prev, data as Lesson]);
      setActiveLesson(data.id);
    }
  }

  async function updateLesson(lesson: Lesson) {
    setLessons(prev => prev.map(l => l.id === lesson.id ? lesson : l));
    await supabase.from('course_lessons').update({
      title: lesson.title, content: lesson.content, video_url: lesson.video_url,
    }).eq('id', lesson.id);
  }

  async function deleteLesson(id: string) {
    await supabase.from('course_lessons').delete().eq('id', id);
    setLessons(prev => prev.filter(l => l.id !== id));
    if (activeLesson === id) setActiveLesson(null);
  }

  async function moveLesson(id: string, dir: -1 | 1) {
    const idx = lessons.findIndex(l => l.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= lessons.length) return;
    const reordered = [...lessons];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    const updated = reordered.map((l, i) => ({ ...l, position: i }));
    setLessons(updated);
    await Promise.all(updated.map(l => supabase.from('course_lessons').update({ position: l.position }).eq('id', l.id)));
  }

  async function enrollStudent() {
    if (!newStudentEmail.trim() || !courseId) return;
    setEnrolling(true);
    setEnrollError('');
    const email = newStudentEmail.trim().toLowerCase();
    const { error } = await supabase.from('course_enrollments').insert([{
      course_id: courseId, student_email: email, enrolled_at: new Date().toISOString(),
    }]);
    if (error) {
      setEnrollError(error.code === '23505' ? 'Student already enrolled.' : error.message);
    } else {
      setEnrollments(prev => [{ id: crypto.randomUUID(), student_email: email, enrolled_at: new Date().toISOString() }, ...prev]);
      setNewStudentEmail('');
    }
    setEnrolling(false);
  }

  async function unenroll(id: string) {
    await supabase.from('course_enrollments').delete().eq('id', id);
    setEnrollments(prev => prev.filter(e => e.id !== id));
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  );

  const activeL = lessons.find(l => l.id === activeLesson);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/courses" className="flex items-center gap-2 text-sm font-ui" style={{ color: 'var(--mist)' }}>
          <ArrowLeft size={14} /> Back to Courses
        </Link>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Link href={`/dashboard/courses/${courseId}`} target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-ui text-xs transition-all duration-150"
              style={{ color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ExternalLink size={13} /> Preview
            </Link>
          )}
          <button onClick={() => setCourse(c => ({ ...c, published: !c.published }))}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-ui text-xs transition-all duration-150"
            style={course.published
              ? { background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
              : { color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {course.published ? <Eye size={13} /> : <EyeOff size={13} />}
            {course.published ? 'Published' : 'Draft'}
          </button>
          <button onClick={saveCourse} disabled={saving || !course.title.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-bold transition-all duration-150"
            style={{ background: saved ? 'rgba(16,185,129,0.2)' : 'var(--gold)', color: saved ? '#10b981' : 'var(--ink)', opacity: (saving || !course.title.trim()) ? 0.6 : 1 }}>
            <Save size={14} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Course'}
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-display font-bold tracking-wide" style={{ color: 'var(--ivory)' }}>
        {isNew ? 'New Course' : course.title || 'Untitled Course'}
      </h1>

      {/* Course details */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
        <h2 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Course Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Title *</label>
            <input value={course.title} onChange={e => setCourse(c => ({ ...c, title: e.target.value }))}
              className={inputCls} style={inputStyle} placeholder="e.g. Piano for Beginners" />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Description</label>
            <textarea value={course.description} onChange={e => setCourse(c => ({ ...c, description: e.target.value }))}
              rows={3} className={inputCls} style={{ ...inputStyle, resize: 'none' }}
              placeholder="What students will learn in this course…" />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Instrument / Program</label>
            <select value={course.program} onChange={e => setCourse(c => ({ ...c, program: e.target.value }))}
              className={inputCls} style={inputStyle}>
              <option value="">Select program…</option>
              {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Level</label>
            <select value={course.level} onChange={e => setCourse(c => ({ ...c, level: e.target.value }))}
              className={inputCls} style={inputStyle}>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Instructor Name</label>
            <input value={course.instructor_name} onChange={e => setCourse(c => ({ ...c, instructor_name: e.target.value }))}
              className={inputCls} style={inputStyle} placeholder="Teacher name" />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--mist)' }}>Instructor Email</label>
            <input type="email" value={course.instructor_email} onChange={e => setCourse(c => ({ ...c, instructor_email: e.target.value }))}
              className={inputCls} style={inputStyle} placeholder="teacher@topmusic.pro" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      {!isNew && (
        <>
          <div className="flex rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
            {(['content', 'students'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-3 font-ui text-sm tracking-widest uppercase transition-all duration-150"
                style={{ background: tab === t ? 'rgba(201,168,76,0.15)' : 'transparent', color: tab === t ? 'var(--gold)' : 'var(--mist)', fontWeight: tab === t ? 700 : 400 }}>
                {t === 'content' ? `Lessons (${lessons.length})` : `Students (${enrollments.length})`}
              </button>
            ))}
          </div>

          {/* Lessons tab */}
          {tab === 'content' && (
            <div className="grid lg:grid-cols-5 gap-4">
              {/* Lesson list */}
              <div className="lg:col-span-2 space-y-2">
                {lessons.map((l, i) => (
                  <div key={l.id}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
                    style={{
                      background: activeLesson === l.id ? 'rgba(201,168,76,0.12)' : 'var(--surface)',
                      border: `1px solid ${activeLesson === l.id ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.08)'}`,
                    }}
                    onClick={() => setActiveLesson(l.id)}>
                    <div className="flex flex-col gap-0.5">
                      <button onClick={e => { e.stopPropagation(); moveLesson(l.id, -1); }} disabled={i === 0}
                        style={{ color: i === 0 ? 'rgba(255,255,255,0.1)' : 'var(--mist)' }}>
                        <ChevronUp size={12} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); moveLesson(l.id, 1); }} disabled={i === lessons.length - 1}
                        style={{ color: i === lessons.length - 1 ? 'rgba(255,255,255,0.1)' : 'var(--mist)' }}>
                        <ChevronDown size={12} />
                      </button>
                    </div>
                    <span className="text-xs font-ui w-5 text-center flex-shrink-0" style={{ color: 'var(--mist)' }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-ui truncate" style={{ color: activeLesson === l.id ? 'var(--gold)' : 'var(--ivory)', fontWeight: activeLesson === l.id ? 600 : 400 }}>
                        {l.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {l.video_url && <Video size={10} style={{ color: 'var(--mist)' }} />}
                        {l.content && <FileText size={10} style={{ color: 'var(--mist)' }} />}
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteLesson(l.id); }}
                      className="flex-shrink-0 p-1 rounded" style={{ color: 'rgba(239,68,68,0.4)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.4)'}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button onClick={addLesson}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-ui text-sm transition-all duration-150"
                  style={{ color: 'var(--gold)', border: '1px dashed rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.04)' }}>
                  <Plus size={14} /> Add Lesson
                </button>
              </div>

              {/* Lesson editor */}
              <div className="lg:col-span-3">
                {activeL ? (
                  <LessonEditor lesson={activeL} onUpdate={updateLesson} />
                ) : (
                  <div className="h-full flex items-center justify-center rounded-2xl py-20"
                    style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.08)' }}>
                    <div className="text-center">
                      <FileText size={28} className="mx-auto mb-2" style={{ color: 'var(--mist)' }} />
                      <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>Select a lesson to edit</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Students tab */}
          {tab === 'students' && (
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
              <h2 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Enrolled Students</h2>
              <div className="flex gap-2">
                <input value={newStudentEmail} onChange={e => setNewStudentEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && enrollStudent()}
                  placeholder="student@email.com"
                  className="flex-1 px-3 py-2.5 rounded-lg font-ui text-sm outline-none"
                  style={inputStyle} />
                <button onClick={enrollStudent} disabled={enrolling || !newStudentEmail.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-ui text-sm font-bold transition-all duration-150"
                  style={{ background: 'var(--gold)', color: 'var(--ink)', opacity: (!newStudentEmail.trim() || enrolling) ? 0.5 : 1 }}>
                  <Users size={14} /> Enroll
                </button>
              </div>
              {enrollError && (
                <p className="text-xs font-ui px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                  {enrollError}
                </p>
              )}
              {enrollments.length === 0 && (
                <p className="text-sm font-ui" style={{ color: 'var(--mist)' }}>No students enrolled yet.</p>
              )}
              <div className="space-y-2">
                {enrollments.map(e => (
                  <div key={e.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.08)' }}>
                    <div>
                      <p className="text-sm font-ui font-medium" style={{ color: 'var(--ivory)' }}>{e.student_email}</p>
                      <p className="text-xs font-ui mt-0.5" style={{ color: 'var(--mist)' }}>
                        Enrolled {new Date(e.enrolled_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <button onClick={() => unenroll(e.id)} style={{ color: 'rgba(239,68,68,0.5)' }}
                      onMouseEnter={ev => (ev.currentTarget as HTMLElement).style.color = '#ef4444'}
                      onMouseLeave={ev => (ev.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.5)'}>
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {isNew && (
        <p className="text-sm font-ui text-center" style={{ color: 'var(--mist)' }}>
          Save the course first, then add lessons and enroll students.
        </p>
      )}
    </div>
  );
}

function LessonEditor({ lesson, onUpdate }: { lesson: Lesson; onUpdate: (l: Lesson) => void }) {
  const [draft, setDraft] = useState(lesson);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setDraft(lesson); setDirty(false); }, [lesson.id]);

  function update(patch: Partial<Lesson>) {
    setDraft(d => ({ ...d, ...patch }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    await onUpdate(draft);
    setSaving(false);
    setDirty(false);
  }

  const embedUrl = getEmbedUrl(draft.video_url);

  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.12)' }}>
      <div className="flex items-center justify-between">
        <h3 className="font-ui font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Edit Lesson</h3>
        {dirty && (
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-ui text-xs font-bold transition-all duration-150"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
            <Check size={12} /> {saving ? 'Saving…' : 'Save'}
          </button>
        )}
      </div>

      <div>
        <label className={labelCls} style={{ color: 'var(--mist)' }}>Lesson Title</label>
        <input value={draft.title} onChange={e => update({ title: e.target.value })}
          className={inputCls} style={inputStyle} placeholder="Lesson title" />
      </div>

      <div>
        <label className={labelCls} style={{ color: 'var(--mist)' }}>Video URL (YouTube or Vimeo)</label>
        <input value={draft.video_url} onChange={e => update({ video_url: e.target.value })}
          className={inputCls} style={inputStyle} placeholder="https://youtube.com/watch?v=…" />
      </div>

      {embedUrl && (
        <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <iframe src={embedUrl} className="w-full h-full" allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
        </div>
      )}

      <div>
        <label className={labelCls} style={{ color: 'var(--mist)' }}>Notes / Content</label>
        <textarea value={draft.content} onChange={e => update({ content: e.target.value })}
          rows={8} className={inputCls} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-ui)' }}
          placeholder="Lesson notes, instructions, sheet music links, practice tips…" />
      </div>
    </div>
  );
}

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
