import { useState } from 'react';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './settings.css';

function Toggle({ label, desc, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="set-toggle">
      <div>
        <span className="set-toggle__label">{label}</span>
        {desc && <span className="set-toggle__desc">{desc}</span>}
      </div>
      <input
        type="checkbox"
        checked={on}
        onChange={() => setOn((o) => !o)}
        className="set-toggle__input"
      />
    </label>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState('account');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <div className="page page--narrow">
      <h1 className="page-title">Settings</h1>
      <div className="mt-6">
        <Tabs
          tabs={[
            { value: 'account', label: 'Account' },
            { value: 'security', label: 'Password & security' },
            { value: 'payments', label: 'Payment methods' },
            { value: 'notifications', label: 'Notifications' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-6">
        {tab === 'account' && (
          <div className="set-card">
            <h3 className="set-card__title">Account information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="set-field">
                <span>Full name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="set-field">
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </div>
            <div className="mt-4">
              <Button onClick={() => showToast('Settings saved')}>Save changes</Button>
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="set-card">
            <h3 className="set-card__title">Change password</h3>
            <div className="space-y-4 max-w-md">
              <label className="set-field"><span>Current password</span><input type="password" placeholder="••••••••" /></label>
              <label className="set-field"><span>New password</span><input type="password" placeholder="Min 8 characters" /></label>
              <label className="set-field"><span>Confirm new password</span><input type="password" placeholder="Min 8 characters" /></label>
              <Button onClick={() => showToast('Password updated')}>Update password</Button>
            </div>
          </div>
        )}

        {tab === 'payments' && (
          <div className="set-card">
            <h3 className="set-card__title">Payment methods</h3>
            <div className="set-pay">
              <div className="set-pay__icon">💳</div>
              <div>
                <p className="font-semibold text-sm">Visa ending in 4242</p>
                <p className="text-xs text-slate-500">Expires 09/28</p>
              </div>
              <Badge tone="brand">Default</Badge>
              <Button variant="ghost" size="sm"><Icon name="trash" size={16} /></Button>
            </div>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => showToast('This is a demo — no real card added', 'info')}>
              <Icon name="plus" size={14} /> Add payment method
            </Button>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="set-card">
            <h3 className="set-card__title">Notification preferences</h3>
            <div className="set-toggles">
              <Toggle label="New grades" desc="When an assignment is graded" defaultOn />
              <Toggle label="Course announcements" desc="When instructors post updates" defaultOn />
              <Toggle label="Price drops" desc="When a wishlist item goes on sale" defaultOn />
              <Toggle label="Weekly digest" desc="A weekly summary of your learning" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

