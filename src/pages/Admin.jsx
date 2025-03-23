import { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Admin.css';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const loggedInUserId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
  
      // ✅ Moved function inside useEffect
      const fetchData = async () => {
        try {
          const userRes = await axios.get('/users', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(userRes.data);
  
          const statsRes = await axios.get('/admin/stats', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStats(statsRes.data);
        } catch (err) {
          console.error(err);
          setMessage('Failed to fetch admin data');
        }
      };
  
      fetchData();
    } catch (err) {
      console.error('Token decode error:', err);
      navigate('/login');
    }
  }, [token, navigate]);

  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      await axios.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      setMessage('Failed to delete user');
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
  
      {stats && (
        <div className="stats-section">
          <h3>📈 Statistics</h3>
          <p><strong>Total Users:</strong> {stats.totalUsers}</p>
          <p><strong>Total Placemarks:</strong> {stats.totalPlacemarks}</p>
          <h4>Placemarks by User:</h4>
            <ul>
            {Object.entries(stats.placemarksByUser).map(([userId, count]) => {
                const user = users.find((u) => u.id === userId || u._id === userId);
                return (
                    <li key={userId}>
                    <strong>{user?.email || 'Unknown User'}:</strong> ({userId}) — {count} placemark{count > 1 ? 's' : ''}
                </li>      
                );
            })}
            </ul>
        </div>
      )}
  
      <div className="user-list">
        <h3>👥 Users</h3>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id || user._id}>
                <span>{user.email} ({user.role})</span>
                {(user.id || user._id) !== loggedInUserId && (
                  <button onClick={() => handleDeleteUser(user.id || user._id)}>
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center' }}>No users to display.</p>
        )}
      </div>
    </div>
  );
}
