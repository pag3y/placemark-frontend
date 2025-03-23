import { useState } from 'react';
import axios from '../api';
import '../styles/PlacemarkForm.css';
import '../styles/Modal.css'; // Make sure this exists

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

export default function PlacemarkForm({ onPlacemarkCreated, onClose }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    lat: '',
    lng: '',
    imageUrl: '',
    visibility: 'private'
  });

  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/placemarks', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Placemark created successfully');
      setForm({ name: '', description: '', category: '', lat: '', lng: '', imageUrl: '' });
      onPlacemarkCreated && onPlacemarkCreated(res.data);
      onClose(); // Close modal
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error creating placemark');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card placemark-form card">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Create New Placemark</h3>
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
          <select
            name="visibility"
            value={form.visibility || 'private'}
            onChange={handleChange}
            required
          >
            <option value="public">🌍 Public</option>
            <option value="private">🔒 Private</option>
          </select>
          <button type="submit">➕ Create</button>
        </form>
        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </div>
    </div>
  );
}
