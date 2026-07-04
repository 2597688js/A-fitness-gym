import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const trainers = [
  { name: 'Arjun Kapoor', specialty: 'Strength & Conditioning', bio: 'NASM Certified with 8+ years of experience in transforming bodies.' },
  { name: 'Priya Singh', specialty: 'HIIT & Cardio', bio: 'Specializes in high-intensity interval training and endurance coaching.' },
  { name: 'Vikram Patel', specialty: 'Powerlifting', bio: 'Competitive powerlifter and certified strength coach since 2015.' },
  { name: 'Neha Sharma', specialty: 'Yoga & Flexibility', bio: 'E-RYT 500 yoga instructor dedicated to mindful movement.' },
  { name: 'Rajesh Gupta', specialty: 'Nutrition & Fitness', bio: 'Certified nutritionist and personal trainer with holistic approach.' },
  { name: 'Ananya Verma', specialty: 'Women\'s Fitness', bio: 'Specializes in postnatal fitness and women-centric training programs.' },
];

export default function Trainers() {
  return (
    <div>
      <Navbar />

      <section style={{ background: '#000000', color: 'white', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>Elite Trainers at FORGE</h1>
          <p style={{ color: '#b0b0b0', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Our team of certified professionals is dedicated to helping you achieve your fitness goals with personalized guidance and expert coaching.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <div className="grid-3">
            {trainers.map(trainer => (
              <div key={trainer.name} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💪</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{trainer.name}</h3>
                <div style={{ color: '#D4A574', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>{trainer.specialty}</div>
                <p style={{ color: '#b0b0b0', fontSize: '0.9rem', lineHeight: 1.6 }}>{trainer.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
