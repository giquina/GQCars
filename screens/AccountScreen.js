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
  const [activeSection, setActiveSection] = useState('services'); // 'services', 'drivers'
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
      description: 'Professional transport service with SIA-licensed close protection officers. A-Drivers are fully vetted, background-checked security professionals providing safe, reliable transport all over the UK.',
      longDescription: 'Armora provides premium security transport with professionally trained drivers who are SIA-licensed close protection officers. Every journey is conducted with the highest safety standards, using TFL-approved vehicles and experienced drivers who understand both transportation and personal security requirements.',
      color: '#0FD3E3',
      badge: 'Available Now',
      badgeColor: '#0FD3E3',
      active: true,
      features: ['SIA Licensed Officers', 'Background Checked', 'TFL Approved Vehicles', 'UK-Wide Coverage', '24/7 Availability', 'Professional Training'],
      serviceAreas: ['London', 'Birmingham', 'Manchester', 'Edinburgh', 'Cardiff', 'All UK Cities'],
      minimumFare: 50.00,
      popular: true,
      established: '2023',
      totalTrips: '1,200+',
      customerRating: 4.9
    },
    {
      id: 'armored-transport',
      name: 'Armored Security Transport',
      basePrice: 150.00,
      description: 'Ultra-secure armored vehicle service with maximum protection for high-risk situations and VIP clients.',
      longDescription: 'Armora\'s premium armored transport service provides the highest level of security with military-grade armored vehicles, specially trained tactical drivers, and comprehensive protection protocols for clients requiring maximum security.',
      color: '#9C27B0',
      badge: 'Coming Soon',
      badgeColor: '#FF9800',
      active: false,
      comingSoon: true,
      features: ['Armored Vehicles', 'Tactical Drivers', 'Maximum Security', 'VIP Protection', 'High-Risk Situations', 'Military Grade'],
      serviceAreas: ['London', 'Major UK Cities', 'Special Routes'],
      minimumFare: 150.00,
      popular: false,
      established: 'Coming 2024',
      totalTrips: 'New Service',
      customerRating: 'TBD'
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
      bio: 'Marcus is our lead security transport officer with extensive experience in close protection and secure transport. He has worked with high-profile clients all over the UK, ensuring safe and professional transport services.',
      vehicleTypes: ['Saloon Cars', 'Executive Vehicles', 'Airport Transfers'],
      coverageAreas: ['All Major UK Cities', 'London', 'Birmingham', 'Manchester', 'All UK Airports', 'Nationwide Coverage'],
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
      comment: 'Outstanding service! Marcus was professional, punctual, and made me feel completely secure throughout the journey. The vehicle was immaculate and equipped with the latest safety features. Armora exceeded all my expectations - this is what premium security transport should be.',
      tripType: 'Executive Meeting',
      verified: true
    },
    {
      id: 2,
      customerName: 'Lisa Chen',
      customerInitials: 'LC',
      rating: 5,
      date: '1 week ago',
      service: 'Personal Security Driver',
      driver: 'Sarah Williams',
      comment: 'Sarah provided exceptional service for my Heathrow transfer. As a former police officer, her expertise was evident throughout the journey. She monitored traffic patterns, took alternative routes to avoid delays, and ensured I felt completely protected. Armora\'s attention to detail is unmatched.',
      tripType: 'Airport Transfer',
      verified: true
    },
    {
      id: 3,
      customerName: 'Robert Taylor',
      customerInitials: 'RT',
      rating: 5,
      date: '2 weeks ago',
      service: 'Personal Security Driver',
      driver: 'David Chen',
      comment: 'Remarkable experience with Armora. David\'s military background and local knowledge created the perfect combination of security and efficiency. The booking process was seamless, pricing transparent, and the service exceeded luxury transport standards.',
      tripType: 'Business Travel',
      verified: true
    },
    {
      id: 4,
      customerName: 'Maria Gonzalez',
      customerInitials: 'MG',
      rating: 5,
      date: '3 weeks ago',
      service: 'Personal Security Driver',
      driver: 'Emma Rodriguez',
      comment: 'Emma coordinated flawlessly with our corporate event schedule. Her situational awareness and discreet protection allowed our VIP guests to focus entirely on business. This is the gold standard for executive transport - Armora delivers true peace of mind.',
      tripType: 'Corporate Event',
      verified: true
    },
    {
      id: 5,
      customerName: 'Thomas Anderson',
      customerInitials: 'TA',
      rating: 5,
      date: '1 month ago',
      service: 'Personal Security Driver',
      driver: 'Marcus Thompson',
      comment: 'Exceptional from booking to destination. The vehicle was a fortress of comfort and security. Marcus\'s professional demeanor and tactical awareness made this the safest journey I\'ve ever experienced. Armora has set a new benchmark for security transport.',
      tripType: 'High-Profile Meeting',
      verified: true
    },
    {
      id: 6,
      customerName: 'Alexander Hayes',
      customerInitials: 'AH',
      rating: 5,
      date: '1 month ago',
      service: 'Personal Security Driver',
      driver: 'James Wilson',
      comment: 'Used Armora for a series of sensitive business meetings across London. James maintained complete discretion while ensuring maximum security. The level of professionalism and attention to operational security details was outstanding. This is how executive protection should be done.',
      tripType: 'Confidential Business',
      verified: true
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
        Alert.alert('Invite Friends', 'Share Armora with friends and earn rewards!', [
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
      case 'recruitment':
        navigation.navigate('Recruitment');
        break;
      case 'about':
        navigation.navigate('About');
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
      title: 'Join Our Driver Network',
      icon: 'car-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('recruitment'),
      priority: true,
      badge: 'Now Hiring',
    },
    {
      id: 4,
      title: 'About Armora',
      icon: 'information-circle-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('about'),
    },
    {
      id: 5,
      title: 'Emergency Contacts',
      icon: 'call-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => navigation.navigate('EmergencyContacts'),
      priority: true,
    },
    {
      id: 6,
      title: 'Security Settings',
      icon: 'shield-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('settings'),
      priority: true,
    },
    {
      id: 7,
      title: 'Notifications',
      icon: 'notifications-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('notifications'),
    },
    {
      id: 8,
      title: 'Invite Friends',
      icon: 'share-outline',
      rightIcon: 'chevron-forward-outline',
      onPress: () => handleMenuPress('share'),
    },
    {
      id: 9,
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
      price: '£12.50',
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
      price: '£25.00',
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
      price: '£8.75',
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
            <Text style={styles.statValue}>£{userData.totalSaved}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </Card>
        </View>

        {/* Balance Card */}
        <Card style={styles.balanceCard} elevation="lg">
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Account Balance</Text>
              <Text style={styles.balanceAmount}>£{userData.balance.toFixed(2)}</Text>
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

        {/* Account Menu */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                item.priority && styles.menuItemPriority
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={[
                  styles.menuIcon,
                  item.priority && styles.menuIconPriority
                ]}>
                  <Ionicons 
                    name={item.icon} 
                    size={18} 
                    color={item.priority ? '#0FD3E3' : '#666666'} 
                  />
                </View>
                <Text style={[
                  styles.menuText,
                  item.priority && styles.menuTextPriority,
                  item.textColor && { color: item.textColor }
                ]}>
                  {item.title}
                </Text>
                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              {item.rightIcon && (
                <Ionicons 
                  name={item.rightIcon} 
                  size={20} 
                  color="#CCCCCC" 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

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
                A-Drivers
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
                <View key={service.id} style={[
                  styles.serviceCardCompact,
                  !service.active && styles.serviceCardDisabled
                ]}>
                  <View style={styles.serviceCompactHeader}>
                    <View style={styles.serviceCompactIcon}>
                      <Ionicons 
                        name={service.active ? "shield-checkmark" : "car-sport"} 
                        size={18} 
                        color={service.active ? "#0FD3E3" : "#AAAAAA"} 
                      />
                    </View>
                    <View style={styles.serviceCompactInfo}>
                      <Text style={[
                        styles.serviceCompactName,
                        !service.active && styles.serviceTextDisabled
                      ]}>
                        {service.name}
                      </Text>
                      <Text style={[
                        styles.serviceCompactDescription,
                        !service.active && styles.serviceTextDisabled
                      ]}>
                        {service.description}
                      </Text>
                    </View>
                    <View style={[styles.serviceCompactBadge, { backgroundColor: service.badgeColor }]}>
                      <Text style={styles.serviceCompactBadgeText}>{service.badge}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.serviceCompactDetails}>
                    <View style={styles.serviceCompactDetailItem}>
                      <Text style={styles.compactDetailLabel}>Starting from</Text>
                      <Text style={[
                        styles.compactDetailValue,
                        !service.active && styles.serviceTextDisabled
                      ]}>
                        £{service.basePrice.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.serviceCompactDetailItem}>
                      <Text style={styles.compactDetailLabel}>Rating</Text>
                      <View style={styles.compactRating}>
                        <Ionicons name="star" size={12} color={service.active ? "#FFD700" : "#CCCCCC"} />
                        <Text style={[
                          styles.compactDetailValue,
                          !service.active && styles.serviceTextDisabled
                        ]}>
                          {service.customerRating}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.serviceCompactDetailItem}>
                      <Text style={styles.compactDetailLabel}>Coverage</Text>
                      <Text style={[
                        styles.compactDetailValue,
                        !service.active && styles.serviceTextDisabled
                      ]}>
                        {service.serviceAreas.length} areas
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={[
                      styles.bookServiceCompactButton,
                      !service.active && styles.bookServiceCompactButtonDisabled
                    ]}
                    onPress={() => {
                      if (service.active) {
                        navigation.navigate('Home');
                      } else {
                        Alert.alert(
                          'Coming Soon', 
                          'Armored transport service will be available soon. We\'re working on bringing you the highest level of security transport.',
                          [{ text: 'OK', style: 'default' }]
                        );
                      }
                    }}
                    activeOpacity={service.active ? 0.8 : 1}
                    disabled={!service.active}
                  >
                    <Text style={[
                      styles.bookServiceCompactText,
                      !service.active && styles.bookServiceCompactTextDisabled
                    ]}>
                      {service.active ? 'Book Now' : 'Coming Soon'}
                    </Text>
                    <Ionicons 
                      name={service.active ? "arrow-forward" : "time"} 
                      size={16} 
                      color={service.active ? "#FFFFFF" : "#AAAAAA"} 
                    />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Reviews Section - moved from separate tab */}
              <View style={styles.reviewsSection}>
                <View style={styles.reviewsHeader}>
                  <Text style={styles.sectionTitle}>Customer Reviews</Text>
                  <View style={styles.overallRating}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                    <Text style={styles.overallRatingText}>4.9</Text>
                    <Text style={styles.reviewsCount}>({reviews.length} verified reviews)</Text>
                  </View>
                </View>
                <View style={styles.reviewsSubheader}>
                  <Text style={styles.reviewsDescription}>
                    Real feedback from clients who have experienced Armora's premium security transport services
                  </Text>
                </View>
                {reviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.customerInfo}>
                        <View style={styles.customerAvatar}>
                          <Text style={styles.customerInitials}>{review.customerInitials}</Text>
                        </View>
                        <View style={styles.customerDetails}>
                          <View style={styles.customerNameRow}>
                            <Text style={styles.customerName}>{review.customerName}</Text>
                            {review.verified && (
                              <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark-circle" size={14} color="#0FD3E3" />
                                <Text style={styles.verifiedText}>Verified</Text>
                              </View>
                            )}
                          </View>
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
            </View>
          )}

          {activeSection === 'drivers' && (
            <View style={styles.driversSection}>
              <Text style={styles.sectionTitle}>A-Drivers Team</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    ...theme.typography.headlineLarge,
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 22,
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
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
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
    fontWeight: '600',
    fontSize: 17,
  },
  profileEmail: {
    ...theme.typography.bodySmall,
    color: '#6B7280',
    marginTop: 2,
    fontSize: 13,
  },
  profilePhone: {
    ...theme.typography.bodySmall,
    color: '#6B7280',
    marginTop: 2,
    fontSize: 13,
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
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
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
    fontWeight: '700',
    fontSize: 19,
  },
  statLabel: {
    ...theme.typography.labelSmall,
    color: '#6B7280',
    marginTop: 2,
    fontSize: 11,
    fontWeight: '500',
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#1F2937',
    borderRadius: 14,
    padding: 16,
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
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    fontSize: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    ...theme.typography.bodyMedium,
    color: '#1F2937',
    fontSize: 15,
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
  menuSection: {
    marginTop: 12,
    marginBottom: 14,
  },
  menuBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  menuBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // TOGGLE BAR STYLES
  toggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 6,
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 3,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 7,
    gap: 5,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },

  // SECTION CONTENT STYLES
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    gap: 12,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewsSubheader: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewsDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overallRatingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  reviewsCount: {
    fontSize: 13,
    color: '#666666',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  customerDetails: {
    flex: 1,
  },
  customerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 211, 227, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 3,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  reviewDate: {
    fontSize: 11,
    color: '#999999',
    marginTop: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
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
    fontSize: 11,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  reviewDriver: {
    fontSize: 11,
    color: '#666666',
  },
  
  // Expanded Driver Card Styles
  expandedDriverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  driverBasicInfo: {
    flex: 1,
    marginLeft: 16,
  },
  expandedDriverName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  expandedDriverTitle: {
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  totalTripsText: {
    fontSize: 13,
    color: '#666666',
  },
  joinedDateText: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
  },
  driverDetailsSection: {
    marginTop: 16,
    gap: 16,
  },
  driverBio: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
    marginBottom: 8,
  },
  credentialsSection: {
    gap: 8,
  },
  credentialsTitle: {
    fontSize: 15,
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
    fontSize: 13,
    color: '#333333',
    flex: 1,
  },
  specializationsSection: {
    gap: 8,
  },
  specializationsTitle: {
    fontSize: 15,
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
    fontSize: 15,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Compact Service Card Styles
  serviceCardCompact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
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
    marginBottom: 10,
    gap: 10,
  },
  serviceCompactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCompactInfo: {
    flex: 1,
  },
  serviceCompactName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  serviceCompactDescription: {
    fontSize: 12,
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
    marginBottom: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  serviceCompactDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  compactDetailLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  compactDetailValue: {
    fontSize: 12,
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
    paddingVertical: 9,
    borderRadius: 7,
    gap: 5,
  },
  bookServiceCompactText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookServiceCompactButtonDisabled: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bookServiceCompactTextDisabled: {
    color: '#AAAAAA',
  },
};

export default AccountScreen;