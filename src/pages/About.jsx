import '../styles/About.css';

export default function About() {
  return (
    <div className="about-container">
      <h2>🏛️ About Historical Placemarks</h2>

      <section className="about-section">
        <p>
          <strong>Historical Placemarks</strong> is a web application designed to help history enthusiasts,
          students, and researchers document and explore Ireland's rich historical heritage.
        </p>

        <p>
          Users can create placemarks for historical sites such as castles, monasteries, forts, and ancient
          monuments. Each placemark includes geolocation, category, description, and optional imagery to help
          bring these places to life.
        </p>

        <p>
          Beyond personal exploration, the app also includes social features — like, comment, and view placemarks
          created by other users. An admin panel provides moderation tools and overall system insights.
        </p>
      </section>

      <section className="about-section">
        <h3>🔧 Technologies Used</h3>
        <ul>
          <li>React + Vite</li>
          <li>Firebase Firestore</li>
          <li>Render (backend hosting)</li>
          <li>Netlify (frontend hosting)</li>
          <li>Leaflet for interactive maps</li>
        </ul>
      </section>

      <section className="about-section">
        <h3>🎯 Goals</h3>
        <ul>
          <li>Promote awareness of Irish historical landmarks</li>
          <li>Provide a simple platform for recording and sharing local knowledge</li>
          <li>Build practical experience with full-stack development</li>
        </ul>
      </section>

      <section className="about-footer">
        <p>Created by Tom Page | HDip Computing Assignment 1 (2025)</p>
      </section>
    </div>
  );
}
