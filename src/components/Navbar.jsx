import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/Auth';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Home</Link>
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/about">About</Link>
          </>
        )}
        {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
        {user && <Link to="/feed">Placemark Feed</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {user && <Link to="/about">About</Link>}

        <div className="spacer" /> {}

        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
