import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
  ScrollView,
  Alert,
  Animated,
  PanResponder,
  Haptics,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import GQMapView from '../components/Map/MapView';
import NavigationMenu from '../components/ui/NavigationMenu';
import EmergencyButton from '../components/ui/EmergencyButton';
import LocationService from '../services/LocationService';
import SecurityAssessmentService from '../services/SecurityAssessmentService';
import OnboardingDataService from '../services/OnboardingDataService';
import bookingService from '../services/BookingService';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const locationSuggestions = [
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
    title: 'King\'s Cross Station',
    address: 'Euston Rd, London N1C 4QP, UK',
    distance: '0.8 mi',
  },
];

const NewHomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupFocused, setPickupFocused] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [currentInputField, setCurrentInputField] = useState(null);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [isAtMaxExpansion, setIsAtMaxExpansion] = useState(false);
  
  // Bottom sheet animation
  const bottomSheetY = useRef(new Animated.Value(height * 0.4)).current;
  const lastGesture = useRef(height * 0.4);
  
  // Calculate fixed top section height to prevent overlap
  const statusBarHeight = 44; // Approximate StatusBar + SafeArea
  const topHeaderHeight = 44 + (theme.spacing.md * 2); // Header with padding
  const locationInputHeight = 120; // Approximate height for location inputs
  const bufferSpace = theme.spacing.lg; // Visual buffer
  const fixedTopSectionHeight = statusBarHeight + topHeaderHeight + locationInputHeight + bufferSpace;
  
  // Maximum slider expansion (cannot go above this point)
  const maxSliderExpansion = fixedTopSectionHeight;
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical gestures with significant movement
        // and make sure we're not interfering with ScrollView
        return Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        bottomSheetY.setOffset(lastGesture.current);
        bottomSheetY.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Calculate new position and apply constraints
        let newPosition = lastGesture.current + gestureState.dy;
        
        // Prevent dragging above maximum expansion point
        if (newPosition < maxSliderExpansion) {
          newPosition = maxSliderExpansion;
        }
        
        // Prevent dragging below minimum (screen bottom)
        if (newPosition > height * 0.8) {
          newPosition = height * 0.8;
        }
        
        // Apply the constrained movement
        bottomSheetY.setValue(newPosition - lastGesture.current);
      },
      onPanResponderRelease: (evt, gestureState) => {
        bottomSheetY.flattenOffset();
        
        let newPosition = lastGesture.current + gestureState.dy;
        
        // Apply constraints before snapping
        if (newPosition < maxSliderExpansion) {
          newPosition = maxSliderExpansion;
        }
        if (newPosition > height * 0.8) {
          newPosition = height * 0.8;
        }
        
        // Snap to positions with proper height constraints
        const snapPositions = [
          maxSliderExpansion,  // Expanded (stops at top section bottom)
          height * 0.4,        // Default (60% of screen)
          height * 0.7,        // Minimized (30% of screen)
        ];
        
        // Add haptic feedback for snapping
        try {
          Haptics.selectionAsync();
        } catch (error) {
          // Haptics not available on this platform
        }
        
        // Find closest snap position
        const closest = snapPositions.reduce((prev, curr) => 
          Math.abs(curr - newPosition) < Math.abs(prev - newPosition) ? curr : prev
        );
        
        lastGesture.current = closest;
        
        // Update max expansion state and add extra haptic feedback
        const atMaxExpansion = closest === maxSliderExpansion;
        setIsAtMaxExpansion(atMaxExpansion);
        
        if (atMaxExpansion) {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch (error) {
            // Haptics not available
          }
        }
        
        Animated.spring(bottomSheetY, {
          toValue: closest,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      },
    })
  ).current;
  const [selectedService, setSelectedService] = useState(null);
  const [mapMode, setMapMode] = useState('none'); // 'pickup', 'dropoff', 'none'
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const locationService = LocationService.getInstance();

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

  // Calculate estimated price based on distance (mock calculation)
  const calculatePrice = (service, hasLocations) => {
    if (!hasLocations) return `From £${service.basePrice.toFixed(2)}`;
    // Mock calculation - in real app, this would call a pricing API
    const estimatedDistance = 5; // km
    const calculatedPrice = service.basePrice + (estimatedDistance * 1.2);
    return `£${calculatedPrice.toFixed(2)}`;
  };

  const filteredSuggestions = (() => {
    const query = currentInputField === 'pickup' ? pickupAddress : destinationAddress;
    if (query) {
      return locationSuggestions.filter(
        location =>
          location.title.toLowerCase().includes(query.toLowerCase()) ||
          location.address.toLowerCase().includes(query.toLowerCase())
      );
    }
    return locationSuggestions;
  })();

  const handleLocationSelect = (location) => {
    setDestinationCoords({ latitude: 40.7589, longitude: -73.9851 }); // Mock coordinates
    setDestinationAddress(location.title);
  };

  const handleMapLocationSelect = (location) => {
    if (mapMode === 'pickup') {
      setPickupCoords(location);
      setPickupAddress('Selected on Map');
      setMapMode('none');
    } else if (mapMode === 'dropoff') {
      setDestinationCoords(location);
      setDestinationAddress('Selected on Map');
      setMapMode('none');
    } else {
      // Default behavior when no mode is set
      if (!pickupCoords) {
        setPickupCoords(location);
        setPickupAddress('Selected on Map');
      } else {
        setDestinationCoords(location);
        setDestinationAddress('Selected on Map');
      }
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      setUserCoords(location);
      setPickupCoords(location);
      setPickupAddress('Current Location');
    } catch (error) {
      Alert.alert('Location Error', 'Unable to get current location');
    }
  };

  const handlePickupPress = () => {
    if (!pickupCoords) {
      setMapMode('pickup');
    } else {
      // If pickup is already set, allow user to change it
      setMapMode('pickup');
    }
  };

  const handleDropoffPress = () => {
    setMapMode('dropoff');
  };

  const handleSwapLocations = () => {
    const tempAddress = pickupAddress;
    const tempCoords = pickupCoords;
    
    setPickupAddress(destinationAddress);
    setPickupCoords(destinationCoords);
    setDestinationAddress(tempAddress);
    setDestinationCoords(tempCoords);
  };

  const handleSuggestionSelect = (location) => {
    if (currentInputField === 'pickup') {
      setPickupAddress(location.title);
      setPickupCoords({ latitude: 40.7589, longitude: -73.9851 }); // Mock coordinates
    } else if (currentInputField === 'destination') {
      setDestinationAddress(location.title);
      setDestinationCoords({ latitude: 40.7589, longitude: -73.9851 }); // Mock coordinates
    }
    setShowLocationSuggestions(false);
    setPickupFocused(false);
    setDestinationFocused(false);
  };

  // Clear step-by-step CTA text 
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
    const hasLocations = pickupCoords && destinationCoords;
    const service = services.find(s => s.id === selectedService);
    const price = hasLocations ? calculatePrice(service, hasLocations) : 'Price TBD';
    return `Estimated cost: ${price} • Tap to request driver`;
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const location = await locationService.getCurrentLocation();
        setUserCoords(location);
        // Auto-set pickup to current location
        setPickupCoords(location);
        setPickupAddress('Current Location');
      } catch (error) {
        console.log('Error getting location:', error);
      }
    };
    
    getCurrentLocation();

    // Listen for assessment completion changes
    const unsubscribe = SecurityAssessmentService.addListener((status) => {
      setAssessmentCompleted(status.isCompleted);
    });

    // Listen for onboarding data changes and get recommendations
    const onboardingUnsubscribe = OnboardingDataService.addListener((data) => {
      // Listen for onboarding data updates
    });

    // Initial checks
    setAssessmentCompleted(SecurityAssessmentService.isAssessmentCompleted());

    return () => {
      unsubscribe();
      onboardingUnsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Top Header with Menu */}
      <View style={styles.topHeader}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowNavigationMenu(true)}
        >
          <Ionicons name="menu-outline" size={24} color={theme.colors.text} />
          {!assessmentCompleted && (
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>!</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Account')}
        >
          <Ionicons name="person-circle-outline" size={32} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Location Inputs - Uber Style (Above Map) */}
      <View style={styles.topLocationContainer}>
        <View style={styles.locationInputCard}>
          {/* Pickup Input */}
          <View style={[styles.locationInputRow, pickupFocused && styles.locationInputRowFocused]}>
            <View style={styles.locationDots}>
              <View style={[styles.locationDot, { backgroundColor: theme.colors.primary }]} />
              <View style={styles.locationLine} />
            </View>
            <View style={styles.locationInputContent}>
              <Text style={styles.locationInputLabel}>Pickup</Text>
              <TextInput
                style={styles.locationTextInput}
                placeholder="Enter pickup location"
                placeholderTextColor={theme.colors.textLight}
                value={pickupAddress}
                onChangeText={setPickupAddress}
                onFocus={() => {
                  setPickupFocused(true);
                  setCurrentInputField('pickup');
                  setShowLocationSuggestions(true);
                  // Add haptic feedback for focus
                  try {
                    Haptics.selectionAsync();
                  } catch (error) {
                    // Haptics not available
                  }
                }}
                onBlur={() => setPickupFocused(false)}
              />
            </View>
            <TouchableOpacity 
              style={styles.currentLocationBtn}
              onPress={handleUseCurrentLocation}
            >
              <Ionicons name="locate" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={handleSwapLocations}>
            <Ionicons name="swap-vertical" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {/* Destination Input */}
          <View style={[styles.locationInputRow, destinationFocused && styles.locationInputRowFocused]}>
            <View style={styles.locationDots}>
              <View style={[styles.locationDot, { backgroundColor: theme.colors.error }]} />
            </View>
            <View style={styles.locationInputContent}>
              <Text style={styles.locationInputLabel}>Destination</Text>
              <TextInput
                style={styles.locationTextInput}
                placeholder="Where to?"
                placeholderTextColor={theme.colors.textLight}
                value={destinationAddress}
                onChangeText={setDestinationAddress}
                onFocus={() => {
                  setDestinationFocused(true);
                  setCurrentInputField('destination');
                  setShowLocationSuggestions(true);
                  // Add haptic feedback for focus
                  try {
                    Haptics.selectionAsync();
                  } catch (error) {
                    // Haptics not available
                  }
                }}
                onBlur={() => setDestinationFocused(false)}
              />
            </View>
          </View>
        </View>

        {/* Location Suggestions */}
        {showLocationSuggestions && (pickupFocused || destinationFocused) && (
          <View style={styles.locationSuggestionsCard}>
            {filteredSuggestions.slice(0, 4).map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.suggestionItem}
                onPress={() => {
                  // Add haptic feedback
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch (error) {
                    // Haptics not available
                  }
                  handleSuggestionSelect(location);
                }}
              >
                <View style={styles.suggestionIcon}>
                  <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{location.title}</Text>
                  <Text style={styles.suggestionAddress}>{location.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <GQMapView
          style={styles.map}
          pickupLocation={pickupCoords}
          destination={destinationCoords}
          showUserLocation={true}
          onLocationSelect={handleMapLocationSelect}
        />
        
        {/* Map Mode Indicator */}
        {mapMode !== 'none' && (
          <View style={styles.mapModeIndicator}>
            <View style={styles.mapModeContent}>
              <Ionicons 
                name={mapMode === 'pickup' ? 'radio-button-on' : 'location'} 
                size={20} 
                color={mapMode === 'pickup' ? theme.colors.primary : theme.colors.error} 
              />
              <Text style={styles.mapModeText}>
                Tap map to set {mapMode === 'pickup' ? 'pickup' : 'drop-off'} location
              </Text>
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
        >
          <Ionicons name="locate" size={24} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Dynamic Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheetContainer,
          { top: bottomSheetY }
        ]}
      >
        <View style={styles.bottomCard}>
          {/* Drag Handle with max expansion indicator */}
          <View 
            style={styles.dragHandleContainer}
            {...panResponder.panHandlers}
          >
            <View style={[
              styles.dragHandle,
              isAtMaxExpansion && styles.dragHandleMaxExpansion
            ]} />
          </View>
          
          <ScrollView 
            style={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={() => {
              // Dismiss keyboard only when user starts dragging
              Keyboard.dismiss();
            }}
            scrollEventThrottle={32}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          >
          
          {/* Header with gradient effect */}
          <View style={styles.cardHeader}>
            <View style={styles.headerGradient} />
            <Text style={styles.sectionTitle}>🛡️ Plan Your Secure Trip ⚡ UPDATED</Text>
            <Text style={styles.sectionSubtitle}>Professional security drivers • Real-time protection</Text>
          </View>

          {/* BOOKING PROGRESS INDICATOR */}
          <View style={styles.bookingProgressSection}>
            <Text style={styles.bookingProgressTitle}>Complete These Steps to Book:</Text>
            <View style={styles.bookingSteps}>
              <View style={[styles.bookingStep, assessmentCompleted && styles.bookingStepCompleted]}>
                <Ionicons name={assessmentCompleted ? "checkmark-circle" : "shield-outline"} size={20} color={assessmentCompleted ? theme.colors.success : theme.colors.gray500} />
                <Text style={[styles.bookingStepText, assessmentCompleted && styles.bookingStepTextCompleted]}>Security Assessment</Text>
              </View>
              <View style={[styles.bookingStep, selectedService && styles.bookingStepCompleted]}>
                <Ionicons name={selectedService ? "checkmark-circle" : "car-outline"} size={20} color={selectedService ? theme.colors.success : theme.colors.gray500} />
                <Text style={[styles.bookingStepText, selectedService && styles.bookingStepTextCompleted]}>Choose Service</Text>
              </View>
              <View style={[styles.bookingStep, (pickupCoords && destinationCoords) && styles.bookingStepCompleted]}>
                <Ionicons name={(pickupCoords && destinationCoords) ? "checkmark-circle" : "location-outline"} size={20} color={(pickupCoords && destinationCoords) ? theme.colors.success : theme.colors.gray500} />
                <Text style={[styles.bookingStepText, (pickupCoords && destinationCoords) && styles.bookingStepTextCompleted]}>Set Locations</Text>
              </View>
            </View>
          </View>

          {/* PROMINENT BOOKING CALL-TO-ACTION - Always Visible */}
          <View style={styles.prominentBookingSection}>
            <TouchableOpacity 
              style={[
                styles.prominentBookButton, 
                (!selectedService || !pickupCoords || !destinationCoords || !assessmentCompleted) && styles.prominentBookButtonDisabled,
                (selectedService && pickupCoords && destinationCoords && assessmentCompleted) && styles.prominentBookButtonActive
              ]}
              onPress={async () => {
                if (!assessmentCompleted) {
                  Alert.alert(
                    'Security Assessment Required', 
                    'Please complete your security assessment before booking.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Start Assessment', onPress: () => navigation.navigate('Assessment') }
                    ]
                  );
                } else if (!selectedService) {
                  Alert.alert('Select Service', 'Please choose a service type first.');
                } else if (!pickupCoords || !destinationCoords) {
                  Alert.alert('Set Locations', 'Please set both pickup and drop-off locations.');
                } else {
                  try {
                    // Start booking with BookingService
                    const serviceData = services.find(s => s.id === selectedService);
                    await bookingService.startBooking({
                      pickupLocation: { coords: pickupCoords, address: pickupAddress },
                      destinationLocation: { coords: destinationCoords, address: destinationAddress },
                      selectedService: serviceData
                    });

                    // Navigate to ride selection with booking data
                    navigation.navigate('RideSelection', { 
                      pickup: { coords: pickupCoords, address: pickupAddress },
                      destination: { coords: destinationCoords, address: destinationAddress },
                      selectedService: selectedService,
                      serviceData: serviceData
                    });
                  } catch (error) {
                    console.error('Error starting booking:', error);
                    Alert.alert('Booking Error', 'Unable to start booking. Please try again.');
                  }
                }
              }}
            >
              <View style={styles.prominentBookButtonContent}>
                <Text style={styles.prominentBookButtonText}>{getBookingButtonText()}</Text>
                <Text style={styles.prominentBookButtonSubtext}>{getBookingButtonSubtext()}</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={32} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
          
          {/* Trip Planning Section */}
          <View style={styles.tripSection}>
            
            {/* Service Selection */}
            <View style={styles.serviceSelectionContainer}>
              <Text style={styles.serviceTitle}>Choose Your Service</Text>
              <View style={styles.servicesContainer}>
                {services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={[
                      styles.serviceRow,
                      selectedService === service.id && styles.serviceRowSelected,
                      { borderLeftColor: service.color }
                    ]}
                    onPress={() => {
                      setSelectedService(service.id);
                      // Provide haptic feedback
                      if (Haptics && Haptics.impactAsync) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.serviceRowContent}>
                      {/* Left Side - Icon and Info */}
                      <View style={styles.serviceRowLeft}>
                        <View style={[styles.serviceRowIcon, { backgroundColor: service.color + '20' }]}>
                          <Ionicons name={service.icon} size={20} color={service.color} />
                        </View>
                        <View style={styles.serviceRowInfo}>
                          <View style={styles.serviceRowTopLine}>
                            <Text style={styles.serviceRowName} numberOfLines={1}>{service.name}</Text>
                          </View>
                          <View style={styles.serviceRowTags}>
                            {service.badge && (
                              <View style={[styles.serviceBadge, { backgroundColor: service.badgeColor }]}>
                                <Text style={[styles.badgeText, { color: theme.colors.surface }]}>
                                  {service.badge}
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.serviceRowDescription} numberOfLines={2}>
                            {service.description}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Right Side - Selection Only */}
                      <View style={styles.serviceRowRight}>
                        <View style={[
                          styles.serviceRowSelector,
                          selectedService === service.id && [
                            styles.serviceRowSelectorSelected,
                            { backgroundColor: service.color }
                          ]
                        ]}>
                          {selectedService === service.id && (
                            <Ionicons name="checkmark" size={18} color={theme.colors.surface} />
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Pricing Reveal Section */}
            {pickupCoords && destinationCoords && selectedService && (
              <View style={styles.pricingRevealSection}>
                <View style={styles.pricingHeader}>
                  <Ionicons name="pricetag" size={16} color={theme.colors.primary} />
                  <Text style={styles.pricingTitle}>Trip Estimate</Text>
                </View>
                <View style={styles.pricingDetails}>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Service</Text>
                    <Text style={styles.pricingValue}>{services.find(s => s.id === selectedService)?.name}</Text>
                  </View>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Estimated Price</Text>
                    <Text style={styles.pricingPrice}>
                      {calculatePrice(services.find(s => s.id === selectedService), true)}
                    </Text>
                  </View>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Distance</Text>
                    <Text style={styles.pricingValue}>~5 km</Text>
                  </View>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Time</Text>
                    <Text style={styles.pricingValue}>~12 min</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Dynamic Book Button */}
            <TouchableOpacity 
              style={[
                styles.bookButton, 
                (!selectedService || !pickupCoords || !destinationCoords || !assessmentCompleted) && styles.bookButtonDisabled,
                (selectedService && pickupCoords && destinationCoords && assessmentCompleted) && styles.bookButtonActive
              ]}
              onPress={async () => {
                if (!assessmentCompleted) {
                  Alert.alert(
                    'Security Assessment Required', 
                    'Please complete your security assessment before booking.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Start Assessment', onPress: () => navigation.navigate('Assessment') }
                    ]
                  );
                } else if (!selectedService) {
                  Alert.alert('Select Service', 'Please choose a service type first.');
                } else if (!pickupCoords || !destinationCoords) {
                  Alert.alert('Set Locations', 'Please set both pickup and drop-off locations.');
                } else {
                  try {
                    // Start booking with BookingService
                    const serviceData = services.find(s => s.id === selectedService);
                    await bookingService.startBooking({
                      pickupLocation: { coords: pickupCoords, address: pickupAddress },
                      destinationLocation: { coords: destinationCoords, address: destinationAddress },
                      selectedService: serviceData
                    });

                    // Navigate to ride selection with booking data
                    navigation.navigate('RideSelection', { 
                      pickup: { coords: pickupCoords, address: pickupAddress },
                      destination: { coords: destinationCoords, address: destinationAddress },
                      selectedService: selectedService,
                      serviceData: serviceData
                    });
                  } catch (error) {
                    console.error('Error starting booking:', error);
                    Alert.alert('Booking Error', 'Unable to start booking. Please try again.');
                  }
                }
              }}
            >
              <View style={styles.bookButtonContent}>
                <Text style={styles.bookButtonText}>{getBookingButtonText()}</Text>
                <Text style={styles.bookButtonSubtext}>{getBookingButtonSubtext()}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.surface} />
            </TouchableOpacity>
            
            {/* Extra bottom padding to ensure button is accessible */}
            <View style={styles.extraBottomPadding} />
          </View>


          {/* Search Section */}
          <View style={styles.destinationSection}>
            <Text style={styles.destinationTitle}>Popular Destinations</Text>
            <Text style={styles.destinationSubtitle}>Quick access to frequently visited locations</Text>
            
            {/* Enhanced Search Input */}
            <View style={styles.searchContainer}>
              <View style={styles.searchIconContainer}>
                <Ionicons name="search-outline" size={18} color={theme.colors.primary} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search destinations in London..."
                placeholderTextColor={theme.colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Location Suggestions */}
            <View style={styles.suggestionsContainer}>
              {filteredSuggestions.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  style={styles.locationItem}
                  onPress={() => handleLocationSelect(location)}
                  activeOpacity={0.7}
                >
                  <View style={styles.locationIcon}>
                    <Ionicons name="location-outline" size={20} color={theme.colors.textSecondary} />
                  </View>
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationTitle}>{location.title}</Text>
                    <Text style={styles.locationAddress}>{location.address}</Text>
                  </View>
                  <Text style={styles.locationDistance}>{location.distance}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          </ScrollView>
        </View>
      </Animated.View>


      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
        navigation={navigation}
        assessmentCompleted={assessmentCompleted}
      />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    zIndex: 1000,
  },
  topLocationContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    zIndex: 999,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapContainer: {
    height: height * 0.35,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapModeIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  mapModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height,
    zIndex: 1000,
  },
  bottomSheetContent: {
    flex: 1,
  },
  bottomCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: 0,
    paddingBottom: theme.spacing.xxxl,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
    flex: 1,
  },
  dragHandleContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.gray300,
    borderRadius: 2,
  },
  dragHandleMaxExpansion: {
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 6,
    borderRadius: 3,
  },
  cardHeader: {
    position: 'relative',
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: theme.colors.primary + '08',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  tripSection: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  serviceSelectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  recommendationNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FF6B35' + '10',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  recommendationText: {
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  recommendationServiceName: {
    fontWeight: '700',
    color: '#FF6B35',
  },
  servicesContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  serviceRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceRowSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '08',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 6,
    transform: [{ scale: 1.02 }],
  },
  serviceRowRecommended: {
    borderColor: '#FF6B35',
    backgroundColor: '#FF6B35' + '05',
  },
  serviceRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    minHeight: 60,
  },
  serviceRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceRowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  serviceRowInfo: {
    flex: 1,
  },
  serviceRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceRowTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceRowName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  recommendedTag: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  recommendedTagText: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.colors.surface,
  },
  serviceRowBadgeContainer: {
    marginVertical: theme.spacing.xs,
  },
  serviceBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    marginBottom: theme.spacing.xs,
  },
  serviceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  serviceRowTags: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: theme.spacing.xs,
  },
  recommendedBadge: {
    backgroundColor: '#FF6B35',
  },
  recommendedText: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.colors.surface,
    marginLeft: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600',
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
  },
  serviceRowDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  serviceRowRight: {
    alignItems: 'flex-end',
  },
  serviceRowPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'right',
    minWidth: 70,
  },
  serviceRowSelector: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  serviceRowSelectorSelected: {
    borderColor: 'transparent',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  locationInputsContainer: {
    marginBottom: theme.spacing.lg,
  },
  locationInputCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    minHeight: 50,
  },
  locationInputRowFocused: {
    backgroundColor: theme.colors.primary + '05',
    borderRadius: 8,
    marginHorizontal: -theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },
  locationDots: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    width: 20,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginVertical: 2,
  },
  locationLine: {
    width: 2,
    height: 30,
    backgroundColor: theme.colors.gray300,
    marginVertical: 2,
  },
  locationInputContent: {
    flex: 1,
  },
  locationInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  locationTextInput: {
    fontSize: 16,
    color: theme.colors.text,
    padding: 0,
    margin: 0,
    minHeight: 44, // Ensure minimum touch target size
    paddingVertical: theme.spacing.sm,
  },
  currentLocationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  swapButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  locationSuggestionsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginTop: theme.spacing.xs,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    minHeight: 56, // Improved touch target
    borderBottomColor: theme.colors.gray100,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray50,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  inputIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  inputValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
    minHeight: 64,
  },
  bookButtonContent: {
    flex: 1,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.surface,
    marginBottom: 2,
  },
  bookButtonSubtext: {
    fontSize: 12,
    color: theme.colors.surface,
    opacity: 0.8,
  },
  bookButtonDisabled: {
    backgroundColor: theme.colors.gray400,
    shadowOpacity: 0.1,
  },
  bookButtonActive: {
    backgroundColor: theme.colors.success,
    shadowColor: theme.colors.success,
    shadowOpacity: 0.6,
    transform: [{ scale: 1.02 }],
    elevation: 16,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  safetyIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  safetyTextContainer: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  safetySubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  infoButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  destinationSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  destinationTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  destinationSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    paddingVertical: 4,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  suggestionsContainer: {
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '500',
  },
  locationAddress: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  locationDistance: {
    ...theme.typography.labelSmall,
    color: theme.colors.textLight,
  },
  // Pricing Reveal Section
  pricingRevealSection: {
    backgroundColor: theme.colors.primary + '08',
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  pricingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  pricingDetails: {
    gap: theme.spacing.sm,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  pricingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  // Menu Badge
  menuBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  menuBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.surface,
  },
  extraBottomPadding: {
    height: 120, // Increased to ensure button is always accessible
  },
  
  // BOOKING PROGRESS SECTION STYLES
  bookingProgressSection: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bookingProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  bookingSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingStep: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  bookingStepCompleted: {
    backgroundColor: theme.colors.success + '20',
    borderRadius: 8,
  },
  bookingStepText: {
    fontSize: 12,
    color: theme.colors.gray500,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
    fontWeight: '500',
  },
  bookingStepTextCompleted: {
    color: theme.colors.success,
    fontWeight: '600',
  },
  
  // PROMINENT BOOKING SECTION STYLES
  prominentBookingSection: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  prominentBookButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: theme.colors.primaryDark,
    minHeight: 80,
  },
  prominentBookButtonDisabled: {
    backgroundColor: theme.colors.gray400,
    borderColor: theme.colors.gray500,
    shadowOpacity: 0.1,
  },
  prominentBookButtonActive: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.surface,
    shadowColor: theme.colors.success,
    shadowOpacity: 0.5,
    transform: [{ scale: 1.02 }],
  },
  prominentBookButtonContent: {
    flex: 1,
  },
  prominentBookButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.surface,
    marginBottom: 4,
  },
  prominentBookButtonSubtext: {
    fontSize: 14,
    color: theme.colors.surface,
    opacity: 0.9,
    fontWeight: '500',
  },
};

export default NewHomeScreen;