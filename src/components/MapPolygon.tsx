"use client";

import { Button, styled, ThemeProvider, createTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PanToolAltOutlinedIcon from "@mui/icons-material/PanToolAltOutlined";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// Create a simple theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      dark: "#115293",
    },
    error: {
      main: "#d32f2f",
      dark: "#c62828",
    },
  },
});

export type Polygon = {
  coordinates: Record<string, number>[][];
};

type MapPolygonProps = {
  google: any;
  currentPolygon: Polygon;
  updatePolygon: (areas: Record<string, number>[][]) => void;
};

const DrawingToolContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 16,
  left: 16,
  display: "flex",
}));

const StyledDeleteButton = styled(Button)(({ theme }) => ({
  background: theme.palette.error.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));

const StyledMoveButton = styled(Button)(({ theme }) => ({
  background: theme.palette.common.white,
  color: theme.palette.common.black,
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
}));

const StyledDrawButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const MapPolygon: React.FC<MapPolygonProps> = ({
  google,
  currentPolygon,
  updatePolygon,
}) => {
  const [myDrawingManager, setMyDrawingManager] = useState<
    google.maps.drawing.DrawingManager | undefined
  >(undefined);

  const myPolygonRef = useRef<
    { id: string; coords: google.maps.LatLngLiteral[] }[]
  >([]);
  const currentPolygonsRef = useRef<google.maps.Polygon[]>([]);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (google?.map && google?.maps && !myDrawingManager) {
      const { map, maps } = google;

      const newDrawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
          editable: true,
          draggable: true,
        },
      });
      newDrawingManager.setMap(map);
      drawingManagerRef.current = newDrawingManager;
      setMyDrawingManager(newDrawingManager);

      google.maps.event.addListener(
        newDrawingManager,
        "polygoncomplete",
        function (polygon: google.maps.Polygon) {
          // make sure the polygon is closed https://stackoverflow.com/questions/14189613/polygons-are-not-closed
          polygon.getPath().push(polygon.getPath().getAt(0));
          const thePath = polygon.getPath();
          const polygonId = Date.now().toString();
          console.log("Polygon created with ID:", polygonId);
          currentPolygonsRef.current.push(polygon);
          createPolygonHandler(thePath, polygonId);

          google.maps.event.addListener(polygon, "rightclick", () => {
            polygon.setMap(null);
            removePolygonHandler(polygonId);
          });

          google.maps.event.addListener(thePath, "set_at", function () {
            editPolygonHandler(thePath, polygonId);
          });

          google.maps.event.addListener(thePath, "insert_at", function () {
            editPolygonHandler(thePath, polygonId);
          });
        }
      );

      const controlDiv = document.createElement("div");
      const root = createRoot(controlDiv);

      root.render(
        <ThemeProvider theme={theme}>
          <DrawingToolContainer>
            <StyledDeleteButton onClick={clearPolygons}>
              <DeleteIcon />
            </StyledDeleteButton>
            <StyledMoveButton onClick={movePolygon}>
              <PanToolAltOutlinedIcon />
            </StyledMoveButton>
            <StyledDrawButton onClick={drawPolygon}>
              <EditIcon />
            </StyledDrawButton>
          </DrawingToolContainer>
        </ThemeProvider>
      );

      map.controls[maps.ControlPosition["TOP_LEFT"]].push(controlDiv);
    }

    return () => {};
  }, [google]);

  useEffect(() => {
    if (
      google?.maps &&
      currentPolygon.coordinates.length > 0 &&
      currentPolygon.coordinates[0].length > 0 &&
      !initializedRef.current
    ) {
      // If we already have polygons (from user drawing), skip this initialization
      if (myPolygonRef.current.length > 0) {
        initializedRef.current = true;
        return;
      }

      initializedRef.current = true;
      currentPolygon.coordinates.forEach((polygonCoords, idx) => {
        // Skip empty coordinate arrays
        if (!polygonCoords || polygonCoords.length === 0) {
          return;
        }

        const polygonArea = new google.maps.Polygon({
          paths: polygonCoords,
          editable: true,
          draggable: true,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillOpacity: 0.35,
        });
        polygonArea.setMap(google.map);

        const polygonPath = polygonArea.getPath();
        const polygonId = Date.now().toString() + idx.toString();

        currentPolygonsRef.current.push(polygonArea);

        if (polygonPath && typeof polygonPath.getArray === "function") {
          const points = polygonPath.getArray().map((p: google.maps.LatLng) => {
            return {
              lat: p.lat(),
              lng: p.lng(),
            };
          });
          myPolygonRef.current.push({ id: polygonId, coords: points });
        }

        google.maps.event.addListener(polygonArea, "rightclick", () => {
          polygonArea.setMap(null);
          removePolygonHandler(polygonId);
        });

        google.maps.event.addListener(polygonPath, "set_at", function () {
          editPolygonHandler(polygonPath, polygonId);
        });

        google.maps.event.addListener(polygonPath, "insert_at", function () {
          editPolygonHandler(polygonPath, polygonId);
        });
      });
    }

    return () => {};
  }, [google, currentPolygon.coordinates.length]);

  const removePolygonHandler = (polygonId: string) => {
    myPolygonRef.current = myPolygonRef.current.filter(
      (p) => p.id !== polygonId
    );

    updatePolygonHandler();
  };

  const createPolygonHandler = (
    polygonPath: google.maps.MVCArray<google.maps.LatLng>,
    polygonId: string
  ) => {
    // Safety check: ensure polygonPath is valid
    if (!polygonPath || typeof polygonPath.getArray !== "function") {
      console.warn("Invalid polygon path in createPolygonHandler");
      return;
    }

    const points = polygonPath.getArray().map((p) => {
      return {
        lat: p.lat(),
        lng: p.lng(),
      };
    });
    const polygonData = { id: polygonId, coords: points };
    myPolygonRef.current.push(polygonData);

    updatePolygonHandler();
  };

  const editPolygonHandler = (
    polygonPath: google.maps.MVCArray<google.maps.LatLng>,
    polygonId: string
  ) => {
    if (!polygonPath || typeof polygonPath.getArray !== "function") {
      return;
    }

    const points = polygonPath.getArray().map((p) => {
      return {
        lat: p.lat(),
        lng: p.lng(),
      };
    });
    // make sure the polygon is closed https://stackoverflow.com/questions/14189613/polygons-are-not-closed
    if (
      points[0].lat !== points[points.length - 1].lat ||
      points[0].lng !== points[points.length - 1].lng
    ) {
      points.push(points[0]);
    }
    myPolygonRef.current = myPolygonRef.current.map((p) =>
      p.id === polygonId ? { id: polygonId, coords: points } : p
    );
    updatePolygonHandler();
  };

  const updatePolygonHandler = () => {
    const polygonData = myPolygonRef.current.map((polygon) => polygon.coords);
    updatePolygon(polygonData as unknown as Record<string, number>[][]);
  };

  const clearPolygons = () => {
    // Remove polygons from map
    for (let k = 0; k < currentPolygonsRef.current.length; k++) {
      currentPolygonsRef.current[k].setMap(null);
    }
    currentPolygonsRef.current = [];
    myPolygonRef.current = [];
    initializedRef.current = false;
    updatePolygon([[]]);
  };

  const drawPolygon = () => {
    drawingManagerRef.current?.setDrawingMode(
      google.maps.drawing.OverlayType.POLYGON
    );
  };

  const movePolygon = () => {
    drawingManagerRef.current?.setDrawingMode(null);
  };

  return null;
};

export default MapPolygon;
