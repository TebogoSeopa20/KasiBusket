import React, { useState } from 'react';
import { DeliveryMethod } from '../../types';

interface DeliveryMethodSelectorProps {
  onSelectMethod: (method: DeliveryMethod) => void;
  distance: number; // in km
}

export function DeliveryMethodSelector({ onSelectMethod, distance }: DeliveryMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const deliveryMethods: DeliveryMethod[] = [
    {
      type: 'Walking',
      name: 'Walking Delivery',
      icon: '🚶',
      estimatedTime: `${Math.ceil(distance * 12)} - ${Math.ceil(distance * 15)} min`,
      cost: 0,
      description: 'Free delivery by foot, best for nearby locations (< 2km)'
    },
    {
      type: 'Bicycle',
      name: 'Bicycle Delivery',
      icon: '🚲',
      estimatedTime: `${Math.ceil(distance * 5)} - ${Math.ceil(distance * 8)} min`,
      cost: 5,
      description: 'Fast eco-friendly delivery by bicycle'
    },
    {
      type: 'Donkey Cart',
      name: 'Donkey Cart',
      icon: '🐴',
      estimatedTime: `${Math.ceil(distance * 10)} - ${Math.ceil(distance * 15)} min`,
      cost: 10,
      description: 'Traditional transport, large capacity for bulk orders'
    },
    {
      type: 'Motorcycle',
      name: 'Motorcycle',
      icon: '🏍️',
      estimatedTime: `${Math.ceil(distance * 2)} - ${Math.ceil(distance * 4)} min`,
      cost: 15,
      description: 'Fastest delivery for urgent orders'
    },
    {
      type: 'Car',
      name: 'Car Delivery',
      icon: '🚗',
      estimatedTime: `${Math.ceil(distance * 3)} - ${Math.ceil(distance * 5)} min`,
      cost: 20,
      description: 'Comfortable delivery, protected from weather'
    },
    {
      type: 'Bakkie',
      name: 'Bakkie (Pickup Truck)',
      icon: '🛻',
      estimatedTime: `${Math.ceil(distance * 3)} - ${Math.ceil(distance * 6)} min`,
      cost: 25,
      description: 'Best for very large orders and furniture delivery'
    }
  ];

  const handleSelect = (method: DeliveryMethod) => {
    setSelectedMethod(method.type);
    onSelectMethod(method);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg mb-2">🚚 Choose Your Delivery Method</h3>
        <p className="text-sm text-gray-600 mb-4">
          Distance to your location: ~{distance.toFixed(1)} km
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliveryMethods.map((method) => {
          const isDisabled = distance > 5 && method.type === 'Walking';
          
          return (
            <button
              key={method.type}
              onClick={() => !isDisabled && handleSelect(method)}
              disabled={isDisabled}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedMethod === method.type
                  ? 'border-green-600 bg-green-50'
                  : isDisabled
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-3xl mb-2 block">{method.icon}</span>
                  <h4 className="text-sm">{method.name}</h4>
                </div>
                {method.cost > 0 ? (
                  <span className="text-green-700 text-sm">+R {method.cost}</span>
                ) : (
                  <span className="text-green-700 text-sm">FREE</span>
                )}
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>⏱️ {method.estimatedTime}</p>
                <p className="text-xs">{method.description}</p>
                {isDisabled && (
                  <p className="text-red-500 mt-2">❌ Too far for this method</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="text-sm mb-2">🌐 Traditional & Modern Transport Options</h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• All delivery personnel are verified and insured</li>
          <li>• Track your delivery in real-time on the map</li>
          <li>• Driver will call you before arrival</li>
          <li>• Donkey carts are perfect for eco-friendly rural deliveries</li>
          <li>• Choose the method that best suits your needs and budget</li>
        </ul>
      </div>
    </div>
  );
}




