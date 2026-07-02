import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MemberSidebar from '../../components/MemberSidebar';

import { API_URL } from '../../config/api';

export default function MemberProfile() {
  const { token } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '', dob: '', gender: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    axios.get(`${API_URL}/api/member/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        const d = r.data;
        setForm({ name: d.name || '', phone: d.phone || '', address: d.address || '', dob: d.dob || '', gender: d.gender || '', newPassword: '' });
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address, dob: form.dob, gender: form.gender };
      if (form.newPassword) payload.password = form.newPassword;
      await axios.put(`${API_URL}/api/member/profile`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setForm(f => ({ ...f, newPassword: '' }));
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <MemberSidebar />
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>My Profile</h1>
          <p style={{ color: 'var(--text-muted)' }}>Update your personal information and account settings.</p>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="card" style={{ padding: '2rem', maxWidth: 640 }}>
            {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
            <form onSubmit={handleSave}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="9876543210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-input" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Your full address" />
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Change Password (optional)</h4>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="Leave blank to keep current" />
                </div>
              </div>

              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : '✓ Save Changes'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
