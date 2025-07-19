import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmergencyButton from '../components/ui/EmergencyButton';
import theme from '../theme';
import EmergencyService from '../services/EmergencyService';
import LocationService from '../services/LocationService';

const EmergencyScreen = ({ navigation }) => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const emergencyService = EmergencyService.getInstance();
  const locationService = LocationService.getInstance();

  useEffect(() => {
    loadEmergencyData();
    checkEmergencyStatus();
  }, []);

  const loadEmergencyData = async () => {
    try {
      setLoading(true);
      
      // Load emergency contacts
      const contacts = await emergencyService.loadEmergencyContacts();
      setEmergencyContacts(contacts);
      
      // Get current location
      await updateCurrentLocation();
      
    } catch (error) {
      console.error('Error loading emergency data:', error);
      Alert.alert(
        'Error',
        'Unable to load emergency data. Please check your permissions.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await emergencyService.getCurrentLocationForEmergency();
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      setCurrentLocation(null);
    } finally {
      setLocationLoading(false);
    }
  };

  const checkEmergencyStatus = async () => {
    const isActive = await emergencyService.isEmergencyCurrentlyActive();
    setIsEmergencyActive(isActive);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEmergencyData();
    setRefreshing(false);
  };

  const handleCall911 = async () => {
    try {
      await emergencyService.callEmergencyServices();
    } catch (error) {
      Alert.alert(
        'Unable to Call',
        'Your device cannot make phone calls. Please use another device to call 911.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCallCompanyDispatch = async () => {
    try {
      await emergencyService.callCompanyDispatch();
    } catch (error) {
      Alert.alert(
        'Unable to Call',
        'Unable to call company dispatch. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSendLocation = async () => {
    if (!currentLocation) {
      Alert.alert(
        'Location Unavailable',
        'Unable to get your current location. Please enable location services.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLocationLoading(true);
      const result = await emergencyService.sendLocationToContacts(currentLocation);
      
      const successCount = result.filter(r => r.sent).length;
      const totalCount = result.length;
      
      Alert.alert(
        'Location Sent',
        `Your location has been sent to ${successCount} of ${totalCount} emergency contacts.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Unable to send location to emergency contacts.',
        [{ text: 'OK' }]
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCallContact = async (contact) => {
    try {
      await emergencyService.callEmergencyContact(contact.id);
    } catch (error) {
      Alert.alert(
        'Unable to Call',
        `Unable to call ${contact.name}. Please try again.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleEmergencyActivated = (result) => {
    setIsEmergencyActive(true);
    // You could navigate to a different screen or show additional UI
  };

  const renderQuickActions = () => (
    <Card style={styles.quickActionsCard} elevation="md">
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={[styles.quickAction, styles.emergency911]}
          onPress={handleCall911}
        >
          <Ionicons name="call" size={32} color={theme.colors.surface} />
          <Text style={[styles.quickActionText, styles.emergencyText]}>
            Call 911
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAction}
          onPress={handleCallCompanyDispatch}
        >
          <Ionicons name="business" size={32} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>
            Call Dispatch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAction}
          onPress={handleSendLocation}
          disabled={locationLoading || !currentLocation}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Ionicons name="location" size={32} color={theme.colors.primary} />
          )}
          <Text style={styles.quickActionText}>
            Send Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => navigation.navigate('EmergencyContacts')}
        >
          <Ionicons name="people" size={32} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>
            Contacts
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderCurrentLocation = () => (
    <Card style={styles.locationCard} elevation="md">
      <View style={styles.locationHeader}>
        <Text style={styles.sectionTitle}>Current Location</Text>
        <TouchableOpacity 
          onPress={updateCurrentLocation}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Ionicons name="refresh" size={20} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
      </View>
      
      {currentLocation ? (
        <View>
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={16} color={theme.colors.primary} />
            <Text style={styles.locationText}>
              {currentLocation.address}
            </Text>
          </View>
          <Text style={styles.coordinatesText}>
            {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
          <Text style={styles.timestampText}>
            Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
          </Text>
          
          <TouchableOpacity 
            style={styles.viewMapButton}
            onPress={() => {
              const url = `https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`;
              Linking.openURL(url);
            }}
          >
            <Ionicons name="map" size={16} color={theme.colors.primary} />
            <Text style={styles.viewMapText}>View on Map</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noLocationContainer}>
          <Ionicons name="location-outline" size={32} color={theme.colors.textSecondary} />
          <Text style={styles.noLocationText}>
            Location unavailable
          </Text>
          <Text style={styles.noLocationSubtext}>
            Enable location services to share your location in emergencies
          </Text>
        </View>
      )}
    </Card>
  );

  const renderEmergencyContacts = () => (
    <Card style={styles.contactsCard} elevation="md">
      <View style={styles.contactsHeader}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('EmergencyContacts')}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      {emergencyContacts.length > 0 ? (
        <View style={styles.contactsList}>
          {emergencyContacts.slice(0, 3).map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <TouchableOpacity 
                style={styles.callContactButton}
                onPress={() => handleCallContact(contact)}
              >
                <Ionicons name="call" size={20} color={theme.colors.surface} />
              </TouchableOpacity>
            </View>
          ))}
          
          {emergencyContacts.length > 3 && (
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('EmergencyContacts')}
            >
              <Text style={styles.seeAllText}>
                See all {emergencyContacts.length} contacts
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.noContactsContainer}>
          <Ionicons name="people-outline" size={32} color={theme.colors.textSecondary} />
          <Text style={styles.noContactsText}>
            No emergency contacts
          </Text>
          <Text style={styles.noContactsSubtext}>
            Add trusted contacts to notify in emergencies
          </Text>
          <Button
            title="Add Contacts"
            size="small"
            style={styles.addContactsButton}
            onPress={() => navigation.navigate('EmergencyContacts')}
          />
        </View>
      )}
    </Card>
  );

  const renderMessageTemplates = () => {
    const templates = emergencyService.getEmergencyMessageTemplates();
    
    return (
      <Card style={styles.templatesCard} elevation="md">
        <Text style={styles.sectionTitle}>Quick Messages</Text>
        
        <View style={styles.templatesList}>
          {templates.slice(0, 3).map((template) => (
            <TouchableOpacity 
              key={template.id}
              style={styles.templateItem}
              onPress={() => {
                // TODO: Implement message sending with template
                Alert.alert(
                  template.title,
                  template.message || 'Send this message to emergency contacts?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Send', 
                      onPress: () => {
                        // Send message with template
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.templateTitle}>{template.title}</Text>
              {template.message && (
                <Text style={styles.templatePreview} numberOfLines={2}>
                  {template.message}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading emergency features...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency</Text>
        <View style={styles.headerRight}>
          <EmergencyButton 
            size="medium"
            onEmergencyActivated={handleEmergencyActivated}
          />
        </View>
      </View>

      {/* Emergency Status Banner */}
      {isEmergencyActive && (
        <View style={styles.emergencyBanner}>
          <Ionicons name="warning" size={20} color={theme.colors.surface} />
          <Text style={styles.emergencyBannerText}>
            Emergency Mode Active - Help is on the way
          </Text>
        </View>
      )}

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderQuickActions()}
        {renderCurrentLocation()}
        {renderEmergencyContacts()}
        {renderMessageTemplates()}
        
        {/* Safety Information */}
        <Card style={styles.safetyCard} elevation="sm">
          <Text style={styles.safetyTitle}>Safety Information</Text>
          <Text style={styles.safetyText}>
            • All drivers are licensed security professionals{'\n'}
            • Your location is tracked during rides{'\n'}
            • Emergency contacts are notified automatically{'\n'}
            • 24/7 company dispatch available
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  emergencyBanner: {
    backgroundColor: theme.colors.emergency,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  emergencyBannerText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.surface,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  quickActionsCard: {
    marginBottom: theme.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    aspectRatio: 1,
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emergency911: {
    backgroundColor: theme.colors.emergency,
  },
  quickActionText: {
    ...theme.typography.labelMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  emergencyText: {
    color: theme.colors.surface,
  },
  locationCard: {
    marginBottom: theme.spacing.lg,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  coordinatesText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  timestampText: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  viewMapText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  noLocationContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  noLocationText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  noLocationSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  contactsCard: {
    marginBottom: theme.spacing.lg,
  },
  contactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  contactsList: {
    gap: theme.spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  contactRelationship: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  contactPhone: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  callContactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAllButton: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  seeAllText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
  },
  noContactsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  noContactsText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  noContactsSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  addContactsButton: {
    alignSelf: 'center',
  },
  templatesCard: {
    marginBottom: theme.spacing.lg,
  },
  templatesList: {
    gap: theme.spacing.sm,
  },
  templateItem: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  templateTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  templatePreview: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  safetyCard: {
    marginBottom: theme.spacing.xxl,
  },
  safetyTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  safetyText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
};

export default EmergencyScreen;