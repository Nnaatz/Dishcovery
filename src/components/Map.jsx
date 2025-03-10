import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Funktion zur Umwandlung der Koordinaten in ein Land
const getCountryFromCoordinates = (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.address && data.address.country) {
        return data.address.country; // Gibt das Land zurück
      } else {
        throw new Error('Kein Land gefunden für diese Koordinaten');
      }
    })
    .catch((error) => {
      console.error('Fehler bei der Geocoding-Abfrage:', error);
      throw error; // Fehler werfen, damit sie weiter behandelt werden können
    });
};

// Komponente für das Klicken auf die Karte
const ClickableMap = ({ setPosition }) => {
  // Verwende useMapEvents, um auf Klicks in der Karte zu reagieren
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      setPosition(event.latlng);

      console.log("Klick Koordinaten:", lat, lng); // Logge die Koordinaten des Klicks

      // Verwende die Methode zum Umwandeln der Koordinaten in ein Land
      getCountryFromCoordinates(lat, lng)
        .then((country) => {
          console.log(`Du hast auf ${country} geklickt!`); // Ausgabe in der Konsole
        })
        .catch((error) => {
          console.log("Fehler:", error);
        });
    },
  });
  return null;
};

// Hauptkomponente für die Karte
const Map = () => {
  const [position, setPosition] = useState([20, 0]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      {/* Karte */}
      <div style={{ width: '95%', height: '400px' }}>
        <MapContainer
          center={position}
          zoom={2}
          style={{ width: '100%', height: '100%' }}
        >
          {/* TileLayer wird als children des MapContainers gesetzt */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
          />
          <ClickableMap setPosition={setPosition} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
