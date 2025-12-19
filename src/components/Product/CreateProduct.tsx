// src/components/Product/CreateProduct.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { categories } from "../../util/Category";
import PaymentForm from "../Payment/PaymentForm";
import { createProduct } from "../../redux/reducers/productReducer";
import { setFee } from "../../redux/reducers/paymentSlice";

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, loading: authLoading, error: authError } = useSelector(
    (state: RootState) => state.auth
  );
  const isAdmin = user?.role === "admin";

  const [showPayment, setShowPayment] = useState(false);
  const [formLocked, setFormLocked] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [tempProductData, setTempProductData] = useState<FormData | null>(null);

  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockInCount, setStockInCount] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("onsale");
  const [quickSale, setQuickSale] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsappNumber || "");
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // Handle image upload
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  // Calculate fee when temp data is ready
  useEffect(() => {
    if (!tempProductData) return;

    const discount = Number(tempProductData.get("discountPrice")) || 0;
    const base = Number(tempProductData.get("price"));
    const basePrice = discount || base;
    const fee = Math.max(1, Math.ceil(basePrice * 0.01));

    dispatch(setFee({ basePrice, fee }));
  }, [tempProductData, dispatch]);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappNumber.trim()) {
      alert("Please add your WhatsApp number before proceeding.");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("price", price);
    fd.append("discountPrice", discountPrice || "");
    fd.append("stockInCount", stockInCount);
    fd.append("status", status);
    fd.append("quickSale", quickSale.toString());
    fd.append("category", category);
    fd.append("brand", brand);
    fd.append("condition", condition);
    fd.append("whatsappNumber", whatsappNumber);

    images.forEach((img) => fd.append("images", img));

    setTempProductData(fd);

    // Admin bypasses payment
    if (isAdmin || paymentDone) {
      processProductCreation(fd);
    } else {
      setFormLocked(true);
      setShowPayment(true);
    }
  };

  const processProductCreation = async (formData: FormData) => {
    const result = await dispatch(createProduct(formData));

    if (createProduct.fulfilled.match(result)) {
      setMessage("Product created successfully! 🎉");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setMessage("Failed to create product. Please try again.");
    }

    setFormLocked(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 px-4 py-8">
      {/* Payment Modal */}
      {showPayment && tempProductData && user && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <button
              onClick={() => {
                setShowPayment(false);
                setFormLocked(false);
              }}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-2xl font-bold transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                Complete Payment
              </h3>
              <PaymentForm
                userId={user.id}
                productId="temp"
                productData={tempProductData}
                onSuccess={() => {
                  setPaymentDone(true);
                  setShowPayment(false);
                  setFormLocked(false);
                  setMessage("Payment successful! Posting your product...");
                  processProductCreation(tempProductData);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-lg font-medium text-indigo-600 dark:text-indigo-400 hover:underline mb-8"
        >
          <span className="text-3xl">←</span> Back to Home
        </button>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create Product Listing
        </h2>

        <p className="text-center text-green-700 dark:text-green-400 font-semibold text-lg mb-6 bg-green-50 dark:bg-green-900/30 px-4 py-3 rounded-lg">
          Please post only products related to the available categories to avoid removal.
        </p>

        {/* Messages */}
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

        {authError && (
          <div className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 p-4 rounded-lg text-center mb-6">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />

          {/* Description */}
          <textarea
            placeholder="Detailed Description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition"
          />

          {/* Price Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="number"
              placeholder="Regular Price (KSH)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={formLocked}
              className="px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
            <input
              type="number"
              placeholder="Discount Price (Optional)"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              disabled={formLocked}
              className="px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Stock */}
          <input
            type="number"
            placeholder="Stock Count"
            value={stockInCount}
            onChange={(e) => setStockInCount(e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          {/* Status & Quick Sale */}
          <div className="flex flex-col sm:flex-row gap-6">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={formLocked}
              className="flex-1 px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="onsale">On Sale</option>
              <option value="sold">Sold</option>
            </select>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={quickSale}
                onChange={(e) => setQuickSale(e.target.checked)}
                disabled={formLocked}
                className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Quick Sale 🔥
              </span>
            </label>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setBrand("");
              }}
              required
              disabled={formLocked}
              className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Brand
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              disabled={formLocked || !category}
              className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition disabled:opacity-60"
            >
              <option value="">
                {category ? "Select Brand" : "Choose Category First"}
              </option>
              {category &&
                categories
                  .find((c) => c.name === category)
                  ?.brands.map((bnd) => (
                    <option key={bnd} value={bnd}>
                      {bnd}
                    </option>
                  ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              disabled={formLocked}
              className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="">Select Condition</option>
              <option value="BRAND_NEW">Brand New</option>
              <option value="SLIGHTLY_USED">Slightly Used</option>
              <option value="REFURBISHED">Refurbished</option>
            </select>
          </div>

          {/* WhatsApp */}
          <input
            type="tel"
            placeholder="WhatsApp Number (+254...)"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Product Images (Multiple)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              required
              disabled={formLocked}
              className="w-full px-5 py-4 border border-dashed border-gray-400 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition"
            />
          </div>

          {/* Image Preview */}
          {preview.length > 0 && (
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                Preview ({preview.length} images)
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {preview.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-md group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Reminder */}
          {!isAdmin && paymentDone && (
            <div className="bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg text-center font-semibold">
              ⚠️ Payment completed! Click "Create Product" below to post.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={authLoading || formLocked}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xl font-bold rounded-xl shadow-lg transition transform hover:scale-105 disabled:hover:scale-100"
          >
            {authLoading || formLocked ? "Processing..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;