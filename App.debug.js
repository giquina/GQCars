import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Minimal debug version to test what's causing the blank screen
export default function DebugApp() {
  console.log('Debug App is rendering...');
  console.log('Platform:', Platform.OS);
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>🎉 GQCars Debug App</Text>
      <Text style={styles.subtitle}>Platform: {Platform.OS}</Text>
      <Text style={styles.text}>
        If you can see this text, React Native Web is working correctly!
      </Text>
      <Text style={styles.text}>
        The issue is likely in one of your specific components or imports.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
    lineHeight: 24,
  },
});