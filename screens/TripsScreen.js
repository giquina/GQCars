import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const TripsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('recent');

  // Mock trip data
  const recentTrips = [
    {
      id: '1',
      date: '2024-01-20',
      time: '14:30',
      from: 'Heathrow Terminal 5',
      to: 'Canary Wharf',
      service: 'Airport Taxi Service',
      driver: 'Michael Thompson',
      status: 'completed',
      price: 45.50,
      duration: '45 min',
      distance: '28.5 miles'
    },
    {
      id: '2',
      date: '2024-01-18',
      time: '09:15',
      from: 'Westminster',
      to: 'City of London',
      service: 'Executive Taxi Service',
      driver: 'Sarah Wilson',
      status: 'completed',
      price: 32.80,
      duration: '25 min',
      distance: '12.3 miles'
    },
    {
      id: '3',
      date: '2024-01-15',
      time: '16:45',
      from: 'Current Location',
      to: 'London Bridge',
      service: 'Standard Taxi Service',
      driver: 'James Anderson',
      status: 'completed',
      price: 18.90,
      duration: '18 min',
      distance: '8.7 miles'
    }
  ];

  const upcomingTrips = [
    {
      id: '4',
      date: '2024-01-25',
      time: '10:00',
      from: 'Home',
      to: 'Gatwick Airport',
      service: 'Airport Taxi Service',
      driver: 'TBD',
      status: 'scheduled',
      price: 65.00,
      duration: 'Est. 60 min',
      distance: 'Est. 35 miles'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'scheduled': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'scheduled': return 'time';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const handleRebookTrip = (trip) => {
    Alert.alert(
      'Rebook Trip',
      `Rebook your trip from ${trip.from} to ${trip.to}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Again', onPress: () => navigation.navigate('Home', { rebookTrip: trip }) }
      ]
    );
  };

  const renderTrip = (trip) => (
    <TouchableOpacity key={trip.id} style={styles.tripCard}>
      {/* Header with date and status */}
      <View style={styles.tripHeader}>
        <View style={styles.tripDateInfo}>
          <Text style={styles.tripDateText}>{trip.date}</Text>
          <Text style={styles.tripTimeText}>{trip.time}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
          <Ionicons name={getStatusIcon(trip.status)} size={12} color="#FFFFFF" />
          <Text style={styles.statusText}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Route with price */}
      <View style={styles.routeSection}>
        <View style={styles.routeInfo}>
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: theme.colors.primary }]} />
            <Text style={styles.locationText} numberOfLines={1}>{trip.from}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: '#FF6B35' }]} />
            <Text style={styles.locationText} numberOfLines={1}>{trip.to}</Text>
          </View>
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.tripPrice}>£{trip.price.toFixed(2)}</Text>
          {trip.status === 'completed' && (
            <TouchableOpacity 
              style={styles.rebookButton}
              onPress={() => handleRebookTrip(trip)}
            >
              <Text style={styles.rebookText}>Rebook</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Compact details */}
      <View style={styles.tripDetails}>
        <Text style={styles.serviceText}>{trip.service}</Text>
        <Text style={styles.driverText}>{trip.driver} • {trip.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Trips</Text>
        <Text style={styles.headerSubtitle}>Private hire taxi journey history</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
            Recent ({recentTrips.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming ({upcomingTrips.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'recent' ? (
          recentTrips.length > 0 ? (
            recentTrips.map(renderTrip)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyTitle}>No Recent Trips</Text>
              <Text style={styles.emptySubtitle}>Your security transport history will appear here</Text>
            </View>
          )
        ) : (
          upcomingTrips.length > 0 ? (
            upcomingTrips.map(renderTrip)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyTitle}>No Upcoming Trips</Text>
              <Text style={styles.emptySubtitle}>Schedule your next security transport</Text>
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          )
        )}
        
        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDateInfo: {
    alignItems: 'flex-start',
  },
  tripDateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  tripTimeText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeInfo: {
    flex: 1,
    marginRight: 12,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  routeLine: {
    width: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    marginLeft: 4,
    marginVertical: 1,
  },
  locationText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    flex: 1,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  tripPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  rebookButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 4,
  },
  rebookText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tripDetails: {
    gap: 2,
  },
  serviceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  driverText: {
    fontSize: 12,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
};

export default TripsScreen;