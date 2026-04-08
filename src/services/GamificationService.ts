/**
 * Gamification & Loyalty Service
 * 
 * Implements game mechanics to increase customer engagement:
 * - Points system
 * - Badges and achievements
 * - Leaderboards
 * - Challenges and missions
 * - Rewards and discounts
 */

export interface UserPoints {
  username: string;
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  nextLevelPoints: number;
  badges: Badge[];
  streak: number;
  lastPurchaseDate: Date | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  earnedDate: Date;
  pointsValue: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  goal: number;
  progress: number;
  reward: {
    points: number;
    badge?: Badge;
    discount?: number;
  };
  expiresAt: Date;
  completed: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freeItem' | 'creditBoost' | 'deliveryFree';
  value: number | string;
  available: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  fullName: string;
  points: number;
  level: number;
  badges: number;
}

export class GamificationService {
  private static instance: GamificationService;

  // Points awarded for different actions
  private readonly POINTS_CONFIG = {
    PURCHASE: 10, // 10 points per R100 spent
    DAILY_LOGIN: 5,
    FIRST_PURCHASE_DAY: 20,
    REFERRAL: 100,
    REVIEW_PRODUCT: 15,
    SHARE_DEAL: 10,
    COMPLETE_PROFILE: 50,
    ENABLE_NOTIFICATIONS: 25,
    CREDIT_PAYMENT_ONTIME: 30,
    STREAK_BONUS: 5 // per day of streak
  };

  // Level thresholds
  private readonly LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 1500, 2500, 4000, 6000, 9000, 13000
  ];

  private constructor() {
    this.initializeGamification();
  }

  public static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  private initializeGamification(): void {
    if (!localStorage.getItem('gamification_initialized')) {
      localStorage.setItem('user_points', JSON.stringify({}));
      localStorage.setItem('user_badges', JSON.stringify({}));
      localStorage.setItem('challenges', JSON.stringify(this.generateChallenges()));
      localStorage.setItem('gamification_initialized', 'true');
    }
  }

  /**
   * Get user points and progress
   */
  public getUserPoints(username: string): UserPoints {
    const pointsData = JSON.parse(localStorage.getItem('user_points') || '{}');
    const badgesData = JSON.parse(localStorage.getItem('user_badges') || '{}');

    if (!pointsData[username]) {
      pointsData[username] = {
        totalPoints: 0,
        streak: 0,
        lastPurchaseDate: null
      };
    }

    const userData = pointsData[username];
    const level = this.calculateLevel(userData.totalPoints);
    const currentLevelPoints = this.LEVEL_THRESHOLDS[level];
    const nextLevelPoints = this.LEVEL_THRESHOLDS[level + 1] || currentLevelPoints + 5000;

    return {
      username,
      totalPoints: userData.totalPoints,
      level,
      currentLevelPoints,
      nextLevelPoints,
      badges: badgesData[username] || [],
      streak: userData.streak,
      lastPurchaseDate: userData.lastPurchaseDate ? new Date(userData.lastPurchaseDate) : null
    };
  }

  /**
   * Award points for an action
   */
  public awardPoints(
    username: string,
    action: keyof typeof GamificationService.prototype.POINTS_CONFIG,
    multiplier: number = 1
  ): {
    pointsAwarded: number;
    newTotal: number;
    levelUp: boolean;
    newLevel?: number;
    badgeEarned?: Badge;
  } {
    const pointsData = JSON.parse(localStorage.getItem('user_points') || '{}');
    
    if (!pointsData[username]) {
      pointsData[username] = { totalPoints: 0, streak: 0, lastPurchaseDate: null };
    }

    const basePoints = this.POINTS_CONFIG[action];
    const pointsAwarded = Math.round(basePoints * multiplier);
    const oldTotal = pointsData[username].totalPoints;
    const newTotal = oldTotal + pointsAwarded;

    const oldLevel = this.calculateLevel(oldTotal);
    const newLevel = this.calculateLevel(newTotal);
    const levelUp = newLevel > oldLevel;

    pointsData[username].totalPoints = newTotal;
    localStorage.setItem('user_points', JSON.stringify(pointsData));

    // Check for milestone badges
    let badgeEarned: Badge | undefined;
    if (newTotal >= 1000 && oldTotal < 1000) {
      badgeEarned = this.awardBadge(username, 'POINTS_1000');
    } else if (newTotal >= 5000 && oldTotal < 5000) {
      badgeEarned = this.awardBadge(username, 'POINTS_5000');
    }

    console.log(`ðŸŽ® ${username} earned ${pointsAwarded} points for ${action}`);
    if (levelUp) {
      console.log(`ðŸŽ‰ Level up! Now level ${newLevel}`);
    }

    return {
      pointsAwarded,
      newTotal,
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
      badgeEarned
    };
  }

  /**
   * Award badge to user
   */
  public awardBadge(username: string, badgeId: string): Badge {
    const badgesData = JSON.parse(localStorage.getItem('user_badges') || '{}');
    
    if (!badgesData[username]) {
      badgesData[username] = [];
    }

    // Check if badge already earned
    if (badgesData[username].find((b: Badge) => b.id === badgeId)) {
      return badgesData[username].find((b: Badge) => b.id === badgeId);
    }

    const badge = this.getBadgeDefinition(badgeId);
    badge.earnedDate = new Date();

    badgesData[username].push(badge);
    localStorage.setItem('user_badges', JSON.stringify(badgesData));

    console.log(`ðŸ† ${username} earned badge: ${badge.name}`);

    return badge;
  }

  /**
   * Update purchase streak
   */
  public updateStreak(username: string): number {
    const pointsData = JSON.parse(localStorage.getItem('user_points') || '{}');
    
    if (!pointsData[username]) {
      pointsData[username] = { totalPoints: 0, streak: 0, lastPurchaseDate: null };
    }

    const now = new Date();
    const lastPurchase = pointsData[username].lastPurchaseDate 
      ? new Date(pointsData[username].lastPurchaseDate)
      : null;

    if (lastPurchase) {
      const daysDiff = Math.floor((now.getTime() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - increase streak
        pointsData[username].streak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        pointsData[username].streak = 1;
      }
      // Same day - no change
    } else {
      // First purchase
      pointsData[username].streak = 1;
    }

    pointsData[username].lastPurchaseDate = now.toISOString();
    localStorage.setItem('user_points', JSON.stringify(pointsData));

    // Award streak bonus
    if (pointsData[username].streak > 1) {
      const streakBonus = pointsData[username].streak * this.POINTS_CONFIG.STREAK_BONUS;
      this.awardPoints(username, 'STREAK_BONUS', pointsData[username].streak);
    }

    // Check for streak badges
    const streak = pointsData[username].streak;
    if (streak === 7) {
      this.awardBadge(username, 'STREAK_7');
    } else if (streak === 30) {
      this.awardBadge(username, 'STREAK_30');
    }

    return pointsData[username].streak;
  }

  /**
   * Get active challenges for user
   */
  public getChallenges(username: string): Challenge[] {
    const challenges = JSON.parse(localStorage.getItem('challenges') || '[]');
    const userProgress = JSON.parse(localStorage.getItem(`challenges_${username}`) || '{}');

    return challenges.map((c: Challenge) => ({
      ...c,
      progress: userProgress[c.id] || 0,
      completed: (userProgress[c.id] || 0) >= c.goal
    }));
  }

  /**
   * Update challenge progress
   */
  public updateChallengeProgress(
    username: string,
    challengeId: string,
    progress: number
  ): { completed: boolean; reward?: any } {
    const userProgress = JSON.parse(localStorage.getItem(`challenges_${username}`) || '{}');
    const challenges = JSON.parse(localStorage.getItem('challenges') || '[]');
    
    const challenge = challenges.find((c: Challenge) => c.id === challengeId);
    if (!challenge) return { completed: false };

    const oldProgress = userProgress[challengeId] || 0;
    userProgress[challengeId] = Math.min(progress, challenge.goal);
    
    const completed = userProgress[challengeId] >= challenge.goal && oldProgress < challenge.goal;

    localStorage.setItem(`challenges_${username}`, JSON.stringify(userProgress));

    if (completed) {
      // Award challenge rewards
      this.awardPoints(username, 'PURCHASE', challenge.reward.points / 10);
      
      if (challenge.reward.badge) {
        this.awardBadge(username, challenge.reward.badge.id);
      }

      console.log(`ðŸŽ¯ ${username} completed challenge: ${challenge.title}`);

      return {
        completed: true,
        reward: challenge.reward
      };
    }

    return { completed: false };
  }

  /**
   * Get leaderboard
   */
  public getLeaderboard(limit: number = 10): LeaderboardEntry[] {
    const pointsData = JSON.parse(localStorage.getItem('user_points') || '{}');
    const badgesData = JSON.parse(localStorage.getItem('user_badges') || '{}');

    const entries: LeaderboardEntry[] = Object.keys(pointsData).map(username => {
      const userData = pointsData[username];
      return {
        rank: 0,
        username,
        fullName: this.getUserFullName(username),
        points: userData.totalPoints,
        level: this.calculateLevel(userData.totalPoints),
        badges: (badgesData[username] || []).length
      };
    });

    // Sort by points
    entries.sort((a, b) => b.points - a.points);

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries.slice(0, limit);
  }

  /**
   * Get available rewards
   */
  public getAvailableRewards(): Reward[] {
    return [
      {
        id: 'DISCOUNT_10',
        name: '10% Off Next Purchase',
        description: 'Get 10% discount on your next order',
        pointsCost: 200,
        type: 'discount',
        value: 10,
        available: true
      },
      {
        id: 'DISCOUNT_20',
        name: '20% Off Next Purchase',
        description: 'Get 20% discount on your next order',
        pointsCost: 500,
        type: 'discount',
        value: 20,
        available: true
      },
      {
        id: 'FREE_DELIVERY',
        name: 'Free Delivery',
        description: 'Free delivery on your next order',
        pointsCost: 150,
        type: 'deliveryFree',
        value: 'Free delivery',
        available: true
      },
      {
        id: 'FREE_BREAD',
        name: 'Free Bread',
        description: 'Get a free loaf of bread',
        pointsCost: 100,
        type: 'freeItem',
        value: 'Bread',
        available: true
      },
      {
        id: 'CREDIT_BOOST',
        name: 'Credit Score Boost',
        description: 'Improve your credit score rating',
        pointsCost: 800,
        type: 'creditBoost',
        value: '+10 points',
        available: true
      }
    ];
  }

  /**
   * Redeem reward
   */
  public redeemReward(username: string, rewardId: string): {
    success: boolean;
    message: string;
    couponCode?: string;
  } {
    const rewards = this.getAvailableRewards();
    const reward = rewards.find(r => r.id === rewardId);

    if (!reward) {
      return { success: false, message: 'Reward not found' };
    }

    const userPoints = this.getUserPoints(username);

    if (userPoints.totalPoints < reward.pointsCost) {
      return { 
        success: false, 
        message: `Not enough points. Need ${reward.pointsCost - userPoints.totalPoints} more points.` 
      };
    }

    // Deduct points
    const pointsData = JSON.parse(localStorage.getItem('user_points') || '{}');
    pointsData[username].totalPoints -= reward.pointsCost;
    localStorage.setItem('user_points', JSON.stringify(pointsData));

    // Generate coupon code
    const couponCode = `${reward.type.toUpperCase()}-${Date.now().toString(36)}`;

    // Store redeemed reward
    const redeemedRewards = JSON.parse(localStorage.getItem('redeemed_rewards') || '{}');
    if (!redeemedRewards[username]) {
      redeemedRewards[username] = [];
    }
    redeemedRewards[username].push({
      rewardId,
      couponCode,
      redeemedDate: new Date().toISOString(),
      used: false
    });
    localStorage.setItem('redeemed_rewards', JSON.stringify(redeemedRewards));

    console.log(`ðŸŽ ${username} redeemed ${reward.name} for ${reward.pointsCost} points`);

    return {
      success: true,
      message: `Successfully redeemed ${reward.name}!`,
      couponCode
    };
  }

  // Helper methods
  private calculateLevel(points: number): number {
    for (let i = this.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (points >= this.LEVEL_THRESHOLDS[i]) {
        return i;
      }
    }
    return 0;
  }

  private getBadgeDefinition(badgeId: string): Badge {
    const badges: Record<string, Badge> = {
      POINTS_1000: {
        id: 'POINTS_1000',
        name: 'Points Collector',
        description: 'Earned 1,000 points',
        icon: 'ðŸŒŸ',
        rarity: 'Common',
        earnedDate: new Date(),
        pointsValue: 50
      },
      POINTS_5000: {
        id: 'POINTS_5000',
        name: 'Points Master',
        description: 'Earned 5,000 points',
        icon: 'â­',
        rarity: 'Rare',
        earnedDate: new Date(),
        pointsValue: 200
      },
      STREAK_7: {
        id: 'STREAK_7',
        name: 'Week Warrior',
        description: '7 day purchase streak',
        icon: 'ðŸ”¥',
        rarity: 'Rare',
        earnedDate: new Date(),
        pointsValue: 100
      },
      STREAK_30: {
        id: 'STREAK_30',
        name: 'Monthly Champion',
        description: '30 day purchase streak',
        icon: 'ðŸ‘‘',
        rarity: 'Epic',
        earnedDate: new Date(),
        pointsValue: 500
      },
      FIRST_PURCHASE: {
        id: 'FIRST_PURCHASE',
        name: 'Welcome Aboard',
        description: 'Made first purchase',
        icon: 'ðŸŽ‰',
        rarity: 'Common',
        earnedDate: new Date(),
        pointsValue: 20
      }
    };

    return badges[badgeId] || badges['FIRST_PURCHASE'];
  }

  private generateChallenges(): Challenge[] {
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'DAILY_LOGIN',
        title: 'Daily Visitor',
        description: 'Login for 7 consecutive days',
        type: 'weekly',
        goal: 7,
        progress: 0,
        reward: { points: 100 },
        expiresAt: weekEnd,
        completed: false
      },
      {
        id: 'SPEND_1000',
        title: 'Big Spender',
        description: 'Spend R1,000 this month',
        type: 'monthly',
        goal: 1000,
        progress: 0,
        reward: { points: 500 },
        expiresAt: monthEnd,
        completed: false
      },
      {
        id: 'TRY_5_CATEGORIES',
        title: 'Category Explorer',
        description: 'Purchase from 5 different categories',
        type: 'weekly',
        goal: 5,
        progress: 0,
        reward: { points: 200 },
        expiresAt: weekEnd,
        completed: false
      }
    ];
  }

  private getUserFullName(username: string): string {
    // This would fetch from database in production
    return username.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

export const gamificationService = GamificationService.getInstance();




