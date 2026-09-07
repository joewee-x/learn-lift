import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import RatingStars from '../components/ui/RatingStars';
import Icon from '../components/ui/Icon';
import Skeleton from '../components/ui/Skeleton';
import { api } from '../services/api';
import { getCategory } from '../utils/helpers';
import { users } from '../data/db';
import './landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const instructors = users.filter((u) => u.role === 'instructor');
  const categories = [{ id: 'c1', name: 'Web Development' }, { id: 'c2', name: 'Design' }, { id: 'c3', name: 'Business' }, { id: 'c4', name: 'Data Science' }, { id: 'c5', name: 'Marketing' }, { id: 'c6', name: 'Photography' }];

  useEffect(() => {
    api.getPublishedCourses().then((c) => { setCourses(c); setLoading(false); });
  }, []);

  const popular = [...courses].sort((a, b) => b.studentCount - a.studentCount).slice(0, 6);
  const byCategory = {};
  courses.forEach((c) => { (byCategory[c.category] = byCategory[c.category] || []).push(c); });
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1].length - a[1].length)[0];
  const categoryCourses = topCategory ? topCategory[1].slice(0, 4) : [];

  const submit = (e) => {
    e.preventDefault();
    navigate(`/courses?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero__inner">
          <span className="hero__eyebrow">Learn anything, anywhere</span>
          <h1 className="hero__title">Grow your career with the skills of tomorrow</h1>
          <p className="hero__sub">Learn from industry experts in web development, design, data science, and more. Join 100k+ learners building real-world skills.</p>
          <form className="hero__search" onSubmit={submit}>
            <Icon name="search" size={18} className="hero__searchicon" />
            <input placeholder="What do you want to learn today?" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search courses" />
            <button type="submit" className="hero__btn">Search</button>
          </form>
          <div className="hero__cta">
            <Link to="/courses" className="hero__primary">Explore Courses</Link>
            <Link to="/become-instructor" className="hero__secondary">Teach on LearnHub</Link>
          </div>
          <div className="hero__stats">
            <span><strong>100K+</strong> learners</span>
            <span><strong>1.2K+</strong> courses</span>
            <span><strong>4.7</strong> avg rating</span>
          </div>
        </div>
      </section>

      <section className="page">
        <div className="cats">
          <h2 className="section-title">Browse by category</h2>
          <div className="cats__grid">
            {categories.map((c) => (
              <Link key={c.id} to={`/courses?cat=${c.id}`} className="cats__item">
                <span className="cats__name">{c.name}</span>
                <Icon name="chevronRight" size={16} />
              </Link>
            ))}
          </div>
        </div>

        <h2 className="section-title">Popular courses</h2>
        <div className="row-scroll">
          {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-64 h-72" />)
            : popular.map((c) => <div key={c.id} className="row-scroll__item"><CourseCard course={c} /></div>)}
        </div>

        {categoryCourses.length > 0 && (
          <>
            <h2 className="section-title">{getCategory(topCategory[0])?.name || 'Trending'} this week</h2>
            <div className="row-scroll">
              {categoryCourses.map((c) => <div key={c.id} className="row-scroll__item"><CourseCard course={c} /></div>)}
            </div>
          </>
        )}

        <h2 className="section-title">Top instructors</h2>
        <div className="row-scroll">
          {instructors.map((i) => (
            <div key={i.id} className="instructor-card">
              <img src={i.avatar} alt={i.name} className="instructor-card__avatar" />
              <h3 className="instructor-card__name">{i.name}</h3>
              <p className="instructor-card__bio">{i.bio}</p>
              <div className="instructor-card__meta">
                <RatingStars rating={4.8} size={12} />
                <span>· 4.8</span>
              </div>
            </div>
          ))}
        </div>

        <section className="testimonials">
          <h2 className="section-title">What students say</h2>
          <div className="testimonials__grid">
            {[
              { name: 'Morgan Lee', text: 'Learned React in 6 weeks and landed a junior dev role. Unreal value.', course: 'Complete React Developer Bootcamp' },
              { name: 'Priya Nair', text: 'The design course transformed how I approach every project.', course: 'UI/UX Design Masterclass' },
              { name: 'Diego Ramos', text: 'Clear, practical, and well-paced. Best money I have spent.', course: 'Data Science with Python' },
            ].map((t) => (
              <div key={t.name} className="testimonial">
                <RatingStars rating={5} />
                <p className="testimonial__text">"{t.text}"</p>
                <p className="testimonial__meta"><strong>{t.name}</strong> · {t.course}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-banner">
          <h2>Ready to start learning?</h2>
          <p>Join over 100,000 students already growing their careers on LearnHub.</p>
          <Link to="/signup" className="hero__primary">Get started — it's free</Link>
        </section>
      </section>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <span className="navbar__logo-mark">LH</span>
            <span className="footer__name">LearnHub</span>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <h4>LearnHub</h4>
              <a href="#about">About us</a>
              <a href="#careers">Careers</a>
              <a href="#blog">Blog</a>
            </div>
            <div className="footer__col">
              <h4>Subjects</h4>
              <Link to="/courses?cat=c1">Web Development</Link>
              <Link to="/courses?cat=c2">Design</Link>
              <Link to="/courses?cat=c4">Data Science</Link>
            </div>
            <div className="footer__col">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <Link to="/become-instructor">Become an instructor</Link>
              <a href="#terms">Terms of use</a>
            </div>
          </div>
        </div>
        <p className="footer__legal">© 2026 LearnHub. All rights reserved.</p>
      </footer>
    </div>
  );
}