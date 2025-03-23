import axios from 'axios';

const api = axios.create({
  baseURL: 'https://placemark-backend-y2j0.onrender.com',
});

export default api;
