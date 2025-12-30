import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { categories } from "../../util/Category";
import { warrantyOptions } from "../../util/Warranty";
import PaymentForm from "../Payment/PaymentForm";
import { createProduct } from "../../redux/reducers/productReducer";
import axios from "axios";
import { usePlacesAutocomplete } from "../../hooks/usePlacesAutocomplete";

const MAX_IMAGES = 5;

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";

  const [formLocked, setFormLocked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tempProductData, setTempProductData] = useState<any>(null);
  const [message, setMessage] = useState("");

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    stockInCount: "",
    category: "",
    brand: "",
    warranty: "",
    condition: "",
    status: "onsale",
    quickSale: false,
    whatsappNumber: user?.whatsappNumber || "",
    productType: "INDIVIDUAL" as "INDIVIDUAL" | "SHOP",
    shopAddress: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [locationError, setLocationError] = useState("");

  // Google Places Autocomplete
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setProductData((prev) => ({
      ...prev,
      shopAddress: place.formatted_address || "",
    }));
    setLocationError("");
  };
  const addressInputRef = usePlacesAutocomplete(
    handlePlaceSelect,
    productData.productType === "SHOP"
  );

  const selectedCategoryBrands =
    categories.find((cat) => cat.name === productData.category)?.brands || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: keyof typeof productData, value: any) => {
    setProductData((prev) => ({ ...prev, [key]: value }));
  };

  // Images
  const addImages = (files: File[]) => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const availableSlots = MAX_IMAGES - images.length;
    if (newFiles.length > availableSlots) {
      setMessage(
        `You can only add ${availableSlots} more image(s). Maximum ${MAX_IMAGES} images allowed.`
      );
      addImages(newFiles.slice(0, availableSlots));
    } else addImages(newFiles);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setMessage("");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processProductCreation = async (payload: any) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value))
        value.forEach((url) => formData.append("imageUrls", url));
      else if (value !== null && value !== undefined)
        formData.append(key, String(value));
    });

    const result = await dispatch(createProduct(formData));
    if (createProduct.fulfilled.match(result)) {
      setMessage("Product created successfully!");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setMessage(result.payload?.message || "Failed to create product.");
    }
    setFormLocked(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setFormLocked(true);

    // Validation
    if (!images.length)
      return setMessage("Please upload at least one product image.");
    if (!productData.whatsappNumber.trim())
      return setMessage("Please provide your WhatsApp number.");
    if (productData.productType === "SHOP" && !productData.shopAddress.trim())
      return setMessage("Shop location is required for shop products.");
    if (
      !productData.title.trim() ||
      !productData.description.trim() ||
      !productData.price ||
      !productData.category ||
      !productData.brand ||
      !productData.condition
    )
      return setMessage("Please fill in all required fields.");

    try {
      setMessage("Uploading images...");
      const uploadForm = new FormData();
      images.forEach((img) => uploadForm.append("images", img));
      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload/temp",
        uploadForm,
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 60000 }
      );

      const uploadedUrls: string[] = uploadRes.data.urls;
      if (!uploadedUrls?.length) throw new Error("No image URLs returned.");

      const payload = {
        ...productData,
        price: Number(productData.price),
        discountPrice: productData.discountPrice
          ? Number(productData.discountPrice)
          : null,
        stockInCount: Number(productData.stockInCount) || 1,
        imageUrls: uploadedUrls,
        shopAddress:
          productData.productType === "SHOP" ? productData.shopAddress : null,
      };

      if (isAdmin) return processProductCreation(payload);
      setTempProductData(payload);
      setShowPayment(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Upload failed. Try again."
      );
      setFormLocked(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 px-4 py-8">
      {/* Payment Modal */}
      {showPayment && tempProductData && user && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => {
                setShowPayment(false);
                setFormLocked(false);
              }}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 text-2xl font-bold hover:text-red-600 transition"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              Complete Payment
            </h3>
            <PaymentForm
              userId={user.id}
              productId="temp"
              productData={tempProductData}
              onSuccess={() => {
                setShowPayment(false);
                setFormLocked(false);
                setMessage("Payment successful! Product posted.");
                setTimeout(() => navigate("/"), 3000);
              }}
            />
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-2xl mx-auto mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-lg font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span className="text-3xl">←</span> Back to Home
        </button>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create Product Listing
        </h2>

        {message && (
          <div
            className={`p-4 rounded-lg text-center font-medium text-lg mb-6 ${
              message.includes("successfully")
                ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <input
            type="text"
            placeholder="Product Title"
            value={productData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <textarea
            placeholder="Detailed Description"
            rows={5}
            value={productData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />

          {/* Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="number"
              placeholder="Regular Price (KSH)"
              value={productData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="number"
              placeholder="Discount Price (Optional)"
              value={productData.discountPrice}
              onChange={(e) => handleChange("discountPrice", e.target.value)}
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Stock */}
          <input
            type="number"
            placeholder="Stock Count"
            value={productData.stockInCount}
            onChange={(e) => handleChange("stockInCount", e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Category & Brand */}
          <select
            value={productData.category}
            onChange={(e) => {
              handleChange("category", e.target.value);
              handleChange("brand", "");
            }}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={productData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            required
            disabled={!productData.category || formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-60"
          >
            <option value="">
              {productData.category ? "Select Brand" : "Select Category First"}
            </option>
            {selectedCategoryBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Product Type & Shop Address */}
          <div className="space-y-2">
            <label className="block font-medium">Product Type</label>
            <select
              value={productData.productType}
              onChange={(e) => handleChange("productType", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="INDIVIDUAL">Individual Seller</option>
              <option value="SHOP">Shop / Business</option>
            </select>
            <p className="text-xs text-gray-500">
              {productData.productType === "SHOP"
                ? "Shop products must have a physical location"
                : "Individual sellers do not require a location"}
            </p>
          </div>

          {productData.productType === "SHOP" && (
            <div className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Shop Location
              </h3>
              <input
                ref={addressInputRef}
                type="text"
                placeholder="Search shop address using Google"
                value={productData.shopAddress}
                onChange={(e) => handleChange("shopAddress", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
              {locationError && (
                <p className="text-sm text-red-600">{locationError}</p>
              )}
            </div>
          )}

          {/* Condition & Warranty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={productData.condition}
              onChange={(e) => handleChange("condition", e.target.value)}
              required
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select Condition</option>
              <option value="BRAND_NEW">Brand New</option>
              <option value="SLIGHTLY_USED">Slightly Used</option>
              <option value="REFURBISHED">Refurbished</option>
            </select>
            <select
              value={productData.warranty}
              onChange={(e) => handleChange("warranty", e.target.value)}
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">No Warranty</option>
              {warrantyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Sale & Status */}
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={productData.quickSale}
                onChange={(e) => handleChange("quickSale", e.target.checked)}
                disabled={formLocked}
                className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-lg font-medium">Quick Sale</span>
            </label>
            <select
              value={productData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="onsale">On Sale</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* WhatsApp */}
          <input
            type="text"
            placeholder="WhatsApp Number (e.g. +254712345678)"
            value={productData.whatsappNumber}
            onChange={(e) => handleChange("whatsappNumber", e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-medium mb-3">
              Product Images (Max {MAX_IMAGES})
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {images.length > 0
                ? `${images.length}/${MAX_IMAGES} images selected`
                : "No images selected yet"}
            </p>
            {images.length < MAX_IMAGES && (
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={formLocked}
                className="w-full text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 disabled:file:bg-gray-400"
              />
            )}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5 mt-6">
                {previews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={formLocked}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={formLocked || images.length === 0}
            className="w-full py-4 bg-indigo-600 text-white font-bold text-xl rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 transition shadow-lg"
          >
            {formLocked ? "Processing..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
