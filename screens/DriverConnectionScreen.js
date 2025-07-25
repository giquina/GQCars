import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmergencyButton from '../components/ui/EmergencyButton';
import theme from '../theme';
import notificationService, { NOTIFICATION_TYPES } from '../services/NotificationService';

const DriverConnectionScreen = ({ navigation, route }) => {
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, arriving
  const { selectedRide, destination } = route.params || {};

  const driverData = {
    name: 'John Smith',
    rating: 4.8,
    photo: 'https://via.placeholder.com/80x80/00C851/FFFFFF?text=JS',
    car: 'Toyota Camry',
    plateNumber: 'ABC 123',
    eta: '3 min',
    credentials: 'Licensed Security Officer',
    experience: 'SIA Certified • Professional Security Since 2018',
    badges: ['SIA Licensed', 'Background Checked', 'Close Protection'],
  };

  useEffect(() => {
    // Simulate connection process with notifications
    const timer1 = setTimeout(async () => {
      setConnectionStatus('connected');
      
      // Send driver assigned notification
      await notificationService.sendTripNotification(NOTIFICATION_TYPES.DRIVER_ASSIGNED, {
        driverName: driverData.name,
        eta: parseInt(driverData.eta),
        tripId: 'trip_123',
      });
    }, 3000);

    const timer2 = setTimeout(async () => {
      setConnectionStatus('arriving');
      
      // Send driver arriving notification
      await notificationService.sendTripNotification(NOTIFICATION_TYPES.DRIVER_ARRIVING, {
        driverName: driverData.name,
        tripId: 'trip_123',
      });
    }, 6000);

    // Simulate trip start after 10 seconds
    const timer3 = setTimeout(async () => {
      await notificationService.sendTripNotification(NOTIFICATION_TYPES.TRIP_STARTED, {
        driverName: driverData.name,
        tripId: 'trip_123',
      });
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case 'connecting':
        return (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.statusTitle}>Finding your security officer</Text>
            <Text style={styles.statusSubtitle}>Connecting you with a licensed security professional</Text>
          </View>
        );
      case 'connected':
        return (
          <View style={styles.statusContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.statusTitle}>Security officer found!</Text>
            <Text style={styles.statusSubtitle}>Your licensed security officer is on the way</Text>
          </View>
        );
      case 'arriving':
        return (
          <View style={styles.statusContainer}>
            <View style={styles.carIcon}>
              <Ionicons name="car" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.statusTitle}>Your security officer is arriving</Text>
            <Text style={styles.statusSubtitle}>ETA: {driverData.eta}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Transport</Text>
        <View style={styles.headerRight}>
          <EmergencyButton 
            size="small"
            onEmergencyActivated={() => {
              // Optional: Navigate to emergency screen or show specific UI
              navigation.navigate('Emergency');
            }}
          />
        </View>
      </View>

      {/* Driver Card */}
      <Card style={styles.driverCard} elevation="lg">
        <View style={styles.driverInfo}>
          <View style={styles.driverPhotoContainer}>
            <Image
              source={{ uri: driverData.photo }}
              style={styles.driverPhoto}
            />
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{driverData.name}</Text>
            <Text style={styles.driverCredentials}>{driverData.credentials}</Text>
            <View style={styles.credentialsBadges}>
              {driverData.badges.map((badge, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{driverData.rating}</Text>
              <Text style={styles.ratingCount}>• {driverData.experience}</Text>
            </View>
            <Text style={styles.carInfo}>{driverData.car} • {driverData.plateNumber}</Text>
          </View>

          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color={theme.colors.surface} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Connection Status */}
      <View style={styles.statusSection}>
        {renderConnectionStatus()}
      </View>

      {/* Trip Details */}
      <Card style={styles.tripCard} elevation="md">
        <Text style={styles.tripTitle}>Trip Details</Text>
        
        <View style={styles.tripRoute}>
          <View style={styles.routeItem}>
            <View style={styles.routeIcon}>
              <Ionicons name="ellipse" size={12} color={theme.colors.primary} />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeAddress}>Current Location</Text>
            </View>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.routeItem}>
            <View style={styles.routeIcon}>
              <Ionicons name="location" size={16} color={theme.colors.error} />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeAddress}>{destination?.title || 'Destination'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tripSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ride Type:</Text>
            <Text style={styles.summaryValue}>{selectedRide?.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Distance:</Text>
            <Text style={styles.summaryValue}>3.2 km</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Time:</Text>
            <Text style={styles.summaryValue}>12 min</Text>
          </View>
          <View style={[styles.summaryRow, styles.priceRow]}>
            <Text style={styles.totalLabel}>Total Price:</Text>
            <Text style={styles.totalPrice}>{selectedRide?.price}</Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {connectionStatus === 'arriving' && (
          <Button
            title="Track Security Officer"
            variant="outline"
            style={styles.trackButton}
            onPress={() => navigation.navigate('TrackRide')}
          />
        )}
        
        <Button
          title="Cancel Ride"
          variant="ghost"
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  driverCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverPhotoContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  driverPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    ...theme.typography.titleLarge,
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 20,
  },
  driverCredentials: {
    ...theme.typography.labelMedium,
    color: '#00C851',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
    fontSize: 14,
  },
  credentialsBadges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#00C851' + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00C851' + '30',
  },
  badgeText: {
    ...theme.typography.labelSmall,
    color: '#00C851',
    fontSize: 11,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  rating: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  ratingCount: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  carInfo: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00C851',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00C851',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statusSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  statusContainer: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: theme.spacing.md,
  },
  carIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statusTitle: {
    ...theme.typography.headlineSmall,
    color: '#1F2937',
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontSize: 22,
    fontWeight: '700',
  },
  statusSubtitle: {
    ...theme.typography.bodyMedium,
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 16,
  },
  tripCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tripTitle: {
    ...theme.typography.titleLarge,
    color: '#1F2937',
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    fontSize: 18,
  },
  tripRoute: {
    marginBottom: theme.spacing.lg,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  routeAddress: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginTop: 2,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.gray300,
    marginLeft: 11,
    marginVertical: theme.spacing.xs,
  },
  tripSummary: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    paddingTop: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
  },
  priceRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  totalPrice: {
    ...theme.typography.titleLarge,
    color: '#00C851',
    fontWeight: '800',
    fontSize: 20,
  },
  actionButtons: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  trackButton: {
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: theme.colors.error,
  },
};

export default DriverConnectionScreen;