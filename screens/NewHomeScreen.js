import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import GQMapView from '../components/Map/MapView';
import LocationService from '../services/LocationService';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const locationSuggestions = [
  {
    id: 1,
    title: 'Times Square',
    address: '1560 Broadway, New York, NY 10036',
    distance: '0.5 mi',
  },
  {
    id: 2,
    title: 'Central Park',
    address: '59th St to 110th St, New York, NY',
    distance: '1.2 mi',
  },
  {
    id: 3,
    title: 'Brooklyn Bridge',
    address: 'Brooklyn Bridge, New York, NY 10038',
    distance: '2.1 mi',
  },
  {
    id: 4,
    title: 'Statue of Liberty',
    address: 'Liberty Island, New York, NY 10004',
    distance: '3.8 mi',
  },
  {
    id: 5,
    title: 'Empire State Building',
    address: '350 5th Ave, New York, NY 10118',
    distance: '0.8 mi',
  },
];

const NewHomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const locationService = LocationService.getInstance();

  const filteredSuggestions = searchQuery
    ? locationSuggestions.filter(
        location =>
          location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : locationSuggestions;

  const handleLocationSelect = (location) => {
    navigation.navigate('RideSelection', { destination: location });
  };

  const handleMapLocationSelect = (location) => {
    if (!pickupCoords) {
      setPickupCoords(location);
    } else {
      setDestinationCoords(location);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      setUserCoords(location);
      setPickupCoords(location);
    } catch (error) {
      Alert.alert('Location Error', 'Unable to get current location');
    }
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const location = await locationService.getCurrentLocation();
        setUserCoords(location);
      } catch (error) {
        console.log('Error getting location:', error);
      }
    };
    
    getCurrentLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Full Screen Map Background */}
      <View style={styles.mapContainer}>
        <Card style={styles.mapCard} padding="none" radius="lg">
          <GQMapView
            style={styles.map}
            pickupLocation={pickupCoords}
            destination={destinationCoords}
            showUserLocation={true}
            onLocationSelect={handleMapLocationSelect}
          />
          
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={handleUseCurrentLocation}
          >
            <Ionicons name="locate" size={24} color={theme.colors.surface} />
          </TouchableOpacity>
        </Card>
        
        {/* Top Header with Menu */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        {/* Safety Header */}
        <View style={styles.safetyHeader}>
          <View style={styles.safetyLeft}>
            <View style={styles.safetyIcon}>
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.safetyText}>Licensed security professionals</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Where are you going section */}
        <View style={styles.destinationSection}>
          <Text style={styles.destinationTitle}>Where do you need to go safely?</Text>
          <Text style={styles.destinationSubtitle}>Every driver is a licensed security professional</Text>
          
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Book your ride with a trained security driver"
              placeholderTextColor={theme.colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Location Suggestions */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.suggestionsContainer}>
            {filteredSuggestions.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.locationItem}
                onPress={() => handleLocationSelect(location)}
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
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapCard: {
    flex: 1,
  },
  map: {
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
    ...theme.shadows.md,
  },
  topHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  bottomCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    maxHeight: height * 0.6,
    ...theme.shadows.xl,
  },
  safetyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  safetyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  safetyText: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  destinationSection: {
    flex: 1,
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
    backgroundColor: theme.colors.gray100,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  suggestionsContainer: {
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
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
};

export default NewHomeScreen;