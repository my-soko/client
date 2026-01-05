import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface Props {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
}

const RouteControl: React.FC<Props> = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,                    // ← THIS hides the instructions panel!
      createMarker: () => null,       // No waypoint markers
      showAlternatives: false,
      fitSelectedRoutes: false,       // Don't auto-zoom to fit route
      lineOptions: {
        styles: [{ color: "#e546e5", weight: 6, opacity: 0.8 }],
      },
      // Optional: customize router if needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router: new (L as any).Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(map);

    // Cleanup on unmount or when selection changes
    return () => {
      if (map.hasLayer(routingControl)) {
        map.removeControl(routingControl);
      }
    };
  }, [from, to, map]);

  return null;
};

export default RouteControl;