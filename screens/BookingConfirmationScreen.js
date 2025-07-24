import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmergencyButton from '../components/ui/EmergencyButton';
import bookingService from '../services/BookingService';
import PaymentService from '../services/PaymentService';
import theme from '../theme';

const BookingConfirmationScreen = ({ navigation, route }) => {
  const { bookingDetails } = route.params || {};
  
  const [isLoading, setIsLoading] = useState(false);
  const [pricingData, setPricingData] = useState(null);
  const [selectedRideType, setSelectedRideType] = useState('comfort');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Ride type options
  const rideTypes = [
    {
      id: 'economy',
      name: 'Economy',
      description: 'Licensed security driver',
      features: ['Professional driver', 'Up to 4 passengers', 'Standard vehicle'],
      icon: 'car-outline',
      color: '#6B7280',
    },
    {
      id: 'comfort',
      name: 'Comfort',
      description: 'Licensed security driver',
      features: ['Professional driver', 'Up to 4 passengers', 'Premium vehicle', 'Enhanced comfort'],
      icon: 'car-sport-outline',
      color: '#00C851',
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Licensed security driver',
      features: ['Professional driver', 'Up to 6 passengers', 'Luxury vehicle', 'VIP service'],
      icon: 'bus-outline',
      color: '#FF6B35',
    },
  ];

  useEffect(() => {
    loadPaymentMethods();
    calculatePricing();
  }, [selectedRideType]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await PaymentService.getPaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0]);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const calculatePricing = () => {
    if (!bookingDetails) return;

    const distance = bookingDetails.distance || 5; // Default 5km
    const duration = bookingDetails.estimatedDuration || 15; // Default 15min
    const isScheduled = bookingDetails.schedulingType === 'scheduled';
    
    const pricing = bookingService.calculatePrice(selectedRideType, distance, duration);
    
    // Add service charges
    const serviceTotal = bookingDetails.serviceTotal || 0;
    const totalPrice = pricing.finalPrice + serviceTotal;
    
    setPricingData({
      ...pricing,
      serviceTotal,
      totalPrice,
      distance,
      duration,
    });
  };

  const handleConfirmBooking = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Required', 'Please select a payment method to continue.');
      return;
    }

    try {
      setIsLoading(true);

      // Update booking with final details
      const finalBookingData = {
        ...bookingDetails,
        rideType: selectedRideType,
        pricing: pricingData,
        paymentMethod: selectedPaymentMethod,
        status: 'confirmed',
      };

      await bookingService.createBooking(finalBookingData);

      // Process payment
      const paymentResult = await PaymentService.processPayment({
        amount: pricingData.totalPrice,
        paymentMethodId: selectedPaymentMethod.id,
        description: `GQCars ride from ${bookingDetails.pickup.address}`,
      });

      if (paymentResult.success) {
        // Navigate to booking status screen
        navigation.navigate('BookingStatus', { 
          bookingId: bookingService.getCurrentBooking()?.id 
        });
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      Alert.alert('Booking Error', 'Unable to confirm your booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (bookingDetails) => {
    if (bookingDetails.schedulingType === 'immediate') {
      return 'Book Now';
    } else {
      const { date, time } = bookingDetails.scheduledDateTime;
      return `${new Date(date).toLocaleDateString('en-GB', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })} at ${time}`;
    }
  };

  const selectedRide = rideTypes.find(ride => ride.id === selectedRideType);

  if (!bookingDetails || !pricingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <Text style={styles.loadingText}>Calculating pricing...</Text>
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
        
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        
        <EmergencyButton 
          size="small"
          onEmergencyActivated={() => navigation.navigate('Emergency')}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Details */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Trip Details</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tripDetails}>
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, styles.pickupDot]} />
              <Text style={styles.locationText}>{bookingDetails.pickup.address}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, styles.destinationDot]} />
              <Text style={styles.locationText}>{bookingDetails.destination.address}</Text>
            </View>
          </View>

          <View style={styles.tripMeta}>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{formatDateTime(bookingDetails)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{bookingDetails.passengers.count} passenger{bookingDetails.passengers.count > 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="map-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{pricingData.distance.toFixed(1)} km • {pricingData.duration} min</Text>
            </View>
          </View>
        </Card>

        {/* Ride Selection */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Select Vehicle Type</Text>
          {rideTypes.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              style={[
                styles.rideOption,
                selectedRideType === ride.id && styles.rideOptionSelected
              ]}
              onPress={() => setSelectedRideType(ride.id)}
            >
              <View style={styles.rideHeader}>
                <View style={[styles.rideIcon, { backgroundColor: ride.color + '15' }]}>
                  <Ionicons name={ride.icon} size={24} color={ride.color} />
                </View>
                <View style={styles.rideInfo}>
                  <View style={styles.rideNameRow}>
                    <Text style={styles.rideName}>{ride.name}</Text>
                    {ride.popular && (
                      <View style={[styles.popularBadge, { backgroundColor: ride.color }]}>
                        <Text style={styles.popularText}>Popular</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.rideDescription}>{ride.description}</Text>
                </View>
                <View style={styles.ridePricing}>
                  <Text style={[styles.ridePrice, { color: ride.color }]}>
                    £{bookingService.calculatePrice(ride.id, pricingData.distance, pricingData.duration).total.toFixed(2)}
                  </Text>
                  <Text style={styles.rideEta}>3-5 min</Text>
                </View>
              </View>
              
              <View style={styles.rideFeatures}>
                {ride.features.slice(0, 3).map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark" size={12} color={ride.color} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Additional Services */}
        {bookingDetails.additionalServices && bookingDetails.additionalServices.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Additional Services</Text>
            {bookingDetails.additionalServices.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Ionicons name={service.icon} size={16} color={theme.colors.primary} />
                  <Text style={styles.serviceName}>{service.name}</Text>
                </View>
                <Text style={styles.servicePrice}>+£{service.price.toFixed(2)}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Payment Method */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}>
              <Text style={styles.editButton}>Change</Text>
            </TouchableOpacity>
          </View>
          
          {selectedPaymentMethod ? (
            <View style={styles.paymentMethod}>
              <View style={styles.paymentIcon}>
                <Ionicons 
                  name={selectedPaymentMethod.type === 'card' ? 'card-outline' : 'wallet-outline'} 
                  size={20} 
                  color={theme.colors.primary} 
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{selectedPaymentMethod.name}</Text>
                <Text style={styles.paymentDetails}>
                  {selectedPaymentMethod.type === 'card' 
                    ? `•••• •••• •••• ${selectedPaymentMethod.last4}`
                    : selectedPaymentMethod.email}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addPaymentButton}
              onPress={() => navigation.navigate('AddPaymentMethod')}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.addPaymentText}>Add Payment Method</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Price Breakdown */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base fare</Text>
              <Text style={styles.priceValue}>£{pricingData.breakdown.baseFare.toFixed(2)}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Distance ({pricingData.distance.toFixed(1)} km)</Text>
              <Text style={styles.priceValue}>£{pricingData.breakdown.distanceFee.toFixed(2)}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Time ({pricingData.duration} min)</Text>
              <Text style={styles.priceValue}>£{pricingData.breakdown.timeFee.toFixed(2)}</Text>
            </View>

            {pricingData.breakdown.schedulingFee > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Scheduling fee</Text>
                <Text style={styles.priceValue}>£{pricingData.breakdown.schedulingFee.toFixed(2)}</Text>
              </View>
            )}

            {pricingData.serviceTotal > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Additional services</Text>
                <Text style={styles.priceValue}>£{pricingData.serviceTotal.toFixed(2)}</Text>
              </View>
            )}

            {pricingData.surgeMultiplier > 1.1 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: theme.colors.warning }]}>
                  Surge pricing ({pricingData.surgeMultiplier.toFixed(1)}x)
                </Text>
                <Text style={[styles.priceValue, { color: theme.colors.warning }]}>
                  +£{pricingData.breakdown.surgeFee.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.priceDivider} />
            
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>£{pricingData.totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </Card>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By confirming this booking, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <Button
          title={`Confirm Booking • £${pricingData.totalPrice.toFixed(2)}`}
          onPress={handleConfirmBooking}
          loading={isLoading}
          disabled={!selectedPaymentMethod || isLoading}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
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
    padding: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '600',
  },
  editButton: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  tripDetails: {
    marginBottom: theme.spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.md,
  },
  pickupDot: {
    backgroundColor: theme.colors.primary,
  },
  destinationDot: {
    backgroundColor: theme.colors.error,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.gray300,
    marginLeft: 5,
    marginBottom: theme.spacing.sm,
  },
  locationText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    flex: 1,
  },
  tripMeta: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  metaText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  rideOption: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  rideOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '08',
  },
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  rideIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rideInfo: {
    flex: 1,
  },
  rideNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rideName: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  popularBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: theme.spacing.sm,
  },
  popularText: {
    ...theme.typography.labelSmall,
    color: theme.colors.surface,
    fontSize: 10,
  },
  rideDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  ridePricing: {
    alignItems: 'flex-end',
  },
  ridePrice: {
    ...theme.typography.titleLarge,
    fontWeight: '700',
  },
  rideEta: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  rideFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  servicePrice: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
  },
  paymentDetails: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
  },
  addPaymentText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  priceBreakdown: {
    // No specific styles needed
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  priceLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
  },
  priceValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  priceDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  totalLabel: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  totalValue: {
    ...theme.typography.titleMedium,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  termsContainer: {
    marginVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  termsText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
};

export default BookingConfirmationScreen;