import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Vibration,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import Button from './Button';
import EmergencyService from '../../services/EmergencyService';
import notificationService, { NOTIFICATION_TYPES } from '../../services/NotificationService';

const EmergencyButton = ({ 
  size = 'large',
  style,
  onPress,
  onEmergencyActivated,
  showConfirmation = true,
  disabled = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [activationResult, setActivationResult] = useState(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  const emergencyService = EmergencyService.getInstance();

  React.useEffect(() => {
    // Pulse animation for emergency button
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    if (emergencyActive) {
      pulse();
    } else {
      pulseAnim.setValue(1);
    }
  }, [emergencyActive, pulseAnim]);

  const handleEmergencyPress = () => {
    // Vibrate to provide haptic feedback
    Vibration.vibrate([0, 100, 100, 100]);
    
    if (onPress) {
      onPress();
      return;
    }

    if (showConfirmation) {
      setShowModal(true);
    } else {
      activateEmergency();
    }
  };

  const activateEmergency = async (options = {}) => {
    try {
      setIsActivating(true);
      setShowModal(false);

      // Activate emergency with default options
      const result = await emergencyService.activateEmergency({
        callEmergencyServices: false,
        alertContacts: true,
        alertDispatch: true,
        template: 'general',
        ...options,
      });

      setActivationResult(result);
      setEmergencyActive(true);
      
      // Send emergency notification
      await notificationService.sendEmergencyNotification({
        id: 'emergency_' + Date.now(),
        message: `Emergency alert activated! Type: ${options.template || 'general'}. Location services and contacts have been notified.`,
      });
      
      // Vibrate to confirm activation
      Vibration.vibrate([0, 200, 100, 200]);

      if (onEmergencyActivated) {
        onEmergencyActivated(result);
      }

      // Auto-hide success after 10 seconds
      setTimeout(() => {
        setEmergencyActive(false);
        setActivationResult(null);
      }, 10000);

    } catch (error) {
      console.error('Emergency activation failed:', error);
      Alert.alert(
        'Emergency Activation Failed',
        error.message || 'Unable to activate emergency features. Please try calling emergency services directly.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsActivating(false);
    }
  };

  const deactivateEmergency = async () => {
    try {
      await emergencyService.deactivateEmergency();
      setEmergencyActive(false);
      setActivationResult(null);
    } catch (error) {
      console.error('Error deactivating emergency:', error);
    }
  };

  const getButtonSize = () => {
    const sizes = {
      small: {
        container: { width: 60, height: 60, borderRadius: 30 },
        icon: 24,
        text: theme.typography.labelSmall,
      },
      medium: {
        container: { width: 80, height: 80, borderRadius: 40 },
        icon: 32,
        text: theme.typography.labelMedium,
      },
      large: {
        container: { width: 100, height: 100, borderRadius: 50 },
        icon: 40,
        text: theme.typography.labelLarge,
      },
    };
    return sizes[size] || sizes.large;
  };

  const buttonSize = getButtonSize();

  const renderConfirmationModal = () => (
    <Modal
      visible={showModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="warning" size={32} color={theme.colors.emergency} />
            </View>
            <Text style={styles.modalTitle}>Emergency Alert</Text>
            <Text style={styles.modalSubtitle}>
              This will immediately alert emergency contacts and company dispatch with your location.
            </Text>
          </View>

          <View style={styles.modalActions}>
            <Text style={styles.modalQuestion}>What type of emergency?</Text>
            
            <View style={styles.emergencyOptions}>
              <TouchableOpacity
                style={styles.emergencyOption}
                onPress={() => activateEmergency({ template: 'general' })}
              >
                <Ionicons name="alert-circle" size={24} color={theme.colors.emergency} />
                <Text style={styles.optionText}>General Emergency</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emergencyOption}
                onPress={() => activateEmergency({ template: 'medical' })}
              >
                <Ionicons name="medical" size={24} color={theme.colors.emergency} />
                <Text style={styles.optionText}>Medical Emergency</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emergencyOption}
                onPress={() => activateEmergency({ template: 'safety' })}
              >
                <Ionicons name="shield-outline" size={24} color={theme.colors.emergency} />
                <Text style={styles.optionText}>Safety Concern</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emergencyOption}
                onPress={() => activateEmergency({ template: 'vehicle' })}
              >
                <Ionicons name="car" size={24} color={theme.colors.emergency} />
                <Text style={styles.optionText}>Vehicle Emergency</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.callEmergencyContainer}>
              <Text style={styles.callEmergencyText}>
                For life-threatening emergencies:
              </Text>
              <Button
                title="Call 911 Now"
                variant="primary"
                style={[styles.callEmergencyButton, { backgroundColor: theme.colors.emergency }]}
                onPress={() => {
                  setShowModal(false);
                  activateEmergency({ 
                    callEmergencyServices: true,
                    template: 'medical' 
                  });
                }}
              />
            </View>

            <Button
              title="Cancel"
              variant="ghost"
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              onPress={() => setShowModal(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={emergencyActive && !isActivating}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.successModal]}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
          </View>
          
          <Text style={styles.successTitle}>Help is on the way!</Text>
          <Text style={styles.successSubtitle}>
            Emergency contacts and company dispatch have been notified with your location.
          </Text>

          {activationResult && (
            <View style={styles.resultDetails}>
              <Text style={styles.resultTitle}>Alerts Sent:</Text>
              {activationResult.actions.map((action, index) => (
                <View key={index} style={styles.resultItem}>
                  <Ionicons 
                    name={action.success ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={action.success ? theme.colors.success : theme.colors.error} 
                  />
                  <Text style={styles.resultText}>
                    {action.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {action.success ? ' ✓' : ' ✗'}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.successActions}>
            <Button
              title="Call 911"
              style={[styles.actionButton, { backgroundColor: theme.colors.emergency }]}
              onPress={() => {
                emergencyService.callEmergencyServices();
              }}
            />
            
            <Button
              title="Deactivate"
              variant="outline"
              style={styles.actionButton}
              onPress={deactivateEmergency}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isActivating) {
    return (
      <View style={[styles.loadingContainer, buttonSize.container, style]}>
        <ActivityIndicator size="large" color={theme.colors.surface} />
        <Text style={[styles.loadingText, buttonSize.text]}>
          Activating...
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[
            styles.emergencyButton,
            buttonSize.container,
            emergencyActive && styles.emergencyButtonActive,
            disabled && styles.emergencyButtonDisabled,
            style,
          ]}
          onPress={handleEmergencyPress}
          disabled={disabled || isActivating}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={emergencyActive ? "checkmark" : "warning"} 
            size={buttonSize.icon} 
            color={theme.colors.surface} 
          />
          {size === 'large' && (
            <Text style={[styles.emergencyButtonText, buttonSize.text]}>
              {emergencyActive ? 'ACTIVE' : 'SOS'}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      {renderConfirmationModal()}
      {renderSuccessModal()}
    </View>
  );
};

const styles = {
  emergencyButton: {
    backgroundColor: theme.colors.emergency,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
    elevation: 8,
  },
  emergencyButtonActive: {
    backgroundColor: theme.colors.success,
  },
  emergencyButtonDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.6,
  },
  emergencyButtonText: {
    color: theme.colors.surface,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: theme.colors.emergency,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  loadingText: {
    color: theme.colors.surface,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...theme.shadows.xl,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emergencyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.emergencyBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.headlineMedium,
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  modalSubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    gap: theme.spacing.lg,
  },
  modalQuestion: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  emergencyOptions: {
    gap: theme.spacing.md,
  },
  emergencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray50,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
    marginLeft: theme.spacing.md,
  },
  callEmergencyContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  callEmergencyText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  callEmergencyButton: {
    width: '100%',
  },
  cancelButton: {
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
  },
  successModal: {
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  successIcon: {
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  successTitle: {
    ...theme.typography.headlineMedium,
    color: theme.colors.success,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  successSubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  resultDetails: {
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  resultTitle: {
    ...theme.typography.labelMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  resultText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  successActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
};

export default EmergencyButton;