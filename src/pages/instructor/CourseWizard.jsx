import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { categories } from '../../data/db';
import './wizard.css';

const steps = ['Basics', 'Description', 'Pricing', 'Review & Submit'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];
const languages = ['English', 'Spanish', 'French', 'German', 'Hindi'];

export default function CourseWizard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '', subtitle: '', category: 'c1', level: 'Beginner', language: 'English',
    description: '', whatYouLearn: [''], requirements: '', thumbnail: '',
    priceType: 'free', price: 49.99,
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setLearn = (i, v) => {
    const list = [...form.whatYouLearn];
    list[i] = v;
    set('whatYouLearn', list);
  };
  const addLearn = () => set('whatYouLearn', [...form.whatYouLearn, '']);
  const removeLearn = (i) => set('whatYouLearn', form.whatYouLearn.filter((_, x) => x !== i));

  const canNext = step === 0
    ? form.title.trim() && form.subtitle.trim()
    : step === 1 ? form.description.trim() && form.whatYouLearn.some((l) => l.trim()) : true;

  const submit = async (mode) => {
    setSubmitting(true);
    await api.createCourse(user.id, {
      title: form.title, subtitle: form.subtitle, category: form.category,
      level: form.level, language: form.language, description: form.description,
      whatYouLearn: form.whatYouLearn.filter((l) => l.trim()),
      price: form.priceType === 'free' ? 0 : Number(form.price),
      thumbnail: form.thumbnail || 'https://picsum.photos/seed/newcourse/400/225',
    });
    setSubmitting(false);
    showToast(mode === 'publish' ? 'Submitted for review' : 'Saved as draft', mode === 'publish' ? 'info' : 'success');
    navigate('/instructor/courses');
  };

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="page page--narrow">
      <div className="page-head">
        <div>
          <h1 className="page-title">Create a course</h1>
          <p className="page-sub">Step {step + 1} of {steps.length}: {steps[step]}</p>
        </div>
      </div>

      <div className="wizard-steps" aria-label="Course creation progress">
        {steps.map((s, i) => (
          <div key={s} className={`wizard-step ${i === step ? 'wizard-step--active' : ''} ${i < step ? 'wizard-step--done' : ''}`}>
            <span className="wizard-step__num">{i < step ? <Icon name="check" size={14} /> : i + 1}</span>
            <span className="wizard-step__label">{s}</span>
          </div>
        ))}
      </div>

      <div className="card wizard-card">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold mb-4">Course basics</h2>
            <label className="wizard-field">
              <span>Course title</span>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Complete React Bootcamp" />
            </label>
            <label className="wizard-field">
              <span>Subtitle</span>
              <input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="A short, compelling subtitle" />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="wizard-field">
                <span>Category</span>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="wizard-field">
                <span>Level</span>
                <select value={form.level} onChange={(e) => set('level', e.target.value)}>
                  {levels.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>
            </div>
            <label className="wizard-field">
              <span>Language</span>
              <select value={form.language} onChange={(e) => set('language', e.target.value)}>
                {languages.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold mb-4">Description</h2>
            <label className="wizard-field">
              <span>Full description</span>
              <textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe what students will learn and why it matters…" />
            </label>
            <div>
              <span className="wizard-label">What students will learn</span>
              {form.whatYouLearn.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={item} onChange={(e) => setLearn(i, e.target.value)} placeholder={`Learning outcome ${i + 1}`} />
                  <Button variant="ghost" size="sm" onClick={() => removeLearn(i)} aria-label="Remove"><Icon name="x" size={16} /></Button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={addLearn}><Icon name="plus" size={14} /> Add outcome</Button>
            </div>
            <label className="wizard-field">
              <span>Requirements</span>
              <input value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder="Any prerequisites?" />
            </label>
            <label className="wizard-field">
              <span>Thumbnail URL</span>
              <input value={form.thumbnail} onChange={(e) => set('thumbnail', e.target.value)} placeholder="https://… (optional)" />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold mb-4">Pricing</h2>
            <div className="pricing-cards">
              <div className={`pricing-card ${form.priceType === 'free' ? 'pricing-card--active' : ''}`} onClick={() => set('priceType', 'free')}>
                <input type="radio" checked={form.priceType === 'free'} readOnly />
                <div>
                  <p className="font-bold">Free</p>
                  <p className="text-xs text-slate-500">Attract more students</p>
                </div>
              </div>
              <div className={`pricing-card ${form.priceType === 'paid' ? 'pricing-card--active' : ''}`} onClick={() => set('priceType', 'paid')}>
                <input type="radio" checked={form.priceType === 'paid'} readOnly />
                <div>
                  <p className="font-bold">Paid</p>
                  <p className="text-xs text-slate-500">Earn from every sale</p>
                </div>
              </div>
            </div>
            {form.priceType === 'paid' && (
              <label className="wizard-field max-w-xs">
                <span>Price (USD)</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input className="pl-7" type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} />
                </div>
              </label>
            )}
            {form.priceType === 'paid' && <p className="text-xs text-slate-400">You'll earn 70% of the sale price (commission 30%).</p>}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold mb-4">Review & Submit</h2>
            <div className="review-card">
              <div className="review-card__row"><span>Title</span><strong>{form.title || '—'}</strong></div>
              <div className="review-card__row"><span>Subtitle</span><strong>{form.subtitle || '—'}</strong></div>
              <div className="review-card__row"><span>Category</span><strong>{categories.find((c) => c.id === form.category)?.name}</strong></div>
              <div className="review-card__row"><span>Level</span><strong>{form.level}</strong></div>
              <div className="review-card__row"><span>Price</span><strong>{form.priceType === 'free' ? 'Free' : `$${form.price}`}</strong></div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" loading={submitting} onClick={() => submit('draft')}>Save as draft</Button>
              <Button loading={submitting} onClick={() => submit('publish')}>Submit for review</Button>
            </div>
            <p className="text-xs text-slate-400">After submitting, an admin will review your course before it goes live.</p>
          </div>
        )}

        <div className="wizard-nav">
          {step > 0 && <Button variant="ghost" onClick={back}>Back</Button>}
          {step < steps.length - 1 && (
            <Button disabled={!canNext} onClick={next}>Continue</Button>
          )}
        </div>
      </div>
    </div>
  );
}