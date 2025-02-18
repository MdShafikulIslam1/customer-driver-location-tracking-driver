/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ILocation } from "@/types";
import {
  getDistanceFromRoute,
  getRouteLatLngs,
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

const customerPosition = {
  lat: 23.858334,
  lng: 90.26667,
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
  const mapRef = useRef<google.maps.Map | null>(null);

  console.log("customer location in map component", customerLocation);

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 23.685,
    lng: 90.3563,
  });

  // const onLoad = (map: google.maps.Map) => {
  //   mapRef.current = map;
  //   const bounds = new window.google.maps.LatLngBounds();
  //   bounds.extend(driverLocation);
  //   bounds.extend(customerPosition);
  //   map.fitBounds(bounds);
  // };

  const calculateRoute = () => {
    if (!isLoaded || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: driverLocation as ILocation, // নতুন ড্র্যাগকৃত লোকেশন
        destination: customerLocation as ILocation, // কাস্টমার অবস্থান
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("result", result);
          setDirections(result);
        } else {
          console.error("Directions request failed: " + status);
        }
      }
    );
  };

  useEffect(() => {
    if (customerLocation) {
      calculateRoute(); // ✅ কাস্টমার লোকেশন প্রথমবার সেট হলে কল হবে
    }
    driverLocationChanged(driverLocation); // ✅ ড্রাইভার লোকেশন চেঞ্জ হলে কল হবে
  }, [driverLocation, customerLocation]); // ✅ দুই ক্ষেত্রেই কল হবে

  const distance = getDistanceFromRoute(directions);
  const time = getTimeFromRoute(directions);
  const speed = getSpeedFromRoute(directions);
  // const steps = getDirectionsSteps(directions);

  const latAndlngs = getRouteLatLngs(directions)
  console.log(latAndlngs)

  return (
    <div className="bg-slate-200">
      {isLoaded ? (
        <GoogleMap
          // onLoad={onLoad}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          {/* নতুন রুট */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: { strokeColor: "#FF0000", strokeWeight: 5 },
                suppressMarkers: true,
              }}
            />
          )}
          {/* ড্রাইভার মার্কার */}
          <Marker
            opacity={1}
            zIndex={999}
            position={driverLocation}
            label={"Driver"}
            title="Driver's current location"
            draggable
            onDragEnd={(e) =>
              setDriverLocation({
                lat: e?.latLng?.lat() as number,
                lng: e.latLng?.lng() as number,
              })
            }
          />

          {/* কাস্টমার মার্কার */}
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

      {/* Directions Steps */}
      {/* <div className="mt-4 p-4 bg-white border rounded shadow-lg">
        <h3 className="font-semibold text-xl">Upcoming Directions:</h3>
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex items-start space-x-2 text-lg font-medium"
            >
              <span className="flex-none w-5 h-5 bg-blue-500 rounded-full text-white flex justify-center items-center">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{step.instruction}</div>
                <div className="text-gray-500 text-sm">
                  {step.distance} for {step.duration}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default MapComponent;
