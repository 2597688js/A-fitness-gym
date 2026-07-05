import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { API_URL } from '../../config/api';

export default function AdminApprovals() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/admin/membership-requests?status=${filter}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(res.data);
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchRequests();
  }, [filter, token]);

  const computeEstimatedPeriod = (req) => {
    if (!req.paid || !req.paymentDate) return 'Pending payment';
    if (!req.computedEndDate) return req.computedStartDate || 'N/A';
    return `${req.computedStartDate} → ${req.computedEndDate}`;
  };

  const handleQuickApprove = async (req) => {
    if (!confirm(`Quick approve ${req.user.name}'s ${req.plan} membership?`)) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await axios.post(
        `${API_URL}/api/admin/membership-requests/${req.id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.filter(r => r.id !== req.id));
      setMsg({ type: 'success', text: `✓ Approved ${req.user.name}'s membership.` });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to approve.' });
    }
  };

  const handleQuickReject = async (req) => {
    const note = prompt('Enter rejection reason (optional):');
    if (note === null) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await axios.post(
        `${API_URL}/api/admin/membership-requests/${req.id}/reject`,
        { note: note || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.filter(r => r.id !== req.id));
      setMsg({ type: 'error', text: `✗ Rejected ${req.user.name}'s request.` });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to reject.' });
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Membership Approvals</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and approve pending membership requests from members.</p>
        </div>

        {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom: '2rem' }}>{msg.text}</div>}

        {/* Filter */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['PENDING', 'APPROVED', 'REJECTED', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn ${filter === status ? 'btn-primary' : 'btn-outline'} btn-sm`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : requests.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No {filter === 'all' ? 'requests' : filter.toLowerCase() + ' requests'} found.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Estimated Period</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>
                      <Link to={`/admin/members/${req.user.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        {req.user.name}
                      </Link>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.user.email}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{req.plan}</td>
                    <td>
                      <span className={`badge badge-${
                        req.status === 'PENDING' ? 'yellow' : req.status === 'APPROVED' ? 'green' : 'red'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td>{req.paid ? '✓ Paid' : '✗ Unpaid'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{computeEstimatedPeriod(req)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(req.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {req.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleQuickApprove(req)}
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleQuickReject(req)}
                              className="btn btn-danger btn-sm"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Reject
                            </button>
                          </>
                        ) : null}
                        <Link to={`/admin/members/${req.user.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
                          Review
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
