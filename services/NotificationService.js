// Temporarily disabled React Native Firebase for Expo Go compatibility
// import messaging from '@react-native-firebase/messaging';
import { Platform, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification types for different trip events
export const NOTIFICATION_TYPES = {
  DRIVER_ASSIGNED: 'driver_assigned',
  DRIVER_ARRIVING: 'driver_arriving',
  TRIP_STARTED: 'trip_started',
  TRIP_COMPLETED: 'trip_completed',
  PAYMENT_PROCESSED: 'payment_processed',
  EMERGENCY_ALERT: 'emergency_alert',
  PROMOTIONAL: 'promotional',
};

// Storage keys for notification preferences
const STORAGE_KEYS = {
  FCM_TOKEN: '@gqcars:fcm_token',
  NOTIFICATION_ENABLED: '@gqcars:notifications_enabled',
  NOTIFICATION_PREFERENCES: '@gqcars:notification_preferences',
  DO_NOT_DISTURB: '@gqcars:do_not_disturb',
};

class NotificationService {
  constructor() {
    this.fcmToken = null;
    this.notificationListener = null;
    this.backgroundListener = null;
    this.foregroundListener = null;
    this.isInitialized = false;
  }

  /**
   * Initialize Firebase messaging and set up listeners
   */
  async initialize() {
    try {
      if (this.isInitialized) {
        console.log('NotificationService already initialized');
        return;
      }

      // Skip notification initialization on web for now
      if (Platform.OS === 'web') {
        console.log('Notification service disabled on web');
        this.isInitialized = true;
        return true;
      }

      // Request permission for notifications
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return false;
      }

      // Get FCM token
      await this.getFCMToken();

      // Set up notification listeners
      this.setupNotificationListeners();

      // Set up background message handler
      this.setupBackgroundMessageHandler();

      this.isInitialized = true;
      console.log('NotificationService initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing NotificationService:', error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   * Temporarily simplified for Expo Go compatibility
   */
  async requestPermission() {
    try {
      console.log('Notification permission granted (simulated for Expo Go)');
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_ENABLED, 'true');
      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get FCM token for this device
   * Temporarily simplified for Expo Go compatibility
   */
  async getFCMToken() {
    try {
      // Simulate FCM token for Expo Go
      const simulatedToken = 'expo-go-simulation-token-' + Math.random().toString(36).substr(2, 9);
      this.fcmToken = simulatedToken;
      
      await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, simulatedToken);
      console.log('FCM Token simulated for Expo Go:', simulatedToken);
      
      return simulatedToken;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Send FCM token to backend server
   */
  async sendTokenToServer(token) {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('YOUR_API_ENDPOINT/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          platform: Platform.OS,
          userId: 'USER_ID_HERE', // Get from your auth service
        }),
      });

      if (response.ok) {
        console.log('FCM token registered with server');
      } else {
        console.error('Failed to register FCM token with server');
      }
    } catch (error) {
      console.error('Error sending token to server:', error);
    }
  }

  /**
   * Set up notification listeners for foreground messages
   * Temporarily simplified for Expo Go compatibility
   */
  setupNotificationListeners() {
    console.log('Notification listeners set up (simulated for Expo Go)');
    // Listeners are disabled for Expo Go compatibility
    // Real implementation would use messaging().onMessage(), etc.
  }

  /**
   * Set up background message handler
   * Temporarily simplified for Expo Go compatibility
   */
  setupBackgroundMessageHandler() {
    console.log('Background message handler set up (simulated for Expo Go)');
    // Background handler is disabled for Expo Go compatibility
  }

  /**
   * Handle notification received while app is in foreground
   */
  async handleForegroundNotification(remoteMessage) {
    const { notification, data } = remoteMessage;
    
    // Check if notifications are enabled and not in do not disturb mode
    const canShowNotification = await this.canShowNotification(data?.type);
    if (!canShowNotification) {
      return;
    }

    // Show in-app notification or alert
    Alert.alert(
      notification?.title || 'GQCars',
      notification?.body || 'You have a new notification',
      [
        {
          text: 'Dismiss',
          style: 'cancel',
        },
        {
          text: 'View',
          onPress: () => this.handleNotificationTap(remoteMessage),
        },
      ]
    );
  }

  /**
   * Handle notification tap - navigate to appropriate screen
   */
  handleNotificationTap(remoteMessage) {
    const { data } = remoteMessage;
    
    if (!data) return;

    // Navigate based on notification type
    switch (data.type) {
      case NOTIFICATION_TYPES.DRIVER_ASSIGNED:
      case NOTIFICATION_TYPES.DRIVER_ARRIVING:
      case NOTIFICATION_TYPES.TRIP_STARTED:
        // Navigate to trip tracking screen
        this.navigateToScreen('DriverConnection', { tripId: data.tripId });
        break;
        
      case NOTIFICATION_TYPES.TRIP_COMPLETED:
      case NOTIFICATION_TYPES.PAYMENT_PROCESSED:
        // Navigate to trip history or payment confirmation
        this.navigateToScreen('PaymentConfirmation', { tripId: data.tripId });
        break;
        
      case NOTIFICATION_TYPES.EMERGENCY_ALERT:
        // Navigate to emergency screen
        this.navigateToScreen('Emergency', { alertId: data.alertId });
        break;
        
      case NOTIFICATION_TYPES.PROMOTIONAL:
        // Navigate to promotional content or home
        this.navigateToScreen('Home');
        break;
        
      default:
        // Default to home screen
        this.navigateToScreen('Home');
    }
  }

  /**
   * Process background messages
   */
  async processBackgroundMessage(remoteMessage) {
    const { data } = remoteMessage;
    
    // Store important notifications for later display
    if (data?.type === NOTIFICATION_TYPES.EMERGENCY_ALERT) {
      await AsyncStorage.setItem(
        '@gqcars:emergency_notification',
        JSON.stringify(remoteMessage)
      );
    }
  }

  /**
   * Check if notification can be shown based on user preferences
   */
  async canShowNotification(notificationType) {
    try {
      // Check if notifications are globally enabled
      const notificationsEnabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_ENABLED);
      if (notificationsEnabled !== 'true') {
        return false;
      }

      // Check notification type preferences
      const preferences = await this.getNotificationPreferences();
      if (!preferences[notificationType]) {
        return false;
      }

      // Check do not disturb settings
      const doNotDisturb = await this.getDoNotDisturbSettings();
      if (this.isInDoNotDisturbPeriod(doNotDisturb)) {
        // Always allow emergency alerts
        return notificationType === NOTIFICATION_TYPES.EMERGENCY_ALERT;
      }

      return true;
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return true; // Default to showing notifications
    }
  }

  /**
   * Check if current time is in do not disturb period
   */
  isInDoNotDisturbPeriod(doNotDisturbSettings) {
    if (!doNotDisturbSettings.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = doNotDisturbSettings.startTime;
    const endTime = doNotDisturbSettings.endTime;

    if (startTime <= endTime) {
      // Same day period (e.g., 9:00 to 17:00)
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight period (e.g., 22:00 to 6:00)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Navigate to a specific screen
   */
  navigateToScreen(screenName, params = {}) {
    // This should be implemented with your navigation reference
    // For now, we'll use a placeholder
    console.log(`Navigate to ${screenName} with params:`, params);
    
    // TODO: Implement actual navigation
    // Example: NavigationService.navigate(screenName, params);
  }

  /**
   * Send a local notification
   */
  async scheduleLocalNotification(title, body, data = {}, delay = 0) {
    try {
      const canShow = await this.canShowNotification(data.type);
      if (!canShow) {
        return;
      }

      // For React Native Firebase, local notifications are typically handled
      // by a separate library like @react-native-async-storage/async-storage
      // or expo-notifications. For now, we'll use a simple alert.
      
      if (delay > 0) {
        setTimeout(() => {
          Alert.alert(title, body);
        }, delay);
      } else {
        Alert.alert(title, body);
      }
    } catch (error) {
      console.error('Error scheduling local notification:', error);
    }
  }

  /**
   * Send notification for specific trip events
   */
  async sendTripNotification(type, tripData) {
    const notifications = {
      [NOTIFICATION_TYPES.DRIVER_ASSIGNED]: {
        title: 'Driver Assigned!',
        body: `${tripData.driverName} will be your driver. ETA: ${tripData.eta} minutes`,
      },
      [NOTIFICATION_TYPES.DRIVER_ARRIVING]: {
        title: 'Driver Arriving Soon',
        body: `${tripData.driverName} will arrive in 5 minutes. Please be ready!`,
      },
      [NOTIFICATION_TYPES.TRIP_STARTED]: {
        title: 'Trip Started',
        body: 'Your trip has begun. Enjoy your ride with GQCars!',
      },
      [NOTIFICATION_TYPES.TRIP_COMPLETED]: {
        title: 'Trip Completed',
        body: 'Your trip is complete. Thank you for choosing GQCars!',
      },
      [NOTIFICATION_TYPES.PAYMENT_PROCESSED]: {
        title: 'Payment Processed',
        body: `Your payment of $${tripData.amount} has been processed successfully.`,
      },
    };

    const notification = notifications[type];
    if (notification) {
      await this.scheduleLocalNotification(
        notification.title,
        notification.body,
        { type, tripId: tripData.tripId }
      );
    }
  }

  /**
   * Send emergency notification
   */
  async sendEmergencyNotification(alertData) {
    await this.scheduleLocalNotification(
      '🚨 Emergency Alert',
      alertData.message,
      { type: NOTIFICATION_TYPES.EMERGENCY_ALERT, alertId: alertData.id }
    );
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences() {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES);
      return preferences ? JSON.parse(preferences) : this.getDefaultPreferences();
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Set notification preferences
   */
  async setNotificationPreferences(preferences) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error setting notification preferences:', error);
      return false;
    }
  }

  /**
   * Get default notification preferences
   */
  getDefaultPreferences() {
    return {
      [NOTIFICATION_TYPES.DRIVER_ASSIGNED]: true,
      [NOTIFICATION_TYPES.DRIVER_ARRIVING]: true,
      [NOTIFICATION_TYPES.TRIP_STARTED]: true,
      [NOTIFICATION_TYPES.TRIP_COMPLETED]: true,
      [NOTIFICATION_TYPES.PAYMENT_PROCESSED]: true,
      [NOTIFICATION_TYPES.EMERGENCY_ALERT]: true,
      [NOTIFICATION_TYPES.PROMOTIONAL]: false,
    };
  }

  /**
   * Get do not disturb settings
   */
  async getDoNotDisturbSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.DO_NOT_DISTURB);
      return settings ? JSON.parse(settings) : this.getDefaultDoNotDisturbSettings();
    } catch (error) {
      console.error('Error getting do not disturb settings:', error);
      return this.getDefaultDoNotDisturbSettings();
    }
  }

  /**
   * Set do not disturb settings
   */
  async setDoNotDisturbSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DO_NOT_DISTURB, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error setting do not disturb settings:', error);
      return false;
    }
  }

  /**
   * Get default do not disturb settings
   */
  getDefaultDoNotDisturbSettings() {
    return {
      enabled: false,
      startTime: 22 * 60, // 10:00 PM in minutes
      endTime: 6 * 60,    // 6:00 AM in minutes
    };
  }

  /**
   * Enable/disable all notifications
   */
  async toggleNotifications(enabled) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_ENABLED, enabled.toString());
      
      if (enabled) {
        // Re-request permission if enabling
        return await this.requestPermission();
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling notifications:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  async areNotificationsEnabled() {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_ENABLED);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking notification status:', error);
      return false;
    }
  }

  /**
   * Open app notification settings
   */
  openNotificationSettings() {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }

  /**
   * Clean up listeners
   */
  cleanup() {
    if (this.foregroundListener) {
      this.foregroundListener();
    }
    if (this.backgroundListener) {
      this.backgroundListener();
    }
    this.isInitialized = false;
  }
}

// Create and export singleton instance
const notificationService = new NotificationService();
export default notificationService;

// Also export the class for testing purposes
export { NotificationService };