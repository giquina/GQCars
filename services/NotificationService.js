import messaging from '@react-native-firebase/messaging';
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
   */
  async requestPermission() {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted');
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_ENABLED, 'true');
        return true;
      } else {
        console.log('Notification permission denied');
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_ENABLED, 'false');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get FCM token for this device
   */
  async getFCMToken() {
    try {
      // Check if we already have a token stored
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
      
      // Get current token from Firebase
      const token = await messaging().getToken();
      
      if (token) {
        this.fcmToken = token;
        
        // Update stored token if it's different
        if (storedToken !== token) {
          await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
          console.log('FCM Token updated:', token);
          
          // TODO: Send token to your backend server
          await this.sendTokenToServer(token);
        }
        
        return token;
      } else {
        console.log('No FCM token available');
        return null;
      }
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
   */
  setupNotificationListeners() {
    // Listen for foreground messages
    this.foregroundListener = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      await this.handleForegroundNotification(remoteMessage);
    });

    // Listen for notification tap when app is in background
    this.backgroundListener = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Background notification tapped:', remoteMessage);
      this.handleNotificationTap(remoteMessage);
    });

    // Check if app was opened from a notification when it was completely closed
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
          this.handleNotificationTap(remoteMessage);
        }
      });

    // Listen for token refresh
    messaging().onTokenRefresh((token) => {
      console.log('FCM token refreshed:', token);
      this.fcmToken = token;
      AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
      this.sendTokenToServer(token);
    });
  }

  /**
   * Set up background message handler
   */
  setupBackgroundMessageHandler() {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message received:', remoteMessage);
      // Handle background messages here
      // Note: You can't show alerts or navigate in background handler
      await this.processBackgroundMessage(remoteMessage);
    });
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