import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../../redux/reducers/productReducer";
import type { AppDispatch, RootState } from "../../redux/store";
import ProductReviews from "../Review/ProductReviews";
import { formatDate } from "../../util/FormDate";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { usePlacesAutocomplete } from "../../hooks/usePlacesAutocomplete";
import RouteControl from "../Map/RouteControl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentProduct, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [customLocation, setCustomLocation] = useState<string>(""); // New input for custom location

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const inputRef = usePlacesAutocomplete((place) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setUserLocation({ lat, lng });

      if (currentProduct?.latitude && currentProduct?.longitude) {
        const d = calculateDistance(
          lat,
          lng,
          currentProduct.latitude,
          currentProduct.longitude
        );
        setDistanceKm(parseFloat(d.toFixed(2)));
      }
    }
  }, true);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      if (currentProduct?.latitude && currentProduct?.longitude) {
        const d = calculateDistance(
          latitude,
          longitude,
          currentProduct.latitude,
          currentProduct.longitude
        );
        setDistanceKm(parseFloat(d.toFixed(2)));
      }
    });
  };

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

  const hasLocation =
    currentProduct.latitude != null && currentProduct.longitude != null;

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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentProduct.title}
                </h1>
                <div className="flex flex-wrap gap-3 mb-6">
                  {currentProduct.quickSale && !isSold && (
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
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  {currentProduct.description}
                </p>
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
                <div className="gap-8 pb-6">
                  {hasLocation && (
                    <div className="mb-8 h-80 w-full rounded-xl overflow-hidden shadow-lg">
                      <div className="mb-5">
                        <span className="text-gray-300 font-semibold text-xl">
                          Shop's Physical Location
                        </span>
                      </div>
                      <MapContainer
                        center={[
                          currentProduct.latitude!,
                          currentProduct.longitude!,
                        ]}
                        zoom={16}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution="&copy; OpenStreetMap contributors"
                        />

                        {/* Shop marker */}
                        <Marker
                          position={[
                            currentProduct.latitude!,
                            currentProduct.longitude!,
                          ]}
                        >
                          <Popup>{currentProduct.title}</Popup>
                        </Marker>

                        {/* User marker */}
                        {userLocation && (
                          <Marker
                            position={[userLocation.lat, userLocation.lng]}
                          >
                            <Popup>Your location</Popup>
                          </Marker>
                        )}

                        {/* Route line */}
                        {userLocation && (
                          <RouteControl
                            from={userLocation}
                            to={{
                              lat: currentProduct.latitude!,
                              lng: currentProduct.longitude!,
                            }}
                          />
                        )}
                      </MapContainer>
                    </div>
                  )}
                </div>

                {hasLocation && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">
                      Get Distance & Directions
                    </h2>

                    {/* Use Current Location */}
                    <button
                      onClick={handleUseMyLocation}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-indigo-700 transition"
                    >
                      Use My Current Location
                    </button>

                    {/* Or Enter Custom Location */}
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        ref={inputRef}
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        placeholder="Enter a starting location"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800"
                      />
                    </div>

                    {/* Distance Display */}
                    {distanceKm !== null && (
                      <p className="mt-2 text-gray-700 dark:text-gray-300">
                        Distance from your location:{" "}
                        <strong>{distanceKm} km</strong>
                      </p>
                    )}
                  </div>
                )}

                {/* Contact / Owner */}
                {!isOwner && (
                  <button
                    onClick={handleWhatsAppClick}
                    disabled={isSold}
                    className={`w-full py-4 rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-105 ${
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
                  <div className="bg-blue-100 dark:bg-blue-900/40 border border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-center font-semibold">
                    This is your listing
                  </div>
                )}

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
