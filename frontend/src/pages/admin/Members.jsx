import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';

import { API_URL } from '../../config/api';

export default function AdminMembers() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetch = () => {
    axios.get(`${API_URL}/api/admin/members`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setMembers(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetch, [token]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete member "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await axios.delete(`${API_URL}/api/admin/members/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMembers(m => m.filter(x => x.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Members</h1>
            <p style={{ color: 'var(--text-muted)' }}>{members.length} total members registered</p>
          </div>
          <input
            className="form-input"
            placeholder="🔍 Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Phone</th>
                  <th>Membership</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No members found</td></tr>
                ) : filtered.map(m => (
                  <tr key={m.id}>
                    <td>
                      <Link to={`/admin/members/${m.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{m.name}</Link>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.email}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{m.phone || '—'}</td>
                    <td>{m.activeMembership ? m.activeMembership.plan : <span style={{ color: 'var(--text-muted)' }}>None</span>}</td>
                    <td>
                      <span className={`badge ${m.activeMembership ? 'badge-green' : 'badge-yellow'}`}>
                        {m.activeMembership ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/admin/members/${m.id}`} className="btn btn-ghost btn-sm">View</Link>
                        <button className="btn btn-danger btn-sm" disabled={deleting === m.id} onClick={() => handleDelete(m.id, m.name)}>
                          {deleting === m.id ? '…' : 'Delete'}
                        </button>
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
