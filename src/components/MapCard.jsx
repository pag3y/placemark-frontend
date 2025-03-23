import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from '../api';
import 'leaflet/dist/leaflet.css';
import '../styles/MapCard.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url),
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url),
});

// 🏷️ Category icon helper
const categoryIcons = {
  castle: '🏰',
  ringfort: '🏯',
  'ancient monument': '🗿',
  church: '🕍',
  fort: '🛡️',
  battlefield: '⚔️',
  'heritage building': '🏛️',
  dolmen: '🪨',
  tower: '🗼',
  bridge: '🌉',
  monastery: '⛪️',
  default: '📍'
};

const createEmojiIcon = (emoji) =>
  L.divIcon({
    className: 'emoji-marker',
    html: `<div style="font-size: 1.5rem;">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

export default function MapCard() {
  const [placemarks, setPlacemarks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/placemarks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlacemarks(res.data);
      } catch (err) {
        console.error('Failed to load placemarks for map:', err);
      }
    };
    fetch();
  }, [token]);

  return (
    <div className="map-card">
      <h3>🗺️ Your Placemark Map</h3>
      <MapContainer
        center={[53.4129, -8.2439]}
        zoom={7}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {placemarks.map((pm) => {
          const emoji = categoryIcons[pm.category?.toLowerCase()] || categoryIcons.default;
          const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${pm.lat},${pm.lng}`;

          return (
            <Marker
              key={pm.id}
              position={[pm.lat, pm.lng]}
              icon={createEmojiIcon(emoji)}
            >
              <Popup>
                <strong>{pm.name}</strong><br />
                {emoji} {pm.category}<br />
                <a href={directionsLink} target="_blank" rel="noreferrer">🧭 Directions</a>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}