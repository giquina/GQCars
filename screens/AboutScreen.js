import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const AboutScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>About Armora</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Mission Statement */}
        <View style={styles.section}>
          <View style={styles.heroSection}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="shield-checkmark" size={48} color="#0A1F3D" />
            </View>
            <Text style={styles.heroTitle}>Premium Security Transport</Text>
            <Text style={styles.heroSubtitle}>Peace of mind for every journey</Text>
          </View>
        </View>

        {/* Our Story */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.bodyText}>
            Armora was created with a simple yet powerful vision: everyone deserves to feel safe during their travels. 
            In an increasingly uncertain world, we recognized that traditional transport options weren't meeting the security 
            needs of modern families, professionals, and individuals who require that extra layer of protection.
          </Text>
          <Text style={styles.bodyText}>
            We bridge the gap between everyday transport and professional security services, offering SIA-licensed close 
            protection officers as your drivers. This means you get both reliable transportation and trained security 
            professionals who understand threat assessment, defensive driving, and emergency response.
          </Text>
        </View>

        {/* Who We Serve */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who We Serve</Text>
          
          <View style={styles.clientCategory}>
            <View style={styles.clientIcon}>
              <Ionicons name="home" size={24} color="#0FD3E3" />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>Families & Parents</Text>
              <Text style={styles.clientDescription}>
                Parents who want extra security for school runs, family outings, or when traveling with children. 
                Perfect for families living in areas with security concerns or those wanting peace of mind.
              </Text>
            </View>
          </View>

          <View style={styles.clientCategory}>
            <View style={styles.clientIcon}>
              <Ionicons name="business" size={24} color="#0FD3E3" />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>Business Executives</Text>
              <Text style={styles.clientDescription}>
                CEOs, directors, and senior professionals who require secure transport for meetings, conferences, 
                or when handling sensitive business matters. Discretion and professionalism guaranteed.
              </Text>
            </View>
          </View>

          <View style={styles.clientCategory}>
            <View style={styles.clientIcon}>
              <Ionicons name="star" size={24} color="#0FD3E3" />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>High-Profile Individuals</Text>
              <Text style={styles.clientDescription}>
                Celebrities, public figures, and anyone in the spotlight who needs protection from unwanted attention, 
                paparazzi, or potential threats while maintaining their mobility.
              </Text>
            </View>
          </View>

          <View style={styles.clientCategory}>
            <View style={styles.clientIcon}>
              <Ionicons name="medical" size={24} color="#0FD3E3" />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>Vulnerable Individuals</Text>
              <Text style={styles.clientDescription}>
                People with medical conditions, elderly individuals, or anyone who feels vulnerable and wants 
                trained professionals ensuring their safety during transport.
              </Text>
            </View>
          </View>

          <View style={styles.clientCategory}>
            <View style={styles.clientIcon}>
              <Ionicons name="cash" size={24} color="#0FD3E3" />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>High Net Worth Individuals</Text>
              <Text style={styles.clientDescription}>
                Wealthy individuals who may be targets for crime, requiring discreet yet secure transportation 
                for their daily activities, events, or business matters.
              </Text>
            </View>
          </View>

          <View style={styles.clientCategory}>
            <View style={styles.clientIcon}>
              <Ionicons name="briefcase" size={24} color="#0FD3E3" />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>Legal & Government Professionals</Text>
              <Text style={styles.clientDescription}>
                Lawyers, judges, government officials, and court witnesses who may face threats related to their 
                professional duties and need secure transport to maintain their safety.
              </Text>
            </View>
          </View>

          <View style={styles.clientCategory}>
            <View style={styles.clientIcon}>
              <Ionicons name="globe" size={24} color="#0FD3E3" />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>International Visitors</Text>
              <Text style={styles.clientDescription}>
                Foreign dignitaries, business visitors, and international clients who need secure, reliable 
                transportation in the UK with drivers who understand cultural sensitivity and protocol.
              </Text>
            </View>
          </View>
        </View>

        {/* Our Standards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Standards</Text>
          
          <View style={styles.standardItem}>
            <Ionicons name="shield-checkmark" size={20} color="#0FD3E3" />
            <Text style={styles.standardText}>All drivers are SIA-licensed close protection officers</Text>
          </View>
          
          <View style={styles.standardItem}>
            <Ionicons name="checkmark-circle" size={20} color="#0FD3E3" />
            <Text style={styles.standardText}>Enhanced DBS background checks for every driver</Text>
          </View>
          
          <View style={styles.standardItem}>
            <Ionicons name="medical" size={20} color="#0FD3E3" />
            <Text style={styles.standardText}>First Aid at Work certified professionals</Text>
          </View>
          
          <View style={styles.standardItem}>
            <Ionicons name="car" size={20} color="#0FD3E3" />
            <Text style={styles.standardText}>Premium vehicles maintained to the highest standards</Text>
          </View>
          
          <View style={styles.standardItem}>
            <Ionicons name="time" size={20} color="#0FD3E3" />
            <Text style={styles.standardText}>24/7 availability across the UK</Text>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.bodyText}>
            Whether you're a concerned parent, busy executive, or anyone who values their security, 
            Armora is here to provide the protection and peace of mind you deserve.
          </Text>
          
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="mail" size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contact Our Team</Text>
          </TouchableOpacity>
        </View>

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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(10, 31, 61, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A1F3D',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A1F3D',
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 12,
  },
  clientCategory: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  clientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 211, 227, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1F3D',
    marginBottom: 4,
  },
  clientDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  standardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  standardText: {
    fontSize: 15,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0FD3E3',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default AboutScreen;