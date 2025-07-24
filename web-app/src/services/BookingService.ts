// Web version of BookingService
interface Location {
  latitude: number;
  longitude: number;
}

interface BookingLocation {
  coords: Location;
  address: string;
}

interface ServiceData {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  color: string;
}

interface BookingData {
  pickupLocation: BookingLocation;
  destinationLocation: BookingLocation;
  selectedService: ServiceData;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

class BookingService {
  private static instance: BookingService;
  private currentBooking: BookingData | null = null;
  private listeners: ((booking: BookingData | null) => void)[] = [];

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  public async startBooking(data: {
    pickupLocation: BookingLocation;
    destinationLocation: BookingLocation;
    selectedService: ServiceData;
  }): Promise<BookingData> {
    const booking: BookingData = {
      ...data,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    this.currentBooking = booking;
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('gqcars_current_booking', JSON.stringify(booking));
    }
    
    // Simulate API call
    console.log('Starting booking:', booking);
    
    // Notify listeners
    this.notifyListeners();
    
    return booking;
  }

  public getCurrentBooking(): BookingData | null {
    if (this.currentBooking) return this.currentBooking;
    
    // Check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gqcars_current_booking');
      if (stored) {
        this.currentBooking = JSON.parse(stored);
        return this.currentBooking;
      }
    }
    
    return null;
  }

  public async updateBookingStatus(status: BookingData['status']): Promise<void> {
    if (this.currentBooking) {
      this.currentBooking.status = status;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('gqcars_current_booking', JSON.stringify(this.currentBooking));
      }
      
      this.notifyListeners();
    }
  }

  public async cancelBooking(): Promise<void> {
    if (this.currentBooking) {
      this.currentBooking.status = 'cancelled';
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gqcars_current_booking');
      }
      
      this.currentBooking = null;
      this.notifyListeners();
    }
  }

  public calculateEstimatedPrice(service: ServiceData, distance: number = 5): number {
    // Mock calculation - in real app, this would call a pricing API
    return service.basePrice + (distance * 1.2);
  }

  public addListener(callback: (booking: BookingData | null) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      callback(this.currentBooking);
    });
  }
}

export default BookingService.getInstance();