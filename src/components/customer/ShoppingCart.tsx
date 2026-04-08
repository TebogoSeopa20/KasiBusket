import React, { useState } from 'react';
import { CartItem, User } from '../../types';

interface ShoppingCartProps {
  cart: CartItem[];
  user: User;
  onUpdateQuantity: (productName: string, quantity: number) => void;
  onRemoveFromCart: (productName: string) => void;
  onClearCart: () => void;
}

export function ShoppingCart({ cart, user, onUpdateQuantity, onRemoveFromCart, onClearCart }: ShoppingCartProps) {
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT' | 'MOBILE'>('CASH');
  const [deliveryAddress, setDeliveryAddress] = useState(user.address || '');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const interest = paymentMethod === 'CREDIT' ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee + interest;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    if (!deliveryAddress.trim()) { alert('Please enter a delivery address!'); return; }
    const order = {
      orderId: `ORD-${Date.now()}`,
      items: cart,
      total,
      deliveryAddress,
      paymentMethod,
      status: 'Preparing',
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('activeOrder', JSON.stringify(order));
    onClearCart();
  };

  const PAYMENT_OPTIONS = [
    { value: 'CASH', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
    { value: 'CREDIT', icon: '💳', label: 'Pay Later (Credit)', desc: `10% interest • Due in 30 days` },
    { value: 'MOBILE', icon: '📱', label: 'Mobile Money', desc: 'Pay via mobile payment platform' },
  ];

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
              <span style={{ fontSize: '2rem' }}>🛒</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                Your Shopping Cart
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              {totalItems} items • Subtotal: R{subtotal.toFixed(2)}
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => { if (window.confirm('Clear cart?')) onClearCart(); }}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fecaca'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; }}
            >
              🗑️ Clear Cart
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0d1f0e' }}>Your cart is empty</h3>
          <p style={{ fontSize: '0.85rem', color: '#5a6b50' }}>Add some products to get started!</p>
        </div>
      ) : (
        <>
          {/* Cart Items Card */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📦</span> Items ({totalItems})
              </h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cart.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: '#f9fafb',
                      borderRadius: '0.75rem',
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Product Icon */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #e8f5e2, #d1fae5)',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      flexShrink: 0
                    }}>
                      🛒
                    </div>
                    
                    {/* Product Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0d1f0e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>
                        R{item.product.price.toFixed(2)} each
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => onUpdateQuantity(item.product.name, item.quantity - 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: '1.5px solid #e5e7eb',
                          background: 'white',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          color: '#226b2a'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#226b2a'; e.currentTarget.style.background = '#f0fdf4'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white'; }}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '1.5rem', textAlign: 'center', color: '#0d1f0e' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.name, item.quantity + 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: '1.5px solid #e5e7eb',
                          background: 'white',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          color: '#226b2a'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#226b2a'; e.currentTarget.style.background = '#f0fdf4'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white'; }}
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Item Total */}
                    <div style={{ fontWeight: 800, color: '#226b2a', minWidth: '70px', textAlign: 'right', fontSize: '0.9rem' }}>
                      R{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveFromCart(item.product.name)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#dc2626',
                        fontSize: '1rem',
                        padding: '0.25rem',
                        transition: 'transform 0.2s',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#fee2e2'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'none'; }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>💳</span> Payment Method
              </h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {PAYMENT_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      border: `1.5px solid ${paymentMethod === opt.value ? '#226b2a' : '#e5e7eb'}`,
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      background: paymentMethod === opt.value ? '#f0fdf4' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value as any)}
                      style={{ accentColor: '#226b2a', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0d1f0e' }}>{opt.label}</div>
                      <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📍</span> Delivery Address
              </h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <input
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
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

          {/* Live Tracking Info Card */}
          <div style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)',
            border: '1px solid #bbf7d0',
            borderRadius: '1rem'
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#226b2a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🗺️</span> Live Delivery Tracking Included
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {['Real-time driver location', 'Instant nearby notifications', 'Arrival alerts', 'Direct driver calling'].map(feature => (
                <div key={feature} style={{ fontSize: '0.7rem', color: '#226b2a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ color: '#226b2a', fontWeight: 700 }}>✓</span> {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🧾</span> Order Summary
              </h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#0d1f0e' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>R{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#5a6b50' }}>
                  <span>Delivery fee</span>
                  <span style={{ fontWeight: 600 }}>R{deliveryFee.toFixed(2)}</span>
                </div>
                {interest > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#f59e0b' }}>
                    <span>Credit interest (10%)</span>
                    <span style={{ fontWeight: 600 }}>R{interest.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ borderTop: '1.5px solid #e5e7eb', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0d1f0e' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#226b2a' }}>R{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleCheckout}
              style={{
                flex: 1,
                background: '#226b2a',
                color: 'white',
                border: 'none',
                padding: '0.9rem',
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
              ✅ Place Order & Track Live
            </button>
          </div>
        </>
      )}
    </div>
  );
}