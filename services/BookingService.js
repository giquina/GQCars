/**
 * BookingService - Manages the complete booking flow state and logic
 * Handles booking data persistence, state transitions, and flow coordination
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import PaymentService from './PaymentService';
import LocationService from './LocationService';

class BookingService {
  constructor() {
    this.listeners = [];
    this.currentBooking = null;
    this.bookingHistory = [];
    this.locationService = LocationService.getInstance();
  }


  // Event listener management
  addListener(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentBooking);
      } catch (error) {
        console.error('Error notifying booking listener:', error);
      }
    });
  }

  // Initialize a new booking
  async startBooking({ pickupLocation, destinationLocation, selectedService }) {
    try {
      const bookingId = this.generateBookingId();
      const timestamp = new Date().toISOString();

      this.currentBooking = {
        id: bookingId,
        status: 'service_selected',
        createdAt: timestamp,
        updatedAt: timestamp,
        pickupLocation: {
          coords: pickupLocation.coords,
          address: pickupLocation.address || 'Selected Location'
        },
        destinationLocation: {
          coords: destinationLocation.coords,
          address: destinationLocation.address || 'Destination'
        },
        selectedService: selectedService,
        selectedRide: null,
        selectedOfficer: null,
        paymentMethod: null,
        estimatedPrice: this.calculateEstimatedPrice(selectedService, pickupLocation, destinationLocation),
        estimatedDuration: this.calculateEstimatedDuration(pickupLocation, destinationLocation),
        riskAssessment: null,
        specialRequests: [],
        confirmationDetails: null
      };

      await this.saveBookingToStorage();
      this.notifyListeners();
      
      console.log('Booking started:', this.currentBooking);
      return this.currentBooking;
    } catch (error) {
      console.error('Error starting booking:', error);
      throw error;
    }
  }

  // Update booking with ride selection
  async selectRide(rideDetails) {
    if (!this.currentBooking) {
      throw new Error('No active booking found');
    }

    try {
      this.currentBooking.selectedRide = rideDetails;
      this.currentBooking.status = 'ride_selected';
      this.currentBooking.updatedAt = new Date().toISOString();
      
      // Recalculate pricing based on ride selection
      this.currentBooking.estimatedPrice = this.calculateRidePrice(rideDetails, this.currentBooking);

      await this.saveBookingToStorage();
      this.notifyListeners();
      
      console.log('Ride selected:', rideDetails);
      return this.currentBooking;
    } catch (error) {
      console.error('Error selecting ride:', error);
      throw error;
    }
  }

  // Update booking with officer selection
  async selectOfficer(officer) {
    if (!this.currentBooking) {
      throw new Error('No active booking found');
    }

    try {
      this.currentBooking.selectedOfficer = officer;
      this.currentBooking.status = 'officer_selected';
      this.currentBooking.updatedAt = new Date().toISOString();

      await this.saveBookingToStorage();
      this.notifyListeners();
      
      console.log('Officer selected:', officer);
      return this.currentBooking;
    } catch (error) {
      console.error('Error selecting officer:', error);
      throw error;
    }
  }

  // Update booking with payment method
  async setPaymentMethod(paymentMethod) {
    if (!this.currentBooking) {
      throw new Error('No active booking found');
    }

    try {
      this.currentBooking.paymentMethod = paymentMethod;
      this.currentBooking.status = 'payment_ready';
      this.currentBooking.updatedAt = new Date().toISOString();

      await this.saveBookingToStorage();
      this.notifyListeners();
      
      console.log('Payment method set:', paymentMethod);
      return this.currentBooking;
    } catch (error) {
      console.error('Error setting payment method:', error);
      throw error;
    }
  }

  // Complete the booking and process payment
  async confirmBooking() {
    if (!this.currentBooking) {
      throw new Error('No active booking found');
    }

    if (!this.currentBooking.selectedRide || !this.currentBooking.selectedOfficer || !this.currentBooking.paymentMethod) {
      throw new Error('Booking is incomplete. Missing required selections.');
    }

    try {
      this.currentBooking.status = 'processing_payment';
      this.currentBooking.updatedAt = new Date().toISOString();
      this.notifyListeners();

      // Process payment through PaymentService
      const paymentResult = await PaymentService.processPayment({
        amount: this.currentBooking.estimatedPrice,
        paymentMethod: this.currentBooking.paymentMethod,
        bookingId: this.currentBooking.id,
        description: `GQCars ${this.currentBooking.selectedService.name} Service`
      });

      if (paymentResult.success) {
        this.currentBooking.status = 'confirmed';
        this.currentBooking.confirmationDetails = {
          confirmationNumber: this.generateConfirmationNumber(),
          paymentId: paymentResult.paymentId,
          estimatedArrival: this.calculateEstimatedArrival(),
          officerContact: this.getOfficerContact(this.currentBooking.selectedOfficer),
          emergencyNumber: '+44 800 123 4567'
        };
      } else {
        this.currentBooking.status = 'payment_failed';
        this.currentBooking.paymentError = paymentResult.error;
      }

      this.currentBooking.updatedAt = new Date().toISOString();
      await this.saveBookingToStorage();
      
      // Add to booking history if confirmed
      if (this.currentBooking.status === 'confirmed') {
        await this.addToBookingHistory(this.currentBooking);
      }

      this.notifyListeners();
      
      console.log('Booking confirmation result:', this.currentBooking.status);
      return this.currentBooking;
    } catch (error) {
      console.error('Error confirming booking:', error);
      this.currentBooking.status = 'error';
      this.currentBooking.error = error.message;
      this.currentBooking.updatedAt = new Date().toISOString();
      await this.saveBookingToStorage();
      this.notifyListeners();
      throw error;
    }
  }

  // Cancel current booking
  async cancelBooking(reason = 'User cancelled') {
    if (!this.currentBooking) {
      return false;
    }

    try {
      this.currentBooking.status = 'cancelled';
      this.currentBooking.cancellationReason = reason;
      this.currentBooking.updatedAt = new Date().toISOString();

      await this.saveBookingToStorage();
      await this.addToBookingHistory(this.currentBooking);
      
      // Clear current booking
      this.currentBooking = null;
      await AsyncStorage.removeItem('@gqcars:current_booking');
      
      this.notifyListeners();
      
      console.log('Booking cancelled:', reason);
      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Get current booking
  getCurrentBooking() {
    return this.currentBooking;
  }

  // Get booking history
  async getBookingHistory() {
    try {
      const history = await AsyncStorage.getItem('@gqcars:booking_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting booking history:', error);
      return [];
    }
  }

  // Clear current booking (after completion)
  async clearCurrentBooking() {
    try {
      if (this.currentBooking) {
        await this.addToBookingHistory(this.currentBooking);
      }
      
      this.currentBooking = null;
      await AsyncStorage.removeItem('@gqcars:current_booking');
      this.notifyListeners();
      
      console.log('Current booking cleared');
    } catch (error) {
      console.error('Error clearing current booking:', error);
      throw error;
    }
  }

  // Load booking from storage (app restart recovery)
  async loadBookingFromStorage() {
    try {
      const bookingData = await AsyncStorage.getItem('@gqcars:current_booking');
      if (bookingData) {
        this.currentBooking = JSON.parse(bookingData);
        this.notifyListeners();
        console.log('Booking loaded from storage:', this.currentBooking);
        return this.currentBooking;
      }
    } catch (error) {
      console.error('Error loading booking from storage:', error);
    }
    return null;
  }

  // Private helper methods
  async saveBookingToStorage() {
    try {
      await AsyncStorage.setItem('@gqcars:current_booking', JSON.stringify(this.currentBooking));
    } catch (error) {
      console.error('Error saving booking to storage:', error);
    }
  }

  async addToBookingHistory(booking) {
    try {
      const history = await this.getBookingHistory();
      history.unshift(booking); // Add to beginning
      
      // Keep only last 50 bookings
      const trimmedHistory = history.slice(0, 50);
      
      await AsyncStorage.setItem('@gqcars:booking_history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error adding to booking history:', error);
    }
  }

  generateBookingId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `GQ${timestamp}${random}`;
  }

  generateConfirmationNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'GQ';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  calculateEstimatedPrice(service, pickup, destination) {
    // Mock calculation - in real app, this would call a pricing API
    const basePrice = service.basePrice || 6.50;
    const distance = this.calculateDistance(pickup.coords, destination.coords);
    const distancePrice = distance * 1.2; // £1.20 per km
    const total = basePrice + distancePrice;
    return Math.round(total * 100) / 100; // Round to 2 decimal places
  }

  calculateRidePrice(rideDetails, booking) {
    // Adjust price based on ride type
    const multipliers = {
      'Economy': 1.0,
      'Comfort': 1.5,
      'Premium': 2.0
    };
    
    const multiplier = multipliers[rideDetails.name] || 1.0;
    const basePrice = booking.estimatedPrice || 10.00;
    return Math.round(basePrice * multiplier * 100) / 100;
  }

  calculateEstimatedDuration(pickup, destination) {
    // Mock calculation - in real app, this would use routing API
    const distance = this.calculateDistance(pickup.coords, destination.coords);
    const durationMinutes = Math.max(8, Math.round(distance * 3)); // ~3 min per km, minimum 8 min
    return durationMinutes;
  }

  calculateDistance(coord1, coord2) {
    // Haversine formula for calculating distance between two coordinates
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(coord2.latitude - coord1.latitude);
    const dLon = this.deg2rad(coord2.longitude - coord1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1.latitude)) * Math.cos(this.deg2rad(coord2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  calculateEstimatedArrival() {
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + (this.currentBooking.estimatedDuration + 5) * 60000);
    return arrivalTime.toISOString();
  }

  getOfficerContact(officer) {
    // Generate officer contact info (in real app, this would come from officer data)
    return {
      name: officer.name,
      phone: `+44 7${Math.floor(Math.random() * 900000000 + 100000000)}`,
      vehicleInfo: 'Black BMW 5 Series',
      licenseNumber: `GQ${Math.floor(Math.random() * 9000 + 1000)}`
    };
  }

  // Service availability check
  async checkServiceAvailability(location, serviceType) {
    try {
      // Mock availability check - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const availabilityScores = {
        'standard': 0.95,
        'executive': 0.85,
        'xl': 0.75,
        'airport-transfer': 0.90,
        'event-security': 0.70
      };
      
      const score = availabilityScores[serviceType] || 0.80;
      const isAvailable = Math.random() < score;
      
      return {
        available: isAvailable,
        estimatedWaitTime: isAvailable ? Math.floor(Math.random() * 15 + 5) : null, // 5-20 minutes
        nearbyOfficers: isAvailable ? Math.floor(Math.random() * 5 + 2) : 0 // 2-6 officers
      };
    } catch (error) {
      console.error('Error checking service availability:', error);
      return { available: false, error: error.message };
    }
  }

  async startBooking(bookingData) {
    // Helper method for starting a booking flow
    try {
      const distance = this.calculateDistance(
        bookingData.pickupLocation?.coords,
        bookingData.destinationLocation?.coords
      );

      const bookingDetails = {
        pickup: bookingData.pickupLocation,
        destination: bookingData.destinationLocation,
        serviceType: bookingData.selectedService || SERVICE_TYPES.STANDARD,
        distance: distance,
        estimatedDuration: Math.max(10, distance * 2), // Estimate 2 minutes per km
      };

      return await this.createBooking(bookingDetails);
    } catch (error) {
      console.error('Failed to start booking:', error);
      throw error;
    }
  }

  async clearCurrentBooking() {
    this.currentBooking = null;
    await AsyncStorage.removeItem('@gqcars:current_booking');
    this.emit('booking_cleared', null);
  }

  calculateDistance(coord1, coord2) {
    if (!coord1 || !coord2) return 5; // Default distance
    
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

// Export singleton instance
const bookingServiceInstance = new BookingService();
export default bookingServiceInstance;