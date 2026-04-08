import React, { useState } from 'react';
import { Product } from '../../types';

interface SeniorQuickOrderProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

export function SeniorQuickOrder({ products, onAddToCart }: SeniorQuickOrderProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ name: string; items: string[] } | null>(null);

  const quickOrders = [
    { name: 'Bread & Milk', items: ['Bread', 'Milk 1L'], quantities: [2, 2], icon: '🍞', color: '#f59e0b', image: 'https://i.pinimg.com/736x/48/20/4e/48204eef2b5aebc8d9895314d06ec601.jpg' },
    { name: 'Medicine', items: ['Medicine'], quantities: [1], icon: '💊', color: '#ef4444', image: 'https://i.pinimg.com/1200x/2f/15/16/2f1516b5af794edda705940057b2a061.jpg' },
    { name: 'Food Package', items: ['Bread', 'Milk 1L', 'Rice 2kg', 'Sugar 2kg'], quantities: [1, 1, 1, 1], icon: '📦', color: '#8b5cf6', image: 'https://i.pinimg.com/1200x/26/0f/9f/260f9f92f668336ea67b24efeafc08c0.jpg' },
    { name: 'Tea & Sugar', items: ['Tea Bags', 'Sugar 2kg'], quantities: [1, 1], icon: '🍵', color: '#10b981', image: 'https://i.pinimg.com/1200x/83/14/0a/83140aac4162b9fc0773b98d63f162d2.jpg' },
    { name: 'Emergency Order', items: ['Bread', 'Milk 1L', 'Medicine'], quantities: [1, 1, 1], icon: '🚨', color: '#dc2626', image: 'https://i.pinimg.com/1200x/fe/f0/c3/fef0c339a43b6405e541d804f4ce93ef.jpg' },
    { name: 'Weekly Essentials', items: ['Bread', 'Milk 1L', 'Eggs (Dozen)', 'Cooking Oil'], quantities: [2, 2, 1, 1], icon: '📅', color: '#059669', image: 'https://i.pinimg.com/1200x/42/4e/fb/424efbad75eda3ea704671dad4b3b4a1.jpg' }
  ];

  const handleQuickOrder = (order: typeof quickOrders[0]) => {
    let totalAdded = 0;
    order.items.forEach((itemName, index) => {
      const product = products.find(p => p.name === itemName);
      if (product) {
        onAddToCart(product, order.quantities[index]);
        totalAdded++;
      }
    });

    if (totalAdded > 0) {
      setLastOrder({ name: order.name, items: order.items });
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setLastOrder(null);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Success Modal */}
      {showSuccessModal && lastOrder && (
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
                Order Added Successfully!
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#5a6b50',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {lastOrder.name} has been added to your cart.
              </p>
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <p style={{ fontWeight: 600, color: '#166534', marginBottom: '0.75rem' }}>
                  Order Summary:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {lastOrder.items.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                      <span style={{ color: '#226b2a' }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{
                backgroundColor: '#fffbeb',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                border: '1px solid #fcd34d'
              }}>
                <p style={{ fontSize: '0.8rem', color: '#92400e', margin: 0 }}>
                  💰 Remember: Cash payment on delivery only. Driver will call before arrival.
                </p>
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
                Continue Shopping
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
                Items Not Available
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#5a6b50',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                Some items in this quick order are currently out of stock. Please try another order.
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
          <span style={{ fontSize: '2.5rem' }}>👵</span>
          <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
            Senior Quick Order
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#5a6b50', margin: 0 }}>
          One-tap ordering for essential items - designed for our senior community
        </p>
      </div>

      {/* Quick Order Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {quickOrders.map((order, index) => (
          <div
            key={index}
            onClick={() => handleQuickOrder(order)}
            style={{
              cursor: 'pointer',
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: '1px solid #e5e7eb'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            {/* Image Section */}
            <div style={{
              height: '140px',
              background: `linear-gradient(135deg, ${order.color}20, ${order.color}10)`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img
                src={order.image}
                alt={order.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.8
                }}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: order.color,
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                {order.icon}
              </div>
            </div>
            
            {/* Content Section */}
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#0d1f0e',
                marginBottom: '0.75rem'
              }}>
                {order.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: '#5a6b50'
                  }}>
                    <span>{item}</span>
                    <span style={{
                      background: '#f3f4f6',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '9999px',
                      fontWeight: 600,
                      color: '#226b2a'
                    }}>
                      x{order.quantities[i]}
                    </span>
                  </div>
                ))}
              </div>
              <button
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  backgroundColor: '#226b2a',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a5420'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#226b2a'}
              >
                + Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Commands Section */}
      <div className="spaza-card" style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
        border: '2px solid #d8b4fe',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>🎤</span>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#6b21a5' }}>
            Voice Commands Available
          </h3>
        </div>
        
        <button
          onClick={() => alert('🎤 Voice recognition feature coming soon!\n\nFor now, please use the quick order buttons above.\n\nComing features:\n• Speak your order naturally\n• Voice confirmation of items\n• Hands-free ordering')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '1rem',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #6d28d9, #5b21b6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #6d28d9)';
          }}
        >
          🎤 Click & Speak Your Order
        </button>
        
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1rem'
        }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b21a5', marginBottom: '0.5rem' }}>
            Example commands you can say:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#4b5563', padding: '0.25rem 0' }}>• "Order bread and milk"</div>
            <div style={{ fontSize: '0.75rem', color: '#4b5563', padding: '0.25rem 0' }}>• "I need medicine"</div>
            <div style={{ fontSize: '0.75rem', color: '#4b5563', padding: '0.25rem 0' }}>• "Send food package"</div>
            <div style={{ fontSize: '0.75rem', color: '#4b5563', padding: '0.25rem 0' }}>• "Weekly essentials please"</div>
          </div>
        </div>
      </div>

      {/* Cash Delivery Info */}
      <div className="spaza-card" style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
        border: '2px solid #fcd34d',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>💰</span>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#b45309' }}>
            Simple Cash Payment
          </h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💵</div>
            <p style={{ fontWeight: 700, color: '#0d1f0e', marginBottom: '0.25rem' }}>CASH-ON-DELIVERY ONLY</p>
            <p style={{ fontSize: '0.75rem', color: '#5a6b50' }}>No digital payments needed</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏰</div>
            <p style={{ fontWeight: 700, color: '#0d1f0e', marginBottom: '0.25rem' }}>Delivery within 45 min</p>
            <p style={{ fontSize: '0.75rem', color: '#5a6b50' }}>Driver will call before arrival</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
            <p style={{ fontWeight: 700, color: '#0d1f0e', marginBottom: '0.25rem' }}>Receipt Provided</p>
            <p style={{ fontSize: '0.75rem', color: '#5a6b50' }}>Check items before driver leaves</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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