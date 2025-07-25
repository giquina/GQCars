import React from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

// Primary CTA Button with Enhanced Visual Hierarchy
export const PrimaryCTAButton = ({ 
  title, 
  subtitle, 
  onPress, 
  disabled = false, 
  loading = false, 
  icon = "arrow-forward-circle",
  style,
  showPulse = false 
}) => {
  const pulseAnim = new Animated.Value(1);

  React.useEffect(() => {
    if (showPulse) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [showPulse]);

  return (
    <Animated.View style={[
      styles.primaryCTAContainer, 
      style,
      showPulse && { transform: [{ scale: pulseAnim }] }
    ]}>
      <TouchableOpacity
        style={[
          styles.primaryCTAButton,
          disabled && styles.primaryCTAButtonDisabled
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.92}
      >
        <View style={styles.primaryCTAContent}>
          <View style={styles.primaryCTATextContainer}>
            <Text style={styles.primaryCTATitle}>{title}</Text>
            {subtitle && <Text style={styles.primaryCTASubtitle}>{subtitle}</Text>}
          </View>
          <View style={styles.primaryCTAIconContainer}>
            <Ionicons 
              name={loading ? "refresh-outline" : icon} 
              size={28} 
              color={theme.colors.surface} 
            />
          </View>
        </View>
        
        {/* Progress indicator bar at bottom */}
        <View style={styles.primaryCTAProgressBar} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Secondary Action Button
export const SecondaryCTAButton = ({ 
  title, 
  onPress, 
  variant = "outline",
  icon,
  style 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.secondaryCTAButton,
        variant === "ghost" && styles.secondaryCTAButtonGhost,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={18} 
          color={variant === "ghost" ? theme.colors.textSecondary : theme.colors.primary} 
          style={styles.secondaryCTAIcon}
        />
      )}
      <Text style={[
        styles.secondaryCTAText,
        variant === "ghost" && styles.secondaryCTATextGhost
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Floating CTA Button (Always Visible)
export const FloatingCTAButton = ({ 
  title, 
  subtitle, 
  onPress, 
  disabled = false,
  urgency = "normal" // "normal", "high", "urgent"
}) => {
  const urgencyStyles = {
    normal: styles.floatingCTANormal,
    high: styles.floatingCTAHigh,
    urgent: styles.floatingCTAUrgent
  };

  return (
    <View style={styles.floatingCTAContainer}>
      <TouchableOpacity
        style={[
          styles.floatingCTAButton,
          urgencyStyles[urgency],
          disabled && styles.floatingCTADisabled
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.9}
      >
        <View style={styles.floatingCTAContent}>
          <View style={styles.floatingCTATextContainer}>
            <Text style={styles.floatingCTATitle}>{title}</Text>
            {subtitle && <Text style={styles.floatingCTASubtitle}>{subtitle}</Text>}
          </View>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color={theme.colors.surface} 
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Multi-Step CTA Button with Progress
export const ProgressCTAButton = ({ 
  currentStep, 
  totalSteps, 
  stepTitle, 
  onPress, 
  disabled = false 
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <TouchableOpacity
      style={[
        styles.progressCTAButton,
        disabled && styles.progressCTAButtonDisabled
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <View style={styles.progressCTAHeader}>
        <Text style={styles.progressCTAStepText}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.progressCTAPercentage}>{Math.round(progress)}%</Text>
      </View>
      
      <Text style={styles.progressCTATitle}>{stepTitle}</Text>
      
      <View style={styles.progressCTAProgressContainer}>
        <View style={styles.progressCTAProgressTrack}>
          <View 
            style={[
              styles.progressCTAProgressFill, 
              { width: `${progress}%` }
            ]} 
          />
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={theme.colors.surface} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  // Primary CTA Button Styles
  primaryCTAContainer: {
    marginVertical: theme.spacing.md,
  },
  primaryCTAButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 72,
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadows.lg,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    elevation: 8,
  },
  primaryCTAButtonDisabled: {
    backgroundColor: theme.colors.gray400,
    shadowOpacity: 0.1,
  },
  primaryCTAContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryCTATextContainer: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  primaryCTATitle: {
    ...theme.typography.headlineSmall,
    fontWeight: '700',
    color: theme.colors.surface,
    marginBottom: 4,
  },
  primaryCTASubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.surface,
    opacity: 0.9,
    fontWeight: '500',
  },
  primaryCTAIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryCTAProgressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Secondary CTA Button Styles
  secondaryCTAButton: {
    borderRadius: 12,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryCTAButtonGhost: {
    borderColor: 'transparent',
    backgroundColor: theme.colors.gray50,
  },
  secondaryCTAIcon: {
    marginRight: theme.spacing.sm,
  },
  secondaryCTAText: {
    ...theme.typography.labelLarge,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  secondaryCTATextGhost: {
    color: theme.colors.textSecondary,
  },

  // Floating CTA Button Styles
  floatingCTAContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  floatingCTAButton: {
    borderRadius: 16,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    minWidth: 280,
    maxWidth: 400,
    ...theme.shadows.xl,
    elevation: 12,
  },
  floatingCTANormal: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
  },
  floatingCTAHigh: {
    backgroundColor: theme.colors.success,
    shadowColor: theme.colors.success,
  },
  floatingCTAUrgent: {
    backgroundColor: theme.colors.error,
    shadowColor: theme.colors.error,
  },
  floatingCTADisabled: {
    backgroundColor: theme.colors.gray400,
    shadowOpacity: 0.1,
  },
  floatingCTAContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingCTATextContainer: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  floatingCTATitle: {
    ...theme.typography.titleLarge,
    fontWeight: '700',
    color: theme.colors.surface,
    marginBottom: 2,
  },
  floatingCTASubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.surface,
    opacity: 0.9,
  },

  // Progress CTA Button Styles
  progressCTAButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.md,
  },
  progressCTAButtonDisabled: {
    backgroundColor: theme.colors.gray400,
    shadowOpacity: 0.1,
  },
  progressCTAHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressCTAStepText: {
    ...theme.typography.labelMedium,
    color: theme.colors.surface,
    opacity: 0.8,
  },
  progressCTAPercentage: {
    ...theme.typography.labelMedium,
    color: theme.colors.surface,
    fontWeight: '700',
  },
  progressCTATitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.surface,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  progressCTAProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCTAProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  progressCTAProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: 2,
  },
};

export default {
  PrimaryCTAButton,
  SecondaryCTAButton,
  FloatingCTAButton,
  ProgressCTAButton,
};