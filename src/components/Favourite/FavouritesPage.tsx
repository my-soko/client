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
        className={i < rating ? "text-yellow-500" : "text-gray-300"}
      >
        ★
      </span>
    ));

  if (!user)
    return <p className="p-6 text-center">Login to view your favourites</p>;

  if (favourites.length === 0)
    return (
      <div>
        <Header />
        <div className="p-6 text-center text-gray-700 text-lg">
          No favourite products yet.
        </div>
        <Footer />
      </div>
    );

  return (
    <div>
      <Header />
      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-600 mb-6"
        >
          <span className="text-2xl mr-1 font-bold hover:underline">
            ← Back Home
          </span>
        </button>

        <h1 className="text-2xl font-bold mb-6">Your Favourites</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favourites.map((fav) => {
            const product = fav.product;
            const isOwner = user?.id === product.sellerId;
            const whatsappLink =
              !isOwner && product.seller?.whatsappNumber
                ? `https://wa.me/${
                    product.seller.whatsappNumber
                  }?text=${encodeURIComponent(
                    `Hello ${product.seller.fullName}, my name is ${user.fullName}. I came across your product "${product.title}" and I'm interested.`
                  )}`
                : null;

            return (
              <div
                key={fav.id}
                className="bg-white border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    {product.quickSale && product.status !== "sold" && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                        🔥 Quick Sale
                      </span>
                    )}
                    {product.status === "sold" && (
                      <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        ❌ Sold
                      </span>
                    )}
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full mt-2 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold truncate">
                      {product.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    {product.averageRating !== undefined && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex text-lg">
                          {renderStars(Math.round(product.averageRating))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.totalReviews || 0})
                        </span>
                      </div>
                    )}

                    <div className="mt-3">
                      {product.discountPrice ? (
                        <div className="flex flex-col">
                          <span className="text-red-600 font-extrabold text-lg">
                            KSH {product.discountPrice.toLocaleString()}
                          </span>
                          <span className="text-gray-500 line-through text-sm">
                            KSH {product.price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-indigo-600 font-extrabold text-lg">
                          KSH {product.price}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-gray-800 text-lg">
                      <span className="font-semibold">Stock:</span>{" "}
                      {product.stockInCount > 0 ? (
                        <span className="text-green-600 font-semibold">
                          {product.stockInCount} available
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Out of stock
                        </span>
                      )}
                    </p>
                  </div>
                </Link>

                {/* Favourite Button */}
                <div className="absolute top-3 right-3 z-20">
                  {isOwner && user && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const isFav = favourites.some(
                          (f) => f.productId === product.id
                        );
                        if (isFav) {
                          dispatch(removeFavourite(product.id));
                        } else {
                          dispatch(addFavourite(product.id));
                        }
                      }}
                      className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
                    >
                      <Heart
                        size={24}
                        className={`transition ${
                          favourites.some((f) => f.productId === product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500"
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Contact Seller */}
                <div className="p-4 flex flex-col gap-2">
                  {!isOwner && (
                    <button
                      onClick={() => {
                        if (!user) {
                          navigate("/login");
                          return;
                        }
                        if (whatsappLink) window.open(whatsappLink, "_blank");
                      }}
                      className={`px-4 py-2 rounded-lg text-center shadow transition ${
                        user
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-600"
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
