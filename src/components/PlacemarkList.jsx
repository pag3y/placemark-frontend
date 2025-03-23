import { useEffect, useState, useCallback } from 'react';
import axios from '../api';
import EditPlacemarkCard from './EditPlacemarkCard';
import '../styles/PlacemarkList.css';

const getCategoryIcon = (category = '') => {
  const key = category.trim().toLowerCase();
  switch (key) {
    case 'monastery': return '⛪️';
    case 'castle': return '🏰';
    case 'fort': return '🛡️';
    case 'dolmen': return '🪨';
    case 'ringfort': return '🏯';
    case 'church': return '🕍';
    case 'battlefield': return '⚔️';
    case 'tower': return '🗼';
    case 'bridge': return '🌉';
    case 'ancient monument': return '🗿';
    case 'heritage building': return '🏛️';
    default: return '📍';
  }
};

export default function UserPlacemarkList() {
  const [placemarks, setPlacemarks] = useState([]);
  const [editingPlacemark, setEditingPlacemark] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchPlacemarks = useCallback(async () => {
    try {
      const res = await axios.get('/placemarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlacemarks(res.data);
    } catch (err) {
      console.error('Failed to fetch placemarks:', err);
      setError('Unable to load placemarks');
    }
  }, [token]);

  useEffect(() => {
    fetchPlacemarks();
  }, [fetchPlacemarks]);

  const deletePlacemark = async (id) => {
    const confirm = window.confirm('Delete this placemark?');
    if (!confirm) return;
    try {
      await axios.delete(`/placemarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlacemarks((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting placemark:', err);
      alert('Delete failed');
    }
  };

  const uniqueCategories = ['All', ...new Set(placemarks.map(p => p.category))];

  const filtered = filter === 'All'
    ? placemarks
    : placemarks.filter(p => p.category === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'az') return a.name.localeCompare(b.name);
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div className="placemark-list">
      <h3 className="text-center">Your Placemarks</h3>
      {error && <p className="text-center" style={{ color: 'crimson' }}>{error}</p>}

      <div className="filter-controls text-center">
        <label>
          Filter:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: '1rem' }}>
          Sort:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="az">A–Z</option>
          </select>
        </label>
      </div>

      {sorted.length > 0 ? (
        sorted.map((pm) => (
          <div className="placemark-card" key={pm.id}>
            <h4>{pm.name} <span>{getCategoryIcon(pm.category)}</span></h4>
            <p><strong>Category:</strong> {pm.category}</p>
            <p><strong>Description:</strong> {pm.description}</p>
            <p><strong>Coordinates:</strong> {pm.lat}, {pm.lng}</p>
            <p><strong>Visibility:</strong> {pm.visibility === 'public' ? '🌍 Public' : '🔒 Private'}</p>
            {pm.imageUrl && (
              <img
                src={pm.imageUrl}
                alt={pm.name}
                style={{ maxWidth: '100%', borderRadius: '6px', marginTop: '0.5rem' }}
              />
            )}
            <div className="button-group">
              <button onClick={() => setEditingPlacemark(pm)} className="btn edit">✏️ Edit</button>
              <button onClick={() => deletePlacemark(pm.id)} className="btn delete">🗑️ Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No placemarks to display.</p>
      )}

      {editingPlacemark && (
        <EditPlacemarkCard
          placemark={editingPlacemark}
          onClose={() => setEditingPlacemark(null)}
          onUpdate={(updated) => {
            setPlacemarks((prev) =>
              prev.map(p => p.id === updated.id ? updated : p)
            );
            setEditingPlacemark(null);
          }}
        />
      )}
    </div>
  );
}
