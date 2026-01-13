#!/bin/bash

echo "🚀 Starting Google Maps Next.js Application with Docker..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from: https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env.docker..."
    cp .env.docker .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your Google Maps API key!"
    echo "   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE"
    echo ""
    read -p "Press Enter after you've added your API key..."
fi

# Check if API key is set
if grep -q "YOUR_API_KEY_HERE" .env.local; then
    echo "⚠️  WARNING: You haven't set your Google Maps API key in .env.local"
    echo "   The application may not work correctly without a valid API key."
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting. Please add your API key to .env.local and try again."
        exit 1
    fi
fi

echo "🔨 Building Docker image and starting container..."
echo ""

# Build and run with docker-compose
docker-compose up --build

# The script will wait here while the container runs
# Press Ctrl+C to stop
