import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Badge from '../../components/ui/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './checkout.css';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', name: '' });

  const total = subtotal;

  const pay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      clearCart();
      showToast('Payment successful!');
    }, 1200);
  };

  if (done) {
    return (
      <div className="page page--narrow">
        <div className="co-done">
          <div className="co-done__icon"><Icon name="checkCircle" size={44} /></div>
          <h1 className="text-2xl font-extrabold mt-3">Purchase complete!</h1>
          <p className="text-slate-500 mt-1">Your courses are now in My Learning. Happy learning!</p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate('/my-learning')}>Start Learning</Button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page page--narrow">
        <h1 className="page-title mt-6">Checkout</h1>
        <p className="text-slate-500 mt-4">Your cart is empty. <Link to="/courses">Browse courses</Link> first.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>
      <div className="co-grid">
        <form className="co-form" onSubmit={pay}>
          <div className="co-section">
            <h3>Contact</h3>
            <label className="co-field">
              <span>Email</span>
              <input type="email" required placeholder="you@example.com" defaultValue="ava@example.com" />
            </label>
          </div>
          <div className="co-section">
            <h3>Payment details <Badge tone="neutral">Mock</Badge></h3>
            <label className="co-field">
              <span>Name on card</span>
              <input required value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="Ava Chen" />
            </label>
            <label className="co-field">
              <span>Card number</span>
              <div className="relative">
                <input className="w-full" required inputMode="numeric" maxLength={19} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" />
                <span className="co-cardlogo">💳</span>
              </div>
            </label>
            <div className="co-row">
              <label className="co-field">
                <span>Expiry</span>
                <input required placeholder="MM/YY" maxLength={5} value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} />
              </label>
              <label className="co-field">
                <span>CVC</span>
                <input required inputMode="numeric" maxLength={4} placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
              </label>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" loading={processing}>
            Complete Purchase · ${total.toFixed(2)}
          </Button>
          <p className="text-xs text-slate-400 text-center mt-3">This is a demo — no real payment is processed.</p>
        </form>

        <div className="co-summary">
          <h3 className="font-bold mb-3">Order summary</h3>
          {cart.map((c) => (
            <div key={c.id} className="co-item">
              <img src={c.thumbnail} alt={c.title} />
              <span className="co-item__title">{c.title}</span>
              <span className="co-item__price">{c.price === 0 ? 'Free' : `$${c.price.toFixed(2)}`}</span>
            </div>
          ))}
          <div className="co-total">
            <span>Total</span><strong>${total.toFixed(2)}</strong>
          </div>
          <p className="text-xs text-slate-400">30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
}