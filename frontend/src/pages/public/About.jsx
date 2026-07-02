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

      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', color: 'white', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>About A Fitness Gym</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
            Founded in 2014, A Fitness Gym has been Mumbai's premier fitness destination for over a decade.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '1rem' }}>Our Story</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                What started as a small studio with 5 machines and a dream has grown into a 15,000 sq ft state-of-the-art fitness center serving over 2,000 members.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Our founder Arjun Kapoor built Apex with one philosophy: everyone deserves access to elite fitness guidance, regardless of their starting point.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Today, our team of 50+ certified trainers helps thousands of members achieve goals they never thought possible — weight loss, marathon PRs, building muscle, recovering from injury, and everything in between.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[['2014', 'Founded'], ['2,000+', 'Members'], ['50+', 'Trainers'], ['10', 'Awards Won']].map(([num, label]) => (
                <div key={label} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{num}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.75rem' }}>Meet Our Expert Team</h2>
            <p style={{ color: 'var(--text-muted)' }}>World-class trainers dedicated to your success.</p>
          </div>
          <div className="grid-2">
            {team.map(t => (
              <div key={t.name} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                  👤
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{t.name}</div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{t.role}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📌 {t.spec} · {t.exp} experience</div>
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
