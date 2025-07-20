import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import Card from './Card';
import theme from '../../theme';
import notificationService, { NOTIFICATION_TYPES } from '../../services/NotificationService';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await notificationService.getSettings();
        setSettings(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load notification settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = async (type) => {
    const newValue = !settings[type];
    setSettings({ ...settings, [type]: newValue });

    try {
      await notificationService.updateSetting(type, newValue);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update notification setting');
    }
  };

  const renderSetting = (type, label) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={settings[type]}
        onValueChange={() => handleToggle(type)}
        trackColor={{ false: theme.colors.gray, true: theme.colors.primary }}
        thumbColor={settings[type] ? theme.colors.white : theme.colors.gray}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Notification Settings</Text>
        {renderSetting(NOTIFICATION_TYPES.PUSH, 'Push Notifications')}
        {renderSetting(NOTIFICATION_TYPES.EMAIL, 'Email Notifications')}
        {renderSetting(NOTIFICATION_TYPES.SMS, 'SMS Notifications')}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.medium,
  },
  card: {
    padding: theme.spacing.large,
    borderRadius: theme.borderRadius,
    elevation: 2,
  },
  title: {
    fontSize: theme.fontSize.large,
    fontWeight: 'bold',
    marginBottom: theme.spacing.medium,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
  },
  settingLabel: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.text,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationSettings;
