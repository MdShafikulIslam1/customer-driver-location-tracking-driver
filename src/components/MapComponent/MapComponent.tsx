/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ILocation } from "@/types";
import {
  calculateRoute,
  getDistanceFromRoute,
  getSpeedFromRoute,
  getTimeFromRoute,
} from "@/utils";
import { useGoogleMapsLoader } from "@/utils/googleApiLoader";
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "600px",
};
const center = { lat: 23.7666304, lng: 90.4134656 }; // Dhaka, Bangladesh

const MapComponent = ({
  driverLocationChanged,
  customerLocation,
}: {
  driverLocationChanged: (driverLocation: any) => void;
  customerLocation: ILocation | null;
}) => {
  const isLoaded = useGoogleMapsLoader();
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [driverLocation, setDriverLocation] = useState<ILocation>({
    lat: 23.685,
    lng: 90.3563,
  });

  console.log("directions updated in real-time",directions)
  console.log("da location updated in real-time",driverLocation)

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Automatic driver location tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };

        console.log("watchPosition updated", newLocation);

        setDriverLocation(newLocation);
        driverLocationChanged(newLocation);

        // Prevent excessive API calls using debounce
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
          if (customerLocation) {
            calculateRoute(isLoaded, newLocation, customerLocation, setDirections);
          }
        }, 1000); // 1-second delay
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerLocation, isLoaded]);

  // Recalculate route when driverLocation or customerLocation changes
  useEffect(() => {
    if (customerLocation) {
      calculateRoute(isLoaded, driverLocation, customerLocation, setDirections);
    }
  }, [driverLocation, customerLocation, isLoaded]);

  const distance = getDistanceFromRoute(directions);
  const time = getTimeFromRoute(directions);
  const speed = getSpeedFromRoute(directions);

  return (
    <div className="bg-slate-200">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: { strokeColor: "#FF0000", strokeWeight: 5 },
                suppressMarkers: true,
              }}
            />
          )}
          <Marker
            opacity={1}
            zIndex={999}
            position={driverLocation}
            label={"Driver"}
            title="Driver's current location"
          />
          {customerLocation && (
            <Marker
              opacity={1}
              zIndex={999}
              position={customerLocation}
              label={"Customer"}
              title="Customer's current location"
            />
          )}
        </GoogleMap>
      ) : (
        <div>Loading Google Map...</div>
      )}

      {/* Distance Display */}
      <div className="mt-4 p-4 text-blue-900 bg-white border rounded">
        <h3>Distance between Driver and Customer:</h3>
        <p className="font-bold text-3xl">Distance: {distance}</p>
        <p className="font-bold text-3xl">Time: {time}</p>
        <p className="font-bold text-3xl">Speed: {speed} km/h</p>
      </div>
    </div>
  );
};

export default MapComponent;
