import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PlacemarkForm from '../components/PlacemarkForm';
import UserPlacemarkList from '../components/PlacemarkList';
import EditPlacemark from '../components/EditPlacemarkCard';
import MapCard from '../components/MapCard';
import axios from '../api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [placemarks, setPlacemarks] = useState([]);
  const [editingPlacemark, setEditingPlacemark] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchPlacemarks = useCallback(async () => {
    try {
      const res = await axios.get('/placemarks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlacemarks(res.data);
    } catch (err) {
      console.error('Error loading placemarks:', err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchPlacemarks();
    }
  }, [navigate, token, fetchPlacemarks]);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📍 Dashboard</h2>

      <MapCard placemarks={placemarks} />

      <div className="actions">
        <button className="btn-accent" onClick={() => setShowCreateModal(true)}>
          ➕ Add Placemark
        </button>
      </div>

      <UserPlacemarkList
        placemarks={placemarks}
        onEdit={setEditingPlacemark}
        onDelete={fetchPlacemarks}
      />

      {showCreateModal && (
        <PlacemarkForm
          onPlacemarkCreated={fetchPlacemarks}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingPlacemark && (
        <EditPlacemark
          placemark={editingPlacemark}
          onClose={() => setEditingPlacemark(null)}
          onUpdate={fetchPlacemarks}
        />
      )}
    </div>
  );
}
