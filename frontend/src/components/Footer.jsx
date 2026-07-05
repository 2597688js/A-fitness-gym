import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#000000', color: '#b0b0b0', padding: '3rem 0 1.5rem', borderTop: '1px solid rgba(212,165,116,0.2)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#D4A574', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              🔥 FORGE
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
              Premium fitness in Bengaluru. Built. Not Born. Where serious training meets zero noise.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Quick Links</div>
            {[['/', 'Home'], ['/about', 'About'], ['/membership', 'Membership'], ['/trainers', 'Trainers'], ['/contact', 'Contact']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: '0.375rem' }}>
                <Link to={to} style={{ fontSize: '0.875rem', color: '#b0b0b0', transition: 'color 0.15s' }}
                  onMouseOver={e => e.target.style.color = '#D4A574'}
                  onMouseOut={e => e.target.style.color = '#b0b0b0'}>
                  {label}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Contact</div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.8 }}>
              📍 Bengaluru, India<br />
              📞 +91 (234) 567-8900<br />
              ✉️ hello@forgefit.in<br />
              🕐 Mon–Fri: 6am – 11pm<br />
              Sat–Sun: 7am – 9pm
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(212,165,116,0.2)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} <span style={{ fontWeight: 800, background: '#0ea5e9', color: '#000', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>A Fitness Gym by Amit Hussain</span>. All rights reserved. Premium Fitness by Design.
        </div>
      </div>
    </footer>
  );
}
