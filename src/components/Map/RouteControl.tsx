// src/components/Map/RouteControl.tsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from  "leaflet";
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
      show: false, 
      lineOptions: {
        styles: [{ color: "#e546e5ff", weight: 5 }],
      },
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [from, to, map]);

  return null;
};

export default RouteControl;
