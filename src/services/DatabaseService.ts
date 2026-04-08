// DevRIFT'S SPAZA SHOP SYSTEM - Database Service
// Simulates database operations using localStorage for persistence

import { User, Owner, SpazaShop, Product, DeliveryDriver } from '../types';
import { simpleHash, verifyHash } from '../utils/simpleHash';

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {
    this.initializeDatabase();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initializeDatabase() {
    // Check if database is already initialized
    if (!localStorage.getItem('devrift_initialized')) {
      const { users, owners, shops, products, drivers } = this.getInitialData();
      
      // Hash passwords before storing users
      const hashedUsers = users.map(u => ({
        ...u,
        password: simpleHash(u.password)
      }));

      // Hash passwords before storing owners
      const hashedOwners = owners.map(o => ({
        ...o,
        password: simpleHash(o.password)
      }));
      
      localStorage.setItem('devrift_users', JSON.stringify(hashedUsers));
      localStorage.setItem('devrift_owners', JSON.stringify(hashedOwners));
      localStorage.setItem('devrift_shops', JSON.stringify(shops));
      localStorage.setItem('devrift_products', JSON.stringify(products));
      localStorage.setItem('devrift_drivers', JSON.stringify(drivers));
      localStorage.setItem('devrift_password_reset', JSON.stringify({}));
      localStorage.setItem('devrift_initialized', 'true');
    }
  }

  // User operations
  public getUsers(): User[] {
    const data = localStorage.getItem('devrift_users');
    return data ? JSON.parse(data) : [];
  }

  public saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.username === user.username);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    // Store password hashed if not already (simple 8-char hex from simpleHash)
    const toStore = users.map(u => {
      const p = (u as any).password;
      const isHashed = typeof p === 'string' && /^[0-9a-f]{8}$/.test(p);
      return { ...u, password: p && !isHashed ? simpleHash(p) : p };
    });
    localStorage.setItem('devrift_users', JSON.stringify(toStore));
  }

  public getUserByUsername(username: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.username === username) || null;
  }

  public getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  public getUserByIdNumber(idNumber: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.idNumber === idNumber) || null;
  }

  public updateUser(username: string, updates: Partial<User>): User | null {
    const user = this.getUserByUsername(username);
    if (!user) return null;
    const updatedUser = { ...user, ...updates };
    this.saveUser(updatedUser);
    return updatedUser;
  }

  // Owner operations
  public getOwners(): Owner[] {
    const data = localStorage.getItem('devrift_owners');
    return data ? JSON.parse(data) : [];
  }

  public saveOwner(owner: Owner): void {
    const owners = this.getOwners();
    const existingIndex = owners.findIndex(o => o.username === owner.username);
    
    if (existingIndex >= 0) {
      owners[existingIndex] = owner;
    } else {
      owners.push(owner);
    }

    // Ensure owner passwords are stored hashed (simpleHash) for demo safety
    const toStore = owners.map(o => {
      const p = (o as any).password;
      const isHashed = typeof p === 'string' && /^[0-9a-f]{8}$/.test(p);
      return { ...o, password: p && !isHashed ? simpleHash(p) : p };
    });

    localStorage.setItem('devrift_owners', JSON.stringify(toStore));
  }

  public getOwnerByUsername(username: string): Owner | null {
    const owners = this.getOwners();
    return owners.find(o => o.username === username) || null;
  }

  public getOwnerByEmail(email: string): Owner | null {
    const owners = this.getOwners();
    return owners.find(o => o.email === email) || null;
  }

  public getOwnerByIdNumber(idNumber: string): Owner | null {
    const owners = this.getOwners();
    return owners.find(o => o.idNumber === idNumber) || null;
  }

  // Shop operations
  public getShops(): SpazaShop[] {
    const data = localStorage.getItem('devrift_shops');
    return data ? JSON.parse(data) : [];
  }

  public saveShop(shop: SpazaShop): void {
    const shops = this.getShops();
    const existingIndex = shops.findIndex(s => s.shopId === shop.shopId);
    
    if (existingIndex >= 0) {
      shops[existingIndex] = shop;
    } else {
      shops.push(shop);
    }
    
    localStorage.setItem('devrift_shops', JSON.stringify(shops));
  }

  public getShopById(shopId: string): SpazaShop | null {
    const shops = this.getShops();
    return shops.find(s => s.shopId === shopId) || null;
  }

  public getShopsByOwner(ownerUsername: string): SpazaShop[] {
    const shops = this.getShops();
    return shops.filter(s => s.ownerUsername === ownerUsername);
  }

  // Product operations
  public getProducts(): Product[] {
    const data = localStorage.getItem('devrift_products');
    return data ? JSON.parse(data) : [];
  }

  public saveProduct(product: Product): void {
    const products = this.getProducts();
    const existingIndex = products.findIndex(
      p => p.name === product.name && p.shopOwner === product.shopOwner
    );
    
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    
    localStorage.setItem('devrift_products', JSON.stringify(products));
  }

  public updateOwner(username: string, updates: Partial<Owner>): Owner | null {
    const owner = this.getOwnerByUsername(username);
    if (!owner) return null;
    const updatedOwner = { ...owner, ...updates };
    this.saveOwner(updatedOwner);
    return updatedOwner;
  }

  public deleteProduct(productName: string, shopOwner: string): boolean {
    const products = this.getProducts();
    const filteredProducts = products.filter(
      p => !(p.name === productName && p.shopOwner === shopOwner)
    );
    
    if (filteredProducts.length < products.length) {
      localStorage.setItem('devrift_products', JSON.stringify(filteredProducts));
      return true;
    }
    return false;
  }

  public getProductsByOwner(ownerUsername: string): Product[] {
    const products = this.getProducts();
    return products.filter(p => p.shopOwner === ownerUsername);
  }

  // Delivery driver operations
  public getDrivers(): DeliveryDriver[] {
    const data = localStorage.getItem('devrift_drivers');
    return data ? JSON.parse(data) : [];
  }

  public saveDriver(driver: DeliveryDriver): void {
    const drivers = this.getDrivers();
    const existingIndex = drivers.findIndex(
      d => d.name === driver.name && d.assignedShop === driver.assignedShop
    );
    
    if (existingIndex >= 0) {
      drivers[existingIndex] = driver;
    } else {
      drivers.push(driver);
    }
    
    localStorage.setItem('devrift_drivers', JSON.stringify(drivers));
  }

  public deleteDriver(driverName: string, assignedShop: string): boolean {
    const drivers = this.getDrivers();
    const filteredDrivers = drivers.filter(
      d => !(d.name === driverName && d.assignedShop === assignedShop)
    );
    
    if (filteredDrivers.length < drivers.length) {
      localStorage.setItem('devrift_drivers', JSON.stringify(filteredDrivers));
      return true;
    }
    return false;
  }

  public getDriversByShop(shopLocation: string): DeliveryDriver[] {
    const drivers = this.getDrivers();
    return drivers.filter(d => d.assignedShop === shopLocation);
  }

  // Password reset operations
  public savePasswordResetToken(identifier: string, token: string): void {
    const resetData = JSON.parse(localStorage.getItem('devrift_password_reset') || '{}');
    resetData[identifier] = {
      token,
      timestamp: Date.now()
    };
    localStorage.setItem('devrift_password_reset', JSON.stringify(resetData));
  }

  public verifyPasswordResetToken(identifier: string, token: string): boolean {
    const resetData = JSON.parse(localStorage.getItem('devrift_password_reset') || '{}');
    const stored = resetData[identifier];
    
    if (!stored) return false;
    
    // Token expires after 1 hour
    const isValid = stored.token === token && (Date.now() - stored.timestamp) < 3600000;
    
    if (isValid) {
      // Remove used token
      delete resetData[identifier];
      localStorage.setItem('devrift_password_reset', JSON.stringify(resetData));
    }
    
    return isValid;
  }

  public resetPassword(username: string, newPassword: string): boolean {
    // Check if user
    let user = this.getUserByUsername(username);
    if (user) {
      user.password = newPassword;
      this.saveUser(user);
      return true;
    }
    
    // Check if owner
    let owner = this.getOwnerByUsername(username);
    if (owner) {
      owner.password = newPassword;
      this.saveOwner(owner);
      return true;
    }
    
    return false;
  }

  // Home Affairs verification simulation
  public verifyWithHomeAffairs(idNumber: string, fullName: string): {
    verified: boolean;
    message: string;
  } {
    // Simulate Home Affairs database verification
    // In production, this would call actual Home Affairs API
    
    // Basic ID number validation
    if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
      return {
        verified: false,
        message: 'Invalid ID number format'
      };
    }

    // Extract date components
    const year = parseInt(idNumber.substring(0, 2));
    const month = parseInt(idNumber.substring(2, 4));
    const day = parseInt(idNumber.substring(4, 6));

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return {
        verified: false,
        message: 'Invalid date in ID number'
      };
    }

    // Check if ID already exists in database
    const existingUser = this.getUserByIdNumber(idNumber);
    const existingOwner = this.getOwnerByIdNumber(idNumber);
    
    if (existingUser || existingOwner) {
      return {
        verified: false,
        message: 'ID number already registered in the system'
      };
    }

    // Simulate successful verification
    return {
      verified: true,
      message: 'Identity verified with Home Affairs database'
    };
  }

  // Clear all data (for testing/reset)
  public clearAllData(): void {
    localStorage.removeItem('devrift_users');
    localStorage.removeItem('devrift_owners');
    localStorage.removeItem('devrift_shops');
    localStorage.removeItem('devrift_products');
    localStorage.removeItem('devrift_drivers');
    localStorage.removeItem('devrift_password_reset');
    localStorage.removeItem('devrift_initialized');
    this.initializeDatabase();
  }

  private getInitialData() {
    // Initial seed data - same as before but now persisted
    const users: User[] = [
      {
        username: 'john65',
        password: 'password123',
        fullName: 'John Mabena',
        address: '123 Vilakazi Street, Soweto',
        phoneNumber: '+27 11 111 1111',
        isSenior: true,
        hasDisability: false,
        idNumber: '5905125800083',
        preferredLanguage: 'English',
        email: 'john65@example.com',
        registeredAt: new Date('2023-01-01'),
        accountActive: true,
        role: 'customer'
      }
    ];

    const owners: Owner[] = [
      {
        username: 'lydia_shop',
        password: 'owner123',
        fullName: 'Lydia Mbeki',
        shopName: "Mama Lydia's Spaza",
        phoneNumber: '+27 11 123 4567',
        email: 'lydia@devriftspaza.co.za',
        idNumber: '6503124800082',
        preferredLanguage: 'Sepedi',
        ownedShops: ['SHOP001'],
        registeredAt: new Date('2022-10-15'),
        accountActive: true,
        role: 'owner'
      },
      {
        username: 'devrift_shop',
        password: 'owner123',
        fullName: 'DevRift Admin',
        shopName: "DevRift's Spaza Shop",
        phoneNumber: '+27 11 999 8888',
        email: 'devrift@spazaeats.co.za',
        idNumber: '8505129800090',
        preferredLanguage: 'English',
        ownedShops: ['SHOP_DEVRIFT'],
        registeredAt: new Date('2023-01-01'),
        accountActive: true,
        role: 'owner'
      }
    ];

    const shops: SpazaShop[] = [
      {
        shopId: 'SHOP001',
        shopName: "Mama Lydia's Spaza",
        ownerName: 'Lydia Mbeki',
        ownerUsername: 'lydia_shop',
        location: 'Soweto',
        province: 'Gauteng',
        address: '123 Vilakazi Street, Orlando West',
        phoneNumber: '+27 11 123 4567',
        operatingHours: '6:00 AM - 8:00 PM',
        openingTime: '06:00',
        closingTime: '20:00',
        latitude: -26.2356,
        longitude: 27.9076,
        isOpen: true,
        offersCredit: true,
        disabilityFriendly: true
      },
      {
        shopId: 'SHOP_DEVRIFT',
        shopName: "DevRift's Spaza Shop",
        ownerName: 'DevRift Admin',
        ownerUsername: 'devrift_shop',
        location: 'Sandton',
        province: 'Gauteng',
        address: '100 Rivonia Road, Sandton City',
        phoneNumber: '+27 11 999 8888',
        operatingHours: '6:00 AM - 10:00 PM',
        openingTime: '06:00',
        closingTime: '22:00',
        latitude: -26.1076,
        longitude: 28.0567,
        isOpen: true,
        offersCredit: true,
        disabilityFriendly: true
      }
    ];

    const products: Product[] = [
      {
        name: 'Bread',
        price: 18.50,
        category: 'Groceries',
        stock: 50,
        minStockLevel: 10,
        shopLocation: 'Soweto',
        seniorFavorite: true,
        shopOwner: 'lydia_shop',
        availableOnCredit: true,
        description: {
          'en': 'Fresh baked bread, soft and fluffy',
          'zu': 'Isinkwa esisha esivuthiwe',
          'xh': 'Isonka esifreshe',
          'af': 'Vars gebakte brood'
        }
      }
    ];

    const drivers: DeliveryDriver[] = [
      {
        name: 'Thabo Mbeki',
        vehicleType: 'Walking',
        numberPlate: 'N/A',
        phoneNumber: '+27 11 111 1111',
        assignedShop: 'Soweto',
        available: true,
        deliveryStatus: 'Available',
        preferredLanguage: 'Sepedi'
      }
    ];

    return { users, owners, shops, products, drivers };
  }
}

export const db = DatabaseService.getInstance();



