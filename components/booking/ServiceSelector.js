import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import Card from '../ui/Card';

const ServiceSelector = ({
  services = [],
  selectedService,
  onServiceSelect,
  showPricing = true,
  showFeatures = true,
  allowMultiSelect = false,
  layout = 'list', // 'list' or 'grid'
  style,
  ...props
}) => {
  const [selectedServices, setSelectedServices] = useState(
    allowMultiSelect ? (Array.isArray(selectedService) ? selectedService : []) : []
  );

  // Default services for the GQCars app
  const defaultServices = [
    {
      id: 'standard',
      name: 'Standard Protection',
      description: 'Professional security transport with SIA licensed officer',
      price: 45,
      currency: '£',
      duration: 'per hour',
      image: null,
      features: [
        'SIA Licensed Close Protection Officer',
        'Real-time GPS tracking',
        'Standard security vehicle',
        'Emergency response protocol'
      ],
      availability: 'Available now',
      estimatedWait: '5-10 minutes',
      rating: 4.8,
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium Protection',
      description: 'Enhanced security with armored vehicle and advanced planning',
      price: 75,
      currency: '£',
      duration: 'per hour',
      image: null,
      features: [
        'Elite SIA Licensed CP Officer',
        'Armored security vehicle',
        'Route planning & risk assessment',
        'Priority emergency response',
        'Secure communication systems'
      ],
      availability: 'Available now',
      estimatedWait: '10-15 minutes',
      rating: 4.9,
      popular: true,
    },
    {
      id: 'executive',
      name: 'Executive Protection',
      description: 'Maximum security for high-risk clients with team support',
      price: 120,
      currency: '£',
      duration: 'per hour',
      image: null,
      features: [
        'Multi-officer protection team',
        'Luxury armored vehicle',
        'Advanced threat assessment',
        'Counter-surveillance measures',
        'Secure escort protocols',
        '24/7 command center support'
      ],
      availability: 'Available now',
      estimatedWait: '15-20 minutes',
      rating: 5.0,
      popular: false,
    }
  ];

  const serviceData = services.length > 0 ? services : defaultServices;

  const handleServiceSelect = useCallback((service) => {
    if (allowMultiSelect) {
      const isSelected = selectedServices.some(s => s.id === service.id);
      let newSelection;
      
      if (isSelected) {
        newSelection = selectedServices.filter(s => s.id !== service.id);
      } else {
        newSelection = [...selectedServices, service];
      }
      
      setSelectedServices(newSelection);
      if (onServiceSelect) {
        onServiceSelect(newSelection);
      }
    } else {
      if (onServiceSelect) {
        onServiceSelect(service);
      }
    }
  }, [allowMultiSelect, selectedServices, onServiceSelect]);

  const isServiceSelected = useCallback((service) => {
    if (allowMultiSelect) {
      return selectedServices.some(s => s.id === service.id);
    } else {
      return selectedService?.id === service.id;
    }
  }, [allowMultiSelect, selectedServices, selectedService]);

  const renderServiceFeatures = (features) => {
    if (!showFeatures || !features?.length) return null;

    return (
      <View style={{ marginTop: theme.spacing.md }}>
        {features.slice(0, 3).map((feature, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xs,
          }}>
            <Ionicons 
              name="checkmark-circle" 
              size={16} 
              color={theme.colors.primary} 
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text style={{
              ...theme.typography.bodySmall,
              color: theme.colors.textSecondary,
              flex: 1,
            }}>
              {feature}
            </Text>
          </View>
        ))}
        {features.length > 3 && (
          <Text style={{
            ...theme.typography.bodySmall,
            color: theme.colors.primary,
            marginTop: theme.spacing.xs,
          }}>
            +{features.length - 3} more features
          </Text>
        )}
      </View>
    );
  };

  const renderPricing = (service) => {
    if (!showPricing) return null;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: theme.spacing.sm,
      }}>
        <Text style={{
          ...theme.typography.headlineMedium,
          color: theme.colors.text,
        }}>
          {service.currency}{service.price}
        </Text>
        <Text style={{
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
          marginLeft: theme.spacing.xs,
        }}>
          {service.duration}
        </Text>
      </View>
    );
  };

  const renderServiceBadges = (service) => (
    <View style={{
      flexDirection: 'row',
      marginTop: theme.spacing.sm,
      flexWrap: 'wrap',
    }}>
      {service.popular && (
        <View style={{
          backgroundColor: theme.colors.secondary,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          borderRadius: theme.borderRadius.sm,
          marginRight: theme.spacing.xs,
          marginBottom: theme.spacing.xs,
        }}>
          <Text style={{
            ...theme.typography.labelSmall,
            color: '#FFFFFF',
          }}>
            POPULAR
          </Text>
        </View>
      )}
      
      {service.rating && (
        <View style={{
          backgroundColor: theme.colors.gray100,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          borderRadius: theme.borderRadius.sm,
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: theme.spacing.xs,
          marginBottom: theme.spacing.xs,
        }}>
          <Ionicons name="star" size={12} color={theme.colors.warning} />
          <Text style={{
            ...theme.typography.labelSmall,
            color: theme.colors.textSecondary,
            marginLeft: theme.spacing.xs,
          }}>
            {service.rating}
          </Text>
        </View>
      )}
      
      {service.availability && (
        <View style={{
          backgroundColor: theme.colors.successLight,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          borderRadius: theme.borderRadius.sm,
          marginBottom: theme.spacing.xs,
        }}>
          <Text style={{
            ...theme.typography.labelSmall,
            color: theme.colors.successDark,
          }}>
            {service.availability}
          </Text>
        </View>
      )}
    </View>
  );

  const renderServiceItem = ({ item: service }) => {
    const isSelected = isServiceSelected(service);

    return (
      <TouchableOpacity
        onPress={() => handleServiceSelect(service)}
        style={{ marginBottom: theme.spacing.md }}
      >
        <Card
          elevation={isSelected ? "lg" : "md"}
          padding="lg"
          style={{
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? theme.colors.primary : 'transparent',
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
            {/* Service Icon/Image */}
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray100,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}>
              {service.image ? (
                <Image 
                  source={service.image} 
                  style={{ width: 32, height: 32, borderRadius: 16 }}
                />
              ) : (
                <Ionicons 
                  name="shield-checkmark" 
                  size={24} 
                  color={isSelected ? '#FFFFFF' : theme.colors.textSecondary} 
                />
              )}
            </View>

            {/* Service Details */}
            <View style={{ flex: 1 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Text style={{
                  ...theme.typography.headlineSmall,
                  color: theme.colors.text,
                  flex: 1,
                }}>
                  {service.name}
                </Text>
                
                {isSelected && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color={theme.colors.primary} 
                    style={{ marginLeft: theme.spacing.sm }}
                  />
                )}
              </View>

              <Text style={{
                ...theme.typography.bodyMedium,
                color: theme.colors.textSecondary,
                marginTop: theme.spacing.xs,
              }}>
                {service.description}
              </Text>

              {renderPricing(service)}
              {renderServiceBadges(service)}
              {renderServiceFeatures(service.features)}

              {service.estimatedWait && (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: theme.spacing.md,
                }}>
                  <Ionicons 
                    name="time-outline" 
                    size={16} 
                    color={theme.colors.textSecondary} 
                  />
                  <Text style={{
                    ...theme.typography.bodySmall,
                    color: theme.colors.textSecondary,
                    marginLeft: theme.spacing.sm,
                  }}>
                    Estimated wait: {service.estimatedWait}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderGridItem = ({ item: service }) => {
    const isSelected = isServiceSelected(service);

    return (
      <TouchableOpacity
        onPress={() => handleServiceSelect(service)}
        style={{ 
          flex: 1,
          marginHorizontal: theme.spacing.xs,
          marginBottom: theme.spacing.md,
        }}
      >
        <Card
          elevation={isSelected ? "lg" : "md"}
          padding="md"
          style={{
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? theme.colors.primary : 'transparent',
            minHeight: 180,
          }}
        >
          <View style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray100,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                <Ionicons 
                  name="shield-checkmark" 
                  size={20} 
                  color={isSelected ? '#FFFFFF' : theme.colors.textSecondary} 
                />
              </View>

              <Text style={{
                ...theme.typography.titleMedium,
                color: theme.colors.text,
                textAlign: 'center',
                marginBottom: theme.spacing.xs,
              }}>
                {service.name}
              </Text>

              {renderPricing(service)}
            </View>

            {isSelected && (
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={theme.colors.primary} 
              />
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (layout === 'grid') {
    return (
      <View style={[style]} {...props}>
        <FlatList
          data={serviceData}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ marginHorizontal: -theme.spacing.xs }}
        />
      </View>
    );
  }

  return (
    <View style={[style]} {...props}>
      <FlatList
        data={serviceData}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ServiceSelector;