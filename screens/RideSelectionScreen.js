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
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const rideOptions = [
  {
    id: 1,
    name: 'Economy',
    description: 'Licensed security driver',
    features: ['Professional driver', 'Up to 4 passengers', 'Standard vehicle'],
    price: '$1.99',
    eta: '2 min',
    icon: 'car-outline',
    popular: false,
    color: '#6B7280',
    savings: null,
  },
  {
    id: 2,
    name: 'Comfort',
    description: 'Licensed security driver',
    features: ['Professional driver', 'Up to 4 passengers', 'Premium vehicle', 'Enhanced comfort'],
    price: '$5.99',
    eta: '3 min',
    icon: 'car-sport-outline',
    popular: true,
    color: '#00C851',
    savings: 'Most Popular',
  },
  {
    id: 3,
    name: 'Premium',
    description: 'Licensed security driver',
    features: ['Professional driver', 'Up to 6 passengers', 'Luxury vehicle', 'VIP service'],
    price: '$6.00',
    eta: '5 min',
    icon: 'bus-outline',
    popular: false,
    color: '#FF6B35',
    savings: 'Executive',
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
          title={assessmentCompleted ? "🚗 Book Safe Transport" : "🛡️ Complete Assessment to Book"}
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
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.gray200,
    minHeight: 140,
    ...theme.shadows.md,
  },
  rideCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '08',
    borderWidth: 3,
    ...theme.shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    ...theme.typography.labelSmall,
    color: theme.colors.surface,
    fontWeight: '700',
    fontSize: 10,
  },
  selectedCheck: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  serviceName: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
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