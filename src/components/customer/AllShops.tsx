import React, { useState } from 'react';
import { SpazaShop } from '../../types';

interface AllShopsProps {
  shops: SpazaShop[];
  onViewProducts?: (shopOwnerUsername: string) => void;
}

const PROVINCES = ['All','Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Free State','Mpumalanga','North West','Northern Cape'];

function isShopOpen(shop: SpazaShop) {
  if (!shop.openingTime || !shop.closingTime) return shop.isOpen ?? true;
  const now = new Date();
  const current = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  return current >= shop.openingTime && current <= shop.closingTime;
}

export function AllShops({ shops, onViewProducts }: AllShopsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvince, setFilterProvince] = useState('All');

  const filteredShops = shops.filter(shop => {
    const matchesSearch =
      shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = filterProvince === 'All' || shop.province === filterProvince;
    return matchesSearch && matchesProvince;
  });

  const shopsByProvince = PROVINCES.filter(p => p !== 'All').reduce((acc, province) => {
    acc[province] = filteredShops.filter(s => s.province === province);
    return acc;
  }, {} as Record<string, SpazaShop[]>);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero section */}
      <div style={{ background: 'linear-gradient(135deg, #1a5220 0%, #226b2a 60%, #2d8535 100%)', borderRadius: '1.25rem', padding: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(245,158,11,0.15)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-2rem', left: '60%', width: '8rem', height: '8rem', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.25)' }}>
            🔥 SA's Favourite Spaza Network
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.4rem', lineHeight: 1.2 }}>
            All Registered Spaza Shops 🇿🇦
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', margin: 0 }}>
            Serving all 9 provinces — <strong style={{ color: '#f59e0b' }}>{shops.length} shops</strong> ready to deliver
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Total Shops', value: shops.length, icon: '🏪', color: '#226b2a' },
          { label: 'Provinces', value: 9, icon: '📍', color: '#f59e0b' },
          { label: 'Open Now', value: shops.filter(s => isShopOpen(s)).length, icon: '✅', color: '#16a34a' },
          { label: 'Filtered', value: filteredShops.length, icon: '🔍', color: '#7c3aed' },
        ].map((stat, i) => (
          <div key={stat.label} className="spaza-stat-card animate-slide-up" style={{ animationDelay: `${i * 0.05}s`, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{stat.icon}</div>
            <div className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#5a6b50', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search & filter */}
      <div className="spaza-card" style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>🔍</span>
          <input
            className="spaza-input"
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Search shops, locations, owners..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="spaza-select" value={filterProvince} onChange={e => setFilterProvince(e.target.value)}>
          {PROVINCES.map(p => <option key={p} value={p}>{p === 'All' ? '📍 All Provinces' : p}</option>)}
        </select>
        {(searchTerm || filterProvince !== 'All') && (
          <button className="spaza-btn-ghost" style={{ padding: '0.55rem 1rem', fontSize: '0.8rem' }} onClick={() => { setSearchTerm(''); setFilterProvince('All'); }}>
            Clear ✕
          </button>
        )}
      </div>

      {/* Province sections */}
      {filteredShops.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#5a6b50' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <div className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No shops found</div>
          <div style={{ fontSize: '0.875rem' }}>Try adjusting your search or filters</div>
        </div>
      ) : filterProvince !== 'All' ? (
        <ShopGrid shops={filteredShops} onViewProducts={onViewProducts} />
      ) : (
        PROVINCES.filter(p => p !== 'All').map(province => {
          const provinceShops = shopsByProvince[province];
          if (!provinceShops.length) return null;
          return (
            <div key={province} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0d1f0e', margin: 0 }}>
                  📍 {province}
                </h2>
                <span className="spaza-badge spaza-badge-green">{provinceShops.length} shops</span>
                <div style={{ flex: 1, height: '1px', background: '#dde8d5' }} />
              </div>
              <ShopGrid shops={provinceShops} onViewProducts={onViewProducts} />
            </div>
          );
        })
      )}
    </div>
  );
}

function ShopGrid({ shops, onViewProducts }: { shops: SpazaShop[]; onViewProducts?: (u: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
      {shops.map((shop, i) => <ShopCard key={shop.shopId} shop={shop} index={i} onViewProducts={onViewProducts} />)}
    </div>
  );
}

function ShopCard({ shop, index, onViewProducts }: { shop: SpazaShop; index: number; onViewProducts?: (u: string) => void }) {
  const open = isShopOpen(shop);
  const images = [
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80',
    'https://i.pinimg.com/1200x/a3/4f/6e/a34f6e9b55f1398e239582f8e405a77a.jpg',
    'https://i.pinimg.com/736x/fb/29/1f/fb291f48a05df96200412610ce86124a.jpg',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
    'https://i.pinimg.com/1200x/a3/4f/6e/a34f6e9b55f1398e239582f8e405a77a.jpg',
  ];
  const imgUrl = images[index % images.length];

  return (
    <div className="spaza-card animate-slide-up" style={{ animationDelay: `${index * 0.04}s`, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onViewProducts?.(shop.ownerUsername)}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <img src={imgUrl} alt={shop.shopName} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)')}
          onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
        {/* Status badge */}
        <div style={{ position: 'absolute', top: '0.6rem', left: '0.6rem' }}>
          <span className={`spaza-badge ${open ? 'spaza-badge-green' : 'spaza-badge-red'}`}>
            {open ? '● Open' : '● Closed'}
          </span>
        </div>
        {shop.disabilityFriendly && (
          <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem' }}>
            <span className="spaza-badge" style={{ background: 'rgba(255,255,255,0.9)', color: '#7c3aed' }}>♿</span>
          </div>
        )}
        {/* Shop name overlay */}
        <div style={{ position: 'absolute', bottom: '0.6rem', left: '0.75rem', right: '0.75rem' }}>
          <h3 className="font-heading" style={{ color: 'white', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.15rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>{shop.shopName}</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', margin: 0 }}>📍 {shop.location}, {shop.province}</p>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#5a6b50' }}>
            <span>🕐</span>
            <span>{shop.openingTime || '08:00'} – {shop.closingTime || '20:00'}</span>
          </div>
          {shop.offersCredit && (
            <span className="spaza-badge spaza-badge-amber">💳 Credit</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#5a6b50' }}>
            <span>👤</span>
            <span style={{ fontWeight: 600 }}>{shop.ownerName}</span>
          </div>
          <button
            className="spaza-btn-primary"
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
            onClick={e => { e.stopPropagation(); onViewProducts?.(shop.ownerUsername); }}
          >
            View →
          </button>
        </div>
      </div>
    </div>
  );
}
