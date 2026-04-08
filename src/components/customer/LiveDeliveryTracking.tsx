import React, { useState, useEffect, useRef } from 'react';
import { DeliveryDriver } from '../../types';
import { LocationService, Coordinates } from '../../services/LocationService';
import { DeliveryNotifications, NotificationService } from '../../services/NotificationService';
import { DeliveryMapTracker } from '../DeliveryMapTracker';
import { DriverFaceVerification } from '../DriverFaceVerification';

interface LiveDeliveryTrackingProps {
  orderId: string;
  driver: DeliveryDriver;
  shopLocation: Coordinates;
  customerLocation: Coordinates;
  customerAddress: string;
  onDeliveryComplete: () => void;
}

export function LiveDeliveryTracking({
  orderId,
  driver,
  shopLocation,
  customerLocation,
  customerAddress,
  onDeliveryComplete
}: LiveDeliveryTrackingProps) {
  const [driverLocation, setDriverLocation] = useState<Coordinates>(shopLocation);
  const [driverLocationForMap, setDriverLocationForMap] = useState({ lat: shopLocation.lat, lng: shopLocation.lng });
  const [customerLocationForMap, setCustomerLocationForMap] = useState({ lat: customerLocation.lat, lng: customerLocation.lng });
  const [progress, setProgress] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState('Preparing order');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [hasNotifiedNearby, setHasNotifiedNearby] = useState(false);
  const [hasNotifiedArrived, setHasNotifiedArrived] = useState(false);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalDistance = LocationService.calculateDistance(shopLocation, customerLocation);
  const remainingDistance = LocationService.calculateDistance(driverLocation, customerLocation);

  useEffect(() => {
    setDriverLocationForMap({ lat: shopLocation.lat, lng: shopLocation.lng });
    setCustomerLocationForMap({ lat: customerLocation.lat, lng: customerLocation.lng });

    const speedKmPerHour: Record<string, number> = {
      'Walking': 5,
      'Bicycle': 15,
      'Donkey Cart': 10,
      'Motorcycle': 40,
      'Car': 50,
      'Bakkie': 45
    };

    const speed = speedKmPerHour[driver.vehicleType] || 30;
    const timeInHours = totalDistance / speed;
    setEstimatedTime(Math.ceil(timeInHours * 60));

    DeliveryNotifications.notifyDriverAssigned(driver.name, driver.vehicleType);
    startTracking();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTracking = () => {
    let currentProgress = 0;
    const totalSteps = 100;
    const updateInterval = 2000;

    intervalRef.current = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      const newLocation = LocationService.simulateDriverRoute(
        shopLocation,
        customerLocation,
        currentProgress / totalSteps
      );
      setDriverLocation(newLocation);
      setDriverLocationForMap({ lat: newLocation.lat, lng: newLocation.lng });

      updateDeliveryStatus(currentProgress);

      if (currentProgress === 20) {
        DeliveryNotifications.notifyDriverEnRoute(
          driver.name,
          `${remainingDistance.toFixed(1)} km`
        );
      }

      if (currentProgress === 80 && !hasNotifiedNearby) {
        DeliveryNotifications.notifyDriverNearby(driver.name);
        setHasNotifiedNearby(true);
      }

      if (currentProgress === 100 && !hasNotifiedArrived) {
        DeliveryNotifications.notifyDriverArrived(driver.name);
        setHasNotifiedArrived(true);
        
        setTimeout(() => {
          DeliveryNotifications.notifyDeliveryCompleted(orderId);
          onDeliveryComplete();
        }, 3000);
      }

      if (currentProgress >= totalSteps) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, updateInterval);
  };

  const updateDeliveryStatus = (progress: number) => {
    if (progress < 10) {
      setDeliveryStatus('📦 Preparing your order...');
    } else if (progress < 20) {
      setDeliveryStatus('🏪 Driver picking up from shop');
    } else if (progress < 40) {
      setDeliveryStatus('🚚 Driver en route to your location');
    } else if (progress < 70) {
      setDeliveryStatus('📍 Driver is on the way');
    } else if (progress < 90) {
      setDeliveryStatus('⚠️ Driver approaching your area');
    } else if (progress < 100) {
      setDeliveryStatus('🎯 Driver at your doorstep');
    } else {
      setDeliveryStatus('✅ Delivery completed!');
    }
  };

  const getDriverIcon = () => {
    switch (driver.vehicleType) {
      case 'Walking': return '🚶';
      case 'Bicycle': return '🚲';
      case 'Donkey Cart': return '🐴';
      case 'Motorcycle': return '🏍️';
      case 'Car': return '🚗';
      case 'Bakkie': return '🚛';
      default: return '🚚';
    }
  };

  const getProgressColor = () => {
    if (progress < 20) return '#f59e0b';
    if (progress < 50) return '#3b82f6';
    if (progress < 80) return '#8b5cf6';
    return '#226b2a';
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🚚</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
            Live Delivery Tracking
          </h2>
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: '0.7rem', 
            background: '#226b2a', 
            color: 'white', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px' 
          }}>
            Order #{orderId}
          </span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#5a6b50', margin: 0 }}>
          Track your delivery in real-time
        </p>
      </div>

      {/* Driver Info Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#faf5ff' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6b21a5', margin: 0 }}>
            🤖 Your Delivery Driver
          </h3>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              fontSize: '3rem', 
              background: '#e8f5e2', 
              width: '70px', 
              height: '70px', 
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getDriverIcon()}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d1f0e', marginBottom: '0.25rem' }}>
                {driver.name}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#5a6b50', marginBottom: '0.25rem' }}>
                {driver.vehicleType}
              </p>
              {driver.numberPlate !== 'N/A' && (
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Plate: {driver.numberPlate}
                </p>
              )}
            </div>
            <a
              href={`tel:${driver.phoneNumber}`}
              style={{
                background: '#226b2a',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📞 Call Driver
            </a>
          </div>
        </div>
      </div>

      {/* Live Map Tracking */}
      <DeliveryMapTracker
        driverLocation={driverLocationForMap}
        customerLocation={customerLocationForMap}
        driverName={driver.name}
        orderId={orderId}
        isTracking={progress < 100}
        onLocationUpdate={(lat, lng) => {
          setDriverLocationForMap({ lat, lng });
        }}
      />

      {/* Driver Face Verification */}
      {progress > 80 && !showFaceVerification && (
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
          border: '2px solid #d8b4fe',
          borderRadius: '1rem'
        }}>
          <p style={{ fontSize: '0.8rem', color: '#6b21a5', marginBottom: '0.75rem' }}>
            ✅ For added security, driver will verify their identity using face recognition when they arrive.
          </p>
          <button
            onClick={() => setShowFaceVerification(true)}
            style={{
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📍 Enable Face Verification
          </button>
        </div>
      )}

      {showFaceVerification && (
        <DriverFaceVerification
          driverId={driver.name}
          driverName={driver.name}
          isActive={showFaceVerification}
          onVerified={(verified) => {
            if (verified) {
              NotificationService.addNotification(
                'success',
                '✅ Driver Verified',
                'Your driver has been verified. Delivery proceeding safely.'
              );
              setShowFaceVerification(false);
            }
          }}
        />
      )}

      {/* Delivery Progress Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0 }}>
            📍 Delivery Progress
          </h3>
        </div>
        <div style={{ padding: '1.25rem' }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#5a6b50' }}>Progress</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#226b2a' }}>{progress}%</span>
            </div>
            <div style={{
              width: '100%',
              background: '#e5e7eb',
              borderRadius: '9999px',
              height: '10px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${getProgressColor()}, #226b2a)`,
                  borderRadius: '9999px',
                  transition: 'width 0.5s ease-out'
                }}
              />
            </div>
          </div>

          {/* Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            background: '#f0fdf4',
            borderRadius: '0.75rem',
            marginBottom: '1rem',
            border: '1px solid #bbf7d0'
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#166534' }}>{deliveryStatus}</span>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: '#226b2a',
              animation: progress < 100 ? 'pulse 1s infinite' : 'none'
            }} />
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Distance to You</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d1f0e' }}>{remainingDistance.toFixed(1)} km</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Est. Arrival</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d1f0e' }}>{Math.max(0, Math.ceil(estimatedTime * (1 - progress / 100)))} min</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Total Distance</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d1f0e' }}>{totalDistance.toFixed(1)} km</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Vehicle</p>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0d1f0e' }}>{driver.vehicleType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Address Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#eff6ff' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2563eb', margin: 0 }}>
            📍 Delivery Address
          </h3>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0 }}>{customerAddress}</p>
        </div>
      </div>

      {/* Driver Approaching Alert */}
      {progress > 80 && progress < 100 && (
        <div style={{
          padding: '1.25rem',
          background: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
          border: '2px solid #fcd34d',
          borderRadius: '1rem',
          animation: 'pulse 1.5s infinite'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', marginBottom: '0.75rem' }}>
            ⚠️ Driver Approaching!
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#b45309', fontSize: '0.8rem', lineHeight: '1.6' }}>
            <li>✅ Please have your payment ready</li>
            <li>✅ Driver will call when they arrive</li>
            <li>✅ Check your items before driver leaves</li>
          </ul>
        </div>
      )}

      {/* Delivery Complete */}
      {progress === 100 && (
        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #dcfce7, #f0fdf4)',
          border: '2px solid #22c55e',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
            Delivery Complete!
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
            Thank you for shopping with DevRIFT'S SPAZA SHOP SYSTEM!
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}