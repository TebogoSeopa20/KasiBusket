export interface User {
  username: string;
  password: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  email: string;            // email for OTP and account recovery
  isSenior: boolean;
  hasDisability: boolean;
  idNumber: string;         // 13-digit SA ID (validated)
  passportNumber?: string;  // optional for non-SA citizens
  preferredLanguage: string;
  registeredAt: Date;       // account creation timestamp
  lastLogin?: Date;         // last login timestamp
  accountActive: boolean;   // soft delete flag
  passwordResetToken?: string; // for password reset
  passwordResetExpires?: Date;
  role: 'customer';
}

export interface Owner {
  username: string;
  password: string;
  fullName: string;
  shopName: string;
  phoneNumber: string;
  email: string;
  idNumber: string;
  preferredLanguage: string;
  ownedShops: string[]; // Array of shop IDs for multiple shop ownership
  registeredAt: Date;
  lastLogin?: Date;
  accountActive: boolean;
  role: 'owner';
}

export interface SpazaShop {
  shopId: string;
  shopName: string;
  ownerName: string;
  ownerUsername: string;
  location: string;
  province: string;
  address: string;
  phoneNumber: string;
  operatingHours: string;
  openingTime: string;
  closingTime: string;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  offersCredit: boolean;
  disabilityFriendly: boolean;
}

export interface Product {
  name: string;
  price: number;
  category: string;
  stock: number;
  minStockLevel: number;
  shopLocation: string;
  seniorFavorite: boolean;
  shopOwner: string;
  availableOnCredit: boolean;
  description: Record<string, string>; // Descriptions in multiple languages
  expiryDate?: string; // Added expiry date for products
}

// When an owner bundles items together and offers them at a reduced total price
export interface Combo {
  id: string;
  name: string;
  productIds: string[];      // array of product names or unique identifiers
  price: number;            // total price for the combo
  discountPercentage: number; // calculated relative to sum of individual prices
}

export interface DeliveryDriver {
  name: string;
  vehicleType: 'Walking' | 'Bicycle' | 'Motorcycle' | 'Car' | 'Bakkie' | 'Donkey Cart';
  numberPlate: string;
  phoneNumber: string;
  assignedShop: string;
  available: boolean;
  deliveryStatus: string;
  currentLat?: number;
  currentLng?: number;
  preferredLanguage: string;
}

export interface CustomerCredit {
  username: string;
  currentLoanItems: number;
  currentLoanAmount: number;
  creditLimit: number;
  creditScore: string;
  nextPaymentDueDate: Date | null;
  transactionHistory: CreditTransaction[];
}

export interface CreditTransaction {
  type: 'LOAN' | 'PAYMENT';
  items: number;
  amount: number;
  date: Date;
  dueDate?: Date;
}

export interface DisabilityProfile {
  username: string;
  disabilityType: string;
  specialRequirements: string;
  registrationDate: Date;
}

export interface CartItem {
  // product may be a normal Product or a Combo bundle
  product: Product | Combo;
  quantity: number;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  interest: number;
  total: number;
  paymentMethod: 'CASH' | 'CREDIT' | 'MOBILE';
  deliveryAddress: string;
  status: string;
  orderDate: Date;
  dueDate?: Date;
}

export interface DeliveryMethod {
  type: 'Walking' | 'Bicycle' | 'Motorcycle' | 'Car' | 'Bakkie' | 'Donkey Cart';
  name: string;
  icon: string;
  estimatedTime: string;
  cost: number;
  description: string;
}

export interface PropertyListing {
  id: string;
  sellerUsername: string;
  sellerName: string;
  propertyType: 'Electronics' | 'Furniture' | 'Appliances' | 'Clothing' | 'Books' | 'Tools' | 'Other';
  itemName: string;
  description: string;
  price: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  images: string[];
  purchaseReceipt?: string; // URL to uploaded receipt/slip
  originalStore: string; // Extracted from receipt by AI
  originalStoreStaffName?: string; // Extracted by AI
  purchaseDate: Date;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  verificationNotes?: string;
  homeAffairsVerified: boolean;
  listedDate: Date;
  location: string;
  province: string;
  contactNumber: string;
  views: number;
  status: 'Active' | 'Sold' | 'Removed';
}

export interface PropertyVerification {
  listingId: string;
  receiptAnalysis: {
    storeName: string;
    staffName: string;
    purchaseDate: string;
    itemDescription: string;
    amount: number;
    confidence: number; // AI confidence score 0-1
  };
  homeAffairsMatch: {
    verified: boolean;
    matchScore: number;
    details: string;
  };
  storeDatabase: {
    storeExists: boolean;
    storeDetails?: {
      name: string;
      location: string;
      registrationNumber: string;
      type: 'Public' | 'Private';
    };
  };
}

export interface SAStoreDatabase {
  storeId: string;
  storeName: string;
  registrationType: 'Public' | 'Private';
  registrationNumber: string;
  province: string;
  city: string;
  address: string;
  activeStaff: StaffMember[];
  verifiedSales: boolean;
}

export interface StaffMember {
  idNumber: string;
  name: string;
  role: string;
  employmentDate: Date;
  verified: boolean;
}



