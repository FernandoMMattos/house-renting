"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface PropertyMapProps {
  street: string;
  number: number;
  areaCode: string;
}

const PropertyMap = ({ street, number, areaCode }: PropertyMapProps) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const address = `${number} ${street}, Dublin ${areaCode}, Ireland`;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      { headers: { "Accept-Language": "en" }, signal: controller.signal },
    )
      .then((res) => res.json())
      .then((results) => {
        if (results.length === 0) throw new Error("Address not found");
        setCoords({ lat: Number(results[0].lat), lng: Number(results[0].lon) });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("Could not load map for this address");
      });

    return () => controller.abort();
  }, [street, number, areaCode]);

  if (error) return <p className="text-gray-400 text-sm">{error}</p>;
  if (!coords) return <p className="text-gray-400 text-sm">Loading map...</p>;

  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={15}
      className="w-full h-72 rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coords.lat, coords.lng]} icon={markerIcon}>
        <Popup>
          {number} {street}, Dublin {areaCode}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default PropertyMap;
