import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectShopsFromProducts } from "../../redux/selectors/shopSelectors";
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

interface Props {
  selectedCategory: string;
}

const ShopMap: React.FC<Props> = ({ selectedCategory }) => {

  
  const shops = useSelector(selectShopsFromProducts);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distanceToShop, setDistanceToShop] = useState<Record<string, number>>(
    {}
  );

  const visibleShops = selectedCategory
    ? shops.filter((shop) =>
        shop.categories.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    : shops;

  // Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // km
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

  const updateDistances = (location: { lat: number; lng: number }) => {
    const distances: Record<string, number> = {};
    visibleShops.forEach((shop) => {
      distances[shop.shopName] = parseFloat(
        calculateDistance(
          location.lat,
          location.lng,
          shop.latitude,
          shop.longitude
        ).toFixed(2)
      );
    });
    setDistanceToShop(distances);
  };

  useEffect(() => {
    const handleUseMyLocation = () => {
      if (!navigator.geolocation) return alert("Geolocation not supported");
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        updateDistances(loc);
      });
    };

    const handleSetCustomLocation = async (event: CustomEvent<string>) => {
      const query = event.detail;
      if (!query) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        if (data && data[0]) {
          const loc = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          };
          setUserLocation(loc);
          updateDistances(loc);
        } else {
          alert("Location not found");
        }
      } catch {
        alert("Failed to fetch location");
      }
    };

    const handleUpdateUserLocation = (
      event: CustomEvent<{ lat: number; lng: number }>
    ) => {
      setUserLocation(event.detail);
      updateDistances(event.detail);
    };

    window.addEventListener(
      "useMyLocation",
      handleUseMyLocation as EventListener
    );
    window.addEventListener(
      "setCustomLocation",
      handleSetCustomLocation as unknown as EventListener
    );
    window.addEventListener(
      "updateUserLocation",
      handleUpdateUserLocation as EventListener
    );

    return () => {
      window.removeEventListener(
        "useMyLocation",
        handleUseMyLocation as EventListener
      );
      window.removeEventListener(
        "setCustomLocation",
        handleSetCustomLocation as unknown as EventListener
      );
      window.removeEventListener(
        "updateUserLocation",
        handleUpdateUserLocation as EventListener
      );
    };
  }, [visibleShops]);

  return (
    <div className="h-[80vh] w-full mb-7 rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={userLocation || [-1.286389, 36.817223]}
        zoom={12}
        className="h-full w-full"
        key={
          userLocation ? `${userLocation.lat}-${userLocation.lng}` : "default"
        }
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {visibleShops.map((shop) => (
          <Marker
            key={`${shop.shopName}-${shop.latitude}`}
            position={[shop.latitude, shop.longitude]}
          >
            <Tooltip direction="top" offset={[0, -10]} permanent>
              {shop.shopName}
            </Tooltip>
            <Popup>
              <div className="space-y-1">
                <h3 className="font-bold">{shop.shopName}</h3>
                <p className="text-sm">{shop.shopAddress}</p>
                <p className="text-xs">
                  Product Category:{" "}
                  <strong>{shop.categories.join(", ")}</strong>
                </p>
                <p className="text-xs">
                  Products in stock: <strong>{shop.totalStock}</strong>
                </p>

                {userLocation && distanceToShop[shop.shopName] && (
                  <p className="text-xs mt-1">
                    Distance from you:{" "}
                    <strong>{distanceToShop[shop.shopName]} km</strong>
                  </p>
                )}
              </div>
            </Popup>

            {userLocation && (
              <RouteControl
                from={userLocation}
                to={{ lat: shop.latitude, lng: shop.longitude }}
              />
            )}
          </Marker>
        ))}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default ShopMap;
