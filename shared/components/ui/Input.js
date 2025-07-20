import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

// Shared Input component
const Input = ({ label, icon, error, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(props.secureTextEntry);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const toggleSecureEntry = () => {
        setIsSecure((prev) => !prev);
    };

    return (
        <View style={{ marginBottom: 20 }}>
            {label && (
                <Text style={{ marginBottom: 5, color: theme.colors.text }}>
                    {label}
                </Text>
            )}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: isFocused
                        ? theme.colors.primary
                        : error
                        ? theme.colors.error
                        : theme.colors.border,
                    borderRadius: 5,
                    padding: 10,
                }}
            >
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={
                            isFocused
                                ? theme.colors.primary
                                : error
                                ? theme.colors.error
                                : theme.colors.text
                        }
                        style={{ marginRight: 10 }}
                    />
                )}
                <TextInput
                    {...props}
                    secureTextEntry={isSecure}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                        flex: 1,
                        height: 40,
                        color: theme.colors.text,
                    }}
                />
                {props.secureTextEntry && (
                    <TouchableOpacity
                        onPress={toggleSecureEntry}
                        style={{ padding: 10 }}
                    >
                        <Ionicons
                            name={isSecure ? 'eye-off' : 'eye'}
                            size={20}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text style={{ marginTop: 5, color: theme.colors.error }}>
                    {error}
                </Text>
            )}
        </View>
    );
};

export default Input;
