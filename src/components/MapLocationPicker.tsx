import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

// Fix for default markers in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapLocationPickerProps {
  onLocationSelect: (data: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onLocationSelect,
  initialLatitude = 7.8731,
  initialLongitude = 80.7718
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map centered on Sri Lanka
      map.current = L.map(mapContainer.current, {
        center: [initialLatitude, initialLongitude],
        zoom: 8,
        maxBounds: [
          [5.9, 79.5], // Southwest coordinates (Sri Lanka bounds)
          [9.9, 81.9]  // Northeast coordinates (Sri Lanka bounds)
        ],
        maxBoundsViscosity: 1.0
      });

      // Add OpenStreetMap tiles (completely free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map.current);

      // Create custom marker icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: #6366f1;
          width: 20px;
          height: 20px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
      });

      // Create initial marker
      marker.current = L.marker([initialLatitude, initialLongitude], {
        draggable: true,
        icon: customIcon
      }).addTo(map.current);

      // Handle marker drag
      marker.current.on('dragend', async () => {
        if (!marker.current) return;
        const position = marker.current.getLatLng();
        await reverseGeocode(position.lat, position.lng);
      });

      // Handle map click to move marker
      map.current.on('click', async (e) => {
        if (!marker.current) return;
        marker.current.setLatLng(e.latlng);
        await reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      setIsMapReady(true);
      // Set initial location
      reverseGeocode(initialLatitude, initialLongitude);

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLatitude, initialLongitude]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Use Nominatim (OpenStreetMap's geocoding service) - completely free
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=lk&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      const locationData = {
        latitude: lat,
        longitude: lng,
        address
      };
      
      setSelectedLocation(locationData);
      onLocationSelect(locationData);
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      const locationData = {
        latitude: lat,
        longitude: lng,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      };
      
      setSelectedLocation(locationData);
      onLocationSelect(locationData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-64 rounded-lg border border-input bg-muted"
          style={{ minHeight: '256px' }}
        />
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </div>
      
      {selectedLocation && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Selected Location</p>
              <p className="text-xs text-muted-foreground break-words">{selectedLocation.address}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Click anywhere on the map or drag the pin to select your location in Sri Lanka.
      </p>
    </div>
  );
};

export default MapLocationPicker;