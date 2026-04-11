import React, { useState } from 'react';
import { SpazaShop, Product, DeliveryDriver, Order } from '../../types';

interface OwnerDashboardProps {
  shops: SpazaShop[];
  products: Product[];
  drivers: DeliveryDriver[];
  orders: Order[];
}

export function OwnerDashboard({ shops, products, drivers, orders }: OwnerDashboardProps) {
  const [activeShopId, setActiveShopId] = useState(shops?.[0]?.shopId || '');

  const shop = shops.find(s => s.shopId === activeShopId) || shops[0];
  if (!shop) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ 
        padding: '3rem', 
        background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)', 
        border: '1px solid #bbf7d0',
        borderRadius: '1rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d1f0e', marginBottom: '0.5rem' }}>
          No shop data available
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#5a6b50' }}>Please register a shop first</p>
      </div>
    </div>
  );

  const shopProducts = products.filter(p => p.shopOwner === shop.ownerUsername);
  const lowStockItems = shopProducts.filter(p => (p.stock ?? 0) <= (p.minStockLevel ?? 0));
  const availableDrivers = drivers.filter(d => d.assignedShop === shop.location && d.available);
  const shopOrders = orders.filter(order =>
    order.items.some(item => typeof item.product === 'object' && 'shopOwner' in item.product && (item.product as any).shopOwner === shop.ownerUsername)
  );
  const totalRevenue = shopOrders.reduce((acc, order) => acc + (order.total || 0), 0);
  const pendingDeliveries = shopOrders.filter(o => o.status !== 'Delivered').length;

  const statCards = [
    { title: "Today's Orders", value: shopOrders.length.toString(), icon: '📦', bg: '#2563eb' },
    { title: 'Total Revenue', value: `R ${totalRevenue.toFixed(2)}`, icon: '💰', bg: '#226b2a' },
    { title: 'Pending Deliveries', value: pendingDeliveries.toString(), icon: '🚚', bg: '#f59e0b' },
    { title: 'Low Stock Items', value: lowStockItems.length.toString(), icon: '⚠️', bg: '#dc2626' },
    { title: 'Customer Rating', value: '4.8★', icon: '⭐', bg: '#8b5cf6' },
    { title: 'Shop Status', value: shop.isOpen ? 'OPEN' : 'CLOSED', icon: shop.isOpen ? '✅' : '❌', bg: shop.isOpen ? '#226b2a' : '#6b7280' },
  ];

  const statusColor = (status: string) => {
    if (status === 'Delivered') return { bg: '#f0fdf4', color: '#226b2a', border: '#bbf7d0' };
    if (status === 'In Progress') return { bg: '#fef3c7', color: '#f59e0b', border: '#fde68a' };
    return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, #1a5220, #226b2a)', 
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.25rem', 
            background: 'rgba(255,255,255,0.15)', 
            borderRadius: '9999px', 
            padding: '0.2rem 0.6rem',
            fontSize: '0.65rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: 'rgba(255,255,255,0.9)'
          }}>
            👨‍💼 Owner Dashboard
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem', color: 'white' }}>
            Welcome, {shop.ownerName}!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', margin: 0 }}>
            Managing <strong style={{ color: '#f59e0b' }}>{shop.shopName}</strong> • {shop.location}
          </p>
        </div>
        {shops.length > 1 && (
          <select
            value={activeShopId}
            onChange={e => setActiveShopId(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: '0.75rem',
              color: 'white',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              outline: 'none'
            }}
          >
            {shops.map(s => (
              <option key={s.shopId} value={s.shopId} style={{ color: '#0d1f0e' }}>
                {s.shopName} – {s.location}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {statCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: card.bg,
              borderRadius: '1rem',
              padding: '1rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', fontSize: '2.5rem', opacity: 0.15 }}>
              {card.icon}
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.85, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.2 }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡</span> Quick Actions
          </h3>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: '🔄 Toggle Shop Status', color: '#2563eb' },
              { label: '📦 Add New Stock', color: '#226b2a' },
              { label: '📋 View All Orders', color: '#8b5cf6' },
              { label: '🚚 Manage Drivers', color: '#f59e0b' },
            ].map(action => (
              <button
                key={action.label}
                style={{
                  padding: '0.75rem',
                  background: action.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📋</span> Recent Orders
            </h3>
            <span style={{ fontSize: '0.65rem', background: '#f0fdf4', color: '#226b2a', padding: '0.2rem 0.5rem', borderRadius: '9999px', border: '1px solid #bbf7d0' }}>
              {shopOrders.length} total
            </span>
          </div>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Order ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', color: '#226b2a', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', color: '#226b2a', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                {shopOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#5a6b50' }}>
                      No orders yet today 📭
                    </td>
                  </tr>
                ) : (
                  shopOrders.map((order, i) => {
                    const { bg, color, border } = statusColor(order.status);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600, fontSize: '0.75rem', color: '#226b2a' }}>
                          {order.orderId?.slice(0, 8)}...
                        </td>
                        <td style={{ padding: '0.75rem', color: '#0d1f0e' }}>
                          {order.deliveryAddress?.split(',')?.[0] || 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: '#226b2a' }}>
                          R {(order.total || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            background: bg,
                            color: color,
                            border: `1px solid ${border}`
                          }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Available Drivers Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🚚</span> Available Drivers
            </h3>
            <span style={{ fontSize: '0.65rem', background: '#f0fdf4', color: '#226b2a', padding: '0.2rem 0.5rem', borderRadius: '9999px', border: '1px solid #bbf7d0' }}>
              {availableDrivers.length} available
            </span>
          </div>
        </div>
        <div style={{ padding: '1rem' }}>
          {availableDrivers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#5a6b50', fontSize: '0.8rem' }}>
              No drivers currently available in {shop.location}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {availableDrivers.map((driver, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #226b2a, #48bb78)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>🚗</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0d1f0e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {driver.name}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#5a6b50' }}>{driver.vehicleType}</div>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    background: '#f0fdf4',
                    color: '#226b2a',
                    border: '1px solid #bbf7d0'
                  }}>
                    Ready
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div style={{
          padding: '1rem',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1rem' }}>⚠️</span>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991b1b', margin: 0 }}>
              Low Stock Alert
            </h3>
            <span style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.6rem',
              fontWeight: 600,
              background: '#fecaca',
              color: '#991b1b'
            }}>
              {lowStockItems.length} items
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {lowStockItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ fontWeight: 600, color: '#7f1d1d' }}>{item.name}</span>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>Only {item.stock} left!</span>
              </div>
            ))}
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
            AI-Powered Business Insights
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>📊 Real-time sales analytics</span>
          <span>📈 Demand forecasting</span>
          <span>💰 Smart pricing recommendations</span>
          <span>🚚 Route optimization for drivers</span>
          <span>📱 Push notifications for customers</span>
        </div>
      </div>
    </div>
  );
}