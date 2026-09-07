import { Link } from 'react-router-dom';
import RatingStars from './ui/RatingStars';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { getInstructor } from '../utils/helpers';
import './coursecard.css';

export default function CourseListItem({ course, right }) {
  const instructor = getInstructor(course.instructorId);
  return (
    <div className="clist">
      <Link to={`/courses/${course.id}`} className="clist__media">
        <img src={course.thumbnail} alt={course.title} loading="lazy" />
      </Link>
      <div className="clist__body">
        <Link to={`/courses/${course.id}`} className="clist__title">{course.title}</Link>
        <p className="clist__instructor">{instructor?.name}</p>
        <RatingStars rating={course.rating} count={course.studentCount} />
        <div className="flex items-center gap-2 mt-1">
          {course.bestseller && <Badge tone="amber">Bestseller</Badge>}
          <span className="clist__price">{course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}</span>
        </div>
      </div>
      {right && <div className="clist__right">{right}</div>}
      <div className="clist__actions">
        <Link to={`/courses/${course.id}`}><Button variant="secondary" size="sm">View</Button></Link>
      </div>
    </div>
  );
}