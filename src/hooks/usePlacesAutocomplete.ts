import { useEffect, useRef } from "react";

const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject("Failed to load Google Maps");

    document.head.appendChild(script);
  });
};

export const usePlacesAutocomplete = (
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void,
  enabled: boolean
) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!enabled || !inputRef.current) return;

    let autocomplete: google.maps.places.Autocomplete;

    loadGoogleMaps()
      .then(() => {
        if (!inputRef.current) return;

        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ["formatted_address", "geometry"],
          types: ["establishment", "geocode"],
          componentRestrictions: { country: "KE" },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            onPlaceSelect(place);
          }
        });
      })
      .catch(console.error);

    return () => {
      // cleanup listeners if needed later
    };
  }, [enabled, onPlaceSelect]);

  return inputRef;
};
