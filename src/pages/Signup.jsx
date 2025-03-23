import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // ✅ Your preconfigured axios instance
import '../styles/Signup.css';

function Signup() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/users/signup', {
        ...form,
        role: 'user'
      });

      if (res.status === 201) {
        navigate('/login');
      } else {
        setError(res.data.error || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Server error. Try again later.');
    }
  };

return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="signup-error">{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
