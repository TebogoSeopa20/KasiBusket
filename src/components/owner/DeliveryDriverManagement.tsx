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

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Walking': return '🚶';
      case 'Bicycle': return '🚲';
      case 'Donkey Cart': return '🐴';
      case 'Motorcycle': return '🏍️';
      case 'Car': return '🚗';
      case 'Bakkie': return '🚛';
      default: return '🚚';
    }
  };

  const availableCount = drivers.filter(d => d.available).length;
  const offDutyCount = drivers.filter(d => !d.available).length;

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
              <span style={{ fontSize: '2rem' }}>🚚</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                Delivery Driver Management
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              Manage your delivery team • {drivers.length} drivers total
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              background: showAddForm ? '#ef4444' : '#226b2a',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={e => e.currentTarget.style.background = showAddForm ? '#dc2626' : '#1a5420'}
            onMouseLeave={e => e.currentTarget.style.background = showAddForm ? '#ef4444' : '#226b2a'}
          >
            {showAddForm ? '❌ Cancel' : '➕ Add Driver'}
          </button>
        </div>
      </div>

      {/* Add Driver Form */}
      {showAddForm && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>➕</span> Add New Delivery Driver
            </h3>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <form onSubmit={handleAddDriver}>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Enter driver name"
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

                <div>
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Vehicle Type *
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as DeliveryDriver['vehicleType'])}
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
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Number Plate {['Motorcycle', 'Car', 'Bakkie'].includes(vehicleType) && '*'}
                  </label>
                  <input
                    type="text"
                    value={numberPlate}
                    onChange={(e) => setNumberPlate(e.target.value)}
                    placeholder={['Walking', 'Bicycle', 'Donkey Cart'].includes(vehicleType) ? 'N/A' : 'e.g., GP 123-456'}
                    disabled={['Walking', 'Bicycle', 'Donkey Cart'].includes(vehicleType)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '0.85rem',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: ['Walking', 'Bicycle', 'Donkey Cart'].includes(vehicleType) ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Preferred Language
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
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
                style={{
                  width: '100%',
                  background: '#226b2a',
                  color: 'white',
                  border: 'none',
                  padding: '0.7rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a5420'}
                onMouseLeave={e => e.currentTarget.style.background = '#226b2a'}
              >
                ✅ Add Driver
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Drivers Table Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👥</span> Your Delivery Team
          </h3>
        </div>
        <div style={{ padding: '1rem' }}>
          {drivers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚚</div>
              <p style={{ fontSize: '0.85rem', color: '#5a6b50' }}>No delivery drivers added yet. Click "Add Driver" to get started.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Driver Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Vehicle</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Number Plate</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Phone</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Language</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', color: '#226b2a', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', color: '#226b2a', fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                  {drivers.map((driver, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: '#0d1f0e' }}>{driver.name}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>{getVehicleIcon(driver.vehicleType)}</span>
                          <span>{driver.vehicleType}</span>
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#5a6b50' }}>
                        <code style={{ fontSize: '0.7rem', background: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>
                          {driver.numberPlate}
                        </code>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#5a6b50' }}>
                        <a href={`tel:${driver.phoneNumber}`} style={{ color: '#226b2a', textDecoration: 'none' }}>
                          {driver.phoneNumber}
                        </a>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#5a6b50' }}>{driver.preferredLanguage}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => toggleDriverAvailability(driver)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            background: driver.available ? '#f0fdf4' : '#f3f4f6',
                            color: driver.available ? '#226b2a' : '#5a6b50'
                          }}
                        >
                          {driver.available ? '🟢 Available' : '🔴 Off Duty'}
                        </button>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteDriver(driver.name)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.5rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                        >
                          🗑️ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Fleet Summary Card */}
      {drivers.length > 0 && (
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          border: '1px solid #bfdbfe',
          borderRadius: '1rem'
        }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📃</span> Delivery Fleet Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Total Drivers:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0d1f0e', marginLeft: '0.5rem' }}>{drivers.length}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Available:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', marginLeft: '0.5rem' }}>{availableCount}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Off Duty:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#5a6b50', marginLeft: '0.5rem' }}>{offDutyCount}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Vehicle Types:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0d1f0e', marginLeft: '0.5rem' }}>
                {new Set(drivers.map(d => d.vehicleType)).size}
              </span>
            </div>
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
            Smart Delivery Features
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>📍 Real-time GPS tracking</span>
          <span>📱 Live delivery notifications</span>
          <span>🗣️ Multi-language driver communication</span>
          <span>✅ Face verification for security</span>
        </div>
      </div>
    </div>
  );
}