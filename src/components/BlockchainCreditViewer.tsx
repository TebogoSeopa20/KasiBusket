/**
 * Blockchain Credit Transaction Viewer
 * Shows transparent credit history stored on Huawei Blockchain Service
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Link as LinkIcon, Shield, CheckCircle, Clock, TrendingUp, Lock, Database } from 'lucide-react';
import { huaweiCloud } from '../services/HuaweiCloudService';
import { toast } from 'sonner';

interface BlockchainTransaction {
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  userId: string;
  transaction: {
    amount: number;
    type: 'LOAN' | 'PAYMENT' | 'ADJUSTMENT';
    items: number;
    description?: string;
  };
  verified: boolean;
}

interface BlockchainCreditViewerProps {
  username: string;
}

export function BlockchainCreditViewer({ username }: BlockchainCreditViewerProps) {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [creditScore, setCreditScore] = useState(0);

  useEffect(() => {
    loadBlockchainData();
  }, [username]);

  const loadBlockchainData = () => {
    setLoading(true);

    // Load from localStorage blockchain
    const blockchain = JSON.parse(localStorage.getItem('huawei_blockchain') || '[]');
    const userTransactions = blockchain.filter((tx: BlockchainTransaction) => tx.userId === username);

    setTransactions(userTransactions);

    // Calculate credit score based on blockchain history
    calculateCreditScore(userTransactions);

    setLoading(false);
  };

  const calculateCreditScore = (txs: BlockchainTransaction[]) => {
    // Simple credit score algorithm
    const totalPayments = txs.filter(tx => tx.transaction.type === 'PAYMENT').length;
    const totalLoans = txs.filter(tx => tx.transaction.type === 'LOAN').length;
    const onTimePaymentRate = totalLoans > 0 ? totalPayments / totalLoans : 1;

    const score = Math.min(Math.round(650 + (onTimePaymentRate * 200)), 850);
    setCreditScore(score);
  };

  const recordNewTransaction = async () => {
    toast.info('Recording transaction to blockchain...');

    const result = await huaweiCloud.recordCreditTransaction(username, {
      amount: 150.00,
      type: 'LOAN',
      items: 3,
      description: 'Test transaction'
    });

    toast.success('Transaction recorded on blockchain!', {
      description: `Block #${result.blockNumber} • Hash: ${result.transactionHash.slice(0, 16)}...`
    });

    loadBlockchainData();
  };

  const viewOnBlockchain = (hash: string) => {
    toast.info('Blockchain Explorer', {
      description: `Transaction Hash: ${hash}`
    });
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return '#226b2a';
    if (score >= 650) return '#f59e0b';
    return '#ef4444';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Needs Improvement';
  };

  const getTransactionTypeStyle = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return { background: '#f0fdf4', color: '#226b2a', border: '#bbf7d0', icon: '💰' };
      case 'LOAN':
        return { background: '#eff6ff', color: '#2563eb', border: '#bfdbfe', icon: '🏦' };
      default:
        return { background: '#f3f4f6', color: '#6b7280', border: '#e5e7eb', icon: '📝' };
    }
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1s ease-in-out infinite' }}>⛓️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d1f0e', marginBottom: '0.5rem' }}>
            Loading Blockchain Data...
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#5a6b50' }}>Fetching immutable credit transactions</p>
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
              <span style={{ fontSize: '2rem' }}>⛓️</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                Blockchain Credit History
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              Transparent credit transactions secured on Huawei Blockchain Service
            </p>
          </div>
          <span style={{ 
            fontSize: '0.7rem', 
            background: '#226b2a', 
            color: 'white', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Shield size={12} /> Immutable & Verified
          </span>
        </div>
      </div>

      {/* Credit Score Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} /> Blockchain Credit Score
          </h3>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: getCreditScoreColor(creditScore) }}>
                  {creditScore}
                </span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: creditScore >= 750 ? '#f0fdf4' : '#fef3c7', 
                  color: creditScore >= 750 ? '#226b2a' : '#92400e', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '9999px',
                  fontWeight: 600
                }}>
                  {getCreditScoreLabel(creditScore)}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#5a6b50', margin: 0 }}>
                Based on {transactions.length} verified blockchain transactions
              </p>
            </div>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: 'linear-gradient(135deg, #226b2a, #48bb78)', 
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={30} style={{ color: 'white' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} /> Blockchain Transactions
          </h3>
          <p style={{ fontSize: '0.7rem', color: '#5a6b50', margin: '0.25rem 0 0' }}>
            Immutable records stored on Huawei Blockchain
          </p>
        </div>
        <div style={{ padding: '1.25rem' }}>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⛓️</div>
              <p style={{ fontSize: '0.85rem', color: '#5a6b50', marginBottom: '0.25rem' }}>No blockchain transactions yet</p>
              <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Credit transactions will be recorded here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {transactions.slice(0, 5).map((tx, index) => {
                const typeStyle = getTransactionTypeStyle(tx.transaction.type);
                return (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => viewOnBlockchain(tx.transactionHash)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            background: typeStyle.background, 
                            color: typeStyle.color, 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '9999px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            {typeStyle.icon} {tx.transaction.type}
                          </span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0d1f0e' }}>
                            R{tx.transaction.amount.toFixed(2)}
                          </span>
                          {tx.verified && (
                            <span style={{ fontSize: '0.65rem', color: '#226b2a', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle size={12} /> Verified
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#5a6b50', marginBottom: '0.5rem' }}>
                          {tx.transaction.description || `${tx.transaction.items} items`}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', color: '#9ca3af' }}>
                          <Clock size={12} />
                          <span>{new Date(tx.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.65rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                          Block #{tx.blockNumber}
                        </p>
                        <p style={{ 
                          fontSize: '0.6rem', 
                          fontFamily: 'monospace', 
                          color: '#226b2a',
                          background: '#f0fdf4',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '0.25rem',
                          margin: 0
                        }}>
                          {tx.transactionHash.slice(0, 8)}...{tx.transactionHash.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Actions Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LinkIcon size={18} /> Blockchain Actions
          </h3>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <button
            onClick={recordNewTransaction}
            style={{
              width: '100%',
              background: '#226b2a',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
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
            <LinkIcon size={16} />
            Test Blockchain Recording
          </button>
        </div>
      </div>

      {/* Blockchain Info Card */}
      <div style={{
        padding: '1.25rem',
        background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
        border: '2px solid #d8b4fe',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔗</span>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#6b21a5' }}>
            Why Blockchain?
          </h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#5a6b50', lineHeight: '1.5', margin: 0 }}>
          <Shield size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
          All credit transactions are stored on Huawei Blockchain Service, ensuring transparency, 
          preventing fraud, and creating a portable credit history that follows you across all spaza shops.
        </p>
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