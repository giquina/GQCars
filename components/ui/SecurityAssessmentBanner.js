import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

const SecurityAssessmentBanner = ({ 
  isVisible = true, 
  onPress, 
  style,
  variant = 'required' // 'required', 'reminder', 'completed'
}) => {
  if (!isVisible) return null;

  const getConfig = () => {
    switch (variant) {
      case 'completed':
        return {
          backgroundColor: theme.colors.success + '15',
          borderColor: theme.colors.success,
          iconName: 'checkmark-circle',
          iconColor: theme.colors.success,
          title: 'Safety Check Complete',
          subtitle: 'Your safety profile is ready',
          buttonText: 'View Profile',
          urgent: false
        };
      case 'reminder':
        return {
          backgroundColor: '#FF9800' + '15',
          borderColor: '#FF9800',
          iconName: 'time',
          iconColor: '#FF9800',
          title: 'Complete Safety Questions',
          subtitle: 'Quick 6-question safety check required',
          buttonText: 'Start Questions',
          urgent: false
        };
      default: // required
        return {
          backgroundColor: '#FFC107' + '15',
          borderColor: '#FFC107',
          iconName: 'shield-outline',
          iconColor: '#FFC107',
          title: 'Safety Check Required',
          subtitle: 'Quick safety questions before your trip',
          buttonText: 'Start Questions',
          titleColor: '#000000',
          subtitleColor: '#333333',
          urgent: true
        };
    }
  };

  const config = getConfig();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left side - Icon and Text */}
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: config.iconColor + '20' }]}>
          <Ionicons 
            name={config.iconName} 
            size={20} 
            color={config.iconColor} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: config.titleColor || config.iconColor }]}>
              {config.title}
            </Text>
            {config.urgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>Required</Text>
              </View>
            )}
          </View>
          <Text style={[styles.subtitle, { color: config.subtitleColor || theme.colors.textSecondary }]}>{config.subtitle}</Text>
        </View>
      </View>

      {/* Right side - Action */}
      <View style={styles.rightContent}>
        <View style={[styles.actionButton, { backgroundColor: config.iconColor }]}>
          <Text style={styles.actionText}>{config.buttonText}</Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color={config.iconColor}
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: '#FFC107',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: theme.spacing.xs,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.surface,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  rightContent: {
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  actionButton: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.surface,
  },
  chevron: {
    opacity: 0.7,
  },
});

export default SecurityAssessmentBanner;