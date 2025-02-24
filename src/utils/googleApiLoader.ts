import { useJsApiLoader } from "@react-google-maps/api";

// Utility function to load Google Maps API
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
  "geometry",
];
export const useGoogleMapsLoader = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY as string, // Replace with your API key
    libraries,
  });
  return isLoaded;
};
