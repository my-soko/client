// src/components/Product/CategoryProducts.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchProducts,
  setCategoryFilter,
  deleteProduct,
} from "../../redux/reducers/productReducer";
import {
  addFavourite,
  removeFavourite,
} from "../../redux/reducers/favouriteSlice";
import { Heart, ArrowLeft } from "lucide-react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { formatDate } from "../../util/FormDate";

const CategoryProducts: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { favourites } = useSelector((state: RootState) => state.favourites);
  const { products, filteredProducts, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  const [timeFilter, setTimeFilter] = useState<
    "24h" | "48h" | "1w" | "1m" | "all"
  >("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-400 dark:text-gray-600"}
      >
        ★
      </span>
    ));

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  useEffect(() => {
    if (products.length > 0 && category) {
      dispatch(setCategoryFilter(decodeURIComponent(category)));
    }
  }, [dispatch, category, products]);

  // Filter by time posted
  const filteredByTime = filteredProducts
    .filter((product) => {
      if (!product.createdAt || timeFilter === "all") return true;

      const createdDate = new Date(product.createdAt);
      const now = new Date();
      const diffMs = now.getTime() - createdDate.getTime();

      switch (timeFilter) {
        case "24h":
          return diffMs <= 24 * 60 * 60 * 1000;
        case "48h":
          return diffMs <= 48 * 60 * 60 * 1000;
        case "1w":
          return diffMs <= 7 * 24 * 60 * 60 * 1000;
        case "1m":
          return diffMs <= 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    );

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-400 text-lg">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-20 text-red-500 dark:text-red-400">
        {error}
      </div>
    );

  const decodedCategory = category ? decodeURIComponent(category) : "Category";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
            <button
              onClick={() => {
                dispatch(fetchProducts());
                navigate("/");
              }}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>

            <h1 className="text-3xl font-bold capitalize text-gray-900 dark:text-white">
              {decodedCategory}
            </h1>
          </div>

          {/* Time Filter */}
          <div className="mb-8 flex items-center gap-4">
            <label className="font-semibold text-gray-800 dark:text-gray-200">
              Filter by time:
            </label>
            <select
              value={timeFilter}
              onChange={(e) =>
                setTimeFilter(e.target.value as "24h" | "48h" | "1w" | "1m" | "all")
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 hours</option>
              <option value="48h">Last 48 hours</option>
              <option value="1w">Last week</option>
              <option value="1m">Last month</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredByTime.length} product{filteredByTime.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Products Grid */}
          {filteredByTime.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No products found in this category.
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-500">
                Try adjusting the time filter or check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredByTime.map((product) => {
                const isOwner = user?.id === product.sellerId;
                const isFavourite = favourites.some(
                  (fav) => fav.productId === product.id
                );
                const whatsappLink =
                  user && !isOwner && product.seller?.whatsappNumber
                    ? `https://wa.me/${product.seller.whatsappNumber}?text=${encodeURIComponent(
                        `Hello ${product.seller.fullName}, my name is ${user.fullName}. I am interested in your product "${product.title}". Is it available?`
                      )}`
                    : null;

                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-2xl dark:hover:shadow-gray-900 transition-all duration-300 overflow-hidden relative group"
                  >
                    <Link to={`/product/${product.id}`} className="block">
                      {/* Image */}
                      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                        {product.quickSale && product.status !== "sold" && (
                          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 animate-pulse">
                            🔥 Quick Sale
                          </span>
                        )}
                        {product.status === "sold" && (
                          <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                            ❌ Sold
                          </span>
                        )}
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 font-medium">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <h3 className="font-semibold text-lg truncate text-gray-900 dark:text-white">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {product.description}
                        </p>

                        {product.averageRating !== undefined && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex text-lg">{renderStars(Math.round(product.averageRating))}</div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({product.totalReviews || 0})
                            </span>
                          </div>
                        )}

                        <div className="mt-4 flex items-baseline gap-2">
                          {product.discountPrice ? (
                            <>
                              <span className="text-xl font-bold text-red-600 dark:text-red-500">
                                KSH {product.discountPrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                KSH {product.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                              KSH {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {product.condition && (
                          <span
                            className={`inline-block mt-4 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                              product.condition === "BRAND_NEW"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                                : product.condition === "SLIGHTLY_USED"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                                : product.condition === "REFURBISHED"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {product.condition.replace("_", " ")}
                          </span>
                        )}

                        <p className="mt-5 text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-semibold">Stock:</span>{" "}
                          {product.stockInCount > 0 ? (
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                              {product.stockInCount} available
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 font-semibold">
                              Out of stock
                            </span>
                          )}
                        </p>

                        {product.createdAt && (
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500 italic">
                            Posted: {formatDate(product.createdAt)}
                          </p>
                        )}
                      </div>
                    </Link>

                    {/* Contact Button & Actions */}
                    <div className="px-5 pb-6">
                      {!isOwner && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!user) {
                              navigate("/login");
                              return;
                            }
                            if (whatsappLink) window.open(whatsappLink, "_blank");
                          }}
                          className={`w-full px-5 py-3 rounded-lg text-center font-medium shadow-md transition-all ${
                            user
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {user ? "Contact Seller" : "Login to Contact Seller"}
                        </button>
                      )}

                      {/* Top-Right Actions */}
                      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-3">
                        {/* Favourite */}
                        {!isOwner && user && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                              isFavourite
                                ? dispatch(removeFavourite(product.id))
                                : dispatch(addFavourite(product.id));
                            }}
                            className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all"
                          >
                            <Heart
                              size={22}
                              className={
                                isFavourite
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-600 dark:text-gray-400"
                              }
                            />
                          </button>
                        )}

                        {/* Owner Menu */}
                        {isOwner && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenMenuId(
                                  openMenuId === product.id ? null : product.id
                                );
                              }}
                              className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition"
                            >
                              ⋮
                            </button>
                            {openMenuId === product.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg overflow-hidden z-50">
                                <Link
                                  to={`/edit/${product.id}`}
                                  className="block px-5 py-3 text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
                                >
                                  ✏️ Edit Product
                                </Link>
                                <button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    try {
                                      await dispatch(deleteProduct(product.id)).unwrap();
                                      dispatch(fetchProducts());
                                      setOpenMenuId(null);
                                    } catch (err) {
                                      console.error("Failed to delete product:", err);
                                    }
                                  }}
                                  className="block w-full text-left px-5 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
                                >
                                  🗑 Delete Product
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryProducts;