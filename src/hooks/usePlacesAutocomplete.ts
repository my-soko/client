import { useEffect, useRef } from "react";

export const usePlacesAutocomplete = (
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void,
  enabled: boolean
) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!enabled || !window.google || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["formatted_address", "geometry"],
        types: ["establishment", "geocode"],
        componentRestrictions: { country: "KE" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelect(place);
      }
    });
  }, [enabled, onPlaceSelect]);

  return inputRef;
};
