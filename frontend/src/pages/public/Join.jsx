import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import { API_URL } from '../../config/api';

export default function Join() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '', gender: '', address: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        name: form.name, email: form.email, phone: form.phone,
        dob: form.dob, gender: form.gender, address: form.address, password: form.password,
      });
      login(data.token, data.user);
      navigate('/member/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '4rem 0', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Join A Fitness Gym</h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>Create your member account and start your fitness journey today.</p>
      </section>

      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="card" style={{ padding: '2.5rem' }}>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-input" name="dob" type="date" value={form.dob} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-input" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-input" name="address" value={form.address} onChange={handleChange} placeholder="Your address" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className="form-input" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min. 6 characters" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input className="form-input" name="confirm" type="password" value={form.confirm} onChange={handleChange} required placeholder="Repeat password" />
                </div>
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                {loading ? 'Creating account…' : 'Create Account & Join 🚀'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already a member? <Link to="/member/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in here</Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
