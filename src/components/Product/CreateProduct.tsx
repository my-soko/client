import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { createProduct } from "../../redux/reducers/productReducer";
import { categories } from "../../util/Category";

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.product);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockInCount, setStockInCount] = useState("");
  const [category, setCategory] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("onsale");
  const [quickSale, setQuickSale] = useState(false);

  // Handle image input
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("stockInCount", stockInCount);
    formData.append("status", status);
    formData.append("quickSale", quickSale.toString());
    formData.append("category", category);
    formData.append("whatsappNumber", whatsappNumber);
    images.forEach((img) => formData.append("images", img));

    const res = await dispatch(createProduct(formData));

    if (createProduct.fulfilled.match(res)) {
      setMessage("Product created successfully 🎉");

      // Redirect after success
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>

      {message && (
        <p className="mb-4 text-green-600 font-semibold">{message}</p>
      )}
      {error && <p className="mb-4 text-red-500 font-semibold">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          className="w-full border p-2 rounded"
          type="number"
          name="discountPrice"
          placeholder="Discount Price (leave blank for no discount)"
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
          min="0"
          step="0.01"
        />

        <input
          className="w-full border p-2 rounded"
          type="number"
          name="countInStock"
          placeholder="Count in Stock"
          value={stockInCount}
          onChange={(e) => setStockInCount(e.target.value)}
          required
          min="0"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="onsale">On Sale</option>
          <option value="sold">Sold</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={quickSale}
            onChange={(e) => setQuickSale(e.target.checked)}
          />
          <span>Mark as Quick Sale</span>
        </label>

        <select
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Choose Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="WhatsApp Number"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
          className="w-full"
          required
        />

        {preview.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {preview.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
