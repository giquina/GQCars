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
import { useBooking } from '../context/BookingContext';
import theme from '../theme';

const BookingCompleteScreen = ({ navigation, route }) => {
  const { bookingData } = route.params || {};
  const { clearCurrentBooking } = useBooking();
  const [showReceipt, setShowReceipt] = useState(false);

  const completedBooking = bookingData || {
    id: 'GQ' + Date.now(),
    pickup: { address: 'Current Location' },
    destination: { address: 'Destination' },
    driver: { name: 'Marcus Steel', rating: 4.9 },
    priceEstimate: { total: 15.50 },
    serviceType: 'standard',
    status: 'completed',
    completedAt: new Date().toISOString(),
  };

  useEffect(() => {
    // Clear current booking on mount
    clearCurrentBooking();
  }, [clearCurrentBooking]);

  const handleBookAnother = () => {
    navigation.navigate('Home');
  };

  const handleViewReceipt = () => {
    setShowReceipt(true);
  };

  const handleRateDriver = () => {
    Alert.alert(
      'Rate Your Driver',
      'How was your experience with ' + completedBooking.driver?.name + '?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '⭐⭐⭐⭐⭐ Excellent', onPress: () => submitRating(5) },
        { text: '⭐⭐⭐⭐ Good', onPress: () => submitRating(4) },
        { text: '⭐⭐⭐ Average', onPress: () => submitRating(3) },
      ]
    );
  };

  const submitRating = (rating) => {
    Alert.alert('Thank You!', `You rated ${rating} stars. Your feedback helps us improve our service.`);
  };

  const handleShare = () => {
    Alert.alert(
      'Share Ride',
      'Share your secure transport experience',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share Receipt', onPress: () => console.log('Share receipt') },
        { text: 'Share App', onPress: () => console.log('Share app') },
      ]
    );
  };

  if (showReceipt) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        
        {/* Receipt Header */}
        <View style={styles.receiptHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowReceipt(false)}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Receipt</Text>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.receiptContent}>
          <Card style={styles.receiptCard}>
            {/* Receipt Header */}
            <View style={styles.receiptTop}>
              <Text style={styles.receiptTitle}>🛡️ GQCars</Text>
              <Text style={styles.receiptSubtitle}>Security Transport Receipt</Text>
              <Text style={styles.receiptId}>Booking ID: {completedBooking.id}</Text>
              <Text style={styles.receiptDate}>
                {new Date(completedBooking.completedAt).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>

            {/* Trip Details */}
            <View style={styles.receiptSection}>
              <Text style={styles.sectionTitle}>Trip Details</Text>
              
              <View style={styles.locationItem}>
                <View style={[styles.locationDot, styles.pickupDot]} />
                <View>
                  <Text style={styles.locationLabel}>Pickup</Text>
                  <Text style={styles.locationAddress}>{completedBooking.pickup?.address}</Text>
                </View>
              </View>
              
              <View style={styles.locationItem}>
                <View style={[styles.locationDot, styles.destinationDot]} />
                <View>
                  <Text style={styles.locationLabel}>Destination</Text>
                  <Text style={styles.locationAddress}>{completedBooking.destination?.address}</Text>
                </View>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Service Type</Text>
                <Text style={styles.receiptValue}>{completedBooking.serviceType}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Driver</Text>
                <Text style={styles.receiptValue}>{completedBooking.driver?.name}</Text>
              </View>
            </View>

            {/* Fare Breakdown */}
            <View style={styles.receiptSection}>
              <Text style={styles.sectionTitle}>Fare Breakdown</Text>
              
              {completedBooking.priceEstimate && (
                <>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Base Fare</Text>
                    <Text style={styles.receiptValue}>£{completedBooking.priceEstimate.baseFare || '5.00'}</Text>
                  </View>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Distance</Text>
                    <Text style={styles.receiptValue}>£{completedBooking.priceEstimate.distanceFare || '3.50'}</Text>
                  </View>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Time</Text>
                    <Text style={styles.receiptValue}>£{completedBooking.priceEstimate.timeFare || '2.25'}</Text>
                  </View>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Service Fee</Text>
                    <Text style={styles.receiptValue}>£{completedBooking.priceEstimate.serviceFee || '1.08'}</Text>
                  </View>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>VAT (20%)</Text>
                    <Text style={styles.receiptValue}>£{completedBooking.priceEstimate.vat || '2.37'}</Text>
                  </View>
                  
                  <View style={[styles.receiptRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>£{completedBooking.priceEstimate.total}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Payment Method */}
            <View style={styles.receiptSection}>
              <Text style={styles.sectionTitle}>Payment</Text>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Payment Method</Text>
                <Text style={styles.receiptValue}>Card ending in 4242</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Status</Text>
                <Text style={[styles.receiptValue, styles.paidStatus]}>Paid</Text>
              </View>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
          </View>
          
          <Text style={styles.successTitle}>Trip Complete!</Text>
          <Text style={styles.successSubtitle}>
            Thank you for choosing GQCars for your secure transport
          </Text>
          
          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingId}>{completedBooking.id}</Text>
          </View>
        </View>

        {/* Trip Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Trip Summary</Text>
          
          <View style={styles.tripInfo}>
            <View style={styles.locationItem}>
              <View style={[styles.locationDot, styles.pickupDot]} />
              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>From</Text>
                <Text style={styles.locationAddress}>{completedBooking.pickup?.address}</Text>
              </View>
            </View>
            
            <View style={styles.locationItem}>
              <View style={[styles.locationDot, styles.destinationDot]} />
              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>To</Text>
                <Text style={styles.locationAddress}>{completedBooking.destination?.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Total Fare</Text>
            <Text style={styles.fareAmount}>£{completedBooking.priceEstimate?.total}</Text>
          </View>
        </Card>

        {/* Driver Info */}
        {completedBooking.driver && (
          <Card style={styles.driverCard}>
            <Text style={styles.cardTitle}>Your Security Driver</Text>
            
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={32} color={theme.colors.primary} />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{completedBooking.driver.name}</Text>
                <Text style={styles.driverRating}>
                  ⭐ {completedBooking.driver.rating} • SIA Licensed Professional
                </Text>
              </View>
            </View>
            
            <Button
              title="Rate Your Driver"
              variant="outline"
              onPress={handleRateDriver}
              style={styles.rateButton}
            />
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="View Receipt"
            variant="outline"
            onPress={handleViewReceipt}
            style={styles.actionButton}
            leftIcon="receipt-outline"
          />
          
          <Button
            title="Book Another Ride"
            onPress={handleBookAnother}
            style={styles.actionButton}
            leftIcon="car-outline"
          />
        </View>

        {/* Support */}
        <View style={styles.supportSection}>
          <Text style={styles.supportText}>
            Need help? Contact our 24/7 support team
          </Text>
          <Button
            title="Contact Support"
            variant="ghost"
            onPress={() => Alert.alert('Support', '24/7 Hotline: +44 20 1234 5678')}
            style={styles.supportButton}
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
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  successIcon: {
    marginBottom: theme.spacing.lg,
  },
  successTitle: {
    ...theme.typography.displaySmall,
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  successSubtitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  bookingIdContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  bookingIdLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  bookingId: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  summaryCard: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  tripInfo: {
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
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  fareLabel: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  fareAmount: {
    ...theme.typography.titleLarge,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  driverCard: {
    marginBottom: theme.spacing.lg,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
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
  },
  rateButton: {
    width: '100%',
  },
  actions: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    width: '100%',
  },
  supportSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  supportText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  supportButton: {
    alignSelf: 'center',
  },
  // Receipt styles
  receiptHeader: {
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  receiptContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  receiptCard: {
    marginBottom: theme.spacing.lg,
  },
  receiptTop: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  receiptTitle: {
    ...theme.typography.displaySmall,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  receiptSubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  receiptId: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontFamily: 'monospace',
    marginBottom: theme.spacing.xs,
  },
  receiptDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  receiptSection: {
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  receiptLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
  },
  receiptValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
  },
  totalRow: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginBottom: 0,
  },
  totalLabel: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '700',
  },
  totalValue: {
    ...theme.typography.titleLarge,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  paidStatus: {
    color: theme.colors.success,
    fontWeight: '600',
  },
};

export default BookingCompleteScreen;