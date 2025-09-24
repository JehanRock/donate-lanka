import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, AlertCircle } from 'lucide-react';

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
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      // Initialize map centered on Sri Lanka
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [initialLongitude, initialLatitude], // Sri Lanka center
        zoom: 7,
        maxBounds: [
          [79.5, 5.9], // Southwest coordinates (Sri Lanka bounds)
          [81.9, 9.9]  // Northeast coordinates (Sri Lanka bounds)
        ]
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Create initial marker
      marker.current = new mapboxgl.Marker({
        draggable: true,
        color: '#6366f1'
      })
      .setLngLat([initialLongitude, initialLatitude])
      .addTo(map.current);

      // Handle marker drag
      marker.current.on('dragend', async () => {
        if (!marker.current) return;
        const lngLat = marker.current.getLngLat();
        await reverseGeocode(lngLat.lat, lngLat.lng);
      });

      // Handle map click to move marker
      map.current.on('click', async (e) => {
        if (!marker.current) return;
        marker.current.setLngLat(e.lngLat);
        await reverseGeocode(e.lngLat.lat, e.lngLat.lng);
      });

      map.current.on('load', () => {
        setIsMapReady(true);
        // Set initial location
        reverseGeocode(initialLatitude, initialLongitude);
      });

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, initialLatitude, initialLongitude]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&country=LK`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      const address = data.features[0]?.place_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
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

  if (!mapboxToken) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-medium">Mapbox Token Required</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              To use the interactive map, please enter your Mapbox public token. You can find this at{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
              {' '}in your account dashboard under the Tokens section.
            </p>
            <div className="space-y-2">
              <Label htmlFor="mapboxToken">Mapbox Public Token</Label>
              <Input
                id="mapboxToken"
                type="text"
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIs..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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