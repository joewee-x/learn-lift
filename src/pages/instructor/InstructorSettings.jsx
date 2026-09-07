import { useState } from 'react';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './inset.css';

function Toggle({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="set-toggle">
      <div>
        <span className="set-toggle__label">{label}</span>
        <span className="set-toggle__desc">{desc}</span>
      </div>
      <input type="checkbox" checked={on} onChange={() => setOn((o) => !o)} className="set-toggle__input" />
    </label>
  );
}

export default function InstructorSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState('profile');
  const [bio, setBio] = useState(user.bio || '');

  return (
    <div className="page page--narrow">
      <h1 className="page-title">Instructor settings</h1>
      <div className="mt-6">
        <Tabs
          tabs={[
            { value: 'profile', label: 'Profile' },
            { value: 'payout', label: 'Payout method' },
            { value: 'notifications', label: 'Notifications' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-6">
        {tab === 'profile' && (
          <div className="set-card">
            <h3 className="set-card__title">Instructor profile (shown to students)</h3>
            <div className="flex gap-4 items-start">
              <img src={user.avatar || `https://i.pravatar.cc/80?u=${user.id}`} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
              <label className="set-field flex-1">
                <span>Bio</span>
                <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell students about your experience…" />
              </label>
            </div>
            <div className="mt-4">
              <Button onClick={() => showToast('Profile updated')}>Save profile</Button>
            </div>
          </div>
        )}

        {tab === 'payout' && (
          <div className="set-card">
            <h3 className="set-card__title">Payout method</h3>
            <div className="space-y-4 max-w-md">
              <label className="set-field"><span>Payout account email</span><input defaultValue={user.email} /></label>
              <label className="set-field">
                <span>Payment method</span>
                <select className="ins-select"><option>Bank transfer</option><option>PayPal</option></select>
              </label>
              <Button onClick={() => showToast('Payout method saved')}>Save</Button>
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="set-card">
            <h3 className="set-card__title">Notification preferences</h3>
            <div className="set-toggles">
              <Toggle label="New enrollment" desc="When a student enrolls in your course" defaultOn />
              <Toggle label="New review" desc="When a student leaves a rating or review" defaultOn />
              <Toggle label="New question" desc="When a student asks a question" defaultOn />
              <Toggle label="Weekly summary" desc="Weekly stats and earnings digest" defaultOn />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}