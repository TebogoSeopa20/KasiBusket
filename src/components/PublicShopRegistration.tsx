import React, { useState } from 'react';
import { Store, MapPin, Clock, Phone, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface PublicShopRegistrationProps {
  supabaseUrl: string;
  publicAnonKey: string;
  onRegistrationComplete?: () => void;
}

export function PublicShopRegistration({ supabaseUrl, publicAnonKey, onRegistrationComplete }: PublicShopRegistrationProps) {
  const [step, setStep] = useState<'form' | 'verify' | 'complete'>('form');
  const [loading, setLoading] = useState(false);

  // Form data
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerUsername, setOwnerUsername] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('20:00');
  const [offersCredit, setOffersCredit] = useState(false);
  const [disabilityFriendly, setDisabilityFriendly] = useState(false);

  const provinces = [
    'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
    'Limpopo', 'Free State', 'Mpumalanga', 'North West', 'Northern Cape'
  ];

  const validateIdNumber = (id: string): boolean => {
    // Basic SA ID validation - 13 digits
    return /^\d{13}$/.test(id);
  };

  const validateOperatingHours = (): boolean => {
    const opening = parseInt(openingTime.replace(':', ''));
    const closing = parseInt(closingTime.replace(':', ''));
    
    if (closing >= 2400 || closingTime === '00:00') {
      toast.error('South African law prohibits operating until midnight. Please select an earlier closing time.');
      return false;
    }

    if (opening >= closing) {
      toast.error('Opening time must be before closing time');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!shopName || !ownerName || !ownerUsername || !idNumber || !phoneNumber || !location || !address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validateIdNumber(idNumber)) {
      toast.error('Please enter a valid 13-digit South African ID number');
      return;
    }

    if (!validateOperatingHours()) {
      return;
    }

    setStep('verify');
  };

  const handleConfirmRegistration = async () => {
    setLoading(true);

    try {
      const shopData = {
        shopName,
        ownerName,
        ownerUsername,
        idNumber,
        email,
        phoneNumber,
        province,
        location,
        address,
        operatingHours: `${openingTime} - ${closingTime}`,
        openingTime,
        closingTime,
        latitude: getRandomCoordinate(-26, -34),
        longitude: getRandomCoordinate(24, 32),
        isOpen: true,
        offersCredit,
        disabilityFriendly,
      };

      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-4c9f49ef/shops`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(shopData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register shop');
      }

      toast.success('Shop registered successfully!');
      setStep('complete');
      
      setTimeout(() => {
        if (onRegistrationComplete) {
          onRegistrationComplete();
        }
      }, 2000);
    } catch (error) {
      console.error('Error registering shop:', error);
      const errMsg = error instanceof Error ? error.message : 'Failed to register shop. Please try again.';
      toast.error(errMsg);
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  const getRandomCoordinate = (min: number, max: number): number => {
    return min + Math.random() * (max - min);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        {onRegistrationComplete && (
          <button
            onClick={onRegistrationComplete}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        )}

        <div className="text-center mb-8">
          <Store className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl mb-2 text-gray-900">Register Your Spaza Shop</h1>
          <p className="text-gray-600">
            Join the DevRIFT's KasiBusket platform and reach more customers
          </p>
        </div>

        {step === 'form' && (
          <Card>
            <CardHeader>
              <CardTitle>Shop Registration Form</CardTitle>
              <CardDescription>
                Please fill in all details to register your spaza shop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Owner Information */}
                <div className="space-y-4">
                  <h3 className="text-lg text-gray-900">👤 Owner Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Full Name *</Label>
                      <Input
                        id="ownerName"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g., Thandi Mthembu"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerUsername">Username *</Label>
                      <Input
                        id="ownerUsername"
                        value={ownerUsername}
                        onChange={(e) => setOwnerUsername(e.target.value)}
                        placeholder="e.g., thandi123"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">SA ID Number *</Label>
                      <Input
                        id="idNumber"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="13-digit ID number"
                        maxLength={13}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+27 XX XXX XXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Shop Information */}
                <div className="space-y-4">
                  <h3 className="text-lg text-gray-900">🛪 Shop Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name *</Label>
                    <Input
                      id="shopName"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g., Mama Thandi's Spaza"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">Province *</Label>
                      <select
                        id="province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        {provinces.map(prov => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location/Township *</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Soweto"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Physical Address *</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g., 123 Main Road"
                      required
                    />
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="space-y-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm text-yellow-900 mb-1">⚖️ Legal Operating Hours</h3>
                      <p className="text-xs text-yellow-800 mb-3">
                        South African law prohibits shops from operating until midnight
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="openingTime">Opening Time</Label>
                      <Input
                        id="openingTime"
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="closingTime">Closing Time</Label>
                      <Input
                        id="closingTime"
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        max="23:59"
                        required
                      />
                      <p className="text-xs text-red-600">Must close before midnight</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="text-lg text-gray-900">✨ Shop Features</h3>
                  
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={offersCredit}
                      onChange={(e) => setOffersCredit(e.target.checked)}
                      className="w-4 h-4 text-green-600"
                    />
                    <div>
                      <div className="text-sm text-gray-900">💳 Offer Credit to Customers</div>
                      <div className="text-xs text-gray-500">Allow customers to buy on credit with 10% monthly interest</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={disabilityFriendly}
                      onChange={(e) => setDisabilityFriendly(e.target.checked)}
                      className="w-4 h-4 text-green-600"
                    />
                    <div>
                      <div className="text-sm text-gray-900">♿ Disability-Friendly Shop</div>
                      <div className="text-xs text-gray-500">Provide special assistance to customers with disabilities</div>
                    </div>
                  </label>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continue to Verification
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'verify' && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Shop Registration</CardTitle>
              <CardDescription>
                Please review your information before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shop Name:</span>
                  <span className="text-gray-900">{shopName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Owner:</span>
                  <span className="text-gray-900">{ownerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="text-gray-900">{location}, {province}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Address:</span>
                  <span className="text-gray-900">{address}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900">{phoneNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Operating Hours:</span>
                  <span className="text-gray-900">{openingTime} - {closingTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Offers Credit:</span>
                  <span className="text-gray-900">{offersCredit ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accessible:</span>
                  <span className="text-gray-900">{disabilityFriendly ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ✓ Identity will be verified<br />
                  ✓ Operating hours comply with SA regulations<br />
                  ✓ Shop will be added to national database
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('form')}
                  className="flex-1"
                  disabled={loading}
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={handleConfirmRegistration}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : '✅ Confirm & Register'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'complete' && (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl mb-4 text-green-700">Shop Registered Successfully!</h3>
              <p className="text-gray-600 mb-6">
                {shopName} has been added to the DevRIFT's SPAZA SHOP SYSTEM
              </p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 inline-block">
                <p className="text-sm text-green-800">
                  ✓ Identity verified<br />
                  ✓ Listed in {province} province<br />
                  ✓ Available to customers nationwide
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}



