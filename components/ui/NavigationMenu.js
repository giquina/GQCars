import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

const NavigationMenu = ({ visible, onClose, navigation, assessmentCompleted = true }) => {
  const handleMenuPress = (action, params = {}) => {
    onClose(); // Close menu first
    
    switch (action) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'account':
        navigation.navigate('Account');
        break;
      case 'rideHistory':
        Alert.alert('Trip History', 'View your security transport history', [
          { text: 'OK', style: 'default' }
        ]);
        break;
      case 'payments':
        navigation.navigate('PaymentMethod');
        break;
      case 'emergency':
        navigation.navigate('EmergencyContacts');
        break;
      case 'security':
        Alert.alert('Security Features', 'Your safety is our priority:\n\n• All drivers are SIA licensed\n• Real-time tracking\n• Emergency contacts\n• 24/7 support', [
          { text: 'OK', style: 'default' }
        ]);
        break;
      case 'support':
        Alert.alert('Customer Support', 'Need help? Contact us:\n\n📞 24/7 Hotline: +44 20 1234 5678\n📧 Email: support@gqcars.com\n💬 Live Chat: Available in app', [
          { text: 'Call Now', onPress: () => console.log('Call support') },
          { text: 'Email', onPress: () => console.log('Email support') },
          { text: 'Close', style: 'cancel' }
        ]);
        break;
      case 'about':
        Alert.alert('About GQCars', 'GQCars - Premium Security Transport\n\nVersion 1.0.0\n\nProviding safe, secure transportation with licensed security professionals since 2024.', [
          { text: 'OK', style: 'default' }
        ]);
        break;
      case 'settings':
        Alert.alert('Settings', 'App settings and preferences', [
          { text: 'OK', style: 'default' }
        ]);
        break;
      case 'securityAssessment':
        navigation.navigate('Assessment');
        break;
      default:
        console.log('Menu action not implemented:', action);
    }
  };

  const menuSections = [
    {
      title: 'Main',
      items: [
        {
          id: 'home',
          title: 'Home',
          icon: 'home-outline',
          description: 'Book your secure transport',
          action: 'home'
        },
        {
          id: 'account',
          title: 'My Account',
          icon: 'person-outline',
          description: 'Profile and preferences',
          action: 'account'
        },
        {
          id: 'history',
          title: 'Trip History',
          icon: 'receipt-outline',
          description: 'View past secure trips',
          action: 'rideHistory'
        }
      ]
    },
    {
      title: 'Services',
      items: [
        {
          id: 'payments',
          title: 'Payment Methods',
          icon: 'card-outline',
          description: 'Manage payment options',
          action: 'payments'
        },
        {
          id: 'emergency',
          title: 'Emergency Contacts',
          icon: 'people-outline',
          description: 'Trusted contacts for alerts',
          action: 'emergency'
        },
        {
          id: 'securityAssessment',
          title: 'Complete Security Assessment',
          icon: 'clipboard-outline',
          description: 'Required security evaluation',
          action: 'securityAssessment',
          showBadge: !assessmentCompleted
        },
        {
          id: 'security',
          title: 'Security Features',
          icon: 'shield-checkmark-outline',
          description: 'Learn about our safety measures',
          action: 'security'
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'support',
          title: 'Customer Support',
          icon: 'headset-outline',
          description: '24/7 assistance available',
          action: 'support'
        },
        {
          id: 'about',
          title: 'About GQCars',
          icon: 'information-circle-outline',
          description: 'App version and company info',
          action: 'about'
        },
        {
          id: 'settings',
          title: 'Settings',
          icon: 'settings-outline',
          description: 'App preferences',
          action: 'settings'
        }
      ]
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="car-sport" size={24} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.appTitle}>GQCars</Text>
              <Text style={styles.appSubtitle}>Security Transport</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Menu Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {menuSections.map((section, sectionIndex) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item.action)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuItemIcon}>
                      <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
                      {item.showBadge && (
                        <View style={styles.redBadge}>
                          <Text style={styles.redBadgeText}>!</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.menuItemContent}>
                      <Text style={[styles.menuItemTitle, item.showBadge && styles.menuItemTitleUrgent]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.menuItemDescription, item.showBadge && styles.menuItemDescriptionUrgent]}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.showBadge && (
                      <View style={styles.urgentIndicator}>
                        <Text style={styles.urgentText}>Required</Text>
                      </View>
                    )}
                    <Ionicons name="chevron-forward-outline" size={18} color={theme.colors.textSecondary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Emergency Notice */}
          <View style={styles.emergencyNotice}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="warning-outline" size={20} color={theme.colors.error} />
            </View>
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyTitle}>Emergency?</Text>
              <Text style={styles.emergencyText}>Call 999 immediately for life-threatening emergencies</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  appSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  emergencyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error + '10',
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.error + '20',
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
    marginBottom: 2,
  },
  emergencyText: {
    fontSize: 14,
    color: theme.colors.error,
  },
  // Red Badge and Urgent Styles
  redBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  redBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.surface,
  },
  urgentIndicator: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.surface,
  },
  menuItemTitleUrgent: {
    color: '#DC2626',
    fontWeight: '700',
  },
  menuItemDescriptionUrgent: {
    color: '#DC2626',
    fontWeight: '500',
  },
};

export default NavigationMenu;