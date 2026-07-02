import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

export default function MemberLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, form);
      if (data.user.role === 'admin') {
        setError('Use the admin login page instead.');
        return;
      }
      login(data.token, data.user);
      navigate('/member/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: 420 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '2rem', justifyContent: 'center' }}>
            ⚡ A Fitness Gym
          </Link>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.375rem', textAlign: 'center' }}>Member Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.75rem' }}>Access your member portal</p>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="alert" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1', marginBottom: '1rem', fontSize: '0.8rem' }}>
            🔑 Demo: <strong>john@example.com</strong> / <strong>john123</strong>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Your password" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.75rem', paddingTop: '1.5rem' }}>
            <p style={{ textAlign: 'center', marginTop: '0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Browse Our Site
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <Link to="/" style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
              <Link to="/about" style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>About</Link>
              <Link to="/classes" style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Classes</Link>
              <Link to="/pricing" style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Pricing</Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Not a member yet? <Link to="/join" style={{ color: 'var(--primary)', fontWeight: 600 }}>Join now</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Link to="/admin/login" style={{ color: 'var(--text-muted)' }}>Admin login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
