import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import Card from '../ui/Card';

const PriceCalculator = ({
  pickupLocation,
  destinationLocation,
  selectedService,
  additionalServices = [],
  duration = 1, // hours
  distance = 0, // miles/km
  onPriceCalculated,
  showBreakdown = true,
  showDiscounts = true,
  currency = '£',
  style,
  ...props
}) => {
  const [pricing, setPricing] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);

  // Pricing rules and calculations
  const calculatePrice = useCallback(async () => {
    if (!selectedService || !pickupLocation) {
      setPricing(null);
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const baseRate = selectedService.price || 45; // Default base rate
      const minimumFare = baseRate * 0.5; // Minimum 30 minutes charge
      
      // Distance calculation (mock)
      const calculatedDistance = distance || Math.random() * 20 + 5; // 5-25 miles
      const distanceRate = 2.5; // £2.50 per mile
      
      // Time calculation
      const timeCharge = baseRate * duration;
      const distanceCharge = calculatedDistance * distanceRate;
      
      // Additional services
      const additionalServicesTotal = additionalServices.reduce((total, service) => {
        return total + (service.price || 0);
      }, 0);

      // Surge pricing (peak hours simulation)
      const currentHour = new Date().getHours();
      const isPeakHour = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 19);
      const surgePricing = isPeakHour ? 1.2 : 1.0;

      // Calculate subtotal
      const subtotal = Math.max(
        minimumFare,
        (timeCharge + distanceCharge) * surgePricing + additionalServicesTotal
      );

      // Taxes and fees
      const serviceFee = subtotal * 0.05; // 5% service fee
      const vatRate = 0.20; // 20% VAT
      const vat = subtotal * vatRate;
      
      // Discounts
      const discounts = [];
      let discountAmount = 0;

      if (showDiscounts) {
        // First time user discount
        if (Math.random() > 0.7) {
          const firstTimeDiscount = subtotal * 0.1; // 10% discount
          discounts.push({
            name: 'First Time User',
            amount: firstTimeDiscount,
            type: 'percentage',
            value: 10,
          });
          discountAmount += firstTimeDiscount;
        }

        // Loyalty discount
        if (Math.random() > 0.8) {
          const loyaltyDiscount = 10; // £10 off
          discounts.push({
            name: 'Loyalty Reward',
            amount: loyaltyDiscount,
            type: 'fixed',
            value: loyaltyDiscount,
          });
          discountAmount += loyaltyDiscount;
        }
      }

      const total = subtotal + serviceFee + vat - discountAmount;

      const pricingData = {
        baseRate,
        duration,
        distance: calculatedDistance,
        timeCharge,
        distanceCharge,
        additionalServicesTotal,
        surgePricing,
        isPeakHour,
        subtotal,
        serviceFee,
        vat,
        vatRate,
        discounts,
        discountAmount,
        total: Math.max(total, minimumFare),
        minimumFare,
        currency,
        breakdown: [
          {
            label: 'Base service',
            amount: timeCharge,
            description: `${duration} hour${duration !== 1 ? 's' : ''} at ${currency}${baseRate}/hour`,
          },
          {
            label: 'Distance',
            amount: distanceCharge,
            description: `${calculatedDistance.toFixed(1)} miles at ${currency}${distanceRate}/mile`,
          },
          ...(additionalServicesTotal > 0 ? [{
            label: 'Additional services',
            amount: additionalServicesTotal,
            description: `${additionalServices.length} additional service${additionalServices.length !== 1 ? 's' : ''}`,
          }] : []),
          ...(isPeakHour ? [{
            label: 'Peak hour surcharge',
            amount: subtotal * (surgePricing - 1),
            description: 'High demand period',
          }] : []),
          {
            label: 'Service fee',
            amount: serviceFee,
            description: '5% service charge',
          },
          {
            label: 'VAT',
            amount: vat,
            description: `${(vatRate * 100)}% tax`,
          },
          ...discounts.map(discount => ({
            label: discount.name,
            amount: -discount.amount,
            description: discount.type === 'percentage' ? `${discount.value}% off` : `${currency}${discount.value} off`,
            isDiscount: true,
          })),
        ],
      };

      setPricing(pricingData);
      
      if (onPriceCalculated) {
        onPriceCalculated(pricingData);
      }
    } catch (err) {
      setError('Unable to calculate price. Please try again.');
      console.error('Price calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  }, [
    selectedService,
    pickupLocation,
    destinationLocation,
    duration,
    distance,
    additionalServices,
    showDiscounts,
    currency,
    onPriceCalculated,
  ]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const renderPricingSummary = () => {
    if (!pricing) return null;

    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
      }}>
        <View>
          <Text style={{
            ...theme.typography.headlineMedium,
            color: theme.colors.text,
          }}>
            {pricing.currency}{pricing.total.toFixed(2)}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.xs }}>
            <Text style={{
              ...theme.typography.bodySmall,
              color: theme.colors.textSecondary,
            }}>
              Estimated total
            </Text>
            {pricing.isPeakHour && (
              <View style={{
                backgroundColor: theme.colors.warning,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 2,
                borderRadius: theme.borderRadius.xs,
                marginLeft: theme.spacing.sm,
              }}>
                <Text style={{
                  ...theme.typography.labelSmall,
                  color: '#FFFFFF',
                }}>
                  PEAK
                </Text>
              </View>
            )}
          </View>
        </View>

        {showBreakdown && (
          <TouchableOpacity
            onPress={() => setShowDetails(!showDetails)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: theme.spacing.sm,
            }}
          >
            <Text style={{
              ...theme.typography.labelMedium,
              color: theme.colors.primary,
              marginRight: theme.spacing.xs,
            }}>
              Details
            </Text>
            <Ionicons
              name={showDetails ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderBreakdown = () => {
    if (!pricing || !showDetails || !pricing.breakdown) return null;

    return (
      <View style={{
        borderTopWidth: 1,
        borderTopColor: theme.colors.divider,
        paddingTop: theme.spacing.md,
      }}>
        {pricing.breakdown.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: theme.spacing.sm,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{
                ...theme.typography.bodyMedium,
                color: item.isDiscount ? theme.colors.success : theme.colors.text,
              }}>
                {item.label}
              </Text>
              {item.description && (
                <Text style={{
                  ...theme.typography.bodySmall,
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.xs,
                }}>
                  {item.description}
                </Text>
              )}
            </View>
            
            <Text style={{
              ...theme.typography.bodyMedium,
              color: item.isDiscount ? theme.colors.success : theme.colors.text,
              fontWeight: item.isDiscount ? '600' : '400',
            }}>
              {item.amount < 0 ? '-' : ''}{pricing.currency}{Math.abs(item.amount).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={{
          borderTopWidth: 1,
          borderTopColor: theme.colors.divider,
          paddingTop: theme.spacing.md,
          marginTop: theme.spacing.sm,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={{
              ...theme.typography.headlineSmall,
              color: theme.colors.text,
            }}>
              Total
            </Text>
            <Text style={{
              ...theme.typography.headlineSmall,
              color: theme.colors.text,
            }}>
              {pricing.currency}{pricing.total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDiscounts = () => {
    if (!pricing?.discounts?.length) return null;

    return (
      <View style={{
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.successLight,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.success,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.sm,
        }}>
          <Ionicons name="pricetag" size={16} color={theme.colors.success} />
          <Text style={{
            ...theme.typography.labelMedium,
            color: theme.colors.success,
            marginLeft: theme.spacing.sm,
          }}>
            Savings Applied
          </Text>
        </View>
        
        {pricing.discounts.map((discount, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: index < pricing.discounts.length - 1 ? theme.spacing.xs : 0,
          }}>
            <Text style={{
              ...theme.typography.bodySmall,
              color: theme.colors.successDark,
            }}>
              {discount.name}
            </Text>
            <Text style={{
              ...theme.typography.bodySmall,
              color: theme.colors.successDark,
              fontWeight: '600',
            }}>
              -{pricing.currency}{discount.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (error) {
    return (
      <Card padding="lg" style={[style]}>
        <View style={{
          alignItems: 'center',
          paddingVertical: theme.spacing.lg,
        }}>
          <Ionicons name="alert-circle" size={32} color={theme.colors.error} />
          <Text style={{
            ...theme.typography.bodyMedium,
            color: theme.colors.error,
            textAlign: 'center',
            marginTop: theme.spacing.sm,
          }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={calculatePrice}
            style={{
              marginTop: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.sm,
              backgroundColor: theme.colors.error,
              borderRadius: theme.borderRadius.md,
            }}
          >
            <Text style={{
              ...theme.typography.labelMedium,
              color: '#FFFFFF',
            }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }

  return (
    <Card padding="lg" style={[style]} {...props}>
      {isCalculating ? (
        <View style={{
          alignItems: 'center',
          paddingVertical: theme.spacing.xl,
        }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{
            ...theme.typography.bodyMedium,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.md,
          }}>
            Calculating price...
          </Text>
        </View>
      ) : (
        <>
          {renderPricingSummary()}
          {renderBreakdown()}
          {renderDiscounts()}
        </>
      )}
    </Card>
  );
};

export default PriceCalculator;