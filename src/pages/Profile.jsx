import { useEffect, useState } from 'react';
import axios from '../api';
import { useAuth } from '../utils/Auth';
import '../styles/Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [placemarkCount, setPlacemarkCount] = useState(null);

  useEffect(() => {
    const fetchPlacemarks = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get('/placemarks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const userPlacemarks = res.data.filter(pm => pm.userId === user.id);
        setPlacemarkCount(userPlacemarks.length);
      } catch (err) {
        console.error('❌ Failed to fetch placemarks:', err);
        setPlacemarkCount(0); // Fallback to 0
      }
    };

    fetchPlacemarks();
  }, [user]);

  if (!user) {
    return <div className="profile-container">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2>👤 Your Profile</h2>

      <div className="profile-card card">
        <p><strong>Name:</strong> {user.firstName || 'N/A'} {user.lastName || ''}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Placemarks Created:</strong> {
          placemarkCount === null ? 'Loading...' : placemarkCount
        }</p>
      </div>
    </div>
  );
}
