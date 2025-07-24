import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import theme from '../../theme';
import Input from '../ui/Input';
import Card from '../ui/Card';

const { width: screenWidth } = Dimensions.get('window');

const LocationInput = ({
  label = "Location",
  placeholder = "Enter address...",
  value,
  onLocationSelect,
  onTextChange,
  showCurrentLocation = true,
  showSavedLocations = true,
  savedLocations = [],
  locationType = 'pickup', // 'pickup' or 'destination'
  error,
  disabled = false,
  style,
  ...props
}) => {
  const [inputText, setInputText] = useState(value?.address || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const debounceTimer = useRef(null);

  // Mock geocoding function - in a real app, you'd use Google Places API or similar
  const mockGeocode = useCallback(async (address) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock results based on input
    const mockResults = [
      {
        id: '1',
        address: `${address} - Main Street, London`,
        subtitle: 'Central London',
        coordinates: { latitude: 51.5074, longitude: -0.1278 },
        type: 'address'
      },
      {
        id: '2',
        address: `${address} - Business District`,
        subtitle: 'Commercial Area',
        coordinates: { latitude: 51.5155, longitude: -0.0922 },
        type: 'business'
      },
      {
        id: '3',
        address: `${address} - Residential Area`,
        subtitle: 'Quiet neighborhood',
        coordinates: { latitude: 51.4994, longitude: -0.1319 },
        type: 'residential'
      }
    ].filter(result => 
      result.address.toLowerCase().includes(address.toLowerCase())
    );

    return mockResults;
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Mock reverse geocoding
      const mockAddress = {
        id: 'current',
        address: 'Current Location',
        subtitle: 'Your current position',
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        type: 'current'
      };

      setCurrentLocation(mockAddress);
      return mockAddress;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchLocations = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const results = await mockGeocode(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [mockGeocode]);

  const handleTextChange = useCallback((text) => {
    setInputText(text);
    setShowSuggestions(true);
    
    if (onTextChange) {
      onTextChange(text);
    }

    // Debounce search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      searchLocations(text);
    }, 300);
  }, [onTextChange, searchLocations]);

  const handleLocationSelect = useCallback((location) => {
    setInputText(location.address);
    setShowSuggestions(false);
    setSuggestions([]);
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  }, [onLocationSelect]);

  const handleCurrentLocationPress = useCallback(async () => {
    const location = await getCurrentLocation();
    if (location) {
      handleLocationSelect(location);
    }
  }, [getCurrentLocation, handleLocationSelect]);

  const getLocationIcon = (type) => {
    switch (type) {
      case 'current':
        return 'location';
      case 'business':
        return 'business';
      case 'residential':
        return 'home';
      case 'saved':
        return 'bookmark';
      default:
        return 'location-outline';
    }
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleLocationSelect(item)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
      }}
    >
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
      }}>
        <Ionicons 
          name={getLocationIcon(item.type)} 
          size={16} 
          color={theme.colors.textSecondary} 
        />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          ...theme.typography.bodyMedium,
          color: theme.colors.text,
        }}>
          {item.address}
        </Text>
        {item.subtitle && (
          <Text style={{
            ...theme.typography.bodySmall,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.xs,
          }}>
            {item.subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderQuickActions = () => {
    const actions = [];

    if (showCurrentLocation) {
      actions.push({
        id: 'current',
        title: 'Use Current Location',
        icon: 'location',
        onPress: handleCurrentLocationPress,
      });
    }

    if (showSavedLocations && savedLocations.length > 0) {
      savedLocations.slice(0, 2).forEach((location, index) => {
        actions.push({
          id: `saved-${index}`,
          title: location.name || location.address,
          icon: 'bookmark',
          onPress: () => handleLocationSelect({ ...location, type: 'saved' }),
        });
      });
    }

    if (actions.length === 0) return null;

    return (
      <View style={{
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
      }}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={action.onPress}
            disabled={disabled}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: theme.spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.divider,
            }}
          >
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}>
              <Ionicons name={action.icon} size={16} color="#FFFFFF" />
            </View>
            
            <Text style={{
              ...theme.typography.bodyMedium,
              color: theme.colors.text,
              flex: 1,
            }}>
              {action.title}
            </Text>
            
            {action.id === 'current' && isLoading && (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  useEffect(() => {
    if (value?.address && value.address !== inputText) {
      setInputText(value.address);
    }
  }, [value]);

  return (
    <View style={[{ position: 'relative' }, style]} {...props}>
      <Input
        label={label}
        placeholder={placeholder}
        value={inputText}
        onChangeText={handleTextChange}
        onFocus={() => setShowSuggestions(true)}
        leftIcon={locationType === 'pickup' ? 'radio-button-on' : 'location'}
        rightIcon={isLoading ? undefined : 'search'}
        error={error}
        disabled={disabled}
        style={{
          borderColor: locationType === 'pickup' ? theme.colors.primary : theme.colors.secondary,
        }}
      />

      {showSuggestions && !disabled && (
        <Card
          elevation="lg"
          padding="none"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            marginTop: theme.spacing.xs,
          }}
        >
          {inputText.length === 0 ? (
            renderQuickActions()
          ) : (
            <FlatList
              data={suggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                !isLoading ? (
                  <View style={{
                    padding: theme.spacing.lg,
                    alignItems: 'center',
                  }}>
                    <Ionicons 
                      name="search" 
                      size={32} 
                      color={theme.colors.textLight} 
                      style={{ marginBottom: theme.spacing.sm }}
                    />
                    <Text style={{
                      ...theme.typography.bodyMedium,
                      color: theme.colors.textSecondary,
                      textAlign: 'center',
                    }}>
                      No locations found
                    </Text>
                  </View>
                ) : null
              }
              ListFooterComponent={
                isLoading ? (
                  <View style={{
                    padding: theme.spacing.lg,
                    alignItems: 'center',
                  }}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  </View>
                ) : null
              }
            />
          )}
        </Card>
      )}
    </View>
  );
};

export default LocationInput;