import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GQCarsLogo = ({ width = 120, height = 48 }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.logoText}>
        <Text style={styles.gq}>GQ</Text>
        <Text style={styles.cars}>Cars</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  gq: {
    color: '#D4AF37', // Gold
  },
  cars: {
    color: '#1a1a1a', // Black
  },
});

export default GQCarsLogo;
// Shared GQCarsLogo component
// ...existing code from components/GQCarsLogo.js...
