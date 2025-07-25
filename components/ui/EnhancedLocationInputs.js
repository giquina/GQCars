import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  Keyboard,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

// Main Location Input Component with Enhanced UX
export const EnhancedLocationInput = ({ 
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  focused = false,
  showCurrentLocationButton = true,
  onCurrentLocationPress,
  dotColor = theme.colors.primary,
  style
}) => {
  const [inputHeight, setInputHeight] = useState(0);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(focusAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: focused ? 1.02 : 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [focused]);

  const animatedBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.gray200, dotColor],
  });

  const animatedBackgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', dotColor + '08'],
  });

  return (
    <Animated.View 
      style={[
        styles.locationInputContainer,
        { 
          borderColor: animatedBorderColor,
          backgroundColor: animatedBackgroundColor,
          transform: [{ scale: scaleAnim }]
        },
        style
      ]}
    >
      <View style={styles.locationInputRow}>
        {/* Location Dot */}
        <View style={styles.locationDotContainer}>
          <View style={[styles.locationDot, { backgroundColor: dotColor }]} />
        </View>

        {/* Input Content */}
        <View style={styles.inputContent}>
          <Text style={[styles.inputLabel, focused && { color: dotColor }]}>
            {label}
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                minHeight: Math.max(44, inputHeight),
                color: value ? theme.colors.text : theme.colors.textLight
              }
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textLight}
            multiline={false}
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="done"
            onContentSizeChange={(event) => 
              setInputHeight(event.nativeEvent.contentSize.height)
            }
          />
        </View>

        {/* Current Location Button */}
        {showCurrentLocationButton && (
          <TouchableOpacity
            style={[styles.currentLocationButton, focused && { backgroundColor: dotColor + '20' }]}
            onPress={onCurrentLocationPress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="locate" 
              size={18} 
              color={focused ? dotColor : theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Focus Indicator */}
      {focused && (
        <Animated.View 
          style={[
            styles.focusIndicator, 
            { backgroundColor: dotColor }
          ]} 
        />
      )}
    </Animated.View>
  );
};

// Location Suggestion Item
export const LocationSuggestionItem = ({ 
  location, 
  onPress, 
  showDistance = true,
  showIcon = true,
  style 
}) => {
  const [pressAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: pressAnim }] }, style]}>
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => onPress && onPress(location)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {showIcon && (
          <View style={styles.suggestionIcon}>
            <Ionicons 
              name={location.type === 'current' ? 'locate' : 'location-outline'} 
              size={18} 
              color={location.type === 'current' ? theme.colors.primary : theme.colors.textSecondary} 
            />
          </View>
        )}
        
        <View style={styles.suggestionContent}>
          <Text style={styles.suggestionTitle} numberOfLines={1}>
            {location.title}
          </Text>
          <Text style={styles.suggestionAddress} numberOfLines={2}>
            {location.address}
          </Text>
        </View>
        
        {showDistance && location.distance && (
          <View style={styles.suggestionDistance}>
            <Text style={styles.distanceText}>{location.distance}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Enhanced Location Suggestions List
export const LocationSuggestionsList = ({ 
  suggestions = [], 
  onSuggestionPress,
  visible = false,
  loading = false,
  emptyMessage = "No locations found",
  style 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.suggestionsContainer,
        { opacity: fadeAnim },
        style
      ]}
    >
      <View style={styles.suggestionsCard}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.loadingText}>Finding locations...</Text>
          </View>
        ) : suggestions.length > 0 ? (
          <ScrollView 
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((suggestion, index) => (
              <LocationSuggestionItem
                key={suggestion.id || index}
                location={suggestion}
                onPress={onSuggestionPress}
                style={index === suggestions.length - 1 ? {} : styles.suggestionBorder}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={24} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// Complete Location Input with Suggestions
export const LocationInputWithSuggestions = ({ 
  label,
  value,
  onChangeText,
  onLocationSelect,
  suggestions = [],
  loading = false,
  dotColor = theme.colors.primary,
  placeholder = "Enter location",
  showCurrentLocationButton = true,
  onCurrentLocationPress,
  style 
}) => {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFocus = () => {
    setFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setFocused(false);
    // Delay hiding to allow suggestion tap
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSuggestionPress = (location) => {
    setShowSuggestions(false);
    setFocused(false);
    Keyboard.dismiss();
    onLocationSelect && onLocationSelect(location);
  };

  return (
    <View style={[styles.inputWithSuggestionsContainer, style]}>
      <EnhancedLocationInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        focused={focused}
        showCurrentLocationButton={showCurrentLocationButton}
        onCurrentLocationPress={onCurrentLocationPress}
        dotColor={dotColor}
      />
      
      <LocationSuggestionsList
        suggestions={suggestions}
        onSuggestionPress={handleSuggestionPress}
        visible={showSuggestions}
        loading={loading}
      />
    </View>
  );
};

// Trip Route Display Component
export const TripRouteDisplay = ({ 
  pickup, 
  destination, 
  onEditPickup, 
  onEditDestination,
  onSwapLocations,
  style 
}) => {
  return (
    <View style={[styles.routeDisplayContainer, style]}>
      <View style={styles.routeCard}>
        {/* Pickup */}
        <TouchableOpacity 
          style={styles.routeLocation}
          onPress={onEditPickup}
          activeOpacity={0.8}
        >
          <View style={styles.routeLocationDot}>
            <View style={[styles.locationDot, { backgroundColor: theme.colors.primary }]} />
          </View>
          <View style={styles.routeLocationContent}>
            <Text style={styles.routeLocationLabel}>Pickup</Text>
            <Text style={styles.routeLocationText} numberOfLines={2}>
              {pickup?.address || 'Set pickup location'}
            </Text>
          </View>
          <Ionicons name="pencil" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* Connecting Line and Swap Button */}
        <View style={styles.routeConnection}>
          <View style={styles.routeLine} />
          <TouchableOpacity 
            style={styles.swapButton}
            onPress={onSwapLocations}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-vertical" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Destination */}
        <TouchableOpacity 
          style={styles.routeLocation}
          onPress={onEditDestination}
          activeOpacity={0.8}
        >
          <View style={styles.routeLocationDot}>
            <View style={[styles.locationDot, { backgroundColor: theme.colors.error }]} />
          </View>
          <View style={styles.routeLocationContent}>
            <Text style={styles.routeLocationLabel}>Destination</Text>
            <Text style={styles.routeLocationText} numberOfLines={2}>
              {destination?.address || 'Set destination'}
            </Text>
          </View>
          <Ionicons name="pencil" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  // Enhanced Location Input Styles
  locationInputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 64,
  },
  locationDotContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  textInput: {
    ...theme.typography.bodyMedium,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
  currentLocationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  focusIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },

  // Location Suggestions Styles
  suggestionsContainer: {
    marginTop: theme.spacing.xs,
  },
  suggestionsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    ...theme.shadows.md,
    maxHeight: 300,
    overflow: 'hidden',
  },
  suggestionsList: {
    maxHeight: 280,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 60,
  },
  suggestionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  suggestionContent: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  suggestionTitle: {
    ...theme.typography.titleSmall,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  suggestionAddress: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  suggestionDistance: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.gray100,
    borderRadius: 12,
  },
  distanceText: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },

  // Loading and Empty States
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },

  // Input with Suggestions Container
  inputWithSuggestionsContainer: {
    position: 'relative',
    zIndex: 10,
  },

  // Trip Route Display Styles
  routeDisplayContainer: {
    marginVertical: theme.spacing.md,
  },
  routeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  routeLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  routeLocationDot: {
    width: 24,
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  routeLocationContent: {
    flex: 1,
  },
  routeLocationLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  routeLocationText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
  },
  routeConnection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    marginLeft: 12,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: theme.colors.gray300,
    marginRight: theme.spacing.md,
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
};

export default {
  EnhancedLocationInput,
  LocationSuggestionItem,
  LocationSuggestionsList,
  LocationInputWithSuggestions,
  TripRouteDisplay,
};