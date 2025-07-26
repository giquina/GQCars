import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  Share,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const RecruitmentScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'requirements', 'apply'

  const requirements = [
    {
      id: 1,
      title: 'TfL Private Hire Driver Licence',
      description: 'Valid Transport for London Private Hire Driver Licence (or equivalent regional authority license)',
      icon: 'car-outline',
      required: true,
    },
    {
      id: 2,
      title: 'SIA Close Protection License',
      description: 'Level 3 Certificate for Close Protection Operatives Working in the Private Security Industry',
      icon: 'shield-checkmark-outline',
      required: true,
    },
    {
      id: 3,
      title: 'First Aid at Work Certificate',
      description: 'HSE-approved First Aid at Work (FAW) certification - must be current and valid',
      icon: 'medical-outline',
      required: true,
    },
    {
      id: 4,
      title: 'Enhanced DBS Check',
      description: 'Enhanced Disclosure and Barring Service check with DBS Update Service subscription',
      icon: 'document-text-outline',
      required: true,
    },
    {
      id: 5,
      title: 'UK Driving Experience',
      description: 'Minimum 3 years of UK driving experience with clean driving record',
      icon: 'time-outline',
      required: true,
    },
    {
      id: 6,
      title: 'Right to Work',
      description: 'Legal right to live and work in the United Kingdom',
      icon: 'checkmark-circle-outline',
      required: true,
    },
  ];

  const benefits = [
    {
      icon: 'cash-outline',
      title: 'Premium Pay Rates',
      description: '£35-60 per hour based on experience and service level',
    },
    {
      icon: 'calendar-outline',
      title: 'Flexible Schedule',
      description: 'Choose your hours with 24/7 booking availability',
    },
    {
      icon: 'school-outline',
      title: 'Professional Training',
      description: 'Ongoing training and development opportunities',
    },
    {
      icon: 'car-sport-outline',
      title: 'Premium Vehicles',
      description: 'Access to luxury, well-maintained vehicle fleet',
    },
    {
      icon: 'shield-outline',
      title: 'Insurance Coverage',
      description: 'Comprehensive insurance and liability protection',
    },
    {
      icon: 'trending-up-outline',
      title: 'Career Growth',
      description: 'Advancement opportunities within Armora network',
    },
    {
      icon: 'medal-outline',
      title: 'Performance Bonuses',
      description: 'Monthly bonuses for top-rated drivers and perfect attendance',
    },
    {
      icon: 'card-outline',
      title: 'Weekly Pay',
      description: 'Fast weekly payments directly to your bank account',
    },
  ];

  const handleShare = async () => {
    try {
      const message = `🚗 Join Armora's Elite Security Driver Network! 

We're hiring qualified security drivers with:
✓ TfL Private Hire License
✓ SIA Close Protection License  
✓ First Aid Certification

Earn £35-60/hour with flexible scheduling!

Download the Armora app to apply: [App Store/Play Store Link]

#ArmoraJobs #SecurityJobs #UKJobs`;

      await Share.share({
        message: message,
        title: 'Join Armora Driver Network',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleApply = () => {
    Alert.alert(
      'Ready to Apply?',
      'Our application process includes document verification, background checks, and an interview. Are you ready to begin?',
      [
        { text: 'Not Yet', style: 'cancel' },
        { 
          text: 'Start Application', 
          onPress: () => {
            Alert.alert('Application Process', 'Feature coming soon! For now, please email us at careers@armora.uk with your qualifications.');
          }
        },
      ]
    );
  };

  const handleEmailContact = () => {
    Linking.openURL('mailto:careers@armora.uk?subject=Driver Application Inquiry');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Our Team</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#0FD3E3" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'requirements' && styles.activeTab]}
          onPress={() => setActiveTab('requirements')}
        >
          <Text style={[styles.tabText, activeTab === 'requirements' && styles.activeTabText]}>
            Requirements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'apply' && styles.activeTab]}
          onPress={() => setActiveTab('apply')}
        >
          <Text style={[styles.tabText, activeTab === 'apply' && styles.activeTabText]}>
            Apply Now
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {activeTab === 'overview' && (
          <View>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.heroIcon}>
                <Ionicons name="car" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.heroTitle}>Join Armora's Elite Driver Network</Text>
              <Text style={styles.heroSubtitle}>
                Become part of the UK's premier security transport service. We're looking for qualified professionals 
                to join our growing network of SIA-licensed security drivers. Earn premium rates of £35-60/hour.
              </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsSection}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>£35-60</Text>
                <Text style={styles.statLabel}>Per Hour</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24/7</Text>
                <Text style={styles.statLabel}>Availability</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>UK-Wide</Text>
                <Text style={styles.statLabel}>Coverage</Text>
              </View>
            </View>

            {/* Benefits */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why Join Armora?</Text>
              {benefits.map((benefit) => (
                <View key={benefit.title} style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <Ionicons name={benefit.icon} size={24} color="#0FD3E3" />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Call to Action */}
            <View style={styles.ctaSection}>
              <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
              <Text style={styles.ctaDescription}>
                If you meet our requirements and want to join the UK's most professional security transport network 
                with premium pay rates up to £60/hour, we'd love to hear from you.
              </Text>
              <TouchableOpacity style={styles.primaryButton} onPress={handleApply}>
                <Text style={styles.primaryButtonText}>Start Your Application</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'requirements' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Essential Requirements</Text>
              <Text style={styles.sectionDescription}>
                All applicants must meet these mandatory requirements before applying. These ensure we maintain 
                the highest standards of safety and professionalism.
              </Text>
              
              {requirements.map((req) => (
                <View key={req.id} style={styles.requirementItem}>
                  <View style={styles.requirementIcon}>
                    <Ionicons name={req.icon} size={24} color="#0FD3E3" />
                  </View>
                  <View style={styles.requirementContent}>
                    <View style={styles.requirementHeader}>
                      <Text style={styles.requirementTitle}>{req.title}</Text>
                      {req.required && (
                        <View style={styles.requiredBadge}>
                          <Text style={styles.requiredText}>Required</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.requirementDescription}>{req.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Preferences</Text>
              <View style={styles.preferenceItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FF9800" />
                <Text style={styles.preferenceText}>Military or police background preferred</Text>
              </View>
              <View style={styles.preferenceItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FF9800" />
                <Text style={styles.preferenceText}>Advanced driving qualifications (IAM, RoSPA)</Text>
              </View>
              <View style={styles.preferenceItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FF9800" />
                <Text style={styles.preferenceText}>Customer service experience</Text>
              </View>
              <View style={styles.preferenceItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FF9800" />
                <Text style={styles.preferenceText}>Multiple language skills</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'apply' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ready to Apply?</Text>
              <Text style={styles.sectionDescription}>
                Our application process is thorough but straightforward. Here's what to expect:
              </Text>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Initial Application</Text>
                  <Text style={styles.stepDescription}>Complete our online application form with your basic details and qualifications.</Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Document Verification</Text>
                  <Text style={styles.stepDescription}>Upload copies of your licenses, certificates, and identification documents.</Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Background Checks</Text>
                  <Text style={styles.stepDescription}>We'll verify your qualifications and run comprehensive background checks.</Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Interview Process</Text>
                  <Text style={styles.stepDescription}>Video or in-person interview to assess your suitability and professionalism.</Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Onboarding</Text>
                  <Text style={styles.stepDescription}>Complete training, app setup, and welcome to the Armora network!</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Start Your Application</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={handleApply}>
                <Ionicons name="person-add" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Begin Application Process</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={handleEmailContact}>
                <Ionicons name="mail" size={20} color="#0FD3E3" />
                <Text style={styles.secondaryButtonText}>Email Us Your Questions</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Refer a Driver</Text>
              <Text style={styles.sectionDescription}>
                Know someone who would be perfect for Armora? Share this opportunity with them!
              </Text>
              <TouchableOpacity style={styles.shareCardButton} onPress={handleShare}>
                <Ionicons name="share-social" size={24} color="#0FD3E3" />
                <Text style={styles.shareCardText}>Share This Opportunity</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Extra spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  shareButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#0FD3E3',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0FD3E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A1F3D',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0FD3E3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A1F3D',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666666',
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 211, 227, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1F3D',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  requirementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 211, 227, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  requirementContent: {
    flex: 1,
  },
  requirementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  requirementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1F3D',
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  requirementDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  preferenceText: {
    fontSize: 15,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  processStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0FD3E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1F3D',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  ctaSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A1F3D',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0FD3E3',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0FD3E3',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0FD3E3',
    marginLeft: 8,
  },
  shareCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  shareCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0FD3E3',
    marginLeft: 12,
  },
});

export default RecruitmentScreen;