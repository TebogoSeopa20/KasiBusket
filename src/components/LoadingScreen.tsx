import React from 'react';

interface LoadingScreenProps {
  message?: string;
  backgroundUrl?: string;
  logoUrl?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  backgroundUrl,
  logoUrl,
}) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a5220 0%, #226b2a 50%, #2d8535 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ...(backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : {}),
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>
      {/* Overlay */}
      {backgroundUrl && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,82,32,0.82)' }} />
      )}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        padding: '3rem 4rem',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(16px)',
        borderRadius: '1.5rem',
        border: '1.5px solid rgba(255,255,255,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'fadeIn 0.5s ease',
      }}>
        {/* Logo area */}
        <div style={{ marginBottom: '1.5rem' }}>
          {logoUrl ? (
            <img src={logoUrl} alt="Loading" style={{ width: '5rem', height: '5rem', margin: '0 auto', animation: 'spin 1s linear infinite', borderRadius: '1rem' }} />
          ) : (
            <div style={{ position: 'relative', width: '4rem', height: '4rem', margin: '0 auto' }}>
              {/* Outer ring */}
              <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(255,255,255,0.2)', borderRadius: '50%' }} />
              {/* Spinning arc */}
              <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              {/* Inner dot */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '0.75rem', height: '0.75rem', background: '#f59e0b', borderRadius: '50%' }} />
            </div>
          )}
        </div>
        {/* Brand */}
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'white', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>
          Spaza Eats
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{message}</p>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>Powered by Huawei Cloud</p>
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.5)',
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&family=Syne:wght@800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%,80%,100% { opacity:0.3; transform:scale(0.8); } 40% { opacity:1; transform:scale(1.1); } }
      `}</style>
    </div>
  );
};
