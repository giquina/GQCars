import { Platform } from 'react-native';

// Platform-specific location imports
let Location;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

class LocationService {
  static instance = null;

  constructor() {
    if (LocationService.instance) {
      return LocationService.instance;
    }
    LocationService.instance = this;
    this.currentLocation = null;
    this.watchId = null;
  }

  static getInstance() {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestPermissions() {
    try {
      if (Platform.OS === 'web') {
        // Web uses browser geolocation API
        return new Promise((resolve) => {
          if (navigator.geolocation) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async getCurrentLocation() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      if (Platform.OS === 'web') {
        // Use browser geolocation API
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              resolve(this.currentLocation);
            },
            (error) => {
              console.error('Web geolocation error:', error);
              // Fallback to London coordinates
              this.currentLocation = {
                latitude: 51.5074,
                longitude: -0.1278,
              };
              resolve(this.currentLocation);
            },
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });

      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  async reverseGeocode(latitude, longitude) {
    try {
      if (Platform.OS === 'web') {
        // Mock reverse geocoding for web
        return `Location near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
      
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        const address = result[0];
        return {
          formattedAddress: this.formatAddress(address),
          address: address,
        };
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  async geocode(address) {
    try {
      if (Platform.OS === 'web') {
        // Mock geocoding for web - return London coordinates
        return {
          latitude: 51.5074,
          longitude: -0.1278,
        };
      }
      
      const result = await Location.geocodeAsync(address);
      if (result && result.length > 0) {
        return {
          latitude: result[0].latitude,
          longitude: result[0].longitude,
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding:', error);
      return null;
    }
  }

  formatAddress(address) {
    const parts = [];
    
    if (address.streetNumber) parts.push(address.streetNumber);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    
    return parts.join(', ');
  }

  startWatchingLocation(callback, options = {}) {
    if (Platform.OS === 'web') {
      // Web doesn't support watch location
      return;
    }
    
    this.stopWatchingLocation();
    
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
        ...options,
      },
      (location) => {
        this.currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        callback(this.currentLocation);
      }
    ).then((watchId) => {
      this.watchId = watchId;
    });
  }

  stopWatchingLocation() {
    if (this.watchId && Platform.OS !== 'web') {
      this.watchId.remove();
      this.watchId = null;
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  getDistanceString(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }
}

export default LocationService;