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
    <div style={{ textAlign: 'center', padding: '3rem', color: '#5a6b50' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
      <div className="font-heading" style={{ fontSize: '1.2rem' }}>No shop data available</div>
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
    { title: "Today's Orders", value: shopOrders.length.toString(), icon: '📦', bg: 'linear-gradient(135deg, #2563eb, #1d4ed8)', shadow: 'rgba(37,99,235,0.3)' },
    { title: 'Total Revenue', value: `R ${totalRevenue.toFixed(2)}`, icon: '💰', bg: 'linear-gradient(135deg, #226b2a, #16a34a)', shadow: 'rgba(34,107,42,0.3)' },
    { title: 'Pending Deliveries', value: pendingDeliveries.toString(), icon: '🚚', bg: 'linear-gradient(135deg, #d97706, #f59e0b)', shadow: 'rgba(217,119,6,0.3)' },
    { title: 'Low Stock Items', value: lowStockItems.length.toString(), icon: '⚠️', bg: 'linear-gradient(135deg, #dc2626, #b91c1c)', shadow: 'rgba(220,38,38,0.3)' },
    { title: 'Customer Rating', value: '4.8★', icon: '⭐', bg: 'linear-gradient(135deg, #7c3aed, #6d28d9)', shadow: 'rgba(124,58,237,0.3)' },
    { title: 'Shop Status', value: shop.isOpen ? 'OPEN' : 'CLOSED', icon: shop.isOpen ? '✅' : '❌', bg: shop.isOpen ? 'linear-gradient(135deg, #226b2a, #16a34a)' : 'linear-gradient(135deg, #6b7280, #4b5563)', shadow: shop.isOpen ? 'rgba(34,107,42,0.3)' : 'rgba(107,114,128,0.3)' },
  ];

  const statusColor = (status: string) => {
    if (status === 'Delivered') return { bg: '#dcfce7', color: '#166534' };
    if (status === 'In Progress') return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#dbeafe', color: '#1e40af' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg, #1a5220 0%, #226b2a 60%, #2d8535 100%)', borderRadius: '1.25rem', padding: '1.75rem 2rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(245,158,11,0.12)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '0.2rem 0.7rem', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.6rem', border: '1px solid rgba(255,255,255,0.25)' }}>
            👨‍💼 Owner Dashboard
          </div>
          <h2 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.25rem', color: 'white' }}>Welcome, {shop.ownerName}!</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0 }}>Managing <strong style={{ color: '#f59e0b' }}>{shop.shopName}</strong> • {shop.location}</p>
        </div>
        {shops.length > 1 && (
          <select
            value={activeShopId}
            onChange={e => setActiveShopId(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '0.75rem', color: 'white', padding: '0.55rem 1rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none' }}
          >
            {shops.map(s => <option key={s.shopId} value={s.shopId} style={{ color: '#0d1f0e' }}>{s.shopName} – {s.location}</option>)}
          </select>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {statCards.map((card, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s`, background: card.bg, borderRadius: '1rem', padding: '1.25rem', color: 'white', boxShadow: `0 4px 20px ${card.shadow}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', fontSize: '3rem', opacity: 0.2 }}>{card.icon}</div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.85, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</div>
              <div className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="spaza-card" style={{ padding: '1.5rem' }}>
        <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: '#0d1f0e' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: '🔄 Toggle Shop Status', color: '#2563eb' },
            { label: '📦 Add New Stock', color: '#226b2a' },
            { label: '📋 View All Orders', color: '#7c3aed' },
            { label: '🚚 Manage Drivers', color: '#d97706' },
          ].map(action => (
            <button key={action.label}
              style={{ padding: '0.85rem 1rem', background: action.color, color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'opacity 0.2s, transform 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="spaza-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>📋 Recent Orders</h3>
          <span className="spaza-badge spaza-badge-green">{shopOrders.length} total</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="spaza-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shopOrders.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: '#5a6b50' }}>No orders yet today 📭</td></tr>
              ) : (
                shopOrders.map((order, i) => {
                  const { bg, color } = statusColor(order.status);
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, fontSize: '0.8rem', color: '#226b2a' }}>{order.orderId}</td>
                      <td>{order.deliveryAddress?.split(',')?.[0] || 'N/A'}</td>
                      <td style={{ fontWeight: 700, color: '#226b2a' }}>R {(order.total || 0).toFixed(2)}</td>
                      <td><span className="spaza-badge" style={{ background: bg, color }}>{order.status}</span></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Drivers */}
      <div className="spaza-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>🚚 Available Drivers</h3>
          <span className="spaza-badge spaza-badge-green">{availableDrivers.length} available</span>
        </div>
        {availableDrivers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#5a6b50', fontSize: '0.875rem' }}>No drivers currently available in {shop.location}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {availableDrivers.map((driver, i) => (
              <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s`, background: '#f7f9f5', border: '1.5px solid #dde8d5', borderRadius: '0.875rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, #226b2a, #16a34a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '1rem' }}>🚗</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d1f0e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{driver.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#5a6b50' }}>{driver.vehicleType}</div>
                </div>
                <span className="spaza-badge spaza-badge-green">Ready</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: '#991b1b', margin: 0 }}>Low Stock Alert</h3>
            <span className="spaza-badge spaza-badge-red">{lowStockItems.length} items</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {lowStockItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 600, color: '#7f1d1d' }}>{item.name}</span>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>Only {item.stock} left!</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
