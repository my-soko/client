import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  addFavourite,
  fetchFavourites,
  removeFavourite,
} from "../../redux/reducers/favouriteSlice";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Heart } from "lucide-react";

const FavouritesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { favourites } = useSelector((state: RootState) => state.favourites);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
      >
        ★
      </span>
    ));

  if (!user)
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300 text-lg">
        Login to view your favourites
      </div>
    );

  if (favourites.length === 0)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
        <Header />
        <div className="flex-1 p-6 text-center text-gray-700 dark:text-gray-300 text-xl">
          No favourite products yet.
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-indigo-600 dark:text-indigo-400 mb-8 hover:underline font-medium text-lg"
        >
          <span className="text-3xl mr-2 font-bold">←</span> Back Home
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Your Favourites
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favourites.map((fav) => {
            const product = fav.product;
            const isOwner = user?.id === product.sellerId;
            const whatsappLink =
              !isOwner && product.seller?.whatsappNumber
                ? `https://wa.me/${product.seller.whatsappNumber}?text=${encodeURIComponent(
                    `Hello ${product.seller.fullName}, my name is ${user.fullName}. I came across your product "${product.title}" and I'm interested.`
                  )}`
                : null;

            return (
              <div
                key={fav.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-2xl dark:hover:shadow-gray-900 transition-all duration-300 overflow-hidden group relative"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                    {product.quickSale && product.status !== "sold" && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse z-10">
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
                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 font-medium">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-semibold truncate text-gray-900 dark:text-white">
                      {product.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
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

                    <div className="mt-4">
                      {product.discountPrice ? (
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-red-600 dark:text-red-500">
                            KSH {product.discountPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            KSH {product.price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          KSH {product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="mt-5 text-gray-800 dark:text-gray-200">
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
                  </div>
                </Link>

                {/* Favourite Button */}
                <div className="absolute top-3 right-3 z-20">
                  {user && !isOwner && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const isFav = favourites.some(
                          (f) => f.productId === product.id
                        );
                        if (isFav) {
                          dispatch(removeFavourite(product.id));
                        } else {
                          dispatch(addFavourite(product.id));
                        }
                      }}
                      className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all"
                    >
                      <Heart
                        size={24}
                        className={
                          favourites.some((f) => f.productId === product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      />
                    </button>
                  )}
                </div>

                {/* Contact Seller */}
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavouritesPage;