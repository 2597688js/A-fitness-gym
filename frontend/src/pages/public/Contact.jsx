import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div>
      <Navbar />

      <section style={{ background: '#000000', color: 'white', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>Get in Touch</h1>
          <p style={{ color: '#b0b0b0', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>
            Have questions about FORGE? Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
              <div>
                <div style={{ color: '#D4A574', fontWeight: 700, marginBottom: '0.5rem' }}>📍 Location</div>
                <p style={{ color: '#b0b0b0' }}>123 Fitness Street, Bengaluru, India 560001</p>
              </div>
              <div>
                <div style={{ color: '#D4A574', fontWeight: 700, marginBottom: '0.5rem' }}>📞 Phone</div>
                <p style={{ color: '#b0b0b0' }}>+91 (234) 567-8900</p>
              </div>
              <div>
                <div style={{ color: '#D4A574', fontWeight: 700, marginBottom: '0.5rem' }}>📧 Email</div>
                <p style={{ color: '#b0b0b0' }}>hello@forgefit.in</p>
              </div>
              <div>
                <div style={{ color: '#D4A574', fontWeight: 700, marginBottom: '0.5rem' }}>⏰ Hours</div>
                <p style={{ color: '#b0b0b0' }}>Mon - Fri: 6AM - 11PM<br />Sat - Sun: 7AM - 9PM</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Membership inquiry"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Tell us about your fitness goals..."
                  rows="5"
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
              {submitted && <div className="alert alert-success">✓ Message sent successfully! We'll be in touch soon.</div>}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
