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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const { width } = Dimensions.get('window');

const ServicesScreen = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [currentServiceDetail, setCurrentServiceDetail] = useState(null);

  const services = [
    // ACTIVE SERVICES (Fully Functional)
    {
      id: 'security-hire',
      name: 'Personal Security Driver',
      subtitle: 'Professional Close Protection',
      basePrice: 50.00,
      description: 'SIA-licensed drivers with TFL vehicles',
      color: '#4CAF50',
      icon: 'shield-checkmark',
      badge: 'Available Now',
      badgeColor: '#4CAF50',
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personal Security Drivers On Demand</Text>
        <Text style={styles.headerSubtitle}>Professional private hire with vetted close protection officers • Available 24/7 across South East England, London & Greater London</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              
              {/* Icon */}
              <View style={[
                styles.serviceIcon, 
                { backgroundColor: service.active ? service.color + '15' : '#F5F5F5' }
              ]}>
                <Ionicons 
                  name={service.icon} 
                  size={22} 
                  color={service.active ? service.color : '#CCCCCC'} 
                />
              </View>
              
              {/* Title and Subtitle */}
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
              
              {/* Price */}
              {service.basePrice && (
                <Text style={[
                  styles.servicePrice,
                  !service.active && styles.servicePriceInactive
                ]}>
                  {service.minimumFare ? `Minimum £${service.minimumFare}` : `From £${service.basePrice.toFixed(2)}`}
                </Text>
              )}
              
              {/* Description */}
              <Text style={[
                styles.serviceDescription,
                !service.active && styles.serviceDescriptionInactive
              ]}>
                {service.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    height: 190,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  serviceCardSelected: {
    borderColor: '#00C851',
    backgroundColor: '#00C851' + '08',
    borderWidth: 2,
    shadowColor: '#00C851',
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
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
    paddingHorizontal: 8,
    width: '100%',
  },
  serviceSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
    width: '100%',
  },
  servicePrice: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  serviceDescription: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 12,
    paddingBottom: 16,
    flex: 1,
    width: '100%',
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
    borderLeftColor: '#00C851',
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
};

export default ServicesScreen;