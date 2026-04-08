import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

interface Location {
  lat: number;
  lng: number;
  name?: string;
}

interface DeliveryMapTrackerProps {
  driverLocation: Location;
  customerLocation: Location;
  driverName: string;
  orderId: string;
  isTracking?: boolean;
  onLocationUpdate?: (lat: number, lng: number) => void;
}

export function DeliveryMapTracker({
  driverLocation,
  customerLocation,
  driverName,
  orderId,
  isTracking = true,
  onLocationUpdate
}: DeliveryMapTrackerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const driverMarker = useRef<L.Marker | null>(null);
  const customerMarker = useRef<L.Marker | null>(null);
  const routingControl = useRef<any>(null);
  const [distance, setDistance] = useState<string>('');

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered between driver and customer
    const centerLat = (driverLocation.lat + customerLocation.lat) / 2;
    const centerLng = (driverLocation.lng + customerLocation.lng) / 2;

    map.current = L.map(mapContainer.current).setView([centerLat, centerLng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map.current);

    // Add driver marker (red)
    driverMarker.current = L.marker([driverLocation.lat, driverLocation.lng], {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
        iconSize: [32, 32],
        popupAnchor: [0, -16]
      })
    })
      .bindPopup(`<b>🚘 ${driverName}</b><br>Delivery Driver`)
      .addTo(map.current);

    // Add customer marker (blue)
    customerMarker.current = L.marker([customerLocation.lat, customerLocation.lng], {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3556/3556098.png',
        iconSize: [32, 32],
        popupAnchor: [0, -16]
      })
    })
      .bindPopup(`<b>📍 Delivery Destination</b><br>Order #${orderId}`)
      .addTo(map.current);

    // Add routing
    routingControl.current = (L as any).Routing.control({
      waypoints: [
        L.latLng(driverLocation.lat, driverLocation.lng),
        L.latLng(customerLocation.lat, customerLocation.lng)
      ],
      routeWhileDragging: false,
      createMarker: () => null, // use our custom markers
      lineOptions: {
        styles: [{ color: '#4CAF50', opacity: 0.8, weight: 5 }]
      }
    })
      .on('routesfound', (e: any) => {
        const route = e.routes[0];
        const distanceInMeters = route.summary.totalDistance;
        const distanceInKm = (distanceInMeters / 1000).toFixed(2);
        setDistance(distanceInKm);
      })
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update driver marker position
  useEffect(() => {
    if (driverMarker.current && isTracking) {
      driverMarker.current.setLatLng([driverLocation.lat, driverLocation.lng]);
      
      // Update routing
      if (routingControl.current && map.current) {
        map.current.removeControl(routingControl.current);
        
        routingControl.current = (L as any).Routing.control({
          waypoints: [
            L.latLng(driverLocation.lat, driverLocation.lng),
            L.latLng(customerLocation.lat, customerLocation.lng)
          ],
          routeWhileDragging: false,
          createMarker: () => null,
          lineOptions: {
            styles: [{ color: '#4CAF50', opacity: 0.8, weight: 5 }]
          }
        })
          .on('routesfound', (e: any) => {
            const route = e.routes[0];
            const distanceInMeters = route.summary.totalDistance;
            const distanceInKm = (distanceInMeters / 1000).toFixed(2);
            setDistance(distanceInKm);
          })
          .addTo(map.current);
      }

      onLocationUpdate?.(driverLocation.lat, driverLocation.lng);
    }
  }, [driverLocation, isTracking, customerLocation, onLocationUpdate]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">🗺️ Live Delivery Tracking</h3>
        <p className="text-sm text-gray-600 mb-4">
          Order #{orderId} • Driver: {driverName} • Distance: {distance} km
        </p>
        <div
          ref={mapContainer}
          className="w-full h-96 rounded-lg border-2 border-green-300"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-l-4 border-green-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              🚘 Driver is on the way
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Estimated arrival: {distance ? `${Math.ceil(parseFloat(distance) / 50)} mins` : 'Calculating...'}
            </p>
          </div>
          <div className="animate-pulse">
            <span className="inline-block w-3 h-3 bg-green-600 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
}




