import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  pickupLocation?: Location | null;
  destination?: Location | null;
  showUserLocation?: boolean;
  onLocationSelect?: (location: Location) => void;
  className?: string;
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({
  pickupLocation,
  destination,
  showUserLocation = true,
  onLocationSelect,
  className = '',
  height = '300px',
}) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.log('Error getting location:', error);
          // Default to London for demo
          setUserLocation({
            latitude: 51.5074,
            longitude: -0.1278,
          });
          setIsLoading(false);
        }
      );
    } else {
      // Default to London for demo
      setUserLocation({
        latitude: 51.5074,
        longitude: -0.1278,
      });
    }
  }, [showUserLocation]);

  const handleMapClick = () => {
    if (onLocationSelect) {
      // Mock coordinate selection for web demo
      const mockLocation = {
        latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
        longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
      };
      onLocationSelect(mockLocation);
    }
  };

  return (
    <div 
      className={`map-container cursor-pointer ${className}`}
      style={{ height }}
      onClick={handleMapClick}
    >
      <div className="text-center p-8">
        <div className="flex items-center justify-center mb-4">
          <Navigation className="w-8 h-8 text-primary-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-primary-600 mb-2">
          Interactive Map
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          {pickupLocation ? (
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span>Pickup Location Set</span>
            </div>
          ) : (
            <p>Tap to set pickup location</p>
          )}
          
          {destination && (
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-error-500" />
              <span>Destination Set</span>
            </div>
          )}
          
          {userLocation && !isLoading && (
            <p className="text-xs text-gray-500">
              Current: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </p>
          )}
          
          {isLoading && (
            <p className="text-xs text-gray-500">Getting your location...</p>
          )}
        </div>
        
        <p className="text-xs text-gray-400 mt-4">
          Click anywhere to select a location
        </p>
      </div>
    </div>
  );
};

export default MapView;