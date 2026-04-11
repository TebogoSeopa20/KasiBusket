import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Product, Combo } from '../../types';
import { db } from '../../services/DatabaseService';

interface ProductManagementProps {
  shopId: string;
  shopName: string;
  ownerUsername: string;
  supabaseUrl: string;
  publicAnonKey: string;
  combos?: Combo[];
  addCombo?: (combo: Combo) => void;
}

export function ProductManagement({ 
  shopId, 
  shopName, 
  ownerUsername, 
  supabaseUrl, 
  publicAnonKey,
  combos = [],
  addCombo
}: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [stock, setStock] = useState('');
  const [minStockLevel, setMinStockLevel] = useState('10');
  const [description, setDescription] = useState('');
  const [availableOnCredit, setAvailableOnCredit] = useState(true);
  const [seniorFavorite, setSeniorFavorite] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  const categories = [
    'Groceries', 'Beverages', 'Snacks', 'Household', 'Personal Care',
    'Bread & Bakery', 'Dairy', 'Frozen Foods', 'Toiletries', 'Other'
  ];

  useEffect(() => {
    loadProducts();
  }, [shopId, ownerUsername]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = db.getProductsByOwner(ownerUsername);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      toast.error('Please fill in required fields');
      return;
    }

    const productData: Product = {
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      minStockLevel: parseInt(minStockLevel),
      shopLocation: shopName,
      seniorFavorite,
      shopOwner: ownerUsername,
      availableOnCredit,
      description: { en: description || `${name} fresh at ${shopName}` },
      expiryDate: expiryDate || undefined
    };

    db.saveProduct(productData);
    toast.success('Product saved successfully');
    resetForm();
    setShowAddForm(false);
    loadProducts();
  };

  const handleDeleteProduct = (productName: string) => {
    if (confirm('Delete this product?')) {
      db.deleteProduct(productName, ownerUsername);
      toast.success('Product deleted');
      loadProducts();
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setStock(product.stock.toString());
    setMinStockLevel(product.minStockLevel.toString());
    setDescription(product.description?.en || '');
    setAvailableOnCredit(product.availableOnCredit);
    setSeniorFavorite(product.seniorFavorite);
    setExpiryDate(product.expiryDate || '');
    setShowAddForm(true);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('Groceries');
    setStock('');
    setMinStockLevel('10');
    setDescription('');
    setAvailableOnCredit(true);
    setSeniorFavorite(false);
    setExpiryDate('');
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ 
          padding: '2rem', 
          background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)', 
          border: '1px solid #bbf7d0',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1s ease-in-out infinite' }}>📦</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d1f0e', marginBottom: '0.5rem' }}>
            Loading products...
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#5a6b50' }}>Fetching your inventory</p>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

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
                Inventory Management
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              {shopName} Shop Floor • {products.length} products
            </p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: '#226b2a',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '0.75rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a5420'}
              onMouseLeave={e => e.currentTarget.style.background = '#226b2a'}
            >
              <Plus size={16} /> Add Item
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0 }}>
              {editingProduct ? '✏️ Update Product' : '✨ New Product'}
            </h3>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <form onSubmit={handleAddProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Product Name *
                  </label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Price (R) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Min Stock Level
                  </label>
                  <input
                    type="number"
                    value={minStockLevel}
                    onChange={e => setMinStockLevel(e.target.value)}
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '0.85rem',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                    Expiry Date (optional)
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '0.85rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s',
                    resize: 'vertical'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#226b2a'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={availableOnCredit} onChange={e => setAvailableOnCredit(e.target.checked)} />
                  <span style={{ fontSize: '0.8rem', color: '#0d1f0e' }}>💳 Allow Credit</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={seniorFavorite} onChange={e => setSeniorFavorite(e.target.checked)} />
                  <span style={{ fontSize: '0.8rem', color: '#0d1f0e' }}>👴 Senior Mode Favorite</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  style={{
                    background: '#226b2a',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a5420'}
                  onMouseLeave={e => e.currentTarget.style.background = '#226b2a'}
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
                <button
                  type="button"
                  onClick={() => { resetForm(); setShowAddForm(false); }}
                  style={{
                    background: '#f3f4f6',
                    color: '#5a6b50',
                    border: 'none',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={16} /> All Products
          </h3>
          <span style={{ fontSize: '0.7rem', color: '#5a6b50' }}>{products.length} items</span>
        </div>

        {products.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📦</div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50' }}>No products found. Click "Add Item" to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {products.map((product) => {
              const isLowStock = product.stock <= product.minStockLevel;
              const isExpiring = product.expiryDate && new Date(product.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
              
              return (
                <div
                  key={product.name}
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: `1px solid ${isLowStock ? '#fef3c7' : '#e5e7eb'}`,
                    transition: 'transform 0.2s, box-shadow 0.2s'
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
                  {/* Product Image Placeholder */}
                  <div style={{
                    height: '120px',
                    background: isLowStock ? '#fef3c7' : '#f9fafb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `1px solid ${isLowStock ? '#fde68a' : '#e5e7eb'}`
                  }}>
                    <Package size={48} style={{ color: isLowStock ? '#f59e0b' : '#9ca3af' }} />
                  </div>
                  
                  {/* Product Info */}
                  <div style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d1f0e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </h4>
                      {product.seniorFavorite && <span style={{ fontSize: '0.75rem' }}>👴</span>}
                    </div>
                    
                    <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>{product.category}</p>
                    
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#226b2a', marginBottom: '0.5rem' }}>
                      R{product.price.toFixed(2)}
                    </div>
                    
                    {/* Stock Status */}
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: '#5a6b50' }}>Stock</span>
                        <span style={{ fontWeight: 600, color: isLowStock ? '#f59e0b' : '#226b2a' }}>
                          {product.stock} / {product.minStockLevel}
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        background: '#e5e7eb',
                        borderRadius: '9999px',
                        height: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(100, (product.stock / product.minStockLevel) * 100)}%`,
                          height: '100%',
                          background: isLowStock ? '#f59e0b' : '#226b2a',
                          borderRadius: '9999px'
                        }} />
                      </div>
                    </div>
                    
                    {/* Expiry Warning */}
                    {isExpiring && (
                      <div style={{ fontSize: '0.6rem', color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>⚠️</span> Expires soon
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => handleEditProduct(product)}
                        style={{
                          flex: 1,
                          background: '#f3f4f6',
                          color: '#5a6b50',
                          border: 'none',
                          padding: '0.4rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.name)}
                        style={{
                          flex: 1,
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          padding: '0.4rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Combo Deals Section */}
      {combos && combos.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎁</span> Combo Deals
            </h3>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {combos.map((combo, idx) => {
                // Get product count safely - if combo has productIds array, use that
                const productCount = combo.productIds?.length || combo.items?.length || 0;
                
                return (
                  <div key={idx} style={{
                    padding: '0.75rem',
                    background: '#fef3c7',
                    borderRadius: '0.75rem',
                    border: '1px solid #fde68a'
                  }}>
                    <div style={{ fontWeight: 700, color: '#0d1f0e', marginBottom: '0.25rem' }}>{combo.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.5rem' }}>
                      {productCount} {productCount === 1 ? 'item' : 'items'}
                    </div>
                    <div style={{ fontWeight: 800, color: '#226b2a' }}>
                      R{combo.price ? combo.price.toFixed(2) : '0.00'}
                    </div>
                    {combo.discountPercentage && (
                      <div style={{ fontSize: '0.65rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                        Save {combo.discountPercentage}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}