import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const plans = [
  {
    name: 'BASIC',
    price: '₹1,000',
    period: '/ month',
    desc: 'Perfect for getting started',
    features: ['Gym floor access', 'Locker room access', '2 group classes/month', 'Basic fitness assessment', 'Mobile app access'],
    notIncluded: ['Personal trainer sessions', 'Nutrition coaching', 'Premium classes'],
    color: '#808080',
    highlight: false,
  },
  {
    name: 'STANDARD',
    price: '₹2,800',
    period: '/ 3 months',
    desc: 'Most popular choice',
    features: ['Everything in Basic', 'Unlimited group classes', '2 PT sessions/month', 'Nutrition consultation', 'Steam room & pool'],
    notIncluded: ['Dedicated personal trainer'],
    color: 'var(--primary)',
    highlight: true,
  },
  {
    name: 'PREMIUM',
    price: '₹5,000',
    period: '/ 6 months',
    desc: 'For serious athletes',
    features: ['Everything in Standard', 'Unlimited PT sessions', 'Dedicated personal trainer', 'Custom diet plan', 'Priority class booking', 'Guest passes (4/month)'],
    notIncluded: [],
    color: '#D4A574',
    highlight: false,
  },
];

export default function Membership() {
  return (
    <div>
      <Navbar />

      <section style={{ background: '#000000', color: 'white', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>Membership Plans</h1>
          <p style={{ color: '#b0b0b0', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>
            Choose the plan that fits your fitness journey. No hidden fees. No annual contracts.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
            {plans.map(p => (
              <div key={p.name} className="card" style={{
                padding: '2rem',
                border: p.highlight ? `2px solid ${p.color}` : '1px solid var(--border)',
                position: 'relative',
                transform: p.highlight ? 'scale(1.03)' : 'none',
                boxShadow: p.highlight ? '0 8px 30px rgba(212,165,116,0.15)' : undefined,
              }}>
                {p.highlight && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#000000', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ color: p.color, fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{p.name}</div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{p.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.period}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{p.desc}</div>
                <Link to="/join" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem', background: p.highlight ? 'var(--primary)' : p.color, color: p.highlight ? '#000000' : 'white' }}>
                  Get Started
                </Link>
                <ul style={{ listStyle: 'none' }}>
                  {p.features.map(f => (
                    <li key={f} style={{ padding: '0.375rem 0', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', color: 'white' }}>
                      <span style={{ color: 'var(--primary)' }}>✓</span> {f}
                    </li>
                  ))}
                  {p.notIncluded.map(f => (
                    <li key={f} style={{ padding: '0.375rem 0', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <span>✗</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
