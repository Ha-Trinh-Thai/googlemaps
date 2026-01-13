# Implementation Approach - Google Maps Next.js Application

**Project**: Google Maps Integration with Custom Drawing and Navigation  
**Framework**: Next.js 16.1.1 with App Router  
**Date**: January 13, 2026

---

## Requirements Overview

This document outlines our architectural approach to implementing a Google Maps application with the following requirements:

1. Google Maps Integration
2. Custom Drawing Overlay (Polygon)
3. Pinned Location with Environment Variables
4. Walking Navigation
5. Smooth Zoom Functionality
6. Docker Single-Command Setup
7. Next.js App Router Framework

---

## Architecture Decision

### Modular Component-Based Approach

We adopted a **modular, composable architecture** where each feature is isolated into its own component while sharing a common Google Maps instance. This approach provides:

- **Separation of Concerns**: Each feature has its own component
- **Reusability**: Components can be used independently or together
- **Performance**: Optimized with React.memo and useMemo
- **Maintainability**: Easy to modify or extend individual features

### Component Hierarchy

```
page.tsx (Main Application)
  └── GoogleMap (Base Component)
        ├── MapPolygon (Drawing Overlay)
        └── MapDirectionBetweenLocations (Pinned Location + Navigation)
```

---

## Requirement Implementation Details

### 1. Google Maps Integration

**Requirement**: Embed Google Maps in Next.js application

**Implementation Approach**:

**Component**: `src/components/GoogleMap.tsx`

**Strategy**:

- Created a reusable base component that handles Google Maps initialization
- Uses `@googlemaps/js-api-loader` for dynamic script loading
- Implements callback pattern to provide map instance to child components
- Supports all required Google Maps libraries (places, geometry, drawing, directions)

---

### 2. Custom Drawing Overlay (Polygon)

**Requirement**: Create custom polygon drawing that overlays on the map

**Implementation Approach**:

**Component**: `src/components/MapPolygon.tsx`

**Strategy**:

- Integrated Google Maps Drawing Manager for polygon creation
- Added Material-UI controls for draw/move/delete modes
- Implemented polygon editing (drag vertices, delete individual polygons)
- Stored polygon data in React state for persistence

**Event Listener Management**:

- Per-polygon listener tracking prevents memory leaks
- Proper cleanup on component unmount
- Debounced updates (300ms) for edit operations

**Material-UI Controls**:

- Draw Mode Button (Blue) - Start drawing polygons
- Move Mode Button (White) - Pan map
- Delete Button (Red) - Clear all polygons
- Right-click on polygon - Delete individual polygon

**Challenges & Solutions**:

| Challenge                   | Solution                                            |
| --------------------------- | --------------------------------------------------- |
| Infinite re-render loops    | Added `initializedRef` to prevent re-initialization |
| Memory leaks from listeners | Implemented per-polygon listener cleanup            |

**Performance Optimization**:

- Event listener cleanup in useEffect return
- Refs for non-reactive data (polygonObjectsMapRef)

---

### 3. Pinned Location with Environment Variables

**Requirement**: Display pinned location using NEXT_PUBLIC_PIN_LAT and NEXT_PUBLIC_PIN_LONG

**Implementation Approach**:

**Component**: `src/components/MapDirectionBetweenLocations.tsx`

**Strategy**:

- Read coordinates from environment variables with fallback defaults
- Created custom marker with distinct red color
- Added info window with coordinate display
- Auto-fit map bounds to show pinned location

**Default Location**: Marina Bay Sands, Singapore (1.2834, 103.8607)

**Environment Variables**:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
NEXT_PUBLIC_PIN_LAT=1.2834
NEXT_PUBLIC_PIN_LONG=103.8607
```

---

### 4. Walking Navigation

**Requirement**: Implement walking directions from user location to pinned location

**Implementation Approach**:

**Component**: `src/components/MapDirectionBetweenLocations.tsx`

**Strategy**:

- Integrated Google Maps Directions API with WALKING travel mode
- Created blue marker for user location (default: Gardens by the Bay)
- Drew route as blue polyline between markers
- Added geolocation support with fallback to default location
- Auto-fit bounds to show entire walking route

**Route Visualization**:

```typescript
const directionsRenderer = new google.maps.DirectionsRenderer({
  suppressMarkers: true, // Use custom markers instead
  polylineOptions: {
    strokeColor: "#4285F4", // Google blue
    strokeWeight: 5,
    strokeOpacity: 0.7,
  },
});
```

**Geolocation Error Handling**:

- `PERMISSION_DENIED`: User denied location access → use default
- `POSITION_UNAVAILABLE`: Location unavailable → use default
- `TIMEOUT`: Request timeout after 10s → use default
- Browser not supported → use default

**Default User Location**: Gardens by the Bay (800m from Marina Bay Sands)

**Route Information Logged**:

- Walking distance (e.g., "850 m")
- Estimated duration (e.g., "11 mins")

**Benefits**:

- Real user location when available
- Graceful fallback to sensible default
- Clear visual distinction (red pin vs blue user marker)
- Full route visibility with auto-bounds

---

### 5. Smooth Zoom Functionality

**Requirement**: Ensure zoom works seamlessly with overlay and navigation

**Implementation Approach**:

**Strategy**:

- Used native Google Maps zoom controls
- Ensured all overlays (polygons, markers, routes) remain synchronized
- Implemented auto-fit bounds for optimal initial view
- No manual zoom restrictions that would break UX

**Overlay Synchronization**:

- All overlays (polygons, markers, routes) are native Google Maps objects
- Automatically sync with map zoom/pan
- No custom coordinate transformation needed

**Testing Done**:

- Zoom with polygon editing active
- Zoom with navigation route displayed
- Zoom with both features active simultaneously
- Mouse wheel zoom
- Zoom controls (+/- buttons)
- Pinch zoom (mobile)

---

### 6. Docker Single-Command Setup

**Requirement**: Docker configuration for single-command local deployment

**Implementation Approach**:

**Strategy**:

- Multi-stage Dockerfile for optimized production build
- Docker Compose for orchestration and environment management
- Standalone Next.js output for minimal image size
- Automated startup script with validation

**Single Command Deployment**:

```bash
docker-compose up --build
```

**Environment Management**:

- `.env.example` - Template with all variables
- `.env.docker` - Docker-specific template
- `.env.local` - User's actual configuration (gitignored)
- `.dockerignore` - Excludes unnecessary files from build

**Docker Files**:

- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - Service orchestration
- `.dockerignore` - Build optimization
- `start-docker.sh` - Automated startup (optional)

## Design Patterns Used

### 1. **Composition over Inheritance**

- Base `GoogleMap` component
- Feature components compose together
- No deep inheritance hierarchies

### 2. **Container/Presenter Pattern**

- `page.tsx` = Container (state management)
- Feature components = Presenters (rendering)

### 3. **Dependency Injection**

- Google Maps instance passed via props
- Components don't create their own map

### 4. **Observer Pattern**

- Event listeners for map interactions
- Callbacks for state updates

### 5. **Facade Pattern**

- `GoogleMap` component hides complex initialization
- Simple interface for consumers

---

## Known Limitations & Future Enhancements

### Current Limitations

1. **Geolocation**:

   - Default location used if permission denied
   - No retry mechanism
   - **Future**: Add manual location input

2. **Polygon Persistence**:

   - Polygons lost on page refresh
   - **Future**: Save to localStorage or backend

3. **Route Options**:

   - Only WALKING mode supported
   - Not show Route Information
   - **Future**:
     - Support DRIVING, BICYCLING, TRANSIT
     - Show Route Information on UI

4. **Mobile Optimization**:

   - Works on mobile but not fully optimized
   - **Future**: Touch gestures, mobile-specific UI

---

**Last Updated**: January 13, 2026
