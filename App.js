import { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './screens/OnboardingScreen';
import NewHomeScreen from './screens/NewHomeScreen';
import RideSelectionScreen from './screens/RideSelectionScreen';
import BookingScreen from './screens/BookingScreen';
import DriverConnectionScreen from './screens/DriverConnectionScreen';
import AccountScreen from './screens/AccountScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import AddPaymentMethodScreen from './screens/AddPaymentMethodScreen';
import PaymentConfirmationScreen from './screens/PaymentConfirmationScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import EmergencyContactsScreen from './screens/EmergencyContactsScreen';
import TrackRideScreen from './screens/TrackRideScreen';
import BookingCompleteScreen from './screens/BookingCompleteScreen';
import theme from './theme';
import notificationService from './services/NotificationService';
import { BookingProvider } from './context/BookingContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={NewHomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{ title: 'Account' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const navigationRef = useRef();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Initialize notification service
    const initializeNotifications = async () => {
      try {
        await notificationService.initialize();
        console.log('Notification service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize notification service:', error);
      }
    };

    initializeNotifications();

    // Set up navigation reference for notification service
    if (navigationRef.current) {
      notificationService.navigateToScreen = (screenName, params) => {
        navigationRef.current?.navigate(screenName, params);
      };
    }

    // Handle app state changes
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        console.log('App has come to the foreground');
        // Check for any pending emergency notifications
        checkPendingEmergencyNotifications();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function
    return () => {
      subscription?.remove();
      notificationService.cleanup();
    };
  }, []);

  const checkPendingEmergencyNotifications = async () => {
    try {
      // Check for emergency notifications that arrived while app was in background
      const emergencyNotification = await AsyncStorage.getItem('@gqcars:emergency_notification');
      if (emergencyNotification) {
        const notification = JSON.parse(emergencyNotification);
        // Handle emergency notification
        notificationService.handleNotificationTap(notification);
        // Remove from storage
        await AsyncStorage.removeItem('@gqcars:emergency_notification');
      }
    } catch (error) {
      console.error('Error checking pending emergency notifications:', error);
    }
  };

  // Ensure fonts are properly configured for navigation
  const navigationTheme = {
    ...theme.navigation,
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      light: {
        fontFamily: 'System',
        fontWeight: '300',
      },
      thin: {
        fontFamily: 'System',
        fontWeight: '100',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: 'bold',
      },
    },
  };

  return (
    <BookingProvider>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <StatusBar style="dark" backgroundColor={theme.colors.background} />
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
        />
        <Stack.Screen 
          name="Home" 
          component={MainTabs}
        />
        <Stack.Screen 
          name="RideSelection" 
          component={RideSelectionScreen}
        />
        <Stack.Screen 
          name="BookingLocation" 
          component={require('./screens/BookingLocationScreen').default}
        />
        <Stack.Screen 
          name="BookingDetails" 
          component={require('./screens/BookingDetailsScreen').default}
        />
        <Stack.Screen 
          name="BookingConfirmation" 
          component={require('./screens/BookingConfirmationScreen').default}
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen}
        />
        <Stack.Screen 
          name="DriverConnection" 
          component={DriverConnectionScreen}
        />
        <Stack.Screen 
          name="PaymentMethod" 
          component={PaymentMethodScreen}
        />
        <Stack.Screen 
          name="AddPaymentMethod" 
          component={AddPaymentMethodScreen}
        />
        <Stack.Screen 
          name="PaymentConfirmation" 
          component={PaymentConfirmationScreen}
        />
        <Stack.Screen 
          name="Emergency" 
          component={EmergencyScreen}
        />
        <Stack.Screen 
          name="EmergencyContacts" 
          component={EmergencyContactsScreen}
        />
        <Stack.Screen 
          name="TrackRide" 
          component={TrackRideScreen}
        />
        <Stack.Screen 
          name="BookingComplete" 
          component={BookingCompleteScreen}
        />
        {/* Legacy routes for backwards compatibility */}
        <Stack.Screen 
          name="Assessment" 
          component={NewHomeScreen}
        />
        <Stack.Screen 
          name="Service" 
          component={RideSelectionScreen}
        />
        <Stack.Screen 
          name="Profile" 
          component={AccountScreen}
        />
      </Stack.Navigator>
      </NavigationContainer>
    </BookingProvider>
  );
}