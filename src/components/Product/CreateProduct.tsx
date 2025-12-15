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

  const { loading, error } = useSelector((state: RootState) => state.product);
  const { user } = useSelector((state: RootState) => state.auth);
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
  const [whatsappNumber, setWhatsappNumber] = useState(
    user?.whatsappNumber || ""
  );

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // IMAGE UPLOAD
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  // PRODUCT SUBMISSION
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
    fd.append("discountPrice", discountPrice);
    fd.append("stockInCount", stockInCount);
    fd.append("status", status);
    fd.append("quickSale", quickSale.toString());
    fd.append("category", category);
    fd.append("brand", brand);
    fd.append("condition", condition);
    fd.append("whatsappNumber", whatsappNumber);

    images.forEach((img) => fd.append("images", img));

    setTempProductData(fd);
    if (!isAdmin && !paymentDone) {
      setFormLocked(true);
      setShowPayment(true);
      return;
    }
    processProductCreation(fd);
  };

  const processProductCreation = async (formData: FormData) => {
    const result = await dispatch(createProduct(formData));
    if (createProduct.fulfilled.match(result)) {
      setMessage("Product created successfully 🎉");
      setTimeout(() => navigate("/"), 1000);
    }
    setFormLocked(false);
  };

  useEffect(() => {
    if (!tempProductData) return;

    const discount = Number(tempProductData.get("discountPrice"));
    const price = Number(tempProductData.get("price"));

    const basePrice = discount || price;

    const fee = Math.max(1, Math.ceil(basePrice * 0.01));

    dispatch(setFee({ basePrice, fee }));
  }, [dispatch, tempProductData]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      {/* PAYMENT POPUP */}
      {showPayment && tempProductData && user && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl shadow-xl w-full max-w-md relative">
            <button
              onClick={() => {
                setShowPayment(false);
                setFormLocked(false);
              }}
              className="absolute top-3 right-3 text-red-500 font-bold"
            >
              ✕
            </button>

            <PaymentForm
              userId={user.id}
              productId="temp"
              productData={tempProductData}
              onSuccess={() => {
                setPaymentDone(true);
                setFormLocked(false);
                setShowPayment(false);
                setMessage(
                  "Payment successful! You can now complete your product listing."
                );
              }}
            />
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-blue-600 mb-6 hover:underline"
      >
        <span className="text-2xl mr-1">←</span> Back to Home
      </button>

      {/* FORM */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h2 className="text-3xl font-bold text-center mb-6">Create Product</h2>
        <p className="text-green-600 font-bold text-lg">
          Please ensure you post products related to the categories given to
          avoid removal of your product from our listing
        </p>

        {message && (
          <p className="text-green-600 bg-green-100 p-2 rounded text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 bg-red-100 p-2 rounded text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={formLocked}
            className="w-full border p-3 rounded"
          />
          <textarea
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={formLocked}
            className="w-full border p-3 rounded"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={formLocked}
              className="w-full border p-3 rounded"
            />
            <input
              type="number"
              placeholder="Discount Price (optional)"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              disabled={formLocked}
              className="w-full border p-3 rounded"
            />
          </div>

          <input
            type="number"
            placeholder="Stock Count"
            value={stockInCount}
            onChange={(e) => setStockInCount(e.target.value)}
            required
            disabled={formLocked}
            className="w-full border p-3 rounded"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={formLocked}
            className="w-full border p-3 rounded"
          >
            <option value="onsale">On Sale</option>
            <option value="sold">Sold</option>
          </select>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={quickSale}
              onChange={(e) => setQuickSale(e.target.checked)}
              disabled={formLocked}
            />
            <span>Quick Sale</span>
          </label>

          {/* CATEGORY SELECT */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setBrand(""); // reset brand when category changes
              }}
              required
              disabled={formLocked} // for CreateProduct
              className="w-full border p-3 rounded"
            >
              <option value="">Choose Category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* BRAND SELECT */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Brand
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              disabled={formLocked || !category} // disable if no category
              className="w-full border p-3 rounded"
            >
              <option value="">Choose Brand</option>
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

          <select
            name="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
            disabled={formLocked}
            className="w-full border p-3 rounded"
          >
            <option value="">Choose Product Condition</option>
            <option value="BRAND_NEW">Brand New</option>
            <option value="SLIGHTLY_USED">Slightly Used</option>
            <option value="REFURBISHED">Refurbished</option>
          </select>

          <input
            type="text"
            placeholder="WhatsApp  +254..."
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            required
            disabled={formLocked}
            className="w-full border p-3 rounded"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            required
            disabled={formLocked}
            className="w-full"
          />

          {/* IMAGE PREVIEW */}
          {preview.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {preview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-full h-28 object-cover rounded border"
                />
              ))}
            </div>
          )}

          {/* DISCLAIMER */}
          {!isAdmin && paymentDone && (
            <p className="text-red-600 font-semibold text-center mb-3">
              ⚠️ After completing the payment, click "Create Product" below to
              post your product.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || formLocked}
            className="w-full bg-blue-600 text-white p-3 rounded disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
