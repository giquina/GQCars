import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import MapView from '../components/Map';
import { useBooking } from '../context/BookingContext';
import theme from '../theme';

const TrackRideScreen = ({ navigation }) => {
  const { currentBooking, getCurrentBookingStatus } = useBooking();
  const [driverLocation, setDriverLocation] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(8);

  useEffect(() => {
    // Simulate driver location updates
    const interval = setInterval(() => {
      if (currentBooking?.driver) {
        setDriverLocation({
          latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
          longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
        });
        
        setEstimatedArrival(prev => Math.max(1, prev - 1));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentBooking]);

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            // Handle cancellation
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  const handleContactDriver = () => {
    Alert.alert(
      'Contact Driver',
      'How would you like to contact your driver?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Call driver') },
        { text: 'Message', onPress: () => console.log('Message driver') }
      ]
    );
  };

  if (!currentBooking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noBookingContainer}>
          <Ionicons name="car-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.noBookingText}>No active ride to track</Text>
          <Button
            title="Book a Ride"
            onPress={() => navigation.navigate('Home')}
            style={styles.bookRideButton}
          />
        </View>
      </SafeAreaView>
    );
  }

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
        
        <Text style={styles.headerTitle}>Track Ride</Text>
        
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => navigation.navigate('Emergency')}
        >
          <Ionicons name="warning" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          pickupLocation={currentBooking.pickup?.coordinates}
          destination={currentBooking.destination?.coordinates}
          driverLocation={driverLocation}
        />
        
        {/* Status Overlay */}
        <View style={styles.statusOverlay}>
          <View style={styles.statusContent}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {currentBooking.status === 'driver_assigned' ? 'Driver on the way' : 'In progress'}
            </Text>
          </View>
          <Text style={styles.etaText}>ETA: {estimatedArrival} min</Text>
        </View>
      </View>

      {/* Ride Details */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Driver Info */}
        {currentBooking.driver && (
          <Card style={styles.driverCard}>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={32} color={theme.colors.primary} />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{currentBooking.driver.name}</Text>
                <Text style={styles.driverRating}>
                  ⭐ {currentBooking.driver.rating} • SIA Licensed
                </Text>
                <Text style={styles.vehicleInfo}>
                  {currentBooking.driver.vehicle.color} {currentBooking.driver.vehicle.make} {currentBooking.driver.vehicle.model}
                </Text>
                <Text style={styles.licensePlate}>
                  {currentBooking.driver.vehicle.licensePlate}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={handleContactDriver}
              >
                <Ionicons name="call" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Trip Details */}
        <Card style={styles.tripCard}>
          <Text style={styles.cardTitle}>Trip Details</Text>
          
          <View style={styles.locationItem}>
            <View style={[styles.locationDot, styles.pickupDot]} />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationAddress}>{currentBooking.pickup?.address}</Text>
            </View>
          </View>
          
          <View style={styles.locationItem}>
            <View style={[styles.locationDot, styles.destinationDot]} />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Destination</Text>
              <Text style={styles.locationAddress}>{currentBooking.destination?.address}</Text>
            </View>
          </View>

          <View style={styles.tripMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Service</Text>
              <Text style={styles.metaValue}>{currentBooking.serviceType}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Distance</Text>
              <Text style={styles.metaValue}>{currentBooking.distance?.toFixed(1)} km</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Fare</Text>
              <Text style={styles.metaValue}>£{currentBooking.priceEstimate?.total}</Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Contact Support"
            variant="outline"
            onPress={() => {
              Alert.alert('Support', '24/7 support: +44 20 1234 5678');
            }}
            style={styles.actionButton}
          />
          
          <Button
            title="Cancel Ride"
            variant="outline"
            onPress={handleCancelRide}
            style={[styles.actionButton, styles.cancelButton]}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </ScrollView>
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
  emergencyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  statusOverlay: {
    position: 'absolute',
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  etaText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  driverCard: {
    marginBottom: theme.spacing.lg,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  driverRating: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  vehicleInfo: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  licensePlate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripCard: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: theme.spacing.md,
  },
  pickupDot: {
    backgroundColor: theme.colors.primary,
  },
  destinationDot: {
    backgroundColor: theme.colors.error,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  locationAddress: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  actions: {
    gap: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  cancelButton: {
    borderColor: theme.colors.error,
  },
  cancelButtonText: {
    color: theme.colors.error,
  },
  noBookingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  noBookingText: {
    ...theme.typography.headlineSmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  bookRideButton: {
    width: '100%',
    maxWidth: 300,
  },
};

export default TrackRideScreen;