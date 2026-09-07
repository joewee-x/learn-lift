import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import './becomeinstructor.css';

const benefits = [
  { title: 'Earn money', desc: 'Set your own price and earn up to 70% of every sale.', icon: 'dollar' },
  { title: 'Reach millions', desc: 'Your courses get in front of a global audience of learners.', icon: 'users' },
  { title: 'Easy tools', desc: 'A simple course builder — no technical skills required.', icon: 'settings' },
];

const steps = [
  { num: 1, title: 'Plan your course', desc: 'Outline your curriculum and decide what students will learn.' },
  { num: 2, title: 'Record your content', desc: 'Use our player-ready formats for video, articles, and quizzes.' },
  { num: 3, title: 'Submit for review', desc: 'Our team reviews and approves your course to go live.' },
];

export default function BecomeInstructor() {
  const navigate = useNavigate();
  return (
    <div className="bi">
      <section className="bi__hero">
        <div className="bi__hero-inner">
          <h1 className="bi__title">Teach your way. Earn on your terms.</h1>
          <p className="bi__sub">Create and publish courses that reach students around the world. We handle the platform — you focus on what you love.</p>
          <div className="bi__cta">
            <Button size="lg" onClick={() => navigate('/signup')}>Start teaching today</Button>
          </div>
          <p className="bi__stats">25K+ active instructors · 100K+ students</p>
        </div>
      </section>

      <section className="page">
        <h2 className="section-title">Why teach on LearnHub?</h2>
        <div className="bi__benefits">
          {benefits.map((b) => (
            <div key={b.title} className="bi__benefit">
              <div className="bi__benefit-icon"><Icon name={b.icon} size={22} /></div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="section-title">Getting started is simple</h2>
        <div className="bi__steps">
          {steps.map((s) => (
            <div key={s.num} className="bi__step">
              <span className="bi__step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bi__banner">
          <div>
            <h2>Ready to share your knowledge?</h2>
            <p>Create your first course today — it's free to get started.</p>
          </div>
          <Button size="lg" onClick={() => navigate('/signup')}>Get started</Button>
        </div>
        <p className="bi__back"><Link to="/courses">← Browse courses instead</Link></p>
      </section>
    </div>
  );
}