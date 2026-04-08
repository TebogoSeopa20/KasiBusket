import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Order, SpazaShop } from '../types';
import {
  MapPin,
  Navigation,
  Clock,
  Fuel,
  TrendingDown,
  CheckCircle,
  Route as RouteIcon
} from 'lucide-react';
import { huaweiCloud } from '../services/HuaweiCloudService';
import { toast } from 'sonner';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

interface DeliveryPoint {
  address: string;
  customer: string;
  lat: number;
  lng: number;
  priority: number;
  orderValue: number;
}

interface DeliveryRouteOptimizerProps {
  orders: Order[];
  shop: SpazaShop;
}

export function DeliveryRouteOptimizer({ orders, shop }: DeliveryRouteOptimizerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);
  
  // Filter orders for this shop
  const shopOrders = orders.filter(order => 
    order.items.some(item => 
      'shopOwner' in item.product && item.product.shopOwner === shop.ownerUsername
    )
  );

  const deliveries: DeliveryPoint[] = shopOrders.map((order, index) => ({
    address: order.deliveryAddress,
    customer: order.deliveryAddress.split(',')[0], // Use start of address as name if we don't have user name in order
    lat: shop.latitude + (Math.random() - 0.5) * 0.05, // Randomly place around shop for demo if no real lat/lng in order
    lng: shop.longitude + (Math.random() - 0.5) * 0.05,
    priority: index + 1,
    orderValue: order.total
  }));
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('delivery-map').setView([shop.latitude, shop.longitude], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const optimizeRoute = async () => {
    setOptimizing(true);
    toast.info('🗺️ Optimizing delivery route with AI...');

    try {
      const startPoint = { lat: shop.latitude, lng: shop.longitude };
      const waypoints = deliveries.map(d => L.latLng(d.lat, d.lng));

      if (routingControlRef.current && mapRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
      }

      // @ts-ignore - Leaflet Routing Machine is added to L namespace
      routingControlRef.current = L.Routing.control({
        waypoints: [L.latLng(startPoint.lat, startPoint.lng), ...waypoints],
        lineOptions: {
          styles: [{ color: '#16a34a', weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 10
        },
        show: false,
        addWaypoints: false
      }).addTo(mapRef.current!);

      // Mocking the AI response based on routing machine
      setOptimizedRoute({
        totalDistance: (Math.random() * 20 + 5).toFixed(1),
        estimatedTime: (Math.random() * 60 + 30).toFixed(0),
        fuelSaved: (Math.random() * 2 + 0.5).toFixed(1) + 'L',
        optimizedRoute: deliveries.map((d, i) => ({ ...d, order: i + 1 }))
      });

      toast.success('✅ Route optimized!');
    } catch (error) {
      toast.error('Failed to optimize route');
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-green-600" />
            <CardTitle>Smart Delivery Routing</CardTitle>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700">Huawei Maps AI</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div id="delivery-map" className="h-[300px] w-full rounded-lg border-2 border-gray-100 shadow-inner z-0" />
        
        {optimizedRoute && (
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-green-50 rounded text-center border border-green-100">
              <p className="text-lg font-bold text-green-700">{optimizedRoute.totalDistance}km</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Distance</p>
            </div>
            <div className="p-2 bg-blue-50 rounded text-center border border-blue-100">
              <p className="text-lg font-bold text-blue-700">{optimizedRoute.estimatedTime}m</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Time</p>
            </div>
            <div className="p-2 bg-orange-50 rounded text-center border border-orange-100">
              <p className="text-lg font-bold text-orange-700">{optimizedRoute.fuelSaved}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Fuel Saved</p>
            </div>
          </div>
        )}

        <Button onClick={optimizeRoute} disabled={optimizing} className="w-full bg-green-600 hover:bg-green-700">
          {optimizing ? 'Calculating...' : 'Optimize Daily Route'}
        </Button>

        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {deliveries.map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border text-sm">
              <div className="w-6 h-6 rounded-full bg-white border flex items-center justify-center font-bold text-green-600">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{d.customer}</p>
                <p className="text-xs text-gray-500">{d.address}</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">R{d.orderValue.toFixed(2)}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}




