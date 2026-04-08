/**
 * Admin Dashboard
 * Comprehensive platform monitoring with all Huawei Cloud services
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  Users,
  Store,
  TrendingUp,
  Shield,
  Cloud,
  Brain,
  Activity,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { huaweiCloud } from '../services/HuaweiCloudService';
import { SecurityDashboard } from './SecurityDashboard';
import { EnvironmentalImpactDashboard } from './EnvironmentalImpactDashboard';
import { Product } from '../types';

interface AdminDashboardProps {
  products: Product[];
}

export function AdminDashboard({ products }: AdminDashboardProps) {
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    activeOrders: 0,
    cloudRequests: 0
  });
  const [cloudMetrics, setCloudMetrics] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadPlatformStats();
    loadCloudMetrics();
  }, []);

  const loadPlatformStats = () => {
    // Calculate platform statistics
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const shops = new Set(products.map(p => p.shopOwner)).size;

    setPlatformStats({
      totalUsers: users.length,
      totalShops: shops,
      totalRevenue: 2847590.50, // Mock
      totalTransactions: 15847,
      activeOrders: 234,
      cloudRequests: 1289345
    });
  };

  const loadCloudMetrics = async () => {
    const metrics = await huaweiCloud.getAnalyticsDashboard();
    setCloudMetrics(metrics);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Administration</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive monitoring powered by Huawei Cloud services
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Cloud className="h-4 w-4 mr-1" />
          Admin Access
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-green-600">+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Store className="h-4 w-4" />
              Shops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{platformStats.totalShops}</p>
            <p className="text-xs text-green-600">+5 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R{(platformStats.totalRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-green-600">+28% this quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Database className="h-4 w-4" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{(platformStats.totalTransactions / 1000).toFixed(1)}K</p>
            <p className="text-xs text-green-600">+18% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Zap className="h-4 w-4" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{platformStats.activeOrders}</p>
            <p className="text-xs text-blue-600">Real-time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Cloud className="h-4 w-4" />
              Cloud Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{(platformStats.cloudRequests / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-blue-600">All-time</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cloud">Huawei Cloud</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Platform Uptime</span>
                  <Badge className="bg-green-600">99.98%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">API Response Time</span>
                  <Badge className="bg-blue-600">124ms</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Database Latency</span>
                  <Badge className="bg-purple-600">45ms</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">CDN Cache Hit Rate</span>
                  <Badge className="bg-yellow-600">94.2%</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New shop registered</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">AI recommendation generated</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Blockchain transaction recorded</p>
                    <p className="text-xs text-gray-500">8 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Low stock alert triggered</p>
                    <p className="text-xs text-gray-500">12 minutes ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Huawei Cloud Tab */}
        <TabsContent value="cloud" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  <CardTitle>Huawei Cloud Services Status</CardTitle>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  All Services Operational
                </Badge>
              </div>
              <CardDescription>Real-time status of all integrated Huawei Cloud services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'OBS Storage', requests: '234.5K', uptime: '100%', icon: Database },
                  { name: 'ModelArts AI', requests: '89.2K', uptime: '99.9%', icon: Brain },
                  { name: 'Cloud Eye', requests: '1.2M', uptime: '100%', icon: Activity },
                  { name: 'API Gateway', requests: '567.8K', uptime: '99.98%', icon: Shield },
                  { name: 'CloudTable', requests: '345.6K', uptime: '100%', icon: Database },
                  { name: 'Blockchain', requests: '12.4K', uptime: '100%', icon: Shield },
                  { name: 'SMS Service', requests: '45.2K', uptime: '99.95%', icon: Zap },
                  { name: 'Maps AI', requests: '23.8K', uptime: '99.9%', icon: Activity }
                ].map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <div key={index} className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">{service.name}</span>
                        </div>
                        <Badge className="bg-green-600">{service.uptime}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Requests</span>
                        <span className="font-semibold">{service.requests}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <SecurityDashboard />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Platform Analytics
              </CardTitle>
              <CardDescription>Powered by Huawei Cloud Eye</CardDescription>
            </CardHeader>
            <CardContent>
              {cloudMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-700">{cloudMetrics.totalEvents.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">Total Events</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-700">{cloudMetrics.uniqueUsers}</p>
                    <p className="text-sm text-gray-600 mt-1">Unique Users</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-700">
                      {(cloudMetrics.conversionRate * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Conversion Rate</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-orange-700">{cloudMetrics.topEvents.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Event Types</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sustainability Tab */}
        <TabsContent value="sustainability">
          <EnvironmentalImpactDashboard
            shopOwner="platform_admin"
            products={products}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}




