import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface MapProps {
  position: [number, number];
}

const Map: React.FC<MapProps> = ({ position }) => {
  return (
    <MapContainer
      center={position}
      zoom={13} // Set an appropriate zoom level
      key={position.toString()} // Force re-render when position changes
      className="map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>A National Park location.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
