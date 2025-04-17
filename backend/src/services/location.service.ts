import axios from 'axios';
import { logger } from '../utils/logger';

class LocationService {
  private googleMapsApiKey: string;

  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';
  }

  async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.googleMapsApiKey}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }

      logger.warn('No address found for coordinates:', { latitude, longitude });
      return '';
    } catch (error) {
      logger.error('Geocoding failed:', error);
      throw error;
    }
  }

  async getCoordinatesFromAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.googleMapsApiKey}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
        };
      }

      logger.warn('No coordinates found for address:', address);
      return null;
    } catch (error) {
      logger.error('Reverse geocoding failed:', error);
      throw error;
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const locationService = new LocationService(); 