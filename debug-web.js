// Debug script to test web compatibility
import React from 'react';
import { Text, View } from 'react-native';

// Simple test component to verify basic React Native Web is working
const DebugComponent = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        ✅ React Native Web is Working!
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center' }}>
        If you can see this, the basic setup is working. 
        The issue might be in specific components.
      </Text>
    </View>
  );
};

export default DebugComponent;