import React, { useState } from 'react';
import { disabilitySupport } from '../../services/DisabilitySupport';

interface DisabilitySupportProps {
  username: string;
  hasDisability: boolean;
}

export function DisabilitySupport({ username, hasDisability }: DisabilitySupportProps) {
  const [disabilityType, setDisabilityType] = useState('Visual Impairment');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const profile = disabilitySupport.getDisabilityProfile(username);

  const handleRegister = () => {
    if (!disabilityType) {
      setErrorMessage('Please select a disability type');
      setShowErrorModal(true);
      return;
    }

    disabilitySupport.registerDisability(username, disabilityType, specialRequirements);
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }} onClick={closeSuccessModal}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            maxWidth: '500px',
            width: '90%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '3rem'
              }}>
                ✅
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#166534',
                marginBottom: '1rem'
              }}>
                Registration Successful!
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#5a6b50',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                Disability support registered successfully!
              </p>
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <p style={{ fontWeight: 600, color: '#166534', marginBottom: '0.75rem' }}>
                  You will now receive:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                    <span style={{ color: '#226b2a' }}>✓</span> Special assistance from shop owners
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                    <span style={{ color: '#226b2a' }}>✓</span> Priority delivery service
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                    <span style={{ color: '#226b2a' }}>✓</span> Extra time for order processing
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                    <span style={{ color: '#226b2a' }}>✓</span> Personalized customer support
                  </li>
                </ul>
              </div>
              <button
                onClick={closeSuccessModal}
                style={{
                  width: '100%',
                  backgroundColor: '#226b2a',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a5420'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#226b2a'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }} onClick={closeErrorModal}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            maxWidth: '400px',
            width: '90%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '3rem'
              }}>
                ⚠️
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#991b1b',
                marginBottom: '1rem'
              }}>
                Error
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#5a6b50',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                {errorMessage}
              </p>
              <button
                onClick={closeErrorModal}
                style={{
                  width: '100%',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="spaza-card" style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)', 
        border: '1px solid #bbf7d0',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '2.5rem' }}>♿</span>
          <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
            Disability Support Services
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#5a6b50', margin: 0 }}>
          Your accessibility comes first. We're committed to providing inclusive support.
        </p>
      </div>

      {profile ? (
        /* Existing Profile */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="spaza-card" style={{ padding: '1.5rem', background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.75rem' }}>📋</span>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#166534' }}>
                Your Disability Profile
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                background: 'white', 
                padding: '1rem', 
                borderRadius: '0.75rem', 
                borderLeft: '4px solid #226b2a',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#5a6b50', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Disability Type
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0d1f0e', marginTop: '0.25rem' }}>
                  {profile.disabilityType}
                </div>
              </div>

              <div style={{ 
                background: 'white', 
                padding: '1rem', 
                borderRadius: '0.75rem', 
                borderLeft: '4px solid #7c3aed',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#5a6b50', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Special Requirements
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0d1f0e', marginTop: '0.25rem' }}>
                  {profile.specialRequirements || '✅ None specified'}
                </div>
              </div>

              <div style={{ 
                background: 'white', 
                padding: '1rem', 
                borderRadius: '0.75rem', 
                borderLeft: '4px solid #f59e0b',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#5a6b50', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Registered Date
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0d1f0e', marginTop: '0.25rem' }}>
                  📅 {profile.registrationDate.toLocaleDateString()}
                </div>
              </div>

              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', 
                borderRadius: '0.75rem',
                border: '1px solid #86efac',
                color: '#166534',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                ✅ Your disability support is active. Shop owners will provide special assistance.
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="spaza-card" style={{ padding: '1.5rem', background: '#faf5ff', border: '2px solid #d8b4fe', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🌟</span>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#6b21a5' }}>
                Your Special Instructions
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {disabilitySupport.getSpecialInstructions(username).map((instruction, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  background: 'white', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '0.75rem',
                  borderLeft: '4px solid #8b5cf6',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '1.25rem' }}>•</span>
                  <span style={{ color: '#1f2937', fontWeight: 500, fontSize: '0.875rem' }}>{instruction}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <div className="spaza-card" style={{ padding: '1.5rem', background: '#fffbeb', border: '2px solid #fcd34d', borderRadius: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.75rem' }}>📝</span>
            <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#b45309' }}>
              Register for Disability Support
            </h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#5a6b50', marginBottom: '1.5rem' }}>
            Help us provide you with the best possible support by telling us about your needs.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="disability-type" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
                Disability Type <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                id="disability-type"
                value={disabilityType}
                onChange={(e) => setDisabilityType(e.target.value)}
                aria-label="Select your disability type"
                aria-required="true"
                className="spaza-input"
                style={{ width: '100%', cursor: 'pointer', padding: '0.6rem 0.75rem' }}
              >
                <option value="Visual Impairment">👁️ Visual Impairment</option>
                <option value="Mobility Impairment">🚶 Mobility Impairment</option>
                <option value="Hearing Impairment">👂 Hearing Impairment</option>
                <option value="Cognitive Disability">🧠 Cognitive Disability</option>
                <option value="Other">❓ Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="special-requirements" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
                Special Requirements <span style={{ color: '#6b7280' }}>(Optional)</span>
              </label>
              <textarea
                id="special-requirements"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                aria-label="Describe any special assistance you need"
                aria-describedby="requirements-help"
                className="spaza-input"
                style={{ width: '100%', resize: 'vertical', minHeight: '100px', padding: '0.6rem 0.75rem' }}
                rows={4}
                placeholder="Describe any special assistance you need (e.g., large print, verbal assistance, etc.)..."
              />
              <p id="requirements-help" style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.5rem' }}>
                💡 Help us understand your specific needs so we can serve you better
              </p>
            </div>

            <button
              onClick={handleRegister}
              className="spaza-btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
            >
              ✅ Register Disability Support
            </button>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="spaza-card" style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5, #faf5ff)', 
        border: '2px solid #86efac',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.75rem' }}>🌟</span>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#166534' }}>
            Disability Support Benefits
          </h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {/* Priority Service */}
          <div style={{ 
            background: 'white', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            borderLeft: '4px solid #226b2a',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}>
            <h4 style={{ marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.9rem', color: '#226b2a' }}>⭐ PRIORITY SERVICE</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#4b5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#226b2a' }}>✓</span> Your orders are processed first</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#226b2a' }}>✓</span> Dedicated customer support</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#226b2a' }}>✓</span> Special attention from staff</div>
            </div>
          </div>

          {/* Enhanced Delivery */}
          <div style={{ 
            background: 'white', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            borderLeft: '4px solid #f59e0b',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}>
            <h4 style={{ marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.9rem', color: '#d97706' }}>🚚 ENHANCED DELIVERY</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#4b5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#d97706' }}>✓</span> Door-to-door delivery service</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#d97706' }}>✓</span> Extra time for order receiving</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#d97706' }}>✓</span> Assistance with carrying items</div>
            </div>
          </div>

          {/* Communication Support */}
          <div style={{ 
            background: 'white', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            borderLeft: '4px solid #7c3aed',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}>
            <h4 style={{ marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.9rem', color: '#7c3aed' }}>💬 COMMUNICATION SUPPORT</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#4b5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#7c3aed' }}>✓</span> Clear verbal descriptions</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#7c3aed' }}>✓</span> Patient order taking</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#7c3aed' }}>✓</span> Assistance with reading labels</div>
            </div>
          </div>

          {/* Shopping Assistance */}
          <div style={{ 
            background: 'white', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            borderLeft: '4px solid #0891b2',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}>
            <h4 style={{ marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.9rem', color: '#0891b2' }}>🛏️ SHOPPING ASSISTANCE</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#4b5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#0891b2' }}>✓</span> Help with product selection</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#0891b2' }}>✓</span> Assistance with cash handling</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#0891b2' }}>✓</span> Personalized recommendations</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}