// src/pages/ShopsMapPage.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePlacesAutocomplete } from "../../hooks/usePlacesAutocomplete";
import ShopMap from "./ShopMap";

const ShopsMapPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [customLocation, setCustomLocation] = useState("");

  // Geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  // Autocomplete input
  const inputRef = usePlacesAutocomplete((place) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setUserLocation({ lat, lng });
    }
  }, true);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
      >
        <ArrowLeft size={20} />
        Back to Home
      </button>

      <h1 className="text-2xl font-bold">
        Shops Map {category && `– ${category}`}
      </h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <button
          onClick={getCurrentLocation}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Use My Current Location
        </button>

        <div className="flex gap-2 mt-2 sm:mt-0 flex-1">
          <input
            type="text"
            ref={inputRef}
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            placeholder="Enter your location to search distance and directions"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
          />
        </div>
      </div>

      <ShopMap
        selectedCategory={category}
        userLocation={userLocation || undefined}
      />
    </div>
  );
};

export default ShopsMapPage;
