"use client";

import { useState, useCallback, useMemo } from "react";
import GoogleMap, { GoogleMapInstance } from "@/components/GoogleMap";
import MapPolygon, { Polygon } from "@/components/MapPolygon";
import MapDirectionBetweenLocations from "@/components/MapDirectionBetweenLocations";
import Document from "@/components/Document";

export default function Home() {
  const [mapInstance, setMapInstance] = useState<GoogleMapInstance | null>(
    null
  );
  const [currentPolygon, setCurrentPolygon] = useState<Polygon>({
    coordinates: [],
  });

  const handleMapReady = useCallback((instance: GoogleMapInstance) => {
    setMapInstance(instance);
  }, []);

  const handleUpdatePolygon = useCallback(
    (areas: Record<string, number>[][]) => {
      setCurrentPolygon((prev) => ({
        ...prev,
        coordinates: areas,
      }));
    },
    []
  );

  const googleMapsInstance = useMemo(() => {
    if (!mapInstance) return null;
    return { map: mapInstance.map, maps: mapInstance.google.maps };
  }, [mapInstance]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-2">
          Google Maps Integration
        </h1>
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <GoogleMap onMapReady={handleMapReady} zoom={2}>
              {googleMapsInstance && (
                <>
                  <MapPolygon
                    google={googleMapsInstance}
                    currentPolygon={currentPolygon}
                    updatePolygon={handleUpdatePolygon}
                  />
                  <MapDirectionBetweenLocations
                    google={googleMapsInstance}
                    showWalkingDirections={true}
                  />
                </>
              )}
            </GoogleMap>
          </div>
        </section>
        <section>
          <Document />
        </section>
      </div>
    </main>
  );
}
