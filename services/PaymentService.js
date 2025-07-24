import { StripeProvider, useStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import notificationService, { NOTIFICATION_TYPES } from './NotificationService';

// Mock Stripe configuration - In production, use your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key_here';

class PaymentService {
  constructor() {
    this.stripe = null;
  }

  // Initialize Stripe
  static getStripeProvider() {
    return {
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      merchantId: 'merchant.com.gqcars', // Your merchant identifier
      urlScheme: 'gqcars', // URL scheme for return to app
    };
  }

  // Validate card number using Luhn algorithm
  validateCardNumber(cardNumber) {
    // Remove spaces and non-numeric characters
    const cleaned = cardNumber.replace(/\D/g, '');
    
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  }

  // Validate expiry date
  validateExpiryDate(expiry) {
    const cleaned = expiry.replace(/\D/g, '');
    if (cleaned.length !== 4) return false;
    
    const month = parseInt(cleaned.substring(0, 2), 10);
    const year = parseInt(cleaned.substring(2, 4), 10) + 2000;
    
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    
    return true;
  }

  // Validate CVC
  validateCVC(cvc, cardType = 'visa') {
    const cleaned = cvc.replace(/\D/g, '');
    const expectedLength = cardType === 'amex' ? 4 : 3;
    return cleaned.length === expectedLength;
  }

  // Get card type from card number
  getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/\D/g, '');
    
    if (cleaned.match(/^4/)) return 'visa';
    if (cleaned.match(/^5[1-5]/) || cleaned.match(/^2[2-7]/)) return 'mastercard';
    if (cleaned.match(/^3[47]/)) return 'amex';
    if (cleaned.match(/^6/)) return 'discover';
    
    return 'unknown';
  }

  // Format card number with spaces
  formatCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\D/g, '');
    const cardType = this.getCardType(cleaned);
    
    if (cardType === 'amex') {
      // American Express: 4-6-5 format
      return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      // Other cards: 4-4-4-4 format
      return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
  }

  // Format expiry date
  formatExpiryDate(expiry) {
    const cleaned = expiry.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + (cleaned.length > 2 ? '/' + cleaned.substring(2, 4) : '');
    }
    return cleaned;
  }

  // Mock payment methods storage (in production, use secure storage)
  getStoredPaymentMethods() {
    return [
      {
        id: 'pm_1',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025,
        },
        billing_details: {
          name: 'John Doe',
          address: {
            line1: '123 Main St',
            city: 'London',
            postal_code: 'SW1A 1AA',
            country: 'GB',
          },
        },
        isDefault: true,
      },
      {
        id: 'pm_2',
        type: 'card',
        card: {
          brand: 'mastercard',
          last4: '5555',
          exp_month: 8,
          exp_year: 2026,
        },
        billing_details: {
          name: 'John Doe',
          address: {
            line1: '456 Oak Ave',
            city: 'Manchester',
            postal_code: 'M1 1AA',
            country: 'GB',
          },
        },
        isDefault: false,
      },
    ];
  }

  // Set default payment method
  setDefaultPaymentMethod(paymentMethodId) {
    // In production, call your backend API
    console.log('Setting default payment method:', paymentMethodId);
    return Promise.resolve({ success: true });
  }

  // Remove payment method
  removePaymentMethod(paymentMethodId) {
    // In production, call your backend API
    console.log('Removing payment method:', paymentMethodId);
    return Promise.resolve({ success: true });
  }

  // Create payment intent
  async createPaymentIntent(amount, currency = 'gbp', paymentMethodId = null) {
    // In production, call your backend API to create payment intent
    const mockPaymentIntent = {
      id: 'pi_' + Math.random().toString(36).substr(2, 9),
      client_secret: 'pi_mock_client_secret',
      amount: amount * 100, // Stripe uses cents
      currency,
      status: 'requires_payment_method',
      payment_method: paymentMethodId,
    };

    return Promise.resolve(mockPaymentIntent);
  }

  // Confirm payment
  async confirmPayment(paymentIntentClientSecret, paymentMethodData) {
    // Mock payment confirmation
    // In production, use Stripe's confirmPayment method
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
    
    return Promise.resolve({
      paymentIntent: {
        id: 'pi_confirmed',
        status: 'succeeded',
        amount: 5000, // £50.00
        currency: 'gbp',
      },
      error: null,
    });
  }

  // Process payment for trip
  async processPayment(tripDetails, paymentMethodId, amount) {
    try {
      // Create payment intent
      const paymentIntent = await this.createPaymentIntent(
        amount,
        'gbp',
        paymentMethodId
      );

      // In a real implementation, you would use Stripe's confirmPayment
      const result = await this.confirmPayment(
        paymentIntent.client_secret,
        { payment_method: paymentMethodId }
      );

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Send payment processed notification
      await notificationService.sendTripNotification(NOTIFICATION_TYPES.PAYMENT_PROCESSED, {
        amount: (result.paymentIntent.amount / 100).toFixed(2),
        tripId: tripDetails.tripId || 'trip_' + Date.now(),
      });

      // Also send trip completed notification if this is the final payment
      await notificationService.sendTripNotification(NOTIFICATION_TYPES.TRIP_COMPLETED, {
        tripId: tripDetails.tripId || 'trip_' + Date.now(),
      });

      return {
        success: true,
        paymentIntent: result.paymentIntent,
        trip: tripDetails,
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // Calculate trip cost
  calculateTripCost(service, duration, distance) {
    const baseRate = service?.baseRate || 50; // Base rate in GBP
    const timeRate = service?.timeRate || 2; // Per minute
    const distanceRate = service?.distanceRate || 1.5; // Per mile
    
    const timeCost = duration * timeRate;
    const distanceCost = distance * distanceRate;
    const subtotal = baseRate + timeCost + distanceCost;
    
    // Calculate fees
    const platformFee = subtotal * 0.05; // 5% platform fee
    const vatRate = 0.2; // 20% VAT
    const vat = (subtotal + platformFee) * vatRate;
    
    const total = subtotal + platformFee + vat;

    return {
      baseRate,
      timeCost,
      distanceCost,
      subtotal,
      platformFee,
      vat,
      total: Math.round(total * 100) / 100, // Round to 2 decimal places
    };
  }

  // Get card brand icon name
  getCardIcon(brand) {
    const icons = {
      visa: 'card',
      mastercard: 'card',
      amex: 'card',
      discover: 'card',
      unknown: 'card-outline',
    };
    return icons[brand] || icons.unknown;
  }

  // Get formatted card display
  getCardDisplay(paymentMethod) {
    if (!paymentMethod || !paymentMethod.card) return 'Unknown Card';
    
    const { brand, last4 } = paymentMethod.card;
    const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
    
    return `${brandName} •••• ${last4}`;
  }
}

// Export singleton instance to match BookingService pattern
const paymentServiceInstance = new PaymentService();
export default paymentServiceInstance;