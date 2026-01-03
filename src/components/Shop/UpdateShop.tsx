import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchShopById,
  updateShop,
  clearSelectedShop,
} from "../../redux/reducers/shopSlice";
import { usePlacesAutocomplete } from "../../hooks/usePlacesAutocomplete";

const UpdateShop = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { selectedShop, loading, error } = useSelector(
    (state: RootState) => state.shop
  );

  const inputRef = usePlacesAutocomplete((place) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setUserLocation({ lat, lng });

      // eslint-disable-next-line react-hooks/immutability
      setFormData((prev) => ({
        ...prev,
        address: place.formatted_address || prev.address,
      }));
    }
  }, true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    businessType: "",
    registrationNo: "",
    taxPin: "",
    phone: "",
    email: "",
    website: "",
    address: "",
  });

  useEffect(() => {
    if (id) dispatch(fetchShopById(id));

    return () => {
      dispatch(clearSelectedShop());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedShop) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: selectedShop.name,
        description: selectedShop.description || "",
        businessType: selectedShop.businessType,
        registrationNo: selectedShop.registrationNo,
        taxPin: selectedShop.taxPin || "",
        phone: selectedShop.phone,
        email: selectedShop.email || "",
        website: selectedShop.website || "",
        address: selectedShop.address,
      });
    }
  }, [selectedShop]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    const result = await dispatch(updateShop({ id, data: payload }));
    if (updateShop.fulfilled.match(result)) {
      navigate("/shops");
    }
  };

  if (loading && !selectedShop)
    return <p className="text-center text-gray-400">Loading shop...</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 px-4 py-10">
      <div>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => navigate(`/shops/${selectedShop?.id}`)}
        >
          Back
        </button>
      </div>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Update Shop Information
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Shop Name"
            required
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Shop Description"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            placeholder="Business Type"
            required
            className="w-full px-4 py-3 rounded-lg border"
          />

          <input
            name="registrationNo"
            value={formData.registrationNo}
            onChange={handleChange}
            placeholder="Registration Number"
            required
            className="w-full px-4 py-3 rounded-lg border"
          />

          <input
            name="taxPin"
            value={formData.taxPin}
            onChange={handleChange}
            placeholder="Tax PIN (Optional)"
            className="w-full px-4 py-3 rounded-lg border"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full px-4 py-3 rounded-lg border"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email (Optional)"
            className="w-full px-4 py-3 rounded-lg border"
          />

          <input
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website (Optional)"
            className="w-full px-4 py-3 rounded-lg border"
          />

          <input
            name="address"
            ref={inputRef}
            value={formData.address}
            onChange={handleChange}
            placeholder="Physical Address"
            required
            className="w-full px-4 py-3 rounded-lg border"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Shop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateShop;
