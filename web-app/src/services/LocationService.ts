// Web version of LocationService
interface Location {
  latitude: number;
  longitude: number;
}

interface LocationWithAddress {
  latitude: number;
  longitude: number;
  address?: string;
}

class LocationService {
  private static instance: LocationService;
  private currentLocation: Location | null = null;

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  public async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.currentLocation = location;
          resolve(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to London for demo
          const fallbackLocation = {
            latitude: 51.5074,
            longitude: -0.1278,
          };
          this.currentLocation = fallbackLocation;
          resolve(fallbackLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  public async watchLocation(
    callback: (location: Location) => void,
    errorCallback?: (error: GeolocationPositionError) => void
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.currentLocation = location;
          callback(location);
        },
        (error) => {
          console.error('Error watching location:', error);
          if (errorCallback) {
            errorCallback(error);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // 1 minute
        }
      );

      resolve(watchId);
    });
  }

  public clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  }

  public getLastKnownLocation(): Location | null {
    return this.currentLocation;
  }

  public async reverseGeocode(location: Location): Promise<string> {
    // Mock reverse geocoding - in real app, this would call a geocoding API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Location near ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
      }, 500);
    });
  }

  public async geocodeAddress(address: string): Promise<LocationWithAddress[]> {
    // Mock geocoding - in real app, this would call a geocoding API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return mock results
        const results: LocationWithAddress[] = [
          {
            latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
            longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
            address: address,
          }
        ];
        resolve(results);
      }, 500);
    });
  }

  public calculateDistance(loc1: Location, loc2: Location): number {
    // Haversine formula for calculating distance between two points
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRadians(loc2.latitude - loc1.latitude);
    const dLon = this.toRadians(loc2.longitude - loc1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(loc1.latitude)) *
        Math.cos(this.toRadians(loc2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export default LocationService.getInstance();