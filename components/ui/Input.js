import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  multiline = false,
  secureTextEntry = false,
  style,
  inputStyle,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = () => {
    return [
      {
        marginBottom: theme.spacing.md,
      },
      containerStyle,
    ];
  };

  const getInputContainerStyle = () => {
    return [
      {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: error ? theme.colors.error : (isFocused ? theme.colors.primary : theme.colors.border),
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.md,
        minHeight: 48,
      },
      style,
    ];
  };

  const getInputStyle = () => {
    return [
      {
        flex: 1,
        ...theme.typography.bodyMedium,
        color: theme.colors.text,
        paddingVertical: theme.spacing.sm,
        marginLeft: leftIcon ? theme.spacing.sm : 0,
        marginRight: rightIcon ? theme.spacing.sm : 0,
      },
      inputStyle,
    ];
  };

  const getLabelStyle = () => {
    return [
      {
        ...theme.typography.labelMedium,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
      },
    ];
  };

  const getErrorStyle = () => {
    return [
      {
        ...theme.typography.bodySmall,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
      },
    ];
  };

  return (
    <View style={getContainerStyle()}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={theme.colors.textSecondary}
          />
        )}
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
};

export default Input;