import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ServiceScreen = ({ navigation, route }) => {
  const { riskLevel, riskScore, riskPercentage, answers } = route.params;
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 'standard',
      name: 'Standard Protection',
      price: '£150/hour',
      description: 'Professional close protection with SIA licensed officer',
      features: [
        'SIA Licensed CP Officer',
        'Standard Security Vehicle',
        'Route Planning',
        'Basic Threat Assessment',
      ],
      icon: 'shield-outline',
      recommended: riskLevel === 'LOW',
    },
    {
      id: 'enhanced',
      name: 'Enhanced Security',
      price: '£250/hour',
      description: 'Advanced protection with tactical support and surveillance',
      features: [
        'Senior CP Officer Team',
        'Armored Security Vehicle',
        'Advanced Route Planning',
        'Counter-Surveillance',
        'Emergency Response Protocol',
      ],
      icon: 'shield-checkmark',
      recommended: riskLevel === 'MEDIUM',
    },
    {
      id: 'executive',
      name: 'Executive Elite',
      price: '£400/hour',
      description: 'Premium protection for high-risk situations',
      features: [
        'Elite CP Officer Team',
        'Fully Armored Fleet',
        'Multi-Vehicle Convoy',
        'Advanced Threat Intelligence',
        'Dedicated Command Center',
        '24/7 Monitoring',
      ],
      icon: 'shield',
      recommended: riskLevel === 'HIGH',
    },
  ];

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'LOW': return '#4CAF50';
      case 'MEDIUM': return '#FF9800';
      case 'HIGH': return '#F44336';
      default: return '#D4AF37';
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const proceedToBooking = () => {
    if (!selectedService) return;
    
    navigation.navigate('Booking', {
      service: selectedService,
      riskLevel,
      riskScore,
      answers,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.riskAssessment}>
          <View style={styles.riskHeader}>
            <Ionicons name="analytics" size={24} color="#D4AF37" />
            <Text style={styles.riskTitle}>Risk Assessment Complete</Text>
          </View>
          <View style={styles.riskResult}>
            <Text style={styles.riskLabel}>Risk Level:</Text>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor() }]}>
              <Text style={styles.riskLevel}>{riskLevel}</Text>
            </View>
            <Text style={styles.riskScore}>Score: {riskScore}/30 ({riskPercentage}%)</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Choose Your Protection Level</Text>

        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceCard,
              selectedService?.id === service.id && styles.selectedCard,
              service.recommended && styles.recommendedCard,
            ]}
            onPress={() => handleServiceSelect(service)}
          >
            {service.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>RECOMMENDED</Text>
              </View>
            )}
            
            <View style={styles.serviceHeader}>
              <Ionicons name={service.icon} size={32} color="#D4AF37" />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </View>
              {selectedService?.id === service.id && (
                <Ionicons name="checkmark-circle" size={24} color="#D4AF37" />
              )}
            </View>

            <Text style={styles.serviceDescription}>{service.description}</Text>

            <View style={styles.featuresContainer}>
              {service.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark" size={16} color="#D4AF37" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedService && styles.disabledButton,
          ]}
          onPress={proceedToBooking}
          disabled={!selectedService}
        >
          <Text style={styles.continueButtonText}>Continue to Officer Selection</Text>
          <Ionicons name="arrow-forward" size={20} color="#1a1a1a" />
        </TouchableOpacity>

        <View style={styles.guaranteeSection}>
          <Ionicons name="ribbon" size={24} color="#D4AF37" />
          <Text style={styles.guaranteeText}>
            All services include comprehensive insurance and 24/7 emergency support
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    padding: 20,
  },
  riskAssessment: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333333',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  riskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  riskResult: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  riskLabel: {
    fontSize: 16,
    color: '#cccccc',
    marginRight: 10,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  riskLevel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  riskScore: {
    fontSize: 14,
    color: '#cccccc',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#333333',
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#D4AF37',
    backgroundColor: '#2d2d1f',
  },
  recommendedCard: {
    borderColor: '#D4AF37',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 15,
    backgroundColor: '#D4AF37',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 15,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  servicePrice: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: 'bold',
    marginTop: 2,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 15,
    lineHeight: 20,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#555555',
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 10,
  },
  guaranteeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  guaranteeText: {
    fontSize: 12,
    color: '#cccccc',
    marginLeft: 10,
    textAlign: 'center',
    flex: 1,
  },
});

export default ServiceScreen;