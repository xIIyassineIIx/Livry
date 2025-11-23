import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Address } from '../models/address';

export interface Coordinates {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  /**
   * Geocode an address to coordinates using OpenStreetMap Nominatim API
   */
  geocodeAddress(address: Address): Observable<Coordinates | null> {
    const query = `${address.street}, ${address.city}, ${address.region}, Tunisia`;
    const url = `${this.nominatimUrl}?q=${encodeURIComponent(query)}&format=json&limit=1`;

    return this.http.get<any[]>(url).pipe(
      map((results) => {
        if (results && results.length > 0) {
          return {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon)
          };
        }
        return null;
      }),
      catchError(() => {
        // Fallback: return approximate coordinates based on region
        return of(this.getRegionCoordinates(address.region));
      })
    );
  }

  /**
   * Get approximate coordinates for a region (fallback)
   */
  private getRegionCoordinates(region: string): Coordinates | null {
    // Approximate coordinates for Tunisian regions
    const regionCoords: { [key: string]: Coordinates } = {
      'TUNIS': { lat: 36.8065, lng: 10.1815 },
      'BEN_AROUS': { lat: 36.7531, lng: 10.2194 },
      'ARIANA': { lat: 36.8665, lng: 10.1647 },
      'MANOUBA': { lat: 36.8080, lng: 10.0972 },
      'SOUSSE': { lat: 35.8254, lng: 10.6369 },
      'SFAX': { lat: 34.7406, lng: 10.7603 }
    };

    return regionCoords[region] || { lat: 36.8065, lng: 10.1815 }; // Default to Tunis
  }

  /**
   * Reverse geocode coordinates to address (optional, for future use)
   */
  reverseGeocode(lat: number, lng: number): Observable<string> {
    const url = `${this.nominatimUrl.replace('/search', '/reverse')}?lat=${lat}&lon=${lng}&format=json`;
    
    return this.http.get<any>(url).pipe(
      map((result) => result.display_name || ''),
      catchError(() => of(''))
    );
  }
}

