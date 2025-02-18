import polyline from "@mapbox/polyline";
export const getDistanceFromRoute = (
  directions: google.maps.DirectionsResult | null
) => {
  if (directions) {
    const route = directions?.routes[0];
    const distance = route?.legs[0]?.distance?.text;
    return distance;
  }
  return null;
};

export const getTimeFromRoute = (
  directions: google.maps.DirectionsResult | null
) => {
  if (directions) {
    const route = directions.routes[0];
    const time = route?.legs[0]?.duration?.text;
    return time;
  }
  return null;
};

export const getSpeedFromRoute = (
  directions: google.maps.DirectionsResult | null
) => {
  if (directions) {
    const route = directions?.routes[0];
    const distanceInKm = (route?.legs[0]?.distance?.value as number) / 1000; // in kilometers
    const durationInMinutes = (route?.legs[0]?.duration?.value as number) / 60; // in minutes
    const speed = distanceInKm / (durationInMinutes / 60); // speed in km/h
    return speed.toFixed(2); // speed in km/h
  }
  return null;
};

export const getDirectionsSteps = (
  directions: google.maps.DirectionsResult | null
) => {
  if (directions) {
    const steps = directions.routes[0].legs[0].steps;
    return steps.map((step) => ({
      instruction: step.instructions,
      distance: step?.distance?.text,
      duration: step?.duration?.text,
    }));
  }
  return [];
};

export const getRouteLatLngs = (
  directions: google.maps.DirectionsResult | null
) => {
  console.log("get lat and lngs from ", directions);
  if (!directions) return [];

  const route = directions?.routes[0];
  const decodedPoints: { lat: number; lng: number }[] = [];

  route?.legs?.forEach((leg) => {
    leg?.steps?.forEach((step) => {
      const polylinePoints = step?.polyline?.points;

      // Check if polylinePoints is defined before decoding
      if (polylinePoints) {
        const decodedStep = polyline.decode(polylinePoints);
        decodedPoints.push(
          ...decodedStep.map((point) => ({ lat: point[0], lng: point[1] }))
        );
      }
    });
  });

  return decodedPoints;
};
