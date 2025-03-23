import Nav from './Navbar';
import '../styles/Header.css';

export default function Header() {
  return (
    <header>
      <h1 className="app-title">📍 Historical Placemarks</h1>
      <Nav />
    </header>
  );
}
