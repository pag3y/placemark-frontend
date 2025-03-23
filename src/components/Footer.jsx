import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Historical Placemark Explorer</p>
    </footer>
  );
}
