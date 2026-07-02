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
    { to: '/classes', label: 'Classes' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/gallery', label: 'Gallery' },
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      borderBottom: '1px solid rgba(14,165,233,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Logo */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1rem', color: '#38bdf8', textDecoration: 'none' }}>
          <span style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>⚡</span>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: isMobile ? '1rem' : '1.4rem', color: 'white', fontWeight: 800 }}>A Fitness Gym</div>
            <div style={{ fontSize: isMobile ? '0.65rem' : '0.8rem', fontWeight: 500, color: '#7dd3fc' }}>by Amit Hussain</div>
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
                color: isActive(l.to) ? '#0f172a' : '#e0f2fe',
                background: isActive(l.to) ? '#38bdf8' : 'rgba(14,165,233,0.1)',
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
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
          borderTop: '1px solid rgba(14,165,233,0.3)',
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
                  color: isActive(l.to) ? '#0f172a' : 'white',
                  background: isActive(l.to) ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Actions */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
