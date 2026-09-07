import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getInstructor } from '../../utils/helpers';
import './cart.css';

export default function CartPage() {
  const { cart, removeFromCart, subtotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = React.useState(0);

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1);
      showToast('Promo applied: 10% off');
    } else {
      showToast('Invalid promo code', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Shopping Cart</h1>
        <div className="mt-8">
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            description="Courses you add to your cart will show up here."
            action={<Link to="/courses"><Button>Browse courses</Button></Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Shopping Cart</h1>
      <p className="page-sub">{cart.length} course{cart.length !== 1 ? 's' : ''} in your cart</p>

      <div className="cart-grid">
        <div className="cart-items">
          {cart.map((c) => (
            <div key={c.id} className="cart-item">
              <Link to={`/courses/${c.id}`} className="cart-item__media">
                <img src={c.thumbnail} alt={c.title} />
              </Link>
              <div className="cart-item__body">
                <h3 className="cart-item__title">{c.title}</h3>
                <p className="cart-item__instructor">{getInstructor(c.instructorId)?.name}</p>
                {c.bestseller && <Badge tone="amber">Bestseller</Badge>}
                <div className="cart-item__price">{c.price === 0 ? 'Free' : `$${c.price.toFixed(2)}`}</div>
              </div>
              <button
                className="cart-item__remove"
                onClick={() => { removeFromCart(c.id); showToast('Removed from cart', 'info'); }}
                aria-label={`Remove ${c.title}`}
              >
                <Icon name="trash" size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 className="font-bold text-lg mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-semibold mb-1">
              <span>Discount</span><span>−${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-extrabold text-lg mt-3 mb-4">
            <span>Total</span><span>${(subtotal - discount).toFixed(2)}</span>
          </div>
          <div className="cart-promo">
            <input placeholder="Promo code" value={promo} onChange={(e) => setPromo(e.target.value)} aria-label="Promo code" />
            <Button variant="secondary" size="sm" onClick={applyPromo}>Apply</Button>
          </div>
          <Button className="w-full mt-4" onClick={() => navigate('/checkout')}>Go to Checkout</Button>
          <p className="text-xs text-slate-400 text-center mt-3">30-day money-back guarantee on every course.</p>
        </div>
      </div>
    </div>
  );
}