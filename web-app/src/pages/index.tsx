import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, User, Bell, Settings, Star, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LocationInput from '@/components/booking/LocationInput';
import ServiceSelector from '@/components/booking/ServiceSelector';
import MapView from '@/components/map/MapView';
import SecurityAssessmentBanner from '@/components/security/SecurityAssessmentBanner';
import SecurityAssessmentModal from '@/components/security/SecurityAssessmentModal';
import FloatingBookingButton from '@/components/ui/FloatingBookingButton';
import AnimatedProgress from '@/components/ui/AnimatedProgress';
import PricingCard from '@/components/ui/PricingCard';
import { LocationLoadingSkeleton, ServiceLoadingSkeleton } from '@/components/ui/LoadingStates';

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

const services = [
  {
    id: 'standard',
    name: 'Standard',
    basePrice: 6.50,
    description: 'Basic security driver',
    color: '#4CAF50',
    icon: 'car-outline',
    badge: 'Most Popular',
    badgeColor: '#4CAF50'
  },
  {
    id: 'executive',
    name: 'Executive',
    basePrice: 10.50,
    description: 'Luxury car with premium security',
    color: '#FF9800',
    icon: 'car-sport-outline',
    badge: 'Premium',
    badgeColor: '#FF9800'
  },
  {
    id: 'xl',
    name: 'XL',
    basePrice: 7.20,
    description: 'Large vehicle for groups',
    color: '#2196F3',
    icon: 'bus-outline',
    badge: 'Extra Space',
    badgeColor: '#2196F3'
  },
  {
    id: 'airport-transfer',
    name: 'Airport',
    basePrice: 8.50,
    description: 'Secure airport pickup service',
    color: '#9C27B0',
    icon: 'airplane-outline',
    badge: 'Flight Tracking',
    badgeColor: '#9C27B0'
  },
  {
    id: 'event-security',
    name: 'Event',
    basePrice: 12.00,
    description: 'Security for meetings & events',
    color: '#FF5722',
    icon: 'calendar-outline',
    badge: 'Event Specialist',
    badgeColor: '#FF5722'
  }
];

export default function Home() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<Location | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Location | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Simulate loading states
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Get user's current location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setPickupCoords(location);
          setPickupAddress('Current Location');
        },
        (error) => {
          console.log('Error getting location:', error);
          // Default to London for demo
          const location = {
            latitude: 51.5074,
            longitude: -0.1278,
          };
          setPickupCoords(location);
          setPickupAddress('Current Location');
        }
      );
    }
  }, []);

  const handleLocationSelect = (location: LocationSuggestion, type: 'pickup' | 'destination') => {
    const coords = {
      latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
      longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
    };

    if (type === 'pickup') {
      setPickupAddress(location.title);
      setPickupCoords(coords);
    } else {
      setDestinationAddress(location.title);
      setDestinationCoords(coords);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setServicesLoading(true);
    // Simulate loading
    setTimeout(() => {
      setSelectedService(serviceId);
      setServicesLoading(false);
    }, 800);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setPickupCoords(location);
          setPickupAddress('Current Location');
        },
        (error) => {
          console.log('Error getting location:', error);
          alert('Unable to get current location');
        }
      );
    }
  };

  const handleSwapLocations = () => {
    const tempAddress = pickupAddress;
    const tempCoords = pickupCoords;
    
    setPickupAddress(destinationAddress);
    setPickupCoords(destinationCoords);
    setDestinationAddress(tempAddress);
    setDestinationCoords(tempCoords);
  };

  const handleMapLocationSelect = (location: Location) => {
    if (!pickupCoords) {
      setPickupCoords(location);
      setPickupAddress('Selected on Map');
    } else {
      setDestinationCoords(location);
      setDestinationAddress('Selected on Map');
    }
  };

  const handleAssessmentComplete = (results: any) => {
    console.log('Assessment completed:', results);
    setAssessmentCompleted(true);
    setShowAssessmentModal(false);
    alert(`Assessment Complete!\n\nRisk Level: ${results.riskLevel}\nYou can now book your secure transport.`);
  };

  const getBookingButtonText = () => {
    if (!assessmentCompleted) return '🛡️ Complete Security Assessment';
    if (!selectedService) return 'Choose Your Protection Level';
    if (!pickupCoords || !destinationCoords) return 'Set Pickup & Destination';
    const service = services.find(s => s.id === selectedService);
    return `🚗 Book ${service?.name || 'Service'} Now`;
  };

  const getBookingButtonSubtext = () => {
    if (!assessmentCompleted) return 'Required security evaluation before booking';
    if (!selectedService) return 'Choose your preferred service above';
    if (!pickupCoords || !destinationCoords) return 'Enter locations to calculate price';
    return 'Secure transport ready • Tap to confirm';
  };

  const canBook = assessmentCompleted && selectedService && pickupCoords && destinationCoords;
  const hasLocations = !!(pickupCoords && destinationCoords);

  // Calculate pricing details
  const getPricingDetails = () => {
    if (!canBook) return null;
    const service = services.find(s => s.id === selectedService);
    if (!service) return null;

    return {
      service: service.name,
      estimatedPrice: `£${(service.basePrice + 6).toFixed(2)}`,
      distance: '~5.2 km',
      duration: '~12 min',
      pickupTime: 'Within 5 minutes',
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Header */}
      <motion.header 
        className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                GQCars
              </h1>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                Premium
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                className="p-2 relative"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 relative"
              >
                <Menu className="w-5 h-5" />
                {!assessmentCompleted && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full" />
                )}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="p-2 relative group"
              >
                <User className="w-5 h-5" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-success-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-2 h-2 text-white" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Enhanced Header */}
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                🛡️ Plan Your Secure Trip 
                <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  ⚡
                </span>
              </h2>
              <p className="text-gray-600 text-lg">
                Professional security drivers • Real-time protection • SIA licensed officers
              </p>
            </motion.div>

            {/* Security Assessment Banner */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SecurityAssessmentBanner
                variant={assessmentCompleted ? 'completed' : 'required'}
                onPress={() => setShowAssessmentModal(true)}
              />
            </motion.div>

            {/* Animated Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatedProgress
                assessmentCompleted={assessmentCompleted}
                selectedService={selectedService}
                hasLocations={hasLocations}
              />
            </motion.div>

            {/* Location Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {isLoading ? (
                <LocationLoadingSkeleton />
              ) : (
                <LocationInput
                  pickupAddress={pickupAddress}
                  destinationAddress={destinationAddress}
                  onPickupChange={setPickupAddress}
                  onDestinationChange={setDestinationAddress}
                  onLocationSelect={handleLocationSelect}
                  onUseCurrentLocation={handleUseCurrentLocation}
                  onSwapLocations={handleSwapLocations}
                />
              )}
            </motion.div>

            {/* Service Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {servicesLoading ? (
                <ServiceLoadingSkeleton />
              ) : (
                <ServiceSelector
                  services={services}
                  selectedService={selectedService}
                  onServiceSelect={handleServiceSelect}
                  hasLocations={hasLocations}
                />
              )}
            </motion.div>

            {/* Pricing Card */}
            <AnimatePresence>
              {canBook && (
                <PricingCard
                  details={getPricingDetails()!}
                  isVisible={canBook}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Map */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-0 overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                    <div className="text-sm font-medium text-gray-900">Live Map</div>
                    <div className="text-xs text-gray-600">
                      {hasLocations ? 'Route calculated' : 'Select locations'}
                    </div>
                  </div>
                </div>
                <MapView
                  pickupLocation={pickupCoords}
                  destination={destinationCoords}
                  onLocationSelect={handleMapLocationSelect}
                  height="600px"
                />
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="p-4 text-center bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                <div className="text-2xl font-bold text-primary-600">5★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-success-50 to-success-100 border-success-200">
                <div className="text-2xl font-bold text-success-600">98%</div>
                <div className="text-sm text-gray-600">On-Time Rate</div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Floating Booking Button */}
      <FloatingBookingButton
        canBook={canBook}
        assessmentCompleted={assessmentCompleted}
        selectedService={selectedService}
        hasLocations={hasLocations}
        onPress={() => {
          if (!assessmentCompleted) {
            setShowAssessmentModal(true);
          } else if (canBook) {
            alert('🎉 Booking confirmed! A driver will be assigned shortly.\n\nYou will receive SMS and email confirmations.');
          }
        }}
        buttonText={getBookingButtonText()}
        buttonSubtext={getBookingButtonSubtext()}
      />

      {/* Security Assessment Modal */}
      <SecurityAssessmentModal
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onComplete={handleAssessmentComplete}
      />
    </div>
  );
}