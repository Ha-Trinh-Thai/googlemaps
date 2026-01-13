"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleMapInstance {
  map: any;
  google: any;
}

interface GoogleMapProps {
  onMapReady?: (mapInstance: GoogleMapInstance) => void;
  children?: ReactNode;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export default function GoogleMap({
  onMapReady,
  children,
  center = { lat: 1.3521, lng: 103.8198 }, // Singapore coordinates
  zoom = 12,
  className = "w-full h-[600px]",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  // Load Google Maps Script with Drawing library
  useEffect(() => {
    if (window.google) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,drawing`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = (error) => {
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map after script is loaded
  useEffect(() => {
    if (!scriptLoaded || !mapRef.current) {
      return;
    }

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        gestureHandling: "greedy", // Enable smooth zoom
      });

      setMap(mapInstance);
      setIsLoading(false);

      if (onMapReady) {
        onMapReady({
          map: mapInstance,
          google: window.google,
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
  }, [scriptLoaded]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Loading Google Maps...</p>
            <p className="text-xs text-gray-500">
              Script loaded: {scriptLoaded ? "Yes" : "No"}
            </p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className={className}
        style={{
          minHeight: "600px",
          transition: "all 0.3s ease-in-out",
        }}
      />
      {map && scriptLoaded && children}
    </div>
  );
}
