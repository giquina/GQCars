import React, { useState } from 'react';
// ErrorBoundary for runtime error debugging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Optionally log error to a service
    if (console && console.error) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Something went wrong.</Text>
          <Text selectable style={{ color: '#333', fontSize: 14, marginBottom: 8 }}>{String(this.state.error)}</Text>
          {this.state.errorInfo && (
            <Text selectable style={{ color: '#666', fontSize: 12 }}>{this.state.errorInfo.componentStack}</Text>
          )}
        </View>
      );
    }
    return this.props.children;
  }
}
import GQCarsLogo from '../components/GQCarsLogo';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const serviceCategories = [
  {
    key: 'transport',
    title: 'Transport Protection',
    iconType: 'Ionicons',
    iconName: 'car-sport',
    iconSize: 32,
    price: '£45-95/trip',
    desc: 'Professional security transport between locations',
    details: [
      'Airport transfers',
      'Business meetings',
      'Theatre/events',
      'Shopping trips',
    ],
    starting: '£45',
  },
  {
    key: 'event',
    title: 'Event Protection',
    iconType: 'MaterialCommunityIcons',
    iconName: 'account-group',
    iconSize: 32,
    price: '£280-420/day',
    desc: 'Discrete security for your special occasions',
    details: [
      'Awards ceremonies',
      'Private parties',
      'Theatre/concerts',
      'Sporting events',
    ],
    starting: '£280',
  },
  {
    key: 'business',
    title: 'Business Protection',
    iconType: 'FontAwesome5',
    iconName: 'briefcase',
    iconSize: 28,
    price: '£200-450/day',
    desc: 'Executive security for professional needs',
    details: [
      'Conference attendance',
      'Business dinners',
      'Client meetings',
      'Multi-stop business',
    ],
    starting: '£200',
  },
  {
    key: 'vip',
    title: 'VIP Day Services',
    iconType: 'Ionicons',
    iconName: 'star',
    iconSize: 32,
    price: '£320-550/day',
    desc: 'Complete protection for high-profile activities',
    details: [
      'Shopping experiences',
      'Social events',
      'Gallery/museum visits',
      'Wedding security',
    ],
    starting: '£320',
  },
];

const HomeScreen = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState(serviceCategories[0]);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const ctaLabel = `Book ${selectedService.title}`;

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <GQCarsLogo width={140} height={56} />
          </View>

          {/* Location Search Container */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputGroup}>
              <View style={styles.searchBar}>
                <View style={styles.iconContainer}>
                  <Ionicons name="ellipse" size={12} color="#D4AF37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Where from?"
                  placeholderTextColor="#888"
                  value={pickup}
                  onChangeText={setPickup}
                />
              </View>
              
              <View style={styles.searchDivider}>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.searchBar}>
                <View style={styles.iconContainer}>
                  <Ionicons name="square" size={12} color="#1a1a1a" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Where to?"
                  placeholderTextColor="#888"
                  value={dropoff}
                  onChangeText={setDropoff}
                />
              </View>
            </View>
          </View>

          {/* Service Selection Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose your protection</Text>
            <Text style={styles.sectionSubtitle}>Professional security transport services</Text>
          </View>

          {/* Service Cards Carousel */}
          <FlatList
            data={serviceCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.key}
            contentContainerStyle={styles.carouselContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.serviceCard,
                  selectedService.key === item.key && styles.serviceCardSelected
                ]}
                onPress={() => setSelectedService(item)}
                activeOpacity={0.8}
              >
                <View style={styles.serviceIconContainer}>
                  {item.iconType === 'Ionicons' && (
                    <Ionicons name={item.iconName} size={28} color="#D4AF37" />
                  )}
                  {item.iconType === 'MaterialCommunityIcons' && (
                    <MaterialCommunityIcons name={item.iconName} size={28} color="#D4AF37" />
                  )}
                  {item.iconType === 'FontAwesome5' && (
                    <FontAwesome5 name={item.iconName} size={24} color="#D4AF37" />
                  )}
                </View>
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.servicePrice}>{item.starting}</Text>
                <Text style={styles.servicePriceLabel}>starting from</Text>
              </TouchableOpacity>
            )}
          />

          {/* Trust Indicators */}
          <View style={styles.trustSection}>
            <View style={styles.trustItem}>
              <Ionicons name="star" size={16} color="#D4AF37" />
              <Text style={styles.trustText}>4.9 Rating</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark" size={16} color="#D4AF37" />
              <Text style={styles.trustText}>SIA Licensed</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="umbrella" size={16} color="#D4AF37" />
              <Text style={styles.trustText}>£2M Insured</Text>
            </View>
          </View>

          {/* Bottom padding for floating button */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Floating CTA Button */}
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.floatingCTA}
            onPress={() => navigation.navigate('Booking', { service: selectedService, pickup, dropoff })}
            activeOpacity={0.9}
          >
            <Text style={styles.floatingCTAText}>{ctaLabel}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInputGroup: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 20,
    alignItems: 'center',
    marginRight: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  searchDivider: {
    paddingLeft: 36,
    paddingVertical: 8,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  carouselContainer: {
    paddingHorizontal: 12,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    width: screenWidth * 0.42,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceCardSelected: {
    borderColor: '#D4AF37',
    shadowOpacity: 0.15,
    transform: [{ scale: 1.02 }],
  },
  serviceIconContainer: {
    backgroundColor: '#f8f6f0',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 20,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 2,
  },
  servicePriceLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  trustItem: {
    alignItems: 'center',
  },
  trustText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 34,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  floatingCTA: {
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  floatingCTAText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
});

export default HomeScreen;