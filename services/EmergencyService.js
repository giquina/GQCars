import * as Linking from 'expo-linking';
import * as SMS from 'expo-sms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationService from './LocationService';

class EmergencyService {
  static instance = null;

  constructor() {
    if (EmergencyService.instance) {
      return EmergencyService.instance;
    }
    EmergencyService.instance = this;
    this.emergencyContacts = [];
    this.companyDispatch = {
      phone: '+1-800-GQCARS',
      name: 'GQCars Dispatch',
    };
    this.emergencyNumber = '911';
    this.isEmergencyActive = false;
  }

  static getInstance() {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService();
    }
    return EmergencyService.instance;
  }

  // Emergency Contact Management
  async loadEmergencyContacts() {
    try {
      const contactsJson = await AsyncStorage.getItem('emergency_contacts');
      if (contactsJson) {
        this.emergencyContacts = JSON.parse(contactsJson);
      }
      return this.emergencyContacts;
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
      return [];
    }
  }

  async saveEmergencyContacts(contacts) {
    try {
      this.emergencyContacts = contacts;
      await AsyncStorage.setItem('emergency_contacts', JSON.stringify(contacts));
      return true;
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
      return false;
    }
  }

  async addEmergencyContact(contact) {
    try {
      const { name, phone, relationship } = contact;
      
      // Validate contact data
      if (!name || !phone) {
        throw new Error('Name and phone number are required');
      }

      // Validate phone number format
      if (!this.validatePhoneNumber(phone)) {
        throw new Error('Invalid phone number format');
      }

      const newContact = {
        id: Date.now().toString(),
        name: name.trim(),
        phone: this.formatPhoneNumber(phone),
        relationship: relationship || 'Emergency Contact',
        createdAt: new Date().toISOString(),
      };

      await this.loadEmergencyContacts();
      this.emergencyContacts.push(newContact);
      await this.saveEmergencyContacts(this.emergencyContacts);
      
      return newContact;
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      throw error;
    }
  }

  async removeEmergencyContact(contactId) {
    try {
      await this.loadEmergencyContacts();
      this.emergencyContacts = this.emergencyContacts.filter(
        contact => contact.id !== contactId
      );
      await this.saveEmergencyContacts(this.emergencyContacts);
      return true;
    } catch (error) {
      console.error('Error removing emergency contact:', error);
      return false;
    }
  }

  validatePhoneNumber(phone) {
    // Basic phone number validation - accepts various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  formatPhoneNumber(phone) {
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d\+]/g, '');
    
    // If it starts with 1 and has 11 digits, add + prefix
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return '+' + cleaned;
    }
    
    // If it starts with + and has valid length, return as is
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // If it's 10 digits, assume US number
    if (cleaned.length === 10) {
      return '+1' + cleaned;
    }
    
    return cleaned;
  }

  // Location Sharing
  async getCurrentLocationForEmergency() {
    try {
      const locationService = LocationService.getInstance();
      const location = await locationService.getCurrentLocation();
      
      if (location) {
        const address = await locationService.reverseGeocode(
          location.latitude,
          location.longitude
        );
        
        return {
          ...location,
          address: address?.formattedAddress || 'Address unavailable',
          timestamp: new Date().toISOString(),
        };
      }
      
      throw new Error('Unable to get current location');
    } catch (error) {
      console.error('Error getting emergency location:', error);
      throw error;
    }
  }

  generateLocationMessage(location, isEmergency = true) {
    const urgencyText = isEmergency ? 'EMERGENCY' : 'LOCATION SHARE';
    const gmapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    
    return `🚨 ${urgencyText} 🚨\n\nI need help! My current location is:\n\n📍 ${location.address}\n\nCoordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\n\nView on map: ${gmapsUrl}\n\nSent via GQCars Safety App\nTime: ${new Date(location.timestamp).toLocaleString()}`;
  }

  // Emergency Call Functions
  async makeEmergencyCall(phoneNumber = this.emergencyNumber) {
    try {
      const canCall = await Linking.canOpenURL(`tel:${phoneNumber}`);
      if (canCall) {
        await Linking.openURL(`tel:${phoneNumber}`);
        return true;
      } else {
        throw new Error('Device cannot make phone calls');
      }
    } catch (error) {
      console.error('Error making emergency call:', error);
      throw error;
    }
  }

  async callEmergencyServices() {
    return this.makeEmergencyCall(this.emergencyNumber);
  }

  async callCompanyDispatch() {
    return this.makeEmergencyCall(this.companyDispatch.phone);
  }

  async callEmergencyContact(contactId) {
    try {
      await this.loadEmergencyContacts();
      const contact = this.emergencyContacts.find(c => c.id === contactId);
      
      if (!contact) {
        throw new Error('Emergency contact not found');
      }
      
      return this.makeEmergencyCall(contact.phone);
    } catch (error) {
      console.error('Error calling emergency contact:', error);
      throw error;
    }
  }

  // SMS Functions
  async sendEmergencySMS(phoneNumber, message) {
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('SMS is not available on this device');
      }

      const result = await SMS.sendSMSAsync([phoneNumber], message);
      return result.result === 'sent';
    } catch (error) {
      console.error('Error sending emergency SMS:', error);
      throw error;
    }
  }

  async sendLocationToContacts(location, customMessage = '') {
    try {
      await this.loadEmergencyContacts();
      
      if (this.emergencyContacts.length === 0) {
        throw new Error('No emergency contacts available');
      }

      const message = customMessage || this.generateLocationMessage(location, true);
      const results = [];

      for (const contact of this.emergencyContacts) {
        try {
          const sent = await this.sendEmergencySMS(contact.phone, message);
          results.push({
            contact: contact.name,
            phone: contact.phone,
            sent,
            error: null,
          });
        } catch (error) {
          results.push({
            contact: contact.name,
            phone: contact.phone,
            sent: false,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error sending location to contacts:', error);
      throw error;
    }
  }

  async sendEmergencyAlert(customMessage = '') {
    try {
      const location = await this.getCurrentLocationForEmergency();
      const message = customMessage || this.generateLocationMessage(location, true);
      
      // Send to emergency contacts
      const contactResults = await this.sendLocationToContacts(location, message);
      
      // Send to company dispatch
      let dispatchResult = null;
      try {
        dispatchResult = {
          contact: this.companyDispatch.name,
          phone: this.companyDispatch.phone,
          sent: await this.sendEmergencySMS(this.companyDispatch.phone, message),
          error: null,
        };
      } catch (error) {
        dispatchResult = {
          contact: this.companyDispatch.name,
          phone: this.companyDispatch.phone,
          sent: false,
          error: error.message,
        };
      }

      return {
        location,
        results: [...contactResults, dispatchResult],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      throw error;
    }
  }

  // Emergency Templates
  getEmergencyMessageTemplates() {
    return [
      {
        id: 'general',
        title: 'General Emergency',
        message: 'I need immediate help! Please call emergency services and come to my location.',
      },
      {
        id: 'medical',
        title: 'Medical Emergency',
        message: 'MEDICAL EMERGENCY! I need immediate medical assistance. Please call 911 and come to my location.',
      },
      {
        id: 'safety',
        title: 'Safety Concern',
        message: 'I feel unsafe in my current location. Please check on me and contact authorities if needed.',
      },
      {
        id: 'vehicle',
        title: 'Vehicle Emergency',
        message: 'I have a vehicle emergency or breakdown. Please send help to my location.',
      },
      {
        id: 'custom',
        title: 'Custom Message',
        message: '',
      },
    ];
  }

  // Main Emergency Activation
  async activateEmergency(options = {}) {
    try {
      this.isEmergencyActive = true;
      
      const {
        callEmergencyServices = false,
        alertContacts = true,
        alertDispatch = true,
        customMessage = '',
        template = 'general',
      } = options;

      const results = {
        emergencyActivated: true,
        timestamp: new Date().toISOString(),
        actions: [],
      };

      // Get current location
      let location;
      try {
        location = await this.getCurrentLocationForEmergency();
        results.location = location;
      } catch (error) {
        results.actions.push({
          action: 'get_location',
          success: false,
          error: error.message,
        });
      }

      // Call emergency services if requested
      if (callEmergencyServices) {
        try {
          await this.callEmergencyServices();
          results.actions.push({
            action: 'call_emergency_services',
            success: true,
          });
        } catch (error) {
          results.actions.push({
            action: 'call_emergency_services',
            success: false,
            error: error.message,
          });
        }
      }

      // Send alerts if location is available
      if (location && (alertContacts || alertDispatch)) {
        try {
          const templates = this.getEmergencyMessageTemplates();
          const selectedTemplate = templates.find(t => t.id === template);
          const message = customMessage || selectedTemplate?.message || templates[0].message;
          
          const alertResults = await this.sendEmergencyAlert(
            this.generateLocationMessage(location, true) + '\n\n' + message
          );
          
          results.actions.push({
            action: 'send_alerts',
            success: true,
            details: alertResults,
          });
        } catch (error) {
          results.actions.push({
            action: 'send_alerts',
            success: false,
            error: error.message,
          });
        }
      }

      // Store emergency activation for offline access
      await this.storeEmergencyActivation(results);

      return results;
    } catch (error) {
      console.error('Error activating emergency:', error);
      this.isEmergencyActive = false;
      throw error;
    }
  }

  async deactivateEmergency() {
    this.isEmergencyActive = false;
    await AsyncStorage.setItem('emergency_active', 'false');
  }

  async storeEmergencyActivation(results) {
    try {
      await AsyncStorage.setItem('last_emergency', JSON.stringify(results));
      await AsyncStorage.setItem('emergency_active', 'true');
    } catch (error) {
      console.error('Error storing emergency activation:', error);
    }
  }

  async getLastEmergencyActivation() {
    try {
      const lastEmergencyJson = await AsyncStorage.getItem('last_emergency');
      return lastEmergencyJson ? JSON.parse(lastEmergencyJson) : null;
    } catch (error) {
      console.error('Error getting last emergency activation:', error);
      return null;
    }
  }

  async isEmergencyCurrentlyActive() {
    try {
      const isActive = await AsyncStorage.getItem('emergency_active');
      return isActive === 'true';
    } catch (error) {
      console.error('Error checking emergency status:', error);
      return false;
    }
  }

  // Offline Support
  async storeOfflineEmergencyData() {
    try {
      const location = await this.getCurrentLocationForEmergency();
      const offlineData = {
        location,
        contacts: this.emergencyContacts,
        timestamp: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('offline_emergency_data', JSON.stringify(offlineData));
      return offlineData;
    } catch (error) {
      console.error('Error storing offline emergency data:', error);
      throw error;
    }
  }

  async getOfflineEmergencyData() {
    try {
      const dataJson = await AsyncStorage.getItem('offline_emergency_data');
      return dataJson ? JSON.parse(dataJson) : null;
    } catch (error) {
      console.error('Error getting offline emergency data:', error);
      return null;
    }
  }
}

export default EmergencyService;