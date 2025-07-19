import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import theme from '../theme';
import PaymentService from '../services/PaymentService';

const AddPaymentMethodScreen = ({ navigation, route }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('GB');
  const [saveCard, setSaveCard] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Refs for input navigation
  const expiryRef = useRef();
  const cvcRef = useRef();
  const nameRef = useRef();
  const address1Ref = useRef();
  const address2Ref = useRef();
  const cityRef = useRef();
  const postalCodeRef = useRef();
  
  const returnTo = route.params?.returnTo || 'PaymentMethod';

  const validateForm = () => {
    const newErrors = {};

    // Card number validation
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!PaymentService.validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Expiry date validation
    if (!expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!PaymentService.validateExpiryDate(expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date';
    }

    // CVC validation
    const cardType = PaymentService.getCardType(cardNumber);
    if (!cvc.trim()) {
      newErrors.cvc = 'CVC is required';
    } else if (!PaymentService.validateCVC(cvc, cardType)) {
      newErrors.cvc = cardType === 'amex' ? 'CVC must be 4 digits' : 'CVC must be 3 digits';
    }

    // Cardholder name validation
    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    // Billing address validation
    if (!address1.trim()) {
      newErrors.address1 = 'Address is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (text) => {
    // Remove non-numeric characters and format
    const formatted = PaymentService.formatCardNumber(text);
    setCardNumber(formatted);
    
    // Clear error when user starts typing
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: null }));
    }
    
    // Auto-advance to expiry field when card number is complete
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 16) {
      expiryRef.current?.focus();
    }
  };

  const handleExpiryChange = (text) => {
    const formatted = PaymentService.formatExpiryDate(text);
    setExpiryDate(formatted);
    
    if (errors.expiryDate) {
      setErrors(prev => ({ ...prev, expiryDate: null }));
    }
    
    // Auto-advance to CVC field when expiry is complete
    if (formatted.length >= 5) {
      cvcRef.current?.focus();
    }
  };

  const handleCvcChange = (text) => {
    // Only allow numeric input
    const cleaned = text.replace(/\D/g, '');
    const cardType = PaymentService.getCardType(cardNumber);
    const maxLength = cardType === 'amex' ? 4 : 3;
    
    setCvc(cleaned.substring(0, maxLength));
    
    if (errors.cvc) {
      setErrors(prev => ({ ...prev, cvc: null }));
    }
    
    // Auto-advance to name field when CVC is complete
    if (cleaned.length >= maxLength) {
      nameRef.current?.focus();
    }
  };

  const handleSaveCard = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // In a real implementation, you would use Stripe's API to create a payment method
      const paymentMethodData = {
        type: 'card',
        card: {
          number: cardNumber.replace(/\D/g, ''),
          exp_month: parseInt(expiryDate.substring(0, 2), 10),
          exp_year: parseInt('20' + expiryDate.substring(3, 5), 10),
          cvc: cvc,
        },
        billing_details: {
          name: cardholderName,
          address: {
            line1: address1,
            line2: address2,
            city: city,
            postal_code: postalCode,
            country: country,
          },
        },
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Payment method added successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate(returnTo, { refresh: true }),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving payment method:', error);
      Alert.alert('Error', 'Failed to save payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCardTypeIcon = () => {
    const cardType = PaymentService.getCardType(cardNumber);
    return PaymentService.getCardIcon(cardType);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Payment Method</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.cardForm} elevation="sm">
            <Text style={styles.sectionTitle}>Card Information</Text>
            
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={23} // Formatted length with spaces
              error={errors.cardNumber}
              rightIcon={getCardTypeIcon()}
              returnKeyType="next"
              onSubmitEditing={() => expiryRef.current?.focus()}
            />

            <View style={styles.cardRow}>
              <View style={styles.cardRowItem}>
                <Input
                  ref={expiryRef}
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={handleExpiryChange}
                  keyboardType="numeric"
                  maxLength={5}
                  error={errors.expiryDate}
                  containerStyle={styles.halfWidth}
                  returnKeyType="next"
                  onSubmitEditing={() => cvcRef.current?.focus()}
                />
              </View>
              
              <View style={styles.cardRowItem}>
                <Input
                  ref={cvcRef}
                  label="CVC"
                  placeholder="123"
                  value={cvc}
                  onChangeText={handleCvcChange}
                  keyboardType="numeric"
                  maxLength={4}
                  error={errors.cvc}
                  containerStyle={styles.halfWidth}
                  secureTextEntry
                  returnKeyType="next"
                  onSubmitEditing={() => nameRef.current?.focus()}
                />
              </View>
            </View>

            <Input
              ref={nameRef}
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardholderName}
              onChangeText={(text) => {
                setCardholderName(text);
                if (errors.cardholderName) {
                  setErrors(prev => ({ ...prev, cardholderName: null }));
                }
              }}
              error={errors.cardholderName}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => address1Ref.current?.focus()}
            />
          </Card>

          <Card style={styles.billingForm} elevation="sm">
            <Text style={styles.sectionTitle}>Billing Address</Text>
            
            <Input
              ref={address1Ref}
              label="Address Line 1"
              placeholder="123 Main Street"
              value={address1}
              onChangeText={(text) => {
                setAddress1(text);
                if (errors.address1) {
                  setErrors(prev => ({ ...prev, address1: null }));
                }
              }}
              error={errors.address1}
              returnKeyType="next"
              onSubmitEditing={() => address2Ref.current?.focus()}
            />

            <Input
              ref={address2Ref}
              label="Address Line 2 (Optional)"
              placeholder="Apartment, suite, etc."
              value={address2}
              onChangeText={setAddress2}
              returnKeyType="next"
              onSubmitEditing={() => cityRef.current?.focus()}
            />

            <View style={styles.addressRow}>
              <View style={styles.addressRowItem}>
                <Input
                  ref={cityRef}
                  label="City"
                  placeholder="London"
                  value={city}
                  onChangeText={(text) => {
                    setCity(text);
                    if (errors.city) {
                      setErrors(prev => ({ ...prev, city: null }));
                    }
                  }}
                  error={errors.city}
                  containerStyle={styles.cityInput}
                  returnKeyType="next"
                  onSubmitEditing={() => postalCodeRef.current?.focus()}
                />
              </View>
              
              <View style={styles.addressRowItem}>
                <Input
                  ref={postalCodeRef}
                  label="Postal Code"
                  placeholder="SW1A 1AA"
                  value={postalCode}
                  onChangeText={(text) => {
                    setPostalCode(text.toUpperCase());
                    if (errors.postalCode) {
                      setErrors(prev => ({ ...prev, postalCode: null }));
                    }
                  }}
                  error={errors.postalCode}
                  containerStyle={styles.postalInput}
                  autoCapitalize="characters"
                  returnKeyType="done"
                  onSubmitEditing={handleSaveCard}
                />
              </View>
            </View>
          </Card>

          <Card style={styles.saveCardOption} elevation="sm">
            <TouchableOpacity
              style={styles.saveCardRow}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View style={styles.saveCardLeft}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.saveCardText}>Save this card for future use</Text>
              </View>
              <View style={[styles.toggle, saveCard && styles.toggleActive]}>
                <View style={[styles.toggleThumb, saveCard && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
          </Card>

          <View style={styles.securityInfo}>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={theme.colors.success}
            />
            <Text style={styles.securityText}>
              Your payment information is encrypted and stored securely
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Add Payment Method"
            onPress={handleSaveCard}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
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
  cardForm: {
    marginBottom: theme.spacing.md,
  },
  billingForm: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  cardRowItem: {
    flex: 1,
  },
  halfWidth: {
    marginBottom: theme.spacing.md,
  },
  addressRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  addressRowItem: {
    flex: 1,
  },
  cityInput: {
    marginBottom: theme.spacing.md,
  },
  postalInput: {
    marginBottom: theme.spacing.md,
  },
  saveCardOption: {
    marginBottom: theme.spacing.lg,
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  saveCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  saveCardText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  toggle: {
    width: 44,
    height: 24,
    backgroundColor: theme.colors.gray300,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    ...theme.shadows.sm,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  securityText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  footer: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    width: '100%',
  },
});

export default AddPaymentMethodScreen;