import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import bookingService, { BOOKING_STATUS, SERVICE_TYPES } from '../services/BookingService';

// Initial state
const initialState = {
  currentBooking: null,
  bookingHistory: [],
  isLoading: false,
  error: null,
  priceEstimate: null,
  selectedService: null,
  pickupLocation: null,
  destinationLocation: null,
  isInitialized: false
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CURRENT_BOOKING: 'SET_CURRENT_BOOKING',
  SET_BOOKING_HISTORY: 'SET_BOOKING_HISTORY',
  SET_PRICE_ESTIMATE: 'SET_PRICE_ESTIMATE',
  SET_SELECTED_SERVICE: 'SET_SELECTED_SERVICE',
  SET_PICKUP_LOCATION: 'SET_PICKUP_LOCATION',
  SET_DESTINATION_LOCATION: 'SET_DESTINATION_LOCATION',
  UPDATE_BOOKING_STATUS: 'UPDATE_BOOKING_STATUS',
  CLEAR_CURRENT_BOOKING: 'CLEAR_CURRENT_BOOKING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_INITIALIZED: 'SET_INITIALIZED',
  RESET_BOOKING_FORM: 'RESET_BOOKING_FORM'
};

// Reducer function
function bookingReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ActionTypes.SET_CURRENT_BOOKING:
      return {
        ...state,
        currentBooking: action.payload,
        isLoading: false,
        error: null
      };

    case ActionTypes.SET_BOOKING_HISTORY:
      return {
        ...state,
        bookingHistory: action.payload
      };

    case ActionTypes.SET_PRICE_ESTIMATE:
      return {
        ...state,
        priceEstimate: action.payload
      };

    case ActionTypes.SET_SELECTED_SERVICE:
      return {
        ...state,
        selectedService: action.payload
      };

    case ActionTypes.SET_PICKUP_LOCATION:
      return {
        ...state,
        pickupLocation: action.payload
      };

    case ActionTypes.SET_DESTINATION_LOCATION:
      return {
        ...state,
        destinationLocation: action.payload
      };

    case ActionTypes.UPDATE_BOOKING_STATUS:
      if (state.currentBooking && state.currentBooking.id === action.payload.bookingId) {
        return {
          ...state,
          currentBooking: {
            ...state.currentBooking,
            status: action.payload.status,
            updatedAt: new Date().toISOString()
          }
        };
      }
      return state;

    case ActionTypes.CLEAR_CURRENT_BOOKING:
      return {
        ...state,
        currentBooking: null,
        error: null
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ActionTypes.SET_INITIALIZED:
      return {
        ...state,
        isInitialized: action.payload
      };

    case ActionTypes.RESET_BOOKING_FORM:
      return {
        ...state,
        selectedService: null,
        pickupLocation: null,
        destinationLocation: null,
        priceEstimate: null,
        error: null
      };

    default:
      return state;
  }
}

// Create context
const BookingContext = createContext(undefined);

// Custom hook to use booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Booking provider component
export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Initialize booking service
  useEffect(() => {
    const initializeBookingService = async () => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        
        // Initialize booking service
        await bookingService.initialize();
        
        // Load current booking and history
        const currentBooking = bookingService.getCurrentBooking();
        const history = await bookingService.getBookingHistory();
        
        dispatch({ type: ActionTypes.SET_CURRENT_BOOKING, payload: currentBooking });
        dispatch({ type: ActionTypes.SET_BOOKING_HISTORY, payload: history });
        dispatch({ type: ActionTypes.SET_INITIALIZED, payload: true });
        
      } catch (error) {
        console.error('Error initializing booking service:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };

    initializeBookingService();
  }, []);

  // Listen for booking updates from service
  useEffect(() => {
    const unsubscribe = bookingService.addListener((eventType, data) => {
      switch (eventType) {
        case 'booking_created':
        case 'status_updated':
          dispatch({ type: ActionTypes.SET_CURRENT_BOOKING, payload: data });
          break;
        case 'booking_completed':
          dispatch({ type: ActionTypes.CLEAR_CURRENT_BOOKING });
          dispatch({ type: ActionTypes.SET_BOOKING_HISTORY, payload: bookingService.getBookingHistory() });
          break;
        case 'initialized':
          dispatch({ type: ActionTypes.SET_CURRENT_BOOKING, payload: data.currentBooking });
          dispatch({ type: ActionTypes.SET_BOOKING_HISTORY, payload: data.bookingHistory });
          break;
        default:
          break;
      }
    });

    return unsubscribe;
  }, []);

  // Action creators
  const actions = {
    // Set loading state
    setLoading: useCallback((isLoading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
    }, []),

    // Set error
    setError: useCallback((error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    }, []),

    // Clear error
    clearError: useCallback(() => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    }, []),

    // Set pickup location
    setPickupLocation: useCallback((location) => {
      dispatch({ type: ActionTypes.SET_PICKUP_LOCATION, payload: location });
    }, []),

    // Set destination location
    setDestinationLocation: useCallback((location) => {
      dispatch({ type: ActionTypes.SET_DESTINATION_LOCATION, payload: location });
    }, []),

    // Set selected service
    setSelectedService: useCallback((service) => {
      dispatch({ type: ActionTypes.SET_SELECTED_SERVICE, payload: service });
    }, []),

    // Calculate price estimate
    calculatePriceEstimate: useCallback(async (serviceType, pickupLocation, destinationLocation, additionalOptions = {}) => {
      try {
        if (!pickupLocation || !destinationLocation || !serviceType) {
          return null;
        }

        dispatch({ type: ActionTypes.SET_LOADING, payload: true });

        // Calculate distance
        const distance = bookingService.calculateDistance(pickupLocation, destinationLocation);
        
        // Estimate travel time
        const estimatedTime = bookingService.estimateTravelTime(
          distance, 
          additionalOptions.trafficCondition || 'normal'
        );

        // Calculate pricing
        const pricing = bookingService.calculatePrice(
          serviceType,
          distance,
          estimatedTime,
          additionalOptions
        );

        dispatch({ type: ActionTypes.SET_PRICE_ESTIMATE, payload: pricing });
        return pricing;

      } catch (error) {
        console.error('Error calculating price estimate:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        return null;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    }, []),

    // Create new booking
    createBooking: useCallback(async (bookingData) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        dispatch({ type: ActionTypes.CLEAR_ERROR });

        const booking = await bookingService.createBooking(bookingData);
        
        // Update booking history
        const updatedHistory = await bookingService.getBookingHistory();
        dispatch({ type: ActionTypes.SET_BOOKING_HISTORY, payload: updatedHistory });

        return booking;

      } catch (error) {
        console.error('Error creating booking:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    }, []),

    // Update booking status
    updateBookingStatus: useCallback(async (bookingId, newStatus, note = '', additionalData = {}) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        dispatch({ type: ActionTypes.CLEAR_ERROR });

        const updatedBooking = await bookingService.updateBookingStatus(
          bookingId,
          newStatus,
          note,
          additionalData
        );

        // Update booking history
        const updatedHistory = await bookingService.getBookingHistory();
        dispatch({ type: ActionTypes.SET_BOOKING_HISTORY, payload: updatedHistory });

        return updatedBooking;

      } catch (error) {
        console.error('Error updating booking status:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    }, []),

    // Process booking payment
    processPayment: useCallback(async (bookingId, paymentMethodId) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        dispatch({ type: ActionTypes.CLEAR_ERROR });

        const paymentResult = await bookingService.processBookingPayment(bookingId, paymentMethodId);

        // Update booking history
        const updatedHistory = await bookingService.getBookingHistory();
        dispatch({ type: ActionTypes.SET_BOOKING_HISTORY, payload: updatedHistory });

        return paymentResult;

      } catch (error) {
        console.error('Error processing payment:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    }, []),

    // Cancel booking
    cancelBooking: useCallback(async (bookingId, reason = 'User cancelled') => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        dispatch({ type: ActionTypes.CLEAR_ERROR });

        const cancelledBooking = await bookingService.cancelBooking(bookingId, reason);

        // Update booking history
        const updatedHistory = await bookingService.getBookingHistory();
        dispatch({ type: ActionTypes.SET_BOOKING_HISTORY, payload: updatedHistory });

        return cancelledBooking;

      } catch (error) {
        console.error('Error cancelling booking:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    }, []),

    // Clear current booking
    clearCurrentBooking: useCallback(async () => {
      try {
        await bookingService.clearCurrentBooking();
        dispatch({ type: ActionTypes.CLEAR_CURRENT_BOOKING });
      } catch (error) {
        console.error('Error clearing current booking:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      }
    }, []),

    // Reset booking form
    resetBookingForm: useCallback(() => {
      dispatch({ type: ActionTypes.RESET_BOOKING_FORM });
    }, []),

    // Refresh booking history
    refreshBookingHistory: useCallback(async () => {
      try {
        const history = await bookingService.getBookingHistory();
        dispatch({ type: ActionTypes.SET_BOOKING_HISTORY, payload: history });
        return history;
      } catch (error) {
        console.error('Error refreshing booking history:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        return [];
      }
    }, []),

    // Get booking by ID
    getBookingById: useCallback(async (bookingId) => {
      try {
        return await bookingService.getBookingById(bookingId);
      } catch (error) {
        console.error('Error getting booking by ID:', error);
        return null;
      }
    }, []),

    // Validate booking data
    validateBookingData: useCallback((bookingData) => {
      return bookingService.validateBookingData(bookingData);
    }, []),

    // Quick booking creation with current form data
    createQuickBooking: useCallback(async (customerData = {}, additionalOptions = {}) => {
      try {
        if (!state.pickupLocation || !state.destinationLocation || !state.selectedService) {
          throw new Error('Please complete all booking details');
        }

        const bookingData = {
          pickup: state.pickupLocation,
          destination: state.destinationLocation,
          serviceType: state.selectedService,
          customer: customerData,
          additionalOptions,
          trafficCondition: additionalOptions.trafficCondition || 'normal'
        };

        return await actions.createBooking(bookingData);

      } catch (error) {
        console.error('Error creating quick booking:', error);
        throw error;
      }
    }, [state.pickupLocation, state.destinationLocation, state.selectedService])
  };

  // Helper functions
  const helpers = {
    // Check if booking form is complete
    isBookingFormComplete: useCallback(() => {
      return !!(state.pickupLocation && state.destinationLocation && state.selectedService);
    }, [state.pickupLocation, state.destinationLocation, state.selectedService]),

    // Check if booking is in progress
    isBookingInProgress: useCallback(() => {
      return state.currentBooking && 
             [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.DRIVER_ASSIGNED, BOOKING_STATUS.IN_PROGRESS]
             .includes(state.currentBooking.status);
    }, [state.currentBooking]),

    // Get current booking status
    getCurrentBookingStatus: useCallback(() => {
      return state.currentBooking?.status || null;
    }, [state.currentBooking]),

    // Get formatted price estimate
    getFormattedPriceEstimate: useCallback(() => {
      if (!state.priceEstimate) return null;
      
      return {
        ...state.priceEstimate,
        formattedTotal: `£${state.priceEstimate.breakdown.total.toFixed(2)}`,
        formattedBreakdown: {
          baseFare: `£${state.priceEstimate.breakdown.baseFare.toFixed(2)}`,
          distanceCost: `£${state.priceEstimate.breakdown.distanceCost.toFixed(2)}`,
          timeCost: `£${state.priceEstimate.breakdown.timeCost.toFixed(2)}`,
          platformFee: `£${state.priceEstimate.breakdown.platformFee.toFixed(2)}`,
          vat: `£${state.priceEstimate.breakdown.vat.toFixed(2)}`,
          total: `£${state.priceEstimate.breakdown.total.toFixed(2)}`
        }
      };
    }, [state.priceEstimate]),

    // Get available service types
    getAvailableServices: useCallback(() => {
      return Object.values(SERVICE_TYPES);
    }, []),

    // Get service by ID
    getServiceById: useCallback((serviceId) => {
      return SERVICE_TYPES[serviceId.toUpperCase()] || null;
    }, [])
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Helpers
    ...helpers
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;