import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const team = [
  { name: 'Arjun Kapoor', role: 'Head Trainer & Founder', exp: '15 years', spec: 'Strength & Conditioning' },
  { name: 'Neha Singh', role: 'Yoga & Wellness Director', exp: '12 years', spec: 'Yoga, Meditation, Pilates' },
  { name: 'Vikram Patel', role: 'Nutrition Coach', exp: '10 years', spec: 'Sports Nutrition, Diet Planning' },
  { name: 'Deepika Rao', role: 'Cardio & HIIT Specialist', exp: '8 years', spec: 'HIIT, Zumba, Kickboxing' },
];

export default function About() {
  return (
    <div>
      <Navbar />

      <section style={{ background: '#000000', color: 'white', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>About <span style={{ background: '#0ea5e9', color: '#000', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}>A Fitness Gym by Amit Hussain</span></h1>
          <p style={{ color: '#b0b0b0', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
            Premium fitness in Bengaluru. Where serious training meets an environment that respects your effort.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>Our Story</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                A Fitness Gym by Amit Hussain was founded with a vision to create premium fitness space in Bengaluru. What started as a passion has grown into a state-of-the-art fitness facility serving hundreds of members.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Our founder Arjun Kapoor built A Fitness Gym by Amit Hussain with one philosophy: serious training deserves an environment that respects your effort. Premium equipment, expert coaches, zero noise.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Today, our team of 12+ elite trainers helps hundreds of members achieve goals they never thought possible — weight loss, strength building, recovery, and everything in between.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[['6', 'Years Strong'], ['500+', 'Members'], ['12+', 'Elite Trainers'], ['100%', 'Dedicated']].map(([num, label]) => (
                <div key={label} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{num}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#5a3a4a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white' }}>Meet Our Expert Team</h2>
            <p style={{ color: '#d0d0d0' }}>World-class trainers dedicated to your success.</p>
          </div>
          <div className="grid-2">
            {team.map(t => (
              <div key={t.name} style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', border: '1px solid rgba(212,165,116,0.3)', borderRadius: '1rem', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                  👤
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'white' }}>{t.name}</div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{t.role}</div>
                  <div style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>🔥 {t.spec} · {t.exp} experience</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
