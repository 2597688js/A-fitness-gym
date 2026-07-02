import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/members', label: 'Members', icon: '👥' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
];

export default function AdminSidebar() {
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
          background: '#0ea5e9',
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
          background: '#0f172a',
          color: '#cbd5e1',
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
            color: 'white',
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
            color: 'white',
            marginBottom: '2rem',
            textDecoration: 'none',
          }}
        >
          ⚡ A Fitness Gym
        </Link>

        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
            paddingLeft: '0.75rem',
          }}
        >
          Admin Panel
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
                color: location.pathname === l.to ? 'white' : '#94a3b8',
                background: location.pathname === l.to ? 'rgba(14,165,233,0.2)' : 'transparent',
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}
            >
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}

          {/* Website Navigation Section */}
          <div style={{ borderTop: '1px solid #1e293b', marginTop: '1.5rem', paddingTop: '1rem' }}>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.5rem',
                paddingLeft: '0.75rem',
              }}
            >
              Website
            </div>
            <Link
              to="/"
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
                color: location.pathname === '/' ? 'white' : '#94a3b8',
                background: location.pathname === '/' ? 'rgba(14,165,233,0.2)' : 'transparent',
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}
            >
              <span>🏠</span> Home
            </Link>
            <Link
              to="/gallery"
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
                color: location.pathname === '/gallery' ? 'white' : '#94a3b8',
                background: location.pathname === '/gallery' ? 'rgba(14,165,233,0.2)' : 'transparent',
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}
            >
              <span>🎨</span> Gallery
            </Link>
          </div>
        </nav>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
            Logged in as<br />
            <strong style={{ color: 'white' }}>{user?.name}</strong>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #334155',
              color: '#94a3b8',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              width: '100%',
              fontFamily: 'inherit',
              fontSize: '0.8rem',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
