import React, { useState } from 'react';
import { SpazaShop, Owner } from '../../types';
import { db } from '../../services/DatabaseService';
import { SOUTH_AFRICAN_LANGUAGES } from '../../services/AITranslationService';

interface RegisterShopProps {
  owner: Owner;
  onShopRegistered: (shop: SpazaShop) => void;
}

export function RegisterShop({ owner, onShopRegistered }: RegisterShopProps) {
  const [step, setStep] = useState<'info' | 'verify' | 'complete'>('info');
  
  // Shop information
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(owner.phoneNumber);
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('20:00');
  const [offersCredit, setOffersCredit] = useState(false);
  const [disabilityFriendly, setDisabilityFriendly] = useState(false);
  const [error, setError] = useState('');

  const provinces = [
    'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
    'Limpopo', 'Free State', 'Mpumalanga', 'North West', 'Northern Cape'
  ];

  const validateOperatingHours = (): boolean => {
    const closing = parseInt(closingTime.replace(':', ''));
    
    // Cannot operate until midnight (00:00)
    if (closing >= 2400 || closingTime === '00:00') {
      setError('South African law prohibits operating until 00:00 (midnight). Please select an earlier closing time.');
      return false;
    }

    const opening = parseInt(openingTime.replace(':', ''));
    if (opening >= closing) {
      setError('Opening time must be before closing time');
      return false;
    }

    return true;
  };

  const handleRegisterShop = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shopName || !location || !address) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateOperatingHours()) {
      return;
    }

    // Verify owner identity with Home Affairs again
    const verification = db.verifyWithHomeAffairs(owner.idNumber, owner.fullName);
    
    if (!verification.verified && verification.message !== 'ID number already registered in the system') {
      setError('Owner identity verification failed: ' + verification.message);
      return;
    }

    setStep('verify');
  };

  const handleConfirmRegistration = () => {
    const shopId = 'SHOP' + Date.now();
    const operatingHours = `${openingTime} - ${closingTime}`;

    const newShop: SpazaShop = {
      shopId,
      shopName,
      ownerName: owner.fullName,
      ownerUsername: owner.username,
      location,
      province,
      address,
      phoneNumber,
      operatingHours,
      openingTime,
      closingTime,
      latitude: getRandomCoordinate(-26, -34), // Simulate coordinates
      longitude: getRandomCoordinate(24, 32),
      isOpen: true,
      offersCredit,
      disabilityFriendly
    };

    db.saveShop(newShop);

    // Update owner's owned shops
    owner.ownedShops.push(shopId);
    db.saveOwner(owner);

    setStep('complete');
    setTimeout(() => {
      onShopRegistered(newShop);
    }, 2000);
  };

  const getRandomCoordinate = (min: number, max: number): number => {
    return min + Math.random() * (max - min);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl mb-6">🛪 Register New Spaza Shop</h2>

      {step === 'info' && (
        <form onSubmit={handleRegisterShop} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              🛏️ Your shop will be registered with SA Home Affairs verification
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Owner: {owner.fullName} (ID: {owner.idNumber})
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">Shop Name *</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Mama Thandi's Spaza"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Province *</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Location/Township *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Soweto"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">Physical Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 123 Main Road"
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

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-sm mb-2 text-yellow-900">⚖️ Legal Operating Hours</h3>
            <p className="text-xs text-yellow-800 mb-3">
              South African law prohibits shops from operating until 00:00 (midnight)
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1 text-gray-700">Opening Time</label>
                <input
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs mb-1 text-gray-700">Closing Time</label>
                <input
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  max="23:59"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-red-600 mt-1">Must close before midnight</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={offersCredit}
                onChange={(e) => setOffersCredit(e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-sm text-gray-700">💳 Offer Credit to Customers</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={disabilityFriendly}
                onChange={(e) => setDisabilityFriendly(e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-sm text-gray-700">♿ Disability-Friendly Shop</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue to Verification
          </button>
        </form>
      )}

      {step === 'verify' && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg mb-4 text-blue-900">📋 Confirm Shop Registration</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Shop Name:</span>
                <span>{shopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span>{location}, {province}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span>{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span>{phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Operating Hours:</span>
                <span>{openingTime} - {closingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Offers Credit:</span>
                <span>{offersCredit ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accessible:</span>
                <span>{disabilityFriendly ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ✓ Owner identity verified with Home Affairs<br />
              ✓ Operating hours comply with SA regulations<br />
              ✓ Shop will be added to national database
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('info')}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Edit
            </button>
            <button
              onClick={handleConfirmRegistration}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              ✅ Confirm & Register
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl mb-4 text-green-700">Shop Registered Successfully!</h3>
          <p className="text-gray-600 mb-6">
            {shopName} has been added to the DevRIFT'S SPAZA SHOP SYSTEM national database
          </p>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 inline-block">
            <p className="text-sm text-green-800">
              ✓ Verified with Home Affairs<br />
              ✓ Listed in {province} province<br />
              ✓ Available to customers nationwide
            </p>
          </div>
        </div>
      )}
    </div>
  );
}




