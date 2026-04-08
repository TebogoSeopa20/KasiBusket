import React, { useState } from 'react';
import { DeliveryDriver } from '../../types';
import { db } from '../../services/DatabaseService';
import { SOUTH_AFRICAN_LANGUAGES } from '../../services/AITranslationService';

interface DeliveryDriverManagementProps {
  shopLocation: string;
  ownerUsername: string;
}

export function DeliveryDriverManagement({ shopLocation, ownerUsername }: DeliveryDriverManagementProps) {
  const [drivers, setDrivers] = useState<DeliveryDriver[]>(db.getDriversByShop(shopLocation));
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form fields
  const [driverName, setDriverName] = useState('');
  const [vehicleType, setVehicleType] = useState<DeliveryDriver['vehicleType']>('Walking');
  const [numberPlate, setNumberPlate] = useState('N/A');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [error, setError] = useState('');

  const vehicleTypes: DeliveryDriver['vehicleType'][] = [
    'Walking', 'Bicycle', 'Donkey Cart', 'Motorcycle', 'Car', 'Bakkie'
  ];

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!driverName || !phoneNumber) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if number plate is required
    if (['Motorcycle', 'Car', 'Bakkie'].includes(vehicleType) && numberPlate === 'N/A') {
      setError('Number plate is required for motorized vehicles');
      return;
    }

    const newDriver: DeliveryDriver = {
      name: driverName,
      vehicleType,
      numberPlate: ['Walking', 'Bicycle', 'Donkey Cart'].includes(vehicleType) ? 'N/A' : numberPlate,
      phoneNumber,
      assignedShop: shopLocation,
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage
    };

    db.saveDriver(newDriver);
    setDrivers(db.getDriversByShop(shopLocation));
    
    // Reset form
    setDriverName('');
    setVehicleType('Walking');
    setNumberPlate('N/A');
    setPhoneNumber('');
    setPreferredLanguage('English');
    setShowAddForm(false);

    alert('✅ Delivery driver added successfully!');
  };

  const handleDeleteDriver = (driverName: string) => {
    if (window.confirm(`Are you sure you want to remove ${driverName} from your delivery team?`)) {
      if (db.deleteDriver(driverName, shopLocation)) {
        setDrivers(db.getDriversByShop(shopLocation));
        alert('✅ Driver removed successfully');
      }
    }
  };

  const toggleDriverAvailability = (driver: DeliveryDriver) => {
    driver.available = !driver.available;
    driver.deliveryStatus = driver.available ? 'Available' : 'Off Duty';
    db.saveDriver(driver);
    setDrivers([...drivers]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">🚚 Delivery Driver Management</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {showAddForm ? '❌ Cancel' : '➕ Add Driver'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddDriver} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg mb-4">Add New Delivery Driver</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Driver Name *</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter driver name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+27 XX XXX XXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">Vehicle Type *</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as DeliveryDriver['vehicleType'])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Number Plate {['Motorcycle', 'Car', 'Bakkie'].includes(vehicleType) && '*'}
                </label>
                <input
                  type="text"
                  value={numberPlate}
                  onChange={(e) => setNumberPlate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={['Walking', 'Bicycle', 'Donkey Cart'].includes(vehicleType) ? 'N/A' : 'e.g., GP 123-456'}
                  disabled={['Walking', 'Bicycle', 'Donkey Cart'].includes(vehicleType)}
                  required={['Motorcycle', 'Car', 'Bakkie'].includes(vehicleType)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1 text-gray-700">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {SOUTH_AFRICAN_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.name}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              ✅ Add Driver
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Driver Name</th>
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="px-4 py-3 text-left">Number Plate</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Language</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No delivery drivers added yet. Click "Add Driver" to get started.
                  </td>
                </tr>
              ) : (
                drivers.map((driver, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{driver.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        {driver.vehicleType === 'Walking' && '🚶'}
                        {driver.vehicleType === 'Bicycle' && '🚲'}
                        {driver.vehicleType === 'Donkey Cart' && '🐴'}
                        {driver.vehicleType === 'Motorcycle' && '🏍️'}
                        {driver.vehicleType === 'Car' && '🚗'}
                        {driver.vehicleType === 'Bakkie' && '🚙'}
                        {driver.vehicleType}
                      </span>
                    </td>
                    <td className="px-4 py-3">{driver.numberPlate}</td>
                    <td className="px-4 py-3">{driver.phoneNumber}</td>
                    <td className="px-4 py-3">{driver.preferredLanguage}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleDriverAvailability(driver)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          driver.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {driver.available ? '🟢 Available' : '🔴 Off Duty'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteDriver(driver.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {drivers.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm mb-2 text-blue-900">📃 Delivery Fleet Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Drivers:</span>
                <span className="ml-2">{drivers.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Available:</span>
                <span className="ml-2 text-green-600">{drivers.filter(d => d.available).length}</span>
              </div>
              <div>
                <span className="text-gray-600">Off Duty:</span>
                <span className="ml-2 text-gray-600">{drivers.filter(d => !d.available).length}</span>
              </div>
              <div>
                <span className="text-gray-600">Vehicle Types:</span>
                <span className="ml-2">{new Set(drivers.map(d => d.vehicleType)).size}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




