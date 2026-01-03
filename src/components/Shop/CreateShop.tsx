import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { createShop } from "../../redux/reducers/shopSlice";
import { usePlacesAutocomplete } from "../../hooks/usePlacesAutocomplete";
import { useNavigate } from "react-router-dom";

const CreateShop = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.shop);

  const [form, setForm] = useState({
    name: "",
    description: "",
    businessType: "Shop",
    registrationNo: "",
    taxPin: "",
    address: "",
    latitude: 0,
    longitude: 0,
    phone: "",
    email: "",
    website: "",
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [locationMode, setLocationMode] = useState<"ADDRESS" | "CURRENT" | null>(null);
  const [locationError, setLocationError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setDocuments(Array.from(e.target.files));
  };

  // Google Places Autocomplete
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) {
      setLocationError("Unable to get location coordinates.");
      return;
    }

   setForm((prev) => ({
  ...prev,
  address: place.formatted_address || "",
  latitude: place.geometry!.location!.lat(),
  longitude: place.geometry!.location!.lng(),
}));


    setLocationMode("ADDRESS");
    setLocationError("");
  };

  const addressInputRef = usePlacesAutocomplete(handlePlaceSelect, true);

  // Use live location
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          address: "",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationMode("CURRENT");
        setLocationError("");
      },
      () => setLocationError("Unable to retrieve your location."),
      { enableHighAccuracy: true }
    );
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value.toString());
    });

    documents.forEach((file) => data.append("documents", file));

    dispatch(createShop(data));
    navigate("/")
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Create Shop</h2>

      {error && (
        <p className="mb-4 text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200 p-2 rounded">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Shop Name"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="registrationNo"
          placeholder="Registration Number"
          required
          value={form.registrationNo}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="taxPin"
          placeholder="Tax PIN"
          value={form.taxPin}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="phone"
          placeholder="+2547xxxxxxxx"
          required
          value={form.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="website"
          placeholder="Website"
          value={form.website}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          name="description"
          placeholder="Shop Description"
          value={form.description}
          onChange={handleChange}
          className="md:col-span-2 px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />

        {/* Address with Google Autocomplete */}
        <input
          ref={addressInputRef}
          name="address"
          placeholder="Search Address via Google"
          value={form.address}
          disabled={locationMode === "CURRENT"}
          onChange={handleChange}
          className="md:col-span-2 px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-700"
        />

        <div className="md:col-span-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locationMode === "ADDRESS"}
            className="w-full py-3 rounded-lg border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 disabled:opacity-50"
          >
            📍 Use My Current Location
          </button>
          {locationError && <p className="text-red-500 text-sm">{locationError}</p>}
          {form.latitude && form.longitude && (
            <p className="text-green-500 text-sm">
              📍 Location pinned successfully (Lat: {form.latitude}, Lng: {form.longitude})
            </p>
          )}
        </div>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="md:col-span-2 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Creating..." : "Create Shop"}
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
