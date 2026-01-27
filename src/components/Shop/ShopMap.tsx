import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchAllShops } from "../../redux/reducers/shopSlice";
import RouteControl from "../Map/RouteControl";
import { makeSelectShopsByProductCategory } from "../../redux/selectors/shopSelectors";

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
  selectedCategory?: string;
  userLocation?: { lat: number; lng: number };
}

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

const ShopMap: React.FC<Props> = ({ selectedCategory, userLocation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedShop, setSelectedShop] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchAllShops());
  }, [dispatch]);

  // Use the category selector
  const selectShopsByCategory = makeSelectShopsByProductCategory();
  const shops = useSelector((state: RootState) =>
    selectShopsByCategory(state, selectedCategory)
  );

  console.log("shops:", shops);

  const [distanceToShop, setDistanceToShop] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    if (!userLocation) return;

    const distances: Record<string, number> = {};
    shops.forEach((shop) => {
      distances[shop.id] = Number(
        calculateDistance(
          userLocation.lat,
          userLocation.lng,
          shop.latitude,
          shop.longitude
        ).toFixed(2)
      );
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDistanceToShop(distances);
  }, [shops, userLocation]);

return (
  <div className="h-[80vh] w-full rounded-xl overflow-hidden shadow-lg">
    <MapContainer
      center={userLocation || [-1.286389, 36.817223]}
      zoom={12}
      className="h-full w-full"
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* All shop markers */}
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.latitude, shop.longitude]}
          eventHandlers={{
            click: () => {
              setSelectedShop({
                lat: shop.latitude,
                lng: shop.longitude,
              });
            },
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
                    <span className="font-semibold">Phone:</span> {shop.phone}
                  </p>
                )}
                {shop.email && (
                  <p className="text-xs">
                    <span className="font-semibold">Email:</span> {shop.email}
                  </p>
                )}

                {(shop.products || []).length > 0 && (
                  <div className="mt-1">
                    <p className="text-xs font-semibold">Top products:</p>
                    <ul className="list-disc list-inside text-xs">
                      {(shop.products || []).slice(0, 5).map((product) => (
                        <li key={product.id}>
                          {product.title} – KES {product.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {userLocation && distanceToShop[shop.id] && (
                  <p className="text-xs mt-1">
                    Distance: <b>{distanceToShop[shop.id]} km</b>
                  </p>
                )}

                <p className="text-xs">
                  {shop.isVerified ? "✅ Verified" : "⚠️ Not Verified"}
                </p>
              </div>
            </Popup>
        </Marker>
      ))}

      {/* User's location marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your location</Popup>
        </Marker>
      )}

      {/* SINGLE RouteControl - only when a shop is selected */}
      {userLocation && selectedShop && (
        <RouteControl from={userLocation} to={selectedShop} />
      )}
    </MapContainer>
  </div>
);
};

export default ShopMap;
