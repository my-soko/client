import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  deleteProduct,
  fetchProducts,
} from "../../redux/reducers/productReducer";

const AllProducts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    filteredProducts: products,
    loading,
    error,
  } = useSelector((state: RootState) => state.product);

  const { user } = useSelector((state: RootState) => state.auth);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-500" : "text-gray-300"}
      >
        ★
      </span>
    ));

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading)
    return <div className="text-center mt-10">Loading products...</div>;

  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* CREATE POST BUTTON */}
      <div className="flex justify-end mb-10">
        <Link
          to="/create"
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          + Create Post
        </Link>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const isOwner = user?.id === product.sellerId;

          // Construct WhatsApp link only if logged in + not owner
          const whatsappLink =
            user && !isOwner && product.seller?.whatsappNumber
              ? `https://wa.me/${
                  product.seller.whatsappNumber
                }?text=${encodeURIComponent(
                  `Hello ${product.seller.fullName}, my name is ${user.fullName}. I came across your product "${product.title}" and I'm very interested. Could you provide more details or let me know if it's still available? Thank you!`
                )}`
              : null;

          return (
            <div
              key={product.id}
              className="bg-white border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
            >
              <Link to={`/product/${product.id}`}>
                {/* IMAGE */}
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                  {/* QUICK SALE BADGE */}
                  {product.quickSale && product.status !== "sold" && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                      🔥 Quick Sale
                    </span>
                  )}

                  {/* SOLD BADGE */}
                  {product.status === "sold" && (
                    <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      ❌ Sold
                    </span>
                  )}

                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* TEXT INFO */}
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
                          KSH {product.discountPrice}
                        </span>

                        <span className="text-gray-500 line-through text-sm">
                          KSH {product.price}
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

              {/* ACTION SECTION */}
              <div className="p-4 flex flex-col gap-2">
                {/* CONTACT SELLER */}
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

                {/* OWNER MENU */}
                {/* OWNER MENU ICON (top right corner) */}
                {isOwner && (
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === product.id ? null : product.id
                        )
                      }
                      className="p-2 bg-white/90 backdrop-blur-sm shadow-md rounded-full hover:bg-gray-100"
                    >
                      ⋮
                    </button>

                    {openMenuId === product.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border shadow-xl rounded-lg overflow-hidden">
                        <Link
                          to={`/edit/${product.id}`}
                          className="block px-4 py-2 text-yellow-600 hover:bg-gray-100"
                        >
                          ✏️ Edit
                        </Link>

                        <button
                          onClick={() => dispatch(deleteProduct(product.id))}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllProducts;
