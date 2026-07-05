import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSlider from '../../components/HeroSlider';

const features = [
  { icon: '🏋️', title: 'World-Class Equipment', desc: 'State-of-the-art machines and free weights for every fitness goal.' },
  { icon: '👨‍🏫', title: 'Expert Trainers', desc: 'Certified personal trainers dedicated to your transformation.' },
  { icon: '🧘', title: '50+ Classes Weekly', desc: 'Yoga, HIIT, Pilates, Zumba and more — for all fitness levels.' },
  { icon: '🥗', title: 'Nutrition Guidance', desc: 'Personalized meal plans to complement your workout routine.' },
  { icon: '🚿', title: 'Premium Facilities', desc: 'Locker rooms, steam room, juice bar — because you deserve the best.' },
  { icon: '📱', title: 'Member App', desc: 'Track workouts, book classes, and manage your membership online.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Lost 18kg in 5 months', text: '<strong>A Fitness Gym by Amit Hussain</strong> changed my life. The trainers are incredible and the community keeps me motivated every single day.' },
  { name: 'Rahul Mehta', role: 'Marathon Runner', text: 'The training programs here are elite level. I shaved 20 minutes off my marathon time after just 3 months of coaching.' },
  { name: 'Sneha Patel', role: 'Yoga Enthusiast', text: 'The yoga classes here are unlike anything I\'ve experienced. The instructors are deeply knowledgeable and truly caring.' },
];

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: '#000000',
        color: 'white', padding: 'clamp(2rem, 8vw, 6rem) 0', textAlign: 'center',
      }}>
        <HeroSlider />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)', zIndex: 1 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-block', background: '#0ea5e9', border: 'none', borderRadius: '9999px', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: '1.5rem' }}>
            🏋️ A Fitness Gym by Amit Hussain - BENGALURU
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
            BUILT.<br />
            <span style={{ color: '#D4A574' }}>NOT BORN.</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#b0b0b0', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Where serious training meets an environment that respects your effort. Premium equipment, expert coaches, zero noise.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/membership" className="btn btn-primary btn-lg">View Plans →</Link>
            <Link to="/about" className="btn btn-lg" style={{ background: 'rgba(212,165,116,0.1)', color: 'white', border: '1px solid rgba(212,165,116,0.3)' }}>Our Story</Link>
          </div>
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
            {[['12+', 'Premium Trainers'], ['500+', 'Active Members'], ['6', 'Years of Excellence']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D4A574' }}>{num}</div>
                <div style={{ fontSize: '0.85rem', color: '#808080' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white' }}>Everything You Need to Succeed</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>We've built the ultimate fitness environment so all you have to do is show up.</p>
          </div>
          <div className="grid-3">
            {features.map(f => (
              <div key={f.title} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '0.875rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section style={{ background: 'var(--primary)', color: '#000000', padding: '2.5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000000' }}>📞 Get in Touch</h3>
          <p style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#333333' }}>Have questions? Contact us on WhatsApp or give us a call!</p>
          <a href="tel:+919876543210" style={{ display: 'inline-block', background: '#000000', color: 'var(--primary)', padding: '0.875rem 2rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
            📱 Call: 234567899
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white' }}>Real Results, Real People</h2>
            <p style={{ color: 'var(--text-muted)' }}>Don't take our word for it — hear from our members.</p>
          </div>
          <div className="grid-3">
            {testimonials.map(t => (
              <div key={t.name} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fbbf24' }}>★★★★★</div>
                <p style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--primary)', color: '#000000', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.875rem', color: '#000000' }}>Ready to Get Started?</h2>
          <p style={{ fontSize: '1.05rem', color: '#333333', marginBottom: '2rem' }}>Join hundreds of members who transformed their health with <strong>A Fitness Gym by Amit Hussain</strong>.</p>
          <Link to="/membership" className="btn btn-lg" style={{ background: '#000000', color: 'var(--primary)', fontWeight: 700 }}>
            View Membership Plans →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
