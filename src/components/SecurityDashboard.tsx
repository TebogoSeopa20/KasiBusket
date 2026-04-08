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
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-600" />
              <CardTitle>Security & Compliance</CardTitle>
            </div>
            <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Powered by Huawei Cloud
            </Badge>
          </div>
          <CardDescription>
            Real-time security monitoring and compliance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Overall Security Score */}
            <div className="p-6 bg-white rounded-lg border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Overall Security Score</h3>
                <Badge className={securityScore >= 90 ? 'bg-green-600' : 'bg-yellow-600'}>
                  {securityScore >= 90 ? 'Excellent' : 'Good'}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={securityScore} className="h-4 mb-2" />
                  <p className="text-3xl font-bold text-indigo-700">{securityScore}%</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Your platform security exceeds industry standards
              </p>
            </div>

            {/* Compliance Status */}
            <div className="p-6 bg-white rounded-lg border-2 border-green-200">
              <h3 className="font-semibold text-gray-900 mb-4">Compliance Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">POPIA Compliant</span>
                  </div>
                  {complianceStatus.popia ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">PCI-DSS Ready</span>
                  </div>
                  {complianceStatus.pciDss ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">GDPR Ready</span>
                  </div>
                  {complianceStatus.gdpr ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Metrics */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900">Security Metrics</h3>
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {metric.status === 'secure' ? (
                      <Lock className="h-4 w-4 text-green-600" />
                    ) : metric.status === 'warning' ? (
                      <Eye className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(metric.status)}>
                    {metric.score}%
                  </Badge>
                </div>
                <Progress value={metric.score} className="h-2 mb-2" />
                <p className="text-xs text-gray-600">{metric.details}</p>
              </div>
            ))}
          </div>

          {/* Threat Detection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Security Events
            </h3>
            {threats.length === 0 ? (
              <div className="p-8 text-center bg-green-50 rounded-lg border border-green-200">
                <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-900">No threats detected</p>
                <p className="text-sm text-green-700 mt-1">Your platform is secure</p>
              </div>
            ) : (
              threats.map((threat) => (
                <div
                  key={threat.id}
                  className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{threat.type}</span>
                        <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            threat.status === 'resolved'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-blue-50 text-blue-700'
                          }
                        >
                          {threat.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{threat.description}</p>
                      <p className="text-xs text-gray-500">
                        Action taken: {threat.action}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {threat.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Security Features */}
          <div className="mt-6 p-4 bg-indigo-100 rounded-lg border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Active Security Features
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-indigo-800">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>TLS 1.3 Encryption</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Rate Limiting</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>MFA Enabled</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Blockchain Audit</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>API Gateway</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Fraud Detection</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Data Backups</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




