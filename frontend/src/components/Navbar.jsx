import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/membership', label: 'Membership' },
    { to: '/trainers', label: 'Trainers' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav style={{
      background: '#000000',
      borderBottom: '1px solid rgba(212,165,116,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Logo */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1rem', color: '#D4A574', textDecoration: 'none' }}>
          <span style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>🔥</span>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: isMobile ? '0.75rem' : '1rem', color: '#0ea5e9', fontWeight: 800, letterSpacing: '0.05em', background: '#0ea5e9', color: '#000', padding: '0.375rem 0.5rem', borderRadius: '0.375rem', lineHeight: 1.2 }}>A Fitness Gym<br/>by Amit Hussain</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '0.5rem 0.875rem',
                borderRadius: '0.5rem',
                fontWeight: 500,
                fontSize: '0.9rem',
                color: isActive(l.to) ? '#000000' : '#b0b0b0',
                background: isActive(l.to) ? '#D4A574' : 'rgba(212,165,116,0.1)',
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Desktop Auth Actions */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="btn btn-ghost btn-sm">Admin Panel</Link>
                ) : (
                  <Link to="/member/dashboard" className="btn btn-ghost btn-sm">My Portal</Link>
                )}
                <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/member/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/join" className="btn btn-primary btn-sm">Join</Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'white',
              padding: '0.5rem',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          background: '#1a1a1a',
          borderTop: '1px solid rgba(212,165,116,0.3)',
          padding: '1rem',
        }}>
          {/* Mobile Nav Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive(l.to) ? '#000000' : 'white',
                  background: isActive(l.to) ? '#D4A574' : 'rgba(212,165,116,0.1)',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Actions */}
          <div style={{ borderTop: '1px solid rgba(212,165,116,0.2)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center' }}>
                    Admin Panel
                  </Link>
                ) : (
                  <Link to="/member/dashboard" className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center' }}>
                    My Portal
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/member/login" className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center' }}>
                  Member Login
                </Link>
                <Link to="/join" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center' }}>
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
