import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import Card from './Card';
import theme from '../../theme';
import notificationService, { NOTIFICATION_TYPES } from '../../services/NotificationService';

const NotificationSettings = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [preferences, setPreferences] = useState({});
  const [doNotDisturb, setDoNotDisturb] = useState({
    enabled: false,
    startTime: 22 * 60, // 10:00 PM
    endTime: 6 * 60,    // 6:00 AM
  });

  // Notification type configurations
  const notificationTypes = [
    {
      key: NOTIFICATION_TYPES.DRIVER_ASSIGNED,
      title: 'Driver Assigned',
      description: 'When a driver is assigned to your trip',
      icon: 'car-outline',
      category: 'trip',
    },
    {
      key: NOTIFICATION_TYPES.DRIVER_ARRIVING,
      title: 'Driver Arriving',
      description: 'When your driver is arriving soon',
      icon: 'time-outline',
      category: 'trip',
    },
    {
      key: NOTIFICATION_TYPES.TRIP_STARTED,
      title: 'Trip Started',
      description: 'When your trip begins',
      icon: 'play-circle-outline',
      category: 'trip',
    },
    {
      key: NOTIFICATION_TYPES.TRIP_COMPLETED,
      title: 'Trip Completed',
      description: 'When your trip is finished',
      icon: 'checkmark-circle-outline',
      category: 'trip',
    },
    {
      key: NOTIFICATION_TYPES.PAYMENT_PROCESSED,
      title: 'Payment Processed',
      description: 'When your payment is successfully processed',
      icon: 'card-outline',
      category: 'payment',
    },
    {
      key: NOTIFICATION_TYPES.EMERGENCY_ALERT,
      title: 'Emergency Alerts',
      description: 'Critical safety and emergency notifications',
      icon: 'warning-outline',
      category: 'emergency',
      required: true,
    },
    {
      key: NOTIFICATION_TYPES.PROMOTIONAL,
      title: 'Promotions & Offers',
      description: 'Special deals and promotional content',
      icon: 'gift-outline',
      category: 'marketing',
    },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [enabled, prefs, dndSettings] = await Promise.all([
        notificationService.areNotificationsEnabled(),
        notificationService.getNotificationPreferences(),
        notificationService.getDoNotDisturbSettings(),
      ]);
      
      setNotificationsEnabled(enabled);
      setPreferences(prefs);
      setDoNotDisturb(dndSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
      Alert.alert('Error', 'Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = async (enabled) => {
    try {
      const success = await notificationService.toggleNotifications(enabled);
      if (success) {
        setNotificationsEnabled(enabled);
        if (!enabled) {
          Alert.alert(
            'Notifications Disabled',
            'You will not receive any notifications from GQCars. You can re-enable them anytime in settings.'
          );
        }
      } else {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive important updates about your trips.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => notificationService.openNotificationSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const handleToggleNotificationType = async (type, enabled) => {
    try {
      const newPreferences = {
        ...preferences,
        [type]: enabled,
      };
      
      const success = await notificationService.setNotificationPreferences(newPreferences);
      if (success) {
        setPreferences(newPreferences);
      } else {
        Alert.alert('Error', 'Failed to update notification preferences');
      }
    } catch (error) {
      console.error('Error updating notification type:', error);
      Alert.alert('Error', 'Failed to update notification preferences');
    }
  };

  const handleToggleDoNotDisturb = async (enabled) => {
    try {
      const newSettings = {
        ...doNotDisturb,
        enabled,
      };
      
      const success = await notificationService.setDoNotDisturbSettings(newSettings);
      if (success) {
        setDoNotDisturb(newSettings);
      } else {
        Alert.alert('Error', 'Failed to update do not disturb settings');
      }
    } catch (error) {
      console.error('Error updating do not disturb:', error);
      Alert.alert('Error', 'Failed to update do not disturb settings');
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const showTimePickerAlert = (isStartTime) => {
    // For simplicity, we'll use predefined time options
    // In a real app, you might want to use a proper time picker
    const timeOptions = [
      { label: '6:00 PM', value: 18 * 60 },
      { label: '8:00 PM', value: 20 * 60 },
      { label: '9:00 PM', value: 21 * 60 },
      { label: '10:00 PM', value: 22 * 60 },
      { label: '11:00 PM', value: 23 * 60 },
    ];

    const endTimeOptions = [
      { label: '5:00 AM', value: 5 * 60 },
      { label: '6:00 AM', value: 6 * 60 },
      { label: '7:00 AM', value: 7 * 60 },
      { label: '8:00 AM', value: 8 * 60 },
      { label: '9:00 AM', value: 9 * 60 },
    ];

    const options = isStartTime ? timeOptions : endTimeOptions;
    const title = isStartTime ? 'Select Start Time' : 'Select End Time';

    Alert.alert(
      title,
      'Choose when do not disturb should begin/end',
      [
        ...options.map(option => ({
          text: option.label,
          onPress: () => updateDoNotDisturbTime(isStartTime, option.value),
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updateDoNotDisturbTime = async (isStartTime, timeValue) => {
    try {
      const newSettings = {
        ...doNotDisturb,
        [isStartTime ? 'startTime' : 'endTime']: timeValue,
      };
      
      const success = await notificationService.setDoNotDisturbSettings(newSettings);
      if (success) {
        setDoNotDisturb(newSettings);
      }
    } catch (error) {
      console.error('Error updating do not disturb time:', error);
      Alert.alert('Error', 'Failed to update time setting');
    }
  };

  const renderNotificationTypeItem = (item) => (
    <View key={item.key} style={styles.notificationItem}>
      <View style={styles.notificationItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.category) }]}>
          <Ionicons 
            name={item.icon} 
            size={20} 
            color={theme.colors.surface} 
          />
        </View>
        <View style={styles.notificationItemText}>
          <Text style={styles.notificationTitle}>
            {item.title}
            {item.required && <Text style={styles.requiredIndicator}> *</Text>}
          </Text>
          <Text style={styles.notificationDescription}>{item.description}</Text>
        </View>
      </View>
      <Switch
        value={preferences[item.key] || false}
        onValueChange={(value) => handleToggleNotificationType(item.key, value)}
        disabled={!notificationsEnabled || item.required}
        trackColor={{
          false: theme.colors.gray300,
          true: theme.colors.primaryLight,
        }}
        thumbColor={preferences[item.key] ? theme.colors.primary : theme.colors.gray500}
      />
    </View>
  );

  const getCategoryColor = (category) => {
    const colors = {
      trip: theme.colors.primary,
      payment: theme.colors.info,
      emergency: theme.colors.emergency,
      marketing: theme.colors.secondary,
    };
    return colors[category] || theme.colors.gray500;
  };

  const groupedTypes = notificationTypes.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    acc[type.category].push(type);
    return acc;
  }, {});

  const categoryTitles = {
    trip: 'Trip Notifications',
    payment: 'Payment Notifications',
    emergency: 'Emergency Notifications',
    marketing: 'Marketing & Promotions',
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading notification settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title=""
          variant="ghost"
          size="small"
          onPress={onBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Button>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={styles.backButton} />
      </View>

      {/* Main Toggle */}
      <Card style={styles.mainToggleCard}>
        <View style={styles.mainToggle}>
          <View style={styles.mainToggleLeft}>
            <Ionicons 
              name="notifications-outline" 
              size={24} 
              color={theme.colors.primary} 
            />
            <View style={styles.mainToggleText}>
              <Text style={styles.mainToggleTitle}>Push Notifications</Text>
              <Text style={styles.mainToggleDescription}>
                Receive important updates about your trips
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{
              false: theme.colors.gray300,
              true: theme.colors.primaryLight,
            }}
            thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.gray500}
          />
        </View>
      </Card>

      {/* Notification Types */}
      {notificationsEnabled && (
        <>
          {Object.entries(groupedTypes).map(([category, types]) => (
            <Card key={category} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{categoryTitles[category]}</Text>
              {types.map(renderNotificationTypeItem)}
            </Card>
          ))}

          {/* Do Not Disturb */}
          <Card style={styles.dndCard}>
            <View style={styles.dndHeader}>
              <View style={styles.dndHeaderLeft}>
                <Ionicons 
                  name="moon-outline" 
                  size={24} 
                  color={theme.colors.textSecondary} 
                />
                <View>
                  <Text style={styles.dndTitle}>Do Not Disturb</Text>
                  <Text style={styles.dndDescription}>
                    Silence non-emergency notifications during specific hours
                  </Text>
                </View>
              </View>
              <Switch
                value={doNotDisturb.enabled}
                onValueChange={handleToggleDoNotDisturb}
                trackColor={{
                  false: theme.colors.gray300,
                  true: theme.colors.primaryLight,
                }}
                thumbColor={doNotDisturb.enabled ? theme.colors.primary : theme.colors.gray500}
              />
            </View>

            {doNotDisturb.enabled && (
              <View style={styles.dndTimeSettings}>
                <Button
                  title={`Start: ${formatTime(doNotDisturb.startTime)}`}
                  variant="outline"
                  size="small"
                  onPress={() => showTimePickerAlert(true)}
                  style={styles.timeButton}
                />
                <Text style={styles.toText}>to</Text>
                <Button
                  title={`End: ${formatTime(doNotDisturb.endTime)}`}
                  variant="outline"
                  size="small"
                  onPress={() => showTimePickerAlert(false)}
                  style={styles.timeButton}
                />
              </View>
            )}
          </Card>

          {/* Additional Info */}
          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons 
                name="information-circle-outline" 
                size={20} 
                color={theme.colors.info} 
              />
              <Text style={styles.infoTitle}>Important Notes</Text>
            </View>
            <Text style={styles.infoText}>
              • Emergency alerts will always be delivered regardless of your settings{'\n'}
              • Trip notifications help ensure a smooth ride experience{'\n'}
              • You can modify these settings anytime{'\n'}
              • Changes take effect immediately
            </Text>
            
            <Button
              title="Open System Settings"
              variant="ghost"
              size="small"
              onPress={() => notificationService.openNotificationSettings()}
              style={styles.systemSettingsButton}
            />
          </Card>
        </>
      )}

      {/* Disabled State */}
      {!notificationsEnabled && (
        <Card style={styles.disabledCard}>
          <Ionicons 
            name="notifications-off-outline" 
            size={48} 
            color={theme.colors.gray400} 
            style={styles.disabledIcon}
          />
          <Text style={styles.disabledTitle}>Notifications Disabled</Text>
          <Text style={styles.disabledDescription}>
            Enable notifications to receive important updates about your trips, driver status, and payment confirmations.
          </Text>
          <Button
            title="Enable Notifications"
            variant="primary"
            onPress={() => handleToggleNotifications(true)}
            style={styles.enableButton}
          />
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray50,
  },
  loadingText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 32,
  },
  headerTitle: {
    ...theme.typography.headlineMedium,
    color: theme.colors.text,
  },
  mainToggleCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  mainToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mainToggleText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  mainToggleTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    marginBottom: 2,
  },
  mainToggleDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  categoryCard: {
    margin: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  categoryTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  notificationItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  notificationItemText: {
    flex: 1,
  },
  notificationTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  requiredIndicator: {
    color: theme.colors.emergency,
  },
  notificationDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  dndCard: {
    margin: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  dndHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  dndHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dndTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    marginBottom: 2,
  },
  dndDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
  },
  dndTimeSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
  },
  timeButton: {
    flex: 1,
  },
  toText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.md,
  },
  infoCard: {
    margin: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  systemSettingsButton: {
    alignSelf: 'flex-start',
  },
  disabledCard: {
    margin: theme.spacing.md,
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  disabledIcon: {
    marginBottom: theme.spacing.lg,
  },
  disabledTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  disabledDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  enableButton: {
    paddingHorizontal: theme.spacing.xl,
  },
});

export default NotificationSettings;