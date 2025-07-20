import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Vibration,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import Button from './Button';
import EmergencyService from '../../services/EmergencyService';
import notificationService, { NOTIFICATION_TYPES } from '../../services/NotificationService';

const EmergencyButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState(new Animated.Value(0));

  const handlePress = () => {
    Vibration.vibrate();
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleConfirm = () => {
    setLoading(true);
    // Trigger emergency service
    EmergencyService.trigger()
      .then(() => {
        setLoading(false);
        setModalVisible(false);
        // Show success notification
        notificationService.showNotification({
          title: 'Emergency Triggered',
          message: 'Emergency services have been notified.',
          type: NOTIFICATION_TYPES.SUCCESS,
        });
      })
      .catch((error) => {
        setLoading(false);
        // Show error notification
        notificationService.showNotification({
          title: 'Error',
          message: 'Failed to trigger emergency services.',
          type: NOTIFICATION_TYPES.ERROR,
        });
      });
  };

  // Animation for button press
  const buttonAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: theme.colors.danger,
          borderRadius: 50,
          padding: 10,
          elevation: 5,
        }}
      >
        <Animated.View style={{ transform: [{ scale: buttonAnimation }] }}>
          <Ionicons name="alert" size={24} color={theme.colors.white} />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: theme.colors.background,
              borderRadius: 10,
              padding: 20,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: theme.colors.text,
              }}
            >
              Emergency Alert
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 20,
                color: theme.colors.text,
              }}
            >
              Are you sure you want to trigger the emergency services?
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                title="Cancel"
                onPress={handleClose}
                style={{ flex: 1, marginRight: 10 }}
                textStyle={{ color: theme.colors.primary }}
              />
              <Button
                title="Confirm"
                onPress={handleConfirm}
                style={{ flex: 1 }}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EmergencyButton;
