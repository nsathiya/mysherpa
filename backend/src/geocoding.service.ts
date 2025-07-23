import { Injectable } from '@nestjs/common';
import * as NodeGeocoder from 'node-geocoder';

@Injectable()
export class GeocodingService {
  private geocoder: NodeGeocoder.Geocoder;

  constructor() {
    this.geocoder = NodeGeocoder({
      provider: 'google',
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    });
  }

  async getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const results = await this.geocoder.geocode(address);
      console.log('results', results);
      if (results && results.length > 0) {
        const result = results[0];
        return {
          lat: result.latitude,
          lng: result.longitude,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  async addCoordinatesToSuggestions(suggestions: any[]): Promise<any[]> {
    const updatedSuggestions: any[] = [];
    
    for (const suggestion of suggestions) {
      let coordinates: { lat: number; lng: number } | null = null;
      
      // Try to get coordinates from the address
      if (suggestion.address) {
        console.log('suggestion.address', suggestion.address);
        coordinates = await this.getCoordinates(suggestion.address);
        console.log('coordinates', coordinates);
      }
      
      // If no coordinates found, try with a more generic location
      if (!coordinates && suggestion.address) {
        const locationParts = suggestion.address.split(',');
        if (locationParts.length > 1) {
          const genericLocation = locationParts[locationParts.length - 1].trim();
          coordinates = await this.getCoordinates(genericLocation);
        }
      }
      
      updatedSuggestions.push({
        ...suggestion,
        lat: coordinates?.lat || 40.7128, // Default to NYC if no coordinates
        lng: coordinates?.lng || -74.0060,
      });
    }
    
    return updatedSuggestions;
  }
} 