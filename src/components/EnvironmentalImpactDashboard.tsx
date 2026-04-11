/**
 * Environmental Impact Dashboard
 * Track sustainability metrics: fuel savings, food waste reduction, carbon footprint
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Leaf,
  Fuel,
  Trash2,
  TrendingDown,
  Award,
  TreePine,
  Recycle
} from 'lucide-react';
import { Product } from '../types';

interface EnvironmentalImpactDashboardProps {
  shopOwner: string;
  products: Product[];
}

export function EnvironmentalImpactDashboard({
  shopOwner,
  products
}: EnvironmentalImpactDashboardProps) {
  const [metrics, setMetrics] = useState({
    fuelSaved: 0,
    co2Reduced: 0,
    foodWasteReduced: 0,
    plasticAvoided: 0,
    treesEquivalent: 0,
    sustainabilityScore: 0
  });

  useEffect(() => {
    calculateImpact();
  }, [products, shopOwner]);

  const calculateImpact = () => {
    const shopProducts = products.filter(p => p.shopOwner === shopOwner);

    // Calculate metrics based on various factors
    const deliveriesOptimized = 45; // Mock data
    const fuelSaved = deliveriesOptimized * 0.8; // liters
    const co2Reduced = fuelSaved * 2.3; // kg CO2 per liter

    // Food waste reduction from expiry tracking
    const expiringItems = shopProducts.filter(p => {
      if (!p.expiryDate) return false;
      const daysUntilExpiry = Math.ceil(
        (new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    });

    const foodWasteReduced = expiringItems.reduce((sum, p) => sum + p.stock, 0) * 0.5; // kg

    // Plastic reduction (reusable bags encouraged)
    const plasticAvoided = deliveriesOptimized * 0.015; // kg

    // Trees equivalent
    const treesEquivalent = Math.floor(co2Reduced / 21); // 21kg CO2 per tree per year

    // Calculate sustainability score (0-100)
    const sustainabilityScore = Math.min(
      Math.round(
        (fuelSaved * 2) +
        (foodWasteReduced * 3) +
        (plasticAvoided * 10) +
        (treesEquivalent * 5)
      ),
      100
    );

    setMetrics({
      fuelSaved,
      co2Reduced,
      foodWasteReduced,
      plasticAvoided,
      treesEquivalent,
      sustainabilityScore
    });
  };

  const getSustainabilityLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: '#226b2a', bg: '#f0fdf4', border: '#bbf7d0' };
    if (score >= 60) return { label: 'Good', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' };
    if (score >= 40) return { label: 'Fair', color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' };
    return { label: 'Improving', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' };
  };

  const level = getSustainabilityLevel(metrics.sustainabilityScore);

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
              <span style={{ fontSize: '2rem' }}>🌱</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>
                Environmental Impact
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: 0 }}>
              Track your positive impact on the environment through smart operations
            </p>
          </div>
          <span style={{ 
            fontSize: '0.7rem', 
            background: level.bg, 
            color: level.color, 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px',
            border: `1px solid ${level.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Award size={12} /> {level.label}
          </span>
        </div>
      </div>

      {/* Sustainability Score Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0d1f0e' }}>Sustainability Score</h4>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>{metrics.sustainabilityScore}/100</span>
        </div>
        <Progress value={metrics.sustainabilityScore} className="h-2 mb-2" />
        <p style={{ fontSize: '0.65rem', color: '#5a6b50' }}>
          Your shop is performing {level.label.toLowerCase()} in environmental sustainability!
        </p>
      </div>

      {/* Impact Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {/* Fuel Saved */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.4rem', background: '#eff6ff', borderRadius: '0.5rem' }}>
              <Fuel size={18} style={{ color: '#2563eb' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: '#5a6b50' }}>Fuel Saved</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>{metrics.fuelSaved.toFixed(1)}L</p>
            </div>
          </div>
          <p style={{ fontSize: '0.6rem', color: '#9ca3af' }}>Via optimized delivery routes</p>
        </div>

        {/* CO2 Reduced */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.4rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
              <TrendingDown size={18} style={{ color: '#226b2a' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: '#5a6b50' }}>CO₂ Reduced</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#226b2a' }}>{metrics.co2Reduced.toFixed(1)}kg</p>
            </div>
          </div>
          <p style={{ fontSize: '0.6rem', color: '#9ca3af' }}>Carbon emissions prevented</p>
        </div>

        {/* Food Waste Reduced */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.4rem', background: '#fff7ed', borderRadius: '0.5rem' }}>
              <Trash2 size={18} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: '#5a6b50' }}>Food Waste Prevented</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>{metrics.foodWasteReduced.toFixed(1)}kg</p>
            </div>
          </div>
          <p style={{ fontSize: '0.6rem', color: '#9ca3af' }}>Through expiry tracking</p>
        </div>

        {/* Plastic Avoided */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.4rem', background: '#faf5ff', borderRadius: '0.5rem' }}>
              <Recycle size={18} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: '#5a6b50' }}>Plastic Avoided</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8b5cf6' }}>{metrics.plasticAvoided.toFixed(1)}kg</p>
            </div>
          </div>
          <p style={{ fontSize: '0.6rem', color: '#9ca3af' }}>Reusable bags encouraged</p>
        </div>
      </div>

      {/* Trees Equivalent Card */}
      <div style={{
        padding: '1.25rem',
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        border: '1px solid #bbf7d0',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <TreePine size={40} style={{ color: '#226b2a' }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.7rem', color: '#166534', marginBottom: '0.25rem' }}>
            Your environmental impact is equivalent to planting
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#226b2a' }}>
            {metrics.treesEquivalent} {metrics.treesEquivalent === 1 ? 'tree' : 'trees'}
          </p>
          <p style={{ fontSize: '0.6rem', color: '#5a6b50', marginTop: '0.25rem' }}>
            Each tree absorbs ~21kg of CO₂ per year
          </p>
        </div>
      </div>

      {/* Monthly Trends Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📈</span> Monthly Trends
          </h3>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#5a6b50' }}>Fuel Efficiency</span>
                <span style={{ fontWeight: 600, color: '#226b2a' }}>+18% vs last month</span>
              </div>
              <Progress value={72} className="h-1.5" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#5a6b50' }}>Waste Reduction</span>
                <span style={{ fontWeight: 600, color: '#226b2a' }}>+25% vs last month</span>
              </div>
              <Progress value={85} className="h-1.5" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#5a6b50' }}>Carbon Footprint</span>
                <span style={{ fontWeight: 600, color: '#226b2a' }}>-15% vs last month</span>
              </div>
              <Progress value={68} className="h-1.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Eco-Warrior Badge Card */}
      <div style={{
        padding: '1rem',
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Award size={18} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e' }}>Eco-Warrior Badge Earned!</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: '#b45309' }}>
          🎉 Congratulations! You've prevented over 50kg of CO₂ emissions this month.
          Keep up the great work for a sustainable future!
        </p>
      </div>

      {/* AI Trust Section */}
      <div style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
        border: '2px solid #d8b4fe',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌍</span>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#6b21a5' }}>
            Powered by Huawei Cloud Sustainability AI
          </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#5a6b50' }}>
          <span>📊 Route optimization (Huawei Maps AI)</span>
          <span>📈 Inventory tracking (CloudTable)</span>
          <span>🤖 Predictive analytics (ModelArts)</span>
          <span>🌱 Carbon footprint calculation</span>
        </div>
      </div>
    </div>
  );
}