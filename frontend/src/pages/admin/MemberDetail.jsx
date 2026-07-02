import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';

import { API_URL } from '../../config/api';

export default function AdminMemberDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/members/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setMember(r.data))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleDelete = async () => {
    if (!confirm(`Delete member "${member?.name}"?`)) return;
    await axios.delete(`${API_URL}/api/admin/members/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    navigate('/admin/members');
  };

  const activeMembership = member?.memberships?.find(m => m.status === 'active');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/admin/members" className="btn btn-ghost btn-sm">← Back</Link>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Member Details</h1>
          </div>
        </div>

        {loading ? <div className="spinner" /> : !member ? (
          <p>Member not found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Profile Info */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 700 }}>Personal Info</h3>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete Member</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>👤</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{member.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{member.email}</div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span className={`badge ${activeMembership ? 'badge-green' : 'badge-yellow'}`}>
                      {activeMembership ? '✓ Active Member' : 'No Active Plan'}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  ['📞 Phone', member.phone || '—'],
                  ['⚧ Gender', member.gender || '—'],
                  ['🎂 Date of Birth', member.dob || '—'],
                  ['📅 Joined', new Date(member.createdAt).toLocaleDateString('en-IN')],
                  ['📍 Address', member.address || '—', 2],
                ].map(([label, val, span]) => (
                  <div key={label} style={{ gridColumn: span ? `span ${span}` : undefined }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership History */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Membership History</h3>
              {member.memberships?.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No memberships yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {member.memberships.map(m => (
                    <div key={m.id} style={{ padding: '0.875rem', border: '1px solid var(--border)', borderRadius: '0.5rem', background: m.status === 'active' ? 'var(--primary-light)' : 'var(--bg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                        <span style={{ fontWeight: 700 }}>{m.plan}</span>
                        <span className={`badge ${m.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>{m.status}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {m.startDate} → {m.endDate} · ₹{(m.amount / 100).toLocaleString('en-IN')}
                      </div>
                      {m.paymentId && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Payment ID: {m.paymentId}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
