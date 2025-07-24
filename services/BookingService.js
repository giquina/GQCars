/**
 * BookingService - Manages the complete booking flow state and logic
 * Handles booking data persistence, state transitions, and flow coordination
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationService from './LocationService';
import paymentService from './PaymentService';
import NotificationService from './NotificationService';

// Booking status constants
export const BOOKING_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  DRIVER_ASSIGNED: 'driver_assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Service type constants
export const SERVICE_TYPES = {
  STANDARD: 'standard',
  EXECUTIVE: 'executive',
  XL: 'xl',
  AIRPORT: 'airport',
  EVENT: 'event',
};

// Pricing structure
const SERVICE_PRICING = {
  [SERVICE_TYPES.STANDARD]: { baseFare: 5.00, perMile: 2.50, perMinute: 0.30 },
  [SERVICE_TYPES.EXECUTIVE]: { baseFare: 10.00, perMile: 4.00, perMinute: 0.50 },
  [SERVICE_TYPES.XL]: { baseFare: 7.50, perMile: 3.00, perMinute: 0.40 },
  [SERVICE_TYPES.AIRPORT]: { baseFare: 15.00, perMile: 3.50, perMinute: 0.45 },
  [SERVICE_TYPES.EVENT]: { baseFare: 20.00, perMile: 5.00, perMinute: 0.60 },
};

class BookingService {
  constructor() {
    this.currentBooking = null;
    this.bookingHistory = [];
    this.listeners = [];
    this.locationService = LocationService.getInstance();
    this.paymentService = paymentService;
  }


  // Event system for React Native
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  emit(eventType, data) {
    this.listeners.forEach(listener => listener(eventType, data));
  }

  async initialize() {
    try {
      // Load booking history from storage
      const storedHistory = await AsyncStorage.getItem('@gqcars:booking_history');
      if (storedHistory) {
        this.bookingHistory = JSON.parse(storedHistory);
      }

      // Load current booking if exists
      const currentBooking = await AsyncStorage.getItem('@gqcars:current_booking');
      if (currentBooking) {
        this.currentBooking = JSON.parse(currentBooking);
      }

      this.emit('initialized', { bookingHistory: this.bookingHistory, currentBooking: this.currentBooking });
    } catch (error) {
      console.error('Failed to initialize BookingService:', error);
    }
  }

  generateBookingId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `GQ${timestamp}${random}`;
  }

  async createBooking(bookingData) {
    try {
      const bookingId = this.generateBookingId();
      
      const booking = {
        id: bookingId,
        status: BOOKING_STATUS.DRAFT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pickup: bookingData.pickup,
        destination: bookingData.destination,
        serviceType: bookingData.serviceType || SERVICE_TYPES.STANDARD,
        scheduledTime: bookingData.scheduledTime || 'now',
        passengerCount: bookingData.passengerCount || 1,
        specialRequests: bookingData.specialRequests || '',
        estimatedDuration: bookingData.estimatedDuration || 15,
        distance: bookingData.distance || 0,
        priceEstimate: null,
        driver: null,
        payment: null,
      };

      // Calculate price estimate
      booking.priceEstimate = this.calculatePrice(
        booking.serviceType,
        booking.distance,
        booking.estimatedDuration
      );

      this.currentBooking = booking;
      await this.saveCurrentBooking();
      
      this.emit('booking_created', booking);
      return booking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  }

  calculatePrice(serviceType, distance, duration) {
    const pricing = SERVICE_PRICING[serviceType] || SERVICE_PRICING[SERVICE_TYPES.STANDARD];
    
    const baseFare = pricing.baseFare;
    const distanceFare = distance * pricing.perMile;
    const timeFare = duration * pricing.perMinute;
    const subtotal = baseFare + distanceFare + timeFare;
    
    // Add service fee (10%) and VAT (20%)
    const serviceFee = subtotal * 0.10;
    const vat = (subtotal + serviceFee) * 0.20;
    const total = subtotal + serviceFee + vat;

    return {
      baseFare: parseFloat(baseFare.toFixed(2)),
      distanceFare: parseFloat(distanceFare.toFixed(2)),
      timeFare: parseFloat(timeFare.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      serviceFee: parseFloat(serviceFee.toFixed(2)),
      vat: parseFloat(vat.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  }

  async updateBookingStatus(status, additionalData = {}) {
    if (!this.currentBooking) {
      throw new Error('No current booking to update');
    }

    this.currentBooking = {
      ...this.currentBooking,
      status,
      updatedAt: new Date().toISOString(),
      ...additionalData,
    };

    await this.saveCurrentBooking();
    this.emit('status_updated', this.currentBooking);

    // Send notification for status changes
    if (status === BOOKING_STATUS.DRIVER_ASSIGNED) {
      await NotificationService.sendDriverAssignedNotification(this.currentBooking);
    }

    return this.currentBooking;
  }

  async confirmBooking(paymentData) {
    try {
      if (!this.currentBooking) {
        throw new Error('No booking to confirm');
      }

      // Process payment
      const paymentResult = await this.paymentService.processPayment({
        amount: this.currentBooking.priceEstimate.total,
        currency: 'GBP',
        paymentMethod: paymentData.paymentMethod,
        bookingId: this.currentBooking.id,
      });

      // Update booking with payment info
      await this.updateBookingStatus(BOOKING_STATUS.CONFIRMED, {
        payment: paymentResult,
        confirmedAt: new Date().toISOString(),
      });

      // Simulate driver assignment after 3 seconds
      setTimeout(async () => {
        await this.assignDriver();
      }, 3000);

      return this.currentBooking;
    } catch (error) {
      console.error('Failed to confirm booking:', error);
      throw error;
    }
  }

  async assignDriver() {
    const mockDriver = {
      id: 'driver_001',
      name: 'Marcus Steel',
      rating: 4.9,
      vehicle: {
        make: 'BMW',
        model: '5 Series',
        color: 'Black',
        licensePlate: 'GQ123',
      },
      location: {
        latitude: 51.5074,
        longitude: -0.1278,
      },
      eta: 8, // minutes
    };

    await this.updateBookingStatus(BOOKING_STATUS.DRIVER_ASSIGNED, {
      driver: mockDriver,
      driverAssignedAt: new Date().toISOString(),
    });

    return mockDriver;
  }

  async cancelBooking(reason = 'User cancelled') {
    if (!this.currentBooking) {
      throw new Error('No booking to cancel');
    }

    await this.updateBookingStatus(BOOKING_STATUS.CANCELLED, {
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason,
    });

    // Move to history
    await this.completeBooking();
    return this.currentBooking;
  }

  async completeBooking() {
    if (!this.currentBooking) {
      return;
    }

    // Add to booking history
    this.bookingHistory.unshift(this.currentBooking);
    await this.saveBookingHistory();

    // Clear current booking
    this.currentBooking = null;
    await AsyncStorage.removeItem('@gqcars:current_booking');

    this.emit('booking_completed', this.bookingHistory[0]);
  }

  async saveCurrentBooking() {
    if (this.currentBooking) {
      await AsyncStorage.setItem('@gqcars:current_booking', JSON.stringify(this.currentBooking));
    }
  }

  async saveBookingHistory() {
    await AsyncStorage.setItem('@gqcars:booking_history', JSON.stringify(this.bookingHistory));
  }

  getCurrentBooking() {
    return this.currentBooking;
  }

  getBookingHistory() {
    return this.bookingHistory;
  }

  isBookingInProgress() {
    return this.currentBooking && 
           this.currentBooking.status !== BOOKING_STATUS.COMPLETED &&
           this.currentBooking.status !== BOOKING_STATUS.CANCELLED;
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