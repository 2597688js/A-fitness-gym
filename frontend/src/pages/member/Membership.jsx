import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MemberSidebar from '../../components/MemberSidebar';
import { API_URL } from '../../config/api';

const PLANS = [
  { id: 'Basic', name: 'Basic', price: '₹1,000', duration: '1 Month', durationDays: 30, amount: 100000, features: ['Gym floor access', 'Locker room', '2 group classes/month'] },
  { id: 'Standard', name: 'Standard', price: '₹2,800', duration: '3 Months', durationDays: 90, amount: 280000, features: ['All Basic features', 'Unlimited group classes', '2 PT sessions/month', 'Nutrition consultation'], popular: true },
  { id: 'Premium', name: 'Premium', price: '₹5,000', duration: '6 Months', durationDays: 180, amount: 500000, features: ['All Standard features', 'Unlimited PT sessions', 'Custom diet plan', 'Priority class booking', '4 guest passes/month'] },
];

export default function MemberMembership() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [form, setForm] = useState({ plan: 'Standard', paid: false, paymentDate: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, requestRes] = await Promise.all([
          axios.get(`${API_URL}/api/member/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/member/membership-request`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProfile(profileRes.data);
        setRequest(requestRes.data);
        if (requestRes.data) {
          setForm({
            plan: requestRes.data.plan || 'Standard',
            paid: requestRes.data.paid || false,
            paymentDate: requestRes.data.paymentDate || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const computedDates = (() => {
    if (!form.paid || !form.paymentDate) return null;
    const planData = PLANS.find(p => p.id === form.plan);
    if (!planData) return null;
    const start = new Date(`${form.paymentDate}T00:00:00Z`);
    const end = new Date(start.getTime() + planData.durationDays * 86400000);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  })();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setSubmitting(true);

    try {
      const payload = {
        plan: form.plan,
        paid: form.paid,
        paymentDate: form.paid ? form.paymentDate : null,
      };

      if (form.paid && !form.paymentDate) {
        setMsg({ type: 'error', text: 'Payment date is required when marking as Paid' });
        setSubmitting(false);
        return;
      }

      const res = await axios.post(`${API_URL}/api/member/membership-request`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequest(res.data);
      setMsg({ type: 'success', text: `✓ Membership request submitted for approval. Status: ${res.data.status}` });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to submit request.' });
    } finally {
      setSubmitting(false);
    }
  };

  const activeMembership = profile?.memberships?.find(m => m.status === 'active');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <MemberSidebar />
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Membership & Payment</h1>
          <p style={{ color: 'var(--text-muted)' }}>Submit your membership details for admin approval.</p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            {/* Current Active Membership */}
            {activeMembership && (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'var(--primary-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontWeight: 700 }}>✓ Active Membership</h3>
                  <span className="badge badge-green">Active</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Plan</div>
                    <div style={{ fontWeight: 600 }}>{activeMembership.plan}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Amount</div>
                    <div style={{ fontWeight: 600 }}>₹{(activeMembership.amount / 100).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Start Date</div>
                    <div style={{ fontWeight: 600 }}>{activeMembership.startDate}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Expiry Date</div>
                    <div style={{ fontWeight: 600 }}>{activeMembership.endDate}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Request Status */}
            {request?.status === 'PENDING' && (
              <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
                <strong>⏳ Pending Approval</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Your {request.plan} membership request is awaiting admin review.</p>
              </div>
            )}

            {request?.status === 'REJECTED' && (
              <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
                <strong>✗ Rejected</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{request.adminNote || 'Your request was rejected. Please resubmit.'}</p>
              </div>
            )}

            {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom: '2rem' }}>{msg.text}</div>}

            {/* Plan Selection Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {request?.status === 'PENDING' ? 'Update Pending Request' : request?.status === 'REJECTED' ? 'Submit New Request' : 'Submit Membership Request'}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Plan Selection */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>Select Plan</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {PLANS.map(p => (
                      <div
                        key={p.id}
                        onClick={() => setForm(f => ({ ...f, plan: p.id }))}
                        className="card"
                        style={{
                          padding: '1.25rem',
                          cursor: 'pointer',
                          position: 'relative',
                          border: form.plan === p.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: form.plan === p.id ? 'var(--primary-light)' : '#1f1f38',
                          color: form.plan === p.id ? '#000' : '#fff',
                          transition: 'all 0.15s',
                        }}
                      >
                        {p.popular && (
                          <div style={{
                            position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                            background: 'var(--primary)', color: 'white', padding: '0.15rem 0.6rem',
                            borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap',
                          }}>POPULAR</div>
                        )}
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{p.name}</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: form.plan === p.id ? '#c25e17' : 'var(--primary)', marginBottom: '0.15rem' }}>{p.price}</div>
                        <div style={{ fontSize: '0.75rem', color: form.plan === p.id ? '#666' : '#d0d0d0', marginBottom: '0.75rem' }}>{p.duration}</div>
                        {form.plan === p.id && <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem' }}>✓ Selected</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Status */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>Payment Status</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, paid: false, paymentDate: '' }))}
                      className={`btn ${!form.paid ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    >
                      Unpaid
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, paid: true }))}
                      className={`btn ${form.paid ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    >
                      Paid
                    </button>
                  </div>
                </div>

                {/* Payment Date (shown only if Paid) */}
                {form.paid && (
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Payment Date <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={form.paymentDate}
                      onChange={handleChange}
                      required={form.paid}
                      className="form-input"
                      style={{ width: '100%', maxWidth: 300 }}
                    />
                  </div>
                )}

                {/* Estimated Period Preview */}
                {computedDates && (
                  <div style={{
                    padding: '1rem', background: 'var(--primary-light)', borderRadius: '0.5rem',
                    marginBottom: '2rem', fontSize: '0.9rem',
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Estimated Period</div>
                    <div>{computedDates.start} → {computedDates.end}</div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={submitting}
                  style={{ width: '100%', maxWidth: 300 }}
                >
                  {submitting ? 'Submitting…' : request?.status === 'PENDING' ? 'Update Request' : 'Submit for Approval'}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
