# GQCars Push Notifications Setup Guide

This guide explains how to set up and use the push notification system in the GQCars app.

## 🚀 Quick Start

The notification system has been implemented and integrated into the app. Here's what was added:

### Dependencies Installed
- `@react-native-firebase/app` - Firebase core functionality
- `@react-native-firebase/messaging` - Firebase Cloud Messaging
- `@react-native-async-storage/async-storage` - Local storage for preferences

### Files Created

1. **`/services/NotificationService.js`** - Core notification service
2. **`/components/ui/NotificationSettings.js`** - Settings UI component
3. **`/firebase.json`** - Firebase configuration (template)

### Integration Points

1. **App.js** - Initialized notification service on app startup
2. **AccountScreen.js** - Added notification settings access
3. **DriverConnectionScreen.js** - Trip event notifications
4. **EmergencyButton.js** - Emergency alert notifications
5. **PaymentService.js** - Payment completion notifications

## 📱 Notification Types

The app supports these notification types:

- **Driver Assigned** - When a driver is assigned to your trip
- **Driver Arriving** - 5-minute warning before driver arrival
- **Trip Started** - When your trip begins
- **Trip Completed** - When your trip ends
- **Payment Processed** - When payment is successfully processed
- **Emergency Alerts** - Critical safety notifications (always enabled)
- **Promotional** - Marketing messages and offers (disabled by default)

## ⚙️ Configuration Required

### 1. Firebase Project Setup

To use push notifications in production, you need to:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add your Android and iOS apps to the project
3. Download the `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place these files in the appropriate platform directories
5. Update `firebase.json` with your actual project configuration

### 2. iOS Setup

```bash
# Install pods (iOS only)
cd ios && pod install
```

Add push notification capability in Xcode:
1. Open your project in Xcode
2. Select your target
3. Go to "Signing & Capabilities"
4. Add "Push Notifications" capability

### 3. Android Setup

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />
```

## 🔧 Usage

### Accessing Notification Settings

Users can access notification settings through:
1. **Account Screen** - Menu item "Notifications"
2. **Account Screen** - Header notification icon
3. Both open the same settings modal

### Settings Available

- **Global toggle** - Enable/disable all notifications
- **Per-type preferences** - Control each notification type
- **Do Not Disturb** - Set quiet hours (emergency alerts still work)
- **Sound/Vibration** - System-level settings access

### Programmatic Usage

```javascript
import notificationService, { NOTIFICATION_TYPES } from './services/NotificationService';

// Send a trip notification
await notificationService.sendTripNotification(
  NOTIFICATION_TYPES.DRIVER_ASSIGNED,
  {
    driverName: 'John Smith',
    eta: 5,
    tripId: 'trip_123'
  }
);

// Send emergency notification
await notificationService.sendEmergencyNotification({
  id: 'emergency_' + Date.now(),
  message: 'Emergency alert activated!'
});

// Check if notifications are enabled
const enabled = await notificationService.areNotificationsEnabled();

// Get notification preferences
const preferences = await notificationService.getNotificationPreferences();
```

## 🔔 Notification Flow

### App States

1. **Foreground** - Shows alert dialog with view/dismiss options
2. **Background** - Shows system notification, handles tap to navigate
3. **Closed** - Shows system notification, opens app when tapped

### Navigation

Notifications automatically navigate to appropriate screens:
- Trip notifications → DriverConnection screen
- Payment notifications → PaymentConfirmation screen
- Emergency alerts → Emergency screen
- Promotional → Home screen

## 🛡️ Permission Handling

The service handles permission gracefully:

1. **First Request** - Asks for notification permission
2. **Denied** - Shows fallback options, allows retry
3. **Settings Access** - Direct link to system settings
4. **Graceful Fallback** - App works without notifications

## 🌙 Do Not Disturb

Users can set quiet hours to avoid non-critical notifications:

- **Time Range** - Set start and end times
- **Emergency Override** - Emergency alerts always work
- **Cross-midnight** - Supports overnight periods (e.g., 10 PM to 6 AM)

## 🚨 Emergency Notifications

Emergency notifications have special behavior:

- **Always Delivered** - Bypass all user preferences
- **Immediate Alert** - Show even in Do Not Disturb mode
- **High Priority** - Use system's urgent notification channel
- **Persistent** - Stored if app is completely closed

## 🔄 Background Processing

The service handles background message processing:

- **Background Handler** - Processes messages when app is backgrounded
- **State Restoration** - Checks for pending alerts on app resume
- **Token Management** - Automatically refreshes FCM tokens
- **Server Sync** - Sends tokens to backend (requires implementation)

## 📝 Backend Integration

The notification service expects these backend endpoints:

```javascript
// Register FCM token
POST /api/notifications/register-token
{
  "token": "fcm_token_here",
  "platform": "ios|android",
  "userId": "user_id"
}

// Send notification
POST /api/notifications/send
{
  "to": "fcm_token",
  "notification": {
    "title": "Title",
    "body": "Message"
  },
  "data": {
    "type": "driver_assigned",
    "tripId": "trip_123"
  }
}
```

## 🐛 Debugging

Enable debug logging by setting:

```javascript
// In your development environment
console.log('FCM Token:', await notificationService.getFCMToken());
```

Common issues:
1. **No token** - Check Firebase setup and permissions
2. **Not receiving** - Verify backend integration
3. **Wrong navigation** - Check notification data payload
4. **iOS issues** - Ensure push capability is enabled

## 🔮 Future Enhancements

Potential improvements:
1. **Rich notifications** - Images, actions, quick replies
2. **Notification history** - In-app notification center
3. **Advanced scheduling** - Location-based, time-based triggers
4. **Analytics** - Track notification engagement
5. **A/B testing** - Test different notification content

## 📱 Testing

To test notifications:

1. **Development** - Use Firebase Console's Cloud Messaging
2. **Simulator** - iOS Simulator supports push notifications (iOS 16+)
3. **Device** - Test on real devices for full functionality
4. **Background** - Test with app backgrounded/closed

## 🔒 Privacy & Security

- **Token Security** - FCM tokens are not sensitive but should be protected
- **User Control** - Users have full control over notification preferences
- **Opt-out** - Easy to disable all notifications
- **Emergency Override** - Clearly communicated to users

## 📞 Support

For notification issues:
1. Check Firebase Console for delivery status
2. Verify device notification settings
3. Test with different notification types
4. Check app logs for error messages

---

This notification system provides a robust foundation for user engagement while respecting user preferences and privacy. The modular design makes it easy to extend with additional notification types and features as needed.