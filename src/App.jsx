// src/App.jsx
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content" style={{ padding: '2rem' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
