import React, { useState, useEffect, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchProductById,
  updateProduct,
} from "../../redux/reducers/productReducer";
import type { AppDispatch, RootState } from "../../redux/store";
import { categories } from "../../util/Category";

const UpdateProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const product = products.find((p) => p.id === id);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formLocked, setFormLocked] = useState(false);
  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price.toString() || "");
  const [category, setCategory] = useState(product?.category || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [condition, setCondition] = useState(product?.condition || "");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [discountPrice, setDiscountPrice] = useState(
    product?.discountPrice?.toString() || ""
  );
  const [stockInCount, setStockInCount] = useState(
    product?.stockInCount?.toString() || ""
  );
  const [status, setStatus] = useState(product?.status || "onsale");
  const [quickSale, setQuickSale] = useState(product?.quickSale || false);

  useEffect(() => {
    if (!product && id) dispatch(fetchProductById(id));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (product?.images) setPreviewImages(product.images);
  }, [dispatch, id, product]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    setMainImage(filesArray[0]);

    const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("condition", condition);
    formData.append("stockInCount", stockInCount);
    formData.append("status", status);
    formData.append("quickSale", quickSale.toString());

    if (mainImage) formData.append("image", mainImage);

    const res = await dispatch(updateProduct({ id, formData }));
    console.log("updated data", res);
    navigate("/");
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
      <Link
        to="/"
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold mb-6 inline-block"
      >
        ← Back to All Products
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Update Product
      </h1>

      {error && <p className="text-red-500 dark:text-red-400 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Images Preview */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Product Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 dark:file:bg-indigo-500 dark:hover:file:bg-indigo-600 transition"
          />
          <div className="flex flex-wrap mt-4 gap-4">
            {previewImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Preview ${idx + 1}`}
                className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product Title"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-32 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Price
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price in KSH"
              disabled
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Discount Price
            </label>
            <input
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Discount Price"
              disabled
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Stock Count
            </label>
            <input
              value={stockInCount}
              onChange={(e) => setStockInCount(e.target.value)}
              placeholder="Stock Available"
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* CATEGORY SELECT */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setBrand(""); // reset brand when category changes
              }}
              required
              disabled={formLocked}
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
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
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Brand
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              disabled={formLocked || !category}
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
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
        </div>

        {/* CONDITION SELECT */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Condition
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Choose Condition</option>
            <option value="BRAND_NEW">Brand New</option>
            <option value="SLIGHTLY_USED">Slightly Used</option>
            <option value="REFURBISHED">Refurbished</option>
          </select>
        </div>

        {/* STATUS FIELD */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Product Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="onsale">On Sale</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {/* QUICK SALE TOGGLE */}
        {status !== "sold" && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={quickSale}
              onChange={(e) => setQuickSale(e.target.checked)}
              className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
            />
            <label className="text-gray-700 dark:text-gray-300 font-medium">
              Mark as Quick Sale 🔥
            </label>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white font-semibold p-3 rounded-lg shadow-md transition"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;