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
import GQMapView from '../components/Map';
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

const HomeScreen = ({ navigation }) => {
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
  
  // Bottom sheet with 2 snap positions (COLLAPSED and HALF only)
  const SNAP_POINTS = {
    COLLAPSED: 200,  // Show text and drag handle above Request Armora button
    HALF: height * 0.55, // Slightly more than half to show good content without accessibility issues
  };
  
  const bottomSheetHeight = useRef(new Animated.Value(SNAP_POINTS.HALF)).current; // Start at HALF
  const [currentSnapPoint, setCurrentSnapPoint] = useState('HALF'); // Default to HALF
  const panGesture = useRef(null);
  const lastGestureY = useRef(0);
  
  // Animation values for micro-interactions
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const locationCardScale = useRef(new Animated.Value(1)).current;
  const expandPromptOpacity = useRef(new Animated.Value(1)).current;
  const [selectedService, setSelectedService] = useState('standard'); // Default to standard service
  const [selectedQuickAction, setSelectedQuickAction] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showAirportModal, setShowAirportModal] = useState(false);
  const [mapMode, setMapMode] = useState('none'); // 'pickup', 'dropoff', 'none'
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const locationService = LocationService.getInstance();

  const popularDestinations = [
    {
      id: 'heathrow-airport',
      title: 'Heathrow',
      icon: 'airplane',
      color: '#2196F3',
      description: 'All terminals',
      address: 'Heathrow Airport, London',
      popular: true
    },
    {
      id: 'canary-wharf',
      title: 'Canary Wharf',
      icon: 'business',
      color: '#FF9800',
      description: 'Financial district',
      address: 'Canary Wharf, London E14',
      popular: true
    },
    {
      id: 'westminster',
      title: 'Westminster',
      icon: 'library',
      color: '#9C27B0',
      description: 'Government area',
      address: 'Westminster, London SW1A',
      popular: true
    },
    {
      id: 'city-london',
      title: 'City of London',
      icon: 'storefront',
      color: '#4CAF50',
      description: 'Business centre',
      address: 'City of London, EC2',
      popular: true
    },
    {
      id: 'gatwick-airport',
      title: 'Gatwick',
      icon: 'airplane',
      color: '#2196F3',
      description: 'South terminal',
      address: 'Gatwick Airport, Surrey',
      popular: true
    },
    {
      id: 'mayfair',
      title: 'Mayfair',
      icon: 'diamond',
      color: '#E91E63',
      description: 'Luxury district',
      address: 'Mayfair, London W1',
      popular: true
    }
  ];

  const services = [
    {
      id: 'security-hire',
      name: 'Personal Security Driver',
      basePrice: 50.00,
      description: 'Standard transport with SIA-licensed close protection officers',
      color: '#4CAF50',
      icon: 'shield-checkmark',
      badge: 'Available Now',
      badgeColor: '#4CAF50',
      active: true,
      minimumFare: 50.00,
      features: ['SIA Licensed', 'Background Checked', 'Standard Vehicles'],
      popular: true
    },
    {
      id: 'executive-protection',
      name: 'Executive Protection',
      basePrice: 75.00,
      description: 'Enhanced security for high-profile individuals and executives',
      color: '#FF9800',
      icon: 'business-outline',
      badge: 'Coming Soon',
      badgeColor: '#FF9800',
      active: false,
      minimumFare: 75.00,
      features: ['Advanced Training', 'Discreet Service', 'Luxury Vehicles'],
      popular: false
    },
    {
      id: 'event-security',
      name: 'Event Security Transport',
      basePrice: 60.00,
      description: 'Specialized transport for events, galas, and special occasions',
      color: '#9C27B0',
      icon: 'calendar-outline',
      badge: 'Coming Soon',
      badgeColor: '#9C27B0',
      active: false,
      minimumFare: 60.00,
      features: ['Event Specialist', 'Coordinated Service', 'Flexible Timing'],
      popular: false
    },
    {
      id: 'airport-security',
      name: 'Airport Security Transfer',
      basePrice: 55.00,
      description: 'Secure airport transfers with flight tracking and meet & greet',
      color: '#2196F3',
      icon: 'airplane-outline',
      badge: 'Coming Soon',
      badgeColor: '#2196F3',
      active: false,
      minimumFare: 55.00,
      features: ['Flight Tracking', 'Meet & Greet', 'Baggage Assistance'],
      popular: false
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

  // Enhanced filtering and suggestions logic
  const filteredSuggestions = (() => {
    const query = currentInputField === 'pickup' ? pickupAddress : destinationAddress;
    
    // If there's a search query, filter existing suggestions
    if (query && query.length > 0) {
      const filtered = locationSuggestions.filter(
        location =>
          location.title.toLowerCase().includes(query.toLowerCase()) ||
          location.address.toLowerCase().includes(query.toLowerCase())
      );
      
      // If we have matches, show them, otherwise show popular destinations
      return filtered.length > 0 ? filtered : popularDestinations.slice(0, 4).map(dest => ({
        id: dest.id,
        title: dest.title,
        address: dest.address,
        distance: 'Popular destination'
      }));
    }
    
    // When no query, show recent places (using locationSuggestions as mock recent places)
    // In a real app, this would come from stored user data
    return locationSuggestions.slice(0, 4);
  })();

  // Get suggestion header text based on content
  const getSuggestionHeaderText = () => {
    const query = currentInputField === 'pickup' ? pickupAddress : destinationAddress;
    if (query && query.length > 0) {
      const hasMatches = locationSuggestions.some(
        location =>
          location.title.toLowerCase().includes(query.toLowerCase()) ||
          location.address.toLowerCase().includes(query.toLowerCase())
      );
      return hasMatches ? 'Search results' : 'Popular destinations';
    }
    return 'Recent destinations';
  };

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
    
    // Clear focus and hide suggestions
    setShowLocationSuggestions(false);
    setCurrentInputField(null);
    setPickupFocused(false);
    setDestinationFocused(false);
    
    // Dismiss keyboard
    Keyboard.dismiss();
    
    // Animate feedback
    animateLocationCard();
  };

  // Close suggestions when user interacts with bottom sheet
  const handleBottomSheetInteraction = () => {
    if (showLocationSuggestions) {
      setShowLocationSuggestions(false);
      setCurrentInputField(null);
    }
  };

  // Animate location card on interaction
  const animateLocationCard = () => {
    Animated.sequence([
      Animated.timing(locationCardScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(locationCardScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Handle popular destination selection
  const handlePopularDestinationPress = (destination) => {
    setSelectedQuickAction(destination.id);
    
    // Set the destination
    setDestinationAddress(destination.title);
    setDestinationCoords({ latitude: 51.4700, longitude: -0.4543 }); // Mock coordinates
    
    // Animate the location card to show feedback
    animateLocationCard();
    
    // Show a brief confirmation
    Alert.alert(
      'Destination Selected', 
      `Set destination to ${destination.title}. Choose your service below to continue.`,
      [{ text: 'Got it', style: 'default' }]
    );
  };

  // Bottom sheet snap functions (2 positions only)
  const snapToPosition = (position, velocity = 0) => {
    const targetValue = SNAP_POINTS[position];
    setCurrentSnapPoint(position);
    
    // Header stays visible for both positions now
    const headerOpacityValue = 1; // Always keep header visible
    
    Animated.parallel([
      Animated.spring(bottomSheetHeight, {
        toValue: targetValue,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
        velocity: velocity,
      }),
      Animated.timing(headerOpacity, {
        toValue: headerOpacityValue,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    // Start pulsing animation when collapsed
    if (position === 'COLLAPSED') {
      startExpandPromptAnimation();
    } else {
      stopExpandPromptAnimation();
    }
  };

  // Enhanced pulsing and bounce animation for expand prompt
  const startExpandPromptAnimation = () => {
    const bounceAndPulse = () => {
      Animated.sequence([
        // Bounce animation
        Animated.timing(locationCardScale, {
          toValue: 1.03,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(locationCardScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Pulse animation
        Animated.timing(expandPromptOpacity, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(expandPromptOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start(() => {
        if (currentSnapPoint === 'COLLAPSED') {
          setTimeout(bounceAndPulse, 2000); // Wait 2 seconds before next cycle
        }
      });
    };
    setTimeout(bounceAndPulse, 1000); // Start after 1 second
  };

  const stopExpandPromptAnimation = () => {
    expandPromptOpacity.setValue(1);
  };

  // Determine which snap point to go to (only 2 positions now)
  const getClosestSnapPoint = (currentValue, velocity) => {
    const { COLLAPSED, HALF } = SNAP_POINTS;
    
    // If moving fast enough, snap in direction of velocity
    if (Math.abs(velocity) > 500) {
      if (velocity > 0) {
        // Moving down - snap to COLLAPSED
        return 'COLLAPSED';
      } else {
        // Moving up - snap to HALF
        return 'HALF';
      }
    }
    
    // Otherwise snap to closest position
    const midPoint = (COLLAPSED + HALF) / 2;
    return currentValue < midPoint ? 'COLLAPSED' : 'HALF';
  };

  // Handle tap on drag handle to toggle between 2 positions
  const handleDragHandleTap = () => {
    const nextPosition = currentSnapPoint === 'COLLAPSED' ? 'HALF' : 'COLLAPSED';
    snapToPosition(nextPosition);
  };

  // Handle tap on collapsed bottom sheet to expand
  const handleCollapsedSheetTap = () => {
    if (currentSnapPoint === 'COLLAPSED') {
      snapToPosition('HALF');
    }
  };

  // Pan gesture responder for dragging bottom sheet
  useEffect(() => {
    panGesture.current = PanResponder.create({
      onStartShouldSetPanResponder: () => false, // Don't immediately capture
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to strong vertical gestures that are clearly intended for the bottom sheet
        const isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        const isStrongGesture = Math.abs(gestureState.dy) > 20; // Even higher threshold for better detection
        const dragHandleArea = 100; // Area from top of bottom sheet where drag works
        const currentBottomSheetTop = height - SNAP_POINTS[currentSnapPoint];
        const isDragHandle = evt.nativeEvent.pageY >= currentBottomSheetTop && 
                           evt.nativeEvent.pageY <= currentBottomSheetTop + dragHandleArea;
        
        return isVertical && isStrongGesture && isDragHandle;
      },
      
      onPanResponderGrant: (evt, gestureState) => {
        // Store the current height when gesture starts
        bottomSheetHeight.stopAnimation((currentValue) => {
          lastGestureY.current = currentValue;
        });
      },
      
      onPanResponderMove: (evt, gestureState) => {
        // Calculate new height based on gesture (limited to COLLAPSED and HALF only)
        const newHeight = Math.max(
          SNAP_POINTS.COLLAPSED,
          Math.min(
            SNAP_POINTS.HALF, // Max height is now HALF instead of FULL
            lastGestureY.current - gestureState.dy // Subtract because dragging up should increase height
          )
        );
        
        bottomSheetHeight.setValue(newHeight);
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        // Get current height and velocity to determine snap position
        bottomSheetHeight.stopAnimation((currentValue) => {
          const velocity = -gestureState.vy * 1000; // Convert to pixels/second and invert
          const targetPosition = getClosestSnapPoint(currentValue, velocity);
          snapToPosition(targetPosition, velocity);
        });
      },
      
      // Prevent interference with ScrollView
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => false,
    });
  }, []);

  // Uber-style simple button text
  const getBookingButtonText = () => {
    return 'Request Armora';
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
      
      {/* Uber-Style Clean Header */}
      <Animated.View style={[styles.uberHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity 
          style={styles.uberMenuButton}
          onPress={() => setShowNavigationMenu(true)}
        >
          <Ionicons name="menu" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.uberBrandSection}>
          <Text style={styles.uberBrandText}>Armora</Text>
          <Text style={styles.uberSecurityBadge}>Security Licensed</Text>
        </View>
        <TouchableOpacity 
          style={styles.uberProfileButton}
          onPress={() => navigation.navigate('Account')}
        >
          <View style={styles.uberProfileIcon}>
            <Text style={styles.uberProfileInitial}>U</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Unified Location Input Section */}
      <View style={styles.locationInputSection}>
        <Animated.View style={[
          styles.locationInputCard,
          { transform: [{ scale: locationCardScale }] }
        ]}>
          {/* Pickup Location */}
          <TouchableOpacity 
            style={styles.locationInputRow}
            onPress={handlePickupPress}
          >
            <View style={styles.locationDots}>
              <View style={[styles.locationDot, { backgroundColor: theme.colors.primary }]} />
            </View>
            <View style={styles.locationInputContent}>
              <Text style={styles.locationInputLabel}>Pickup</Text>
              <Text style={[styles.locationInputValue, !pickupAddress && styles.locationInputPlaceholder]}>
                {pickupAddress || 'My Location'}
              </Text>
            </View>
            {!pickupAddress && (
              <TouchableOpacity 
                style={styles.currentLocationBtn}
                onPress={handleUseCurrentLocation}
              >
                <Ionicons name="locate" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Divider Line */}
          <View style={styles.locationDivider}>
            <View style={styles.locationLine} />
          </View>

          {/* Destination */}
          <TouchableOpacity 
            style={styles.locationInputRow}
            onPress={() => {
              animateLocationCard();
              setCurrentInputField('destination');
              setDestinationFocused(true);
              setShowLocationSuggestions(true);
            }}
          >
            <View style={styles.locationDots}>
              <View style={[styles.locationDot, { backgroundColor: '#FF6B35' }]} />
            </View>
            <View style={styles.locationInputContent}>
              <Text style={styles.locationInputLabel}>Where to?</Text>
              {destinationFocused ? (
                <TextInput
                  style={styles.locationTextInput}
                  value={destinationAddress}
                  onChangeText={(text) => {
                    setDestinationAddress(text);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => {
                    setCurrentInputField('destination');
                    setDestinationFocused(true);
                    setShowLocationSuggestions(true);
                  }}
                  onBlur={() => {
                    setDestinationFocused(false);
                    if (!destinationAddress) {
                      setShowLocationSuggestions(false);
                    }
                  }}
                  placeholder="Choose destination"
                  placeholderTextColor="#999999"
                  autoFocus={true}
                  returnKeyType="search"
                  clearButtonMode="while-editing"
                />
              ) : (
                <Text style={[styles.locationInputValue, !destinationAddress && styles.locationInputPlaceholder]}>
                  {destinationAddress || 'Choose destination'}
                </Text>
              )}
            </View>
            <View style={styles.uberSecurityIndicator}>
              <Ionicons name="shield-checkmark" size={16} color="#00AA00" />
            </View>
          </TouchableOpacity>

          {/* Swap Button */}
          {pickupAddress && destinationAddress && (
            <TouchableOpacity style={styles.swapButton} onPress={handleSwapLocations}>
              <Ionicons name="swap-vertical" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Enhanced Location Suggestions Dropdown */}
        {showLocationSuggestions && (
          <View style={styles.locationSuggestionsCard}>
            <View style={styles.suggestionsHeader}>
              <Ionicons 
                name={getSuggestionHeaderText().includes('Recent') ? 'time-outline' : 
                      getSuggestionHeaderText().includes('Popular') ? 'star-outline' : 'search-outline'} 
                size={16} 
                color="#666666" 
              />
              <Text style={styles.suggestionsHeaderText}>{getSuggestionHeaderText()}</Text>
            </View>
            {filteredSuggestions.map((suggestion) => (
              <TouchableOpacity 
                key={suggestion.id} 
                style={styles.suggestionItem}
                onPress={() => handleSuggestionSelect(suggestion)}
              >
                <View style={styles.suggestionIcon}>
                  <Ionicons 
                    name={suggestion.distance === 'Popular destination' ? 'star' : 'location-outline'} 
                    size={16} 
                    color={suggestion.distance === 'Popular destination' ? '#FFD700' : '#666666'} 
                  />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionAddress}>{suggestion.address}</Text>
                </View>
                <Text style={styles.suggestionDistance}>{suggestion.distance}</Text>
              </TouchableOpacity>
            ))}
            
            {/* Show "no results" when filtering returns nothing */}
            {filteredSuggestions.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={24} color="#CCCCCC" />
                <Text style={styles.noResultsText}>No locations found</Text>
                <Text style={styles.noResultsSubtext}>Try a different search term</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Security Trust Banner */}
      <View style={styles.uberTrustBanner}>
        <Ionicons name="shield-checkmark" size={16} color="#000000" />
        <Text style={styles.uberTrustText}>TFL private hire • SIA-licensed security drivers</Text>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.uberRatingText}>4.9</Text>
      </View>

      {/* Full Screen Map Background */}
      <View style={styles.fullScreenMapContainer}>
        <GQMapView
          style={styles.fullScreenMap}
          pickupLocation={pickupCoords}
          destination={destinationCoords}
          showUserLocation={true}
          onLocationSelect={handleMapLocationSelect}
        />
        
        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Sliding Bottom Sheet */}
      <Animated.View 
        style={[styles.bottomSheet, { height: bottomSheetHeight }]}
        onTouchStart={handleBottomSheetInteraction}
      >
        {/* Redesigned Drag Handle with Rounded Pill */}
        <TouchableOpacity 
          style={[
            styles.dragHandle,
            currentSnapPoint === 'COLLAPSED' && styles.dragHandleCollapsed
          ]}
          onPress={handleCollapsedSheetTap}
          activeOpacity={currentSnapPoint === 'COLLAPSED' ? 0.8 : 1}
          disabled={currentSnapPoint !== 'COLLAPSED'}
        >
          <View 
            style={styles.dragHandleTouch} 
            {...panGesture.current?.panHandlers}
          >
            <TouchableOpacity 
              style={styles.dragHandleTouchInner} 
              onPress={handleDragHandleTap}
              activeOpacity={0.7}
            >
            {/* Rounded Handle (Pill Shape) */}
            <View style={[
              styles.dragIndicator,
              currentSnapPoint === 'HALF' && styles.dragIndicatorActive
            ]} />
            {/* Always visible state text */}
            <Text style={styles.snapPositionText}>
              {currentSnapPoint === 'COLLAPSED' ? 'Slide up to open' : 'Choose your service'}
            </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <ScrollView 
          style={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
          bounces={true} // Enable natural bouncing
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          decelerationRate="normal"
          scrollEventThrottle={16}
        >
          {/* Popular Destinations */}
          <View style={styles.popularDestinationsContainer}>
            <Text style={styles.popularDestinationsTitle}>Popular Destinations</Text>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.popularDestinationsScroll}
              contentContainerStyle={styles.popularDestinationsContent}
              decelerationRate="fast"
              snapToInterval={110}
              snapToAlignment="start"
            >
              {popularDestinations.map((destination) => (
                <TouchableOpacity 
                  key={destination.id}
                  style={[
                    styles.popularDestinationItem,
                    selectedQuickAction === destination.id && styles.popularDestinationItemSelected
                  ]}
                  onPress={() => handlePopularDestinationPress(destination)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.popularDestinationIcon,
                    { backgroundColor: destination.color + '15' }
                  ]}>
                    <Ionicons name={destination.icon} size={18} color={destination.color} />
                  </View>
                  <Text style={styles.popularDestinationText}>{destination.title}</Text>
                  <Text style={styles.popularDestinationDescription}>{destination.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Service Options - Single Full-Width Cards */}
          <View style={styles.servicesSection}>
            <Text style={styles.servicesTitle}>Choose Your Service</Text>
            <View style={styles.servicesList}>
              {services.map((service) => (
                <TouchableOpacity 
                  key={service.id} 
                  style={[
                    styles.serviceCardFullWidth,
                    selectedService === service.id && service.active && styles.serviceCardFullWidthSelected,
                    !service.active && styles.serviceCardDisabled
                  ]}
                  onPress={() => {
                    if (service.active) {
                      setSelectedService(service.id);
                    } else {
                      Alert.alert(
                        'Coming Soon', 
                        `${service.name} will be available soon! We're working hard to bring you this premium service.`,
                        [{ text: 'Got it', style: 'default' }]
                      );
                    }
                  }}
                  activeOpacity={service.active ? 0.7 : 0.9}
                >
                  {/* Service Info */}
                  <View style={styles.serviceInfoFull}>
                    <View style={styles.serviceHeaderFull}>
                      <Text 
                        style={[
                          styles.serviceNameFull, 
                          !service.active && styles.serviceTextDisabled
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {service.name}
                      </Text>
                      <View style={[
                        styles.serviceBadgeFull, 
                        { backgroundColor: service.active ? service.badgeColor : '#CCCCCC' }
                      ]}>
                        <Text style={styles.serviceBadgeTextFull}>{service.badge}</Text>
                      </View>
                    </View>
                    
                    <Text style={[
                      styles.serviceDescriptionFull,
                      !service.active && styles.serviceTextDisabled
                    ]}>
                      {service.description}
                    </Text>
                    
                    {/* Service Features */}
                    <View style={styles.serviceFeaturesContainer}>
                      {service.features.map((feature, index) => (
                        <View key={index} style={[
                          styles.serviceFeature,
                          !service.active && styles.serviceFeatureDisabled
                        ]}>
                          <Ionicons 
                            name="checkmark-circle" 
                            size={12} 
                            color={service.active ? service.color : '#CCCCCC'} 
                          />
                          <Text style={[
                            styles.serviceFeatureText,
                            !service.active && styles.serviceTextDisabled
                          ]}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>
                    
                    <View style={styles.serviceMetaFull}>
                      <Text style={[
                        styles.servicePriceFull,
                        !service.active && styles.serviceTextDisabled
                      ]}>
                        From £{service.basePrice.toFixed(2)}
                      </Text>
                      <View style={styles.serviceTrustTagsFull}>
                        {service.popular && (
                          <View style={[styles.trustTag, !service.active && styles.tagDisabled]}>
                            <Text style={[styles.trustTagText, !service.active && styles.tagTextDisabled]}>
                              Most Popular
                            </Text>
                          </View>
                        )}
                        {service.active && (
                          <View style={styles.certifiedTag}>
                            <Text style={styles.certifiedTagText}>Available</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  
                    {/* Selection Indicator or Coming Soon Badge */}
                    <View style={styles.selectionIndicatorContainer}>
                      {service.active ? (
                        <View style={[
                          styles.selectionIndicator,
                          selectedService === service.id && styles.selectionIndicatorSelected
                        ]}>
                          {selectedService === service.id && (
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                          )}
                        </View>
                      ) : (
                        <View style={styles.comingSoonIndicator}>
                          <Ionicons name="time-outline" size={16} color="#CCCCCC" />
                        </View>
                      )}
                    </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Armora Brand Section - Moved below services */}
          <View style={styles.brandSection}>
            <Text style={styles.brandTitle}>Armora - Private Hire with Security Professionals</Text>
            <Text style={styles.brandSubtitle}>TFL-approved minicab service across South East England • All drivers are SIA-licensed close protection officers</Text>
          </View>

          {/* Extra padding to prevent content being hidden behind fixed bottom button */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </Animated.View>


      {/* Fixed Bottom CTA Buttons - 70/30 Split */}
      <View style={styles.fixedBottomButtonContainer}>
        <View style={styles.ctaButtonRow}>
          {/* Primary Request Button - 70% width */}
          <TouchableOpacity
            style={[
              styles.primaryBookButton,
              styles.floatingBookButtonActive
            ]}
            activeOpacity={0.85}
            onPress={async () => {
              if (!selectedService) {
                Alert.alert('Select Service', 'Please choose a service type first.');
              } else if (!pickupCoords || !destinationCoords) {
                Alert.alert('Set Locations', 'Please set both pickup and drop-off locations.');
              } else {
                try {
                  const serviceData = services.find(s => s.id === selectedService);
                  await bookingService.startBooking({
                    pickupLocation: { coords: pickupCoords, address: pickupAddress },
                    destinationLocation: { coords: destinationCoords, address: destinationAddress },
                    selectedService: serviceData
                  });

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
            <Text style={styles.primaryBookButtonText}>{getBookingButtonText()}</Text>
          </TouchableOpacity>
          
          {/* Schedule Button - 30% width */}
          <TouchableOpacity
            style={styles.scheduleButtonIconOnly}
            activeOpacity={0.8}
            onPress={() => {
              Alert.alert('Schedule Ride', 'Schedule booking feature coming soon!', [
                { text: 'OK', style: 'default' }
              ]);
            }}
          >
            <Ionicons name="calendar-outline" size={22} color="#0FD3E3" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // UBER-STYLE HEADER STYLES
  uberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
    zIndex: 1000,
  },
  uberMenuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uberBrandSection: {
    alignItems: 'center',
    flex: 1,
  },
  uberBrandText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  uberSecurityBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: '#00AA00',
    marginTop: 2,
  },
  uberProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uberProfileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uberProfileInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // UNIFIED LOCATION INPUT SECTION
  locationInputSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    zIndex: 1001, // Above map, below bottom sheet
  },
  locationInputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 50,
  },
  locationDots: {
    alignItems: 'center',
    marginRight: 12,
    width: 20,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationDivider: {
    alignItems: 'flex-start',
    paddingLeft: 26, // Align with dots
  },
  locationLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E0E0E0',
  },
  locationInputContent: {
    flex: 1,
  },
  locationInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 2,
  },
  locationInputValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  locationInputPlaceholder: {
    color: '#999999',
    fontWeight: '400',
  },
  locationTextInput: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    padding: 0,
    margin: 0,
    minHeight: 24,
  },
  swapButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  locationSuggestionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 240,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionsHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginLeft: 8,
  },
  uberSecurityIndicator: {
    marginLeft: 8,
  },
  
  // UBER-STYLE TRUST BANNER
  uberTrustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  uberTrustText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 6,
    marginRight: 12,
    fontWeight: '500',
  },
  uberRatingText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
    marginLeft: 4,
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
  fullScreenMapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Behind UI elements
  },
  fullScreenMap: {
    flex: 1,
  },
  currentLocationButton: {
    position: 'absolute',
    top: '50%', // Halfway up the map
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0FD3E3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 999, // Always visible above bottom sheet
    marginTop: -28, // Center the button at 50% by offsetting half its height
  },
  
  // BOTTOM SHEET STYLES
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white
    backdropFilter: 'blur(20px)', // iOS blur effect
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
    zIndex: 1000,
  },
  dragHandle: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  dragHandleCollapsed: {
    backgroundColor: 'rgba(0, 200, 81, 0.05)', // Subtle highlight when collapsed
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 20, // More tappable area
  },
  dragHandleTouch: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragHandleTouchInner: {
    width: '100%',
    alignItems: 'center',
  },
  dragIndicator: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CCCCCC',
  },
  dragIndicatorActive: {
    backgroundColor: theme.colors.primary,
    width: 60,
  },
  snapPositionText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 6,
    marginBottom: 4,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  expandPrompt: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    gap: 10,
  },
  expandInstructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 211, 227, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 211, 227, 0.2)',
  },
  expandText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0FD3E3',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  servicePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 211, 227, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 211, 227, 0.3)',
  },
  servicePreviewText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0FD3E3',
    letterSpacing: 0.2,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardHeader: {
    position: 'relative',
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: theme.colors.primary + '08',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: theme.spacing.md,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  serviceSelectionContainer: {
    marginHorizontal: theme.spacing.lg,
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
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    ...theme.shadows.sm,
    marginBottom: theme.spacing.xs,
  },
  serviceRowSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '08',
    ...theme.shadows.md,
    borderLeftWidth: 6,
    transform: [{ scale: 1.01 }],
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
    ...theme.typography.titleMedium,
    fontWeight: '600',
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
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
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
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
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
  // POPULAR DESTINATIONS STYLES
  popularDestinationsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 12,
    paddingBottom: 4,
  },
  popularDestinationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 16,
    letterSpacing: -0.2,
  },
  popularDestinationsScroll: {
    paddingVertical: 8,
  },
  popularDestinationsContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  popularDestinationItem: {
    alignItems: 'center',
    width: 90,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  popularDestinationItemSelected: {
    backgroundColor: 'rgba(0, 200, 81, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 81, 0.3)',
  },
  popularDestinationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    // Add padding effect by making the circle larger relative to icon
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  popularDestinationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 14,
  },
  popularDestinationDescription: {
    fontSize: 9,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 11,
  },
  
  brandSection: {
    paddingHorizontal: 4,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    marginBottom: 16,
    backgroundColor: 'rgba(0, 200, 81, 0.02)',
    borderRadius: 8,
    marginHorizontal: -4,
    paddingHorizontal: 16,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 18,
  },
  
  // SUGGESTIONS SECTION STYLES
  suggestionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 4,
    letterSpacing: -0.3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    minHeight: 56,
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
  suggestionDistance: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'right',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginTop: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  sectionTitle: {
    ...theme.typography.headlineLarge,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    fontWeight: '700',
  },
  sectionSubtitle: {
    ...theme.typography.bodyMedium,
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
    borderRadius: 12,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    ...theme.shadows.lg,
    shadowColor: theme.colors.primary,
    minHeight: 64,
  },
  bookButtonContent: {
    flex: 1,
  },
  bookButtonText: {
    ...theme.typography.titleLarge,
    fontWeight: '600',
    color: theme.colors.surface,
    marginBottom: 2,
  },
  bookButtonSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.surface,
    opacity: 0.9,
  },
  bookButtonDisabled: {
    backgroundColor: theme.colors.gray400,
    shadowOpacity: 0.1,
  },
  bookButtonActive: {
    backgroundColor: theme.colors.success,
    ...theme.shadows.xl,
    shadowColor: theme.colors.success,
    transform: [{ scale: 1.02 }],
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
  
  // SERVICES SECTION STYLES
  servicesSection: {
    marginBottom: 20,
  },
  servicesGrid: {
    gap: 12,
    paddingHorizontal: 4,
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceCardSelected: {
    borderColor: '#0FD3E3',
    backgroundColor: '#0FD3E3' + '08',
    borderWidth: 2,
    shadowColor: '#0FD3E3',
    shadowOpacity: 0.15,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    lineHeight: 18,
  },
  serviceBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    marginTop: 4,
  },
  serviceBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'right',
  },
  
  // FULL-WIDTH SERVICE CARD STYLES
  serviceCardFullWidth: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 6,
    minHeight: 140,
  },
  serviceCardFullWidthSelected: {
    borderColor: '#0FD3E3',
    backgroundColor: 'rgba(0, 200, 81, 0.06)',
    borderWidth: 2,
    shadowColor: '#0FD3E3',
    shadowOpacity: 0.2,
    elevation: 8,
    transform: [{ scale: 1.01 }],
  },
  serviceCardDisabled: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E0E0E0',
    opacity: 0.7,
  },
  serviceIconContainerFull: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginTop: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIconDisabled: {
    backgroundColor: '#F0F0F0',
  },
  serviceInfoFull: {
    flex: 1,
  },
  serviceHeaderFull: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  serviceNameFull: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
    flex: 1,
    lineHeight: 24,
    marginRight: 12,
  },
  serviceBadgeFull: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  serviceBadgeTextFull: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serviceDescriptionFull: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceTextDisabled: {
    color: '#AAAAAA',
  },
  serviceFeaturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  serviceFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 14,
  },
  serviceFeatureDisabled: {
    backgroundColor: '#F0F0F0',
  },
  serviceFeatureText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4CAF50',
  },
  serviceMetaFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  servicePriceFull: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0FD3E3',
  },
  serviceTrustTagsFull: {
    flexDirection: 'row',
    gap: 8,
  },
  trustTag: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  trustTagText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  certifiedTag: {
    backgroundColor: '#00AA00',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  certifiedTagText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tagDisabled: {
    backgroundColor: '#CCCCCC',
  },
  tagTextDisabled: {
    color: '#FFFFFF',
  },
  selectionIndicatorContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectionIndicatorSelected: {
    borderColor: '#0FD3E3',
    backgroundColor: '#0FD3E3',
  },
  comingSoonIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  
  // REDESIGNED SERVICE CARDS - Perfect Consistency
  serviceCardCompact: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    height: 190, // Fixed height for perfect consistency
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
    position: 'relative',
  },
  serviceIconContainerCompact: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  serviceNameCompact: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 6,
    paddingHorizontal: 8,
    width: '100%',
  },
  servicePriceCompact: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0FD3E3',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  serviceDescriptionCompact: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 14,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingBottom: 16,
    flex: 1,
    width: '100%',
  },
  serviceBadgeCompact: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 80,
    zIndex: 10,
  },
  serviceBadgeTextCompact: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  
  
  // FIXED BOTTOM BUTTON STYLES - Always at Bottom
  fixedBottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 34, // Account for iPhone safe area
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 99999, // Always on top
    elevation: 50,
  },
  ctaButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryBookButton: {
    flex: 1, // Take most of the space
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    // Enhanced button appearance
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  primaryBookButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scheduleButton: {
    flex: 0.3, // 30% width
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
    borderWidth: 2.5,
    borderColor: '#0FD3E3',
    elevation: 8,
    shadowColor: '#0FD3E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    flexDirection: 'row',
    gap: 6,
  },
  scheduleButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0FD3E3',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 200, 81, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  scheduleButtonIconOnly: {
    width: 58, // Square button
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#0FD3E3',
    elevation: 8,
    shadowColor: '#0FD3E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  floatingBookButton: {
    backgroundColor: '#000000', // Uber's pure black
    borderRadius: 12, // Uber's corner radius
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content like Uber
    minHeight: 56, // Uber's button height
    minWidth: 280,
    maxWidth: 360,
    alignSelf: 'center',
    marginHorizontal: 16,
    elevation: 8, // Subtle elevation like Uber
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 99999,
    // No border - clean like Uber
  },
  floatingBookButtonDisabled: {
    backgroundColor: '#666666',
    borderColor: '#555555',
    shadowOpacity: 0.1,
    shadowColor: '#666666',
    opacity: 0.7,
  },
  floatingBookButtonActive: {
    backgroundColor: '#000000', // Keep Uber's black even when active
    shadowOpacity: 0.2,
  },
  floatingBookButtonContent: {
    alignItems: 'center', // Center text like Uber
  },
  floatingBookButtonText: {
    fontSize: 16, // Uber's font size
    fontWeight: '600', // Uber's font weight
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  
  // PROMINENT BOOKING SECTION STYLES
  prominentBookingSection: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  prominentBookButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 72,
  },
  prominentBookButtonDisabled: {
    backgroundColor: theme.colors.gray400,
    borderColor: theme.colors.gray500,
    shadowOpacity: 0.1,
  },
  prominentBookButtonActive: {
    backgroundColor: theme.colors.success,
    ...theme.shadows.lg,
    shadowColor: theme.colors.success,
    transform: [{ scale: 1.02 }],
  },
  prominentBookButtonContent: {
    flex: 1,
  },
  prominentBookButtonText: {
    ...theme.typography.headlineSmall,
    fontWeight: '700',
    color: theme.colors.surface,
    marginBottom: 4,
  },
  prominentBookButtonSubtext: {
    ...theme.typography.bodyMedium,
    color: theme.colors.surface,
    opacity: 0.9,
    fontWeight: '500',
  },
};

export default HomeScreen;