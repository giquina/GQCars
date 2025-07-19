import React from 'react';
import { View } from 'react-native';
import theme from '../../theme';

const Card = ({ 
  children, 
  style, 
  elevation = 'md',
  padding = 'md',
  radius = 'md',
  ...props 
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius[radius],
    };

    const paddingStyles = {
      none: {},
      sm: { padding: theme.spacing.sm },
      md: { padding: theme.spacing.md },
      lg: { padding: theme.spacing.lg },
      xl: { padding: theme.spacing.xl },
    };

    const elevationStyles = {
      none: {},
      sm: theme.shadows.sm,
      md: theme.shadows.md,
      lg: theme.shadows.lg,
      xl: theme.shadows.xl,
    };

    return [baseStyle, paddingStyles[padding], elevationStyles[elevation]];
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

export default Card;