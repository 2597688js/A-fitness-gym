import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const classes = [
  { icon: '🔥', name: 'HIIT Blast', trainer: 'Deepika Rao', duration: '45 min', level: 'Intermediate', schedule: 'Mon, Wed, Fri — 6am & 6pm', desc: 'High-intensity interval training to torch calories and boost metabolism.' },
  { icon: '🧘', name: 'Yoga Flow', trainer: 'Neha Singh', duration: '60 min', level: 'All Levels', schedule: 'Daily — 7am & 7pm', desc: 'Connect mind and body through flowing yoga sequences and breathwork.' },
  { icon: '💪', name: 'Strength Training', trainer: 'Arjun Kapoor', duration: '60 min', level: 'Beginner–Advanced', schedule: 'Mon–Sat — 8am & 5pm', desc: 'Build functional strength with progressive overload techniques.' },
  { icon: '🥊', name: 'Kickboxing', trainer: 'Deepika Rao', duration: '50 min', level: 'All Levels', schedule: 'Tue, Thu, Sat — 7am & 7pm', desc: 'Cardio kickboxing that builds coordination, power, and endurance.' },
  { icon: '🩱', name: 'Pilates Core', trainer: 'Neha Singh', duration: '45 min', level: 'Beginner', schedule: 'Tue, Thu — 9am', desc: 'Low-impact core strengthening and posture correction exercises.' },
  { icon: '💃', name: 'Zumba', trainer: 'Deepika Rao', duration: '55 min', level: 'All Levels', schedule: 'Wed, Fri, Sat — 6:30pm', desc: 'Dance-fitness party that doesn\'t feel like exercise — burns 500+ calories.' },
  { icon: '🏊', name: 'Aqua Aerobics', trainer: 'Vikram Patel', duration: '45 min', level: 'All Levels', schedule: 'Mon, Wed, Fri — 8am', desc: 'Low-impact water workout perfect for joints, recovery, and cardio.' },
  { icon: '🧗', name: 'Functional Fitness', trainer: 'Arjun Kapoor', duration: '60 min', level: 'Intermediate', schedule: 'Mon, Wed, Fri — 5pm', desc: 'Real-world movement patterns for strength, agility, and mobility.' },
];

const levelColor = { 'All Levels': 'badge-green', 'Beginner': 'badge-blue', 'Intermediate': 'badge-yellow', 'Beginner–Advanced': 'badge-green' };

export default function Classes() {
  return (
    <div>
      <Navbar />

      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', color: 'white', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>Fitness Classes</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>
            50+ weekly classes across all disciplines — something for every goal and fitness level.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            {classes.map(c => (
              <div key={c.name} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '2.25rem', flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{c.name}</h3>
                      <span className={`badge ${levelColor[c.level] || 'badge-blue'}`}>{c.level}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>{c.desc}</p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span>👨‍🏫 {c.trainer} · ⏱ {c.duration}</span>
                      <span>📅 {c.schedule}</span>
                    </div>
                  </div>
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
