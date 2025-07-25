import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import theme from '../../theme';

const GQMapView = ({ 
  style, 
  pickupLocation, 
  destination, 
  showUserLocation = true,
  onMapReady,
  onLocationSelect,
  ...props 
}) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Mock location for web demo
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Error getting location:', error);
          // Default to London for demo
          setUserLocation({
            latitude: 51.5074,
            longitude: -0.1278,
          });
        }
      );
    } else {
      // Default to London for demo
      setUserLocation({
        latitude: 51.5074,
        longitude: -0.1278,
      });
    }
  }, []);

  const handleMapClick = (event) => {
    if (onLocationSelect) {
      // Mock coordinate selection for web (works with both touch and click events)
      onLocationSelect({
        latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
        longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
      });
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapPlaceholder} onTouchEnd={handleMapClick} onClick={handleMapClick}>
        <Text style={styles.mapText}>Interactive Map</Text>
        <Text style={styles.mapSubtext}>
          {pickupLocation ? '📍 Pickup Location Set' : 'Tap to set pickup location'}
        </Text>
        {destination && (
          <Text style={styles.mapSubtext}>🎯 Destination Set</Text>
        )}
        {userLocation && (
          <Text style={styles.mapSubtext}>
            📍 Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginVertical: 2,
    textAlign: 'center',
  },
});

export default GQMapView;