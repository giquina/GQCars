import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import theme from '../../theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props 
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const sizeStyles = {
      small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        minHeight: 36,
      },
      medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 48,
      },
      large: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
        minHeight: 56,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? theme.colors.disabled : theme.colors.primary,
        ...theme.shadows.md,
      },
      secondary: {
        backgroundColor: disabled ? theme.colors.disabled : theme.colors.secondary,
        ...theme.shadows.md,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? theme.colors.disabled : theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      surface: {
        backgroundColor: disabled ? theme.colors.disabled : theme.colors.surface,
        ...theme.shadows.sm,
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const getTextStyle = () => {
    const baseTextStyle = size === 'small' ? theme.typography.labelMedium : theme.typography.labelLarge;
    
    const variantTextStyles = {
      primary: {
        color: disabled ? theme.colors.disabledText : '#FFFFFF',
      },
      secondary: {
        color: disabled ? theme.colors.disabledText : '#FFFFFF',
      },
      outline: {
        color: disabled ? theme.colors.disabledText : theme.colors.primary,
      },
      ghost: {
        color: disabled ? theme.colors.disabledText : theme.colors.primary,
      },
      surface: {
        color: disabled ? theme.colors.disabledText : theme.colors.text,
      },
    };

    return [baseTextStyle, variantTextStyles[variant]];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : theme.colors.primary}
          style={{ marginRight: theme.spacing.sm }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
