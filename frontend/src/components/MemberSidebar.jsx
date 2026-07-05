import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/member/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/member/profile', label: 'My Profile', icon: '👤' },
  { to: '/member/membership', label: 'Membership', icon: '🎫' },
];

export default function MemberSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          display: 'none',
          '@media (max-width: 767px)': { display: 'block' },
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 50,
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            display: 'none',
            '@media (max-width: 767px)': { display: 'block' },
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: '#141428',
          borderRight: '1px solid var(--border)',
          minHeight: '100vh',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 41,
          '@media (max-width: 767px)': {
            position: 'fixed',
            left: sidebarOpen ? 0 : '-100%',
            top: 0,
            height: '100vh',
            width: 240,
            transition: 'left 0.3s ease-in-out',
            overflowY: 'auto',
          },
        }}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            display: 'none',
            '@media (max-width: 767px)': { display: 'block' },
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--text)',
            marginBottom: '1rem',
            padding: '0.5rem',
          }}
        >
          ✕
        </button>

        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '1.15rem',
            color: 'var(--primary)',
            marginBottom: '2rem',
            textDecoration: 'none',
          }}
        >
          ⚡ <span style={{ fontWeight: 800, background: 'var(--primary)', color: '#000', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>A Fitness Gym<br/>by Amit Hussain</span>
        </Link>

        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
            paddingLeft: '0.75rem',
          }}
        >
          Member Portal
        </div>

        <nav style={{ flex: 1 }}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '0.25rem',
                fontWeight: 500,
                fontSize: '0.9rem',
                color: location.pathname === l.to ? 'var(--primary)' : 'var(--text)',
                background: location.pathname === l.to ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}
            >
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
            Logged in as<br />
            <strong style={{ color: 'var(--text)' }}>{user?.name}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
