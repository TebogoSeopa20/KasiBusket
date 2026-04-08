import React, { useState } from 'react';
import { Owner, SpazaShop, Product, DeliveryDriver, User, Combo, Order } from '../types';
import { db } from '../services/DatabaseService';
import { toast } from 'sonner';
import { OwnerDashboard } from './owner/OwnerDashboard';
import { StockManagement } from './owner/StockManagement';
import { CreditManagement } from './owner/CreditManagement';
import { DisabilityManagement } from './owner/DisabilityManagement';
import { ProductManagement } from './owner/ProductManagement';
import { AdvancedAnalyticsDashboard } from './owner/AdvancedAnalyticsDashboard';
import { HuaweiCloudStatusBar } from './HuaweiCloudStatusBar';
import { DeliveryRouteOptimizer } from './DeliveryRouteOptimizer';
import { EnvironmentalImpactDashboard } from './EnvironmentalImpactDashboard';
import { SecurityDashboard } from './SecurityDashboard';
import { publicAnonKey, supabaseUrl } from '../utils/supabase/info';

interface OwnerPortalProps {
  owner: Owner;
  shop: SpazaShop;
  products: Product[];
  drivers: DeliveryDriver[];
  users: User[];
  combos: Combo[];
  orders: Order[];
  addCombo: (combo: Combo) => void;
  onLogout: () => void;
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏪' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'stock', label: 'Stock', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'delivery', label: 'Routes', icon: '🗺️' },
  { id: 'sustainability', label: 'Eco', icon: '🌱' },
  { id: 'security', label: 'Security', icon: '🔐' },
  { id: 'credit', label: 'Credit', icon: '💳' },
  { id: 'disability', label: 'Disability', icon: '♿' },
];

export function OwnerPortal({ owner, shop, products, drivers, users, combos, orders, addCombo, onLogout }: OwnerPortalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState(owner.preferredLanguage || 'English');

  const ownerShops = db.getShopsByOwner(owner.username);
  const shopsToUse = ownerShops?.length > 0 ? ownerShops : (shop ? [shop] : []);
  const selectedShop = shopsToUse[0] || shop;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9f5', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <HuaweiCloudStatusBar />

      {/* Header */}
      <header className="spaza-header" style={{ background: '#226b2a', padding: '1rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              background: 'white', 
              borderRadius: '0.75rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.1rem', 
              border: '1.5px solid rgba(255,255,255,0.3)',
              overflow: 'hidden'
            }}>
              <img 
                src="https://i.pinimg.com/736x/29/b3/db/29b3db40387d3b7f5b7f687c8d46505d.jpg"
                alt="KasiBusket Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.background = 'rgba(255,255,255,0.2)';
                    parent.innerHTML = '🏪';
                  }
                }}
              />
            </div>
            <div>
              <div className="font-heading" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', lineHeight: 1.1 }}>KasiBusket Owner Portal</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)' }}>
                {owner.fullName} • {shop?.shopName || 'No shop'} • {shop?.location || ''}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <select
              value={language}
              onChange={e => { const l = e.target.value; setLanguage(l); db.updateOwner(owner.username, { preferredLanguage: l }); toast.info(`Language: ${l}`); }}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '0.6rem', color: 'white', padding: '0.35rem 0.7rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none' }}
            >
              {['English','isiZulu','isiXhosa','Afrikaans','Sepedi'].map(l => <option key={l} value={l} style={{ color: '#0d1f0e' }}>{l}</option>)}
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '0.3rem 0.8rem 0.3rem 0.35rem', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              <div style={{ width: '1.6rem', height: '1.6rem', background: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', color: '#1a0e00' }}>{owner.fullName.charAt(0)}</div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'white' }}>{owner.fullName.split(' ')[0]}</span>
            </div>
            <button onClick={onLogout} style={{ padding: '0.4rem 0.9rem', background: 'rgba(239,68,68,0.2)', border: '1.5px solid rgba(239,68,68,0.4)', borderRadius: '0.65rem', color: 'white', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div style={{ background: 'white', borderBottom: '1px solid #dde8d5', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 8px rgba(34,107,42,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.5rem 1rem', overflowX: 'auto', display: 'flex', gap: '0.3rem', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`spaza-tab ${activeTab === tab.id ? 'active' : ''}`}
              style={{ flexShrink: 0 }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div className="animate-slide-up">
          {activeTab === 'dashboard' && <OwnerDashboard shops={shopsToUse} products={products} drivers={drivers} orders={orders} />}
          {activeTab === 'products' && <ProductManagement shopId={selectedShop?.shopId || 'PENDING'} shopName={selectedShop?.shopName || ''} ownerUsername={owner.username} supabaseUrl={supabaseUrl} publicAnonKey={publicAnonKey} combos={combos.filter(c => c.productIds.some(id => products.find(p => p.name === id && p.shopOwner === owner.username)))} addCombo={addCombo} />}
          {activeTab === 'stock' && <StockManagement shop={selectedShop} products={products} />}
          {activeTab === 'analytics' && <AdvancedAnalyticsDashboard shopOwner={owner.username} products={products} />}
          {activeTab === 'delivery' && <DeliveryRouteOptimizer orders={orders} shop={shop} />}
          {activeTab === 'sustainability' && <EnvironmentalImpactDashboard shopOwner={owner.username} products={products} />}
          {activeTab === 'security' && <SecurityDashboard />}
          {activeTab === 'credit' && <CreditManagement users={users} />}
          {activeTab === 'disability' && <DisabilityManagement users={users} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="spaza-header" style={{ background: '#226b2a', marginTop: '3rem', padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', margin: 0 }}>
          © 2025 KasiBusket — Owner Portal • Powered by Huawei Cloud
        </p>
      </footer>
    </div>
  );
}