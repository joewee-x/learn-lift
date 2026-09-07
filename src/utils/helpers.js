import { users, courses, categories } from '../data/db';

export function getInstructor(id) {
  return users.find((u) => u.id === id);
}

export function getUser(id) {
  return users.find((u) => u.id === id);
}

export function getCategory(id) {
  return categories.find((c) => c.id === id);
}

export function getCourse(id) {
  return courses.find((c) => c.id === id);
}

export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...opts });
}

export function formatDuration(seconds) {
  if (!seconds) return '—';
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function initials(name = '') {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}