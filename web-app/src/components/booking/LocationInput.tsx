import React, { useState } from 'react';
import { MapPin, Navigation, ArrowUpDown } from 'lucide-react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationSuggestion {
  id: number;
  title: string;
  address: string;
  distance: string;
}

interface LocationInputProps {
  pickupAddress: string;
  destinationAddress: string;
  onPickupChange: (address: string) => void;
  onDestinationChange: (address: string) => void;
  onLocationSelect: (location: LocationSuggestion, type: 'pickup' | 'destination') => void;
  onUseCurrentLocation: () => void;
  onSwapLocations: () => void;
}

const locationSuggestions: LocationSuggestion[] = [
  {
    id: 1,
    title: 'Heathrow Airport',
    address: 'Terminal 5, London TW6 2GA, UK',
    distance: '0.5 mi',
  },
  {
    id: 2,
    title: 'Canary Wharf',
    address: 'Canary Wharf, London E14, UK',
    distance: '1.2 mi',
  },
  {
    id: 3,
    title: 'Westminster',
    address: 'Westminster, London SW1A, UK',
    distance: '2.1 mi',
  },
  {
    id: 4,
    title: 'The Shard',
    address: '32 London Bridge St, London SE1 9SG, UK',
    distance: '1.8 mi',
  },
  {
    id: 5,
    title: "King's Cross Station",
    address: 'Euston Rd, London N1C 4QP, UK',
    distance: '0.8 mi',
  },
];

const LocationInput: React.FC<LocationInputProps> = ({
  pickupAddress,
  destinationAddress,
  onPickupChange,
  onDestinationChange,
  onLocationSelect,
  onUseCurrentLocation,
  onSwapLocations,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentField, setCurrentField] = useState<'pickup' | 'destination' | null>(null);

  const filteredSuggestions = locationSuggestions.filter(location => {
    const query = currentField === 'pickup' ? pickupAddress : destinationAddress;
    if (!query) return true;
    return location.title.toLowerCase().includes(query.toLowerCase()) ||
           location.address.toLowerCase().includes(query.toLowerCase());
  });

  const handleSuggestionClick = (location: LocationSuggestion) => {
    if (currentField) {
      onLocationSelect(location, currentField);
      setShowSuggestions(false);
      setCurrentField(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          {/* Pickup Input */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Pickup
                </label>
                <Input
                  placeholder="Enter pickup location"
                  value={pickupAddress}
                  onChange={(e) => onPickupChange(e.target.value)}
                  onFocus={() => {
                    setCurrentField('pickup');
                    setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  fullWidth
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={onUseCurrentLocation}
                className="p-2"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={onSwapLocations}
              className="p-2"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Destination Input */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-error-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Destination
                </label>
                <Input
                  placeholder="Where to?"
                  value={destinationAddress}
                  onChange={(e) => onDestinationChange(e.target.value)}
                  onFocus={() => {
                    setCurrentField('destination');
                    setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Location Suggestions */}
      {showSuggestions && currentField && (
        <Card className="p-0 max-h-64 overflow-y-auto">
          {filteredSuggestions.slice(0, 5).map((location) => (
            <div
              key={location.id}
              className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
              onClick={() => handleSuggestionClick(location)}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {location.title}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {location.address}
                </p>
              </div>
              <div className="flex-shrink-0 text-xs text-gray-400">
                {location.distance}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default LocationInput;