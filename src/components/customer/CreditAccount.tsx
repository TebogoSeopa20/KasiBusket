import React, { useState } from 'react';
import { creditManager } from '../../services/CreditManager';
import { toast } from 'sonner';

interface CreditAccountProps {
  username: string;
}

export function CreditAccount({ username }: CreditAccountProps) {
  const credit = creditManager.getCustomerCredit(username);
  const [paymentAmount, setPaymentAmount] = useState('');

  if (!credit) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ 
          padding: '2rem', 
          background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)', 
          border: '1px solid #bbf7d0',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1s ease-in-out infinite' }}>💳</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d1f0e', marginBottom: '0.5rem' }}>
            Loading credit information...
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#5a6b50' }}>Fetching your account details</p>
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

  const availableCredit = credit.creditLimit - credit.currentLoanAmount;
  const availableItems = 5 - credit.currentLoanItems;
  const daysUntilDue = credit.nextPaymentDueDate 
    ? Math.ceil((credit.nextPaymentDueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > credit.currentLoanAmount) {
      toast.error('Payment amount exceeds current balance');
      return;
    }
    toast.success(`Payment of R${amount.toFixed(2)} processed successfully!`);
    setPaymentAmount('');
    // In a real app, this would call an API to process the payment
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
              <span style={{ fontSize: '2rem' }}>💳</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                My Credit Account
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              Manage your credit balance and track transactions
            </p>
          </div>
          <span style={{ 
            fontSize: '0.7rem', 
            background: credit.currentLoanAmount > 0 ? '#fef3c7' : '#e8f5e2', 
            color: credit.currentLoanAmount > 0 ? '#92400e' : '#226b2a', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px',
            fontWeight: 600
          }}>
            {credit.currentLoanAmount > 0 ? '💰 Active Loan' : '✅ No Active Loan'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {/* Credit Score */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
          <div style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Credit Score</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>{credit.creditScore}</div>
        </div>

        {/* Available Credit */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
          <div style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Available Credit</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>R{availableCredit.toFixed(2)}</div>
        </div>

        {/* Current Loan */}
        <div style={{
          background: credit.currentLoanAmount > 0 ? '#fef3c7' : 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
          <div style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Current Loan</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: credit.currentLoanAmount > 0 ? '#f59e0b' : '#226b2a' }}>
            R{credit.currentLoanAmount.toFixed(2)}
          </div>
        </div>

        {/* Loan Items */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
          <div style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Loan Items</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{credit.currentLoanItems}/5</div>
        </div>

        {/* Credit Limit */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
          <div style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Credit Limit</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>R{credit.creditLimit.toFixed(2)}</div>
        </div>

        {/* Available Items */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
          <div style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>Available Items</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>{availableItems} items</div>
        </div>
      </div>

      {/* Payment Due Information */}
      {credit.nextPaymentDueDate && (
        <div style={{
          padding: '1rem',
          borderRadius: '1rem',
          background: daysUntilDue < 0 
            ? '#fee2e2' 
            : daysUntilDue < 7
            ? '#fef3c7'
            : '#f0fdf4',
          border: `1px solid ${
            daysUntilDue < 0 
              ? '#fecaca' 
              : daysUntilDue < 7
              ? '#fde68a'
              : '#bbf7d0'
          }`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>
              {daysUntilDue < 0 ? '⚠️' : daysUntilDue < 7 ? '⏰' : '📅'}
            </span>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Payment Due Date</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: daysUntilDue < 0 ? '#dc2626' : '#226b2a' }}>
                {credit.nextPaymentDueDate.toLocaleDateString()}
                {daysUntilDue < 0 && (
                  <span style={{ color: '#dc2626', marginLeft: '0.5rem', fontSize: '0.75rem' }}>(OVERDUE)</span>
                )}
                {daysUntilDue >= 0 && (
                  <span style={{ color: '#5a6b50', marginLeft: '0.5rem', fontSize: '0.7rem' }}>
                    ({daysUntilDue} days remaining)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credit Terms Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📈</span> Credit Terms
          </h3>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#5a6b50', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>•</span> Maximum 5 items on credit
            </div>
            <div style={{ fontSize: '0.75rem', color: '#5a6b50', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>•</span> Maximum R500 credit limit
            </div>
            <div style={{ fontSize: '0.75rem', color: '#5a6b50', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>•</span> Pay within 30 days
            </div>
            <div style={{ fontSize: '0.75rem', color: '#5a6b50', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>•</span> 10% monthly interest rate
            </div>
            <div style={{ fontSize: '0.75rem', color: '#5a6b50', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>•</span> Additional 5% penalty for overdue payments
            </div>
            <div style={{ fontSize: '0.75rem', color: '#5a6b50', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>•</span> Good credit history increases your limit
            </div>
            <div style={{ fontSize: '0.75rem', color: '#5a6b50', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>•</span> Select 'Pay Later' at checkout to use credit
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📊</span> Transaction History
          </h3>
        </div>
        <div style={{ padding: '1.25rem' }}>
          {credit.transactionHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
              <p style={{ fontSize: '0.85rem', color: '#5a6b50' }}>No transactions yet</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Type</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: '#226b2a', fontWeight: 600 }}>Items</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: '#226b2a', fontWeight: 600 }}>Amount</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {credit.transactionHistory.map((transaction, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem', color: '#0d1f0e' }}>{transaction.date.toLocaleDateString()}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          background: transaction.type === 'LOAN' ? '#fee2e2' : '#f0fdf4',
                          color: transaction.type === 'LOAN' ? '#dc2626' : '#226b2a'
                        }}>
                          {transaction.type === 'LOAN' ? '🏦 LOAN' : '💰 PAYMENT'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#0d1f0e' }}>{transaction.items}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#226b2a' }}>
                        R{transaction.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#5a6b50' }}>
                        {transaction.dueDate ? transaction.dueDate.toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Make Payment Section */}
      {credit.currentLoanAmount > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>💵</span> Make Payment
            </h3>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem', color: '#5a6b50', fontWeight: 600 }}>
                  Payment Amount
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  max={credit.currentLoanAmount}
                  style={{ 
                    width: '100%', 
                    padding: '0.6rem 1rem', 
                    border: '1.5px solid #e5e7eb', 
                    borderRadius: '0.75rem', 
                    fontSize: '0.85rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#226b2a'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>
              <button
                onClick={handlePayment}
                style={{
                  background: '#226b2a',
                  color: 'white',
                  padding: '0.6rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1a5420'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#226b2a'}
              >
                Pay Now
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.75rem' }}>
              Current balance: R{credit.currentLoanAmount.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}