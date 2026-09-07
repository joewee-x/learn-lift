import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RatingStars from '../components/ui/RatingStars';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Tabs from '../components/ui/Tabs';
import CourseCard from '../components/CourseCard';
import Skeleton from '../components/ui/Skeleton';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { getInstructor, getCategory, formatDate, formatDuration } from '../utils/helpers';
import './coursedetail.css';

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, isWishlisted, toggleWishlist } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [related, setRelated] = useState([]);
  const inCart = course && cart.some((c) => c.id === course.id);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCourse(courseId),
      api.getCurriculum(courseId),
      api.getReviews(courseId),
      api.getPublishedCourses(),
    ]).then(([c, cur, rev, all]) => {
      if (c) {
        setCourse(c);
        setCurriculum(cur);
        setReviews(rev);
        setRelated(all.filter((x) => x.id !== c.id && (x.category === c.category || x.level === c.level)).slice(0, 4));
        if (all.length === 0 || !all.find((x) => x.id === c.id)) { /* published only */ }
      }
      setLoading(false);
    });
  }, [courseId]);

  if (loading) {
    return (
      <div className="page">
        <Skeleton className="h-10 w-2/3 mt-8" />
        <Skeleton className="h-4 w-1/2 mt-4" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2"><Skeleton variant="media" className="h-72" /></div>
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page">
        <h1>Course not found</h1>
        <p>The course you're looking for doesn't exist or was removed.</p>
      </div>
    );
  }

  const instructor = getInstructor(course.instructorId);
  const totalLessons = curriculum.reduce((s, scc) => s + scc.lessons.length, 0);
  const totalDuration = curriculum.reduce((s, scc) => s + scc.lessons.reduce((x, l) => x + (l.duration || 0), 0), 0);
  const ratingDist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, pct: reviews.length ? (count / reviews.length) * 100 : 0 };
  });
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : course.rating;

  const addAndGo = () => {
    if (!user) { navigate('/login', { state: { from: `/courses/${courseId}` } }); return; }
    if (user.role !== 'student') { navigate('/dashboard'); return; }
    addToCart(course);
    navigate('/cart');
  };

  const buyNow = () => {
    if (!user) { navigate('/login', { state: { from: `/courses/${courseId}` } }); return; }
    if (user.role !== 'student') { navigate('/dashboard'); return; }
    addToCart(course);
    navigate('/checkout');
  };

  const priceBox = (
    <div className="cd-price">
      <div className="cd-price__img">
        <img src={course.thumbnail} alt={course.title} />
      </div>
      <div className="cd-price__row">
        <span className="cd-price__amount">{course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}</span>
        {course.price > 0 && <span className="cd-price__guarantee">30-day money-back guarantee</span>}
      </div>
      {course.price > 0 && (
        <div className="cd-price__actions">
          <Button onClick={addAndGo} disabled={inCart}>{inCart ? `In cart · Go to cart` : 'Add to Cart'}</Button>
          <Button variant="secondary" onClick={buyNow}>Buy Now</Button>
        </div>
      )}
      {course.price === 0 && (
        <Button className="w-full" onClick={addAndGo} disabled={inCart}>Enroll Free</Button>
      )}
      <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => { toggleWishlist(course); showToast(isWishlisted(course.id) ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
        <Icon name="heart" size={16} /> {isWishlisted(course.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </Button>
      <div className="cd-price__meta">
        <span><strong>Includes:</strong> {totalLessons} lessons · {formatDuration(totalDuration)} of content</span>
        <span><strong>Level:</strong> {course.level}</span>
        <span><strong>Certificate</strong> of completion</span>
      </div>
    </div>
  );

  return (
    <div>
      <header className="cd-header">
        <div className="cd-header__inner">
          <p className="cd-header__eyebrow">{getCategory(course.category)?.name}</p>
          <h1 className="cd-header__title">{course.title}</h1>
          <p className="cd-header__sub">{course.subtitle}</p>
          <div className="cd-header__meta">
            <Badge tone="amber">{course.bestseller ? 'Bestseller' : course.level}</Badge>
            <RatingStars rating={avgRating} count={course.studentCount} />
          </div>
          <p className="cd-header__stats">
            {course.studentCount.toLocaleString()} students enrolled · Updated {formatDate(course.updatedAt)} · English
          </p>
        </div>
      </header>

      <div className="page cd-body">
        <div className="cd-grid">
          <div className="cd-main">
            <div className="cd-preview">
              <div className="cd-preview__thumb">
                <img src={course.thumbnail} alt={course.title} />
                <button className="cd-preview__play" aria-label="Play course preview"><Icon name="play" size={28} /></button>
              </div>
            </div>

            <Tabs
              tabs={[
                { value: 'overview', label: 'Overview' },
                { value: 'curriculum', label: 'Curriculum' },
                { value: 'instructor', label: 'Instructor' },
                { value: 'reviews', label: `Reviews (${reviews.length})` },
              ]}
              active={tab}
              onChange={setTab}
            />

            <div className="cd-main__content">
              {tab === 'overview' && (
                <div className="cd-tab">
                  <h2>What you'll learn</h2>
                  <ul className="cd-learn">
                    {course.whatYouLearn.map((w, i) => (
                      <li key={i}><Icon name="check" size={16} className="text-brand-600" /> {w}</li>
                    ))}
                  </ul>
                  <h2>Description</h2>
                  <p className="cd-desc">{course.description}</p>
                </div>
              )}

              {tab === 'curriculum' && (
                <div className="cd-tab">
                  <p className="text-sm text-slate-500 mb-4">{totalLessons} lessons · {formatDuration(totalDuration)}</p>
                  {curriculum.map((sec) => (
                    <div key={sec.id} className="cd-sec">
                      <h3 className="cd-sec__title">{sec.title}</h3>
                      <ul className="cd-lessons">
                        {sec.lessons.map((l) => (
                          <li key={l.id} className="cd-lesson">
                            <Icon name={l.type === 'video' ? 'play' : l.type === 'text' ? 'file' : l.type === 'quiz' ? 'checkCircle' : 'upload'} size={16} className="cd-lesson__icon" />
                            <span className="cd-lesson__title">{l.title}</span>
                            {l.isPreview && <span className="cd-lesson__preview">Preview</span>}
                            {l.duration > 0 && <span className="cd-lesson__dur">{formatDuration(l.duration)}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'instructor' && (
                <div className="cd-tab cd-instructor">
                  <div className="cd-instructor__head">
                    <img src={instructor?.avatar} alt={instructor?.name} className="cd-instructor__avatar" />
                    <div>
                      <h2 className="text-lg font-bold">{instructor?.name}</h2>
                      <p className="text-sm text-slate-500">{instructor?.bio}</p>
                      <Badge tone="brand">{course.studentCount.toLocaleString()} students taught</Badge>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'reviews' && (
                <div className="cd-tab">
                  <div className="cd-ratings">
                    <div className="cd-ratings__summary">
                      <span className="cd-ratings__num">{avgRating.toFixed(1)}</span>
                      <RatingStars rating={avgRating} size={18} />
                      <span className="text-sm text-slate-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="cd-ratings__bars">
                      {ratingDist.map((r) => (
                        <div key={r.star} className="cd-ratings__bar">
                          <span className="text-xs">{r.star}★</span>
                          <div className="cd-ratings__track"><div className="cd-ratings__fill" style={{ width: `${r.pct}%` }} /></div>
                          <span className="text-xs text-slate-400">{Math.round(r.pct)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="cd-reviews">
                    {reviews.map((r) => (
                      <div key={r.id} className="cd-review">
                        <div className="cd-review__head">
                          <img src={`https://i.pravatar.cc/80?u=${r.studentId}`} alt="" className="cd-review__avatar" />
                          <div>
                            <span className="font-semibold text-sm">{r.studentName}</span>
                            <RatingStars rating={r.rating} size={12} />
                            <span className="text-xs text-slate-400 ml-1">{formatDate(r.createdAt)}</span>
                          </div>
                        </div>
                        <p className="cd-review__comment">{r.comment}</p>
                      </div>
                    ))}
                    {reviews.length === 0 && <p className="text-sm text-slate-500 py-6">No reviews yet. Be the first!</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="cd-aside">{priceBox}</aside>
        </div>

        {related.length > 0 && (
          <div className="cd-related">
            <h2 className="section-title">Students also bought</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}