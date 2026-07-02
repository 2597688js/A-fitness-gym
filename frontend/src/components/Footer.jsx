import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '3rem 0 1.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white', marginBottom: '0.75rem' }}>
              ⚡ A Fitness Gym
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
              Your journey to peak performance starts here. World-class facilities, expert trainers.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Quick Links</div>
            {[['/', 'Home'], ['/about', 'About'], ['/classes', 'Classes'], ['/pricing', 'Pricing'], ['/join', 'Join Now']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: '0.375rem' }}>
                <Link to={to} style={{ fontSize: '0.875rem', color: '#94a3b8', transition: 'color 0.15s' }}
                  onMouseOver={e => e.target.style.color = 'white'}
                  onMouseOut={e => e.target.style.color = '#94a3b8'}>
                  {label}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Contact</div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.8 }}>
              📍 A Fitness Gym by Amit Hussain,<br />Amit Market, Jagiroad<br />Pin - 782410<br />
              📞 +91 98765 43210<br />
              ✉️ info@afitnessgyam.com<br />
              🕐 Mon–Sat: 5am – 11pm
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} A Fitness Gym. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
