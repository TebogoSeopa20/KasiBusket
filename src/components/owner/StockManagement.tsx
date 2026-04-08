import React, { useState, useEffect } from 'react';
import { Product, SpazaShop } from '../../types';
import { Plus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface StockManagementProps {
  shop: SpazaShop;
  products: Product[];
  onStockUpdate?: (productName: string, newStock: number, reorderLevel?: number) => void;
}

export function StockManagement({ shop, products, onStockUpdate }: StockManagementProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [newStock, setNewStock] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'reorder' | 'summary'>('summary');

  // Get product object from name
  const getProduct = (name: string) => products.find(p => p.name === name);

  // Products with low stock
  const lowStockProducts = products.filter(p => p.stock < p.minStockLevel);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !newStock) {
      toast.error('Please select a product and enter stock quantity');
      return;
    }

    const quantity = parseInt(newStock);
    if (quantity <= 0) {
      toast.error('Stock quantity must be greater than 0');
      return;
    }

    const product = getProduct(selectedProduct);
    if (product) {
      const updatedStock = product.stock + quantity;
      onStockUpdate?.(selectedProduct, updatedStock);
      toast.success(`✅ Added ${quantity} units to ${selectedProduct}`);
      setNewStock('');
      setSelectedProduct('');
      setActiveTab('summary');
    }
  };

  const handleSetReorderLevel = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !reorderLevel) {
      toast.error('Please select a product and enter reorder level');
      return;
    }

    const level = parseInt(reorderLevel);
    if (level < 0) {
      toast.error('Reorder level cannot be negative');
      return;
    }

    const product = getProduct(selectedProduct);
    if (product) {
      onStockUpdate?.(selectedProduct, product.stock, level);
      toast.success(`✅ Reorder level set to ${level} for ${selectedProduct}`);
      setReorderLevel('');
      setSelectedProduct('');
      setActiveTab('summary');
    }
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900">⚠️ Low Stock Alert!</h3>
              <p className="text-sm text-red-800 mt-1">
                {lowStockProducts.length} product(s) below reorder level:
              </p>
              <ul className="mt-2 space-y-1">
                {lowStockProducts.map(p => (
                  <li key={p.name} className="text-sm text-red-700">
                    • {p.name}: {p.stock} units (Min. {p.minStockLevel})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'summary'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 Stock Summary
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'add'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ➕ Add Stock
        </button>
        <button
          onClick={() => setActiveTab('reorder')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'reorder'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ⚠️ Set Reorder Level
        </button>
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <Card>
          <CardHeader>
            <CardTitle>📃 Current Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-gray-600">No products yet. Add products from the Products tab first.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Current</th>
                      <th className="px-4 py-3 text-center">Min Level</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map(product => (
                      <tr key={product.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold ${
                            product.stock > 50 ? 'text-green-600' : 
                            product.stock > product.minStockLevel ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {product.minStockLevel}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {product.stock === 0 ? (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                              Out of Stock
                            </span>
                          ) : product.stock < product.minStockLevel ? (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
                              ⚠️ Low
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                              ✅ Good
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">R {product.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Stock Tab */}
      {activeTab === 'add' && (
        <Card>
          <CardHeader>
            <CardTitle>➕ Add Stock to Inventory</CardTitle>
            <CardDescription>Increase stock levels when you receive new supplies</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-select">Select Product *</Label>
                <select
                  id="product-select"
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">-- Choose a product --</option>
                  {products.map(p => (
                    <option key={p.name} value={p.name}>
                      {p.name} (Current: {p.stock} | Min: {p.minStockLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qty-input">Quantity to Add *</Label>
                <Input
                  id="qty-input"
                  type="number"
                  min="1"
                  value={newStock}
                  onChange={e => setNewStock(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reorder Level Tab */}
      {activeTab === 'reorder' && (
        <Card>
          <CardHeader>
            <CardTitle>⚠️ Set Reorder Threshold</CardTitle>
            <CardDescription>Configure when to receive low-stock alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetReorderLevel} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reorder-product">Select Product *</Label>
                <select
                  id="reorder-product"
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">-- Choose a product --</option>
                  {products.map(p => (
                    <option key={p.name} value={p.name}>
                      {p.name} (Current min: {p.minStockLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorder-level">Minimum Reorder Level *</Label>
                <Input
                  id="reorder-level"
                  type="number"
                  min="1"
                  value={reorderLevel}
                  onChange={e => setReorderLevel(e.target.value)}
                  placeholder="Enter minimum stock level"
                  required
                />
                <p className="text-xs text-gray-600">
                  You'll receive alerts when stock drops below this level.
                </p>
              </div>

              <Button type="submit" className="w-full">
                <AlertCircle className="w-4 h-4 mr-2" />
                Update Reorder Level
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}




