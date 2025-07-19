import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import theme from '../theme';
import EmergencyService from '../services/EmergencyService';

const EmergencyContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const emergencyService = EmergencyService.getInstance();

  const relationshipOptions = [
    'Family Member',
    'Spouse/Partner',
    'Parent',
    'Child',
    'Sibling',
    'Friend',
    'Colleague',
    'Emergency Contact',
    'Other',
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const loadedContacts = await emergencyService.loadEmergencyContacts();
      setContacts(loadedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Unable to load emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!emergencyService.validatePhoneNumber(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.relationship.trim()) {
      errors.relationship = 'Relationship is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveContact = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (editingContact) {
        // Update existing contact
        await emergencyService.removeEmergencyContact(editingContact.id);
      }

      // Add new/updated contact
      await emergencyService.addEmergencyContact(formData);
      
      // Reload contacts
      await loadContacts();
      
      // Reset form and close modal
      resetForm();
      setShowAddModal(false);
      setEditingContact(null);

      Alert.alert(
        'Success',
        editingContact ? 'Contact updated successfully' : 'Emergency contact added successfully'
      );
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', error.message || 'Unable to save emergency contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = (contact) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await emergencyService.removeEmergencyContact(contact.id);
              await loadContacts();
              Alert.alert('Success', 'Contact deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Unable to delete contact');
            }
          },
        },
      ]
    );
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleCallContact = async (contact) => {
    try {
      await emergencyService.callEmergencyContact(contact.id);
    } catch (error) {
      Alert.alert(
        'Unable to Call',
        `Unable to call ${contact.name}. Please check your device settings.`,
        [{ text: 'OK' }]
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      relationship: '',
    });
    setFormErrors({});
  };

  const formatPhoneDisplay = (phone) => {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const renderAddContactModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        if (!saving) {
          setShowAddModal(false);
          setEditingContact(null);
          resetForm();
        }
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={() => {
              if (!saving) {
                setShowAddModal(false);
                setEditingContact(null);
                resetForm();
              }
            }}
            disabled={saving}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
          </Text>
          <TouchableOpacity 
            onPress={handleSaveContact}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={styles.modalSaveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Contact Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={[styles.textInput, formErrors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (formErrors.name) {
                    setFormErrors({ ...formErrors, name: null });
                  }
                }}
                placeholder="Enter contact's full name"
                autoCapitalize="words"
                autoCorrect={false}
              />
              {formErrors.name && (
                <Text style={styles.errorText}>{formErrors.name}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={[styles.textInput, formErrors.phone && styles.inputError]}
                value={formData.phone}
                onChangeText={(text) => {
                  setFormData({ ...formData, phone: text });
                  if (formErrors.phone) {
                    setFormErrors({ ...formErrors, phone: null });
                  }
                }}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                autoCorrect={false}
              />
              {formErrors.phone && (
                <Text style={styles.errorText}>{formErrors.phone}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Relationship *</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.relationshipOptions}
              >
                {relationshipOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.relationshipOption,
                      formData.relationship === option && styles.relationshipOptionSelected,
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, relationship: option });
                      if (formErrors.relationship) {
                        setFormErrors({ ...formErrors, relationship: null });
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.relationshipOptionText,
                        formData.relationship === option && styles.relationshipOptionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {formErrors.relationship && (
                <Text style={styles.errorText}>{formErrors.relationship}</Text>
              )}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Important Information</Text>
            <Text style={styles.infoText}>
              • This contact will be notified automatically in emergencies{'\n'}
              • Make sure the phone number is correct and active{'\n'}
              • Contact will receive your location and emergency details{'\n'}
              • You can test the contact by calling them directly
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderContactCard = (contact) => (
    <Card key={contact.id} style={styles.contactCard} elevation="sm">
      <View style={styles.contactHeader}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactRelationship}>{contact.relationship}</Text>
          <Text style={styles.contactPhone}>{formatPhoneDisplay(contact.phone)}</Text>
        </View>
        
        <View style={styles.contactActions}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleCallContact(contact)}
          >
            <Ionicons name="call" size={20} color={theme.colors.surface} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditContact(contact)}
          >
            <Ionicons name="pencil" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteContact(contact)}
          >
            <Ionicons name="trash" size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.contactAdded}>
        Added: {new Date(contact.createdAt).toLocaleDateString()}
      </Text>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading emergency contacts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <Card style={styles.infoCard} elevation="sm">
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={theme.colors.info} />
            <Text style={styles.infoTitle}>About Emergency Contacts</Text>
          </View>
          <Text style={styles.infoDescription}>
            Emergency contacts will be automatically notified with your location when you activate emergency features. 
            Make sure to add trusted contacts who can help in case of emergency.
          </Text>
        </Card>

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <View style={styles.contactsList}>
            <Text style={styles.sectionTitle}>
              Your Emergency Contacts ({contacts.length})
            </Text>
            {contacts.map(renderContactCard)}
          </View>
        ) : (
          <Card style={styles.emptyCard} elevation="sm">
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
              <Text style={styles.emptyDescription}>
                Add trusted contacts who can help you in emergency situations. 
                They'll be notified automatically with your location.
              </Text>
              <Button
                title="Add Your First Contact"
                style={styles.addFirstButton}
                onPress={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
              />
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        {contacts.length > 0 && (
          <Card style={styles.actionsCard} elevation="sm">
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <Button
                title="Test All Contacts"
                variant="outline"
                style={styles.actionButton}
                onPress={() => {
                  Alert.alert(
                    'Test Contacts',
                    'This will send a test message to all your emergency contacts.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Send Test', onPress: () => {
                        // TODO: Implement test message sending
                        Alert.alert('Test Sent', 'Test messages have been sent to your emergency contacts.');
                      }}
                    ]
                  );
                }}
              />
              <Button
                title="Export Contacts"
                variant="ghost"
                style={styles.actionButton}
                onPress={() => {
                  Alert.alert(
                    'Export Contacts',
                    'This feature will be available in a future update.',
                    [{ text: 'OK' }]
                  );
                }}
              />
            </View>
          </Card>
        )}
      </ScrollView>

      {renderAddContactModal()}
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  addButton: {
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
    paddingTop: theme.spacing.lg,
  },
  infoCard: {
    marginBottom: theme.spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  infoDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  contactsList: {
    marginBottom: theme.spacing.lg,
  },
  contactCard: {
    marginBottom: theme.spacing.md,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  contactRelationship: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    marginTop: 2,
  },
  contactPhone: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  contactActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactAdded: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
  },
  emptyCard: {
    marginBottom: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  addFirstButton: {
    alignSelf: 'center',
  },
  actionsCard: {
    marginBottom: theme.spacing.xxl,
  },
  actionButtons: {
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalCancelText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
  },
  modalTitle: {
    ...theme.typography.headlineSmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  modalSaveText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  formSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  formSectionTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  relationshipOptions: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  relationshipOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray100,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  relationshipOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  relationshipOptionText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  relationshipOptionTextSelected: {
    color: theme.colors.surface,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
};

export default EmergencyContactsScreen;