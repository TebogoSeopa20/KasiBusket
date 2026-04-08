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

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Cloud className="h-12 w-12 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Huawei Cloud Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Huawei Cloud Status Banner */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Powered by Huawei Cloud</h3>
                <p className="text-sm text-gray-600">
                  Region: {cloudStatus.region} • ModelArts AI • Cloud Eye Analytics • OBS Storage
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600 animate-pulse" />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
              <Button onClick={syncToCloud} size="sm" variant="outline">
                Sync to CloudTable
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{salesMetrics?.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12.5% from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics?.transactions}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+8.2% from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerInsights?.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {customerInsights?.newCustomers} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{inventoryInsights?.inventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Turnover: {inventoryInsights?.stockTurnoverRate}x/month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            AI Predictions
          </TabsTrigger>
        </TabsList>

        {/* Sales Analytics Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue (Last 30 Days)</CardTitle>
                <CardDescription>Powered by Huawei Cloud Eye</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesMetrics?.dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesMetrics?.revenueByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.category} (${entry.percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {salesMetrics?.revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesMetrics?.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category} • {product.unitsSold} units</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R{product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Insights Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>AI-powered segmentation via ModelArts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerInsights?.customerSegments.map((segment, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{segment.segment}</span>
                        <span className="text-sm text-gray-600">{segment.count} customers</span>
                      </div>
                      <Progress 
                        value={(segment.count / (customerInsights?.totalCustomers || 1)) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Avg. Spending: R{segment.avgSpending.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>VIP Customers</CardTitle>
                <CardDescription>Highest lifetime value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerInsights?.topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.orderCount} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-700">R{customer.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-700">{customerInsights?.totalCustomers}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Customers</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-700">R{customerInsights?.customerLifetimeValue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mt-1">Avg. Lifetime Value</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-700">
                    {customerInsights ? Math.round((customerInsights.returningCustomers / customerInsights.totalCustomers) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Retention Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          {/* Alerts */}
          {(inventoryInsights?.lowStockItems.length || 0) > 0 || (inventoryInsights?.expiringItems.length || 0) > 0 ? (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(inventoryInsights?.lowStockItems.length || 0) > 0 && (
                  <p className="text-sm">
                    ⚠️ <strong>{inventoryInsights?.lowStockItems.length}</strong> items are running low on stock
                  </p>
                )}
                {(inventoryInsights?.expiringItems.length || 0) > 0 && (
                  <p className="text-sm">
                    ⏰ <strong>{inventoryInsights?.expiringItems.length}</strong> items expiring within 14 days
                  </p>
                )}
              </CardContent>
            </Card>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Items */}
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Items</CardTitle>
                <CardDescription>Items below minimum stock level</CardDescription>
              </CardHeader>
              <CardContent>
                {inventoryInsights?.lowStockItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">All items well stocked! ✅</p>
                ) : (
                  <div className="space-y-3">
                    {inventoryInsights?.lowStockItems.map((item, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Current: {item.currentStock} / Min: {item.minStock}
                            </p>
                          </div>
                          <Badge variant="destructive">Restock</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Estimated stockout in {item.daysUntilStockout} days
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expiring Items */}
            <Card>
              <CardHeader>
                <CardTitle>Expiring Soon</CardTitle>
                <CardDescription>Items expiring within 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                {inventoryInsights?.expiringItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No items expiring soon! ✅</p>
                ) : (
                  <div className="space-y-3">
                    {inventoryInsights?.expiringItems.map((item, index) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Expires: {new Date(item.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-orange-100 text-orange-700">
                            {item.daysUntilExpiry}d left
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {item.stock} units in stock
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Predictions Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Powered by Huawei ModelArts</h3>
                  <p className="text-sm text-gray-600">
                    Advanced AI predictions for demand forecasting, pricing optimization, and market opportunities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demand Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Demand Forecast
                </CardTitle>
                <CardDescription>AI-predicted demand for next week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictiveInsights?.demandForecast.map((forecast, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{forecast.productName}</p>
                        <Badge variant="outline" className="bg-blue-100">
                          {Math.round(forecast.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Predicted Demand</p>
                          <p className="font-semibold text-blue-700">{forecast.predictedDemand} units</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Recommended Order</p>
                          <p className="font-semibold text-green-700">{forecast.recommendedOrder} units</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Dynamic Pricing
                </CardTitle>
                <CardDescription>AI-optimized pricing recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictiveInsights?.pricingRecommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                      <p className="font-medium mb-2">{rec.productName}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Current Price</p>
                          <p className="font-semibold">R{rec.currentPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Recommended</p>
                          <p className="font-semibold text-green-700">R{rec.recommendedPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-yellow-200">
                        <p className="text-xs text-gray-600">Expected Impact: {rec.expectedImpact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trending Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Trending Products
              </CardTitle>
              <CardDescription>Products gaining popularity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {predictiveInsights?.trendingProducts.map((product, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <p className="font-semibold mb-1">{product.name}</p>
                    <p className="text-2xl font-bold text-green-700 mb-1">{product.growthRate}</p>
                    <Progress value={product.trendScore * 100} className="h-1" />
                    <p className="text-xs text-gray-600 mt-1">Trend Score: {Math.round(product.trendScore * 100)}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Market Opportunities</CardTitle>
              <CardDescription>AI-identified growth opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictiveInsights?.marketOpportunities.map((opp, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{opp.category}</p>
                        <p className="text-sm text-gray-600 mt-1">{opp.opportunity}</p>
                      </div>
                      <Badge className="bg-indigo-600">
                        R{opp.potentialRevenue.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}




