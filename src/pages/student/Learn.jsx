import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../../components/VideoPlayer';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDuration } from '../../utils/helpers';
import './learn.css';

export default function Learn() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [qa, setQa] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [qaText, setQaText] = useState('');

  const totalLessons = useMemo(() => curriculum.reduce((s, sec) => s + sec.lessons.length, 0), [curriculum]);
  const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getCourse(courseId), api.getCurriculum(courseId), api.getEnrollment(user.id, courseId)]).then(([c, cur, enr]) => {
      if (!c) { navigate('/courses'); return; }
      setCourse(c); setCurriculum(cur); setEnrollment(enr);
      const all = cur.flatMap((s) => s.lessons);
      const next = all.find((l) => !enr?.completedLessonIds.includes(l.id)) || all[0];
      setActiveLesson(next || null);
      setLoading(false);
    });
  }, [courseId, user.id]);

  if (loading || !activeLesson) {
    return (
      <div className="learn__wrap">
        <div className="learn__skeleton">
          <Skeleton variant="media" className="h-[400px]" />
          <Skeleton className="mt-4 h-8 w-2/3" />
          <Skeleton className="mt-3 h-4 w-full" />
        </div>
      </div>
    );
  }

  const lessonList = curriculum.flatMap((sec) => sec.lessons.map((l) => ({ ...l, section: sec.title })));
  const lessonIndex = lessonList.findIndex((l) => l.id === activeLesson.id);
  const nextLesson = lessonList[lessonIndex + 1];

  const completedCount = enrollment?.completedLessonIds?.length || 0;
  const progress = Math.round((completedCount / Math.max(1, totalLessons)) * 100);

  const isComplete = enrollment?.completedLessonIds.includes(activeLesson.id);
  const isQuiz = activeLesson.type === 'quiz';

  const markComplete = async (lessonItem) => {
    if (!enrollment) { showToast('Enroll in this course first'); return; }
    const updated = [...(enrollment.completedLessonIds || [])];
    if (!updated.includes(lessonItem.id)) updated.push(lessonItem.id);
    const pct = Math.round((updated.length / Math.max(1, totalLessons)) * 100);
    await api.updateProgress(enrollment.id, updated, totalLessons, pct);
    setEnrollment({ ...enrollment, completedLessonIds: updated, progress: pct });
    showToast('Lesson marked complete');
    if (nextLesson) setActiveLesson(nextLesson);
  };

  const addNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNotes([{ id: Date.now(), text: noteText, at: 'timestamped', createdAt: new Date().toISOString() }, ...notes]);
    setNoteText('');
    showToast('Note saved');
  };

  const askQa = (e) => {
    e.preventDefault();
    if (!qaText.trim()) return;
    setQa([{ id: Date.now(), text: qaText, author: user.name, createdAt: new Date().toISOString() }, ...qa]);
    setQaText('');
    showToast('Question posted', 'info');
  };

  const lessonTypeLabel = { video: 'Video', text: 'Article', quiz: 'Quiz', assignment: 'Assignment' };

  return (
    <div className="learn">
      <div className={`learn__side ${sidebarOpen ? 'learn__side--open' : ''}`}>
        <div className="learn__side-head">
          <div className="learn__side-loading">Loading…</div>
          <div className="learn__side-progress">
            <span className="text-xs font-bold">{progress}% complete</span>
            <ProgressBar value={progress} className="mt-1" />
          </div>
        </div>
        <div className="learn__curriculum">
          {curriculum.map((sec) => (
            <div key={sec.id} className="learn__sec">
              <h3 className="learn__sec-title">{sec.title}</h3>
              <ul className="learn__sec-list">
                {sec.lessons.map((l) => {
                  const done = enrollment?.completedLessonIds.includes(l.id);
                  const active = activeLesson.id === l.id;
                  return (
                    <li key={l.id}>
                      <button
                        className={`learn__lesson ${active ? 'learn__lesson--active' : ''}`}
                        onClick={() => { setActiveLesson(l); setSidebarOpen(false); setTab('overview'); }}
                        disabled={l.type === 'assignment'}
                        title={l.type === 'assignment' ? 'Complete the lesson to unlock this assignment' : undefined}
                      >
                        <span className={`learn__lesson-icon ${done ? 'learn__lesson-icon--done' : ''}`}>
                          <Icon name={done ? 'check' : l.type === 'video' ? 'play' : l.type === 'text' ? 'file' : 'checkCircle'} size={14} />
                        </span>
                        <span className="learn__lesson-title">{l.title}</span>
                        {l.duration > 0 && <span className="learn__lesson-dur">{formatDuration(l.duration)}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="learn__main">
        <div className="learn__topbar">
          <button className="learn__toggle" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle curriculum">
            <Icon name="menu" size={20} />
          </button>
          <Link to={`/courses/${courseId}`} className="learn__course-link">{course.title}</Link>
        </div>

        {activeLesson.type === 'video' ? (
          <VideoPlayer videoUrl={videoUrl} poster={course.thumbnail} title={activeLesson.title} />
        ) : activeLesson.type === 'text' ? (
          <div className="learn__article">
            <h1 className="text-xl font-bold mb-3">{activeLesson.title}</h1>
            <div className="prose-slate space-y-4 text-slate-700">
              <p>Welcome to this lesson! This article covers the key concepts you need to understand before moving on to the hands-on exercises.</p>
              <p>As you read, take notes using the Notes tab below — they'll be saved to your lesson and timestamped so you can jump back to the exact moment that matters.</p>
              <h3 className="font-bold text-slate-900">Key takeaways</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Concept one: start with the fundamentals.</li>
                <li>Concept two: practice builds confidence.</li>
                <li>Concept three: review to reinforce learning.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="learn__article learn__article--centered">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge tone="amber" className="text-xs">{lessonTypeLabel[activeLesson.type]}</Badge>
              </div>
              <h1 className="text-xl font-bold mb-2">{activeLesson.title}</h1>
              <p className="text-slate-500 text-sm mb-6">
                {isQuiz ? 'Test your understanding of the module.' : 'Complete the module to unlock this assignment.'}
              </p>
              {isQuiz ? (
                <Link to={`/learn/${courseId}/quiz/${activeLesson.id}`}><Button size="lg">Take Quiz</Button></Link>
              ) : (
                <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <Icon name="lock" size={16} />
                  Complete the previous lessons to unlock this assignment
                </div>
              )}
            </div>
          </div>
        )}

        <div className="learn__lesson-bar">
          <div className="learn__lesson-meta">
            <h2 className="text-lg font-bold">{activeLesson.title}</h2>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">{lessonTypeLabel[activeLesson.type]} · Section: {activeLesson.section}</p>
          </div>
          <div className="flex items-center gap-2">
            {isComplete ? (
              <Button variant="secondary" onClick={() => showToast('Lesson already complete', 'info')}><Icon name="check" size={16} /> Completed</Button>
            ) : (
              <Button onClick={() => markComplete(activeLesson)}>Mark as complete</Button>
            )}
          </div>
        </div>

        <Tabs
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'notes', label: 'Notes', count: notes.length },
            { value: 'resources', label: 'Resources' },
            { value: 'qa', label: 'Q&A', count: qa.length },
            { value: 'announcements', label: 'Announcements' },
          ]}
          active={tab}
          onChange={setTab}
        />

        <div className="learn__tabs">
          {tab === 'overview' && (
            <div className="learn__tab">
              <p className="text-slate-600 text-sm leading-relaxed">{course.description}</p>
              {isQuiz && <p className="text-sm text-brand-700 font-semibold mt-3">Take this quiz to complete the lesson.</p>}
            </div>
          )}

          {tab === 'notes' && (
            <div className="learn__tab">
              <form className="learn__noteform" onSubmit={addNote}>
                <textarea
                  className="w-full"
                  rows={3}
                  placeholder="Write a timestamped note…"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <Button type="submit" size="sm">Save note</Button>
              </form>
              {notes.length === 0 ? (
                <p className="text-sm text-slate-500 mt-4">No notes yet. Take your first note above.</p>
              ) : (
                <ul className="learn__notes">
                  {notes.map((n) => (
                    <li key={n.id}>
                      <span className="learn__note-time">⏱ {n.at}</span>
                      <p>{n.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'resources' && (
            <div className="learn__tab">
              <div className="learn__resource">
                <Icon name="file" size={18} />
                <span>Course syllabus.pdf</span>
                <Button variant="ghost" size="sm"><Icon name="download" size={15} /> Download</Button>
              </div>
              <div className="learn__resource">
                <Icon name="file" size={18} />
                <span>Exercise files.zip</span>
                <Button variant="ghost" size="sm"><Icon name="download" size={15} /> Download</Button>
              </div>
            </div>
          )}

          {tab === 'qa' && (
            <div className="learn__tab">
              <form className="learn__noteform" onSubmit={askQa}>
                <textarea
                  className="w-full"
                  rows={2}
                  placeholder="Ask a question about this lesson…"
                  value={qaText}
                  onChange={(e) => setQaText(e.target.value)}
                />
                <Button type="submit" size="sm">Ask question</Button>
              </form>
              {qa.length === 0 ? (
                <p className="text-sm text-slate-500 mt-4">No questions yet. Be the first to ask!</p>
              ) : (
                <ul className="learn__qa">
                  {qa.map((q) => (
                    <li key={q.id}>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm">{q.author}</strong>
                        <span className="text-xs text-slate-400">· just now</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{q.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'announcements' && (
            <div className="learn__tab">
              <div className="learn__notice">
                <Badge tone="brand">Instructor</Badge>
                <h4 className="font-bold text-sm mt-2">Welcome to the course!</h4>
                <p className="text-sm text-slate-600 mt-1">Glad to have you on board. Please complete the intro lessons first.</p>
              </div>
            </div>
          )}
        </div>

        <div className="learn__nav">
          {lessonIndex > 0 && (
            <Button variant="ghost" onClick={() => setActiveLesson(lessonList[lessonIndex - 1])}>
              <Icon name="arrowLeft" size={16} /> Previous lesson
            </Button>
          )}
          {nextLesson && (
            <Button onClick={() => { setActiveLesson(nextLesson); setTab('overview'); }}>
              Next lesson <Icon name="chevronRight" size={16} />
            </Button>
          )}
          {!nextLesson && (
            <Link to="/certificates"><Button>Finish course →</Button></Link>
          )}
        </div>
      </div>
    </div>
  );
}