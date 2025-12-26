import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { categories } from "../../util/Category";
import PaymentForm from "../Payment/PaymentForm";
import { createProduct } from "../../redux/reducers/productReducer";
import { warrantyOptions } from "../../util/Warranty";
import axios from "axios";

const MAX_IMAGES = 5;

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";

  const [showPayment, setShowPayment] = useState(false);
  const [formLocked, setFormLocked] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tempProductData, setTempProductData] = useState<any>(null);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockInCount, setStockInCount] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [warranty, setWarranty] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("onsale");
  const [quickSale, setQuickSale] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(
    user?.whatsappNumber || ""
  );

  // Image states
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Dynamic brands
  const selectedCategoryBrands =
    categories.find((cat) => cat.name === category)?.brands || [];

  // Add new images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const availableSlots = MAX_IMAGES - images.length;

    if (newFiles.length > availableSlots) {
      setMessage(
        `You can only add ${availableSlots} more image(s). Maximum ${MAX_IMAGES} images allowed.`
      );
      const allowedFiles = newFiles.slice(0, availableSlots);
      addImages(allowedFiles);
    } else {
      setMessage("");
      addImages(newFiles);
    }
  };

  const addImages = (files: File[]) => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove image by index
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]); // Clean up memory
      return prev.filter((_, i) => i !== index);
    });
    setMessage("");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processProductCreation = async (payload: any) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((url: string) => formData.append("imageUrls", url));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
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

    if (images.length === 0) {
      setMessage("Please upload at least one product image.");
      setFormLocked(false);
      return;
    }

    if (images.length > MAX_IMAGES) {
      setMessage(`Maximum ${MAX_IMAGES} images allowed.`);
      setFormLocked(false);
      return;
    }

    if (!whatsappNumber.trim()) {
      setMessage("Please provide your WhatsApp number.");
      setFormLocked(false);
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !price ||
      !category ||
      !brand ||
      !condition
    ) {
      setMessage("Please fill in all required fields.");
      setFormLocked(false);
      return;
    }

    try {
      setMessage("Uploading images...");
      const uploadForm = new FormData();
      images.forEach((img) => uploadForm.append("images", img));

      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload/temp",
        uploadForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        }
      );

      const uploadedUrls: string[] = uploadRes.data.urls;
      if (!uploadedUrls || uploadedUrls.length === 0) {
        throw new Error("No image URLs returned from server");
      }

      const productPayload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stockInCount: Number(stockInCount) || 1,
        category,
        brand,
        warranty: warranty || null,
        condition,
        whatsappNumber: whatsappNumber.trim(),
        imageUrls: uploadedUrls,
        status,
        quickSale,
      };

      if (isAdmin) {
        setMessage("Creating product (Admin bypass)...");
        await processProductCreation(productPayload);
        return;
      }

      setTempProductData(productPayload);
      setShowPayment(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Upload failed. Please try again."
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
                setMessage(
                  "Payment successful! Your product has been posted automatically."
                );
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

      {/* Main Form */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create Product Listing
        </h2>

        {message && (
          <div
            className={`p-4 rounded-lg text-center font-medium text-lg mb-6 ${
              message.includes("successfully") ||
              message.includes("Payment successful")
                ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Other fields unchanged */}
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            placeholder="Detailed Description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="number"
              placeholder="Regular Price (KSH)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="number"
              placeholder="Discount Price (Optional)"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <input
            type="number"
            placeholder="Stock Count"
            value={stockInCount}
            onChange={(e) => setStockInCount(e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setBrand("");
            }}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option className="dark:bg-slate-900" value="">
              Select Category
            </option>
            {categories.map((cat) => (
              <option
                className="dark:bg-slate-900"
                key={cat.name}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}
          </select>

          {/* Brand */}
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            disabled={!category || formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-60"
          >
            <option className="dark:bg-slate-900" value="">
              {category ? "Select Brand" : "Select Category First"}
            </option>
            {selectedCategoryBrands.map((b) => (
              <option className="dark:bg-slate-900" key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Condition & Warranty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option className="dark:bg-slate-900" value="">
                Select Condition
              </option>
              <option className="dark:bg-slate-900" value="BRAND_NEW">
                Brand New
              </option>
              <option className="dark:bg-slate-900" value="SLIGHTLY_USED">
                Slightly Used
              </option>
              <option className="dark:bg-slate-900" value="REFURBISHED">
                Refurbished
              </option>
            </select>

            <select
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option className="dark:bg-slate-900" value="">
                No Warranty
              </option>
              {warrantyOptions.map((opt) => (
                <option
                  className="dark:bg-slate-900"
                  key={opt.value}
                  value={opt.value}
                >
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
                checked={quickSale}
                onChange={(e) => setQuickSale(e.target.checked)}
                disabled={formLocked}
                className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-lg font-medium">Quick Sale</span>
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={formLocked}
              className="px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option className="dark:bg-slate-900" value="onsale">
                On Sale
              </option>
              <option className="dark:bg-slate-900" value="sold">
                Sold
              </option>
            </select>
          </div>

          {/* WhatsApp */}
          <input
            type="text"
            placeholder="WhatsApp Number (e.g. +254712345678)"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            required
            disabled={formLocked}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Image Upload Section */}
          <div>
            <label className="block text-lg font-medium mb-3">
              Product Images (Max {MAX_IMAGES})
            </label>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {images.length > 0
                ? `${images.length}/${MAX_IMAGES} images selected`
                : "No images selected yet"}
            </p>

            {/* File Input */}
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

            {images.length >= MAX_IMAGES && (
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-3">
                Maximum {MAX_IMAGES} images reached. Remove some to add new
                ones.
              </p>
            )}

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5 mt-6">
                {previews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
                    />

                    {/* Cover Badge */}
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded">
                        Cover
                      </span>
                    )}

                    {/* Remove Button */}
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
