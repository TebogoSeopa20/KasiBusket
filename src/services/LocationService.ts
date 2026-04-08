// DevRIFT'S SPAZA SHOP SYSTEM - Location & Distance Service

export interface Coordinates {
  lat: number;
  lng: number;
}

export class LocationService {
  // Calculate distance between two coordinates using Haversine formula
  static calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(coord2.lat - coord1.lat);
    const dLng = this.toRad(coord2.lng - coord1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.lat)) * Math.cos(this.toRad(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return parseFloat(distance.toFixed(2));
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Calculate delivery fee based on distance
  static calculateDeliveryFee(distance: number, vehicleType: string): number {
    if (distance <= 10) {
      return 0; // Free delivery within 10km
    }

    const baseCharge = 10; // R10 base charge for distances over 10km
    const perKmCharge = 2; // R2 per km over 10km
    const excessDistance = distance - 10;
    
    let fee = baseCharge + (excessDistance * perKmCharge);

    // Vehicle-specific multipliers
    const vehicleMultipliers: Record<string, number> = {
      'Walking': 0.5,
      'Bicycle': 0.7,
      'Donkey Cart': 0.8,
      'Motorcycle': 1.0,
      'Car': 1.2,
      'Bakkie': 1.5
    };

    const multiplier = vehicleMultipliers[vehicleType] || 1.0;
    fee = fee * multiplier;

    return parseFloat(fee.toFixed(2));
  }

  // Geocode address (simulated - in production use Google Maps Geocoding API)
  static geocodeAddress(address: string, province: string): Coordinates {
    // Simulated coordinates for different provinces
    const provinceCoordinates: Record<string, Coordinates> = {
      'Gauteng': { lat: -26.2041, lng: 28.0473 },
      'Western Cape': { lat: -33.9249, lng: 18.4241 },
      'KwaZulu-Natal': { lat: -29.8587, lng: 31.0218 },
      'Eastern Cape': { lat: -32.2968, lng: 26.4194 },
      'Limpopo': { lat: -23.9016, lng: 29.4481 },
      'Free State': { lat: -29.0852, lng: 26.1596 },
      'Mpumalanga': { lat: -25.5653, lng: 30.5279 },
      'North West': { lat: -26.6737, lng: 25.5685 },
      'Northern Cape': { lat: -28.7282, lng: 24.7499 }
    };

    const baseCoord = provinceCoordinates[province] || provinceCoordinates['Gauteng'];
    
    // Add some randomness to simulate different addresses
    return {
      lat: baseCoord.lat + (Math.random() - 0.5) * 0.1,
      lng: baseCoord.lng + (Math.random() - 0.5) * 0.1
    };
  }

  // Simulate driver movement along route
  static simulateDriverRoute(start: Coordinates, end: Coordinates, progress: number): Coordinates {
    // Linear interpolation between start and end
    return {
      lat: start.lat + (end.lat - start.lat) * progress,
      lng: start.lng + (end.lng - start.lng) * progress
    };
  }
}




