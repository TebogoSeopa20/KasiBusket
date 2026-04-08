// AI-Powered Property Verification Service for Community Marketplace
// Integrates with Home Affairs and South African Store Database

import { PropertyListing, PropertyVerification, SAStoreDatabase, StaffMember } from '../types';

export class PropertyVerificationService {
  private static instance: PropertyVerificationService;

  private constructor() {}

  public static getInstance(): PropertyVerificationService {
    if (!PropertyVerificationService.instance) {
      PropertyVerificationService.instance = new PropertyVerificationService();
    }
    return PropertyVerificationService.instance;
  }

  /**
   * AI-powered receipt/slip scanning
   * Extracts key information from uploaded purchase receipts
   */
  public async analyzeReceipt(receiptImage: string): Promise<{
    storeName: string;
    staffName: string;
    purchaseDate: string;
    itemDescription: string;
    amount: number;
    confidence: number;
  }> {
    // Simulate AI OCR and extraction
    // In production, this would use actual AI/ML services like:
    // - Google Cloud Vision API
    // - AWS Textract
    // - Azure Computer Vision
    // - OpenAI GPT-4 Vision

    console.log('ðŸ¤– AI analyzing receipt image...');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI extraction with high confidence
    return {
      storeName: 'Shoprite Checkers',
      staffName: 'Thandi Maluleke',
      purchaseDate: '2024-12-15',
      itemDescription: 'Samsung TV 32 inch',
      amount: 2999.99,
      confidence: 0.94 // 94% confidence
    };
  }

  /**
   * Verify staff member with Home Affairs ID system
   * Matches staff name from receipt with national ID database
   */
  public async verifyStaffWithHomeAffairs(
    staffName: string,
    storeName: string,
    idNumber?: string
  ): Promise<{
    verified: boolean;
    matchScore: number;
    details: string;
  }> {
    console.log('ðŸ›ï¸ Verifying staff with Home Affairs database...');
    
    // Simulate API call to Home Affairs
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock verification
    // In production, this would connect to actual Home Affairs API
    const verified = true;
    const matchScore = 0.92;

    return {
      verified,
      matchScore,
      details: `Staff member "${staffName}" verified as employed at ${storeName}. ID Number matches national database with 92% confidence.`
    };
  }

  /**
   * Query South African Store Database
   * Checks if store exists in public/private registry
   * Includes all major retailers, spaza shops, and registered businesses
   */
  public async queryStoreDatabase(storeName: string): Promise<{
    storeExists: boolean;
    storeDetails?: {
      name: string;
      location: string;
      registrationNumber: string;
      type: 'Public' | 'Private';
    };
  }> {
    console.log('ðŸª Querying South African Store Database...');
    
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock database containing major SA retailers
    const saStoreDatabase: SAStoreDatabase[] = this.getSAStoreDatabase();

    const store = saStoreDatabase.find(s => 
      s.storeName.toLowerCase().includes(storeName.toLowerCase())
    );

    if (store) {
      return {
        storeExists: true,
        storeDetails: {
          name: store.storeName,
          location: `${store.city}, ${store.province}`,
          registrationNumber: store.registrationNumber,
          type: store.registrationType
        }
      };
    }

    return {
      storeExists: false
    };
  }

  /**
   * Complete verification process
   * Combines AI receipt analysis, Home Affairs verification, and store database check
   */
  public async verifyPropertyListing(
    receiptImage: string,
    sellerIdNumber: string
  ): Promise<PropertyVerification> {
    console.log('ðŸ” Starting comprehensive property verification...');

    // Step 1: AI Receipt Analysis
    const receiptAnalysis = await this.analyzeReceipt(receiptImage);

    // Step 2: Verify staff with Home Affairs
    const homeAffairsMatch = await this.verifyStaffWithHomeAffairs(
      receiptAnalysis.staffName,
      receiptAnalysis.storeName
    );

    // Step 3: Check store in SA database
    const storeDatabase = await this.queryStoreDatabase(receiptAnalysis.storeName);

    const verification: PropertyVerification = {
      listingId: `PROP-${Date.now()}`,
      receiptAnalysis,
      homeAffairsMatch,
      storeDatabase
    };

    console.log('âœ… Verification complete!', verification);

    return verification;
  }

  /**
   * Get comprehensive South African Store Database
   * Includes major retailers, chains, and registered spaza shops
   */
  private getSAStoreDatabase(): SAStoreDatabase[] {
    return [
      // Major Retailers - Gauteng
      {
        storeId: 'STORE-001',
        storeName: 'Shoprite Checkers',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1991/123456/07',
        province: 'Gauteng',
        city: 'Johannesburg',
        address: 'Multiple locations nationwide',
        activeStaff: [
          {
            idNumber: '8705123456789',
            name: 'Thandi Maluleke',
            role: 'Cashier',
            employmentDate: new Date('2020-01-15'),
            verified: true
          }
        ],
        verifiedSales: true
      },
      {
        storeId: 'STORE-002',
        storeName: 'Pick n Pay',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1967/012345/06',
        province: 'Gauteng',
        city: 'Pretoria',
        address: 'Nationwide chain',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-003',
        storeName: 'Woolworths',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1931/789012/08',
        province: 'Western Cape',
        city: 'Cape Town',
        address: 'Nationwide premium retailer',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-004',
        storeName: 'Spar',
        registrationType: 'Private',
        registrationNumber: 'CIPC-1963/345678/09',
        province: 'KwaZulu-Natal',
        city: 'Durban',
        address: 'Franchise network nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-005',
        storeName: 'Boxer',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1977/234567/10',
        province: 'Gauteng',
        city: 'Johannesburg',
        address: 'Discount retailer nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-006',
        storeName: 'Makro',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1971/567890/11',
        province: 'Gauteng',
        city: 'Midrand',
        address: 'Wholesale nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-007',
        storeName: 'Game',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1965/678901/12',
        province: 'Gauteng',
        city: 'Johannesburg',
        address: 'Electronics and homeware nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-008',
        storeName: 'OK Foods',
        registrationType: 'Private',
        registrationNumber: 'CIPC-1927/890123/13',
        province: 'Free State',
        city: 'Bloemfontein',
        address: 'Grocery chain nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-009',
        storeName: 'Cambridge Food',
        registrationType: 'Private',
        registrationNumber: 'CIPC-1990/123789/14',
        province: 'Western Cape',
        city: 'Cape Town',
        address: 'Township retail chain',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-010',
        storeName: 'Usave',
        registrationType: 'Private',
        registrationNumber: 'CIPC-2001/456123/15',
        province: 'KwaZulu-Natal',
        city: 'Durban',
        address: 'Budget supermarket franchise',
        activeStaff: [],
        verifiedSales: true
      },
      // Electronics Retailers
      {
        storeId: 'STORE-011',
        storeName: 'Incredible Connection',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1990/789456/16',
        province: 'Gauteng',
        city: 'Sandton',
        address: 'Electronics nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-012',
        storeName: 'Hirsch\'s',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1985/321654/17',
        province: 'Western Cape',
        city: 'Cape Town',
        address: 'Electronics and appliances',
        activeStaff: [],
        verifiedSales: true
      },
      // Furniture
      {
        storeId: 'STORE-013',
        storeName: 'Lewis Stores',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1929/147258/18',
        province: 'Gauteng',
        city: 'Johannesburg',
        address: 'Furniture and homeware',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-014',
        storeName: 'OK Furniture',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1960/369852/19',
        province: 'Gauteng',
        city: 'Johannesburg',
        address: 'Furniture retail nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      // Clothing
      {
        storeId: 'STORE-015',
        storeName: 'Edgars',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1929/753951/20',
        province: 'Gauteng',
        city: 'Johannesburg',
        address: 'Fashion retail nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-016',
        storeName: 'Mr Price',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1985/159357/21',
        province: 'KwaZulu-Natal',
        city: 'Durban',
        address: 'Value fashion nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-017',
        storeName: 'Ackermans',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1916/951753/22',
        province: 'Western Cape',
        city: 'Cape Town',
        address: 'Family clothing nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-018',
        storeName: 'Pep Stores',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1965/357159/23',
        province: 'Western Cape',
        city: 'Cape Town',
        address: 'Value retail nationwide',
        activeStaff: [],
        verifiedSales: true
      },
      // Hardware
      {
        storeId: 'STORE-019',
        storeName: 'Builders Warehouse',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1993/753486/24',
        province: 'Gauteng',
        city: 'Midrand',
        address: 'Hardware and building supplies',
        activeStaff: [],
        verifiedSales: true
      },
      {
        storeId: 'STORE-020',
        storeName: 'Cashbuild',
        registrationType: 'Public',
        registrationNumber: 'CIPC-1978/486753/25',
        province: 'Limpopo',
        city: 'Polokwane',
        address: 'Building materials nationwide',
        activeStaff: [],
        verifiedSales: true
      }
    ];
  }

  /**
   * Calculate overall verification score
   */
  public calculateVerificationScore(verification: PropertyVerification): number {
    const weights = {
      receiptConfidence: 0.4,
      homeAffairsMatch: 0.3,
      storeExists: 0.3
    };

    let score = 0;
    
    score += verification.receiptAnalysis.confidence * weights.receiptConfidence;
    score += verification.homeAffairsMatch.matchScore * weights.homeAffairsMatch;
    score += (verification.storeDatabase.storeExists ? 1 : 0) * weights.storeExists;

    return Math.round(score * 100); // Return percentage
  }

  /**
   * Determine if listing should be auto-approved
   */
  public shouldAutoApprove(verification: PropertyVerification): boolean {
    const score = this.calculateVerificationScore(verification);
    return score >= 75 && 
           verification.homeAffairsMatch.verified && 
           verification.storeDatabase.storeExists;
  }
}

export const propertyVerificationService = PropertyVerificationService.getInstance();




