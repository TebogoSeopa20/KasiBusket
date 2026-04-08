import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { CustomerPortal } from './components/CustomerPortal';
import { OwnerPortal } from './components/OwnerPortal';
import { PublicShopRegistration } from './components/PublicShopRegistration';
import { AdminDashboard } from './components/AdminDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { User, Owner, SpazaShop, Product, DeliveryDriver, Combo, Order } from './types';
import { CreditManager } from './services/CreditManager';
import { NotificationService } from './services/NotificationService';
import { DisabilitySupport } from './services/DisabilitySupport';
import { initializeData } from './services/DataInitializer';
import { publicAnonKey, supabaseUrl } from './utils/supabase/info';
import { Toaster } from './components/ui/sonner';
import { supabase } from './utils/supabase/client';
import { AuthService } from './services/AuthService';
import { db } from './services/DatabaseService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showShopRegistration, setShowShopRegistration] = useState(false);
  const [data, setData] = useState<{
    users: User[];
    owners: Owner[];
    shops: SpazaShop[];
    products: Product[];
    drivers: DeliveryDriver[];
    combos: Combo[];
  } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Initialize all data (including combos)
    const initialData = initializeData();
    setData(initialData);
    // check supabase session and subscribe to auth changes
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session?.user?.email) {
          const email = session.user.email;
          // try to find owner first
          const owner = db.getOwnerByEmail(email);
          if (owner) {
            handleLogin(null, owner);
            return;
          }

          const user = db.getUserByEmail(email);
          if (user) {
            handleLogin(user, null);
            return;
          }

          // create a new customer by default
          const username = (email.split('@')[0] + '_sb').slice(0, 30);
          const newUser = {
            username,
            password: Math.random().toString(36).slice(2, 10),
            fullName: session.user.user_metadata?.full_name || username,
            address: '',
            phoneNumber: session.user.user_metadata?.phone || '',
            email,
            isSenior: false,
            hasDisability: false,
            idNumber: '0000000000000',
            preferredLanguage: 'English',
            registeredAt: new Date(),
            accountActive: true,
            role: 'customer'
          } as any;
          db.saveUser(newUser);
          handleLogin(newUser, null);
        }
      } catch (err) {
        console.warn('Error checking supabase session', err);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        handleLogout();
      }
      if (event === 'SIGNED_IN' && session?.user?.email) {
        const email = session.user.email;
        const owner = db.getOwnerByEmail(email);
        if (owner) {
          handleLogin(null, owner);
          return;
        }
        const user = db.getUserByEmail(email);
        if (user) {
          handleLogin(user, null);
          return;
        }
        // create default user
        const username = (email.split('@')[0] + '_sb').slice(0, 30);
        const newUser = {
          username,
          password: Math.random().toString(36).slice(2, 10),
          fullName: session.user.user_metadata?.full_name || username,
          address: '',
          phoneNumber: session.user.user_metadata?.phone || '',
          email,
          isSenior: false,
          hasDisability: false,
          idNumber: '0000000000000',
          preferredLanguage: 'English',
          registeredAt: new Date(),
          accountActive: true,
          role: 'customer'
        } as any;
        db.saveUser(newUser);
        handleLogin(newUser, null);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogin = (user: User | null, owner: Owner | null) => {
    // Sync data state if login provided a refreshed object
    if (user) {
      setData(prev => {
        if (!prev) return prev;
        const exists = prev.users.some(u => u.username === user.username);
        return {
          ...prev,
          users: exists ? prev.users.map(u => u.username === user.username ? user : u) : [...prev.users, user]
        };
      });
    }
    if (owner) {
      setData(prev => {
        if (!prev) return prev;
        const exists = prev.owners.some(o => o.username === owner.username);
        return {
          ...prev,
          owners: exists ? prev.owners.map(o => o.username === owner.username ? owner : o) : [...prev.owners, owner]
        };
      });
    }
    setCurrentUser(user);
    setCurrentOwner(owner);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // sign out from Supabase if active
    try {
      AuthService.signOut();
    } catch (err) {
      console.warn('Error signing out of Supabase', err);
    }
    // Clear session data
    localStorage.removeItem('activeOrder');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentOwner');
    sessionStorage.clear();
    // Clear state
    setCurrentUser(null);
    setCurrentOwner(null);
    setIsAuthenticated(false);
  };

  if (!data) {
    // screen shown while the mocked data bundle is being populated
    return (
      <LoadingScreen
        message="Loading Spaza Eats..."
        backgroundUrl="/assets/landing-bg.jpg" // place your background under public/assets
        logoUrl="/assets/logo-spinner.png" // optional spinning logo
      />
    );
  }

  if (showShopRegistration) {
    return (
      <>
        <PublicShopRegistration
          supabaseUrl={supabaseUrl}
          publicAnonKey={publicAnonKey}
          onRegistrationComplete={() => setShowShopRegistration(false)}
        />
        <Toaster />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login 
          onLogin={handleLogin} 
          users={data.users} 
          owners={data.owners}
          onShowShopRegistration={() => setShowShopRegistration(true)}
        />
        <Toaster />
      </>
    );
  }

  const addCombo = (combo: Combo) => {
    setData(prev => prev ? { ...prev, combos: [...prev.combos, combo] } : null);
    // notify customers about new combo
    const discountText = Math.round(combo.discountPercentage);
    NotificationService.addNotification(
      'info',
      '💥 New combo deal!',
      `${combo.name} now available for R ${combo.price.toFixed(2)} (-${discountText}% off)`
    );
  };

  const handlePlaceOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
    NotificationService.addNotification(
      'success',
      '🎉 Order Placed!',
      `Order ${order.orderId} is being prepared by ${order.items[0].product.name.split(' ')[0]}'s shop.`
    );
  };

  return (
    <div
      className="min-h-screen bg-gray-50 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/landing-bg.jpg')" }}
    >
      {currentUser ? (
        <CustomerPortal
          user={currentUser}
          shops={data.shops}
          products={data.products}
          drivers={data.drivers}
          combos={data.combos}
          orders={orders}
          onPlaceOrder={handlePlaceOrder}
          onLogout={handleLogout}
        />
      ) : currentOwner ? (
        <OwnerPortal
          owner={currentOwner}
          shop={data.shops.find(s => s.ownerUsername === currentOwner.username) || {
            shopId: 'PENDING',
            shopName: currentOwner.shopName,
            ownerName: currentOwner.fullName,
            ownerUsername: currentOwner.username,
            location: 'Pending',
            province: 'Pending',
            address: 'Pending',
            phoneNumber: currentOwner.phoneNumber,
            operatingHours: 'Closed',
            openingTime: '00:00',
            closingTime: '00:00',
            latitude: 0,
            longitude: 0,
            isOpen: false,
            offersCredit: false,
            disabilityFriendly: false
          }}
          products={data.products}
          drivers={data.drivers}
          users={data.users}
          combos={data.combos}
          orders={orders}
          addCombo={addCombo}
          onLogout={handleLogout}
        />
      ) : null}
      <Toaster />
    </div>
  );
}



