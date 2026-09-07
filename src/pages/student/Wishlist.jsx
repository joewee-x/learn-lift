import { useNavigate } from 'react-router-dom';
import CourseListItem from '../../components/CourseListItem';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const moveToCart = (course) => {
    addToCart(course);
    toggleWishlist(course);
    showToast('Moved to cart');
    navigate('/cart');
  };

  return (
    <div className="page">
      <h1 className="page-title">Wishlist</h1>
      <p className="page-sub">Courses you've saved for later.</p>
      <div className="mt-6 space-y-3">
        {wishlist.length === 0 ? (
          <EmptyState
            icon="🤍"
            title="Your wishlist is empty"
            description="Save courses you're interested in to find them here later."
            action={<Button onClick={() => navigate('/courses')}>Browse courses</Button>}
          />
        ) : (
          wishlist.map((c) => (
            <CourseListItem
              key={c.id}
              course={c}
              right={
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => moveToCart(c)}><Icon name="cart" size={14} /> Move to cart</Button>
                  <Button size="sm" variant="ghost" onClick={() => { toggleWishlist(c); showToast('Removed from wishlist', 'info'); }}>
                    <Icon name="trash" size={14} />
                  </Button>
                </div>
              }
            />
          ))
        )}
      </div>
    </div>
  );
}