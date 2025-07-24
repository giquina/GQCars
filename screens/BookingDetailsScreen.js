import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import EmergencyButton from '../components/ui/EmergencyButton';
import BookingService from '../services/BookingService';
import theme from '../theme';

const BookingDetailsScreen = ({ navigation, route }) => {
  const { bookingData } = route.params || {};
  
  // Booking details state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isScheduled, setIsScheduled] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [isVipService, setIsVipService] = useState(false);
  
  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Special service options
  const specialServices = [
    {
      id: 'vip',
      name: 'VIP Service',
      description: 'Priority treatment and enhanced security',
      price: 25.00,
      icon: 'star',
    },
    {
      id: 'meet_greet',
      name: 'Meet & Greet',
      description: 'Driver meets you at arrivals/entrance',
      price: 15.00,
      icon: 'person',
    },
    {
      id: 'luggage_assistance',
      name: 'Luggage Assistance',
      description: 'Help with luggage handling',
      price: 10.00,
      icon: 'bag',
    },
    {
      id: 'child_seat',
      name: 'Child Safety Seat',
      description: 'Approved child car seat (specify age)',
      price: 8.00,
      icon: 'person-add',
    },
  ];

  const [selectedServices, setSelectedServices] = useState([]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setErrors(prev => ({ ...prev, date: null }));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
      setErrors(prev => ({ ...prev, time: null }));
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const incrementPassengers = () => {
    if (passengerCount < 6) {
      setPassengerCount(prev => prev + 1);
    }
  };

  const decrementPassengers = () => {
    if (passengerCount > 1) {
      setPassengerCount(prev => prev - 1);
    }
  };

  const validateInputs = () => {
    const newErrors = {};

    if (isScheduled) {
      const now = new Date();
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(selectedTime.getHours());
      scheduledDateTime.setMinutes(selectedTime.getMinutes());

      if (scheduledDateTime <= now) {
        newErrors.date = 'Scheduled time must be in the future';
      }

      if (scheduledDateTime < new Date(now.getTime() + 30 * 60000)) {
        newErrors.time = 'Please schedule at least 30 minutes in advance';
      }
    }

    if (contactName.trim().length < 2) {
      newErrors.contactName = 'Contact name is required';
    }

    if (contactPhone.trim().length < 10) {
      newErrors.contactPhone = 'Valid phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setIsLoading(true);

      // Prepare booking details
      const bookingDetails = {
        ...bookingData,
        schedulingType: isScheduled ? 'scheduled' : 'immediate',
        scheduledDateTime: isScheduled ? {
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime.toTimeString().split(' ')[0],
          timestamp: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(),
                              selectedTime.getHours(), selectedTime.getMinutes()).toISOString(),
        } : null,
        passengers: {
          count: passengerCount,
          contactName: contactName.trim(),
          contactPhone: contactPhone.trim(),
        },
        specialRequests: specialRequests.trim(),
        flightNumber: flightNumber.trim(),
        selectedServices: selectedServices,
        additionalServices: specialServices.filter(service => selectedServices.includes(service.id)),
        serviceTotal: selectedServices.reduce((total, serviceId) => {
          const service = specialServices.find(s => s.id === serviceId);
          return total + (service ? service.price : 0);
        }, 0),
      };

      // Update booking with details
      await BookingService.updateBooking(bookingDetails);

      // Navigate to confirmation screen
      navigation.navigate('BookingConfirmation', { bookingDetails });
    } catch (error) {
      console.error('Error updating booking details:', error);
      Alert.alert('Booking Error', 'Unable to save booking details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

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
        
        <Text style={styles.headerTitle}>Booking Details</Text>
        
        <EmergencyButton 
          size="small"
          onEmergencyActivated={() => navigation.navigate('Emergency')}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>
          <View style={styles.tripSummary}>
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, styles.pickupDot]} />
              <Text style={styles.locationText}>{bookingData?.pickup?.address}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, styles.destinationDot]} />
              <Text style={styles.locationText}>{bookingData?.destination?.address}</Text>
            </View>
          </View>
          <View style={styles.tripMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="map-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{bookingData?.distance?.toFixed(1)} km</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{bookingData?.estimatedDuration} min</Text>
            </View>
          </View>
        </Card>

        {/* Scheduling */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>When do you need this ride?</Text>
          
          <View style={styles.schedulingOptions}>
            <TouchableOpacity
              style={[styles.schedulingOption, !isScheduled && styles.schedulingOptionSelected]}
              onPress={() => setIsScheduled(false)}
            >
              <Ionicons 
                name={!isScheduled ? "radio-button-on" : "radio-button-off"} 
                size={20} 
                color={!isScheduled ? theme.colors.primary : theme.colors.textSecondary} 
              />
              <View style={styles.schedulingOptionText}>
                <Text style={styles.schedulingOptionTitle}>Book Now</Text>
                <Text style={styles.schedulingOptionSubtitle}>Available drivers nearby</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.schedulingOption, isScheduled && styles.schedulingOptionSelected]}
              onPress={() => setIsScheduled(true)}
            >
              <Ionicons 
                name={isScheduled ? "radio-button-on" : "radio-button-off"} 
                size={20} 
                color={isScheduled ? theme.colors.primary : theme.colors.textSecondary} 
              />
              <View style={styles.schedulingOptionText}>
                <Text style={styles.schedulingOptionTitle}>Schedule for Later</Text>
                <Text style={styles.schedulingOptionSubtitle}>Book up to 7 days in advance</Text>
              </View>
            </TouchableOpacity>
          </View>

          {isScheduled && (
            <View style={styles.dateTimeSection}>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.dateTimeButtonText}>{formatDate(selectedDate)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.dateTimeButtonText}>{formatTime(selectedTime)}</Text>
                </TouchableOpacity>
              </View>
              
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
              {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
            </View>
          )}
        </Card>

        {/* Passenger Information */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          
          <View style={styles.passengerCounter}>
            <Text style={styles.counterLabel}>Number of passengers</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={[styles.counterButton, passengerCount <= 1 && styles.counterButtonDisabled]}
                onPress={decrementPassengers}
                disabled={passengerCount <= 1}
              >
                <Ionicons name="remove" size={20} color={passengerCount <= 1 ? theme.colors.disabledText : theme.colors.primary} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{passengerCount}</Text>
              <TouchableOpacity
                style={[styles.counterButton, passengerCount >= 6 && styles.counterButtonDisabled]}
                onPress={incrementPassengers}
                disabled={passengerCount >= 6}
              >
                <Ionicons name="add" size={20} color={passengerCount >= 6 ? theme.colors.disabledText : theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <Input
            label="Contact Name"
            placeholder="Enter primary contact name"
            value={contactName}
            onChangeText={setContactName}
            error={errors.contactName}
            leftIcon="person-outline"
          />

          <Input
            label="Contact Phone"
            placeholder="Enter contact phone number"
            value={contactPhone}
            onChangeText={setContactPhone}
            error={errors.contactPhone}
            leftIcon="call-outline"
            keyboardType="phone-pad"
          />

          <Input
            label="Flight Number (Optional)"
            placeholder="e.g., BA123, LH456"
            value={flightNumber}
            onChangeText={setFlightNumber}
            leftIcon="airplane-outline"
          />
        </Card>

        {/* Additional Services */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Services</Text>
          {specialServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceOption}
              onPress={() => toggleService(service.id)}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceInfo}>
                  <View style={styles.serviceIcon}>
                    <Ionicons name={service.icon} size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                  </View>
                </View>
                <View style={styles.servicePrice}>
                  <Text style={styles.servicePriceText}>+£{service.price.toFixed(2)}</Text>
                  <Ionicons 
                    name={selectedServices.includes(service.id) ? "checkbox" : "checkbox-outline"} 
                    size={24} 
                    color={selectedServices.includes(service.id) ? theme.colors.primary : theme.colors.textSecondary} 
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Special Requests */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Special Requests</Text>
          <Input
            placeholder="Any special requirements or notes for your driver..."
            value={specialRequests}
            onChangeText={setSpecialRequests}
            multiline={true}
            style={styles.specialRequestsInput}
          />
        </Card>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title="Review Booking"
          onPress={handleContinue}
          loading={isLoading}
          disabled={isLoading}
          size="large"
        />
      </View>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
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
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  summaryCard: {
    marginBottom: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  tripSummary: {
    marginBottom: theme.spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.md,
  },
  pickupDot: {
    backgroundColor: theme.colors.primary,
  },
  destinationDot: {
    backgroundColor: theme.colors.error,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.gray300,
    marginLeft: 5,
    marginBottom: theme.spacing.sm,
  },
  locationText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    flex: 1,
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  schedulingOptions: {
    marginBottom: theme.spacing.md,
  },
  schedulingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  schedulingOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '08',
  },
  schedulingOptionText: {
    marginLeft: theme.spacing.md,
  },
  schedulingOptionTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
  },
  schedulingOptionSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  dateTimeSection: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  },
  dateTimeButtonText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  passengerCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  counterLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  counterValue: {
    ...theme.typography.titleLarge,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.lg,
    minWidth: 30,
    textAlign: 'center',
  },
  serviceOption: {
    marginBottom: theme.spacing.md,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    ...theme.typography.titleMedium,
    color: theme.colors.text,
  },
  serviceDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  servicePrice: {
    alignItems: 'flex-end',
  },
  servicePriceText: {
    ...theme.typography.labelMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  specialRequestsInput: {
    minHeight: 80,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  errorText: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
};

export default BookingDetailsScreen;