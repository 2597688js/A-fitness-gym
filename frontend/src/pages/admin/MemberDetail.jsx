import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { API_URL } from '../../config/api';

const PLANS = [
  { id: 'Basic', name: 'Basic', durationDays: 30 },
  { id: 'Standard', name: 'Standard', durationDays: 90 },
  { id: 'Premium', name: 'Premium', durationDays: 180 },
];

export default function AdminMemberDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState(false);
  const [editForm, setEditForm] = useState({ plan: '', paid: false, paymentDate: '', amount: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/members/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        setMember(r.data);
        if (r.data.latestRequest) {
          setEditForm({
            plan: r.data.latestRequest.plan,
            paid: r.data.latestRequest.paid,
            paymentDate: r.data.latestRequest.paymentDate || '',
            amount: r.data.latestRequest.amount,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleDeleteMember = async () => {
    if (!confirm(`Delete member "${member?.name}"?`)) return;
    try {
      await axios.delete(`${API_URL}/api/admin/members/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/admin/members');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to delete member.' });
    }
  };

  const handleSaveChanges = async () => {
    if (!member?.latestRequest) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await axios.patch(
        `${API_URL}/api/admin/membership-requests/${member.latestRequest.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMember(m => ({ ...m, latestRequest: res.data }));
      setMsg({ type: 'success', text: 'Changes saved. Request still pending review.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save changes.' });
    }
  };

  const handleApprove = async () => {
    if (!member?.latestRequest) return;
    if (!confirm(`Approve ${member.name}'s ${editForm.plan} membership request?`)) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await axios.post(
        `${API_URL}/api/admin/membership-requests/${member.latestRequest.id}/approve`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMember(m => ({ ...m, latestRequest: res.data.request, memberships: [...(m.memberships || []), res.data.membership] }));
      setMsg({ type: 'success', text: `✓ ${member.name}'s membership approved!` });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to approve.' });
    }
  };

  const handleReject = async () => {
    if (!member?.latestRequest) return;
    const note = prompt('Enter rejection reason (optional):');
    if (note === null) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await axios.post(
        `${API_URL}/api/admin/membership-requests/${member.latestRequest.id}/reject`,
        { note: note || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMember(m => ({ ...m, latestRequest: res.data }));
      setMsg({ type: 'error', text: `✗ Request rejected.` });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to reject.' });
    }
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

        {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom: '2rem' }}>{msg.text}</div>}

        {loading ? <div className="spinner" /> : !member ? (
          <p>Member not found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Profile Info */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 700 }}>Personal Info</h3>
                <button className="btn btn-danger btn-sm" onClick={handleDeleteMember}>Delete Member</button>
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

            {/* Membership Request or History */}
            <div className="card" style={{ padding: '1.5rem' }}>
              {member.latestRequest?.status === 'PENDING' ? (
                <>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Membership Request (Pending)</h3>
                  <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>Plan</label>
                      <select
                        value={editForm.plan}
                        onChange={e => setEditForm(f => ({ ...f, plan: e.target.value }))}
                        className="form-input"
                        style={{ width: '100%' }}
                      >
                        {PLANS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>Status</label>
                        <select
                          value={editForm.paid ? 'Paid' : 'Unpaid'}
                          onChange={e => setEditForm(f => ({ ...f, paid: e.target.value === 'Paid' }))}
                          className="form-input"
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                      {editForm.paid && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>Payment Date</label>
                          <input
                            type="date"
                            value={editForm.paymentDate}
                            onChange={e => setEditForm(f => ({ ...f, paymentDate: e.target.value }))}
                            className="form-input"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>Amount (paise)</label>
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={e => setEditForm(f => ({ ...f, amount: parseInt(e.target.value) || 0 }))}
                        className="form-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline btn-sm" onClick={handleSaveChanges}>💾 Save Changes</button>
                    <button className="btn btn-primary btn-sm" onClick={handleApprove}>✓ Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={handleReject}>✗ Reject</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Membership Request Status</h3>
                  {member.latestRequest ? (
                    <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Status: </span>
                        <span className={`badge ${member.latestRequest.status === 'APPROVED' ? 'badge-green' : 'badge-red'}`}>{member.latestRequest.status}</span>
                      </div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Plan: </span>{member.latestRequest.plan}</div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Paid: </span>{member.latestRequest.paid ? 'Yes' : 'No'}</div>
                      {member.latestRequest.paymentDate && <div><span style={{ color: 'var(--text-muted)' }}>Payment Date: </span>{member.latestRequest.paymentDate}</div>}
                      {member.latestRequest.adminNote && <div><span style={{ color: 'var(--text-muted)' }}>Note: </span>{member.latestRequest.adminNote}</div>}
                      <div><span style={{ color: 'var(--text-muted)' }}>Reviewed: </span>{member.latestRequest.reviewedAt ? new Date(member.latestRequest.reviewedAt).toLocaleDateString('en-IN') : '—'}</div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No membership request.</p>
                  )}
                </>
              )}
            </div>

            {/* Membership History */}
            <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
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
