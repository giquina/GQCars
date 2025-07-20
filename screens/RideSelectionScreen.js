import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmergencyButton from '../components/ui/EmergencyButton';
import SecurityAssessmentService from '../services/SecurityAssessmentService';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const rideOptions = [
  {
    id: 1,
    name: 'Economy',
    description: 'Licensed security driver • Up to 4 people',
    price: '$1.99',
    eta: '2 min',
    icon: 'car-outline',
    popular: false,
  },
  {
    id: 2,
    name: 'Comfort',
    description: 'Licensed security driver • Up to 4 people',
    price: '$5.99',
    eta: '3 min',
    icon: 'car-sport-outline',
    popular: true,
  },
  {
    id: 3,
    name: 'Premium',
    description: 'Licensed security driver • Up to 6 people',
    price: '$6.00',
    eta: '5 min',
    icon: 'bus-outline',
    popular: false,
  },
];

const RideSelectionScreen = ({ navigation, route }) => {
  const [selectedRide, setSelectedRide] = useState(rideOptions[1]); // Default to Normal
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const { destination } = route.params || {};

  const handleSelectRide = () => {
    if (!assessmentCompleted) {
      Alert.alert(
        'Security Assessment Required', 
        'Please complete your security assessment before booking.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start Assessment', onPress: () => navigation.navigate('Assessment') }
        ]
      );
      return;
    }
    
    navigation.navigate('DriverConnection', {
      selectedRide,
      destination,
    });
  };

  useEffect(() => {
    // Listen for assessment completion changes
    const unsubscribe = SecurityAssessmentService.addListener((status) => {
      setAssessmentCompleted(status.isCompleted);
    });

    // Initial check
    setAssessmentCompleted(SecurityAssessmentService.isAssessmentCompleted());

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Map Section */}
      <View style={styles.mapSection}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.routeLine} />
          <View style={[styles.mapPin, styles.pickupPin]}>
            <Ionicons name="ellipse" size={12} color={theme.colors.primary} />
          </View>
          <View style={[styles.mapPin, styles.destinationPin]}>
            <Ionicons name="location" size={16} color={theme.colors.error} />
          </View>
          <Text style={styles.mapLabel}>Route to {destination?.title || 'Destination'}</Text>
        </View>
        
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        {/* Emergency Button */}
        <View style={styles.emergencyButtonContainer}>
          <EmergencyButton 
            size="medium"
            onEmergencyActivated={() => {
              // Optional: Navigate to emergency screen or show specific UI
              navigation.navigate('Emergency');
            }}
          />
        </View>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <Text style={styles.chooseRideTitle}>Choose your ride</Text>
        <Text style={styles.chooseRideSubtitle}>All drivers are licensed security professionals</Text>
        
        
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.ridesContainer}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
        >
          {rideOptions.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              style={[
                styles.rideCard,
                selectedRide.id === ride.id && styles.rideCardSelected
              ]}
              onPress={() => setSelectedRide(ride)}
            >
              <View style={styles.rideLeft}>
                <View style={styles.rideIconContainer}>
                  <Ionicons name={ride.icon} size={32} color={theme.colors.text} />
                  {ride.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                </View>
                <View style={styles.rideInfo}>
                  <Text style={styles.rideName}>{ride.name}</Text>
                  <Text style={styles.rideDescription}>{ride.description}</Text>
                  <Text style={styles.rideEta}>{ride.eta} away</Text>
                </View>
              </View>
              
              <View style={styles.rideRight}>
                <Text style={styles.ridePrice}>{ride.price}</Text>
                {selectedRide.id === ride.id && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trip Details */}
        <View style={styles.tripDetails}>
          <View style={styles.tripDetailRow}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.tripDetailText}>Estimated time: 12 min</Text>
          </View>
          <View style={styles.tripDetailRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.tripDetailText}>Distance: 3.2 km</Text>
          </View>
        </View>

        {/* Select Ride Button */}
        <Button
          title={assessmentCompleted ? "Book Safe Transport" : "Complete Assessment to Book"}
          onPress={handleSelectRide}
          style={[
            styles.selectButton,
            !assessmentCompleted && styles.selectButtonDisabled
          ]}
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
  mapSection: {
    height: height * 0.4,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 1,
  },
  mapPin: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  pickupPin: {
    top: '28%',
    left: '18%',
  },
  destinationPin: {
    top: '28%',
    right: '18%',
  },
  mapLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: theme.spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  emergencyButtonContainer: {
    position: 'absolute',
    top: 50,
    right: theme.spacing.lg,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    ...theme.shadows.xl,
  },
  chooseRideTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  chooseRideSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  ridesContainer: {
    flex: 1,
    marginBottom: theme.spacing.lg,
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    minHeight: 80,
    ...theme.shadows.sm,
  },
  rideCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '08',
  },
  rideLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rideIconContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  popularText: {
    ...theme.typography.labelSmall,
    color: theme.colors.surface,
    fontSize: 8,
  },
  rideInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
  },
  rideName: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  rideDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  rideEta: {
    ...theme.typography.labelSmall,
    color: theme.colors.primary,
    marginTop: 2,
  },
  rideRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  ridePrice: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '700',
  },
  selectedIndicator: {
    marginTop: theme.spacing.xs,
  },
  tripDetails: {
    backgroundColor: theme.colors.gray50,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  tripDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  tripDetailText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  selectButton: {
    backgroundColor: theme.colors.text,
  },
  selectButtonDisabled: {
    backgroundColor: theme.colors.gray400,
    opacity: 0.6,
  },
};

export default RideSelectionScreen;