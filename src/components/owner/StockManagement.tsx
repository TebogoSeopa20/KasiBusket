import React, { useState, useEffect } from 'react';
import { Product, SpazaShop } from '../../types';
import { Plus, AlertCircle, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface StockManagementProps {
  shop: SpazaShop;
  products: Product[];
  onStockUpdate?: (productName: string, newStock: number, reorderLevel?: number) => void;
}

export function StockManagement({ shop, products, onStockUpdate }: StockManagementProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [newStock, setNewStock] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'reorder' | 'summary'>('summary');

  // Get product object from name
  const getProduct = (name: string) => products.find(p => p.name === name);

  // Products with low stock
  const lowStockProducts = products.filter(p => p.stock < p.minStockLevel);
  
  // Calculate total inventory value
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  
  // Calculate total units
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !newStock) {
      toast.error('Please select a product and enter stock quantity');
      return;
    }

    const quantity = parseInt(newStock);
    if (quantity <= 0) {
      toast.error('Stock quantity must be greater than 0');
      return;
    }

    const product = getProduct(selectedProduct);
    if (product) {
      const updatedStock = product.stock + quantity;
      onStockUpdate?.(selectedProduct, updatedStock);
      toast.success(`✅ Added ${quantity} units to ${selectedProduct}`);
      setNewStock('');
      setSelectedProduct('');
      setActiveTab('summary');
    }
  };

  const handleSetReorderLevel = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !reorderLevel) {
      toast.error('Please select a product and enter reorder level');
      return;
    }

    const level = parseInt(reorderLevel);
    if (level < 0) {
      toast.error('Reorder level cannot be negative');
      return;
    }

    const product = getProduct(selectedProduct);
    if (product) {
      onStockUpdate?.(selectedProduct, product.stock, level);
      toast.success(`✅ Reorder level set to ${level} for ${selectedProduct}`);
      setReorderLevel('');
      setSelectedProduct('');
      setActiveTab('summary');
    }
  };

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
              <span style={{ fontSize: '2rem' }}>📦</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                Stock Management
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              {shop.name} • Manage your inventory levels
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ 
              padding: '0.5rem 0.75rem', 
              background: 'white', 
              borderRadius: '0.75rem',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '0.6rem', color: '#5a6b50' }}>Total Units</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#226b2a' }}>{totalUnits}</div>
            </div>
            <div style={{ 
              padding: '0.5rem 0.75rem', 
              background: 'white', 
              borderRadius: '0.75rem',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '0.6rem', color: '#5a6b50' }}>Inventory Value</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#226b2a' }}>R{totalInventoryValue.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div style={{
          padding: '1rem',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertCircle size={20} style={{ color: '#dc2626', marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.25rem' }}>
                ⚠️ Low Stock Alert!
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#7f1d1d', marginBottom: '0.5rem' }}>
                {lowStockProducts.length} product(s) below reorder level:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {lowStockProducts.map(p => (
                  <span key={p.name} style={{
                    fontSize: '0.7rem',
                    background: '#fecaca',
                    color: '#991b1b',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px'
                  }}>
                    {p.name}: {p.stock} / {p.minStockLevel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '0.5rem',
        background: '#f9fafb', 
        borderRadius: '0.75rem', 
        padding: '0.25rem'
      }}>
        <button
          onClick={() => setActiveTab('summary')}
          style={{
            padding: '0.6rem',
            borderRadius: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'summary' ? '#226b2a' : 'transparent',
            color: activeTab === 'summary' ? 'white' : '#5a6b50',
            border: 'none'
          }}
        >
          📊 Stock Summary
        </button>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            padding: '0.6rem',
            borderRadius: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'add' ? '#226b2a' : 'transparent',
            color: activeTab === 'add' ? 'white' : '#5a6b50',
            border: 'none'
          }}
        >
          ➕ Add Stock
        </button>
        <button
          onClick={() => setActiveTab('reorder')}
          style={{
            padding: '0.6rem',
            borderRadius: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'reorder' ? '#226b2a' : 'transparent',
            color: activeTab === 'reorder' ? 'white' : '#5a6b50',
            border: 'none'
          }}
        >
          ⚠️ Set Reorder Level
        </button>
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={16} /> Current Stock Levels
            </h3>
          </div>
          <div style={{ padding: '1rem' }}>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📦</div>
                <p style={{ fontSize: '0.85rem', color: '#5a6b50' }}>No products yet. Add products from the Products tab first.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Product</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', color: '#226b2a', fontWeight: 600 }}>Current</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', color: '#226b2a', fontWeight: 600 }}>Min Level</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', color: '#226b2a', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', color: '#226b2a', fontWeight: 600 }}>Price</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                    {products.map(product => {
                      const isLowStock = product.stock < product.minStockLevel;
                      const isOutOfStock = product.stock === 0;
                      
                      return (
                        <tr key={product.name} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 600, color: '#0d1f0e' }}>{product.name}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <span style={{
                              fontWeight: 700,
                              color: isOutOfStock ? '#dc2626' : (isLowStock ? '#f59e0b' : '#226b2a')
                            }}>
                              {product.stock}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', color: '#5a6b50' }}>
                            {product.minStockLevel}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            {isOutOfStock ? (
                              <span style={{
                                background: '#fee2e2',
                                color: '#dc2626',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '9999px',
                                fontSize: '0.65rem',
                                fontWeight: 600
                              }}>
                                Out of Stock
                              </span>
                            ) : isLowStock ? (
                              <span style={{
                                background: '#fef3c7',
                                color: '#f59e0b',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '9999px',
                                fontSize: '0.65rem',
                                fontWeight: 600
                              }}>
                                ⚠️ Low
                              </span>
                            ) : (
                              <span style={{
                                background: '#f0fdf4',
                                color: '#226b2a',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '9999px',
                                fontSize: '0.65rem',
                                fontWeight: 600
                              }}>
                                ✅ Good
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#226b2a' }}>
                            R{product.price.toFixed(2)}
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
      )}

      {/* Add Stock Tab */}
      {activeTab === 'add' && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Stock to Inventory
            </h3>
            <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginTop: '0.25rem' }}>Increase stock levels when you receive new supplies</p>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <form onSubmit={handleAddStock}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                  Select Product *
                </label>
                <select
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '0.85rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    background: 'white',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <option value="">-- Choose a product --</option>
                  {products.map(p => (
                    <option key={p.name} value={p.name}>
                      {p.name} (Current: {p.stock} | Min: {p.minStockLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                  Quantity to Add *
                </label>
                <input
                  type="number"
                  min="1"
                  value={newStock}
                  onChange={e => setNewStock(e.target.value)}
                  placeholder="Enter quantity"
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
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

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#226b2a',
                  color: 'white',
                  border: 'none',
                  padding: '0.7rem',
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
                <Plus size={16} /> Add Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reorder Level Tab */}
      {activeTab === 'reorder' && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} /> Set Reorder Threshold
            </h3>
            <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginTop: '0.25rem' }}>Configure when to receive low-stock alerts</p>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <form onSubmit={handleSetReorderLevel}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                  Select Product *
                </label>
                <select
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '0.85rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    background: 'white',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <option value="">-- Choose a product --</option>
                  {products.map(p => (
                    <option key={p.name} value={p.name}>
                      {p.name} (Current min: {p.minStockLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                  Minimum Reorder Level *
                </label>
                <input
                  type="number"
                  min="1"
                  value={reorderLevel}
                  onChange={e => setReorderLevel(e.target.value)}
                  placeholder="Enter minimum stock level"
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
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
                <p style={{ fontSize: '0.65rem', color: '#5a6b50', marginTop: '0.25rem' }}>
                  You'll receive alerts when stock drops below this level.
                </p>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#226b2a',
                  color: 'white',
                  border: 'none',
                  padding: '0.7rem',
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
                <AlertCircle size={16} /> Update Reorder Level
              </button>
            </form>
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
            Smart Inventory Insights
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>📊 AI-powered restock recommendations</span>
          <span>📈 Demand forecasting</span>
          <span>💰 Optimize stock levels</span>
          <span>📱 Real-time alerts</span>
        </div>
      </div>
    </div>
  );
}