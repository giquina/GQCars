import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import theme from '../theme';
import PaymentService from '../services/PaymentService';

const PaymentMethodScreen = ({ navigation, route }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  // Get return destination from route params
  const returnTo = route.params?.returnTo || 'Home';
  const tripDetails = route.params?.tripDetails;

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = PaymentService.getStoredPaymentMethods();
      setPaymentMethods(methods);
      
      // Set default method as selected
      const defaultMethod = methods.find(method => method.isDefault);
      if (defaultMethod) {
        setSelectedMethod(defaultMethod.id);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      Alert.alert('Error', 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (paymentMethodId) => {
    try {
      await PaymentService.setDefaultPaymentMethod(paymentMethodId);
      
      // Update local state
      setPaymentMethods(methods =>
        methods.map(method => ({
          ...method,
          isDefault: method.id === paymentMethodId,
        }))
      );
      
      setSelectedMethod(paymentMethodId);
      Alert.alert('Success', 'Default payment method updated');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      Alert.alert('Error', 'Failed to update default payment method');
    }
  };

  const handleRemoveMethod = (paymentMethodId) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await PaymentService.removePaymentMethod(paymentMethodId);
              setPaymentMethods(methods =>
                methods.filter(method => method.id !== paymentMethodId)
              );
              
              if (selectedMethod === paymentMethodId) {
                setSelectedMethod(null);
              }
            } catch (error) {
              console.error('Error removing payment method:', error);
              Alert.alert('Error', 'Failed to remove payment method');
            }
          },
        },
      ]
    );
  };

  const handleAddPaymentMethod = () => {
    navigation.navigate('AddPaymentMethod', { returnTo: 'PaymentMethod' });
  };

  const handleContinue = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    const selectedPaymentMethod = paymentMethods.find(
      method => method.id === selectedMethod
    );

    if (tripDetails) {
      // Navigate to payment confirmation
      navigation.navigate('PaymentConfirmation', {
        tripDetails,
        paymentMethod: selectedPaymentMethod,
      });
    } else {
      // Return to previous screen
      navigation.navigate(returnTo, {
        selectedPaymentMethod,
      });
    }
  };

  const renderPaymentMethod = (method) => {
    const isSelected = selectedMethod === method.id;
    const cardDisplay = PaymentService.getCardDisplay(method);
    const cardIcon = PaymentService.getCardIcon(method.card.brand);

    return (
      <Card key={method.id} style={styles.paymentMethodCard} elevation="sm">
        <TouchableOpacity
          style={styles.paymentMethodContent}
          onPress={() => setSelectedMethod(method.id)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Ionicons
                name={cardIcon}
                size={24}
                color={theme.colors.primary}
                style={styles.cardIcon}
              />
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>{cardDisplay}</Text>
                <Text style={styles.cardExpiry}>
                  Expires {method.card.exp_month.toString().padStart(2, '0')}/
                  {method.card.exp_year.toString().slice(-2)}
                </Text>
              </View>
            </View>
            
            <View style={styles.cardActions}>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    isSelected && styles.radioButtonSelected,
                  ]}
                >
                  {isSelected && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.billingAddress}>
            <Text style={styles.billingTitle}>Billing Address</Text>
            <Text style={styles.billingText}>
              {method.billing_details.name}
            </Text>
            <Text style={styles.billingText}>
              {method.billing_details.address.line1}
            </Text>
            <Text style={styles.billingText}>
              {method.billing_details.address.city}, {method.billing_details.address.postal_code}
            </Text>
          </View>

          <View style={styles.cardActionButtons}>
            {!method.isDefault && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSetDefault(method.id)}
              >
                <Text style={styles.actionButtonText}>Set as Default</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={() => handleRemoveMethod(method.id)}
            >
              <Text style={[styles.actionButtonText, styles.removeButtonText]}>
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading payment methods...</Text>
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
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {paymentMethods.length === 0 ? (
          <Card style={styles.emptyState} elevation="sm">
            <Ionicons
              name="card-outline"
              size={48}
              color={theme.colors.textLight}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No Payment Methods</Text>
            <Text style={styles.emptySubtitle}>
              Add a payment method to get started
            </Text>
          </Card>
        ) : (
          <View style={styles.paymentMethodsList}>
            <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
            {paymentMethods.map(renderPaymentMethod)}
          </View>
        )}

        <Card style={styles.addMethodCard} elevation="sm">
          <TouchableOpacity
            style={styles.addMethodButton}
            onPress={handleAddPaymentMethod}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.addMethodText}>Add New Payment Method</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </Card>

        <View style={styles.securityNote}>
          <Ionicons
            name="shield-checkmark"
            size={20}
            color={theme.colors.success}
          />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>
      </ScrollView>

      {paymentMethods.length > 0 && (
        <View style={styles.footer}>
          <Button
            title={tripDetails ? "Continue to Payment" : "Confirm Selection"}
            onPress={handleContinue}
            disabled={!selectedMethod}
            style={styles.continueButton}
          />
        </View>
      )}
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
  },
  sectionTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  paymentMethodsList: {
    marginBottom: theme.spacing.lg,
  },
  paymentMethodCard: {
    marginBottom: theme.spacing.md,
  },
  paymentMethodContent: {
    padding: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    marginRight: theme.spacing.sm,
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardExpiry: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
    marginBottom: theme.spacing.xs,
  },
  defaultText: {
    ...theme.typography.labelSmall,
    color: theme.colors.surface,
  },
  radioContainer: {
    padding: theme.spacing.xs,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  billingAddress: {
    backgroundColor: theme.colors.gray50,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  billingTitle: {
    ...theme.typography.labelMedium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  billingText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    lineHeight: 16,
  },
  cardActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  actionButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  actionButtonText: {
    ...theme.typography.labelSmall,
    color: theme.colors.primary,
  },
  removeButton: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
    paddingLeft: theme.spacing.sm,
  },
  removeButtonText: {
    color: theme.colors.error,
  },
  addMethodCard: {
    marginBottom: theme.spacing.lg,
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  addMethodText: {
    ...theme.typography.titleMedium,
    color: theme.colors.primary,
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyIcon: {
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  securityNote: {
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
  continueButton: {
    width: '100%',
  },
});

export default PaymentMethodScreen;