import React from 'react';
import { User } from '../../types';
import { disabilitySupport } from '../../services/DisabilitySupport';

interface DisabilityManagementProps {
  users: User[];
}

export function DisabilityManagement({ users }: DisabilityManagementProps) {
  const disabledUsers = users.filter(u => u.hasDisability);
  const allProfiles = disabilitySupport.getAllProfiles();

  const visualCount = allProfiles.filter(p => p.disabilityType === 'Visual Impairment').length;
  const mobilityCount = allProfiles.filter(p => p.disabilityType === 'Mobility Impairment').length;
  const otherCount = allProfiles.filter(p => !['Visual Impairment', 'Mobility Impairment'].includes(p.disabilityType)).length;

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
              <span style={{ fontSize: '2rem' }}>♿</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                Disability Support Management
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              Manage accommodations for customers with disabilities
            </p>
          </div>
          <div style={{ 
            padding: '0.5rem 0.75rem', 
            background: 'white', 
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.6rem', color: '#5a6b50' }}>Total Registered</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#226b2a' }}>{allProfiles.length}</div>
          </div>
        </div>
      </div>

      {/* Support Protocols Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📋</span> Disability Support Protocols
          </h3>
          <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginTop: '0.25rem' }}>
            Guidelines for assisting customers with disabilities
          </p>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
            gap: '0.75rem'
          }}>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#226b2a', marginBottom: '0.25rem' }}>🕐 Extra Time</div>
              <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Allow additional time for order preparation and delivery</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#226b2a', marginBottom: '0.25rem' }}>📞 Pre-Delivery Call</div>
              <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Call customer before delivery to confirm readiness</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#226b2a', marginBottom: '0.25rem' }}>🚶 Door Service</div>
              <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Provide complete door-to-door delivery service</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#226b2a', marginBottom: '0.25rem' }}>💬 Clear Communication</div>
              <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Use clear language and be patient</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#226b2a', marginBottom: '0.25rem' }}>🛍️ Carrying Assistance</div>
              <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Assist with carrying items if needed</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#226b2a', marginBottom: '0.25rem' }}>📋 Label Reading</div>
              <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Read labels and provide product information</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#226b2a', marginBottom: '0.25rem' }}>💵 Cash Handling</div>
              <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Assist with cash transactions if required</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#226b2a', marginBottom: '0.25rem' }}>⭐ Dignity & Respect</div>
              <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>Always maintain customer dignity and respect</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Total Registered</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' }}>{allProfiles.length}</div>
          </div>
          <span style={{ fontSize: '2rem' }}>👥</span>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Visual Impairment</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>{visualCount}</div>
          </div>
          <span style={{ fontSize: '2rem' }}>👁️</span>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Mobility Impairment</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>{mobilityCount}</div>
          </div>
          <span style={{ fontSize: '2rem' }}>🦽</span>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Other Types</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{otherCount}</div>
          </div>
          <span style={{ fontSize: '2rem' }}>♿</span>
        </div>
      </div>

      {/* Customer List Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👥</span> Registered Customers
          </h3>
          <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginTop: '0.25rem' }}>
            Customers who have registered for disability support
          </p>
        </div>
        <div style={{ padding: '1rem' }}>
          {allProfiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>♿</div>
              <p style={{ fontSize: '0.85rem', color: '#5a6b50' }}>No disability support registrations yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Customer</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Disability Type</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Special Requirements</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Registration Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', color: '#226b2a', fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                  {allProfiles.map((profile, index) => {
                    const user = users.find(u => u.username === profile.username);
                    
                    const getDisabilityColor = (type: string) => {
                      if (type === 'Visual Impairment') return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
                      if (type === 'Mobility Impairment') return { bg: '#f0fdf4', text: '#226b2a', border: '#bbf7d0' };
                      return { bg: '#fef3c7', text: '#f59e0b', border: '#fde68a' };
                    };
                    
                    const color = getDisabilityColor(profile.disabilityType);
                    
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 600, color: '#0d1f0e' }}>{user?.fullName || profile.username}</div>
                          {user?.phoneNumber && (
                            <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{user.phoneNumber}</div>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            background: color.bg,
                            color: color.text,
                            border: `1px solid ${color.border}`
                          }}>
                            {profile.disabilityType === 'Visual Impairment' ? '👁️ ' : 
                             profile.disabilityType === 'Mobility Impairment' ? '🦽 ' : '♿ '}
                            {profile.disabilityType}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.7rem', color: '#5a6b50', maxWidth: '250px' }}>
                          {profile.specialRequirements || 'None specified'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.7rem', color: '#5a6b50' }}>
                          {profile.registrationDate.toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            background: '#f0fdf4',
                            color: '#226b2a',
                            border: '1px solid #bbf7d0'
                          }}>
                            ✓ Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
            AI-Powered Accessibility Features
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>🔊 Voice-enabled ordering</span>
          <span>📱 Large text mode</span>
          <span>🎤 Speech-to-text support</span>
          <span>📞 Priority dispatch for accessibility needs</span>
          <span>📍 Precision delivery location pinning</span>
        </div>
      </div>
    </div>
  );
}