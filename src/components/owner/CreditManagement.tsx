import React from 'react';
import { User } from '../../types';
import { creditManager } from '../../services/CreditManager';

interface CreditManagementProps {
  users: User[];
}

export function CreditManagement({ users }: CreditManagementProps) {
  const allCredits = creditManager.getAllCredits();

  const totalOutstanding = allCredits.reduce((sum, c) => sum + c.currentLoanAmount, 0);
  const activeLoans = allCredits.filter(c => c.currentLoanAmount > 0).length;
  const overduePayments = allCredits.filter(c => c.nextPaymentDueDate && new Date() > c.nextPaymentDueDate).length;

  const getCreditScoreColor = (score: string) => {
    if (score.includes('Excellent')) return { bg: '#f0fdf4', text: '#226b2a', border: '#bbf7d0' };
    if (score.includes('Good')) return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
    if (score.includes('Fair')) return { bg: '#fef3c7', text: '#f59e0b', border: '#fde68a' };
    return { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' };
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
                Customer Credit Management
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              Manage customer credit accounts and track loan activity
            </p>
          </div>
          <div style={{ 
            padding: '0.5rem 0.75rem', 
            background: 'white', 
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.6rem', color: '#5a6b50' }}>Total Customers</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#226b2a' }}>{allCredits.length}</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Total Customers Card */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Total Customers</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>{allCredits.length}</div>
          </div>
          <span style={{ fontSize: '2rem' }}>👥</span>
        </div>

        {/* Active Loans Card */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Active Loans</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>{activeLoans}</div>
          </div>
          <span style={{ fontSize: '2rem' }}>💰</span>
        </div>

        {/* Total Outstanding Card */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Total Outstanding</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>R{totalOutstanding.toFixed(0)}</div>
          </div>
          <span style={{ fontSize: '2rem' }}>📊</span>
        </div>

        {/* Overdue Payments Card */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Overdue Payments</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{overduePayments}</div>
          </div>
          <span style={{ fontSize: '2rem' }}>⚠️</span>
        </div>
      </div>

      {/* Credit Table Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📋</span> Credit Accounts
          </h3>
          <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginTop: '0.25rem' }}>
            View and manage all customer credit accounts
          </p>
        </div>
        <div style={{ padding: '1rem' }}>
          {allCredits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💳</div>
              <p style={{ fontSize: '0.85rem', color: '#5a6b50' }}>No credit accounts found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Customer</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Credit Score</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: '#226b2a', fontWeight: 600 }}>Current Loan</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', color: '#226b2a', fontWeight: 600 }}>Loan Items</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: '#226b2a', fontWeight: 600 }}>Credit Limit</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: '#226b2a', fontWeight: 600 }}>Available</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#226b2a', fontWeight: 600 }}>Due Date</th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                  {allCredits.map((credit, index) => {
                    const user = users.find(u => u.username === credit.username);
                    const available = credit.creditLimit - credit.currentLoanAmount;
                    const scoreStyle = getCreditScoreColor(credit.creditScore);
                    const isOverdue = credit.nextPaymentDueDate && new Date() > credit.nextPaymentDueDate;
                    
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 600, color: '#0d1f0e' }}>{user?.fullName || credit.username}</div>
                          <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>@{credit.username}</div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            background: scoreStyle.bg,
                            color: scoreStyle.text,
                            border: `1px solid ${scoreStyle.border}`
                          }}>
                            {credit.creditScore}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: credit.currentLoanAmount > 0 ? '#f59e0b' : '#226b2a' }}>
                          R{credit.currentLoanAmount.toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            background: credit.currentLoanItems > 0 ? '#fef3c7' : '#f0fdf4',
                            color: credit.currentLoanItems > 0 ? '#f59e0b' : '#226b2a'
                          }}>
                            {credit.currentLoanItems}/5
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: '#5a6b50' }}>
                          R{credit.creditLimit.toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#226b2a' }}>
                          R{available.toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {credit.nextPaymentDueDate ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              background: isOverdue ? '#fee2e2' : '#f0fdf4',
                              color: isOverdue ? '#dc2626' : '#226b2a'
                            }}>
                              {isOverdue && '⚠️ '}
                              {credit.nextPaymentDueDate.toLocaleDateString()}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>No pending payments</span>
                          )}
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

      {/* Credit Rules Card */}
      <div style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
        border: '2px solid #d8b4fe',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📋</span>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#6b21a5' }}>
            Credit Rules & Policies
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>✓ Maximum 5 items on credit</span>
          <span>✓ Maximum R500 credit limit</span>
          <span>✓ 30-day payment term</span>
          <span>✓ 10% monthly interest</span>
          <span>✓ 5% penalty for overdue</span>
          <span>✓ Credit score affects limit</span>
        </div>
      </div>

      {/* AI Trust Section */}
      <div style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)',
        border: '1px solid #bbf7d0',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#226b2a' }}>
            AI-Powered Credit Insights
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>📊 Real-time credit scoring</span>
          <span>🔗 Blockchain-verified transactions</span>
          <span>📈 Predictive risk analysis</span>
          <span>💰 Smart credit limit recommendations</span>
        </div>
      </div>
    </div>
  );
}