import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchProductById } from "../../redux/reducers/productReducer";
import ProductShopMap from "./ProductShopMap";
import { usePlacesAutocomplete } from "../../hooks/usePlacesAutocomplete";

const ProductShopMapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { currentProduct, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [customLocation, setCustomLocation] = useState("");

  // Fetch product
  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

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

  if (loading) return <p className="p-6">Loading map…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!currentProduct?.shop) return <p className="p-6">Shop location not available</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <Link
        to={`/product/${currentProduct.id}`}
        className="text-indigo-600 hover:underline mb-4 inline-block"
      >
        ← Back to product
      </Link>

      <h1 className="text-2xl font-bold mb-4">
        {currentProduct.shop.name} — Location & Directions
      </h1>

      {/* Input form for directions */}
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
            placeholder="Enter start location"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
          />

      
        </div>
      </div>

      {/* Map */}
      <ProductShopMap
        shop={currentProduct.shop}
        userLocation={userLocation || undefined}
      />
    </div>
  );
};

export default ProductShopMapPage;
