import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

import { API_URL } from '../../config/api';

export default function AdminLogin() {
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
      if (data.user.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        return;
      }
      await login(data.token, data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0f172a', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '2.5rem', width: '100%', maxWidth: 420 }}>
        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
          ⚡ A Fitness Gym<br />
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>Admin Panel</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#7dd3fc' }}>
          🔑 Demo: <strong>admin@afitnessgyam.com</strong> / <strong>admin123</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.375rem' }}>Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="admin@afitnessgyam.com"
              style={{ background: '#0f172a', border: '1.5px solid #334155', color: 'white' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.375rem' }}>Password</label>
            <input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Admin password"
              style={{ background: '#0f172a', border: '1.5px solid #334155', color: 'white' }} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Signing in…' : '🔐 Admin Login'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid #334155', marginTop: '1.75rem', paddingTop: '1.5rem' }}>
          <p style={{ textAlign: 'center', marginTop: '0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Browse Our Site
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <Link to="/" style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: '#0ea5e9', textDecoration: 'none' }}>Home</Link>
            <Link to="/about" style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: '#0ea5e9', textDecoration: 'none' }}>About</Link>
            <Link to="/classes" style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: '#0ea5e9', textDecoration: 'none' }}>Classes</Link>
            <Link to="/pricing" style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: '#0ea5e9', textDecoration: 'none' }}>Pricing</Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#64748b' }}>
          <Link to="/member/login" style={{ color: '#64748b' }}>← Member login</Link>
        </p>
      </div>
    </div>
  );
}
