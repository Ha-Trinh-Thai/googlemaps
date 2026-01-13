# Google Maps Demo

A Next.js application with Google Maps integration featuring smooth zoom functionality, draw polygons and navigation route display.

## Demo Video

https://www.loom.com/share/81d03f3ccdb54fa9adb3246359e2539d

## Features

- **Google Maps Integration**: Full-featured Google Maps embed
- **Polygon Drawing**: Draw and edit custom polygons on the map
- **Pinned Location**: Display a marker at specific coordinates with walking directions

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Google Maps JavaScript API** - Maps and navigation
- **@googlemaps/js-api-loader** - Google Maps loader
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

You can run this application in two ways:

### Option 1: Docker (Recommended - Single Command!)

**Prerequisites:**

1. Docker and Docker Compose installed
2. Google Maps API Key:
   - Make sure “Directions API” to be enabled in Google Cloud.
   - Make sure HTTP referrer not restriction blocks production domain

**Run the application:**

```bash
# 1. Copy environment file
cp .env.docker .env

# 2. Add your Google Maps API key to .env.local

# 3. Start with Docker Compose
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

### Option 2: Local Development

**Prerequisites:**

- Node.js 20.9.0 or later
- npm or yarn package manager
- Google Maps API Key

**Steps:**

#### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Places API
4. Create credentials (API Key)
5. Copy your API key

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Google Maps API key

#### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Overview

### Google Maps Integration

Full-featured Google Maps with smooth zoom and gesture support.

### Polygon Drawing

- Interactive drawing tools (Draw, Move, Delete modes)
- Editable vertices (drag to reposition)
- Right-click to delete individual polygons
- Automatic coordinate tracking
- Material-UI control buttons

### Pinned Location & Walking Navigation

- Red marker for pinned destination (Marina Bay Sands by default)
- Blue marker for starting location (Gardens by the Bay by default)
- Automatic walking route calculation
- Distance and duration display
- Configurable via environment variables

## Implementation Approach

For a comprehensive explanation of our technical approach, architecture decisions, and implementation details for all project requirements, see:

📄 **[IMPLEMENTATION_APPROACH.md](./IMPLEMENTATION_APPROACH.md)**

This document covers:

- Architecture decisions and rationale
- Detailed implementation for each requirement
- Design patterns used
- Technology choices and justification

## Available Scripts

```bash
# Development
npm run dev          # Start development server (port 3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Docker
docker-compose up --build    # Run with Docker
./start-docker.sh           # Automated Docker start

# Other
npm run lint         # Run ESLint
```

## Architecture

This project uses a modular component architecture:

- **GoogleMap** - Base component handling map initialization
- **MapPolygon** - Feature component for polygon drawing
- **MapDirectionBetweenLocations** - Feature component for pinned markers and navigation
- **page.tsx** - Orchestrates all components with centralized state

## Troubleshooting

### Map Not Loading

- Verify API key is set in `.env.local`
- Enable required APIs in Google Cloud Console:
  - Maps JavaScript API
  - Directions API
  - Places API (optional)
- Check browser console for errors

### Docker Issues

- Ensure Docker and Docker Compose are installed
- Check `.env.local` has valid API key
- Try: `docker-compose down && docker-compose up --build`

## Environment Variables

| Variable                          | Required | Default  | Description                                 |
| --------------------------------- | -------- | -------- | ------------------------------------------- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **Yes**  | -        | Your Google Maps API key                    |
| `NEXT_PUBLIC_PIN_LAT`             | No       | 1.2834   | Pinned location latitude (Marina Bay Sands) |
| `NEXT_PUBLIC_PIN_LONG`            | No       | 103.8607 | Pinned location longitude                   |

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Docker Documentation](https://docs.docker.com/)

---

**Last Updated:** January 13, 2026  
**Version:** 2.0
