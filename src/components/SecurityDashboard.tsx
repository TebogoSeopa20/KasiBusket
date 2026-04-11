/**
 * Security & Compliance Dashboard
 * Shows security status, compliance metrics, and threat detection
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  Eye,
  ShieldCheck,
  Key,
  FileCheck,
  Activity,
  TrendingUp
} from 'lucide-react';
import { huaweiCloud } from '../services/HuaweiCloudService';

interface SecurityMetric {
  name: string;
  status: 'secure' | 'warning' | 'critical';
  score: number;
  details: string;
}

export function SecurityDashboard() {
  const [securityScore, setSecurityScore] = useState(0);
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [threats, setThreats] = useState<any[]>([]);
  const [complianceStatus, setComplianceStatus] = useState({
    popia: true,
    pciDss: true,
    gdpr: true
  });

  useEffect(() => {
    loadSecurityMetrics();
    detectThreats();
  }, []);

  const loadSecurityMetrics = () => {
    const securityMetrics: SecurityMetric[] = [
      {
        name: 'Data Encryption',
        status: 'secure',
        score: 100,
        details: 'All data encrypted at rest and in transit (TLS 1.3)'
      },
      {
        name: 'API Security',
        status: 'secure',
        score: 95,
        details: 'Rate limiting active, signed requests via Huawei API Gateway'
      },
      {
        name: 'Authentication',
        status: 'secure',
        score: 92,
        details: 'Multi-factor authentication with Home Affairs ID verification'
      },
      {
        name: 'Access Control',
        status: 'secure',
        score: 98,
        details: 'Role-based access control (RBAC) enforced'
      },
      {
        name: 'Blockchain Integrity',
        status: 'secure',
        score: 100,
        details: 'Immutable transaction records on Huawei Blockchain'
      },
      {
        name: 'Fraud Detection',
        status: 'warning',
        score: 87,
        details: '2 suspicious activities detected in last 24h (being monitored)'
      }
    ];

    setMetrics(securityMetrics);

    // Calculate overall security score
    const avgScore = securityMetrics.reduce((sum, m) => sum + m.score, 0) / securityMetrics.length;
    setSecurityScore(Math.round(avgScore));
  };

  const detectThreats = () => {
    // Mock threat detection
    const detectedThreats = [
      {
        id: 1,
        type: 'Suspicious Login',
        severity: 'low',
        timestamp: new Date(Date.now() - 3600000),
        description: 'Multiple failed login attempts from unusual location',
        status: 'monitored',
        action: 'Account temporarily locked'
      },
      {
        id: 2,
        type: 'Unusual Transaction Pattern',
        severity: 'medium',
        timestamp: new Date(Date.now() - 7200000),
        description: 'High-value credit purchase outside normal pattern',
        status: 'resolved',
        action: 'User verification completed successfully'
      }
    ];

    setThreats(detectedThreats);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
        return { bg: '#f0fdf4', text: '#226b2a', border: '#bbf7d0' };
      case 'warning':
        return { bg: '#fef3c7', text: '#f59e0b', border: '#fde68a' };
      case 'critical':
        return { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' };
      default:
        return { bg: '#f3f4f6', text: '#5a6b50', border: '#e5e7eb' };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'medium':
        return { bg: '#fef3c7', text: '#f59e0b', border: '#fde68a' };
      case 'high':
        return { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' };
      default:
        return { bg: '#f3f4f6', text: '#5a6b50', border: '#e5e7eb' };
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
              <span style={{ fontSize: '2rem' }}>🛡️</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                Security & Compliance
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              Real-time security monitoring and compliance tracking
            </p>
          </div>
          <span style={{ 
            fontSize: '0.7rem', 
            background: '#f0fdf4', 
            color: '#226b2a', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <ShieldCheck size={12} /> Powered by Huawei Cloud
          </span>
        </div>
      </div>

      {/* Security Score and Compliance Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Overall Security Score */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0d1f0e' }}>Overall Security Score</h3>
            <span style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.65rem',
              fontWeight: 600,
              background: securityScore >= 90 ? '#f0fdf4' : '#fef3c7',
              color: securityScore >= 90 ? '#226b2a' : '#f59e0b'
            }}>
              {securityScore >= 90 ? 'Excellent' : 'Good'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <Progress value={securityScore} className="h-2 mb-2" />
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>{securityScore}%</p>
            </div>
            <TrendingUp size={32} style={{ color: '#226b2a' }} />
          </div>
          <p style={{ fontSize: '0.65rem', color: '#5a6b50', marginTop: '0.75rem' }}>
            Your platform security exceeds industry standards
          </p>
        </div>

        {/* Compliance Status */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0d1f0e', marginBottom: '1rem' }}>Compliance Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={14} style={{ color: '#226b2a' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>POPIA Compliant</span>
              </div>
              {complianceStatus.popia ? (
                <CheckCircle size={16} style={{ color: '#226b2a' }} />
              ) : (
                <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={14} style={{ color: '#226b2a' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>PCI-DSS Ready</span>
              </div>
              {complianceStatus.pciDss ? (
                <CheckCircle size={16} style={{ color: '#226b2a' }} />
              ) : (
                <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={14} style={{ color: '#226b2a' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>GDPR Ready</span>
              </div>
              {complianceStatus.gdpr ? (
                <CheckCircle size={16} style={{ color: '#226b2a' }} />
              ) : (
                <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Metrics Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} /> Security Metrics
          </h3>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {metrics.map((metric, index) => {
              const statusColor = getStatusColor(metric.status);
              return (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {metric.status === 'secure' ? (
                        <Lock size={14} style={{ color: '#226b2a' }} />
                      ) : metric.status === 'warning' ? (
                        <Eye size={14} style={{ color: '#f59e0b' }} />
                      ) : (
                        <AlertTriangle size={14} style={{ color: '#dc2626' }} />
                      )}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0d1f0e' }}>{metric.name}</span>
                    </div>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      background: statusColor.bg,
                      color: statusColor.text,
                      border: `1px solid ${statusColor.border}`
                    }}>
                      {metric.score}%
                    </span>
                  </div>
                  <Progress value={metric.score} className="h-1.5 mb-2" />
                  <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>{metric.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Security Events Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} /> Recent Security Events
          </h3>
        </div>
        <div style={{ padding: '1rem' }}>
          {threats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#226b2a', marginBottom: '0.25rem' }}>No threats detected</p>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Your platform is secure</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {threats.map((threat) => {
                const severityColor = getSeverityColor(threat.severity);
                return (
                  <div
                    key={threat.id}
                    style={{
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '0.75rem',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0d1f0e' }}>{threat.type}</span>
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            background: severityColor.bg,
                            color: severityColor.text,
                            border: `1px solid ${severityColor.border}`
                          }}>
                            {threat.severity}
                          </span>
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            background: threat.status === 'resolved' ? '#f0fdf4' : '#eff6ff',
                            color: threat.status === 'resolved' ? '#226b2a' : '#2563eb',
                            border: `1px solid ${threat.status === 'resolved' ? '#bbf7d0' : '#bfdbfe'}`
                          }}>
                            {threat.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginBottom: '0.25rem' }}>{threat.description}</p>
                        <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Action taken: {threat.action}</p>
                      </div>
                      <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>
                        {threat.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active Security Features Card */}
      <div style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)',
        border: '1px solid #bbf7d0',
        borderRadius: '1rem'
      }}>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#226b2a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={14} /> Active Security Features
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#226b2a' }}>
            <CheckCircle size={12} /> TLS 1.3 Encryption
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#226b2a' }}>
            <CheckCircle size={12} /> Rate Limiting
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#226b2a' }}>
            <CheckCircle size={12} /> MFA Enabled
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#226b2a' }}>
            <CheckCircle size={12} /> Blockchain Audit
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#226b2a' }}>
            <CheckCircle size={12} /> API Gateway
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#226b2a' }}>
            <CheckCircle size={12} /> Real-time Monitoring
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#226b2a' }}>
            <CheckCircle size={12} /> Fraud Detection
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#226b2a' }}>
            <CheckCircle size={12} /> Data Backups
          </div>
        </div>
      </div>

      {/* AI Trust Section */}
      <div style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
        border: '2px solid #d8b4fe',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔒</span>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#6b21a5' }}>
            Huawei Cloud Security Features
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>✓ Web Application Firewall (WAF)</span>
          <span>✓ DDoS Protection</span>
          <span>✓ Intrusion Detection System (IDS)</span>
          <span>✓ Security Center Integration</span>
          <span>✓ Compliance Automation</span>
        </div>
      </div>
    </div>
  );
}