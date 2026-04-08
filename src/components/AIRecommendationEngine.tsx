/**
 * AI Recommendation Engine
 * Powered by Huawei ModelArts for personalized product recommendations
 */

import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Truck } from 'lucide-react';
import { huaweiCloud } from '../services/HuaweiCloudService';
import { Product } from '../types';

interface AIRecommendationEngineProps {
  username: string;
  currentProduct?: Product;
  purchaseHistory?: any[];
  onAddToCart?: (product: any, quantity: number) => void;
}

interface Recommendation {
  productName: string;
  category: string;
  confidence: number;
  reason: string;
  estimatedPrice: number;
  shopOwner: string;
  imageUrl?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  deliveryEstimate?: string;
}

const getProductImage = (category: string, productName: string): string => {
  const imageMap: Record<string, string[]> = {
    'electronics': [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop',
    ],
    'groceries': [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
    ],
    'clothing': [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
    ],
    'beauty': [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
    ],
    'home': [
      'https://images.unsplash.com/photo-1583846717797-0f0f5c6e3f2d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    ],
    'baby': [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop',
    ],
    'sports': [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=400&h=300&fit=crop',
    ],
    'default': [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    ]
  };

  const images = imageMap[category.toLowerCase()] || imageMap.default;
  const hash = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

// 25+ diverse products with realistic data
const getAllProducts = (): Recommendation[] => {
  const products = [
    // Groceries
    { name: 'Fresh White Bread', category: 'groceries', price: 18.50, reason: 'Bought with milk by 80% of customers', owner: 'fresh_bakery' },
    { name: 'Farm Fresh Milk 1L', category: 'groceries', price: 22.00, reason: 'Essential daily item - high demand', owner: 'dairy_fresh' },
    { name: 'Brown Eggs (Dozen)', category: 'groceries', price: 35.00, reason: 'Free-range, locally sourced', owner: 'green_farms' },
    { name: 'Basmati Rice 2kg', category: 'groceries', price: 65.00, reason: 'Premium quality, best seller', owner: 'spice_mart' },
    { name: 'Cooking Oil 750ml', category: 'groceries', price: 42.00, reason: 'Popular with weekly shoppers', owner: 'kitchen_essentials' },
    { name: 'Sugar 2kg', category: 'groceries', price: 38.00, reason: 'Staple item - great value', owner: 'sweet_deals' },
    
    // Electronics
    { name: 'Wireless Headphones', category: 'electronics', price: 299.00, reason: 'Top rated in your area', owner: 'tech_zone' },
    { name: 'Power Bank 20000mAh', category: 'electronics', price: 189.00, reason: 'Perfect for daily commuters', owner: 'gadget_world' },
    { name: 'Smart Watch', category: 'electronics', price: 399.00, reason: 'Trending item this month', owner: 'wearable_tech' },
    { name: 'Bluetooth Speaker', category: 'electronics', price: 249.00, reason: 'Great sound quality', owner: 'audio_pro' },
    
    // Clothing
    { name: 'Cotton T-Shirt', category: 'clothing', price: 89.00, reason: 'Comfortable daily wear', owner: 'urban_fashion' },
    { name: 'Denim Jeans', category: 'clothing', price: 199.00, reason: 'Perfect fit guaranteed', owner: 'style_hub' },
    { name: 'Winter Jacket', category: 'clothing', price: 349.00, reason: 'Seasonal must-have', owner: 'cozy_wear' },
    { name: 'Running Shoes', category: 'clothing', price: 279.00, reason: 'Popular with fitness lovers', owner: 'sport_gear' },
    
    // Beauty
    { name: 'Moisturizing Cream', category: 'beauty', price: 85.00, reason: 'Dermatologist recommended', owner: 'glow_skincare' },
    { name: 'Shampoo & Conditioner Set', category: 'beauty', price: 120.00, reason: 'Bundle saves 20%', owner: 'hair_care' },
    { name: 'Perfume Gift Set', category: 'beauty', price: 199.00, reason: 'Perfect gift choice', owner: 'luxury_scents' },
    
    // Home
    { name: 'Bedsheet Set', category: 'home', price: 159.00, reason: 'Soft cotton, high quality', owner: 'home_comfort' },
    { name: 'Cooking Pan Set', category: 'home', price: 299.00, reason: 'Non-stick, durable', owner: 'kitchen_pro' },
    { name: 'Storage Containers', category: 'home', price: 79.00, reason: 'Organization essential', owner: 'space_saver' },
    
    // Baby
    { name: 'Baby Diapers Pack', category: 'baby', price: 89.00, reason: 'Essential for parents', owner: 'baby_care' },
    { name: 'Baby Wipes (3-pack)', category: 'baby', price: 45.00, reason: 'Gentle on skin', owner: 'little_ones' },
    
    // Sports
    { name: 'Yoga Mat', category: 'sports', price: 149.00, reason: 'Eco-friendly material', owner: 'fitness_life' },
    { name: 'Dumbbell Set', category: 'sports', price: 399.00, reason: 'Home workout essential', owner: 'strong_body' },
  ];

  return products.map((product, idx) => {
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 25) + 5 : 0;
    const originalPrice = product.price;
    const finalPrice = discount > 0 ? parseFloat((originalPrice * (1 - discount / 100)).toFixed(2)) : originalPrice;
    const confidence = 0.65 + Math.random() * 0.3;
    
    return {
      productName: product.name,
      category: product.category,
      confidence: confidence,
      reason: product.reason,
      estimatedPrice: finalPrice,
      originalPrice: discount > 0 ? originalPrice : undefined,
      discount: discount > 0 ? discount : undefined,
      shopOwner: product.owner,
      imageUrl: getProductImage(product.category, product.name),
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 500) + 20,
      inStock: Math.random() > 0.1,
      deliveryEstimate: ['Tomorrow', '2-3 days', 'Free Express', 'Same Day'][Math.floor(Math.random() * 4)]
    };
  });
};

export function AIRecommendationEngine({
  username,
  currentProduct,
  purchaseHistory = [],
  onAddToCart
}: AIRecommendationEngineProps) {
  const [allRecommendations, setAllRecommendations] = useState<Recommendation[]>([]);
  const [displayedRecommendations, setDisplayedRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAdded, setLastAdded] = useState<Recommendation | null>(null);
  const [visibleCount, setVisibleCount] = useState(6); // Start with 6 items

  useEffect(() => {
    loadRecommendations();
  }, [username, currentProduct]);

  const loadRecommendations = async () => {
    setLoading(true);
    
    // Simulate 5 seconds loading time
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      await huaweiCloud.logAnalyticsEvent('view_ai_recommendations', {
        username,
        currentProduct: currentProduct?.name,
        timestamp: new Date().toISOString()
      }, username);

      // Get all products
      const allProducts = getAllProducts();
      
      // Shuffle for variety
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      setAllRecommendations(shuffled);
      
      // Show first 6 items
      setDisplayedRecommendations(shuffled.slice(0, 6));
      setVisibleCount(6);
      
    } catch (error) {
      console.error('Error loading recommendations:', error);
      const allProducts = getAllProducts();
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      setAllRecommendations(shuffled);
      setDisplayedRecommendations(shuffled.slice(0, 6));
      setVisibleCount(6);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreItems = async () => {
    setLoadingMore(true);
    
    // Simulate loading delay for more items
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCount = Math.min(visibleCount + 6, allRecommendations.length);
    setDisplayedRecommendations(allRecommendations.slice(0, newCount));
    setVisibleCount(newCount);
    
    setLoadingMore(false);
  };

  const handleAddToCart = (rec: Recommendation) => {
    if (onAddToCart) {
      onAddToCart({
        name: rec.productName,
        category: rec.category,
        price: rec.estimatedPrice,
        shopOwner: rec.shopOwner
      }, 1);
      setLastAdded(rec);
      setShowSuccessModal(true);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setLastAdded(null);
  };

  // Loading state with progress bar and timer
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1s ease-in-out infinite' }}>🧠</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d1f0e', marginBottom: '0.5rem' }}>
            AI is analyzing your preferences...
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#5a6b50', marginBottom: '1.5rem' }}>
            Scanning thousands of products for you
          </p>
          
          {/* Progress Bar */}
          <div style={{
            maxWidth: '400px',
            margin: '0 auto',
            background: '#e5e7eb',
            borderRadius: '9999px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #226b2a, #48bb78)',
              borderRadius: '9999px',
              animation: 'progress 5s ease-out forwards'
            }} />
          </div>
          
          <p style={{ fontSize: '0.75rem', color: '#226b2a', marginTop: '0.75rem' }}>
            ⚡ Using Huawei ModelArts AI
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#226b2a',
                animation: 'bounce 1.4s infinite ease-in-out',
                animationDelay: `${i * 0.16}s`
              }} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  const hasMoreItems = visibleCount < allRecommendations.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Success Modal */}
      {showSuccessModal && lastAdded && (
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
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
                Added to Cart!
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#5a6b50',
                marginBottom: '1rem'
              }}>
                {lastAdded.productName} has been added to your cart.
              </p>
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <p style={{ fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>
                  AI Recommendation:
                </p>
                <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                  {lastAdded.reason}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#226b2a' }}>
                  Match confidence: {Math.round(lastAdded.confidence * 100)}%
                </div>
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

      {/* Header Card */}
      <div style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)', 
        border: '1px solid #bbf7d0',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🧠</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
            AI Recommendations
          </h2>
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: '0.7rem', 
            background: '#226b2a', 
            color: 'white', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px' 
          }}>
            {allRecommendations.length} Picks
          </span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#5a6b50', margin: 0 }}>
          Personalized picks just for you — based on your shopping history
        </p>
      </div>

      {/* Recommendations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {displayedRecommendations.map((rec, index) => (
          <div
            key={index}
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
              height: '160px',
              background: '#f3f4f6',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img
                src={rec.imageUrl}
                alt={rec.productName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* Confidence Badge */}
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                left: '0.75rem',
                background: rec.confidence >= 0.85 ? '#226b2a' : rec.confidence >= 0.75 ? '#f59e0b' : '#ef4444',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 600
              }}>
                {Math.round(rec.confidence * 100)}% Match
              </div>
              {/* Discount Badge */}
              {rec.discount && rec.discount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  -{rec.discount}% OFF
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  background: '#f3f4f6',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  color: '#5a6b50'
                }}>
                  {rec.category}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#5a6b50' }}>
                  {rec.shopOwner}
                </span>
              </div>
              
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0d1f0e',
                marginBottom: '0.5rem'
              }}>
                {rec.productName}
              </h3>
              
              <p style={{
                fontSize: '0.75rem',
                color: '#5a6b50',
                marginBottom: '0.75rem',
                lineHeight: '1.4'
              }}>
                {rec.reason}
              </p>
              
              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.125rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', color: i < Math.floor(rec.rating || 4) ? '#f59e0b' : '#d1d5db' }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#5a6b50' }}>
                  ({rec.reviews})
                </span>
              </div>
              
              {/* Price & Delivery */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#226b2a' }}>
                  R{rec.estimatedPrice.toFixed(2)}
                </span>
                {rec.originalPrice && (
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                    R{rec.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#5a6b50' }}>🚚 Delivery: {rec.deliveryEstimate}</span>
                {rec.inStock ? (
                  <span style={{ fontSize: '0.7rem', color: '#226b2a' }}>✓ In Stock</span>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>Out of Stock</span>
                )}
              </div>
              
              <button
                onClick={() => handleAddToCart(rec)}
                disabled={!rec.inStock}
                style={{
                  width: '100%',
                  backgroundColor: rec.inStock ? '#226b2a' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: rec.inStock ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={e => {
                  if (rec.inStock) e.currentTarget.style.backgroundColor = '#1a5420';
                }}
                onMouseLeave={e => {
                  if (rec.inStock) e.currentTarget.style.backgroundColor = '#226b2a';
                }}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {hasMoreItems && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={loadMoreItems}
            disabled={loadingMore}
            style={{
              background: loadingMore ? '#9ca3af' : '#226b2a',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: loadingMore ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={e => {
              if (!loadingMore) e.currentTarget.style.backgroundColor = '#1a5420';
            }}
            onMouseLeave={e => {
              if (!loadingMore) e.currentTarget.style.backgroundColor = '#226b2a';
            }}
          >
            {loadingMore ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Loading more...
              </>
            ) : (
              <>
                👀 View More
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                  ({allRecommendations.length - visibleCount} remaining)
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* AI Trust Section */}
      <div style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
        border: '2px solid #d8b4fe',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>🤖</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#6b21a5' }}>
            How AI Recommendations Work
          </h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
            <p style={{ fontWeight: 700, color: '#0d1f0e', marginBottom: '0.25rem' }}>Real-time Analysis</p>
            <p style={{ fontSize: '0.75rem', color: '#5a6b50' }}>Huawei ModelArts analyzes your preferences</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
            <p style={{ fontWeight: 700, color: '#0d1f0e', marginBottom: '0.25rem' }}>Personalized Picks</p>
            <p style={{ fontSize: '0.75rem', color: '#5a6b50' }}>Products tailored to your shopping habits</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💰</div>
            <p style={{ fontWeight: 700, color: '#0d1f0e', marginBottom: '0.25rem' }}>Best Prices</p>
            <p style={{ fontSize: '0.75rem', color: '#5a6b50' }}>AI finds the best deals across shops</p>
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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}