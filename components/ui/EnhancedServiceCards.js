import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

// Enhanced Service Selection Card with Pricing
export const ServiceSelectionCard = ({ 
  service, 
  selected = false, 
  onSelect, 
  estimatedPrice,
  eta,
  features = [],
  recommended = false,
  popular = false,
  showComparison = false,
  originalPrice = null
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    // Animate selection feedback
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
    
    onSelect && onSelect(service);
  };

  const getBadgeColor = () => {
    if (recommended) return theme.colors.warning;
    if (popular) return theme.colors.success;
    return service.color || theme.colors.primary;
  };

  const getBadgeText = () => {
    if (recommended) return 'Recommended';
    if (popular) return 'Most Popular';
    return service.badge;
  };

  return (
    <Animated.View style={[
      styles.serviceCardContainer,
      { transform: [{ scale: scaleAnim }] }
    ]}>
      <TouchableOpacity
        style={[
          styles.serviceCard,
          selected && styles.serviceCardSelected,
          recommended && styles.serviceCardRecommended,
          { borderLeftColor: service.color || theme.colors.primary }
        ]}
        onPress={handlePress}
        activeOpacity={0.95}
      >
        {/* Top Badge Row */}
        {(recommended || popular || service.badge) && (
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
              <Text style={styles.badgeText}>{getBadgeText()}</Text>
            </View>
          </View>
        )}

        {/* Main Content */}
        <View style={styles.serviceCardContent}>
          {/* Left Side - Icon and Info */}
          <View style={styles.serviceCardLeft}>
            <View style={[
              styles.serviceIcon, 
              { backgroundColor: (service.color || theme.colors.primary) + '15' }
            ]}>
              <Ionicons 
                name={service.icon || 'car-outline'} 
                size={28} 
                color={service.color || theme.colors.primary} 
              />
            </View>
            
            <View style={styles.serviceInfo}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{service.name}</Text>
                {eta && (
                  <View style={styles.etaContainer}>
                    <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.etaText}>{eta}</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.serviceDescription} numberOfLines={2}>
                {service.description}
              </Text>
              
              {/* Key Features */}
              {features.length > 0 && (
                <View style={styles.featuresContainer}>
                  {features.slice(0, 2).map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons 
                        name="checkmark-circle" 
                        size={12} 
                        color={service.color || theme.colors.success} 
                      />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Right Side - Pricing and Selection */}
          <View style={styles.serviceCardRight}>
            <View style={styles.pricingContainer}>
              {showComparison && originalPrice && (
                <Text style={styles.originalPrice}>£{originalPrice}</Text>
              )}
              <Text style={[styles.price, { color: service.color || theme.colors.primary }]}>
                {estimatedPrice || `From £${service.basePrice}`}
              </Text>
              <Text style={styles.priceLabel}>per trip</Text>
            </View>
            
            <View style={[
              styles.selectionIndicator,
              selected && [
                styles.selectionIndicatorSelected,
                { backgroundColor: service.color || theme.colors.primary }
              ]
            ]}>
              {selected && (
                <Ionicons name="checkmark" size={16} color={theme.colors.surface} />
              )}
            </View>
          </View>
        </View>

        {/* Expandable Details */}
        {selected && features.length > 2 && (
          <View style={styles.expandedFeatures}>
            <View style={styles.divider} />
            <Text style={styles.allFeaturesTitle}>All Features:</Text>
            <View style={styles.allFeaturesGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.expandedFeatureItem}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={14} 
                    color={service.color || theme.colors.success} 
                  />
                  <Text style={styles.expandedFeatureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Compact Service Card for Quick Selection
export const CompactServiceCard = ({ 
  service, 
  selected = false, 
  onSelect, 
  price,
  showIcon = true 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.compactCard,
        selected && [
          styles.compactCardSelected,
          { borderColor: service.color || theme.colors.primary }
        ]
      ]}
      onPress={() => onSelect && onSelect(service)}
      activeOpacity={0.8}
    >
      {showIcon && (
        <View style={[
          styles.compactIcon, 
          { backgroundColor: (service.color || theme.colors.primary) + '15' }
        ]}>
          <Ionicons 
            name={service.icon || 'car-outline'} 
            size={20} 
            color={service.color || theme.colors.primary} 
          />
        </View>
      )}
      
      <View style={styles.compactInfo}>
        <Text style={styles.compactName}>{service.name}</Text>
        <Text style={styles.compactPrice}>{price}</Text>
      </View>
      
      {selected && (
        <View style={[styles.compactCheck, { backgroundColor: service.color || theme.colors.primary }]}>
          <Ionicons name="checkmark" size={14} color={theme.colors.surface} />
        </View>
      )}
    </TouchableOpacity>
  );
};

// Service Comparison Grid
export const ServiceComparisonGrid = ({ 
  services = [], 
  selectedService, 
  onSelectService,
  showPricing = true 
}) => {
  return (
    <View style={styles.comparisonGrid}>
      <Text style={styles.comparisonTitle}>Choose Your Service Level</Text>
      <Text style={styles.comparisonSubtitle}>All drivers are SIA licensed security professionals</Text>
      
      <View style={styles.servicesGrid}>
        {services.map((service, index) => (
          <ServiceSelectionCard
            key={service.id || index}
            service={service}
            selected={selectedService?.id === service.id}
            onSelect={onSelectService}
            estimatedPrice={showPricing ? service.estimatedPrice : null}
            eta={service.eta}
            features={service.features}
            recommended={service.recommended}
            popular={service.popular}
            showComparison={service.originalPrice > 0}
            originalPrice={service.originalPrice}
          />
        ))}
      </View>
    </View>
  );
};

const styles = {
  // Service Card Styles
  serviceCardContainer: {
    marginBottom: theme.spacing.md,
  },
  serviceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  serviceCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '08',
    borderLeftWidth: 6,
    ...theme.shadows.md,
    transform: [{ scale: 1.02 }],
  },
  serviceCardRecommended: {
    borderColor: theme.colors.warning,
    backgroundColor: theme.colors.warning + '08',
  },
  
  // Badge Styles
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    ...theme.typography.labelSmall,
    color: theme.colors.surface,
    fontWeight: '700',
    fontSize: 10,
  },

  // Content Layout
  serviceCardContent: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    alignItems: 'flex-start',
  },
  serviceCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  serviceCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 80,
  },

  // Service Info
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  serviceName: {
    ...theme.typography.titleLarge,
    fontWeight: '700',
    color: theme.colors.text,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  etaText: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    marginLeft: 2,
    fontSize: 10,
  },
  serviceDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  // Features
  featuresContainer: {
    gap: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },

  // Pricing
  pricingContainer: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  originalPrice: {
    ...theme.typography.labelSmall,
    color: theme.colors.textLight,
    textDecorationLine: 'line-through',
  },
  price: {
    ...theme.typography.headlineSmall,
    fontWeight: '800',
    marginBottom: 2,
  },
  priceLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
  },

  // Selection Indicator
  selectionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.gray300,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorSelected: {
    borderColor: 'transparent',
    ...theme.shadows.sm,
  },

  // Expanded Features
  expandedFeatures: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.gray200,
    marginBottom: theme.spacing.md,
  },
  allFeaturesTitle: {
    ...theme.typography.labelMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  allFeaturesGrid: {
    gap: 6,
  },
  expandedFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedFeatureText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },

  // Compact Card Styles
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.gray200,
    marginBottom: theme.spacing.sm,
  },
  compactCardSelected: {
    backgroundColor: theme.colors.primary + '08',
    ...theme.shadows.sm,
  },
  compactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    ...theme.typography.titleSmall,
    fontWeight: '600',
    color: theme.colors.text,
  },
  compactPrice: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  compactCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Comparison Grid Styles
  comparisonGrid: {
    marginVertical: theme.spacing.md,
  },
  comparisonTitle: {
    ...theme.typography.headlineSmall,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  comparisonSubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  servicesGrid: {
    gap: theme.spacing.md,
  },
};

export default {
  ServiceSelectionCard,
  CompactServiceCard,
  ServiceComparisonGrid,
};