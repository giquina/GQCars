import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import theme from '../../theme';

const SkeletonLoader = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.colors.gray200,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

const SkeletonCard = () => (
  <View style={{
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.gray200,
    minHeight: 140,
    ...theme.shadows.md,
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
      <SkeletonLoader width={56} height={56} borderRadius={28} />
      <SkeletonLoader width={60} height={20} borderRadius={10} />
    </View>
    <SkeletonLoader width="60%" height={24} borderRadius={4} style={{ marginBottom: theme.spacing.sm }} />
    <SkeletonLoader width="80%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
    <SkeletonLoader width="70%" height={16} borderRadius={4} style={{ marginBottom: theme.spacing.md }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <SkeletonLoader width={80} height={20} borderRadius={4} />
      <SkeletonLoader width={60} height={16} borderRadius={4} />
    </View>
  </View>
);

export { SkeletonLoader, SkeletonCard };
export default SkeletonLoader;
