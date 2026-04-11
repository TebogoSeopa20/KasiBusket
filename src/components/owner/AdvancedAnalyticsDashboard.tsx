import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  Brain,
  Zap,
  Target,
  Award,
  Cloud,
  Activity
} from 'lucide-react';
import { Product } from '../../types';
import { analyticsService, SalesMetrics, CustomerInsights, InventoryInsights, PredictiveInsights } from '../../services/AnalyticsService';
import { huaweiCloud } from '../../services/HuaweiCloudService';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AdvancedAnalyticsDashboardProps {
  shopOwner: string;
  products: Product[];
}

export function AdvancedAnalyticsDashboard({ shopOwner, products }: AdvancedAnalyticsDashboardProps) {
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [customerInsights, setCustomerInsights] = useState<CustomerInsights | null>(null);
  const [inventoryInsights, setInventoryInsights] = useState<InventoryInsights | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloudStatus, setCloudStatus] = useState({ connected: true, region: 'af-south-1' });

  const COLORS = ['#226b2a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    loadAnalytics();
    trackPageView();
  }, [shopOwner]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [sales, customers, inventory, predictions] = await Promise.all([
        analyticsService.getSalesMetrics(shopOwner, {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        }),
        analyticsService.getCustomerInsights(shopOwner),
        analyticsService.getInventoryInsights(products, shopOwner),
        analyticsService.getPredictiveInsights(products, shopOwner)
      ]);

      setSalesMetrics(sales);
      setCustomerInsights(customers);
      setInventoryInsights(inventory);
      setPredictiveInsights(predictions);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async () => {
    await huaweiCloud.logAnalyticsEvent('view_analytics_dashboard', {
      shopOwner,
      timestamp: new Date().toISOString()
    }, shopOwner);
  };

  const syncToCloud = async () => {
    const result = await huaweiCloud.syncToCloudTable('analytics', shopOwner, {
      salesMetrics,
      customerInsights,
      inventoryInsights,
      lastSync: new Date().toISOString()
    });

    if (result.success) {
      alert('✅ Data synced to Huawei CloudTable successfully!');
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1s ease-in-out infinite' }}>☁️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d1f0e', marginBottom: '0.5rem' }}>
            Loading Huawei Cloud Analytics...
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#5a6b50' }}>Fetching your business insights</p>
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
              <span style={{ fontSize: '2rem' }}>📊</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                Advanced Analytics Dashboard
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              Powered by Huawei Cloud • Real-time insights • AI predictions
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              fontSize: '0.7rem', 
              background: '#f0fdf4', 
              color: '#226b2a', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Activity size={12} /> Connected
            </span>
            <button
              onClick={syncToCloud}
              style={{
                background: '#226b2a',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a5420'}
              onMouseLeave={e => e.currentTarget.style.background = '#226b2a'}
            >
              Sync to CloudTable
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Total Revenue */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Total Revenue</span>
            <ShoppingCart size={16} style={{ color: '#226b2a' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d1f0e' }}>
            R{salesMetrics?.revenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#226b2a', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={10} /> +12.5% from last month
          </div>
        </div>

        {/* Transactions */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Transactions</span>
            <Package size={16} style={{ color: '#226b2a' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d1f0e' }}>
            {salesMetrics?.transactions}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#226b2a', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={10} /> +8.2% from last month
          </div>
        </div>

        {/* Total Customers */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Total Customers</span>
            <Users size={16} style={{ color: '#226b2a' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d1f0e' }}>
            {customerInsights?.totalCustomers}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5a6b50', marginTop: '0.25rem' }}>
            {customerInsights?.newCustomers} new this month
          </div>
        </div>

        {/* Inventory Value */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#5a6b50' }}>Inventory Value</span>
            <Package size={16} style={{ color: '#226b2a' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d1f0e' }}>
            R{inventoryInsights?.inventoryValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5a6b50', marginTop: '0.25rem' }}>
            Turnover: {inventoryInsights?.stockTurnoverRate}x/month
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '0.5rem',
          background: '#f9fafb', 
          borderRadius: '0.75rem', 
          padding: '0.25rem',
          marginBottom: '1.5rem'
        }}>
          {['sales', 'customers', 'inventory', 'ai'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                const event = new CustomEvent('tabChange', { detail: tab });
                window.dispatchEvent(event);
              }}
              style={{
                padding: '0.6rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: 'transparent',
                color: '#5a6b50',
                border: 'none',
                textTransform: 'capitalize'
              }}
              onMouseEnter={e => { if (e.currentTarget.style.background !== '#226b2a') e.currentTarget.style.background = '#f0fdf4'; }}
              onMouseLeave={e => { if (e.currentTarget.style.background !== '#226b2a') e.currentTarget.style.background = 'transparent'; }}
            >
              {tab === 'sales' && '📈 Sales'}
              {tab === 'customers' && '👥 Customers'}
              {tab === 'inventory' && '📦 Inventory'}
              {tab === 'ai' && '🧠 AI Predictions'}
            </button>
          ))}
        </div>

        {/* Sales Analytics Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Revenue Chart */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0 }}>
                Daily Revenue (Last 30 Days)
              </h3>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginTop: '0.25rem' }}>Powered by Huawei Cloud Eye</p>
            </div>
            <div style={{ padding: '1rem', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesMetrics?.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#5a6b50" fontSize={12} />
                  <YAxis stroke="#5a6b50" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}
                    formatter={(value: any) => [`R${value}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#226b2a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Category */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0 }}>
                Revenue by Category
              </h3>
            </div>
            <div style={{ padding: '1rem', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesMetrics?.revenueByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category} (${entry.percentage}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {salesMetrics?.revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}
                    formatter={(value: any) => [`R${value}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0 }}>
                Top Selling Products
              </h3>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50', marginTop: '0.25rem' }}>Best performers this month</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {salesMetrics?.topProducts.map((product, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e8f5e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#226b2a' }}>
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0d1f0e' }}>{product.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#5a6b50' }}>{product.category} • {product.unitsSold} units</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#226b2a' }}>R{product.revenue.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
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
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#6b21a5' }}>
            Powered by Huawei Cloud AI
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>📊 ModelArts AI for demand forecasting</span>
          <span>☁️ Cloud Eye for real-time metrics</span>
          <span>💾 OBS Storage for data persistence</span>
          <span>🔗 Blockchain for transaction verification</span>
        </div>
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