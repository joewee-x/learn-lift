import { useState } from 'react';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import './admset.css';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: 'LearnHub',
    tagline: 'Learn anything, anywhere',
    currency: 'USD',
    commission: 30,
    supportEmail: 'support@learnhub.io',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Platform settings</h1>
          <p className="page-sub">Branding, currency, and platform-wide rules</p>
        </div>
      </div>

      <div className="card p-6 max-w-2xl">
        <h2 className="admin-card-title">Branding</h2>
        <div className="space-y-4">
          <label className="admset-field">
            <span>Platform name</span>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </label>
          <label className="admset-field">
            <span>Tagline</span>
            <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
          </label>
        </div>
      </div>

      <div className="card p-6 max-w-2xl mt-5">
        <h2 className="admin-card-title">Commerce</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="admset-field">
            <span>Default currency</span>
            <select value={form.currency} onChange={(e) => set('currency', e.target.value)}>
              <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
            </select>
          </label>
          <label className="admset-field">
            <span>Platform commission (%)</span>
            <input type="number" min="0" max="100" value={form.commission} onChange={(e) => set('commission', e.target.value)} />
          </label>
        </div>
        <p className="text-xs text-slate-400 mt-2">Instructors earn {(100 - form.commission).toFixed(0)}% of each sale.</p>
      </div>

      <div className="card p-6 max-w-2xl mt-5">
        <h2 className="admin-card-title">Contact</h2>
        <label className="admset-field">
          <span>Support email</span>
          <input type="email" value={form.supportEmail} onChange={(e) => set('supportEmail', e.target.value)} />
        </label>
      </div>

      <div className="mt-5">
        <Button onClick={() => showToast('Platform settings saved')}>Save settings</Button>
      </div>
    </div>
  );
}