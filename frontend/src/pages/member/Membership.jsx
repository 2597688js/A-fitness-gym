import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MemberSidebar from '../../components/MemberSidebar';

import { API_URL } from '../../config/api';

const PLANS = [
  { id: 'Basic', name: 'Basic', price: '₹1,000', duration: '1 Month', amount: 100000, features: ['Gym floor access', 'Locker room', '2 group classes/month'] },
  { id: 'Standard', name: 'Standard', price: '₹2,800', duration: '3 Months', amount: 280000, features: ['All Basic features', 'Unlimited group classes', '2 PT sessions/month', 'Nutrition consultation'], popular: true },
  { id: 'Premium', name: 'Premium', price: '₹5,000', duration: '6 Months', amount: 500000, features: ['All Standard features', 'Unlimited PT sessions', 'Custom diet plan', 'Priority class booking', '4 guest passes/month'] },
];

export default function MemberMembership() {
  const { token } = useAuth();
  const [selected, setSelected] = useState('Standard');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handlePay = async () => {
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const { data } = await axios.post(`${API_URL}/api/payment/create-order`, { plan: selected }, { headers: { Authorization: `Bearer ${token}` } });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'A Fitness Gym',
        description: `${selected} Membership — ${data.planData.duration}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await axios.post(`${API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: selected,
            }, { headers: { Authorization: `Bearer ${token}` } });
            setMsg({ type: 'success', text: `🎉 Payment successful! Your ${selected} membership is now active.` });
          } catch {
            setMsg({ type: 'error', text: 'Payment verification failed. Please contact support.' });
          }
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#0ea5e9' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setMsg({ type: 'error', text: 'Payment failed. Please try again.' }));
      rzp.open();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to initiate payment. Check if Razorpay keys are configured.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <MemberSidebar />
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Buy Membership</h1>
          <p style={{ color: 'var(--text-muted)' }}>Choose a plan and pay securely via Razorpay.</p>
        </div>

        {msg.text && <div className={`alert alert-${msg.type}`} style={{ maxWidth: 700 }}>{msg.text}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem', maxWidth: 800 }}>
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setSelected(p.id)} className="card" style={{
              padding: '1.5rem', cursor: 'pointer', position: 'relative',
              border: selected === p.id ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: selected === p.id ? 'var(--primary-light)' : 'white',
              transition: 'all 0.15s',
            }}>
              {p.popular && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>POPULAR</div>}
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{p.name}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>{p.price}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{p.duration}</div>
              <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {p.features.map(f => <li key={f} style={{ padding: '0.2rem 0' }}>✓ {f}</li>)}
              </ul>
              {selected === p.id && <div style={{ marginTop: '0.875rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>✓ Selected</div>}
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-lg" onClick={handlePay} disabled={loading}>
          {loading ? 'Processing…' : `Pay ${PLANS.find(p => p.id === selected)?.price} via Razorpay →`}
        </button>
        <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          🔒 Secured by Razorpay. Your payment info is never stored on our servers.
        </p>
      </main>
    </div>
  );
}
