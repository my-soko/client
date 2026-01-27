import React, { useState, useEffect, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchProductById,
  updateProduct,
} from "../../redux/reducers/productReducer";
import type { AppDispatch, RootState } from "../../redux/store";
import { categories } from "../../util/Category";
import { warrantyOptions } from "../../util/Warranty";
import { fetchMyShops } from "../../redux/reducers/shopSlice";

interface FormData {
  title: string;
  description: string;
  discountPrice: string;
  stockInCount: string;
  category: string;
  brand: string;
  subItem: string;
  warranty: string;
  condition: string;
  status: "onsale" | "sold";
  quickSale: boolean;
  productType: "INDIVIDUAL" | "SHOP";
  shopId?: string;
}

const MAX_IMAGES = 5;

const MAX_DESCRIPTION_LENGTH = 200;

const UpdateProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    currentProduct: product,
    loading,
    error,
  } = useSelector((state: RootState) => state.product);

  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    discountPrice: "",
    stockInCount: "",
    category: "",
    brand: "",
    subItem: "",
    warranty: "",
    condition: "BRAND_NEW",
    status: "onsale",
    quickSale: false,
    productType: "INDIVIDUAL",
    shopId: "",
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingCover, setExistingCover] = useState<string>("");
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string>("");

  // Calculate current total images that will remain after update
  const filteredGallery = existingGallery.filter(
    (img) => !removeImages.includes(img)
  );
  const remainingExistingImages = filteredGallery.length;

  const totalImagesAfterUpdate = remainingExistingImages + newImages.length;

  // Merge all images for preview
  const allPreviews = [
    ...(existingCover && !removeImages.includes(existingCover)
      ? [existingCover]
      : []),
    ...filteredGallery,
    ...newPreviews,
  ];

  const selectedCategory = categories.find(
    (cat) => cat.name === formData.category
  );

  const subItems = selectedCategory?.subItems || [];

  const { myShops } = useSelector((state: RootState) => state.shop);

  useEffect(() => {
    dispatch(fetchMyShops());
  }, [dispatch]);

  useEffect(() => {
    if (id && !product) dispatch(fetchProductById(id));
  }, [dispatch, id, product]);

  // Initialize form and images
  useEffect(() => {
    if (!product) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      title: product.title || "",
      description: product.description || "",
      discountPrice: product.discountPrice?.toString() || "",
      stockInCount: product.stockInCount.toString(),
      category: product.category || "",
      brand: product.brand || "",
      subItem: product.subItem || "",
      warranty: product.warranty || "",
      condition: product.condition || "BRAND_NEW",
      status:
        product.status === "onsale" || product.status === "sold"
          ? product.status
          : "onsale",
      quickSale: product.quickSale || false,
      productType: product.productType || "INDIVIDUAL",
    });

    setExistingCover(product.imageUrl || "");
    setExistingGallery(product.images || []);
    setRemoveImages([]);
    setNewImages([]);
    setNewPreviews([]);
    setImageError("");
  }, [product]);

  const handleChange = (key: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const availableSlots = MAX_IMAGES - remainingExistingImages;

    if (selectedFiles.length > availableSlots) {
      setImageError(
        `You can only add ${availableSlots} more image(s). Maximum total of ${MAX_IMAGES} images allowed.`
      );
      // Optionally allow partial addition up to limit
      const allowedFiles = selectedFiles.slice(0, availableSlots);
      setNewImages(allowedFiles);
      setNewPreviews(allowedFiles.map((file) => URL.createObjectURL(file)));
    } else {
      setImageError("");
      setNewImages(selectedFiles);
      setNewPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
    }
  };

  const toggleRemoveImage = (url: string) => {
    setRemoveImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
    setImageError(""); // Clear error when removing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (totalImagesAfterUpdate > MAX_IMAGES) {
      setImageError(`Maximum of ${MAX_IMAGES} images allowed.`);
      return;
    }

    if (totalImagesAfterUpdate === 0) {
      setImageError("Product must have at least one image.");
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });

    if (removeImages.length)
      submitData.append("removeImages", JSON.stringify(removeImages));

    newImages.forEach((file) => submitData.append("images", file));

    const result = await dispatch(updateProduct({ id, formData: submitData }));
    if (updateProduct.fulfilled.match(result)) navigate("/");
  };

  if (loading && !product)
    return (
      <p className="text-center mt-20 text-gray-600 dark:text-gray-400">
        Loading product...
      </p>
    );

  if (!product)
    return (
      <p className="text-center mt-20 text-red-600 dark:text-red-400">
        Product not found.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <Link
        to="/"
        className="inline-block mb-6 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Update Product
      </h1>

      {(error || imageError) && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
          {imageError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images Section */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Product Images (Max {MAX_IMAGES})
          </label>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Currently keeping {remainingExistingImages} existing image(s).{" "}
            {newImages.length > 0 && `Adding ${newImages.length} new.`} Total:{" "}
            <strong>
              {totalImagesAfterUpdate}/{MAX_IMAGES}
            </strong>
          </p>

          {allPreviews.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5 mb-6">
              {allPreviews.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-40 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
                  />
                  {(existingCover === src || existingGallery.includes(src)) && (
                    <button
                      type="button"
                      onClick={() => toggleRemoveImage(src)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                    >
                      {removeImages.includes(src) ? "Undo" : "Remove"}
                    </button>
                  )}
                  {idx === 0 && !removeImages.includes(src) && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded">
                      Cover
                    </span>
                  )}
                  {idx >= remainingExistingImages && (
                    <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-3 py-1 rounded">
                      New
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No images yet</p>
          )}

          {totalImagesAfterUpdate < MAX_IMAGES && (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={totalImagesAfterUpdate >= MAX_IMAGES}
              className="block w-full text-sm text-gray-600 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-sm file:font-semibold file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-700 disabled:file:bg-gray-400"
            />
          )}

          {totalImagesAfterUpdate >= MAX_IMAGES && (
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-3">
              Maximum of {MAX_IMAGES} images reached. Remove some to add new
              ones.
            </p>
          )}

          {newImages.length > 0 && totalImagesAfterUpdate <= MAX_IMAGES && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-3">
              {newImages.length} new image(s) selected. First new image will
              become cover if current cover is removed.
            </p>
          )}
        </div>

        {/* Rest of the form fields remain unchanged */}
        {[
          { label: "Title", key: "title", type: "text", required: true },
          {
            label: "Description",
            key: "description",
            type: "textarea",
            required: true,
          },
          {
            label: "Discount Price",
            key: "discountPrice",
            type: "number",
            required: false,
          },
          {
            label: "Stock Count",
            key: "stockInCount",
            type: "number",
            required: true,
          },
        ].map((field) => (
          <div key={field.key}>
            <label className="block font-medium mb-2">{field.label}</label>

            {field.type === "textarea" ? (
              <>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value.slice(0, MAX_DESCRIPTION_LENGTH)
                    )
                  }
                  rows={5}
                  required={field.required}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3
                 focus:ring-2 focus:ring-indigo-500 resize-none"
                />

                <div className="flex justify-end text-xs mt-1">
                  <span
                    className={
                      formData.description.length === MAX_DESCRIPTION_LENGTH
                        ? "text-red-500"
                        : "text-gray-500"
                    }
                  >
                    {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
                  </span>
                </div>
              </>
            ) : (
              <input
                type={field.type}
                value={formData[field.key as keyof FormData] as string}
                onChange={(e) =>
                  handleChange(field.key as keyof FormData, e.target.value)
                }
                required={field.required}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3
               focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>
        ))}

        {/* Category & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => {
                handleChange("category", e.target.value);
                handleChange("subItem", "");
              }}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
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
          </div>
          <div>
            <label className="block font-medium mb-2">Brand</label>
            <select
              value={formData.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
              disabled={!formData.category}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              <option className="dark:bg-slate-900" value="">
                {formData.category ? "Select Brand" : "Choose Category First"}
              </option>
              {formData.category &&
                categories
                  .find((c) => c.name === formData.category)
                  ?.brands.map((b) => (
                    <option className="dark:bg-slate-900" key={b} value={b}>
                      {b}
                    </option>
                  ))}
            </select>
            {subItems.length > 0 && (
              <div>
                <label className="block font-medium mb-2">Sub Category</label>
                <select
                  value={formData.subItem}
                  onChange={(e) => handleChange("subItem", e.target.value)}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                >
                  <option className="dark:bg-slate-900" value="">
                    Select Sub Category
                  </option>
                  {subItems.map((item) => (
                    <option
                      className="dark:bg-slate-900"
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Product Type */}
        <div className="space-y-2">
          <label className="block font-medium">Product Type</label>

          <select
            value={formData.productType}
            onChange={(e) =>
              handleChange(
                "productType",
                e.target.value as "INDIVIDUAL" | "SHOP"
              )
            }
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
          >
            <option className="dark:bg-slate-900" value="INDIVIDUAL">
              Individual Seller
            </option>
            <option className="dark:bg-slate-900" value="SHOP">
              Shop / Business
            </option>
          </select>

          <p className="text-xs text-gray-500">
            {formData.productType === "SHOP" && (
              <div className="mt-4">
                <label className="block font-medium mb-2">Select Shop</label>
                <select
                  value={formData.shopId || ""}
                  onChange={(e) => handleChange("shopId", e.target.value)}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                >
                  <option className="dark:bg-slate-900" value="">
                    Select a Shop
                  </option>
                  {myShops.map((shop) => (
                    <option
                      key={shop.id}
                      value={shop.id}
                      className="dark:bg-slate-900"
                    >
                      {shop.name}
                    </option>
                  ))}
                </select>
                {myShops.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    You don't have any shops yet. Create a shop first.
                  </p>
                )}
              </div>
            )}
          </p>
        </div>

        {/* Condition & Warranty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">Condition</label>
            <select
              value={formData.condition}
              onChange={(e) => handleChange("condition", e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            >
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
          </div>
          <div>
            <label className="block font-medium mb-2">Warranty</label>
            <select
              value={formData.warranty}
              onChange={(e) => handleChange("warranty", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            >
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
        </div>

        {/* Status & Quick Sale */}
        <div>
          <label className="block font-medium mb-2">Product Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
          >
            <option className="dark:bg-slate-900" value="onsale">
              On Sale
            </option>
            <option className="dark:bg-slate-900" value="sold">
              Sold
            </option>
          </select>
        </div>

        {formData.status !== "sold" && (
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={formData.quickSale}
              onChange={(e) => handleChange("quickSale", e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label className="font-medium">Mark as Quick Sale 🔥</label>
          </div>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            totalImagesAfterUpdate > MAX_IMAGES ||
            totalImagesAfterUpdate === 0
          }
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white text-xl font-bold rounded-xl shadow-lg transition"
        >
          {loading ? "Updating Product..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
