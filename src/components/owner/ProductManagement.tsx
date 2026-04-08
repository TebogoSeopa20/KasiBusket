import React, { useState, useEffect } from 'react';
import { Package, Plus, Upload, Edit, Trash2, X, ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Product, Combo } from '../../types';
import { db } from '../../services/DatabaseService';

interface ProductManagementProps {
  shopId: string;
  shopName: string;
  ownerUsername: string;
  supabaseUrl: string;
  publicAnonKey: string;
  combos?: Combo[];
  addCombo?: (combo: Combo) => void;
}

export function ProductManagement({ 
  shopId, 
  shopName, 
  ownerUsername, 
  supabaseUrl, 
  publicAnonKey,
  combos = [],
  addCombo
}: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [stock, setStock] = useState('');
  const [minStockLevel, setMinStockLevel] = useState('10');
  const [description, setDescription] = useState('');
  const [availableOnCredit, setAvailableOnCredit] = useState(true);
  const [seniorFavorite, setSeniorFavorite] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // combo form state
  const [showComboForm, setShowComboForm] = useState(false);
  const [comboName, setComboName] = useState('');
  const [comboProductIds, setComboProductIds] = useState<string[]>([]);
  const [comboPrice, setComboPrice] = useState('');

  const categories = [
    'Groceries', 'Beverages', 'Snacks', 'Household', 'Personal Care',
    'Bread & Bakery', 'Dairy', 'Frozen Foods', 'Toiletries', 'Other'
  ];

  useEffect(() => {
    loadProducts();
  }, [shopId, ownerUsername]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Use database service which handles persistence
      const data = db.getProductsByOwner(ownerUsername);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      toast.error('Please fill in required fields');
      return;
    }

    const productData: Product = {
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      minStockLevel: parseInt(minStockLevel),
      shopLocation: shopName, // simplified
      seniorFavorite,
      shopOwner: ownerUsername,
      availableOnCredit,
      description: { en: description || `${name} fresh at ${shopName}` },
      expiryDate: expiryDate || undefined
    };

    db.saveProduct(productData);
    toast.success('Product saved locally');
    resetForm();
    setShowAddForm(false);
    loadProducts();
  };

  const handleDeleteProduct = (productName: string) => {
    if (confirm('Delete this product?')) {
      db.deleteProduct(productName, ownerUsername);
      toast.success('Product deleted');
      loadProducts();
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setStock(product.stock.toString());
    setMinStockLevel(product.minStockLevel.toString());
    setDescription(product.description.en || '');
    setAvailableOnCredit(product.availableOnCredit);
    setSeniorFavorite(product.seniorFavorite);
    setExpiryDate(product.expiryDate || '');
    setShowAddForm(true);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('Groceries');
    setStock('');
    setMinStockLevel('10');
    setDescription('');
    setAvailableOnCredit(true);
    setSeniorFavorite(false);
    setImageFile(null);
    setImagePreview('');
    setExpiryDate('');
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="p-12 text-center">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-sm text-gray-500">{shopName} Shop Floor</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card className="border-2 border-green-100">
          <CardHeader>
            <CardTitle>{editingProduct ? 'Update Product' : 'New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Price (R)</Label>
                  <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" value={stock} onChange={e => setStock(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Min Level</Label>
                  <Input type="number" value={minStockLevel} onChange={e => setMinStockLevel(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-10 border rounded px-2">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={availableOnCredit} onChange={e => setAvailableOnCredit(e.target.checked)} />
                  <span className="text-sm">Allow Credit</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={seniorFavorite} onChange={e => setSeniorFavorite(e.target.checked)} />
                  <span className="text-sm">Senior Mode Fav</span>
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600">Save Product</Button>
                <Button type="button" variant="outline" onClick={() => { resetForm(); setShowAddForm(false); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400">No products found.</div>
        ) : (
          products.map(p => (
            <Card key={p.name} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-gray-50 flex items-center justify-center border-b">
                <Package className="w-12 h-12 text-gray-200" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-green-600 font-bold">R{p.price.toFixed(2)}</p>
                <div className="mt-2 text-xs text-gray-500">Stock: {p.stock} units</div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="ghost" onClick={() => handleEditProduct(p)}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteProduct(p.name)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}



