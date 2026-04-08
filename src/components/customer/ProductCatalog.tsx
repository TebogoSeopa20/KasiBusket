import React, { useState } from 'react';
import { Product, Combo } from '../../types';

interface ProductCatalogProps {
  products: Product[];
  combos?: Combo[];
  onAddToCart: (product: Product | Combo, quantity: number) => void;
  seniorMode: boolean;
  language: string;
  selectedShop?: string | null;
  onClearFilter?: () => void;
}

export function ProductCatalog({ products, combos = [], onAddToCart, seniorMode, language, selectedShop, onClearFilter }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreditOnly, setShowCreditOnly] = useState(false);
  const [showSeniorOnly, setShowSeniorOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Product image mapping
  const getProductImage = (productName: string): string => {
    const imageMap: Record<string, string> = {
      'Bread': 'https://i.pinimg.com/736x/48/20/4e/48204eef2b5aebc8d9895314d06ec601.jpg',
      'Milk 1L': 'https://i.pinimg.com/1200x/fe/f0/c3/fef0c339a43b6405e541d804f4ce93ef.jpg',
      'Rice 2kg': 'https://i.pinimg.com/1200x/26/0f/9f/260f9f92f668336ea67b24efeafc08c0.jpg',
      'Medicine': 'https://i.pinimg.com/1200x/2f/15/16/2f1516b5af794edda705940057b2a061.jpg',
      'Cooking Oil': 'https://i.pinimg.com/736x/2e/53/d7/2e53d7ac43f6d2cc512504af3543f640.jpg',
      'Sugar 2kg': 'https://i.pinimg.com/736x/cb/e2/36/cbe236a064876a71bb0c7da10e46e863.jpg',
      'Tea Bags': 'https://i.pinimg.com/1200x/83/14/0a/83140aac4162b9fc0773b98d63f162d2.jpg',
      'Eggs (Dozen)': 'https://i.pinimg.com/1200x/42/4e/fb/424efbad75eda3ea704671dad4b3b4a1.jpg',
      'Kota': 'https://i.pinimg.com/736x/bf/aa/9b/bfaa9bda8c7a9492502cc1501ddf73cf.jpg',
      'Bunny Chow': 'https://i.pinimg.com/1200x/d1/05/36/d10536471c8cf92badddbd4f3d8e2ec6.jpg',
      'Gatsby': 'https://i.pinimg.com/736x/0c/bb/d5/0cbbd508e88ba327035ef295e0eb36f6.jpg'
    };
    
    return imageMap[productName] || 'https://i.pinimg.com/736x/48/20/4e/48204eef2b5aebc8d9895314d06ec601.jpg';
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (showCreditOnly && !product.availableOnCredit) return false;
    if (showSeniorOnly && !product.seniorFavorite) return false;
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAddToCart = (product: Product, quantity = 1) => {
    if (product.stock === 0) { alert('Product out of stock!'); return; }
    onAddToCart(product, quantity);
    setAddedItems(prev => new Set(prev).add(product.name));
    setTimeout(() => setAddedItems(prev => { const n = new Set(prev); n.delete(product.name); return n; }), 1500);
  };

  const handleAddCombo = (combo: Combo) => {
    onAddToCart(combo, 1);
    setAddedItems(prev => new Set(prev).add(combo.name));
    setTimeout(() => setAddedItems(prev => { const n = new Set(prev); n.delete(combo.name); return n; }), 1500);
  };

  const CATEGORY_EMOJIS: Record<string, string> = {
    'Grocery': '🛒', 'Groceries': '🛒', 'Beverages': '🥤', 'Drinks': '🥤', 'Snacks': '🍿',
    'Dairy': '🥛', 'Bread': '🍞', 'Meat': '🥩', 'Produce': '🥦', 'Fruits': '🍎',
    'Airtime': '📱', 'Household': '🏠', 'Personal Care': '🧴', 'Frozen': '🧊', 'All': '🔎',
    'Health': '💊', 'Traditional Food': '🍲'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="spaza-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.2rem', color: '#0d1f0e' }}>
              🛒 Product Catalogue
              {selectedShop && <span style={{ color: '#226b2a', fontWeight: 700 }}> – {selectedShop}</span>}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#5a6b50', margin: 0 }}>
              {filteredProducts.length} products available {combos.length > 0 && `+ ${combos.length} combo deals`}
            </p>
          </div>
          {selectedShop && onClearFilter && (
            <button className="spaza-btn-ghost" style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }} onClick={onClearFilter}>
              ✕ Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Search & filters */}
      <div className="spaza-card" style={{ padding: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input className="spaza-input" style={{ paddingLeft: '2.2rem' }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[{ label: '💳 Credit Only', value: showCreditOnly, setter: setShowCreditOnly }, { label: '🎯 Senior Picks', value: showSeniorOnly, setter: setShowSeniorOnly }].map(f => (
            <button key={f.label}
              onClick={() => f.setter(v => !v)}
              style={{ padding: '0.45rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: '1.5px solid', borderColor: f.value ? '#226b2a' : '#dde8d5', background: f.value ? '#e8f5e2' : 'white', color: f.value ? '#226b2a' : '#5a6b50', transition: 'all 0.2s' }}
            >{f.label}</button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: '1.5px solid', borderColor: selectedCategory === cat ? '#226b2a' : '#dde8d5', background: selectedCategory === cat ? '#226b2a' : 'white', color: selectedCategory === cat ? 'white' : '#5a6b50', transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <span>{CATEGORY_EMOJIS[cat] || '📦'}</span>
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Combo deals */}
      {combos.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d1f0e', margin: 0 }}>💥 Combo Deals</h3>
            <span className="spaza-badge spaza-badge-amber">Save More!</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {combos.map((combo, i) => {
              const added = addedItems.has(combo.name);
              return (
                <div key={combo.id || i} className="spaza-card animate-slide-up" style={{ animationDelay: `${i * 0.04}s`, padding: '1rem', background: 'linear-gradient(135deg, #fef3c7, #fffbeb)', border: '1.5px solid #fcd34d' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 className="font-heading" style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0d1f0e' }}>{combo.name}</h4>
                    <span className="spaza-badge" style={{ background: '#f59e0b', color: '#1a0e00' }}>-{Math.round(combo.discountPercentage)}%</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#5a6b50', margin: '0 0 0.75rem' }}>Bundle deal • Multiple products</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="font-heading" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#226b2a' }}>R {combo.price.toFixed(2)}</span>
                    <button className={added ? 'spaza-btn-ghost' : 'spaza-btn-secondary'} style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }} onClick={() => handleAddCombo(combo)}>
                      {added ? '✅ Added' : '+ Add Combo'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Products grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d1f0e', margin: 0 }}>Products</h3>
          <span style={{ fontSize: '0.78rem', color: '#5a6b50' }}>{filteredProducts.length} items</span>
        </div>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#5a6b50' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <div className="font-heading" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No products found</div>
            <div style={{ fontSize: '0.85rem' }}>Try adjusting your filters</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {filteredProducts.map((product, i) => {
              const added = addedItems.has(product.name);
              const inStock = product.stock > 0;
              const productImage = getProductImage(product.name);
              
              return (
                <div key={product.name} className="spaza-card animate-slide-up" style={{ animationDelay: `${i * 0.03}s`, overflow: 'hidden', opacity: inStock ? 1 : 0.7 }}>
                  {/* Image */}
                  <div style={{ position: 'relative', height: '130px', overflow: 'hidden', borderRadius: '0.75rem 0.75rem 0 0' }}>
                    <img
                      src={productImage}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)' }} />
                    {!inStock && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#dc2626', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>Out of Stock</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '0.4rem', left: '0.4rem', display: 'flex', gap: '0.3rem' }}>
                      {product.availableOnCredit && <span className="spaza-badge" style={{ background: 'rgba(245,158,11,0.9)', color: '#1a0e00', fontSize: '0.6rem' }}>💳</span>}
                      {product.seniorFavorite && <span className="spaza-badge" style={{ background: 'rgba(124,58,237,0.85)', color: 'white', fontSize: '0.6rem' }}>🎯</span>}
                    </div>
                    <div style={{ position: 'absolute', bottom: '0.4rem', left: '0.5rem' }}>
                      <span style={{ background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '0.65rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '9999px', backdropFilter: 'blur(4px)' }}>{product.category}</span>
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ padding: '0.75rem' }}>
                    <h4 className="font-heading" style={{ fontSize: seniorMode ? '1rem' : '0.875rem', fontWeight: 700, margin: '0 0 0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h4>
                    <p style={{ fontSize: '0.72rem', color: '#5a6b50', margin: '0 0 0.65rem' }}>Stock: {product.stock} units</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="font-heading" style={{ fontWeight: 800, fontSize: seniorMode ? '1.1rem' : '0.95rem', color: '#226b2a' }}>R {product.price.toFixed(2)}</span>
                      <button
                        disabled={!inStock}
                        onClick={() => handleAddToCart(product)}
                        className={added ? 'spaza-btn-ghost' : 'spaza-btn-primary'}
                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', borderRadius: '9999px' }}
                      >
                        {added ? '✅' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}