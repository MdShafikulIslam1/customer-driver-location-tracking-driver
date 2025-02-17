"use client";

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

const MapComponent = () => {
  const isLoaded = useGoogleMapsLoader();
  const mapRef = useRef(null);

  const [directions, setDirections] = useState(null);
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 23.685,
    lng: 90.3563,
  });

  const onLoad = (map) => {
    mapRef.current = map;

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(driverLocation);
    bounds.extend(customerPosition);
    map.fitBounds(bounds);
  };

  const calculateRoute = () => {
    if (!isLoaded || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: driverLocation, // নতুন ড্র্যাগকৃত লোকেশন
        destination: customerPosition, // কাস্টমার অবস্থান
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
    calculateRoute(); // ড্রাইভারের লোকেশন চেঞ্জ হলে নতুন রুট জেনারেট করবো
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverLocation]); // যখনই ড্রাইভার লোকেশন পরিবর্তন হবে, নতুন রুট তৈরি হবে

  const getDistanceFromRoute = (directions) => {
    if (directions) {
      const route = directions.routes[0];
      const distance = route.legs[0].distance.text;
      return distance;
    }
    return null;
  };

  const getTimeFromRoute = (directions) => {
    if (directions) {
      const route = directions.routes[0];
      const time = route.legs[0].duration.text;
      return time;
    }
    return null;
  };

  const getSpeedFromRoute = (directions) => {
    if (directions) {
      const route = directions.routes[0];
      const distanceInKm = route.legs[0].distance.value / 1000; // in kilometers
      const durationInMinutes = route.legs[0].duration.value / 60; // in minutes
      const speed = distanceInKm / (durationInMinutes / 60); // speed in km/h
      return speed.toFixed(2); // speed in km/h
    }
    return null;
  };

  // Extract directions steps (turn by turn instructions)
  const getDirectionsSteps = (directions) => {
    if (directions) {
      const steps = directions.routes[0].legs[0].steps;
      return steps.map((step, index) => ({
        instruction: step.instructions,
        distance: step.distance.text,
        duration: step.duration.text,
      }));
    }
    return [];
  };

  const distance = getDistanceFromRoute(directions);
  const time = getTimeFromRoute(directions);
  const speed = getSpeedFromRoute(directions);
  const steps = getDirectionsSteps(directions);

  return (
    <div className="bg-slate-200">
      {isLoaded ? (
        <GoogleMap
          onLoad={onLoad}
          mapContainerStyle={containerStyle}
          center={driverLocation}
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

          {distance && <div>Distance: {distance}</div>}

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
          <Marker
            opacity={1}
            zIndex={999}
            position={customerPosition}
            label={"Customer"}
            title="Customer's current location"
          />
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
