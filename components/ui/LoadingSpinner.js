import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = theme.colors.primary,
  style 
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  };

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons 
          name="refresh-outline" 
          size={sizeMap[size]} 
          color={color} 
        />
      </Animated.View>
    </View>
  );
};

export default LoadingSpinner;
