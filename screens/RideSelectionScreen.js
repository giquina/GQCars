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
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmergencyButton from '../components/ui/EmergencyButton';
import SecurityAssessmentService from '../services/SecurityAssessmentService';
import bookingService from '../services/BookingService';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const rideOptions = [
  {
    id: 1,
    name: 'Standard',
    description: 'Private Hire with Security Driver',
    features: ['SIA Licensed Driver', 'TFL Approved Vehicle', 'Professional minicab', 'Up to 4 passengers'],
    price: '$1.99',
    eta: '2 min',
    icon: 'shield-outline',
    popular: false,
    color: '#1a1a1a',
    savings: null,
  },
  {
    id: 2,
    name: 'Premium',
    description: 'Premium Private Hire with Security',
    features: ['SIA Licensed Driver', 'Enhanced protection training', 'Premium TFL vehicle', 'Enhanced security'],
    price: '$5.99',
    eta: '3 min',
    icon: 'shield-checkmark',
    popular: true,
    color: '#00C851',
    savings: 'Most Popular',
  },
  {
    id: 3,
    name: 'Executive',
    description: 'VIP Private Hire with Security',
    features: ['SIA Licensed Driver', 'Executive protection', 'Luxury TFL vehicle', 'VIP taxi service'],
    price: '$8.50',
    eta: '5 min',
    icon: 'shield-checkmark-outline',
    popular: false,
    color: '#FF6B35',
    savings: 'VIP Service',
  },
];

const RideSelectionScreen = ({ navigation, route }) => {
  const [selectedRide, setSelectedRide] = useState(rideOptions[1]); // Default to Normal
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const { destination, pickup, selectedService, serviceData } = route.params || {};
  // Removed bookingService.getInstance() - using context instead

  const handleSelectRide = async () => {
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
    
    try {
      // Update booking with selected ride
      await bookingService.selectRide(selectedRide);
      
      // Navigate to officer selection (BookingScreen)
      navigation.navigate('Booking', {
        selectedRide,
        destination,
        pickup,
        selectedService,
        serviceData
      });
    } catch (error) {
      console.error('Error selecting ride:', error);
      Alert.alert('Booking Error', 'Unable to proceed with ride selection. Please try again.');
    }
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
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressSteps}>
            <View style={[styles.progressStep, styles.progressStepCompleted]}>
              <Text style={styles.progressStepNumber}>1</Text>
            </View>
            <View style={[styles.progressLine, styles.progressLineActive]} />
            <View style={[styles.progressStep, styles.progressStepActive]}>
              <Text style={styles.progressStepNumberActive}>2</Text>
            </View>
            <View style={styles.progressLine} />
            <View style={styles.progressStep}>
              <Text style={styles.progressStepNumber}>3</Text>
            </View>
            <View style={styles.progressLine} />
            <View style={styles.progressStep}>
              <Text style={styles.progressStepNumber}>4</Text>
            </View>
          </View>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, styles.progressLabelCompleted]}>Service</Text>
            <Text style={[styles.progressLabel, styles.progressLabelActive]}>Vehicle</Text>
            <Text style={styles.progressLabel}>Officer</Text>
            <Text style={styles.progressLabel}>Payment</Text>
          </View>
        </View>

        <Text style={styles.chooseRideTitle}>Choose your ride</Text>
        <Text style={styles.chooseRideSubtitle}>All Security Officers are SIA licensed professionals</Text>
        
        
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.ridesContainer}
          contentContainerStyle={styles.ridesContentContainer}
        >
          {rideOptions.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              style={[
                styles.rideCard,
                selectedRide.id === ride.id && styles.rideCardSelected
              ]}
              onPress={() => {
                Vibration.vibrate(50); // Haptic feedback
                setSelectedRide(ride);
              }}
              activeOpacity={0.8}
            >
              {/* Header with Icon and Badge */}
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: ride.color + '15' }]}>
                  <Ionicons name={ride.icon} size={36} color={ride.color} />
                </View>
                {ride.savings && (
                  <View style={[styles.badge, { backgroundColor: ride.color }]}>
                    <Text style={styles.badgeText}>{ride.savings}</Text>
                  </View>
                )}
                {selectedRide.id === ride.id && (
                  <View style={styles.selectedCheck}>
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  </View>
                )}
              </View>

              {/* Service Name */}
              <Text style={styles.serviceName}>{ride.name}</Text>

              {/* Features List */}
              <View style={styles.featuresContainer}>
                {ride.features.slice(0, 2).map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark" size={14} color={ride.color} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Price and ETA */}
              <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>From</Text>
                  <Text style={[styles.price, { color: ride.color }]}>{ride.price}</Text>
                </View>
                <Text style={styles.eta}>{ride.eta} away</Text>
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
          title={assessmentCompleted ? "Continue to Officer Selection" : "Complete Assessment to Book"}
          onPress={handleSelectRide}
          variant={assessmentCompleted ? "primary" : "outline"}
          size="large"
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
    backgroundColor: '#FFFFFF', // Uber's clean white background
  },
  mapSection: {
    height: height * 0.4,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Lighter, cleaner gray like Uber
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
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
  ridesContentContainer: {
    paddingBottom: theme.spacing.xl,
    flexGrow: 1,
  },
  rideCard: {
    padding: 16, // Uber's 16px standard padding
    marginBottom: 8, // Tighter spacing like Uber
    borderRadius: 8, // Uber's 8px radius
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5, // Subtle border like Uber
    borderColor: '#E5E7EB',
    minHeight: 100, // More compact like Uber
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1, // Subtle shadow like Uber
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  rideCardSelected: {
    borderColor: '#000000', // Uber's black selection
    backgroundColor: '#F5F5F5', // Light gray selection like Uber
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#00C851',
  },
  badgeText: {
    ...theme.typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
  },
  selectedCheck: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  serviceName: {
    ...theme.typography.titleLarge,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    fontSize: 18,
  },
  featuresContainer: {
    marginBottom: theme.spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    marginRight: 4,
  },
  price: {
    ...theme.typography.headlineSmall,
    fontWeight: '800',
  },
  eta: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  tripDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#000000', // Uber's pure black
    borderRadius: 8, // Uber's radius
    height: 56,
  },
  selectButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  // Progress indicator styles
  progressContainer: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepCompleted: {
    backgroundColor: theme.colors.success,
  },
  progressStepActive: {
    backgroundColor: theme.colors.primary,
  },
  progressStepNumber: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray600,
    fontWeight: '600',
  },
  progressStepNumberActive: {
    ...theme.typography.labelSmall,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.gray200,
    marginHorizontal: theme.spacing.xs,
  },
  progressLineActive: {
    backgroundColor: theme.colors.success,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
  },
  progressLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray600,
    textAlign: 'center',
    flex: 1,
  },
  progressLabelCompleted: {
    color: theme.colors.success,
  },
  progressLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
};

export default RideSelectionScreen;