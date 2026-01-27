import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../../redux/reducers/productReducer";
import type { AppDispatch, RootState } from "../../redux/store";
import ProductReviews from "../Review/ProductReviews";
import { formatDate } from "../../util/FormDate";

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (currentProduct?.imageUrl) setMainImage(currentProduct.imageUrl);
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
  const isSold = currentProduct.status === "sold";

  const whatsappLink =
    user && !isOwner && currentProduct.seller?.whatsappNumber && !isSold
      ? `https://wa.me/${
          currentProduct.seller.whatsappNumber
        }?text=${encodeURIComponent(
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 lg:p-12">
            <div className="space-y-6">
              <div className="relative w-full h-[500px] bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={mainImage || currentProduct.imageUrl}
                  alt={currentProduct.title}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
                {isSold && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">SOLD</span>
                  </div>
                )}
              </div>
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
            <div className="flex flex-col justify-between">
              <div>
                {/* Shop Name */}
                {currentProduct.shop && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                    Sold by:{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {currentProduct.shop.name} Shop
                    </span>
                  </p>
                )}

                {/* Product Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                  {currentProduct.title}
                </h1>

                {/* Badges: Quick Sale, Condition, Warranty */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {currentProduct.quickSale && !isSold && (
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-md">
                      🔥 Quick Sale
                    </span>
                  )}
                  {currentProduct.condition && (
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
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
                  {currentProduct.warranty && currentProduct.warranty.trim() ? (
                    currentProduct.warranty === "No warranty" ? (
                      <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs font-medium shadow-sm">
                        No Warranty
                      </span>
                    ) : (
                      <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 rounded-full text-xs font-semibold shadow-sm">
                        Warranty 🛡️ {currentProduct.warranty}
                      </span>
                    )
                  ) : (
                    <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs font-medium shadow-sm">
                      No Warranty
                    </span>
                  )}
                </div>

                {/* Product Description */}
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  {currentProduct.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  {currentProduct.discountPrice ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-500">
                        KSH {currentProduct.discountPrice.toLocaleString()}
                      </p>
                      <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 line-through">
                        KSH {currentProduct.price.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                      KSH {currentProduct.price.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Map Link */}
                {user && currentProduct.shop && (
                  <Link
                    to={`/product-map/${currentProduct.id}`}
                    className="inline-flex items-center justify-center mt-4 w-full sm:w-auto py-3 px-6 rounded-xl
bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
                  >
                    📍 View {currentProduct.shop.name} on Map
                  </Link>
                )}

                {/* Contact / Owner Button */}
                {!isOwner && (
                  <button
                    onClick={handleWhatsAppClick}
                    disabled={isSold}
                    className={`w-full sm:w-auto mt-4 py-4 px-6 rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-105 ${
                      isSold
                        ? "bg-gray-400 cursor-not-allowed text-gray-700"
                        : user
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isSold
                      ? "Product Sold"
                      : user
                      ? "Contact Seller via WhatsApp"
                      : "Login to Contact Seller"}
                  </button>
                )}

                {isOwner && (
                  <div className="bg-blue-100 dark:bg-blue-900/40 border border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-center font-semibold mt-4 shadow-sm">
                    This is your listing
                  </div>
                )}

                {/* Posted Date */}
                {currentProduct.createdAt && (
                  <p className="text-sm mt-6 text-gray-500 dark:text-gray-400 italic">
                    Posted: {formatDate(currentProduct.createdAt)}
                  </p>
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
