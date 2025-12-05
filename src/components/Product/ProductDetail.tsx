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
    if (currentProduct) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMainImage(currentProduct.imageUrl);
    }
  }, [currentProduct]);

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!currentProduct)
    return <p className="text-center mt-10">Product not found.</p>;

  const isOwner = user?.id === currentProduct.sellerId;

 const whatsappLink =
  user && !isOwner && currentProduct.seller?.whatsappNumber
    ? `https://wa.me/${currentProduct.seller.whatsappNumber}?text=${encodeURIComponent(
        `Hello ${currentProduct.seller.fullName}, my name is ${user.fullName}. I saw your product "${currentProduct.title}" listed and I'm very interested in it. Could you please provide more details or confirm if it's still available? Thank you!`
      )}`
    : null;


  const handleWhatsAppClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (whatsappLink) window.open(whatsappLink, "_blank");
  };


  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-xl border border-gray-200">
      <Link
        to="/"
        className="inline-block mb-4 text-indigo-600 hover:text-indigo-800 font-medium"
      >
        &larr; Back to All Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT IMAGES */}
        <div>
          <div className="w-full h-[420px] bg-gray-100 rounded-xl overflow-hidden shadow-md flex justify-center items-center">
            <img
              src={mainImage || currentProduct.imageUrl}
              alt={currentProduct.title}
              className="w-full h-full object-contain transition-all duration-300"
            />
          </div>

          {currentProduct.images?.length > 0 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {[currentProduct.imageUrl, ...currentProduct.images].map(
                (img, index) => (
                  <button
                    key={index}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                      mainImage === img ? "border-indigo-600" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover hover:opacity-75 transition"
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {currentProduct.title}
          </h1>

          <p className="mt-3 text-gray-600 text-lg">{currentProduct.description}</p>

          {/* PRICES */}
          <div className="mt-4">
            {currentProduct.discountPrice ? (
              <>
                <p className="text-3xl font-bold text-green-600">
                  KSH {currentProduct.discountPrice.toLocaleString()}
                </p>
                <p className="text-gray-500 line-through mt-1">
                  KSH {currentProduct.price.toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-indigo-600">
                KSH {currentProduct.price.toLocaleString()}
              </p>
            )}
          </div>

          {/* STOCK */}
          <p className="mt-3 text-gray-800 text-lg">
            <span className="font-semibold">Stock:</span>{" "}
            {currentProduct.stockInCount > 0 ? (
              <span className="text-green-600 font-semibold">
                {currentProduct.stockInCount} available
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Out of stock</span>
            )}
          </p>

          {/* <p className="mt-3 text-gray-500">
            <span className="font-semibold">Category:</span>{" "}
            {currentProduct.category}
          </p> */}

          <p className="mt-1 text-gray-500">
            <span className="font-semibold">Seller:</span>{" "}
            {currentProduct.seller.fullName}
          </p>

          {/* WhatsApp contact */}
          {!isOwner && (
            <button
              onClick={handleWhatsAppClick}
              className={`mt-6 inline-block px-5 py-3 rounded-lg font-semibold shadow-md transition ${
                user
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {user ? "Contact via WhatsApp" : "Login to Contact Seller"}
            </button>
          )}
          <ProductReviews productId={currentProduct.id} userId={user?.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
