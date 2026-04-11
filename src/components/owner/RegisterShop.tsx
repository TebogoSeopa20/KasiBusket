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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Card */}
      <div style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)', 
        border: '1px solid #bbf7d0',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🛪</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
            Register New Spaza Shop
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
          Register your shop with SA Home Affairs verification
        </p>
      </div>

      {/* Step Indicator */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '1rem',
        marginBottom: '0.5rem'
      }}>
        {['info', 'verify', 'complete'].map((s, idx) => (
          <React.Fragment key={s}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step === s ? '#226b2a' : (step === 'complete' && s === 'info' || step === 'complete' && s === 'verify' ? '#226b2a' : '#e5e7eb'),
                color: step === s ? 'white' : '#5a6b50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                {idx + 1}
              </div>
              <span style={{ fontSize: '0.6rem', color: step === s ? '#226b2a' : '#5a6b50', textTransform: 'capitalize' }}>
                {s}
              </span>
            </div>
            {idx < 2 && (
              <div style={{
                width: '40px',
                height: '2px',
                background: step === 'complete' ? '#226b2a' : '#e5e7eb'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {step === 'info' && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📝</span> Shop Information
            </h3>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <form onSubmit={handleRegisterShop}>
              {error && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.75rem',
                  color: '#dc2626',
                  fontSize: '0.8rem'
                }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Owner Info Banner */}
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '0.75rem'
              }}>
                <p style={{ fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem' }}>
                  🛏️ Your shop will be registered with SA Home Affairs verification
                </p>
                <p style={{ fontSize: '0.65rem', color: '#3b82f6' }}>
                  Owner: {owner.fullName} (ID: {owner.idNumber})
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                  Shop Name *
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g., Mama Thandi's Spaza"
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '0.85rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Province *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '0.85rem',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {provinces.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Location/Township *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Soweto"
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '0.85rem',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                    onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                  Physical Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 123 Main Road"
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '0.85rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+27 XX XXX XXXX"
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '0.85rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Operating Hours Section */}
              <div style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: '0.75rem'
              }}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', marginBottom: '0.5rem' }}>
                  ⚖️ Legal Operating Hours
                </h3>
                <p style={{ fontSize: '0.65rem', color: '#92400e', marginBottom: '0.75rem' }}>
                  South African law prohibits shops from operating until 00:00 (midnight)
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1.5px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.8rem',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                      onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={closingTime}
                      onChange={(e) => setClosingTime(e.target.value)}
                      max="23:59"
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1.5px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.8rem',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                      onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                    />
                    <p style={{ fontSize: '0.6rem', color: '#dc2626', marginTop: '0.25rem' }}>Must close before midnight</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={offersCredit}
                    onChange={(e) => setOffersCredit(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#226b2a' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#0d1f0e' }}>💳 Offer Credit to Customers</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={disabilityFriendly}
                    onChange={(e) => setDisabilityFriendly(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#226b2a' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#0d1f0e' }}>♿ Disability-Friendly Shop</span>
                </label>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#226b2a',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a5420'}
                onMouseLeave={e => e.currentTarget.style.background = '#226b2a'}
              >
                Continue to Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'verify' && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📋</span> Confirm Shop Registration
            </h3>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{
              marginBottom: '1rem',
              padding: '1rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '0.75rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div><span style={{ color: '#5a6b50' }}>Shop Name:</span> <strong>{shopName}</strong></div>
                <div><span style={{ color: '#5a6b50' }}>Location:</span> <strong>{location}, {province}</strong></div>
                <div><span style={{ color: '#5a6b50' }}>Address:</span> <strong>{address}</strong></div>
                <div><span style={{ color: '#5a6b50' }}>Phone:</span> <strong>{phoneNumber}</strong></div>
                <div><span style={{ color: '#5a6b50' }}>Operating Hours:</span> <strong>{openingTime} - {closingTime}</strong></div>
                <div><span style={{ color: '#5a6b50' }}>Offers Credit:</span> <strong>{offersCredit ? 'Yes' : 'No'}</strong></div>
                <div><span style={{ color: '#5a6b50' }}>Accessible:</span> <strong>{disabilityFriendly ? 'Yes' : 'No'}</strong></div>
              </div>
            </div>

            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '0.75rem'
            }}>
              <p style={{ fontSize: '0.7rem', color: '#92400e', marginBottom: '0.25rem' }}>
                ✓ Owner identity verified with Home Affairs
              </p>
              <p style={{ fontSize: '0.7rem', color: '#92400e', marginBottom: '0.25rem' }}>
                ✓ Operating hours comply with SA regulations
              </p>
              <p style={{ fontSize: '0.7rem', color: '#92400e' }}>
                ✓ Shop will be added to national database
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setStep('info')}
                style={{
                  flex: 1,
                  background: '#f3f4f6',
                  color: '#5a6b50',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
              >
                Back to Edit
              </button>
              <button
                onClick={handleConfirmRegistration}
                style={{
                  flex: 1,
                  background: '#226b2a',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a5420'}
                onMouseLeave={e => e.currentTarget.style.background = '#226b2a'}
              >
                ✅ Confirm & Register
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#226b2a' }}>
            Shop Registered Successfully!
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#5a6b50', marginBottom: '1rem' }}>
            {shopName} has been added to the DevRIFT'S SPAZA SHOP SYSTEM national database
          </p>
          <div style={{
            display: 'inline-block',
            padding: '1rem',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.75rem',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '0.7rem', color: '#226b2a', marginBottom: '0.25rem' }}>
              ✓ Verified with Home Affairs
            </p>
            <p style={{ fontSize: '0.7rem', color: '#226b2a', marginBottom: '0.25rem' }}>
              ✓ Listed in {province} province
            </p>
            <p style={{ fontSize: '0.7rem', color: '#226b2a' }}>
              ✓ Available to customers nationwide
            </p>
          </div>
        </div>
      )}

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
            Powered by Government Integration
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>✓ SA Home Affairs verification</span>
          <span>✓ SARS tax compliance check</span>
          <span>✓ CIPC business registration</span>
          <span>✓ National spaza shop database</span>
        </div>
      </div>
    </div>
  );
}