import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmergencyButton from '../components/ui/EmergencyButton';
import GQMapView from '../components/Map';
import LocationService from '../services/LocationService';
import bookingService from '../services/BookingService';
import theme from '../theme';

const BookingLocationScreen = ({ navigation, route }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [recentLocations, setRecentLocations] = useState([]);
  const [errors, setErrors] = useState({});

  // Sample recent locations for demonstration
  const sampleRecentLocations = [
    {
      id: 1,
      name: 'Home',
      address: '123 London Road, SW1A 1AA',
      coords: { latitude: 51.5074, longitude: -0.1278 },
      icon: 'home-outline',
    },
    {
      id: 2,
      name: 'Office',
      address: 'Canary Wharf, E14 5AB',
      coords: { latitude: 51.5048, longitude: -0.0195 },
      icon: 'business-outline',
    },
    {
      id: 3,
      name: 'Heathrow Airport',
      address: 'Terminal 5, TW6 2GA',
      coords: { latitude: 51.4700, longitude: -0.4543 },
      icon: 'airplane-outline',
    },
  ];

  useEffect(() => {
    getCurrentLocation();
    setRecentLocations(sampleRecentLocations);
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);
      
      // Set pickup to current location by default
      if (location) {
        setPickupCoords(location);
        setPickupLocation('Current Location');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Location Error', 'Unable to get your current location. Please enter pickup manually.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationSearch = async (query, isPickup = true) => {
    try {
      if (query.length < 3) return;
      
      // Simulate location search - in real app, this would call a geocoding service
      const mockResults = [
        {
          name: query + ' - Central London',
          address: query + ', London, UK',
          coords: { latitude: 51.5074 + (Math.random() - 0.5) * 0.1, longitude: -0.1278 + (Math.random() - 0.5) * 0.1 },
        },
        {
          name: query + ' - City of London',
          address: query + ', City of London, UK',
          coords: { latitude: 51.5155 + (Math.random() - 0.5) * 0.1, longitude: -0.0922 + (Math.random() - 0.5) * 0.1 },
        },
      ];

      return mockResults;
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    }
  };

  const selectLocation = (location, isPickup = true) => {
    if (isPickup) {
      setPickupLocation(location.name || location.address);
      setPickupCoords(location.coords);
      setErrors(prev => ({ ...prev, pickup: null }));
    } else {
      setDestinationLocation(location.name || location.address);
      setDestinationCoords(location.coords);
      setErrors(prev => ({ ...prev, destination: null }));
    }
    Keyboard.dismiss();
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!pickupLocation.trim()) {
      newErrors.pickup = 'Pickup location is required';
    }

    if (!destinationLocation.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (pickupLocation === destinationLocation && pickupLocation.trim()) {
      newErrors.destination = 'Pickup and destination cannot be the same';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setIsLoadingBooking(true);

      // Create initial booking data
      const bookingData = {
        pickup: {
          address: pickupLocation,
          coordinates: pickupCoords,
        },
        destination: {
          address: destinationLocation,
          coordinates: destinationCoords,
        },
        distance: calculateDistance(pickupCoords, destinationCoords),
        estimatedDuration: 15, // Sample duration in minutes
      };

      await bookingService.createBooking(bookingData);

      // Navigate to booking details screen
      navigation.navigate('BookingDetails', { bookingData });
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Booking Error', 'Unable to create booking. Please try again.');
    } finally {
      setIsLoadingBooking(false);
    }
  };

  const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) return 0;
    
    // Simple distance calculation (Haversine formula)
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const swapLocations = () => {
    const tempLocation = pickupLocation;
    const tempCoords = pickupCoords;
    
    setPickupLocation(destinationLocation);
    setPickupCoords(destinationCoords);
    setDestinationLocation(tempLocation);
    setDestinationCoords(tempCoords);
    
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Set Locations</Text>
        
        <EmergencyButton 
          size="small"
          onEmergencyActivated={() => navigation.navigate('Emergency')}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map Preview */}
        <View style={styles.mapContainer}>
          {currentLocation && (
            <GQMapView
              style={styles.map}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
            />
          )}
          
          {isLoadingLocation && (
            <View style={styles.mapLoadingOverlay}>
              <LoadingSpinner size="large" />
              <Text style={styles.mapLoadingText}>Getting your location...</Text>
            </View>
          )}
        </View>

        {/* Location Inputs */}
        <View style={styles.inputContainer}>
          <View style={styles.locationInputs}>
            {/* Pickup Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.locationDot} style={[styles.locationDot, styles.pickupDot]} />
              <Input
                placeholder="Enter pickup location"
                value={pickupLocation}
                onChangeText={setPickupLocation}
                leftIcon="ellipse"
                rightIcon={pickupLocation ? "close-circle" : "location"}
                onRightIconPress={pickupLocation ? () => setPickupLocation('') : getCurrentLocation}
                error={errors.pickup}
                style={styles.locationInput}
              />
            </View>

            {/* Swap Button */}
            <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
              <Ionicons name="swap-vertical" size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            {/* Destination Input */}
            <View style={styles.inputWrapper}>
              <View style={[styles.locationDot, styles.destinationDot]} />
              <Input
                placeholder="Enter destination"
                value={destinationLocation}
                onChangeText={setDestinationLocation}
                leftIcon="location"
                rightIcon={destinationLocation ? "close-circle" : null}
                onRightIconPress={destinationLocation ? () => setDestinationLocation('') : null}
                error={errors.destination}
                style={styles.locationInput}
              />
            </View>
          </View>

          {/* Recent Locations */}
          <View style={styles.recentLocations}>
            <Text style={styles.sectionTitle}>Recent Locations</Text>
            {recentLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.recentLocationItem}
                onPress={() => {
                  if (!pickupLocation) {
                    selectLocation(location, true);
                  } else if (!destinationLocation) {
                    selectLocation(location, false);
                  } else {
                    // Show options to replace pickup or destination
                    Alert.alert(
                      'Select Location',
                      'Choose where to set this location:',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Set as Pickup', onPress: () => selectLocation(location, true) },
                        { text: 'Set as Destination', onPress: () => selectLocation(location, false) },
                      ]
                    );
                  }
                }}
              >
                <View style={styles.recentLocationIcon}>
                  <Ionicons name={location.icon} size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.recentLocationText}>
                  <Text style={styles.recentLocationName}>{location.name}</Text>
                  <Text style={styles.recentLocationAddress}>{location.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={isLoadingBooking}
          disabled={!pickupLocation || !destinationLocation || isLoadingBooking}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 200,
    backgroundColor: theme.colors.gray100,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLoadingText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  inputContainer: {
    padding: theme.spacing.lg,
  },
  locationInputs: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.md,
    marginTop: -theme.spacing.md,
  },
  pickupDot: {
    backgroundColor: theme.colors.primary,
  },
  destinationDot: {
    backgroundColor: theme.colors.error,
  },
  locationInput: {
    flex: 1,
    marginBottom: 0,
  },
  swapButton: {
    alignSelf: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
    marginLeft: 24, // Align with dots
  },
  recentLocations: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  recentLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  recentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  recentLocationText: {
    flex: 1,
  },
  recentLocationName: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  recentLocationAddress: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
};

export default BookingLocationScreen;