import { Link } from 'react-router-dom';
import RatingStars from './ui/RatingStars';
import Badge from './ui/Badge';
import { getInstructor } from '../utils/helpers';
import './coursecard.css';

export default function CourseCard({ course, compact = false }) {
  const instructor = getInstructor(course.instructorId);
  return (
    <Link to={`/courses/${course.id}`} className="ccard">
      <div className="ccard__media">
        <img src={course.thumbnail} alt={course.title} loading="lazy" />
        {course.bestseller && <span className="ccard__bs">Bestseller</span>}
      </div>
      <div className="ccard__body">
        {!compact && course.level !== 'Beginner' && <Badge tone="neutral">{course.level}</Badge>}
        <h3 className="ccard__title">{course.title}</h3>
        <p className="ccard__instructor">{instructor?.name}</p>
        <RatingStars rating={course.rating} count={course.studentCount} />
        <div className="ccard__meta">
          <span className="ccard__price">{course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}</span>
          {course.studentCount > 0 && <span className="ccard__students">{course.studentCount.toLocaleString()} students</span>}
        </div>
      </div>
    </Link>
  );
}