import { useState, useEffect } from 'react';
import axios from '../api';
import '../styles/PlacemarkForm.css';
import '../styles/Modal.css';

const categories = [
  { label: 'Castle', icon: '🏰' },
  { label: 'Ringfort', icon: '🏯' },
  { label: 'Ancient Monument', icon: '🗿' },
  { label: 'Church', icon: '🕍' },
  { label: 'Fort', icon: '🛡️' },
  { label: 'Battlefield', icon: '⚔️' },
  { label: 'Heritage Building', icon: '🏛️' },
  { label: 'Dolmen', icon: '🪨' },
  { label: 'Tower', icon: '🗼' },
  { label: 'Bridge', icon: '🌉' },
  { label: 'Monastery', icon: '⛪️' },
];

export default function EditPlacemark({ placemark, onClose, onUpdate }) {
  const [form, setForm] = useState({ ...placemark });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/placemarks/${placemark.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Placemark updated successfully');
      onUpdate && onUpdate(res.data);
      onClose();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error updating placemark');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card placemark-form card">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Edit Placemark</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

          <select name="category" value={form.category} onChange={handleChange} className="select" required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.label} value={cat.label}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>

          <input name="lat" type="number" placeholder="Latitude" value={form.lat} onChange={handleChange} required />
          <input name="lng" type="number" placeholder="Longitude" value={form.lng} onChange={handleChange} required />
          <input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} />

          {/* 👁️ Visibility Selector */}
          <select name="visibility" value={form.visibility || 'private'} onChange={handleChange} className="select" required>
            <option value="public">🌍 Public</option>
            <option value="private">🔒 Private</option>
          </select>

          <button type="submit">💾 Save Changes</button>
        </form>

        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </div>
    </div>
  );
}
