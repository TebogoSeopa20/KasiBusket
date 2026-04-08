import React, { useState, useEffect } from 'react';
import { PropertyListing } from '../../types';
import { propertyVerificationService } from '../../services/PropertyVerificationService';
import { toast } from 'sonner';

interface PropertyMarketplaceProps {
  username: string;
  userIdNumber: string;
  userLocation: string;
  userProvince: string;
  userPhone: string;
}

export function PropertyMarketplace({ 
  username, 
  userIdNumber, 
  userLocation, 
  userProvince, 
  userPhone 
}: PropertyMarketplaceProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'sell'>('browse');
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sell form state
  const [sellForm, setSellForm] = useState({
    itemName: '',
    propertyType: 'Electronics' as PropertyListing['propertyType'],
    description: '',
    price: '',
    condition: 'Good' as PropertyListing['condition'],
    receiptImage: null as File | null,
    itemImages: [] as File[]
  });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = () => {
    const stored = localStorage.getItem('devrift_property_listings');
    if (stored) {
      const parsed = JSON.parse(stored);
      const listings = parsed.map((l: any) => ({
        ...l,
        purchaseDate: new Date(l.purchaseDate),
        listedDate: new Date(l.listedDate)
      }));
      setListings(listings);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'receipt' | 'images') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'receipt') {
      setSellForm({ ...sellForm, receiptImage: files[0] });
    } else {
      setSellForm({ ...sellForm, itemImages: Array.from(files) });
    }
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellForm.receiptImage) {
      toast.error('Please upload your purchase receipt for verification');
      return;
    }

    setIsVerifying(true);
    toast.info('🤖 AI is analyzing your receipt...');

    try {
      const receiptUrl = URL.createObjectURL(sellForm.receiptImage);
      
      const verification = await propertyVerificationService.verifyPropertyListing(
        receiptUrl,
        userIdNumber
      );

      const verificationScore = propertyVerificationService.calculateVerificationScore(verification);
      const autoApprove = propertyVerificationService.shouldAutoApprove(verification);

      toast.success(`Verification complete! Score: ${verificationScore}%`);

      const newListing: PropertyListing = {
        id: `PROP-${Date.now()}`,
        sellerUsername: username,
        sellerName: username,
        propertyType: sellForm.propertyType,
        itemName: sellForm.itemName,
        description: sellForm.description,
        price: parseFloat(sellForm.price),
        condition: sellForm.condition,
        images: sellForm.itemImages.map(f => URL.createObjectURL(f)),
        purchaseReceipt: receiptUrl,
        originalStore: verification.receiptAnalysis.storeName,
        originalStoreStaffName: verification.receiptAnalysis.staffName,
        purchaseDate: new Date(verification.receiptAnalysis.purchaseDate),
        verificationStatus: autoApprove ? 'Verified' : 'Pending',
        verificationNotes: autoApprove 
          ? `Auto-verified with ${verificationScore}% confidence. Receipt authentic, staff verified with Home Affairs, store exists in SA database.`
          : `Manual review required. Verification score: ${verificationScore}%`,
        homeAffairsVerified: verification.homeAffairsMatch.verified,
        listedDate: new Date(),
        location: userLocation,
        province: userProvince,
        contactNumber: userPhone,
        views: 0,
        status: 'Active'
      };

      const updatedListings = [...listings, newListing];
      setListings(updatedListings);
      localStorage.setItem('devrift_property_listings', JSON.stringify(updatedListings));

      setShowSuccessModal(true);
      setSellForm({
        itemName: '',
        propertyType: 'Electronics',
        description: '',
        price: '',
        condition: 'Good',
        receiptImage: null,
        itemImages: []
      });

    } catch (error) {
      setErrorMessage('Verification failed. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const verifiedListings = listings.filter(l => 
    l.verificationStatus === 'Verified' && l.status === 'Active'
  );

  const closeModals = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Success Modal */}
      {showSuccessModal && (
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
        }} onClick={closeModals}>
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
                Listing Submitted!
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#5a6b50',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                Your item has been submitted for verification.
              </p>
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <p style={{ fontWeight: 600, color: '#166534', marginBottom: '0.75rem' }}>
                  Next Steps:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                    <span style={{ color: '#226b2a' }}>✓</span> AI verification in progress
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                    <span style={{ color: '#226b2a' }}>✓</span> Your listing will appear once verified
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                    <span style={{ color: '#226b2a' }}>✓</span> You'll receive a notification when live
                  </li>
                </ul>
              </div>
              <button
                onClick={closeModals}
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
                Continue
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
        }} onClick={closeModals}>
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
                Verification Failed
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#5a6b50',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                {errorMessage}
              </p>
              <button
                onClick={closeModals}
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
          <span style={{ fontSize: '2.5rem' }}>🏠</span>
          <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
            Community Property Marketplace
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#5a6b50', margin: 0 }}>
          Sell your items with AI-verified authenticity. All receipts are scanned and verified 
          against Home Affairs ID system and SA Store Database.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e5e7eb', marginBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('browse')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            border: 'none',
            borderBottom: activeTab === 'browse' ? '3px solid #226b2a' : '3px solid transparent',
            background: 'transparent',
            color: activeTab === 'browse' ? '#226b2a' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          🛒 Browse Items ({verifiedListings.length})
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            border: 'none',
            borderBottom: activeTab === 'sell' ? '3px solid #226b2a' : '3px solid transparent',
            background: 'transparent',
            color: activeTab === 'sell' ? '#226b2a' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          💰 Sell Your Item
        </button>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div>
          {verifiedListings.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#5a6b50',
              background: '#f9fafb',
              borderRadius: '1rem'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏠</div>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No verified listings yet</p>
              <p style={{ fontSize: '0.875rem' }}>Be the first to sell in your community!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {verifiedListings.map(listing => (
                <PropertyListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sell Tab */}
      {activeTab === 'sell' && (
        <form onSubmit={handleSubmitListing} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            borderRadius: '1rem',
            padding: '1rem',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🤖</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e40af', margin: 0 }}>AI Verification Process</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#1e3a8a' }}>
                <span>✓</span> AI scans your receipt
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#1e3a8a' }}>
                <span>✓</span> Staff verified with Home Affairs
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#1e3a8a' }}>
                <span>✓</span> Store checked in SA database
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#1e3a8a' }}>
                <span>✓</span> Auto-approve if score ≥ 75%
              </div>
            </div>
          </div>

          {/* Form Fields Grid - Fixed spacing */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1.5rem',
            alignItems: 'start'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
                Item Name *
              </label>
              <input
                type="text"
                required
                value={sellForm.itemName}
                onChange={(e) => setSellForm({ ...sellForm, itemName: e.target.value })}
                className="spaza-input"
                style={{ width: '100%', padding: '0.6rem 0.75rem' }}
                placeholder="e.g., Samsung TV 32 inch"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
                Category *
              </label>
              <select
                value={sellForm.propertyType}
                onChange={(e) => setSellForm({ ...sellForm, propertyType: e.target.value as any })}
                className="spaza-input"
                style={{ width: '100%', padding: '0.6rem 0.75rem', cursor: 'pointer' }}
              >
                <option value="Electronics">📱 Electronics</option>
                <option value="Furniture">🛋️ Furniture</option>
                <option value="Appliances">🔌 Appliances</option>
                <option value="Clothing">👕 Clothing</option>
                <option value="Books">📚 Books</option>
                <option value="Tools">🔧 Tools</option>
                <option value="Other">📦 Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
                Price (R) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={sellForm.price}
                onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                className="spaza-input"
                style={{ width: '100%', padding: '0.6rem 0.75rem' }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
                Condition *
              </label>
              <select
                value={sellForm.condition}
                onChange={(e) => setSellForm({ ...sellForm, condition: e.target.value as any })}
                className="spaza-input"
                style={{ width: '100%', padding: '0.6rem 0.75rem', cursor: 'pointer' }}
              >
                <option value="New">✨ New</option>
                <option value="Like New">👍 Like New</option>
                <option value="Good">✅ Good</option>
                <option value="Fair">⚠️ Fair</option>
                <option value="Poor">🔧 Poor</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
              Description *
            </label>
            <textarea
              required
              value={sellForm.description}
              onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
              className="spaza-input"
              style={{ width: '100%', padding: '0.6rem 0.75rem', resize: 'vertical', minHeight: '100px' }}
              rows={4}
              placeholder="Describe your item in detail..."
            />
          </div>

          <div style={{
            background: '#fffbeb',
            borderRadius: '1rem',
            padding: '1rem',
            border: '2px solid #fcd34d'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#b45309', cursor: 'pointer' }}>
                Upload Purchase Receipt * (Required for AI Verification)
              </label>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.75rem' }}>
              Upload the original receipt/slip from when you purchased this item. 
              Our AI will scan it to verify authenticity.
            </p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, 'receipt')}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #fcd34d', borderRadius: '0.5rem', background: 'white' }}
            />
            {sellForm.receiptImage && (
              <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.5rem' }}>✓ Receipt uploaded: {sellForm.receiptImage.name}</p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
              Item Photos (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, 'images')}
              className="spaza-input"
              style={{ width: '100%', padding: '0.5rem' }}
            />
            {sellForm.itemImages.length > 0 && (
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>{sellForm.itemImages.length} photo(s) selected</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="spaza-btn-primary"
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: isVerifying ? 'not-allowed' : 'pointer',
              opacity: isVerifying ? 0.7 : 1
            }}
          >
            {isVerifying ? '🤖 AI Verifying...' : '🚀 Submit for Verification'}
          </button>
        </form>
      )}

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

function PropertyListingCard({ listing }: { listing: PropertyListing }) {
  const handleContact = () => {
    toast.info(`📞 Contact seller at: ${listing.contactNumber}`);
  };

  return (
    <div className="spaza-card" style={{
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}>
      {listing.images.length > 0 && (
        <div style={{ height: '200px', background: '#f3f4f6', overflow: 'hidden' }}>
          <img 
            src={listing.images[0]} 
            alt={listing.itemName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0d1f0e', margin: 0 }}>{listing.itemName}</h3>
          <span style={{
            background: '#dcfce7',
            color: '#166534',
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.65rem',
            fontWeight: 600
          }}>
            ✓ Verified
          </span>
        </div>

        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#226b2a', marginBottom: '0.75rem' }}>
          R {listing.price.toFixed(2)}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#6b7280' }}>
            <span>📆</span> Condition: {listing.condition}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#6b7280' }}>
            <span>🏪</span> Original: {listing.originalStore}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#6b7280' }}>
            <span>📍</span> {listing.location}, {listing.province}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#6b7280' }}>
            <span>👁️</span> {listing.views} views
          </div>
          {listing.homeAffairsVerified && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#166534', fontWeight: 600 }}>
              <span>✓</span> Home Affairs Verified
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: '1rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {listing.description}
        </p>

        <button
          onClick={handleContact}
          className="spaza-btn-primary"
          style={{ width: '100%', padding: '0.6rem', fontSize: '0.75rem', fontWeight: 600 }}
        >
          📞 Contact Seller
        </button>
      </div>
    </div>
  );
}