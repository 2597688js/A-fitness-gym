import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

import { API_URL } from '../../config/api';

export default function Gallery() {
  const { token } = useAuth();
  const [gallery, setGallery] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', type: 'image', file: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/gallery`);
      setGallery(data);
    } catch (err) {
      setError('Failed to fetch gallery');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 100 * 1024 * 1024; // 100MB limit (Cloudinary free tier)
    if (file.size > maxSize) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum 100MB allowed.`);
      e.target.value = '';
      return;
    }

    setError('');
    setForm(f => ({ ...f, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.file) {
      setError('Title and file are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('file', form.file);

      const { data } = await axios.post(
        `${API_URL}/api/gallery`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setGallery([...gallery, data]);
      setForm({ title: '', description: '', type: 'image', file: null });
      setSuccess('Media uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      await axios.delete(`${API_URL}/api/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGallery(gallery.filter(g => g.id !== id));
      setSuccess('Item deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ margin: 0 }}>Gallery Management</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin" className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
            ← Dashboard
          </Link>
          <Link to="/gallery" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
            View Public Gallery →
          </Link>
          <Link to="/" className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
            🏠 Home
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Upload Form */}
      <div className="card" style={{ marginBottom: '2rem', maxWidth: 600 }}>
        <h2 style={{ marginTop: 0 }}>Upload Media</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Summer Training Session"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Media Type</label>
            <select
              className="form-input"
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Upload File</label>
            <input
              className="form-input"
              type="file"
              accept={form.type === 'image' ? 'image/*' : 'video/*'}
              onChange={handleFileSelect}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Uploading…' : 'Upload Media'}
          </button>
        </form>
      </div>

      {/* Gallery Display */}
      <h2>Uploaded Media ({gallery.length})</h2>
      {gallery.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No media uploaded yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {gallery.map(item => (
            <div
              key={item._id || item.id}
              className="card"
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelectedItem(item)}
            >
              <div
                style={{
                  width: '100%',
                  height: 180,
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
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
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                  {item.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {item.type === 'image' ? '🖼️ Image' : '🎬 Video'}
                </p>
                {item.description && (
                  <p
                    style={{
                      margin: '0.5rem 0 0 0',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {item.description}
                  </p>
                )}
                <button
                  onClick={() => handleDelete(item._id || item.id)}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}
