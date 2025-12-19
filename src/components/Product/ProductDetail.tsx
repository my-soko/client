// src/components/Product/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../../redux/reducers/productReducer";
import type { AppDispatch, RootState } from "../../redux/store";
import ProductReviews from "../Review/ProductReviews";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentProduct, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct?.imageUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMainImage(currentProduct.imageUrl);
    }
  }, [currentProduct]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 dark:text-gray-400 text-xl">
        Loading product details...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-600 dark:text-red-400 text-xl">
        {error}
      </div>
    );

  if (!currentProduct)
    return (
      <div className="text-center py-20 text-gray-600 dark:text-gray-400 text-xl">
        Product not found.
      </div>
    );

  const isOwner = user?.id === currentProduct.sellerId;

  const whatsappLink =
    user && !isOwner && currentProduct.seller?.whatsappNumber
      ? `https://wa.me/${currentProduct.seller.whatsappNumber}?text=${encodeURIComponent(
          `Hello ${currentProduct.seller.fullName}, my name is ${user.fullName}. I saw your product "${currentProduct.title}" on MySoko and I'm very interested! Is it still available?`
        )}`
      : null;

  const handleWhatsAppClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (whatsappLink) window.open(whatsappLink, "_blank");
  };

  // Collect all images: main + additional
  const allImages = [
    currentProduct.imageUrl,
    ...(currentProduct.images || []),
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-lg font-medium text-indigo-600 dark:text-indigo-400 hover:underline mb-8"
        >
          <span className="text-2xl">←</span> Back to All Products
        </Link>

        {/* Main Product Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 lg:p-12">
            {/* Images Section */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative w-full h-[500px] bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={mainImage || currentProduct.imageUrl}
                  alt={currentProduct.title}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
                {currentProduct.status === "sold" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">SOLD</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(img)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                        mainImage === img
                          ? "border-indigo-600 dark:border-indigo-400 shadow-lg scale-105"
                          : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentProduct.title}
                </h1>

                {/* Quick Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {currentProduct.quickSale && currentProduct.status !== "sold" && (
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                      🔥 Quick Sale
                    </span>
                  )}
                  {currentProduct.condition && (
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                        currentProduct.condition === "BRAND_NEW"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                          : currentProduct.condition === "SLIGHTLY_USED"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                      }`}
                    >
                      {currentProduct.condition.replace("_", " ")}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  {currentProduct.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  {currentProduct.discountPrice ? (
                    <div>
                      <p className="text-4xl font-bold text-red-600 dark:text-red-500">
                        KSH {currentProduct.discountPrice.toLocaleString()}
                      </p>
                      <p className="text-xl text-gray-500 dark:text-gray-400 line-through mt-2">
                        KSH {currentProduct.price.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                      KSH {currentProduct.price.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Stock & Seller */}
                <div className="space-y-4 mb-10">
                  <p className="text-lg">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Stock:
                    </span>{" "}
                    {currentProduct.stockInCount > 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {currentProduct.stockInCount} available
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        Out of stock
                      </span>
                    )}
                  </p>

                  <p className="text-lg">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Seller:
                    </span>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      {currentProduct.seller.fullName}
                    </span>
                  </p>

                  {currentProduct.createdAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                      Posted: {new Date(currentProduct.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Contact Button */}
                {!isOwner && (
                  <button
                    onClick={handleWhatsAppClick}
                    className={`w-full py-4 rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-105 ${
                      user
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {user ? "Contact Seller via WhatsApp" : "Login to Contact Seller"}
                  </button>
                )}

                {isOwner && (
                  <div className="bg-blue-100 dark:bg-blue-900/40 border border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-center font-semibold">
                    This is your listing
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews
            productId={currentProduct.id}
            userId={user?.id}
            sellerId={currentProduct.sellerId}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;