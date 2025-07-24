import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import Card from '../ui/Card';
import Button from '../ui/Button';

const BookingConfirmation = ({
  bookingData,
  onConfirm,
  onEdit,
  onCancel,
  showPaymentMethod = true,
  showSpecialInstructions = true,
  allowEditing = true,
  isLoading = false,
  style,
  ...props
}) => {
  const [specialInstructions, setSpecialInstructions] = useState(bookingData?.specialInstructions || '');
  const [paymentMethod, setPaymentMethod] = useState(bookingData?.paymentMethod || null);
  const [confirmationCode, setConfirmationCode] = useState(null);

  const handleConfirm = useCallback(async () => {
    if (!bookingData) {
      Alert.alert('Error', 'Missing booking information');
      return;
    }

    const finalBooking = {
      ...bookingData,
      specialInstructions,
      paymentMethod,
      confirmedAt: new Date().toISOString(),
    };

    if (onConfirm) {
      await onConfirm(finalBooking);
    }
  }, [bookingData, specialInstructions, paymentMethod, onConfirm]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'As soon as possible';
    
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderLocationDetails = () => {
    if (!bookingData?.pickupLocation && !bookingData?.destinationLocation) return null;

    return (
      <Card padding="lg" style={{ marginBottom: theme.spacing.md }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.md,
        }}>
          <Text style={{
            ...theme.typography.headlineSmall,
            color: theme.colors.text,
          }}>
            Journey Details
          </Text>
          
          {allowEditing && onEdit && (
            <TouchableOpacity
              onPress={() => onEdit('locations')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: theme.spacing.sm,
              }}
            >
              <Ionicons name="pencil" size={16} color={theme.colors.primary} />
              <Text style={{
                ...theme.typography.labelMedium,
                color: theme.colors.primary,
                marginLeft: theme.spacing.xs,
              }}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pickup Location */}
        {bookingData.pickupLocation && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: theme.spacing.md,
          }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}>
              <Ionicons name="radio-button-on" size={16} color="#FFFFFF" />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                ...theme.typography.labelMedium,
                color: theme.colors.textSecondary,
              }}>
                Pickup Location
              </Text>
              <Text style={{
                ...theme.typography.bodyMedium,
                color: theme.colors.text,
                marginTop: theme.spacing.xs,
              }}>
                {bookingData.pickupLocation.address}
              </Text>
              {bookingData.pickupTime && (
                <Text style={{
                  ...theme.typography.bodySmall,
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.xs,
                }}>
                  {formatDateTime(bookingData.pickupTime)}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Destination Location */}
        {bookingData.destinationLocation && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.secondary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}>
              <Ionicons name="location" size={16} color="#FFFFFF" />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                ...theme.typography.labelMedium,
                color: theme.colors.textSecondary,
              }}>
                Destination
              </Text>
              <Text style={{
                ...theme.typography.bodyMedium,
                color: theme.colors.text,
                marginTop: theme.spacing.xs,
              }}>
                {bookingData.destinationLocation.address}
              </Text>
            </View>
          </View>
        )}
      </Card>
    );
  };

  const renderServiceDetails = () => {
    if (!bookingData?.selectedService) return null;

    return (
      <Card padding="lg" style={{ marginBottom: theme.spacing.md }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.md,
        }}>
          <Text style={{
            ...theme.typography.headlineSmall,
            color: theme.colors.text,
          }}>
            Service Selection
          </Text>
          
          {allowEditing && onEdit && (
            <TouchableOpacity
              onPress={() => onEdit('service')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: theme.spacing.sm,
              }}
            >
              <Ionicons name="pencil" size={16} color={theme.colors.primary} />
              <Text style={{
                ...theme.typography.labelMedium,
                color: theme.colors.primary,
                marginLeft: theme.spacing.xs,
              }}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.md,
          }}>
            <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              ...theme.typography.headlineSmall,
              color: theme.colors.text,
            }}>
              {bookingData.selectedService.name}
            </Text>
            <Text style={{
              ...theme.typography.bodyMedium,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.xs,
            }}>
              {bookingData.selectedService.description}
            </Text>
            
            {bookingData.selectedService.features && (
              <View style={{ marginTop: theme.spacing.sm }}>
                {bookingData.selectedService.features.slice(0, 3).map((feature, index) => (
                  <View key={index} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: theme.spacing.xs,
                  }}>
                    <Ionicons 
                      name="checkmark" 
                      size={14} 
                      color={theme.colors.primary} 
                      style={{ marginRight: theme.spacing.sm }}
                    />
                    <Text style={{
                      ...theme.typography.bodySmall,
                      color: theme.colors.textSecondary,
                    }}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Card>
    );
  };

  const renderPricingDetails = () => {
    if (!bookingData?.pricing) return null;

    return (
      <Card padding="lg" style={{ marginBottom: theme.spacing.md }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.md,
        }}>
          <Text style={{
            ...theme.typography.headlineSmall,
            color: theme.colors.text,
          }}>
            Price Summary
          </Text>
          
          <Text style={{
            ...theme.typography.headlineMedium,
            color: theme.colors.text,
          }}>
            {bookingData.pricing.currency}{bookingData.pricing.total?.toFixed(2) || '0.00'}
          </Text>
        </View>

        {bookingData.pricing.breakdown?.slice(-3).map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: theme.spacing.xs,
            }}
          >
            <Text style={{
              ...theme.typography.bodyMedium,
              color: item.isDiscount ? theme.colors.success : theme.colors.textSecondary,
            }}>
              {item.label}
            </Text>
            <Text style={{
              ...theme.typography.bodyMedium,
              color: item.isDiscount ? theme.colors.success : theme.colors.text,
            }}>
              {item.amount < 0 ? '-' : ''}{bookingData.pricing.currency}{Math.abs(item.amount).toFixed(2)}
            </Text>
          </View>
        ))}

        {bookingData.pricing.discounts?.length > 0 && (
          <View style={{
            marginTop: theme.spacing.sm,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.successLight,
            borderRadius: theme.borderRadius.sm,
          }}>
            <Text style={{
              ...theme.typography.labelMedium,
              color: theme.colors.success,
            }}>
              You saved {bookingData.pricing.currency}{bookingData.pricing.discountAmount?.toFixed(2)}
            </Text>
          </View>
        )}
      </Card>
    );
  };

  const renderPaymentMethod = () => {
    if (!showPaymentMethod) return null;

    return (
      <Card padding="lg" style={{ marginBottom: theme.spacing.md }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.md,
        }}>
          <Text style={{
            ...theme.typography.headlineSmall,
            color: theme.colors.text,
          }}>
            Payment Method
          </Text>
          
          {allowEditing && (
            <TouchableOpacity
              onPress={() => onEdit && onEdit('payment')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: theme.spacing.sm,
              }}
            >
              <Ionicons name="pencil" size={16} color={theme.colors.primary} />
              <Text style={{
                ...theme.typography.labelMedium,
                color: theme.colors.primary,
                marginLeft: theme.spacing.xs,
              }}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {paymentMethod ? (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.gray100,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}>
              <Ionicons name="card" size={16} color={theme.colors.textSecondary} />
            </View>
            
            <View>
              <Text style={{
                ...theme.typography.bodyMedium,
                color: theme.colors.text,
              }}>
                {paymentMethod.brand} •••• {paymentMethod.last4}
              </Text>
              <Text style={{
                ...theme.typography.bodySmall,
                color: theme.colors.textSecondary,
                marginTop: theme.spacing.xs,
              }}>
                Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => onEdit && onEdit('payment')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.borderRadius.md,
              borderStyle: 'dashed',
            }}
          >
            <Ionicons name="add" size={20} color={theme.colors.textSecondary} />
            <Text style={{
              ...theme.typography.bodyMedium,
              color: theme.colors.textSecondary,
              marginLeft: theme.spacing.sm,
            }}>
              Add payment method
            </Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  const renderSpecialInstructions = () => {
    if (!showSpecialInstructions) return null;

    return (
      <Card padding="lg" style={{ marginBottom: theme.spacing.md }}>
        <Text style={{
          ...theme.typography.headlineSmall,
          color: theme.colors.text,
          marginBottom: theme.spacing.md,
        }}>
          Special Instructions
        </Text>
        
        <TouchableOpacity
          onPress={() => {
            // In a real app, this would open a modal or navigate to an input screen
            Alert.prompt(
              'Special Instructions',
              'Enter any special instructions for your driver:',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Save', 
                  onPress: (text) => setSpecialInstructions(text || '') 
                },
              ],
              'plain-text',
              specialInstructions
            );
          }}
          style={{
            padding: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
            minHeight: 80,
            justifyContent: specialInstructions ? 'flex-start' : 'center',
          }}
        >
          {specialInstructions ? (
            <Text style={{
              ...theme.typography.bodyMedium,
              color: theme.colors.text,
            }}>
              {specialInstructions}
            </Text>
          ) : (
            <Text style={{
              ...theme.typography.bodyMedium,
              color: theme.colors.textSecondary,
              textAlign: 'center',
            }}>
              Tap to add special instructions...
            </Text>
          )}
        </TouchableOpacity>
      </Card>
    );
  };

  const renderActionButtons = () => (
    <View style={{
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
      backgroundColor: theme.colors.surface,
    }}>
      {onCancel && (
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          style={{ flex: 1, marginRight: theme.spacing.sm }}
          disabled={isLoading}
        />
      )}
      
      <Button
        title="Confirm Booking"
        onPress={handleConfirm}
        loading={isLoading}
        disabled={!paymentMethod && showPaymentMethod}
        style={{ flex: 2, marginLeft: onCancel ? theme.spacing.sm : 0 }}
      />
    </View>
  );

  if (!bookingData) {
    return (
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, style]}>
        <Ionicons name="alert-circle" size={48} color={theme.colors.textLight} />
        <Text style={{
          ...theme.typography.bodyLarge,
          color: theme.colors.textSecondary,
          textAlign: 'center',
          marginTop: theme.spacing.md,
        }}>
          No booking information available
        </Text>
      </View>
    );
  }

  return (
    <View style={[{ flex: 1 }, style]} {...props}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: theme.spacing.md }}
      >
        {renderLocationDetails()}
        {renderServiceDetails()}
        {renderPricingDetails()}
        {renderPaymentMethod()}
        {renderSpecialInstructions()}
      </ScrollView>
      
      {renderActionButtons()}
    </View>
  );
};

export default BookingConfirmation;