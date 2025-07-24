import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import theme from '../theme';
import paymentService from '../services/PaymentService';

const PaymentConfirmationScreen = ({ navigation, route }) => {
  const { tripDetails, paymentMethod } = route.params;
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [costBreakdown, setCostBreakdown] = useState(null);

  useEffect(() => {
    calculateCost();
  }, [tripDetails]);

  const calculateCost = () => {
    // Mock trip details for cost calculation
    const mockService = {
      baseRate: 50,
      timeRate: 2,
      distanceRate: 1.5,
    };
    
    const duration = tripDetails?.estimatedDuration || 60; // minutes
    const distance = tripDetails?.estimatedDistance || 15; // miles
    
    const breakdown = paymentService.calculateTripCost(mockService, duration, distance);
    setCostBreakdown(breakdown);
  };

  const handlePayment = async () => {
    if (!costBreakdown || !paymentMethod) {
      Alert.alert('Error', 'Missing payment information');
      return;
    }

    setProcessing(true);
    
    try {
      const result = await paymentService.processPayment(
        tripDetails,
        paymentMethod.id,
        costBreakdown.total
      );

      if (result.success) {
        // Show success modal and navigate to success screen
        Alert.alert(
          'Payment Successful',
          'Your trip has been booked successfully!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('Home', {
                bookingConfirmed: true,
                tripId: result.paymentIntent.id,
              }),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Failed',
        error.message || 'Unable to process payment. Please try again.',
        [
          { text: 'Try Again', style: 'default' },
          { text: 'Change Payment Method', onPress: () => navigation.goBack() },
        ]
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleChangePaymentMethod = () => {
    navigation.navigate('PaymentMethod', {
      tripDetails,
      returnTo: 'PaymentConfirmation',
    });
  };

  const formatCurrency = (amount) => {
    return `£${amount.toFixed(2)}`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Now';
    const date = new Date(dateTime);
    return date.toLocaleString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!costBreakdown) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Calculating trip cost...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Payment</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Summary */}
        <Card style={styles.tripSummary} elevation="sm">
          <View style={styles.tripHeader}>
            <Ionicons name="car" size={24} color={theme.colors.primary} />
            <Text style={styles.tripTitle}>Trip Summary</Text>
          </View>
          
          <View style={styles.tripDetails}>
            <View style={styles.tripDetailRow}>
              <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
              <View style={styles.tripDetailText}>
                <Text style={styles.tripDetailLabel}>From</Text>
                <Text style={styles.tripDetailValue}>
                  {tripDetails?.pickup || 'Current Location'}
                </Text>
              </View>
            </View>
            
            <View style={styles.tripDetailRow}>
              <Ionicons name="flag" size={16} color={theme.colors.textSecondary} />
              <View style={styles.tripDetailText}>
                <Text style={styles.tripDetailLabel}>To</Text>
                <Text style={styles.tripDetailValue}>
                  {tripDetails?.destination || 'Destination'}
                </Text>
              </View>
            </View>
            
            <View style={styles.tripDetailRow}>
              <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
              <View style={styles.tripDetailText}>
                <Text style={styles.tripDetailLabel}>Departure</Text>
                <Text style={styles.tripDetailValue}>
                  {formatDateTime(tripDetails?.departureTime)}
                </Text>
              </View>
            </View>
            
            <View style={styles.tripDetailRow}>
              <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
              <View style={styles.tripDetailText}>
                <Text style={styles.tripDetailLabel}>Service</Text>
                <Text style={styles.tripDetailValue}>
                  {tripDetails?.serviceType || 'GQCars Secure Ride'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Cost Breakdown */}
        <Card style={styles.costBreakdown} elevation="sm">
          <Text style={styles.sectionTitle}>Cost Breakdown</Text>
          
          <View style={styles.costItems}>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Base Rate</Text>
              <Text style={styles.costValue}>{formatCurrency(costBreakdown.baseRate)}</Text>
            </View>
            
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Time ({tripDetails?.estimatedDuration || 60} min)</Text>
              <Text style={styles.costValue}>{formatCurrency(costBreakdown.timeCost)}</Text>
            </View>
            
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Distance ({tripDetails?.estimatedDistance || 15} mi)</Text>
              <Text style={styles.costValue}>{formatCurrency(costBreakdown.distanceCost)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Subtotal</Text>
              <Text style={styles.costValue}>{formatCurrency(costBreakdown.subtotal)}</Text>
            </View>
            
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Platform Fee</Text>
              <Text style={styles.costValue}>{formatCurrency(costBreakdown.platformFee)}</Text>
            </View>
            
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>VAT (20%)</Text>
              <Text style={styles.costValue}>{formatCurrency(costBreakdown.vat)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={[styles.costItem, styles.totalCost]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(costBreakdown.total)}</Text>
            </View>
          </View>
        </Card>

        {/* Payment Method */}
        <Card style={styles.paymentMethodCard} elevation="sm">
          <View style={styles.paymentMethodHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity
              onPress={handleChangePaymentMethod}
              style={styles.changeButton}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentMethodContent}>
            <Ionicons
              name={paymentService.getCardIcon(paymentMethod.card.brand)}
              size={24}
              color={theme.colors.primary}
            />
            <View style={styles.paymentMethodDetails}>
              <Text style={styles.paymentMethodTitle}>
                {paymentService.getCardDisplay(paymentMethod)}
              </Text>
              <Text style={styles.paymentMethodSubtitle}>
                {paymentMethod.billing_details.name}
              </Text>
            </View>
            {paymentMethod.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons
            name="shield-checkmark"
            size={20}
            color={theme.colors.success}
          />
          <Text style={styles.securityText}>
            Your payment is secured with end-to-end encryption
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalSummary}>
          <Text style={styles.totalSummaryLabel}>Total Amount</Text>
          <Text style={styles.totalSummaryValue}>
            {formatCurrency(costBreakdown.total)}
          </Text>
        </View>
        
        <Button
          title="Confirm Payment"
          onPress={handlePayment}
          loading={processing}
          disabled={processing}
          style={styles.confirmButton}
        />
      </View>

      {/* Processing Modal */}
      <Modal
        visible={processing}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.processingModal} elevation="xl">
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.processingTitle}>Processing Payment</Text>
            <Text style={styles.processingSubtitle}>
              Please wait while we process your payment...
            </Text>
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginLeft: -theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.headlineMedium,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
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
  tripSummary: {
    marginBottom: theme.spacing.md,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  tripTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  tripDetails: {
    gap: theme.spacing.sm,
  },
  tripDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tripDetailText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  tripDetailLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  tripDetailValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  costBreakdown: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  costItems: {
    gap: theme.spacing.sm,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
  },
  costValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },
  totalCost: {
    paddingTop: theme.spacing.xs,
  },
  totalLabel: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
  },
  totalValue: {
    ...theme.typography.titleMedium,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  paymentMethodCard: {
    marginBottom: theme.spacing.lg,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  changeButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  changeButtonText: {
    ...theme.typography.labelMedium,
    color: theme.colors.primary,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodDetails: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  paymentMethodTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  paymentMethodSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
  },
  defaultText: {
    ...theme.typography.labelSmall,
    color: theme.colors.surface,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  securityText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  totalSummaryLabel: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
  },
  totalSummaryValue: {
    ...theme.typography.headlineSmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  confirmButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  processingModal: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    minWidth: 280,
  },
  processingTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  processingSubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default PaymentConfirmationScreen;