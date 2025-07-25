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
  const [activeSection, setActiveSection] = useState('services'); // 'services', 'drivers', 'reviews'
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

  // Current service (only what we actually provide)
  const services = [
    {
      id: 'security-hire',
      name: 'Personal Security Driver',
      basePrice: 50.00,
      description: 'Professional transport service with SIA-licensed close protection officers. Our drivers are fully vetted, background-checked security professionals providing safe, reliable transport across South East England.',
      longDescription: 'Armora provides premium security transport with professionally trained drivers who are SIA-licensed close protection officers. Every journey is conducted with the highest safety standards, using TFL-approved vehicles and experienced drivers who understand both transportation and personal security requirements.',
      color: '#0FD3E3',
      badge: 'Available Now',
      badgeColor: '#0FD3E3',
      active: true,
      features: ['SIA Licensed Officers', 'Background Checked', 'TFL Approved Vehicles', 'South East England Coverage', '24/7 Availability', 'Professional Training'],
      serviceAreas: ['London', 'Surrey', 'Kent', 'Essex', 'Hertfordshire', 'Buckinghamshire'],
      minimumFare: 50.00,
      popular: true,
      established: '2023',
      totalTrips: '1,200+',
      customerRating: 4.9
    }
  ];

  // Current driver team (main driver profile)
  const drivers = [
    {
      id: 1,
      name: 'Marcus Thompson',
      title: 'Lead Security Transport Officer',
      photo: 'https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=MT',
      experience: '8 years in close protection',
      rating: 4.9,
      totalRides: 1247,
      joinedDate: 'Founding member since 2023',
      languages: ['English', 'French'],
      specializations: ['Executive Protection', 'Event Security', 'Airport Transfers', 'Corporate Transport'],
      availability: 'Available Now',
      licenseLevel: 'SIA Close Protection License',
      certifications: ['Advanced Driving Certificate', 'First Aid Qualified', 'Conflict Resolution Training', 'Customer Service Excellence'],
      bio: 'Marcus is our lead security transport officer with extensive experience in close protection and secure transport. He has worked with high-profile clients across London and the South East, ensuring safe and professional transport services.',
      vehicleTypes: ['Saloon Cars', 'Executive Vehicles', 'Airport Transfers'],
      coverageAreas: ['Central London', 'Greater London', 'Heathrow Airport', 'Gatwick Airport', 'South East England'],
      workingHours: '24/7 availability with advance booking',
      securityClearance: 'Enhanced DBS checked',
      professionalBackground: 'Former military with 8 years private security experience'
    }
  ];

  // Customer reviews data
  const reviews = [
    {
      id: 1,
      customerName: 'James Mitchell',
      customerInitials: 'JM',
      rating: 5,
      date: '2 days ago',
      service: 'Personal Security Driver',
      driver: 'Marcus Thompson',
      comment: 'Outstanding service! Marcus was professional, punctual, and made me feel completely secure throughout the journey. The vehicle was clean and comfortable. Highly recommend GQCars!',
      tripType: 'Business Meeting'
    },
    {
      id: 2,
      customerName: 'Lisa Chen',
      customerInitials: 'LC',
      rating: 5,
      date: '1 week ago',
      service: 'Personal Security Driver',
      driver: 'Sarah Williams',
      comment: 'Sarah provided excellent service for my airport transfer. She was waiting when I landed, helped with luggage, and got me to my hotel safely. Very professional and friendly.',
      tripType: 'Airport Transfer'
    },
    {
      id: 3,
      customerName: 'Robert Taylor',
      customerInitials: 'RT',
      rating: 4,
      date: '2 weeks ago',
      service: 'Personal Security Driver',
      driver: 'David Chen',
      comment: 'Great experience with GQCars. David was knowledgeable about the city and provided a smooth, secure ride. The booking process was easy and transparent pricing.',
      tripType: 'City Tour'
    },
    {
      id: 4,
      customerName: 'Maria Gonzalez',
      customerInitials: 'MG',
      rating: 5,
      date: '3 weeks ago',
      service: 'Personal Security Driver',
      driver: 'Emma Rodriguez',
      comment: 'Emma was fantastic for our event transport needs. She coordinated perfectly with our schedule and ensured all VIP guests felt secure and comfortable.',
      tripType: 'Corporate Event'
    },
    {
      id: 5,
      customerName: 'Thomas Anderson',
      customerInitials: 'TA',
      rating: 5,
      date: '1 month ago',
      service: 'Personal Security Driver',
      driver: 'Marcus Thompson',
      comment: 'Exceptional service from start to finish. The driver was professional, the vehicle was in perfect condition, and I felt completely safe. Will definitely use again.',
      tripType: 'Business Travel'
    }
  ];

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
      title: 'Security Transport History',
      icon: 'shield-checkmark-outline',
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
      title: 'Emergency Contacts',
      icon: 'call-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => navigation.navigate('EmergencyContacts'),
      priority: true,
    },
    {
      id: 4,
      title: 'Security Settings',
      icon: 'shield-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('settings'),
      priority: true,
    },
    {
      id: 5,
      title: 'Notifications',
      icon: 'notifications-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('notifications'),
    },
    {
      id: 6,
      title: 'Invite Friends',
      icon: 'share-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('share'),
    },
    {
      id: 7,
      title: 'Log out',
      icon: 'log-out-outline',
      rightIcon: null,
      textColor: '#EF4444',
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
              <Ionicons name="shield-checkmark" size={24} color={theme.colors.secondary} />
            </View>
            <Text style={styles.statValue}>{userData.securityRides}</Text>
            <Text style={styles.statLabel}>Secure Trips</Text>
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

        {/* Toggle Bar */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleBar}>
            <TouchableOpacity 
              style={[styles.toggleButton, activeSection === 'services' && styles.toggleButtonActive]}
              onPress={() => setActiveSection('services')}
            >
              <Ionicons 
                name="car-outline" 
                size={18} 
                color={activeSection === 'services' ? '#FFFFFF' : '#666666'} 
              />
              <Text style={[styles.toggleText, activeSection === 'services' && styles.toggleTextActive]}>
                Services
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleButton, activeSection === 'drivers' && styles.toggleButtonActive]}
              onPress={() => setActiveSection('drivers')}
            >
              <Ionicons 
                name="people-outline" 
                size={18} 
                color={activeSection === 'drivers' ? '#FFFFFF' : '#666666'} 
              />
              <Text style={[styles.toggleText, activeSection === 'drivers' && styles.toggleTextActive]}>
                Our Drivers
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleButton, activeSection === 'reviews' && styles.toggleButtonActive]}
              onPress={() => setActiveSection('reviews')}
            >
              <Ionicons 
                name="star-outline" 
                size={18} 
                color={activeSection === 'reviews' ? '#FFFFFF' : '#666666'} 
              />
              <Text style={[styles.toggleText, activeSection === 'reviews' && styles.toggleTextActive]}>
                Reviews
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionContent}>
          {activeSection === 'services' && (
            <View style={styles.servicesSection}>
              <Text style={styles.sectionTitle}>Our Service</Text>
              {services.map((service) => (
                <View key={service.id} style={styles.serviceCardCompact}>
                  <View style={styles.serviceCompactHeader}>
                    <View style={styles.serviceCompactIcon}>
                      <Ionicons name="shield-checkmark" size={20} color="#0FD3E3" />
                    </View>
                    <View style={styles.serviceCompactInfo}>
                      <Text style={styles.serviceCompactName}>{service.name}</Text>
                      <Text style={styles.serviceCompactDescription}>{service.description}</Text>
                    </View>
                    <View style={[styles.serviceCompactBadge, { backgroundColor: service.badgeColor }]}>
                      <Text style={styles.serviceCompactBadgeText}>{service.badge}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.serviceCompactDetails}>
                    <View style={styles.serviceCompactDetailItem}>
                      <Text style={styles.compactDetailLabel}>Starting from</Text>
                      <Text style={styles.compactDetailValue}>£{service.basePrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.serviceCompactDetailItem}>
                      <Text style={styles.compactDetailLabel}>Rating</Text>
                      <View style={styles.compactRating}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.compactDetailValue}>{service.customerRating}</Text>
                      </View>
                    </View>
                    <View style={styles.serviceCompactDetailItem}>
                      <Text style={styles.compactDetailLabel}>Coverage</Text>
                      <Text style={styles.compactDetailValue}>{service.serviceAreas.length} areas</Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.bookServiceCompactButton}
                    onPress={() => navigation.navigate('Home')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bookServiceCompactText}>Book Now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {activeSection === 'drivers' && (
            <View style={styles.driversSection}>
              <Text style={styles.sectionTitle}>Our Professional Driver</Text>
              {drivers.map((driver) => (
                <Card key={driver.id} style={styles.expandedDriverCard} elevation="md">
                  <View style={styles.driverHeader}>
                    <View style={styles.driverPhotoContainer}>
                      <Image source={{ uri: driver.photo }} style={styles.expandedDriverPhoto} />
                      <View style={[styles.availabilityBadge, { backgroundColor: driver.availability === 'Available Now' ? '#0FD3E3' : '#FF9800' }]}>
                        <Text style={styles.availabilityText}>{driver.availability}</Text>
                      </View>
                    </View>
                    <View style={styles.driverBasicInfo}>
                      <Text style={styles.expandedDriverName}>{driver.name}</Text>
                      <Text style={styles.expandedDriverTitle}>{driver.title}</Text>
                      <View style={styles.driverRatingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.expandedRatingText}>{driver.rating}</Text>
                        <Text style={styles.totalTripsText}>({driver.totalRides} trips)</Text>
                      </View>
                      <Text style={styles.joinedDateText}>{driver.joinedDate}</Text>
                    </View>
                  </View>

                  <View style={styles.driverDetailsSection}>
                    <Text style={styles.driverBio}>{driver.bio}</Text>
                    
                    <View style={styles.credentialsSection}>
                      <Text style={styles.credentialsTitle}>Professional Credentials</Text>
                      <View style={styles.credentialItem}>
                        <Ionicons name="shield-checkmark" size={16} color="#0FD3E3" />
                        <Text style={styles.credentialText}>{driver.licenseLevel}</Text>
                      </View>
                      <View style={styles.credentialItem}>
                        <Ionicons name="document-text" size={16} color="#0FD3E3" />
                        <Text style={styles.credentialText}>{driver.securityClearance}</Text>
                      </View>
                      <View style={styles.credentialItem}>
                        <Ionicons name="time" size={16} color="#0FD3E3" />
                        <Text style={styles.credentialText}>{driver.experience}</Text>
                      </View>
                    </View>

                    <View style={styles.specializationsSection}>
                      <Text style={styles.specializationsTitle}>Specializations</Text>
                      <View style={styles.specializationTags}>
                        {driver.specializations.map((spec, index) => (
                          <View key={index} style={styles.expandedSpecializationTag}>
                            <Text style={styles.expandedSpecializationText}>{spec}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.certificationsSection}>
                      <Text style={styles.certificationsTitle}>Certifications</Text>
                      {driver.certifications.map((cert, index) => (
                        <View key={index} style={styles.certificationItem}>
                          <Ionicons name="checkmark-circle" size={14} color="#0FD3E3" />
                          <Text style={styles.certificationText}>{cert}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.serviceInfoSection}>
                      <View style={styles.serviceInfoRow}>
                        <View style={styles.serviceInfoItem}>
                          <Text style={styles.serviceInfoLabel}>Languages</Text>
                          <Text style={styles.serviceInfoValue}>{driver.languages.join(', ')}</Text>
                        </View>
                        <View style={styles.serviceInfoItem}>
                          <Text style={styles.serviceInfoLabel}>Working Hours</Text>
                          <Text style={styles.serviceInfoValue}>{driver.workingHours}</Text>
                        </View>
                      </View>
                      <View style={styles.serviceInfoRow}>
                        <View style={styles.serviceInfoItem}>
                          <Text style={styles.serviceInfoLabel}>Vehicle Types</Text>
                          <Text style={styles.serviceInfoValue}>{driver.vehicleTypes.join(', ')}</Text>
                        </View>
                        <View style={styles.serviceInfoItem}>
                          <Text style={styles.serviceInfoLabel}>Coverage Areas</Text>
                          <Text style={styles.serviceInfoValue}>{driver.coverageAreas.slice(0, 3).join(', ')}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.requestDriverButton}
                    onPress={() => Alert.alert(
                      'Request Marcus Thompson', 
                      'Would you like to request Marcus for your next trip? He will be notified and can confirm availability.',
                      [
                        { text: 'Request Now', onPress: () => navigation.navigate('Home') },
                        { text: 'Cancel', style: 'cancel' }
                      ]
                    )}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.requestDriverText}>Request This Driver</Text>
                    <Ionicons name="person-add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          )}

          {activeSection === 'reviews' && (
            <View style={styles.reviewsSection}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Customer Reviews</Text>
                <View style={styles.overallRating}>
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <Text style={styles.overallRatingText}>4.9</Text>
                  <Text style={styles.reviewsCount}>({reviews.length} reviews)</Text>
                </View>
              </View>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.customerInfo}>
                      <View style={styles.customerAvatar}>
                        <Text style={styles.customerInitials}>{review.customerInitials}</Text>
                      </View>
                      <View style={styles.customerDetails}>
                        <Text style={styles.customerName}>{review.customerName}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, index) => (
                        <Ionicons
                          key={index}
                          name="star"
                          size={14}
                          color={index < review.rating ? '#FFD700' : '#E5E5E5'}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewService}>{review.service}</Text>
                    <Text style={styles.reviewDriver}>Driver: {review.driver}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    ...theme.typography.headlineLarge,
    color: '#1F2937',
    fontWeight: '800',
    fontSize: 28,
  },
  headerNotificationBtn: {
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
  profileCard: {
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
    shadowRadius: 12,
    elevation: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
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
    justifyContent: 'center',
    paddingLeft: 4,
  },
  profileName: {
    ...theme.typography.titleLarge,
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 20,
  },
  profileEmail: {
    ...theme.typography.bodySmall,
    color: '#6B7280',
    marginTop: 2,
    fontSize: 14,
  },
  profilePhone: {
    ...theme.typography.bodySmall,
    color: '#6B7280',
    marginTop: 2,
    fontSize: 14,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0FD3E3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0FD3E3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    ...theme.typography.titleLarge,
    color: '#1F2937',
    fontWeight: '800',
    fontSize: 24,
  },
  statLabel: {
    ...theme.typography.labelSmall,
    color: '#6B7280',
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  balanceCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
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
    backgroundColor: '#0FD3E3',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 24,
    shadowColor: '#0FD3E3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
    color: '#1F2937',
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    fontSize: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuText: {
    ...theme.typography.bodyMedium,
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
  },
  rideCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 16,
  },
  officerTitle: {
    ...theme.typography.labelSmall,
    color: '#0FD3E3',
    marginTop: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  rideDate: {
    ...theme.typography.labelSmall,
    color: '#6B7280',
    marginTop: 2,
    fontSize: 12,
  },
  ridePrice: {
    ...theme.typography.titleSmall,
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 16,
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
    backgroundColor: '#0FD3E3',
    marginRight: theme.spacing.xs,
  },
  statusText: {
    ...theme.typography.labelSmall,
    color: '#0FD3E3',
    fontSize: 12,
    fontWeight: '600',
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
    color: '#0FD3E3',
    marginRight: 4,
    fontWeight: '600',
  },
  menuItemPriority: {
    borderWidth: 1,
    borderColor: '#0FD3E3' + '20',
    backgroundColor: '#0FD3E3' + '05',
  },
  menuIconPriority: {
    backgroundColor: '#0FD3E3' + '10',
  },
  menuTextPriority: {
    color: '#0FD3E3',
    fontWeight: '600',
  },

  // TOGGLE BAR STYLES
  toggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#0FD3E3',
    shadowColor: '#0FD3E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },

  // SECTION CONTENT STYLES
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // SERVICES SECTION STYLES
  servicesSection: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  serviceCardExpanded: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  serviceCardDisabled: {
    backgroundColor: '#F8F8F8',
    opacity: 0.7,
  },
  serviceInfo: {
    gap: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    marginRight: 12,
  },
  serviceBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  serviceBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  serviceFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: 'rgba(0, 200, 81, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featureTagDisabled: {
    backgroundColor: '#F0F0F0',
  },
  featureText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0FD3E3',
  },
  serviceTextDisabled: {
    color: '#AAAAAA',
  },

  // DRIVERS SECTION STYLES
  driversSection: {
    gap: 16,
  },
  driverCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  driverInfo: {
    flex: 1,
    gap: 8,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  driverTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  driverExperience: {
    fontSize: 12,
    color: '#999999',
  },
  driverLanguages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languagesLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  languagesText: {
    fontSize: 12,
    color: '#999999',
  },
  driverSpecializations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specializationTag: {
    backgroundColor: 'rgba(0, 200, 81, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  specializationText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  driverStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  // REVIEWS SECTION STYLES
  reviewsSection: {
    gap: 16,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overallRatingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  reviewsCount: {
    fontSize: 14,
    color: '#666666',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0FD3E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  reviewService: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  reviewDriver: {
    fontSize: 12,
    color: '#666666',
  },
  
  // Expanded Driver Card Styles
  expandedDriverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  driverPhotoContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  expandedDriverPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#0FD3E3',
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  driverBasicInfo: {
    flex: 1,
    marginLeft: 16,
  },
  expandedDriverName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  expandedDriverTitle: {
    fontSize: 16,
    color: '#0FD3E3',
    fontWeight: '600',
    marginBottom: 8,
  },
  driverRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  expandedRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  totalTripsText: {
    fontSize: 14,
    color: '#666666',
  },
  joinedDateText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  driverDetailsSection: {
    marginTop: 16,
    gap: 16,
  },
  driverBio: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 8,
  },
  credentialsSection: {
    gap: 8,
  },
  credentialsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  credentialText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  specializationsSection: {
    gap: 8,
  },
  specializationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  specializationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expandedSpecializationTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0FD3E3',
  },
  expandedSpecializationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  certificationsSection: {
    gap: 6,
  },
  certificationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  certificationText: {
    fontSize: 13,
    color: '#333333',
  },
  serviceInfoSection: {
    gap: 12,
  },
  serviceInfoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  serviceInfoItem: {
    flex: 1,
  },
  serviceInfoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  serviceInfoValue: {
    fontSize: 14,
    color: '#333333',
  },
  requestDriverButton: {
    backgroundColor: '#0FD3E3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  requestDriverText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Compact Service Card Styles
  serviceCardCompact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceCompactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  serviceCompactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCompactInfo: {
    flex: 1,
  },
  serviceCompactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  serviceCompactDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 16,
  },
  serviceCompactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceCompactBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serviceCompactDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  serviceCompactDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  compactDetailLabel: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 2,
  },
  compactDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bookServiceCompactButton: {
    backgroundColor: '#0FD3E3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  bookServiceCompactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
};

export default AccountScreen;