import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const BookingScreen = ({ navigation, route }) => {
  // Get service info from params
  const { service, riskLevel, riskScore, answers } = route.params;
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const officers = [
    {
      id: 'marcus_steel',
      name: 'Marcus Steel',
      rank: 'Senior CP Officer',
      experience: '15 years',
      specialties: ['Executive Protection', 'Threat Assessment', 'Counter-Surveillance'],
      rating: 4.9,
      reviews: 247,
      licenses: ['SIA CP', 'SIA DS', 'Armed Response'],
      languages: ['English', 'French'],
      availability: 'Available Now',
      photo: '👨‍💼',
      background: 'Former Royal Marines, specialized in VIP protection for government officials and corporate executives.',
    },
    {
      id: 'sarah_knight',
      name: 'Sarah Knight',
      rank: 'Elite CP Specialist',
      experience: '12 years',
      specialties: ['Diplomatic Security', 'Risk Management', 'Emergency Response'],
      rating: 4.95,
      reviews: 189,
      licenses: ['SIA CP', 'SIA DS', 'Medical First Aid'],
      languages: ['English', 'Spanish', 'Arabic'],
      availability: 'Available in 2 hours',
      photo: '👩‍💼',
      background: 'Former Metropolitan Police SO1 specialist with extensive diplomatic protection experience.',
    },
    {
      id: 'james_black',
      name: 'James Black',
      rank: 'Tactical CP Officer',
      experience: '18 years',
      specialties: ['High-Risk Environments', 'Advance Security', 'Crisis Management'],
      rating: 4.85,
      reviews: 312,
      licenses: ['SIA CP', 'SIA DS', 'Armed Response', 'Surveillance'],
      languages: ['English', 'German'],
      availability: 'Available in 1 hour',
      photo: '👨‍💼',
      background: 'Former SAS operative with expertise in high-threat environment protection and crisis response.',
    },
    {
      id: 'elena_gray',
      name: 'Elena Gray',
      rank: 'Senior CP Officer',
      experience: '10 years',
      specialties: ['Corporate Security', 'Event Protection', 'Intelligence Analysis'],
      rating: 4.88,
      reviews: 156,
      licenses: ['SIA CP', 'SIA DS', 'Cyber Security'],
      languages: ['English', 'Russian', 'Mandarin'],
      availability: 'Available Now',
      photo: '👩‍💼',
      background: 'Former intelligence officer with specialized training in corporate espionage prevention and digital security.',
    },
  ];

  const handleOfficerSelect = (officer) => {
    setSelectedOfficer(officer);
  };

  const viewProfile = (officer) => {
    navigation.navigate('Profile', { officer, service, riskLevel });
  };

  const proceedToBooking = () => {
    if (!selectedOfficer) return;
    
    // In a real app, this would navigate to a booking confirmation screen
    alert(`Booking confirmed with ${selectedOfficer.name}!\n\nService: ${service.name}\nOfficer: ${selectedOfficer.name}\nRate: ${service.price}\n\nYou will receive confirmation details shortly.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>Selected Service: {service?.label || 'GQCars Secure Ride'}</Text>
          {/* You can add more dynamic info here if needed */}
        </View>

        <Text style={styles.sectionTitle}>Available CP Officers</Text>
        <Text style={styles.subtitle}>All officers are SIA licensed and security vetted</Text>

        {officers.map((officer) => (
          <View key={officer.id} style={styles.officerCard}>
            <View style={styles.officerHeader}>
              <View style={styles.officerBasicInfo}>
                <Text style={styles.officerPhoto}>{officer.photo}</Text>
                <View style={styles.officerDetails}>
                  <Text style={styles.officerName}>{officer.name}</Text>
                  <Text style={styles.officerRank}>{officer.rank}</Text>
                  <Text style={styles.officerExperience}>{officer.experience} experience</Text>
                </View>
              </View>
              
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#D4AF37" />
                <Text style={styles.rating}>{officer.rating}</Text>
                <Text style={styles.reviews}>({officer.reviews})</Text>
              </View>
            </View>

            <View style={styles.availabilityContainer}>
              <Ionicons 
                name={officer.availability.includes('Now') ? 'checkmark-circle' : 'time'} 
                size={16} 
                color={officer.availability.includes('Now') ? '#4CAF50' : '#FF9800'} 
              />
              <Text style={[
                styles.availability,
                { color: officer.availability.includes('Now') ? '#4CAF50' : '#FF9800' }
              ]}>
                {officer.availability}
              </Text>
            </View>

            <View style={styles.specialtiesContainer}>
              <Text style={styles.specialtiesLabel}>Specialties:</Text>
              <View style={styles.specialtiesList}>
                {officer.specialties.slice(0, 2).map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
                {officer.specialties.length > 2 && (
                  <Text style={styles.moreSpecialties}>+{officer.specialties.length - 2} more</Text>
                )}
              </View>
            </View>

            <View style={styles.languagesContainer}>
              <Ionicons name="language" size={14} color="#D4AF37" />
              <Text style={styles.languages}>{officer.languages.join(', ')}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => viewProfile(officer)}
              >
                <Text style={styles.profileButtonText}>View Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  selectedOfficer?.id === officer.id && styles.selectedButton,
                ]}
                onPress={() => handleOfficerSelect(officer)}
              >
                <Text style={[
                  styles.selectButtonText,
                  selectedOfficer?.id === officer.id && styles.selectedButtonText,
                ]}>
                  {selectedOfficer?.id === officer.id ? 'Selected' : 'Select'}
                </Text>
                {selectedOfficer?.id === officer.id && (
                  <Ionicons name="checkmark" size={16} color="#1a1a1a" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedOfficer && styles.disabledButton,
          ]}
          onPress={proceedToBooking}
          disabled={!selectedOfficer}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          <Ionicons name="shield-checkmark" size={20} color="#1a1a1a" />
        </TouchableOpacity>

        <View style={styles.guaranteeSection}>
          <Ionicons name="lock-closed" size={20} color="#D4AF37" />
          <Text style={styles.guaranteeText}>
            Secure booking with instant confirmation and 24/7 support
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
  serviceInfo: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  serviceRate: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  officerCard: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  officerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  officerBasicInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  officerPhoto: {
    fontSize: 40,
    marginRight: 15,
  },
  officerDetails: {
    flex: 1,
  },
  officerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  officerRank: {
    fontSize: 14,
    color: '#D4AF37',
    marginTop: 2,
  },
  officerExperience: {
    fontSize: 12,
    color: '#cccccc',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#cccccc',
    marginLeft: 4,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  availability: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  specialtiesContainer: {
    marginBottom: 15,
  },
  specialtiesLabel: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 8,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  specialtyTag: {
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    color: '#ffffff',
  },
  moreSpecialties: {
    fontSize: 12,
    color: '#D4AF37',
    fontStyle: 'italic',
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  languages: {
    fontSize: 12,
    color: '#cccccc',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  selectButtonText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5,
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  confirmButton: {
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
  confirmButtonText: {
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

export default BookingScreen;