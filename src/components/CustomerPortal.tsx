import React, { useState, useEffect } from 'react';
import { User, SpazaShop, Product, DeliveryDriver, CartItem, Combo, Order } from '../types';
import { AllShops } from './customer/AllShops';
import { ProductCatalog } from './customer/ProductCatalog';
import { CreditAccount } from './customer/CreditAccount';
import { ShoppingCart } from './customer/ShoppingCart';
import { DisabilitySupport as DisabilitySupportComponent } from './customer/DisabilitySupport';
import { SeniorQuickOrder } from './customer/SeniorQuickOrder';
import { PropertyMarketplace } from './customer/PropertyMarketplace';
import { GamificationPanel } from './customer/GamificationPanel';
import { HuaweiCloudStatusBar } from './HuaweiCloudStatusBar';
import { AIRecommendationEngine } from './AIRecommendationEngine';
import { BlockchainCreditViewer } from './BlockchainCreditViewer';
import { LiveDeliveryTracking } from './customer/LiveDeliveryTracking';
import { toast } from 'sonner';
import { db } from '../services/DatabaseService';
import { Coordinates } from '../services/LocationService';

interface CustomerPortalProps {
  user: User;
  shops: SpazaShop[];
  products: Product[];
  drivers: DeliveryDriver[];
  combos: Combo[];
  orders: Order[];
  onPlaceOrder: (order: Order) => void;
  onLogout: () => void;
}

const TABS = [
  { id: 'shops', label: 'Shops', icon: '🏪' },
  { id: 'products', label: 'Products', icon: '🛒' },
  { id: 'ai', label: 'AI Picks', icon: '🤖' },
  { id: 'senior', label: 'Quick Order', icon: '🎯' },
  { id: 'cart', label: 'Cart', icon: '📦' },
  { id: 'credit', label: 'Credit', icon: '💳' },
  { id: 'properties', label: 'Properties', icon: '🏠' },
  { id: 'gamification', label: 'Rewards', icon: '🎮' },
  { id: 'blockchain', label: 'History', icon: '⛓️' },
  { id: 'disability', label: 'Support', icon: '♿' },
];

export function CustomerPortal({ user, shops, products, drivers, combos, orders, onPlaceOrder, onLogout }: CustomerPortalProps) {
  const [activeTab, setActiveTab] = useState('shops');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [seniorMode, setSeniorMode] = useState(user.isSenior);
  const [selectedShopOwner, setSelectedShopOwner] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [language, setLanguage] = useState(user.preferredLanguage);
  
  // Mock coordinates - in production, these would come from actual shop and customer data
  const [shopLocation] = useState<Coordinates>({ lat: -26.195, lng: 28.034 }); // Soweto example
  const [customerLocation] = useState<Coordinates>({ lat: -26.204, lng: 28.047 }); // Customer location
  const [customerAddress, setCustomerAddress] = useState(user.address || '123 Vilakazi Street, Soweto, Johannesburg');

  useEffect(() => {
    const savedOrder = localStorage.getItem('activeOrder');
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      setActiveOrder(order);
      if (order.deliveryAddress) {
        setCustomerAddress(order.deliveryAddress);
      }
    }
  }, []);

  // Save active order to localStorage when it changes
  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('activeOrder', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('activeOrder');
    }
  }, [activeOrder]);

  const addToCart = (product: Product | Combo, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.name === product.name);
      if (existing) {
        return prev.map(item => 
          item.product.name === product.name 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productName: string) => {
    setCart(prev => prev.filter(item => item.product.name !== productName));
    toast.info(`${productName} removed from cart`);
  };
  
  const updateQuantity = (productName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productName);
    } else {
      setCart(prev => prev.map(item => 
        item.product.name === productName 
          ? { ...item, quantity } 
          : item
      ));
    }
  };
  
  const clearCart = (orderFromCart?: any) => {
    if (cart.length === 0 && !orderFromCart) {
      toast.error('Cart is empty');
      return;
    }
    
    // Create order in the format expected by App.tsx
    let newOrder: any;
    
    if (orderFromCart) {
      // Convert the order from ShoppingCart to the format App.tsx expects
      newOrder = {
        orderId: orderFromCart.id || `ORD-${Date.now()}`,
        customerId: orderFromCart.customerId || user.username,
        customerName: orderFromCart.customerName || user.fullName,
        items: orderFromCart.items.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          product: {  // App.tsx expects product.name
            name: item.productName,
            price: item.price
          }
        })),
        totalAmount: orderFromCart.totalAmount,
        status: orderFromCart.status || 'pending',
        createdAt: orderFromCart.createdAt || new Date().toISOString(),
        deliveryAddress: orderFromCart.deliveryAddress || customerAddress,
        paymentMethod: orderFromCart.paymentMethod || 'CASH',
        timestamp: orderFromCart.createdAt || new Date().toISOString()
      };
    } else {
      // Fallback: Create a new order
      const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      newOrder = {
        orderId: `ORD-${Date.now()}`,
        customerId: user.username,
        customerName: user.fullName,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          product: {
            name: item.product.name,
            price: item.product.price
          }
        })),
        totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        deliveryAddress: customerAddress,
        paymentMethod: 'CASH',
        timestamp: new Date().toISOString()
      };
    }
    
    console.log('Placing order:', newOrder); // Debug log
    
    setActiveOrder(newOrder);
    
    // Call onPlaceOrder safely
    try {
      onPlaceOrder(newOrder);
      toast.success('Order placed! Tracking your delivery...');
      setCart([]);
      setActiveTab('tracking');
    } catch (error) {
      console.error('Error in onPlaceOrder:', error);
      toast.error('Error placing order. Please try again.');
    }
  };
  
  const handleViewShopProducts = (shopOwnerUsername: string) => { 
    setSelectedShopOwner(shopOwnerUsername); 
    setActiveTab('products'); 
  };

  const handleDeliveryComplete = () => {
    toast.success('Delivery completed! Thank you for shopping with KasiBusket!');
    setActiveOrder(null);
    setActiveTab('shops');
  };

  // Get the driver for the active order
  const getOrderDriver = (): DeliveryDriver | null => {
    if (!activeOrder?.driverId && drivers.length > 0) {
      return drivers[0];
    }
    const foundDriver = drivers.find(d => d.id === activeOrder?.driverId);
    return foundDriver || (drivers.length > 0 ? drivers[0] : null);
  };

  // Build tabs array with tracking tab if there's an active order
  const getTabs = () => {
    const tabs = [...TABS];
    if (activeOrder) {
      const trackingExists = tabs.some(t => t.id === 'tracking');
      if (!trackingExists) {
        const cartIndex = tabs.findIndex(t => t.id === 'cart');
        tabs.splice(cartIndex + 1, 0, { id: 'tracking', label: 'Track', icon: '📍' });
      }
    }
    return tabs;
  };
  
  const currentShop = selectedShopOwner ? shops.find(s => s.ownerUsername === selectedShopOwner) : null;
  const orderDriver = getOrderDriver();
  const tabs = getTabs();

  return (
    <div className={`min-h-screen transition-all ${seniorMode ? 'senior-mode' : ''}`} style={{ background: '#f7f9f5', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Huawei cloud bar */}
      <HuaweiCloudStatusBar />

      {/* Header */}
      <header className="spaza-header" style={{ background: '#226b2a', padding: '1rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Brand */}
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
                    parent.innerHTML = '🛒';
                  }
                }}
              />
            </div>
            <div>
              <div className="font-heading" style={{ fontWeight: 800, fontSize: '1.15rem', color: 'white', lineHeight: 1.1 }}>KasiBusket</div>
              <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.65)' }}>Welcome, {user.fullName}!</div>
            </div>
          </div>
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <select
              value={language}
              onChange={e => { const l = e.target.value; setLanguage(l); db.updateUser(user.username, { preferredLanguage: l }); toast.info(`Language: ${l}`); }}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '0.6rem', color: 'white', padding: '0.35rem 0.7rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none' }}
            >
              {['English','isiZulu','isiXhosa','Afrikaans','Sepedi','Sesotho','Setswana','Tshivenda','Xitsonga'].map(l => <option key={l} value={l} style={{ color: '#0d1f0e' }}>{l}</option>)}
            </select>
            <button
              onClick={() => setSeniorMode(s => !s)}
              style={{ padding: '0.35rem 0.8rem', background: seniorMode ? '#f59e0b' : 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '0.6rem', color: seniorMode ? '#1a0e00' : 'white', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {seniorMode ? '👴 Senior ON' : '👴 Senior'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '0.3rem 0.8rem 0.3rem 0.3rem', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              <div style={{ width: '1.7rem', height: '1.7rem', background: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#1a0e00' }}>{user.fullName.charAt(0)}</div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'white' }}>{user.fullName.split(' ')[0]}</span>
            </div>
            <button onClick={onLogout} style={{ padding: '0.35rem 0.8rem', background: 'rgba(239,68,68,0.2)', border: '1.5px solid rgba(239,68,68,0.4)', borderRadius: '0.6rem', color: 'white', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #dde8d5', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 8px rgba(34,107,42,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.5rem 1rem', overflowX: 'auto', display: 'flex', gap: '0.3rem', scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: activeTab === tab.id ? '#226b2a' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#4a5b3e',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'cart' && cart.length > 0 && (
                <span style={{ 
                  background: '#f59e0b', 
                  color: '#1a0e00', 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  width: '1.2rem', 
                  height: '1.2rem', 
                  borderRadius: '50%', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginLeft: '0.25rem'
                }}>
                  {cart.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div className="animate-slide-up">
          {activeTab === 'shops' && (
            <AllShops shops={shops} onViewProducts={handleViewShopProducts} />
          )}
          
          {activeTab === 'products' && (
            <ProductCatalog 
              products={products} 
              combos={combos} 
              onAddToCart={addToCart} 
              seniorMode={seniorMode} 
              language={language} 
              selectedShop={currentShop?.shopName} 
              onClearFilter={() => setSelectedShopOwner(null)} 
            />
          )}
          
          {activeTab === 'cart' && (
            <ShoppingCart 
              cart={cart} 
              onRemoveFromCart={removeFromCart} 
              onUpdateQuantity={updateQuantity} 
              onClearCart={clearCart} 
              user={user} 
            />
          )}
          
          {activeTab === 'credit' && <CreditAccount user={user} />}
          
          {activeTab === 'gamification' && <GamificationPanel user={user} orders={orders} />}
          
          {activeTab === 'ai' && <AIRecommendationEngine user={user} products={products} shops={shops} />}
          
          {activeTab === 'blockchain' && <BlockchainCreditViewer user={user} />}
          
          {activeTab === 'senior' && <SeniorQuickOrder products={products} onAddToCart={addToCart} />}
          
          {activeTab === 'disability' && <DisabilitySupportComponent user={user} />}
          
          {activeTab === 'properties' && <PropertyMarketplace />}
          
          {/* Live Delivery Tracking - Correctly implemented */}
          {activeTab === 'tracking' && activeOrder && orderDriver && (
            <LiveDeliveryTracking
              orderId={activeOrder.orderId}
              driver={orderDriver}
              shopLocation={shopLocation}
              customerLocation={customerLocation}
              customerAddress={customerAddress}
              onDeliveryComplete={handleDeliveryComplete}
            />
          )}
          
          {/* Show message when tracking tab is active but no order exists */}
          {activeTab === 'tracking' && !activeOrder && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1f2937' }}>No Active Orders</h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>You don't have any active deliveries at the moment.</p>
              <button
                onClick={() => setActiveTab('shops')}
                style={{ background: '#226b2a', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Start Shopping
              </button>
            </div>
          )}
          
          {/* Show loading state when tracking tab is active but driver not found */}
          {activeTab === 'tracking' && activeOrder && !orderDriver && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚚</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1f2937' }}>Assigning Driver...</h3>
              <p style={{ color: '#6b7280' }}>A delivery driver will be assigned to your order shortly.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}