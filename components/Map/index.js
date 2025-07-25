import { Platform } from 'react-native';

// Platform-specific map component loading
let MapViewComponent;

if (Platform.OS === 'web') {
  // Use web-compatible map component
  MapViewComponent = require('./MapView.web.js').default;
} else {
  // Use native map component for iOS/Android
  MapViewComponent = require('./MapView.js').default;
}

export default MapViewComponent;