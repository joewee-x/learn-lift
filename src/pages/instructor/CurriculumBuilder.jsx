import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './builder.css';

const lessonTypes = [
  { value: 'video', label: 'Video', icon: 'play' },
  { value: 'text', label: 'Article', icon: 'file' },
  { value: 'quiz', label: 'Quiz', icon: 'checkCircle' },
  { value: 'assignment', label: 'Assignment', icon: 'upload' },
];

const findType = (v) => lessonTypes.find((t) => t.value === v) || lessonTypes[0];

export default function CurriculumBuilder() {
  const { courseId } = useParams();
  const { showToast } = useToast();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [lessonModal, setLessonModal] = useState(false);

  useEffect(() => {
    Promise.all([api.getCourse(courseId), api.getCurriculum(courseId)]).then(([c, cur]) => {
      setCourse(c);
      const curSections = (cur && cur.length) ? cur : [{ id: 's1', title: 'Section 1', lessons: [] }];
      setSections(curSections);
      setLoading(false);
    });
  }, [courseId]);

  const markUnsaved = () => setSaved(false);
  const save = () => {
    setSaved(true);
    showToast('Curriculum saved');
  };

  const addSection = () => {
    setSections((s) => [...s, { id: 's' + Date.now(), title: `Section ${s.length + 1}`, lessons: [] }]);
    markUnsaved();
  };

  const renameSection = (id, title) => {
    setSections((s) => s.map((x) => (x.id === id ? { ...x, title } : x)));
    markUnsaved();
  };

  const removeSection = (id) => {
    setSections((s) => s.filter((x) => x.id !== id));
    markUnsaved();
  };

  const moveSection = (index, dir) => {
    setSections((s) => {
      const list = [...s];
      const [item] = list.splice(index, 1);
      list.splice(index + dir, 0, item);
      return list;
    });
    markUnsaved();
  };

  const moveLesson = (sectionId, index, dir) => {
    setSections((s) =>
      s.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const list = [...sec.lessons];
        const [item] = list.splice(index, 1);
        list.splice(index + dir, 0, item);
        return { ...sec, lessons: list };
      }),
    );
    markUnsaved();
  };

  const removeLesson = (sectionId, index) => {
    setSections((s) =>
      s.map((sec) => (sec.id === sectionId ? { ...sec, lessons: sec.lessons.filter((_, i) => i !== index) } : sec)),
    );
    markUnsaved();
  };

  const addLesson = (sectionId, lesson) => {
    setSections((s) => s.map((sec) => (sec.id === sectionId ? { ...sec, lessons: [...sec.lessons, { id: 'l' + Date.now(), ...lesson }] } : sec)));
    setLessonModal(false);
    markUnsaved();
  };

  if (loading) {
    return (
      <div className="page page--narrow">
        <Skeleton className="h-10 w-1/2 mt-8" />
        <Skeleton className="h-64 mt-6" />
      </div>
    );
  }

  return (
    <div className="page page--narrow">
      <div className="page-head">
        <div>
          <h1 className="page-title">{course.title}</h1>
          <p className="page-sub flex items-center gap-2">
            Curriculum builder {saved ? <Badge tone="green">Saved</Badge> : <Badge tone="amber">Unsaved changes</Badge>}
          </p>
        </div>
        <Button onClick={save}>Save draft</Button>
      </div>

      <div className="builder-toolbar">
        <Button variant="secondary" size="sm" onClick={addSection}><Icon name="plus" size={14} /> Add section</Button>
      </div>

      <div className="space-y-3 mt-4">
        {sections.map((sec, si) => (
          <div key={sec.id} className="builder-sec">
            <div className="builder-sec__head">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => moveSection(si, -1)} disabled={si === 0} aria-label="Move section up"><Icon name="chevronDown" size={16} className="rotate-180" /></Button>
                <Button variant="ghost" size="sm" onClick={() => moveSection(si, 1)} disabled={si === sections.length - 1} aria-label="Move section down"><Icon name="chevronDown" size={16} /></Button>
              </div>
              <input className="builder-sec__title" value={sec.title} onChange={(e) => renameSection(sec.id, e.target.value)} aria-label="Section title" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 mr-2">{sec.lessons.length} lessons</span>
                <Button variant="ghost" size="sm" onClick={() => setLessonModal(sec.id)} aria-label="Add lesson"><Icon name="plus" size={16} /></Button>
                <Button variant="ghost" size="sm" onClick={() => removeSection(sec.id)} aria-label="Remove section"><Icon name="trash" size={16} /></Button>
              </div>
            </div>
            <ul className="builder-lessons">
              {sec.lessons.length === 0 && <li className="builder-lessons__empty">No lessons yet. Add one to get started.</li>}
              {sec.lessons.map((l, li) => (
                <li key={l.id} className="builder-lesson">
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="sm" onClick={() => moveLesson(sec.id, li, -1)} disabled={li === 0} aria-label="Move lesson up"><Icon name="chevronDown" size={13} className="rotate-180" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => moveLesson(sec.id, li, 1)} disabled={li === sec.lessons.length - 1} aria-label="Move lesson down"><Icon name="chevronDown" size={13} /></Button>
                  </div>
                  <Icon name={findType(l.type).icon} size={16} className="text-slate-400" />
                  <span className="builder-lesson__title">{l.title}</span>
                  {l.isPreview && <Badge tone="brand">Preview</Badge>}
                  <Button variant="ghost" size="sm" onClick={() => removeLesson(sec.id, li)} aria-label="Remove lesson"><Icon name="trash" size={15} /></Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <LessonModal open={!!lessonModal} sectionId={lessonModal} onClose={() => setLessonModal(false)} onAdd={addLesson} />
    </div>
  );
}

function LessonModal({ open, sectionId, onClose, onAdd }) {
  const [type, setType] = useState('video');
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState(false);

  const submit = () => {
    if (!title.trim()) return;
    onAdd(sectionId, { title, type, isPreview: preview });
    setTitle('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add lesson"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!title.trim()}>Add lesson</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <span className="modal-label">Lesson type</span>
          <div className="grid grid-cols-4 gap-2">
            {lessonTypes.map((t) => (
              <button key={t.value} type="button" className={`lesson-type ${type === t.value ? 'lesson-type--active' : ''}`} onClick={() => setType(t.value)}>
                <Icon name={t.icon} size={18} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="modal-label">Lesson title</span>
          <input className="builder-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to State" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} className="accent-brand-600" />
          Make this a free preview lesson
        </label>
      </div>
    </Modal>
  );
}