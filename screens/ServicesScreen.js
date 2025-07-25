import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const { width } = Dimensions.get('window');

const ServicesScreen = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [currentServiceDetail, setCurrentServiceDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('services'); // 'services' or 'drivers'
  const [showDriverProfile, setShowDriverProfile] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [favoriteDrivers, setFavoriteDrivers] = useState([]);

  const services = [
    // ACTIVE SERVICES (Fully Functional)
    {
      id: 'security-hire',
      name: 'Personal Security Driver',
      subtitle: 'Professional Close Protection',
      basePrice: 50.00,
      description: 'SIA-licensed drivers with TFL vehicles',
      color: '#0FD3E3',
      icon: 'shield-checkmark',
      badge: 'Available Now',
      badgeColor: '#0FD3E3',
      active: true,
      minimumFare: 50.00,
      features: ['SIA-licensed close protection officers', 'TFL approved private hire vehicles', 'Minimum £50 per journey', 'Available for immediate or pre-booked trips'],
      detailedDescription: 'Our Personal Security Driver service combines professional close protection with private hire transport. All drivers are SIA-licensed officers operating TFL-approved vehicles, providing secure transport for both everyday journeys and high-risk situations.',
      caseStudy: 'A business executive across South East England uses our service for both daily commutes and sensitive meetings. Our SIA-licensed driver provides professional security awareness while maintaining the convenience of private hire transport, serving London, Greater London, Watford and surrounding areas.'
    },
    
    // INACTIVE SERVICES (Coming Soon)
    {
      id: 'executive',
      name: 'Executive',
      subtitle: 'Premium Private Hire',
      basePrice: 15.00,
      description: 'Luxury vehicles with enhanced security',
      color: '#FF9800',
      icon: 'car-sport-outline',
      badge: 'Coming Soon',
      badgeColor: '#999999',
      active: false,
      features: ['Premium vehicles', 'Enhanced security', 'Priority support', 'Route planning'],
      detailedDescription: 'Executive service will provide premium vehicles with enhanced security features. Launching soon.',
      caseStudy: 'Coming soon - Executive level service for distinguished clients.'
    },
    {
      id: 'xl',
      name: 'XL',
      subtitle: 'Group Transport',
      basePrice: 12.00,
      description: 'Large vehicles for groups',
      color: '#2196F3',
      icon: 'bus-outline',
      badge: 'Coming Soon',
      badgeColor: '#999999',
      active: false,
      features: ['Large vehicles', 'Group transport', 'Extra space', 'Multiple passengers'],
      detailedDescription: 'XL service will provide larger vehicles for group transport. Launching soon.',
      caseStudy: 'Coming soon - Group transport solutions.'
    },
    {
      id: 'airport-transfer',
      name: 'Airport Secure Transfers',
      subtitle: 'Specialized Airport Service',
      basePrice: 25.00,
      description: 'Dedicated airport security service',
      color: '#9C27B0',
      icon: 'airplane-outline',
      badge: 'Coming Soon',
      badgeColor: '#999999',
      active: false,
      features: ['Flight monitoring', 'Terminal pickup', 'Meet & greet', 'Luggage assistance'],
      detailedDescription: 'Airport Secure Transfers will provide specialized airport security service. Launching soon.',
      caseStudy: 'Coming soon - Dedicated airport security transport.'
    },
    {
      id: 'corporate',
      name: 'Corporate/Subscription',
      subtitle: 'Business Accounts',
      basePrice: null,
      description: 'Corporate and subscription plans',
      color: '#607D8B',
      icon: 'business-outline',
      badge: 'Coming Soon',
      badgeColor: '#999999',
      active: false,
      features: ['Corporate accounts', 'Subscription plans', 'Volume discounts', 'Dedicated support'],
      detailedDescription: 'Corporate and subscription accounts will provide business-focused transport solutions. Launching soon.',
      caseStudy: 'Coming soon - Corporate transport solutions.'
    }
  ];

  const drivers = [
    {
      id: 1,
      name: 'Marcus Thompson',
      title: 'Lead Security Transport Officer',
      photo: 'https://via.placeholder.com/120x120/0FD3E3/FFFFFF?text=MT',
      rating: 4.9,
      totalTrips: 1247,
      experience: '8 years',
      languages: ['English', 'French'],
      specializations: ['Executive Protection', 'Event Security', 'Airport Transfers', 'Corporate Transport'],
      availability: 'Available Now',
      location: 'Central London',
      joinedDate: 'Founding member since 2023',
      licenseLevel: 'SIA Close Protection License',
      certifications: ['Advanced Driving Certificate', 'First Aid Qualified', 'Conflict Resolution Training'],
      bio: 'Marcus is our lead security transport officer with extensive experience in close protection and secure transport. Former military with 8 years private security experience.',
      vehicleTypes: ['Saloon Cars', 'Executive Vehicles'],
      reviews: [
        {
          id: 1,
          customerName: 'James Wilson',
          rating: 5,
          date: '2 days ago',
          comment: 'Exceptional service. Marcus was professional, punctual, and made me feel completely secure throughout the journey.',
          serviceType: 'Executive Protection',
        },
        {
          id: 2,
          customerName: 'Sarah Chen',
          rating: 5,
          date: '1 week ago',
          comment: 'Outstanding driver! Very knowledgeable about security protocols and an excellent communicator.',
          serviceType: 'Airport Transfer',
        },
        {
          id: 3,
          customerName: 'David Miller',
          rating: 4,
          date: '2 weeks ago',
          comment: 'Great experience. Marcus handled a complex route with multiple stops professionally.',
          serviceType: 'Corporate Transport',
        }
      ]
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      title: 'Senior Protection Officer',
      photo: 'https://via.placeholder.com/120x120/0FD3E3/FFFFFF?text=SM',
      rating: 4.8,
      totalTrips: 892,
      experience: '6 years',
      languages: ['English', 'Spanish', 'Italian'],
      specializations: ['VIP Protection', 'Event Security', 'Corporate Transport'],
      availability: 'Available Now',
      location: 'West London',
      joinedDate: 'Joined in early 2023',
      licenseLevel: 'SIA Close Protection License',
      certifications: ['Advanced Driving Certificate', 'First Aid Qualified', 'Crisis Management'],
      bio: 'Sarah specializes in VIP protection and corporate transport. Her multilingual skills and attention to detail make her perfect for international clients.',
      vehicleTypes: ['Executive Vehicles', 'Luxury Cars'],
      reviews: [
        {
          id: 1,
          customerName: 'Elena Rodriguez',
          rating: 5,
          date: '3 days ago',
          comment: 'Sarah was amazing! Her Spanish was perfect and she made our business trip seamless.',
          serviceType: 'VIP Protection',
        },
        {
          id: 2,
          customerName: 'Michael Brown',
          rating: 5,
          date: '1 week ago',
          comment: 'Professional and discreet. Exactly what we needed for our corporate event.',
          serviceType: 'Event Security',
        }
      ]
    },
    {
      id: 3,
      name: 'James Carter',
      title: 'Security Transport Specialist',
      photo: 'https://via.placeholder.com/120x120/0FD3E3/FFFFFF?text=JC',
      rating: 4.7,
      totalTrips: 634,
      experience: '5 years',
      languages: ['English'],
      specializations: ['Airport Transfers', 'Corporate Transport', 'Emergency Response'],
      availability: 'Available Tomorrow',
      location: 'East London',
      joinedDate: 'Joined in mid 2023',
      licenseLevel: 'SIA Close Protection License',
      certifications: ['Advanced Driving Certificate', 'Emergency Response Training'],
      bio: 'James excels in time-critical transport and emergency response situations. His calm demeanor under pressure is invaluable.',
      vehicleTypes: ['Standard Vehicles', 'Emergency Response Vehicles'],
      reviews: [
        {
          id: 1,
          customerName: 'Robert Taylor',
          rating: 5,
          date: '5 days ago',
          comment: 'James handled an emergency situation perfectly. Cool under pressure and very professional.',
          serviceType: 'Emergency Response',
        },
        {
          id: 2,
          customerName: 'Lisa Johnson',
          rating: 4,
          date: '2 weeks ago',
          comment: 'Reliable and punctual. Great for airport transfers.',
          serviceType: 'Airport Transfer',
        }
      ]
    }
  ];

  const handleServiceSelect = (service) => {
    if (!service.active) {
      // Don't allow selection of inactive services
      return;
    }
    setCurrentServiceDetail(service);
    setShowServiceDetail(true);
  };

  const handleBookService = (service) => {
    if (!service.active) return;
    
    setSelectedService(service.id);
    navigation.navigate('Home', { preSelectedService: service.id });
  };

  const handleDriverSelect = (driver) => {
    setCurrentDriver(driver);
    setShowDriverProfile(true);
  };

  const toggleFavoriteDriver = (driverId) => {
    setFavoriteDrivers(prev => {
      if (prev.includes(driverId)) {
        return prev.filter(id => id !== driverId);
      } else {
        return [...prev, driverId];
      }
    });
  };

  const handleRequestDriver = (driver) => {
    setShowDriverProfile(false);
    Alert.alert(
      'Request Driver',
      `Would you like to request ${driver.name} for your next trip?`,
      [
        { text: 'Request Now', onPress: () => navigation.navigate('Home', { preSelectedDriver: driver.id }) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personal Security Drivers On Demand</Text>
        <Text style={styles.headerSubtitle}>Professional private hire with vetted close protection officers • Available 24/7 across South East England, London & Greater London</Text>
      </View>

      {/* Toggle Tabs */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, activeTab === 'services' && styles.toggleButtonActive]}
          onPress={() => setActiveTab('services')}
        >
          <Ionicons 
            name="car-outline" 
            size={18} 
            color={activeTab === 'services' ? '#FFFFFF' : '#666666'} 
          />
          <Text style={[styles.toggleText, activeTab === 'services' && styles.toggleTextActive]}>
            Services
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleButton, activeTab === 'drivers' && styles.toggleButtonActive]}
          onPress={() => setActiveTab('drivers')}
        >
          <Ionicons 
            name="people-outline" 
            size={18} 
            color={activeTab === 'drivers' ? '#FFFFFF' : '#666666'} 
          />
          <Text style={[styles.toggleText, activeTab === 'drivers' && styles.toggleTextActive]}>
            Our Drivers
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'services' ? (
          <View style={styles.servicesGrid}>
            {services.map((service) => (
            <TouchableOpacity 
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.id && styles.serviceCardSelected,
                !service.active && styles.serviceCardInactive
              ]}
              onPress={() => handleServiceSelect(service)}
              activeOpacity={service.active ? 0.7 : 1}
              disabled={!service.active}
            >
              {/* Inactive Overlay */}
              {!service.active && (
                <View style={styles.inactiveOverlay}>
                  <Ionicons name="lock-closed" size={16} color="#999999" />
                </View>
              )}
              
              {/* Badge */}
              {service.badge && (
                <View style={[styles.serviceBadge, { backgroundColor: service.badgeColor }]}>
                  <Text style={styles.serviceBadgeText}>{service.badge}</Text>
                </View>
              )}
              
              <View style={styles.serviceCardContent}>
                {/* Header Section */}
                <View style={styles.serviceHeader}>
                  <View style={[
                    styles.serviceIcon, 
                    { backgroundColor: service.active ? service.color + '15' : '#F5F5F5' }
                  ]}>
                    <Ionicons 
                      name={service.icon} 
                      size={24} 
                      color={service.active ? service.color : '#CCCCCC'} 
                    />
                  </View>
                  
                  <View style={styles.serviceHeaderText}>
                    <Text style={[
                      styles.serviceName,
                      !service.active && styles.serviceNameInactive
                    ]}>
                      {service.name}
                    </Text>
                    
                    <Text style={[
                      styles.serviceSubtitle,
                      !service.active && styles.serviceSubtitleInactive
                    ]}>
                      {service.subtitle}
                    </Text>
                  </View>
                  
                  {/* Price */}
                  {service.basePrice && (
                    <View style={styles.priceContainer}>
                      <Text style={[
                        styles.servicePrice,
                        !service.active && styles.servicePriceInactive
                      ]}>
                        {service.minimumFare ? `£${service.minimumFare}` : `£${service.basePrice.toFixed(2)}`}
                      </Text>
                      <Text style={[
                        styles.priceLabel,
                        !service.active && styles.servicePriceInactive
                      ]}>
                        {service.minimumFare ? 'minimum' : 'from'}
                      </Text>
                    </View>
                  )}
                </View>
                
                {/* Description */}
                <Text style={[
                  styles.serviceDescription,
                  !service.active && styles.serviceDescriptionInactive
                ]}>
                  {service.description}
                </Text>
                
                {/* Features Section */}
                {service.active && service.features && (
                  <View style={styles.featuresSection}>
                    <Text style={styles.featuresTitle}>Key Features:</Text>
                    <View style={styles.featuresList}>
                      {service.features.slice(0, 3).map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          <Ionicons name="checkmark-circle" size={14} color={service.color} />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                      {service.features.length > 3 && (
                        <Text style={styles.moreFeatures}>+{service.features.length - 3} more features</Text>
                      )}
                    </View>
                  </View>
                )}
                
                {/* Action Section */}
                <View style={styles.actionSection}>
                  {service.active ? (
                    <View style={styles.actionContent}>
                      <Text style={styles.actionText}>Tap to view details & book</Text>
                      <Ionicons name="arrow-forward" size={16} color={service.color} />
                    </View>
                  ) : (
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.driversGrid}>
            {drivers.map((driver) => (
              <TouchableOpacity 
                key={driver.id}
                style={styles.driverCard}
                onPress={() => handleDriverSelect(driver)}
                activeOpacity={0.7}
              >
                <View style={styles.driverCardHeader}>
                  <View style={styles.driverPhotoContainer}>
                    <Image source={{ uri: driver.photo }} style={styles.driverPhoto} />
                    <View style={[styles.availabilityBadge, { 
                      backgroundColor: driver.availability === 'Available Now' ? '#0FD3E3' : '#FF9800' 
                    }]}>
                      <Text style={styles.availabilityText}>{driver.availability}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.driverInfo}>
                    <View style={styles.driverNameRow}>
                      <Text style={styles.driverName}>{driver.name}</Text>
                      <TouchableOpacity 
                        style={styles.favoriteButton}
                        onPress={() => toggleFavoriteDriver(driver.id)}
                      >
                        <Ionicons 
                          name={favoriteDrivers.includes(driver.id) ? "heart" : "heart-outline"} 
                          size={20} 
                          color={favoriteDrivers.includes(driver.id) ? "#FF4757" : "#999999"} 
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.driverTitle}>{driver.title}</Text>
                    <Text style={styles.driverLocation}>{driver.location}</Text>
                    
                    <View style={styles.driverRating}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{driver.rating}</Text>
                      <Text style={styles.tripsText}>({driver.totalTrips} trips)</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.driverSpecializations}>
                  {driver.specializations.slice(0, 3).map((spec, index) => (
                    <View key={index} style={styles.specializationTag}>
                      <Text style={styles.specializationText}>{spec}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.driverLanguages}>
                  <Text style={styles.languagesLabel}>Languages: </Text>
                  <Text style={styles.languagesText}>{driver.languages.join(', ')}</Text>
                </View>
                
                <View style={styles.driverCardFooter}>
                  <Text style={styles.experienceText}>{driver.experience} experience</Text>
                  <Text style={styles.viewProfileText}>Tap to view profile</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Service Detail Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showServiceDetail}
        onRequestClose={() => setShowServiceDetail(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowServiceDetail(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{currentServiceDetail?.name}</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {currentServiceDetail && (
              <>
                {/* Service Icon and Badge */}
                <View style={styles.modalServiceHeader}>
                  <View style={[styles.modalServiceIcon, { backgroundColor: currentServiceDetail.color + '15' }]}>
                    <Ionicons name={currentServiceDetail.icon} size={40} color={currentServiceDetail.color} />
                  </View>
                  {currentServiceDetail.badge && (
                    <View style={[styles.modalBadge, { backgroundColor: currentServiceDetail.badgeColor }]}>
                      <Text style={styles.modalBadgeText}>{currentServiceDetail.badge}</Text>
                    </View>
                  )}
                </View>

                {/* Description */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Service Overview</Text>
                  <Text style={styles.modalDescription}>{currentServiceDetail.detailedDescription}</Text>
                </View>

                {/* Features */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Key Features</Text>
                  {currentServiceDetail.features.map((feature, index) => (
                    <View key={index} style={styles.modalFeatureItem}>
                      <Ionicons name="checkmark-circle" size={20} color={currentServiceDetail.color} />
                      <Text style={styles.modalFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Case Study */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Case Study</Text>
                  <View style={styles.caseStudyContainer}>
                    <Text style={styles.caseStudyText}>{currentServiceDetail.caseStudy}</Text>
                  </View>
                </View>

                {/* Book Button */}
                <TouchableOpacity 
                  style={[styles.bookServiceButton, { backgroundColor: currentServiceDetail.color }]}
                  onPress={() => {
                    setShowServiceDetail(false);
                    handleBookService(currentServiceDetail);
                  }}
                >
                  <Text style={styles.bookServiceButtonText}>Book This Service</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Driver Profile Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showDriverProfile}
        onRequestClose={() => setShowDriverProfile(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowDriverProfile(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Driver Profile</Text>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => currentDriver && toggleFavoriteDriver(currentDriver.id)}
            >
              <Ionicons 
                name={currentDriver && favoriteDrivers.includes(currentDriver.id) ? "heart" : "heart-outline"} 
                size={24} 
                color={currentDriver && favoriteDrivers.includes(currentDriver.id) ? "#FF4757" : "#999999"} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {currentDriver && (
              <>
                {/* Driver Header */}
                <View style={styles.driverProfileHeader}>
                  <View style={styles.driverProfilePhotoContainer}>
                    <Image source={{ uri: currentDriver.photo }} style={styles.driverProfilePhoto} />
                    <View style={[styles.profileAvailabilityBadge, { 
                      backgroundColor: currentDriver.availability === 'Available Now' ? '#0FD3E3' : '#FF9800' 
                    }]}>
                      <Text style={styles.profileAvailabilityText}>{currentDriver.availability}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.driverProfileInfo}>
                    <Text style={styles.driverProfileName}>{currentDriver.name}</Text>
                    <Text style={styles.driverProfileTitle}>{currentDriver.title}</Text>
                    <Text style={styles.driverProfileLocation}>{currentDriver.location}</Text>
                    
                    <View style={styles.driverProfileRating}>
                      <View style={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons 
                            key={star}
                            name="star" 
                            size={16} 
                            color={star <= Math.floor(currentDriver.rating) ? "#FFD700" : "#E0E0E0"} 
                          />
                        ))}
                      </View>
                      <Text style={styles.profileRatingText}>{currentDriver.rating}</Text>
                      <Text style={styles.profileTripsText}>({currentDriver.totalTrips} trips)</Text>
                    </View>
                  </View>
                </View>

                {/* Bio */}
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionTitle}>About</Text>
                  <Text style={styles.driverProfileBio}>{currentDriver.bio}</Text>
                </View>

                {/* Credentials */}
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionTitle}>Professional Credentials</Text>
                  <View style={styles.credentialsList}>
                    <View style={styles.credentialItem}>
                      <Ionicons name="shield-checkmark" size={16} color="#0FD3E3" />
                      <Text style={styles.credentialItemText}>{currentDriver.licenseLevel}</Text>
                    </View>
                    <View style={styles.credentialItem}>
                      <Ionicons name="time" size={16} color="#0FD3E3" />
                      <Text style={styles.credentialItemText}>{currentDriver.experience} experience</Text>
                    </View>
                    <View style={styles.credentialItem}>
                      <Ionicons name="calendar" size={16} color="#0FD3E3" />
                      <Text style={styles.credentialItemText}>{currentDriver.joinedDate}</Text>
                    </View>
                  </View>
                </View>

                {/* Specializations */}
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionTitle}>Specializations</Text>
                  <View style={styles.profileSpecializations}>
                    {currentDriver.specializations.map((spec, index) => (
                      <View key={index} style={styles.profileSpecializationTag}>
                        <Text style={styles.profileSpecializationText}>{spec}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Certifications */}
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionTitle}>Certifications</Text>
                  <View style={styles.certificationsList}>
                    {currentDriver.certifications.map((cert, index) => (
                      <View key={index} style={styles.certificationItem}>
                        <Ionicons name="checkmark-circle" size={14} color="#0FD3E3" />
                        <Text style={styles.certificationItemText}>{cert}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Languages & Vehicle Types */}
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionTitle}>Additional Information</Text>
                  <View style={styles.additionalInfoGrid}>
                    <View style={styles.additionalInfoItem}>
                      <Text style={styles.additionalInfoLabel}>Languages</Text>
                      <Text style={styles.additionalInfoValue}>{currentDriver.languages.join(', ')}</Text>
                    </View>
                    <View style={styles.additionalInfoItem}>
                      <Text style={styles.additionalInfoLabel}>Vehicle Types</Text>
                      <Text style={styles.additionalInfoValue}>{currentDriver.vehicleTypes.join(', ')}</Text>
                    </View>
                  </View>
                </View>

                {/* Reviews */}
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionTitle}>Recent Reviews ({currentDriver.reviews.length})</Text>
                  {currentDriver.reviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <View style={styles.reviewCustomer}>
                          <View style={styles.customerAvatar}>
                            <Text style={styles.customerInitials}>
                              {review.customerName.split(' ').map(n => n[0]).join('')}
                            </Text>
                          </View>
                          <View style={styles.customerDetails}>
                            <Text style={styles.customerName}>{review.customerName}</Text>
                            <Text style={styles.reviewDate}>{review.date}</Text>
                          </View>
                        </View>
                        <View style={styles.reviewRating}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons 
                              key={star}
                              name="star" 
                              size={12} 
                              color={star <= review.rating ? "#FFD700" : "#E0E0E0"} 
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewComment}>{review.comment}</Text>
                      <View style={styles.reviewMeta}>
                        <Text style={styles.reviewService}>{review.serviceType}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Request Driver Button */}
                <TouchableOpacity 
                  style={styles.requestDriverButton}
                  onPress={() => handleRequestDriver(currentDriver)}
                >
                  <Text style={styles.requestDriverButtonText}>Request This Driver</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={{ height: 40 }} />
              </>
            )}
          </ScrollView>
        </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  servicesGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    width: '100%',
    minHeight: 260,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  serviceCardSelected: {
    borderColor: '#0FD3E3',
    backgroundColor: '#0FD3E3' + '08',
    borderWidth: 2,
    shadowColor: '#0FD3E3',
    shadowOpacity: 0.15,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  serviceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 80,
    zIndex: 10,
  },
  serviceBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  serviceCardContent: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  serviceIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceHeaderText: {
    flex: 1,
    paddingRight: 8,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 22,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  serviceSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 70,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0FD3E3',
    lineHeight: 24,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999999',
    marginTop: 2,
  },
  serviceDescription: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  featuresSection: {
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  featuresTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 1,
  },
  featureText: {
    fontSize: 13,
    color: '#555555',
    flex: 1,
    lineHeight: 17,
  },
  moreFeatures: {
    fontSize: 11,
    color: '#0FD3E3',
    fontWeight: '500',
    marginTop: 2,
  },
  actionSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 14,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0FD3E3',
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999999',
    textAlign: 'center',
  },
  // Inactive Service Styles
  serviceCardInactive: {
    opacity: 0.6,
    backgroundColor: '#F8F8F8',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  serviceNameInactive: {
    color: '#999999',
  },
  serviceSubtitleInactive: {
    color: '#BBBBBB',
  },
  servicePriceInactive: {
    color: '#CCCCCC',
  },
  serviceDescriptionInactive: {
    color: '#BBBBBB',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  modalHeaderSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalServiceHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  modalServiceIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  modalFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  modalFeatureText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  caseStudyContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0FD3E3',
  },
  caseStudyText: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  bookServiceButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  bookServiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Toggle Styles
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#0FD3E3',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  
  // Driver Styles
  driversGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  driverCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  driverPhotoContainer: {
    position: 'relative',
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#0FD3E3',
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  availabilityText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  driverInfo: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  driverTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0FD3E3',
    marginBottom: 2,
  },
  driverLocation: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  tripsText: {
    fontSize: 12,
    color: '#666666',
  },
  driverSpecializations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  specializationTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0FD3E3',
  },
  specializationText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  driverLanguages: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languagesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  languagesText: {
    fontSize: 12,
    color: '#666666',
  },
  driverCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  experienceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  
  // Driver Profile Modal Styles
  driverProfileHeader: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  driverProfilePhotoContainer: {
    position: 'relative',
  },
  driverProfilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#0FD3E3',
  },
  profileAvailabilityBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileAvailabilityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  driverProfileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  driverProfileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  driverProfileTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0FD3E3',
    marginBottom: 4,
  },
  driverProfileLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  driverProfileRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  profileRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  profileTripsText: {
    fontSize: 14,
    color: '#666666',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  driverProfileBio: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  credentialsList: {
    gap: 8,
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  credentialItemText: {
    fontSize: 14,
    color: '#333333',
  },
  profileSpecializations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  profileSpecializationTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0FD3E3',
  },
  profileSpecializationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  certificationsList: {
    gap: 6,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  certificationItemText: {
    fontSize: 13,
    color: '#333333',
  },
  additionalInfoGrid: {
    gap: 12,
  },
  additionalInfoItem: {
    gap: 4,
  },
  additionalInfoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  additionalInfoValue: {
    fontSize: 14,
    color: '#333333',
  },
  reviewCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0FD3E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  customerInitials: {
    fontSize: 12,
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
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewMeta: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
  reviewService: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0FD3E3',
  },
  requestDriverButton: {
    backgroundColor: '#0FD3E3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  requestDriverButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
};

export default ServicesScreen;