import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation, route }) => {
  const { officer, service, riskLevel } = route.params;

  const certifications = [
    { name: 'SIA Close Protection License', status: 'Active', expiry: '2025-08-15' },
    { name: 'SIA Door Supervision License', status: 'Active', expiry: '2025-08-15' },
    { name: 'First Aid Certification', status: 'Active', expiry: '2024-12-01' },
    { name: 'Counter-Surveillance Training', status: 'Active', expiry: '2025-03-22' },
  ];

  const workHistory = [
    {
      period: '2020 - Present',
      role: 'Senior CP Officer',
      company: 'GQCars Security',
      description: 'Executive protection for high-profile clients including diplomats and business leaders.',
    },
    {
      period: '2015 - 2020',
      role: 'Security Consultant',
      company: 'Elite Protection Services',
      description: 'Risk assessment and personal protection services for corporate executives.',
    },
    {
      period: '2009 - 2015',
      role: 'Military Service',
      company: 'Royal Marines',
      description: 'Specialized training in tactical operations and threat assessment.',
    },
  ];

  const skills = [
    'Threat Assessment',
    'Risk Management',
    'Counter-Surveillance',
    'Emergency Response',
    'Defensive Driving',
    'First Aid/CPR',
    'Weapons Training',
    'Intelligence Gathering',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Text style={styles.profilePhoto}>{officer.photo}</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.officerName}>{officer.name}</Text>
            <Text style={styles.officerRank}>{officer.rank}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#D4AF37" />
              <Text style={styles.rating}>{officer.rating}</Text>
              <Text style={styles.reviews}>({officer.reviews} reviews)</Text>
            </View>
          </View>
        </View>

        <View style={styles.availabilitySection}>
          <Ionicons 
            name={officer.availability.includes('Now') ? 'checkmark-circle' : 'time'} 
            size={20} 
            color={officer.availability.includes('Now') ? '#4CAF50' : '#FF9800'} 
          />
          <Text style={[
            styles.availability,
            { color: officer.availability.includes('Now') ? '#4CAF50' : '#FF9800' }
          ]}>
            {officer.availability}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Background</Text>
          <Text style={styles.backgroundText}>{officer.background}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience & Specialties</Text>
          <View style={styles.experienceContainer}>
            <View style={styles.experienceItem}>
              <Ionicons name="time" size={18} color="#D4AF37" />
              <Text style={styles.experienceText}>{officer.experience} of experience</Text>
            </View>
            <View style={styles.languageItem}>
              <Ionicons name="language" size={18} color="#D4AF37" />
              <Text style={styles.languageText}>{officer.languages.join(', ')}</Text>
            </View>
          </View>
          
          <View style={styles.specialtiesGrid}>
            {officer.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyCard}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Skills</Text>
          <View style={styles.skillsGrid}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Ionicons name="checkmark-circle" size={16} color="#D4AF37" />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Licenses & Certifications</Text>
          {certifications.map((cert, index) => (
            <View key={index} style={styles.certificationCard}>
              <View style={styles.certHeader}>
                <Text style={styles.certName}>{cert.name}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: cert.status === 'Active' ? '#4CAF50' : '#FF9800' }
                ]}>
                  <Text style={styles.statusText}>{cert.status}</Text>
                </View>
              </View>
              <Text style={styles.certExpiry}>Expires: {cert.expiry}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work History</Text>
          {workHistory.map((job, index) => (
            <View key={index} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobRole}>{job.role}</Text>
                <Text style={styles.jobPeriod}>{job.period}</Text>
              </View>
              <Text style={styles.jobCompany}>{job.company}</Text>
              <Text style={styles.jobDescription}>{job.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.selectButtonText}>Select This Officer</Text>
            <Ionicons name="checkmark" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        <View style={styles.verificationSection}>
          <Ionicons name="shield-checkmark" size={24} color="#D4AF37" />
          <Text style={styles.verificationText}>
            All credentials verified and background checked by GQCars Security
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  profilePhoto: {
    fontSize: 60,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  officerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  officerRank: {
    fontSize: 16,
    color: '#D4AF37',
    marginTop: 5,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#cccccc',
    marginLeft: 4,
  },
  availabilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  availability: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  backgroundText: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 24,
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
  },
  experienceContainer: {
    marginBottom: 15,
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  experienceText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  specialtyCard: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 8,
  },
  certificationCard: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  certHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  certName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  certExpiry: {
    fontSize: 12,
    color: '#cccccc',
  },
  jobCard: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  jobRole: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  jobPeriod: {
    fontSize: 12,
    color: '#D4AF37',
  },
  jobCompany: {
    fontSize: 14,
    color: '#D4AF37',
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  actionSection: {
    marginBottom: 30,
  },
  selectButton: {
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 10,
  },
  verificationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  verificationText: {
    fontSize: 12,
    color: '#cccccc',
    marginLeft: 10,
    textAlign: 'center',
    flex: 1,
  },
});

export default ProfileScreen;