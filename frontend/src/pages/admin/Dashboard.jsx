import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';

import { API_URL } from '../../config/api';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, [token]);

  const statCards = stats ? [
    { label: 'Total Members', value: stats.totalMembers, icon: '👥', color: 'var(--primary)' },
    { label: 'Active Memberships', value: stats.activeMembers, icon: '✅', color: 'var(--success)' },
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100).toLocaleString('en-IN')}`, icon: '💰', color: '#7c3aed' },
  ] : [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview of your gym's performance.</p>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {statCards.map(s => (
                <div key={s.label} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{s.label}</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                    <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {stats?.recentMembers?.length > 0 && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700 }}>Recent Members</h3>
                  <Link to="/admin/members" className="btn btn-outline btn-sm">View All →</Link>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr>
                    </thead>
                    <tbody>
                      {stats.recentMembers.map(m => (
                        <tr key={m.id}>
                          <td><Link to={`/admin/members/${m.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{m.name}</Link></td>
                          <td style={{ color: 'var(--text-muted)' }}>{m.email}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{m.phone || '—'}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
