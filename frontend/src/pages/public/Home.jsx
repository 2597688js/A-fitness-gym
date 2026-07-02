import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const features = [
  { icon: '🏋️', title: 'World-Class Equipment', desc: 'State-of-the-art machines and free weights for every fitness goal.' },
  { icon: '👨‍🏫', title: 'Expert Trainers', desc: 'Certified personal trainers dedicated to your transformation.' },
  { icon: '🧘', title: '50+ Classes Weekly', desc: 'Yoga, HIIT, Pilates, Zumba and more — for all fitness levels.' },
  { icon: '🥗', title: 'Nutrition Guidance', desc: 'Personalized meal plans to complement your workout routine.' },
  { icon: '🚿', title: 'Premium Facilities', desc: 'Locker rooms, steam room, juice bar — because you deserve the best.' },
  { icon: '📱', title: 'Member App', desc: 'Track workouts, book classes, and manage your membership online.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Lost 18kg in 5 months', text: 'A Fitness Gym changed my life. The trainers are incredible and the community keeps me motivated every single day.' },
  { name: 'Rahul Mehta', role: 'Marathon Runner', text: 'The training programs here are elite level. I shaved 20 minutes off my marathon time after just 3 months of coaching.' },
  { name: 'Sneha Patel', role: 'Yoga Enthusiast', text: 'The yoga classes here are unlike anything I\'ve experienced. The instructors are deeply knowledgeable and truly caring.' },
];

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0284c7 100%)',
        color: 'white', padding: 'clamp(2rem, 8vw, 6rem) 0', textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ display: 'inline-block', background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.4)', borderRadius: '9999px', padding: '0.375rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#7dd3fc', marginBottom: '1.5rem' }}>
            🎉 First Month FREE for New Members
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Transform Your Body.<br />
            <span style={{ color: '#38bdf8' }}>Transform Your Life.</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Join Mumbai's most premium fitness destination. Expert trainers, cutting-edge equipment, and a community that pushes you to be your best.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/join" className="btn btn-primary btn-lg">Start Free Trial →</Link>
            <Link to="/classes" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>View Classes</Link>
          </div>
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
            {[['2,000+', 'Active Members'], ['50+', 'Expert Trainers'], ['15,000 sq ft', 'Gym Floor'], ['10+', 'Years of Excellence']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>{num}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Everything You Need to Succeed</h2>
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

      {/* Testimonials */}
      <section className="section" style={{ background: '#f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Real Results, Real People</h2>
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
      <section className="section" style={{ background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.875rem' }}>Ready to Get Started?</h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', marginBottom: '2rem' }}>Join thousands of members who transformed their health with A Fitness Gym.</p>
          <Link to="/join" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
            Join Now — First Month Free →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
