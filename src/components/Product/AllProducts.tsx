// src/components/Product/AllProducts.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchProducts,
  deleteProduct,
} from "../../redux/reducers/productReducer";
import {
  addFavourite,
  removeFavourite,
} from "../../redux/reducers/favouriteSlice";
import { Heart } from "lucide-react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { formatDate } from "../../util/FormDate";

const AllProducts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const { favourites } = useSelector((state: RootState) => state.favourites);
  const {
    filteredProducts: products,
    loading,
    error,
  } = useSelector((state: RootState) => state.product);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={
          i < rating ? "text-yellow-400" : "text-gray-400 dark:text-gray-600"
        }
      >
        ★
      </span>
    ));

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-400">
        Loading products...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-20 text-red-500 dark:text-red-400">
        {error}
      </div>
    );

  // Sort products by newest first
  const sortedProducts = [...products].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  );

  // Group by category
  const groupedProducts = sortedProducts.reduce<
    Record<string, typeof products>
  >((acc, product) => {
    acc[product.category] ??= [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1 px-4 py-8 md:p-6">
        {/* SELL BUTTON */}
        <div className="max-w-7xl mx-auto flex justify-end mb-10">
          <Link
            to="/create"
            className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-400 transition"
          >
            Sell
          </Link>
        </div>

        {/* CATEGORY SECTIONS */}
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
          const whatsappLinkGenerator = (
            product: (typeof categoryProducts)[0]
          ) =>
            user &&
            user.id !== product.sellerId &&
            product.seller?.whatsappNumber
              ? `https://wa.me/${
                  product.seller.whatsappNumber
                }?text=${encodeURIComponent(
                  `Hello ${product.seller.fullName}, my name is ${user.fullName}. I am interested in your product "${product.title}". Is it available?`
                )}`
              : null;

          return (
            <section key={category} className="mb-16 max-w-7xl mx-auto">
              {/* CATEGORY HEADER */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold capitalize text-gray-900 dark:text-white">
                  {category}
                </h2>
                <Link
                  to={`/category/${encodeURIComponent(category)}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-semibold whitespace-nowrap"
                >
                  View all →
                </Link>
              </div>

              {/* HORIZONTAL SCROLLER */}
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {categoryProducts.slice(0, 4).map((product) => {
                  const isOwner = user?.id === product.sellerId;
                  const isFavourite = favourites.some(
                    (fav) => fav.productId === product.id
                  );
                  const whatsappLink = whatsappLinkGenerator(product);

                  return (
                    <div
                      key={product.id}
                      className="flex-none w-[92vw] md:w-[22vw] sm:w-72 md:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-2xl dark:hover:shadow-gray-900 transition-all duration-300 overflow-hidden relative group snap-start"
                    >
                      <Link to={`/product/${product.id}`} className="block">
                        {/* IMAGE */}
                        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                          {product.quickSale && product.status !== "sold" && (
                            <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse z-10">
                              🔥 Quick Sale
                            </span>
                          )}
                          {product.status === "sold" && (
                            <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
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
                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-lg font-medium">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* INFO */}
                        <div className="p-5">
                          <h3 className="font-semibold text-lg truncate text-gray-900 dark:text-white">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                            {product.description}
                          </p>

                          {product.averageRating !== undefined && (
                            <div className="flex items-center gap-2 mt-3">
                              <div className="flex text-lg">
                                {renderStars(Math.round(product.averageRating))}
                              </div>
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

                          {product.stockTotal > 0 && (
                            <div className="mt-4">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    product.stockInCount / product.stockTotal >
                                    0.5
                                      ? "bg-green-500"
                                      : product.stockInCount /
                                          product.stockTotal >
                                        0.2
                                      ? "bg-yellow-400"
                                      : "bg-red-500"
                                  }`}
                                  style={{
                                    width: `${
                                      (product.stockInCount /
                                        product.stockTotal) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* ACTIONS & CONTACT BUTTON */}
                      <div className="px-[2.5rem] pb-6">
                        {!isOwner && (
                          <button
                            onClick={() => {
                              if (!user) {
                                navigate("/login");
                                return;
                              }
                              if (whatsappLink)
                                window.open(whatsappLink, "_blank");
                            }}
                            className={`w-full px-3 py-3 rounded-lg text-center font-medium shadow-md transition-all ${
                              user
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {user
                              ? "Contact Seller"
                              : "Login to Contact Seller"}
                          </button>
                        )}

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
                            className="
        absolute 
        p-2.5
        bg-transparent
        rounded-full
        hover:scale-110
        active:scale-95
        transition-all duration-200
        z-20
      "
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
                          {product.createdAt && (
                            <p className="mt-4 text-xs text-gray-400 dark:text-gray-400 italic">
                              Posted: {formatDate(product.createdAt)}
                            </p>
                          )}

                        {/* TOP-RIGHT ACTIONS */}
                        <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
                          {/* Discount Badge - only shown when there's a discount */}
                          {product.discountPrice &&
                            product.discountPrice < product.price && (
                              <div className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                               -{Math.round(
                                  ((product.price - product.discountPrice) /
                                    product.price) *
                                    100
                                )}
                                % OFF
                              </div>
                            )}

                          {/* Owner Menu */}
                          {isOwner && (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setOpenMenuId(
                                    openMenuId === product.id
                                      ? null
                                      : product.id
                                  );
                                }}
                                className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition"
                              >
                                ⋮
                              </button>
                              {openMenuId === product.id && (
                                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg overflow-hidden z-50">
                                  <Link
                                    to={`/edit/${product.id}`}
                                    className="block px-4 py-3 text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
                                  >
                                    ✏️ Edit Product
                                  </Link>
                                  <button
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      try {
                                        await dispatch(
                                          deleteProduct(product.id)
                                        ).unwrap();
                                        dispatch(fetchProducts());
                                        setOpenMenuId(null);
                                      } catch (err) {
                                        console.error(
                                          "Failed to delete product:",
                                          err
                                        );
                                      }
                                    }}
                                    className="block w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
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
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
};

export default AllProducts;
