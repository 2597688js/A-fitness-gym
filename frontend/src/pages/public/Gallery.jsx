import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getApiEndpoint } from '../../config/api';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const url = getApiEndpoint('/api/gallery');
      console.log('Fetching gallery from:', url);
      const { data } = await axios.get(url);
      setGallery(data);
      setLoading(false);
    } catch (err) {
      console.error('Gallery fetch error:', err.message);
      setError(`Failed to load gallery: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 800 }}>
            Our Gallery
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: 600, margin: '0 auto 3rem' }}>
            Explore our state-of-the-art facilities and members in action
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading gallery...</div>
          ) : gallery.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No media available yet. Check back soon!
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(250px, 100%, 300px), 1fr))',
                gap: '1.5rem',
              }}
            >
              {gallery.map(item => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedItem(item)}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 250,
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <video
                        src={item.url}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        controls
                      />
                    )}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700 }}>
                      {item.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {item.type === 'image' ? '🖼️ Image' : '🎬 Video'}
                    </p>
                    {item.description && (
                      <p
                        style={{
                          margin: '0.75rem 0 0 0',
                          fontSize: '0.9rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '2.5rem',
                height: '2.5rem',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(239, 68, 68, 1)'}
              onMouseLeave={e => e.target.style.background = 'rgba(239, 68, 68, 0.9)'}
            >
              ✕
            </button>

            {/* Media Display */}
            <div
              style={{
                width: '100%',
                maxHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    borderRadius: '0.5rem',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    borderRadius: '0.5rem',
                  }}
                />
              )}
            </div>

            {/* Info */}
            <div style={{ textAlign: 'center', color: 'white', maxWidth: '600px' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>
                {selectedItem.title}
              </h2>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>
                {selectedItem.type === 'image' ? '🖼️ Image' : '🎬 Video'}
              </p>
              {selectedItem.description && (
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
