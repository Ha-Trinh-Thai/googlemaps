"use client";

import { useEffect, useRef } from "react";

type MapDirectionBetweenLocationsProps = {
  google: {
    map: google.maps.Map;
    maps: typeof google.maps;
  };
  pinLat?: number;
  pinLng?: number;
  userLat?: number;
  userLng?: number;
  showWalkingDirections?: boolean;
};

const MapDirectionBetweenLocations: React.FC<
  MapDirectionBetweenLocationsProps
> = ({
  google,
  pinLat,
  pinLng,
  userLat,
  userLng,
  showWalkingDirections = true,
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );

  // Default: Pinned location at Marina Bay Sands
  const pinnedLat =
    pinLat ?? parseFloat(process.env.NEXT_PUBLIC_PIN_LAT || "1.2834");

  const pinnedLng =
    pinLng ?? parseFloat(process.env.NEXT_PUBLIC_PIN_LONG || "103.8607");

  // Default: User location at Gardens by the Bay (about 800m walk from Marina Bay Sands)
  const currentUserLat = userLat ?? 1.2816;
  const currentUserLng = userLng ?? 103.8636;

  useEffect(() => {
    if (!google?.map || !google?.maps) return;

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        position: { lat: pinnedLat, lng: pinnedLng },
        map: google.map,
        title: "Pinned Location",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new google.maps.Size(40, 40),
        },
        animation: google.maps.Animation.DROP,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 5px; color: #333;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Pinned Location</h3>
            <p style="margin: 0; font-size: 14px;">Lat: ${pinnedLat.toFixed(
              6
            )}</p>
            <p style="margin: 0; font-size: 14px;">Lng: ${pinnedLng.toFixed(
              6
            )}</p>
          </div>
        `,
      });

      markerRef.current.addListener("click", () => {
        infoWindow.open(google.map, markerRef.current);
      });
    }

    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.Marker({
        position: { lat: currentUserLat, lng: currentUserLng },
        map: google.map,
        title: "Your Location",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      const userInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 5px; color: #333;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Your Location</h3>
            <p style="margin: 0; font-size: 14px;">Lat: ${currentUserLat.toFixed(
              6
            )}</p>
            <p style="margin: 0; font-size: 14px;">Lng: ${currentUserLng.toFixed(
              6
            )}</p>
          </div>
        `,
      });

      userMarkerRef.current.addListener("click", () => {
        userInfoWindow.open(google.map, userMarkerRef.current);
      });
    }

    if (showWalkingDirections) {
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: google.map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#4285F4",
            strokeWeight: 5,
            strokeOpacity: 0.7,
          },
        });
      }

      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: currentUserLat, lng: currentUserLng },
          destination: { lat: pinnedLat, lng: pinnedLng },
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result);

            // Get distance and duration
            const route = result.routes[0];
            if (route?.legs[0]) {
              const leg = route.legs[0];
              console.log(
                `Walking distance: ${leg.distance?.text}, Duration: ${leg.duration?.text}`
              );
            }
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }

    // Fit map bounds to show both markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: pinnedLat, lng: pinnedLng });
    bounds.extend({ lat: currentUserLat, lng: currentUserLng });
    google.map.fitBounds(bounds);

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
    };
  }, [
    google,
    pinnedLat,
    pinnedLng,
    currentUserLat,
    currentUserLng,
    showWalkingDirections,
  ]);

  return null;
};
export default MapDirectionBetweenLocations;
