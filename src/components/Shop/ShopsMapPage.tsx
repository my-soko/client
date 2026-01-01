import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ShopMap from "./ShopMap";
import React, { useState } from "react";
import { usePlacesAutocomplete } from "../../hooks/usePlacesAutocomplete";

const ShopsMapPage = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  const [customLocation, setCustomLocation] = useState("");

  // Autocomplete input
  const inputRef = usePlacesAutocomplete((place) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      // Update ShopMap
      const event = new CustomEvent("updateUserLocation", {
        detail: { lat, lng },
      });
      window.dispatchEvent(event);
    }
  }, true);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
      >
        <ArrowLeft size={20} />
        Back to Home
      </button>

      <h1 className="text-2xl font-bold">
        To Shops Map {category && `– ${category}`}
      </h1>

      {/* Distance & Directions Input */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("useMyLocation"))}
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

      {/* Map */}
      <ShopMap selectedCategory={category || ""} />
    </div>
  );
};

export default ShopsMapPage;
