import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import NotificationSettings from '../components/ui/NotificationSettings';
import theme from '../theme';

const AccountScreen = ({ navigation }) => {
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;
  
  const userData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    photo: 'https://via.placeholder.com/80x80/00C851/FFFFFF?text=JD',
    balance: 19.00,
    totalRides: 24,
    totalSaved: 145,
    rating: 4.8,
    securityRides: 24,
  };

  const handleMenuPress = (action, params = {}) => {
    switch (action) {
      case 'myOrders':
        // Navigate to existing ride history or show alert
        Alert.alert('Trip History', 'View your recent security transport trips', [
          { text: 'OK', style: 'default' }
        ]);
        break;
      case 'payment':
        navigation.navigate('PaymentMethod');
        break;
      case 'share':
        Alert.alert('Invite Friends', 'Share GQCars with friends and earn rewards!', [
          { text: 'Share', onPress: () => console.log('Share pressed') },
          { text: 'Cancel', style: 'cancel' }
        ]);
        break;
      case 'notifications':
        setShowNotificationSettings(true);
        break;
      case 'promotions':
        Alert.alert('Promotions', 'No active promotions at the moment. Check back soon!', [
          { text: 'OK', style: 'default' }
        ]);
        break;
      case 'settings':
        Alert.alert('Settings', 'App settings and preferences', [
          { text: 'OK', style: 'default' }
        ]);
        break;
      case 'logout':
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out') }
        ]);
        break;
      default:
        console.log('Menu action not implemented:', action);
    }
  };

  const menuItems = [
    {
      id: 1,
      title: 'Trip History',
      icon: 'receipt-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('myOrders'),
    },
    {
      id: 2,
      title: 'Payment Methods',
      icon: 'card-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('payment'),
    },
    {
      id: 3,
      title: 'Invite Friends',
      icon: 'share-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('share'),
    },
    {
      id: 4,
      title: 'Notifications',
      icon: 'notifications-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('notifications'),
    },
    {
      id: 5,
      title: 'Emergency Contacts',
      icon: 'people-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => navigation.navigate('EmergencyContacts'),
    },
    {
      id: 6,
      title: 'Security Settings',
      icon: 'shield-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('settings'),
    },
    {
      id: 7,
      title: 'Log out',
      icon: 'log-out-outline',
      rightIcon: null,
      textColor: theme.colors.error,
      onPress: () => handleMenuPress('logout'),
    },
  ];

  const recentRides = [
    {
      id: 1,
      driverName: 'Sarah Johnson',
      driverPhoto: 'https://via.placeholder.com/50x50/00C851/FFFFFF?text=SJ',
      driverTitle: 'Licensed Security Driver',
      date: 'Today, 2:30 PM',
      pickup: 'Home',
      destination: 'Downtown Mall',
      price: '$12.50',
      status: 'Safe Trip Completed',
      rating: 5,
    },
    {
      id: 2,
      driverName: 'Mike Wilson',
      driverPhoto: 'https://via.placeholder.com/50x50/00C851/FFFFFF?text=MW',
      driverTitle: 'Licensed Security Driver',
      date: 'Yesterday, 5:45 PM',
      pickup: 'Office',
      destination: 'Airport',
      price: '$25.00',
      status: 'Safe Trip Completed',
      rating: 4,
    },
    {
      id: 3,
      driverName: 'Emily Chen',
      driverPhoto: 'https://via.placeholder.com/50x50/00C851/FFFFFF?text=EC',
      driverTitle: 'Licensed Security Driver',
      date: 'Dec 15, 11:20 AM',
      pickup: 'Hotel',
      destination: 'Conference Center',
      price: '$8.75',
      status: 'Safe Trip Completed',
      rating: 5,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
          <TouchableOpacity 
            style={styles.headerNotificationBtn}
            onPress={() => setShowNotificationSettings(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <Card style={styles.profileCard} elevation="md">
          <View style={styles.profileInfo}>
            <Image source={{ uri: userData.photo }} style={styles.profilePhoto} />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileEmail}>{userData.email}</Text>
              <Text style={styles.profilePhone}>{userData.phone}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Edit Profile', 'Profile editing functionality')}
            >
              <Ionicons name="pencil-outline" size={20} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard} elevation="sm">
            <View style={styles.statIcon}>
              <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.statValue}>{userData.securityRides}</Text>
            <Text style={styles.statLabel}>Safe Trips</Text>
          </Card>
          
          <Card style={styles.statCard} elevation="sm">
            <View style={styles.statIcon}>
              <Ionicons name="star" size={24} color="#FFD700" />
            </View>
            <Text style={styles.statValue}>{userData.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </Card>
          
          <Card style={styles.statCard} elevation="sm">
            <View style={styles.statIcon}>
              <Ionicons name="wallet-outline" size={24} color={theme.colors.secondary} />
            </View>
            <Text style={styles.statValue}>${userData.totalSaved}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </Card>
        </View>

        {/* Balance Card */}
        <Card style={styles.balanceCard} elevation="lg">
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Account Balance</Text>
              <Text style={styles.balanceAmount}>${userData.balance.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addMoneyButton}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Add Money', 'Add funds to your account balance')}
            >
              <Ionicons name="add" size={20} color={theme.colors.surface} />
              <Text style={styles.addMoneyText}>Add Money</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={[styles.contentContainer, isTablet && styles.contentContainerTablet]}>
          {/* Menu Section */}
          <View style={[styles.leftColumn, isTablet && styles.leftColumnTablet]}>
            <Text style={styles.sectionTitle}>Menu</Text>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.menuIcon}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={item.textColor || theme.colors.textSecondary}
                    />
                  </View>
                  <Text style={[
                    styles.menuText,
                    item.textColor && { color: item.textColor }
                  ]}>
                    {item.title}
                  </Text>
                </View>
                {item.rightIcon && (
                  <Ionicons
                    name={item.rightIcon}
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* My Rides Section */}
          <View style={[styles.rightColumn, isTablet && styles.rightColumnTablet]}>
            <Text style={styles.sectionTitle}>Recent safe trips</Text>
            {recentRides.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Trip Details', `View details for trip to ${ride.destination}`, [
                  { text: 'Rate Trip', onPress: () => console.log('Rate trip') },
                  { text: 'View Details', onPress: () => console.log('View details') },
                  { text: 'Close', style: 'cancel' }
                ])}
              >
                <Card style={styles.rideCard} elevation="sm">
                <View style={styles.rideHeader}>
                  <Image source={{ uri: ride.driverPhoto }} style={styles.driverPhoto} />
                  <View style={styles.rideInfo}>
                    <Text style={styles.driverName}>{ride.driverName}</Text>
                    <Text style={styles.driverTitle}>{ride.driverTitle}</Text>
                    <Text style={styles.rideDate}>{ride.date}</Text>
                  </View>
                  <Text style={styles.ridePrice}>{ride.price}</Text>
                </View>
                
                <View style={styles.rideRoute}>
                  <Text style={styles.routeText}>{ride.pickup} → {ride.destination}</Text>
                </View>
                
                <View style={styles.rideFooter}>
                  <View style={styles.rideStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{ride.status}</Text>
                  </View>
                  <View style={styles.rideRating}>
                    {[...Array(5)].map((_, index) => (
                      <Ionicons
                        key={index}
                        name="star"
                        size={12}
                        color={index < ride.rating ? '#FFD700' : theme.colors.gray300}
                      />
                    ))}
                  </View>
                </View>
                </Card>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              activeOpacity={0.7}
              onPress={() => handleMenuPress('myOrders')}
            >
              <Text style={styles.viewAllText}>View all rides</Text>
              <Ionicons name="chevron-forward-outline" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Notification Settings Modal */}
      <Modal
        visible={showNotificationSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotificationSettings(false)}
      >
        <NotificationSettings onBack={() => setShowNotificationSettings(false)} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    ...theme.typography.headlineLarge,
    color: theme.colors.text,
    fontWeight: '700',
  },
  headerNotificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.gray200,
    marginRight: theme.spacing.md,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '600',
  },
  profileEmail: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  profilePhone: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '700',
  },
  statLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  balanceCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.text,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.surface,
    opacity: 0.8,
  },
  balanceAmount: {
    ...theme.typography.displaySmall,
    color: theme.colors.surface,
    fontWeight: '700',
    marginTop: 4,
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
  },
  addMoneyText: {
    ...theme.typography.labelMedium,
    color: theme.colors.surface,
    marginLeft: 4,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  contentContainerTablet: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  leftColumn: {
    marginBottom: theme.spacing.xl,
  },
  leftColumnTablet: {
    flex: 1,
    marginBottom: 0,
  },
  rightColumn: {
    marginBottom: theme.spacing.xl,
  },
  rightColumnTablet: {
    flex: 1,
    marginBottom: 0,
  },
  sectionTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  rideCard: {
    marginBottom: theme.spacing.md,
  },
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  driverPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray200,
    marginRight: theme.spacing.sm,
  },
  rideInfo: {
    flex: 1,
  },
  driverName: {
    ...theme.typography.titleSmall,
    color: theme.colors.text,
    fontWeight: '500',
  },
  driverTitle: {
    ...theme.typography.labelSmall,
    color: theme.colors.primary,
    marginTop: 1,
  },
  rideDate: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  ridePrice: {
    ...theme.typography.titleSmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  rideRoute: {
    marginBottom: theme.spacing.sm,
  },
  routeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    ...theme.typography.labelSmall,
    color: theme.colors.primary,
  },
  rideRating: {
    flexDirection: 'row',
    gap: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  viewAllText: {
    ...theme.typography.labelMedium,
    color: theme.colors.primary,
    marginRight: 4,
  },
};

export default AccountScreen;