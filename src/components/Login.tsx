import React, { useState } from 'react';
import { User, Owner } from '../types';
import { toast } from 'sonner';
import { SAIDValidator } from '../services/SAIDValidator';
import { OTPService } from '../services/OTPService';
import { db } from '../services/DatabaseService';
import { verifyHash } from '../utils/simpleHash';
import { AuthService } from '../services/AuthService';

interface LoginProps {
  onLogin: (user: User | null, owner: Owner | null) => void;
  users: User[];
  owners: Owner[];
  onShowShopRegistration: () => void;
}

// Demo user account - created properly with all required fields
const createDemoUser = (): User => ({
  username: 'test',
  password: 'demo123',
  fullName: 'Demo User',
  email: 'demo@kasibusket.co.za',
  phoneNumber: '+27 71 000 0000',
  address: '123 Demo Street, Johannesburg',
  isSenior: false,
  hasDisability: false,
  idNumber: '9001011234089',
  preferredLanguage: 'English',
  registeredAt: new Date(),
  accountActive: true,
  role: 'customer',
  createdAt: new Date(),
  updatedAt: new Date()
});

export function Login({ onLogin, users, owners, onShowShopRegistration }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isSenior, setIsSenior] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [otp, setOtp] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for demo credentials FIRST
    if (username === 'test' && password === 'demo123') {
      const demoUser = createDemoUser();
      onLogin(demoUser, null);
      toast.success('Welcome, Demo User! Explore KasiBusket features.');
      return;
    }
    
    // Check database for user
    const dbUser = db.getUserByUsername(username) || db.getUserByEmail(username);
    const dbOwner = db.getOwnerByUsername(username) || db.getOwnerByEmail(username);
    
    if (dbUser && verifyHash(dbUser.password || '', password)) {
      onLogin(dbUser, null);
      toast.success(`Welcome back, ${dbUser.fullName}!`);
      return;
    }
    
    if (dbOwner && verifyHash(dbOwner.password || '', password)) {
      onLogin(null, dbOwner);
      toast.success(`Welcome back, ${dbOwner.fullName}!`);
      return;
    }
    
    // Check props arrays for user/owner (fallback)
    const propUser = users.find(u => (u.username === username || u.email === username) && u.password === password);
    const propOwner = owners.find(o => (o.username === username || o.email === username) && o.password === password);
    
    if (propUser) {
      onLogin(propUser, null);
      toast.success(`Welcome back, ${propUser.fullName}!`);
      return;
    }
    
    if (propOwner) {
      onLogin(null, propOwner);
      toast.success(`Welcome back, ${propOwner.fullName}!`);
      return;
    }
    
    toast.error('Invalid username or password');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (idNumber.length !== 13) { toast.error('SA ID Number must be exactly 13 digits'); return; }
      const idValidation = SAIDValidator.verifyIdentity(idNumber, fullName);
      if (!idValidation.verified) { toast.error(idValidation.message); return; }
      const existingUser = db.getUserByIdNumber(idNumber);
      const existingOwner = db.getOwnerByIdNumber(idNumber);
      if (existingUser || existingOwner) { toast.error('This ID Number is already registered.'); return; }
      const generatedOtp = OTPService.generateOTP();
      const sent = await OTPService.sendOTPSMS(phoneNumber, generatedOtp, fullName);
      if (sent) { setStep(2); toast.success(`OTP sent to ${phoneNumber}. For demo use: 123456`); }
      else { toast.error('Failed to send OTP. Please try again.'); }
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const verification = OTPService.verifyOTP(phoneNumber, otp);
    if (verification.valid || otp === '123456') {
      const newUser: User = { 
        username, 
        password, 
        fullName, 
        address, 
        phoneNumber, 
        email, 
        isSenior, 
        hasDisability, 
        idNumber, 
        preferredLanguage, 
        registeredAt: new Date(), 
        accountActive: true, 
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      } as any;
      db.saveUser(newUser);
      onLogin(newUser, null);
      toast.success('Registration successful! Welcome to KasiBusket.');
    } else { toast.error('Invalid OTP. Please try again or use 123456.'); }
  };

  const handleDemoLogin = () => {
    const demoUser = createDemoUser();
    onLogin(demoUser, null);
    toast.success('Welcome, Demo User! Explore KasiBusket features.');
  };

  const inputStyle: React.CSSProperties = { 
    width: '100%', 
    padding: '0.7rem 1rem', 
    border: '1.5px solid #dde8d5', 
    borderRadius: '0.75rem', 
    background: '#ffffff', 
    fontFamily: 'Plus Jakarta Sans, sans-serif', 
    fontSize: '0.9rem', 
    outline: 'none', 
    color: '#0d1f0e', 
    boxSizing: 'border-box',
    transition: 'all 0.2s'
  };
  
  const labelStyle: React.CSSProperties = { 
    display: 'block', 
    marginBottom: '0.3rem', 
    fontWeight: 600, 
    fontSize: '0.8rem', 
    color: '#226b2a' 
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f7f9f5', 
      padding: '1.5rem', 
      fontFamily: 'Plus Jakarta Sans, sans-serif' 
    }}>
      {/* Decorative subtle circles */}
      <div style={{ 
        position: 'fixed', 
        top: '-10rem', 
        right: '-10rem', 
        width: '30rem', 
        height: '30rem', 
        background: 'rgba(34, 107, 42, 0.05)', 
        borderRadius: '50%', 
        pointerEvents: 'none' 
      }} />
      <div style={{ 
        position: 'fixed', 
        bottom: '-8rem', 
        left: '-8rem', 
        width: '25rem', 
        height: '25rem', 
        background: 'rgba(245, 158, 11, 0.05)', 
        borderRadius: '50%', 
        pointerEvents: 'none' 
      }} />

      <div style={{ width: '100%', maxWidth: '26rem', position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '1.5rem', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 4px 10px -2px rgba(0,0,0,0.1)', 
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          {/* Header strip */}
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)',
            borderBottom: '1px solid #bbf7d0'
          }}>
            <div style={{ 
              width: '3.5rem', 
              height: '3.5rem', 
              background: '#226b2a', 
              borderRadius: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 0.75rem',
              overflow: 'hidden'
            }}>
              <img 
                src="https://i.pinimg.com/736x/29/b3/db/29b3db40387d3b7f5b7f687c8d46505d.jpg"
                alt="KasiBusket Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.innerHTML = '<span style="font-size: 1.5rem;">🛒</span>';
                }}
              />
            </div>
            <h1 style={{ 
              fontFamily: 'Syne, sans-serif', 
              fontWeight: 800, 
              fontSize: '1.5rem', 
              color: '#0d1f0e', 
              margin: '0 0 0.25rem' 
            }}>
              KasiBusket
            </h1>
            <p style={{ color: '#5a6b50', fontSize: '0.8rem', margin: 0 }}>
              {isRegistering ? 'Create your account' : 'Sign in to continue'}
            </p>
          </div>

          <div style={{ padding: '1.75rem' }}>
            {/* Quick Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.6rem', 
                padding: '0.65rem', 
                border: '1.5px solid #f59e0b', 
                borderRadius: '0.75rem', 
                background: 'linear-gradient(135deg, #fef3c7, #fffbeb)', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 700, 
                color: '#92400e', 
                marginBottom: '1rem', 
                transition: 'all 0.2s', 
                fontFamily: 'Plus Jakarta Sans, sans-serif' 
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #fde68a, #fef3c7)';
                e.currentTarget.style.borderColor = '#d97706';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #fef3c7, #fffbeb)';
                e.currentTarget.style.borderColor = '#f59e0b';
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🚀</span>
              Quick Demo Access
              <span style={{ fontSize: '0.7rem', background: '#f59e0b20', padding: '0.2rem 0.5rem', borderRadius: '9999px', marginLeft: '0.25rem' }}>
                test/demo123
              </span>
            </button>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => AuthService.signInWithGoogle()}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.6rem', 
                padding: '0.65rem', 
                border: '1.5px solid #dde8d5', 
                borderRadius: '0.75rem', 
                background: 'white', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: '#374151', 
                marginBottom: '1.25rem', 
                transition: 'all 0.2s', 
                fontFamily: 'Plus Jakarta Sans, sans-serif' 
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f7f9f5';
                e.currentTarget.style.borderColor = '#226b2a';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#dde8d5';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#dde8d5' }} />
              <span style={{ fontSize: '0.75rem', color: '#5a6b50', fontWeight: 600 }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#dde8d5' }} />
            </div>

            {!isRegistering ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Username or Email</label>
                  <input 
                    style={inputStyle} 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    required 
                    placeholder="Enter your username (e.g., test)"
                    onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                    onBlur={e => e.currentTarget.style.borderColor = '#dde8d5'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input 
                    style={inputStyle} 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    placeholder="Enter your password (e.g., demo123)"
                    onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                    onBlur={e => e.currentTarget.style.borderColor = '#dde8d5'}
                  />
                </div>
                <button type="submit" style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  background: '#226b2a', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '0.75rem', 
                  fontWeight: 700, 
                  fontSize: '0.9rem', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={step === 1 ? handleRegister : handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {step === 1 ? (
                  <>
                    {[
                      { label: 'Full Name (as on ID)', value: fullName, setter: setFullName, type: 'text', placeholder: 'e.g. Thabo Mokoena' },
                      { label: 'SA ID Number (13 digits)', value: idNumber, setter: setIdNumber, type: 'text', placeholder: '0000000000000', maxLength: 13 },
                      { label: 'Phone Number', value: phoneNumber, setter: setPhoneNumber, type: 'tel', placeholder: '+27 71 000 0000' },
                      { label: 'Email Address', value: email, setter: setEmail, type: 'email', placeholder: 'your@email.com' },
                      { label: 'Username', value: username, setter: setUsername, type: 'text', placeholder: 'Choose a username' },
                      { label: 'Password', value: password, setter: setPassword, type: 'password', placeholder: 'Create a password' },
                    ].map(field => (
                      <div key={field.label}>
                        <label style={labelStyle}>{field.label}</label>
                        <input 
                          style={inputStyle} 
                          type={field.type} 
                          value={field.value} 
                          onChange={e => field.setter(e.target.value)} 
                          required 
                          placeholder={field.placeholder} 
                          maxLength={(field as any).maxLength}
                          onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                          onBlur={e => e.currentTarget.style.borderColor = '#dde8d5'}
                        />
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {[
                        { label: '🎯 Senior (60+)', value: isSenior, setter: setIsSenior }, 
                        { label: '♿ Has Disability', value: hasDisability, setter: setHasDisability }
                      ].map(cb => (
                        <label key={cb.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: '#226b2a', cursor: 'pointer' }}>
                          <input type="checkbox" checked={cb.value} onChange={e => cb.setter(e.target.checked)} style={{ accentColor: '#226b2a' }} />
                          {cb.label}
                        </label>
                      ))}
                    </div>
                    <button type="submit" style={{ 
                      width: '100%', 
                      padding: '0.8rem', 
                      background: '#226b2a', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '0.75rem', 
                      fontWeight: 700, 
                      fontSize: '0.9rem', 
                      cursor: 'pointer'
                    }}>
                      Next: Verify Identity →
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ background: '#e8f5e2', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.85rem', color: '#166534' }}>
                      📱 OTP sent to <strong>{phoneNumber}</strong>. Demo code: <strong>123456</strong>
                    </div>
                    <div>
                      <label style={labelStyle}>Verification Code</label>
                      <input 
                        style={{ 
                          ...inputStyle, 
                          textAlign: 'center', 
                          fontSize: '1.5rem', 
                          letterSpacing: '0.4em', 
                          fontWeight: 700 
                        }} 
                        value={otp} 
                        onChange={e => setOtp(e.target.value)} 
                        required 
                        maxLength={6} 
                        placeholder="000000"
                        onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                        onBlur={e => e.currentTarget.style.borderColor = '#dde8d5'}
                      />
                    </div>
                    <button type="submit" style={{ 
                      width: '100%', 
                      padding: '0.8rem', 
                      background: '#226b2a', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '0.75rem', 
                      fontWeight: 700, 
                      fontSize: '0.9rem', 
                      cursor: 'pointer'
                    }}>
                      ✅ Complete Registration
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      style={{ background: 'none', border: 'none', color: '#226b2a', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textAlign: 'center', width: '100%' }}
                    >
                      ← Back to details
                    </button>
                  </>
                )}
              </form>
            )}

            {/* Demo Credentials Toggle Button */}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
              >
                {showDemoCredentials ? 'Hide demo credentials' : 'Show demo credentials'}
              </button>
              
              {showDemoCredentials && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: '#f7f9f5',
                  borderRadius: '0.5rem',
                  border: '1px solid #dde8d5',
                  fontSize: '0.75rem',
                  textAlign: 'left'
                }}>
                  <div style={{ fontWeight: 700, color: '#226b2a', marginBottom: '0.5rem' }}>🔐 Demo Credentials:</div>
                  <div style={{ color: '#1e2a1c', marginBottom: '0.25rem' }}>
                    <strong>Username:</strong> <span style={{ fontFamily: 'monospace', background: '#e8f5e2', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>test</span>
                  </div>
                  <div style={{ color: '#1e2a1c', marginBottom: '0.5rem' }}>
                    <strong>Password:</strong> <span style={{ fontFamily: 'monospace', background: '#e8f5e2', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>demo123</span>
                  </div>
                  <div style={{ color: '#5a6b50', fontSize: '0.7rem', marginTop: '0.5rem' }}>
                    💡 Tip: Use these credentials to test the app
                  </div>
                  <button
                    onClick={handleDemoLogin}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.4rem',
                      background: '#226b2a',
                      border: 'none',
                      borderRadius: '0.4rem',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Login as Demo User
                  </button>
                </div>
              )}
            </div>

            {/* Footer links */}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setStep(1); }} 
                style={{ background: 'none', border: 'none', color: '#226b2a', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}
              >
                {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
              {!isRegistering && (
                <button 
                  onClick={onShowShopRegistration} 
                  style={{ 
                    background: 'none', 
                    border: '1.5px solid #dde8d5', 
                    borderRadius: '0.65rem', 
                    color: '#5a6b50', 
                    fontSize: '0.82rem', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    padding: '0.6rem', 
                    transition: 'all 0.2s' 
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#226b2a';
                    e.currentTarget.style.color = '#226b2a';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#dde8d5';
                    e.currentTarget.style.color = '#5a6b50';
                  }}
                >
                  🏪 Shop Owner? Register your Spaza
                </button>
              )}
            </div>
          </div>
        </div>
        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.72rem', marginTop: '1rem' }}>
          Powered by Huawei Cloud • Serving all 9 SA Provinces
        </p>
      </div>
    </div>
  );
}