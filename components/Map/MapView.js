import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';

// Platform-conditional imports
let MapView, Marker, PROVIDER_GOOGLE, Location;

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
  PROVIDER_GOOGLE = MapModule.PROVIDER_GOOGLE;
  Location = require('expo-location');
}
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
  // Default to London, UK for GQCars (can be changed to your preferred default)
  const [region, setRegion] = useState({
    latitude: 51.5074,  // London, UK
    longitude: -0.1278,
    latitudeDelta: 0.15,  // Wider view to show more area
    longitudeDelta: 0.15,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web fallback - skip location services for now
        setLocationPermission(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Permission to access location was denied. Please enable location services to use the map features.',
          [{ text: 'OK' }]
        );
        return;
      }

      setLocationPermission(true);
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(userCoords);
      
      // Update region to user's location with wider view
      const newRegion = {
        ...userCoords,
        latitudeDelta: 0.08,  // More zoomed out to show surrounding area
        longitudeDelta: 0.08,
      };
      setRegion(newRegion);

      // Animate to user location
      if (mapRef.current && Platform.OS !== 'web') {
        mapRef.current.animateToRegion(newRegion, 1000);
      }

    } catch (error) {
      console.error('Error getting location:', error);
      if (Platform.OS !== 'web') {
        Alert.alert('Location Error', 'Could not get your current location.');
      }
    }
  };

  const fitToMarkers = () => {
    if (Platform.OS === 'web') return; // Skip on web
    
    if (mapRef.current && (pickupLocation || destination)) {
      const markers = [];
      if (pickupLocation) markers.push(pickupLocation);
      if (destination) markers.push(destination);
      
      if (markers.length > 0) {
        mapRef.current.fitToCoordinates(markers, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  };

  useEffect(() => {
    if (pickupLocation || destination) {
      setTimeout(fitToMarkers, 500);
    }
  }, [pickupLocation, destination]);

  const handleMapPress = (event) => {
    if (onLocationSelect) {
      const coordinate = event.nativeEvent.coordinate;
      onLocationSelect(coordinate);
    }
  };

  if (Platform.OS === 'web') {
    // Web fallback - return the web-compatible map component
    const WebMapView = require('./MapView.web.js').default;
    return (
      <WebMapView
        style={style}
        pickupLocation={pickupLocation}
        destination={destination}
        onLocationSelect={onLocationSelect}
        {...props}
      />
    );
  }

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={showUserLocation && locationPermission}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={true}
        showsTraffic={false}
        onMapReady={onMapReady}
        onPress={handleMapPress}
        mapType="standard"
        {...props}
      >
        {/* Pickup Marker */}
        {pickupLocation && (
          <Marker
            coordinate={pickupLocation}
            title="Pickup Location"
            pinColor={theme.colors.primary}
            identifier="pickup"
          />
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor={theme.colors.error}
            identifier="destination"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default GQMapView;