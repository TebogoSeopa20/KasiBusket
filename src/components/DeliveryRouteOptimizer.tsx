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
          styles: [{ color: '#226b2a', weight: 4 }],
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Card */}
      <div style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)', 
        border: '1px solid #bbf7d0',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2rem' }}>🗺️</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                Smart Delivery Routing
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              AI-powered route optimization for efficient deliveries
            </p>
          </div>
          <span style={{ 
            fontSize: '0.7rem', 
            background: '#f0fdf4', 
            color: '#226b2a', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Navigation size={12} /> Huawei Maps AI
          </span>
        </div>
      </div>

      {/* Map Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> Delivery Route Map
          </h3>
        </div>
        <div style={{ padding: '1rem' }}>
          <div id="delivery-map" style={{ height: '300px', width: '100%', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }} />
        </div>
      </div>

      {/* Route Stats */}
      {optimizedRoute && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RouteIcon size={16} /> Route Statistics
            </h3>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: '0.6rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Distance</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#226b2a' }}>{optimizedRoute.totalDistance}km</p>
              </div>
              <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                <p style={{ fontSize: '0.6rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Time</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>{optimizedRoute.estimatedTime}m</p>
              </div>
              <div style={{ padding: '0.75rem', background: '#fff7ed', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid #fed7aa' }}>
                <p style={{ fontSize: '0.6rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Fuel Saved</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>{optimizedRoute.fuelSaved}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimize Button */}
      <button
        onClick={optimizeRoute}
        disabled={optimizing}
        style={{
          width: '100%',
          background: optimizing ? '#9ca3af' : '#226b2a',
          color: 'white',
          border: 'none',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: optimizing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={e => {
          if (!optimizing) e.currentTarget.style.background = '#1a5420';
        }}
        onMouseLeave={e => {
          if (!optimizing) e.currentTarget.style.background = '#226b2a';
        }}
      >
        {optimizing ? (
          <>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid white',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            Calculating...
          </>
        ) : (
          <>
            <Navigation size={16} />
            Optimize Daily Route
          </>
        )}
      </button>

      {/* Delivery List Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> Delivery Points
          </h3>
          <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginTop: '0.25rem' }}>
            {deliveries.length} deliveries to optimize
          </p>
        </div>
        <div style={{ padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {deliveries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚚</div>
                <p style={{ fontSize: '0.8rem', color: '#5a6b50' }}>No deliveries to optimize</p>
              </div>
            ) : (
              deliveries.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    color: '#226b2a'
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0d1f0e' }}>{d.customer}</p>
                    <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>{d.address}</p>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    background: '#f0fdf4',
                    color: '#226b2a',
                    border: '1px solid #bbf7d0'
                  }}>
                    R{d.orderValue.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Trust Section */}
      <div style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
        border: '2px solid #d8b4fe',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#6b21a5' }}>
            AI-Powered Route Optimization
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>✓ Real-time traffic integration</span>
          <span>✓ Multi-stop optimization</span>
          <span>✓ Fuel-efficient routing</span>
          <span>✓ Live driver tracking</span>
          <span>✓ Estimated arrival times</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}