import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MemberSidebar from '../../components/MemberSidebar';

import { API_URL } from '../../config/api';

export default function MemberDashboard() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, requestRes] = await Promise.all([
          axios.get(`${API_URL}/api/member/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/member/membership-request`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProfile(profileRes.data);
        setRequest(requestRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const activeMembership = profile?.memberships?.find(m => m.status === 'active');
  const daysLeft = activeMembership ? Math.max(0, Math.ceil((new Date(activeMembership.endDate) - new Date()) / 86400000)) : null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <MemberSidebar />
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Here's an overview of your membership and progress.</p>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {/* Pending Request Banner */}
            {request?.status === 'PENDING' && (
              <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
                ⏳ Your {request.plan} membership request is pending admin approval. <Link to="/member/membership" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>View details →</Link>
              </div>
            )}

            {request?.status === 'REJECTED' && (
              <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
                <strong>✗ Rejected:</strong> {request.adminNote || 'Your request was rejected.'}
                {' '}<Link to="/member/membership" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>Resubmit →</Link>
              </div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Membership Status</div>
                {activeMembership ? (
                  <><span className="badge badge-green">✓ Active</span><div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem' }}>{activeMembership.plan}</div></>
                ) : (
                  <><span className="badge badge-red">No Active Plan</span><div style={{ marginTop: '0.5rem' }}><Link to="/member/membership" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>Subscribe now →</Link></div></>
                )}
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Days Remaining</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: daysLeft > 30 ? 'var(--success)' : daysLeft > 7 ? 'var(--warning)' : 'var(--error)' }}>
                  {daysLeft !== null ? daysLeft : '—'}
                </div>
                {activeMembership && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Expires {activeMembership.endDate}</div>}
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Memberships</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{profile?.memberships?.length || 0}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Since {new Date(profile?.createdAt).getFullYear()}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/member/membership" className="btn btn-primary btn-sm">🎫 Buy / Renew Membership</Link>
                <Link to="/member/profile" className="btn btn-outline btn-sm">✏️ Update Profile</Link>
                <Link to="/classes" className="btn btn-ghost btn-sm">📅 Browse Classes</Link>
              </div>
            </div>

            {/* Membership History */}
            {profile?.memberships?.length > 0 && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Membership History</h3>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.memberships.map(m => (
                        <tr key={m.id}>
                          <td><strong>{m.plan}</strong></td>
                          <td><span className={`badge ${m.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>{m.status}</span></td>
                          <td>{m.startDate}</td>
                          <td>{m.endDate}</td>
                          <td>₹{(m.amount / 100).toLocaleString('en-IN')}</td>
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
