/**
 * Social Commerce Service
 * 
 * Enables social features for community engagement:
 * - Share deals and products
 * - Group buying (bulk discounts)
 * - Product reviews and ratings
 * - Community feed
 * - Referral system
 * - Social proof (trending, popular items)
 */

export interface ProductReview {
  id: string;
  productName: string;
  username: string;
  fullName: string;
  rating: number; // 1-5
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean; // verified purchase
  date: Date;
  responses?: ReviewResponse[];
}

export interface ReviewResponse {
  id: string;
  username: string;
  fullName: string;
  isOwner: boolean;
  comment: string;
  date: Date;
}

export interface GroupBuy {
  id: string;
  productName: string;
  shopOwner: string;
  originalPrice: number;
  discountTiers: Array<{
    minQuantity: number;
    discountPercent: number;
    pricePerUnit: number;
  }>;
  currentParticipants: number;
  participants: Array<{
    username: string;
    fullName: string;
    quantity: number;
    joinedDate: Date;
  }>;
  expiresAt: Date;
  status: 'Active' | 'Completed' | 'Expired';
  createdDate: Date;
}

export interface SocialPost {
  id: string;
  type: 'deal' | 'review' | 'groupBuy' | 'recommendation';
  username: string;
  fullName: string;
  content: string;
  productName?: string;
  shopName?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  date: Date;
}

export interface Referral {
  id: string;
  referrerUsername: string;
  referredUsername: string;
  status: 'Pending' | 'Completed';
  bonusAwarded: boolean;
  referralDate: Date;
  completionDate?: Date;
}

export class SocialCommerceService {
  private static instance: SocialCommerceService;

  private constructor() {
    this.initializeSocialData();
  }

  public static getInstance(): SocialCommerceService {
    if (!SocialCommerceService.instance) {
      SocialCommerceService.instance = new SocialCommerceService();
    }
    return SocialCommerceService.instance;
  }

  private initializeSocialData(): void {
    if (!localStorage.getItem('social_initialized')) {
      localStorage.setItem('product_reviews', JSON.stringify(this.getSeedReviews()));
      localStorage.setItem('group_buys', JSON.stringify([]));
      localStorage.setItem('social_posts', JSON.stringify([]));
      localStorage.setItem('referrals', JSON.stringify([]));
      localStorage.setItem('social_initialized', 'true');
    }
  }

  /**
   * Product Reviews
   */
  public getProductReviews(productName: string): ProductReview[] {
    const reviews = JSON.parse(localStorage.getItem('product_reviews') || '[]');
    return reviews
      .filter((r: ProductReview) => r.productName === productName)
      .sort((a: ProductReview, b: ProductReview) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }

  public addReview(
    productName: string,
    username: string,
    fullName: string,
    rating: number,
    comment: string,
    verified: boolean = true
  ): ProductReview {
    const reviews = JSON.parse(localStorage.getItem('product_reviews') || '[]');

    const review: ProductReview = {
      id: `REV-${Date.now()}`,
      productName,
      username,
      fullName,
      rating,
      comment,
      helpful: 0,
      verified,
      date: new Date(),
      responses: []
    };

    reviews.push(review);
    localStorage.setItem('product_reviews', JSON.stringify(reviews));

    // Create social post
    this.createSocialPost({
      type: 'review',
      username,
      fullName,
      content: `Rated ${productName} ${rating}/5 stars: "${comment}"`,
      productName
    });

    console.log(`â­ ${username} reviewed ${productName}: ${rating}/5`);

    return review;
  }

  public getAverageRating(productName: string): {
    average: number;
    count: number;
    distribution: Record<number, number>;
  } {
    const reviews = this.getProductReviews(productName);
    
    if (reviews.length === 0) {
      return { average: 0, count: 0, distribution: {} };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / reviews.length;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return {
      average: Math.round(average * 10) / 10,
      count: reviews.length,
      distribution
    };
  }

  /**
   * Group Buying
   */
  public createGroupBuy(
    productName: string,
    shopOwner: string,
    originalPrice: number,
    discountTiers: Array<{ minQuantity: number; discountPercent: number }>,
    durationHours: number = 48
  ): GroupBuy {
    const groupBuys = JSON.parse(localStorage.getItem('group_buys') || '[]');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);

    const groupBuy: GroupBuy = {
      id: `GB-${Date.now()}`,
      productName,
      shopOwner,
      originalPrice,
      discountTiers: discountTiers.map(tier => ({
        ...tier,
        pricePerUnit: originalPrice * (1 - tier.discountPercent / 100)
      })),
      currentParticipants: 0,
      participants: [],
      expiresAt,
      status: 'Active',
      createdDate: new Date()
    };

    groupBuys.push(groupBuy);
    localStorage.setItem('group_buys', JSON.stringify(groupBuys));

    console.log(`ðŸ¤ Group buy created for ${productName}`);

    return groupBuy;
  }

  public joinGroupBuy(
    groupBuyId: string,
    username: string,
    fullName: string,
    quantity: number
  ): { success: boolean; message: string; currentPrice?: number } {
    const groupBuys = JSON.parse(localStorage.getItem('group_buys') || '[]');
    const groupBuy = groupBuys.find((gb: GroupBuy) => gb.id === groupBuyId);

    if (!groupBuy) {
      return { success: false, message: 'Group buy not found' };
    }

    if (groupBuy.status !== 'Active') {
      return { success: false, message: 'Group buy is no longer active' };
    }

    if (new Date(groupBuy.expiresAt) < new Date()) {
      groupBuy.status = 'Expired';
      localStorage.setItem('group_buys', JSON.stringify(groupBuys));
      return { success: false, message: 'Group buy has expired' };
    }

    // Check if user already joined
    const existingParticipant = groupBuy.participants.find(
      (p: any) => p.username === username
    );

    if (existingParticipant) {
      existingParticipant.quantity += quantity;
    } else {
      groupBuy.participants.push({
        username,
        fullName,
        quantity,
        joinedDate: new Date()
      });
    }

    // Update total participants
    groupBuy.currentParticipants = groupBuy.participants.reduce(
      (sum: number, p: any) => sum + p.quantity,
      0
    );

    localStorage.setItem('group_buys', JSON.stringify(groupBuys));

    // Determine current price tier
    const currentTier = [...groupBuy.discountTiers]
      .reverse()
      .find(tier => groupBuy.currentParticipants >= tier.minQuantity);

    const currentPrice = currentTier 
      ? currentTier.pricePerUnit 
      : groupBuy.originalPrice;

    console.log(`ðŸ¤ ${username} joined group buy for ${groupBuy.productName}`);

    return {
      success: true,
      message: `Successfully joined group buy! Current price: R${currentPrice.toFixed(2)}`,
      currentPrice
    };
  }

  public getActiveGroupBuys(): GroupBuy[] {
    const groupBuys = JSON.parse(localStorage.getItem('group_buys') || '[]');
    return groupBuys.filter((gb: GroupBuy) => {
      if (gb.status === 'Active' && new Date(gb.expiresAt) < new Date()) {
        gb.status = 'Expired';
      }
      return gb.status === 'Active';
    });
  }

  /**
   * Social Feed
   */
  public createSocialPost(postData: {
    type: 'deal' | 'review' | 'groupBuy' | 'recommendation';
    username: string;
    fullName: string;
    content: string;
    productName?: string;
    shopName?: string;
    imageUrl?: string;
  }): SocialPost {
    const posts = JSON.parse(localStorage.getItem('social_posts') || '[]');

    const post: SocialPost = {
      id: `POST-${Date.now()}`,
      ...postData,
      likes: 0,
      comments: 0,
      shares: 0,
      date: new Date()
    };

    posts.push(post);
    
    // Keep only last 100 posts
    if (posts.length > 100) {
      posts.shift();
    }

    localStorage.setItem('social_posts', JSON.stringify(posts));

    return post;
  }

  public getSocialFeed(limit: number = 20): SocialPost[] {
    const posts = JSON.parse(localStorage.getItem('social_posts') || '[]');
    return posts
      .sort((a: SocialPost, b: SocialPost) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, limit);
  }

  public shareProduct(
    username: string,
    fullName: string,
    productName: string,
    shopName: string,
    message: string
  ): SocialPost {
    return this.createSocialPost({
      type: 'deal',
      username,
      fullName,
      content: message,
      productName,
      shopName
    });
  }

  /**
   * Referral System
   */
  public generateReferralCode(username: string): string {
    return `${username.toUpperCase().substring(0, 4)}-${Date.now().toString(36).toUpperCase()}`;
  }

  public createReferral(
    referrerUsername: string,
    referredUsername: string
  ): Referral {
    const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');

    const referral: Referral = {
      id: `REF-${Date.now()}`,
      referrerUsername,
      referredUsername,
      status: 'Pending',
      bonusAwarded: false,
      referralDate: new Date()
    };

    referrals.push(referral);
    localStorage.setItem('referrals', JSON.stringify(referrals));

    console.log(`ðŸ‘¥ ${referrerUsername} referred ${referredUsername}`);

    return referral;
  }

  public completeReferral(referralId: string): {
    success: boolean;
    bonusPoints: number;
  } {
    const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
    const referral = referrals.find((r: Referral) => r.id === referralId);

    if (!referral || referral.status === 'Completed') {
      return { success: false, bonusPoints: 0 };
    }

    referral.status = 'Completed';
    referral.completionDate = new Date();
    referral.bonusAwarded = true;

    localStorage.setItem('referrals', JSON.stringify(referrals));

    const bonusPoints = 100;
    console.log(`ðŸŽ Referral completed! ${referral.referrerUsername} earned ${bonusPoints} points`);

    return { success: true, bonusPoints };
  }

  /**
   * Social Proof - Trending Products
   */
  public getTrendingProducts(limit: number = 5): Array<{
    productName: string;
    score: number;
    purchases: number;
    reviews: number;
    shares: number;
  }> {
    // Mock trending calculation based on recent activity
    const posts = JSON.parse(localStorage.getItem('social_posts') || '[]');
    const reviews = JSON.parse(localStorage.getItem('product_reviews') || '[]');

    const productActivity: Record<string, any> = {};

    // Count activity for each product
    posts.forEach((post: SocialPost) => {
      if (post.productName) {
        if (!productActivity[post.productName]) {
          productActivity[post.productName] = { 
            productName: post.productName,
            purchases: 0, 
            reviews: 0, 
            shares: 0 
          };
        }
        if (post.type === 'deal') productActivity[post.productName].shares++;
        if (post.type === 'review') productActivity[post.productName].reviews++;
      }
    });

    reviews.forEach((review: ProductReview) => {
      if (!productActivity[review.productName]) {
        productActivity[review.productName] = { 
          productName: review.productName,
          purchases: 0, 
          reviews: 0, 
          shares: 0 
        };
      }
      productActivity[review.productName].reviews++;
    });

    // Calculate trending score
    const trending = Object.values(productActivity).map((item: any) => ({
      ...item,
      purchases: Math.floor(Math.random() * 50) + 10,
      score: (item.reviews * 3) + (item.shares * 2) + (Math.random() * 20)
    }));

    return trending
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Popular items in user's area
   */
  public getPopularInArea(
    location: string,
    limit: number = 5
  ): Array<{
    productName: string;
    shopName: string;
    purchases: number;
    rating: number;
  }> {
    // Mock popular items by location
    return [
      {
        productName: 'Bread',
        shopName: "Mama Lydia's Spaza",
        purchases: 245,
        rating: 4.8
      },
      {
        productName: 'Milk 2L',
        shopName: "DevRift's Spaza Shop",
        purchases: 198,
        rating: 4.6
      },
      {
        productName: 'Coca Cola 2L',
        shopName: "Mama Lydia's Spaza",
        purchases: 176,
        rating: 4.7
      }
    ].slice(0, limit);
  }

  // Helper method to seed initial reviews
  private getSeedReviews(): ProductReview[] {
    return [
      {
        id: 'REV-001',
        productName: 'Bread',
        username: 'john65',
        fullName: 'John Mabena',
        rating: 5,
        comment: 'Always fresh and soft! Best bread in Soweto.',
        helpful: 12,
        verified: true,
        date: new Date('2026-02-15'),
        responses: [
          {
            id: 'RESP-001',
            username: 'lydia_shop',
            fullName: 'Lydia Mbeki',
            isOwner: true,
            comment: 'Thank you John! We bake fresh every morning ðŸž',
            date: new Date('2026-02-16')
          }
        ]
      },
      {
        id: 'REV-002',
        productName: 'Bread',
        username: 'sarah_n',
        fullName: 'Sarah Ndlovu',
        rating: 4,
        comment: 'Good quality, sometimes runs out early.',
        helpful: 5,
        verified: true,
        date: new Date('2026-02-20'),
        responses: []
      }
    ];
  }
}

export const socialCommerceService = SocialCommerceService.getInstance();




