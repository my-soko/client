import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RouteControl from "../Map/RouteControl";
import type { Shop } from "../../types/Shops";
import RatingStars from "../Review/RatingStars";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  shop: Shop;
  userLocation?: { lat: number; lng: number };
}

// Calculate distance in km
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const ProductShopMap: React.FC<Props> = ({ shop, userLocation }) => {
  const shopPosition = { lat: shop.latitude, lng: shop.longitude };
  const [distance, setDistance] = useState<number | null>(null);
  const [selectedShop, setSelectedShop] = useState(shopPosition);

  useEffect(() => {
    if (userLocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDistance(
        Number(
          calculateDistance(
            userLocation.lat,
            userLocation.lng,
            shop.latitude,
            shop.longitude
          ).toFixed(2)
        )
      );
    }
  }, [userLocation, shop]);

  return (
    <div className="h-[80vh] w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer center={shopPosition} zoom={18} className="h-full w-full">
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Shop Marker */}
        <Marker
          position={shopPosition}
          eventHandlers={{
            click: () => setSelectedShop(shopPosition),
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} permanent>
            {shop.name}
          </Tooltip>

          <Popup>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">{shop.name}</h3>
              <p className="text-sm">{shop.description}</p>
              <p className="text-sm">{shop.address}</p>
              {shop.phone && (
                <p className="text-xs">
                  <b>Phone:</b> {shop.phone}
                </p>
              )}
              {shop.email && (
                <p className="text-xs">
                  <b>Email:</b> {shop.email}
                </p>
              )}

              {userLocation && distance && (
                <p className="text-xs mt-1">
                  Distance: <b>{distance} km</b>
                </p>
              )}

              {typeof shop.averageRating === "number" && (
                <div className="flex items-center gap-1 text-xs">
                  <RatingStars rating={shop.averageRating} size="sm" />
                  <span className="text-gray-500">
                    ({shop.totalReviews ?? 0} reviews)
                  </span>
                </div>
              )}

              <p className="text-xs">
                {shop.isVerified ? "✅ Verified" : "⚠️ Not Verified"}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* User Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {/* Route */}
        {userLocation && selectedShop && (
          <RouteControl from={userLocation} to={selectedShop} />
        )}
      </MapContainer>
    </div>
  );
};

export default ProductShopMap;
