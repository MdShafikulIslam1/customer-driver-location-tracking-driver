/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const MovingMarker = ({
  latsAndLngs,
}: {
  latsAndLngs: { lat: number; lng: number }[];
}) => {

  const [movingMarkerPosition, setMovingMarkerPosition] = useState<any | null>(
    null
  );

  const [currentPosition, setCurrentPosition] = useState<any | null>(null);
  console.log({ currentPosition });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by this browser.");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords;
        console.log("object",latitude,longitude, speed);
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true, // Use GPS if available
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
    // if (latsAndLngs?.length === 0) return;

    // let currentIndex = 0; // Start from the first point

    // const interval = setInterval(() => {
    //   if (currentIndex < latsAndLngs.length) {
    //     const updatedLatLng = latsAndLngs[currentIndex];

    //     // Update the position of the origin marker
    //     setMovingMarkerPosition(updatedLatLng);

    //     currentIndex++;
    //   } else {
    //     clearInterval(interval); // Stop once we reach the end of the path
    //   }
    // }, 500);

    // return () => clearInterval(interval);
  }, [latsAndLngs]);
  return (
    <div>
      {movingMarkerPosition && (
        <Marker
          position={movingMarkerPosition} // Update the position dynamically
          label="Origin"
        />
      )}

      {/*{currentPosition && <Marker position={currentPosition} label="You" />}*/}
    </div>
  );
};

export default MovingMarker;
