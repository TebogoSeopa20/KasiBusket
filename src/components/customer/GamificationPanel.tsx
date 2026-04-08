import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Trophy,
  Star,
  Zap,
  Gift,
  Target,
  Award,
  TrendingUp,
  Flame,
  Crown,
  Sparkles
} from 'lucide-react';
import { gamificationService, UserPoints, Challenge, Reward, LeaderboardEntry } from '../../services/GamificationService';
import { toast } from 'sonner';

interface GamificationPanelProps {
  username: string;
  fullName: string;
}

export function GamificationPanel({ username, fullName }: GamificationPanelProps) {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadGamificationData();
  }, [username]);

  const loadGamificationData = () => {
    const points = gamificationService.getUserPoints(username);
    const activeChallenges = gamificationService.getChallenges(username);
    const availableRewards = gamificationService.getAvailableRewards();
    const board = gamificationService.getLeaderboard(10);

    setUserPoints(points);
    setChallenges(activeChallenges);
    setRewards(availableRewards);
    setLeaderboard(board);
  };

  const handleRedeemReward = (rewardId: string) => {
    const result = gamificationService.redeemReward(username, rewardId);
    
    if (result.success) {
      toast.success(result.message, {
        description: result.couponCode ? `Coupon Code: ${result.couponCode}` : undefined
      });
      loadGamificationData();
    } else {
      toast.error(result.message);
    }
  };

  const getLevelBadgeColor = (level: number) => {
    if (level >= 8) return 'linear-gradient(135deg, #8b5cf6, #ec4899)';
    if (level >= 5) return 'linear-gradient(135deg, #f59e0b, #ea580c)';
    if (level >= 3) return 'linear-gradient(135deg, #3b82f6, #06b6d4)';
    return 'linear-gradient(135deg, #226b2a, #48bb78)';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'linear-gradient(135deg, #faf5ff, #f3e8ff)';
      case 'Epic': return 'linear-gradient(135deg, #fdf2f8, #fce7f3)';
      case 'Rare': return 'linear-gradient(135deg, #eff6ff, #dbeafe)';
      default: return 'linear-gradient(135deg, #f9fafb, #f3f4f6)';
    }
  };

  if (!userPoints) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ 
          padding: '2rem', 
          background: 'linear-gradient(135deg, #e8f5e2, #f0fdf4)', 
          border: '1px solid #bbf7d0',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1s ease-in-out infinite' }}>🎮</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d1f0e', marginBottom: '0.5rem' }}>
            Loading your gamification data...
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#5a6b50' }}>Fetching your achievements and progress</p>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

  const progressToNextLevel = ((userPoints.totalPoints - userPoints.currentLevelPoints) / 
    (userPoints.nextLevelPoints - userPoints.currentLevelPoints)) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Card - User Stats */}
      <div style={{ 
        position: 'relative',
        overflow: 'hidden',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: getLevelBadgeColor(userPoints.level), 
          opacity: 0.1 
        }} />
        <div style={{ position: 'relative', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: getLevelBadgeColor(userPoints.level), 
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <Crown size={24} style={{ margin: '0 auto 4px' }} />
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{userPoints.level}</p>
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0d1f0e' }}>{fullName}</h2>
                <p style={{ fontSize: '0.85rem', color: '#5a6b50', margin: '4px 0 0' }}>Level {userPoints.level} Member</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {userPoints.streak > 0 && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: '#fef3c7', 
                      color: '#92400e', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Flame size={12} /> {userPoints.streak} day streak
                    </span>
                  )}
                  <span style={{ 
                    fontSize: '0.7rem', 
                    background: '#e8f5e2', 
                    color: '#226b2a', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Award size={12} /> {userPoints.badges.length} badges
                  </span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                <Sparkles size={20} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{userPoints.totalPoints}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#5a6b50', margin: 0 }}>Total Points</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#5a6b50' }}>Progress to Level {userPoints.level + 1}</span>
              <span style={{ fontWeight: 600, color: '#226b2a' }}>
                {userPoints.totalPoints - userPoints.currentLevelPoints} / {userPoints.nextLevelPoints - userPoints.currentLevelPoints}
              </span>
            </div>
            <div style={{
              width: '100%',
              background: '#e5e7eb',
              borderRadius: '9999px',
              height: '10px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${progressToNextLevel}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #226b2a, #48bb78)',
                  borderRadius: '9999px',
                  transition: 'width 0.5s ease-out'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '0.5rem',
          background: '#f9fafb', 
          borderRadius: '0.75rem', 
          padding: '0.25rem',
          marginBottom: '1.5rem'
        }}>
          {['overview', 'challenges', 'rewards', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                padding: '0.6rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedTab === tab ? '#226b2a' : 'transparent',
                color: selectedTab === tab ? 'white' : '#5a6b50',
                border: 'none',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'challenges' && '🎯 Challenges'}
              {tab === 'rewards' && '🎁 Rewards'}
              {tab === 'leaderboard' && '🏆 Leaderboard'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Badges Section */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} /> Your Badges
                </h3>
              </div>
              <div style={{ padding: '1.25rem' }}>
                {userPoints.badges.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
                    <p style={{ fontSize: '0.85rem', color: '#5a6b50' }}>Complete challenges to earn badges!</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                    {userPoints.badges.map((badge) => (
                      <div
                        key={badge.id}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '0.75rem',
                          background: getRarityColor(badge.rarity),
                          border: `1px solid ${
                            badge.rarity === 'Legendary' ? '#d8b4fe' : 
                            badge.rarity === 'Epic' ? '#fbcfe8' : 
                            badge.rarity === 'Rare' ? '#bfdbfe' : '#e5e7eb'
                          }`,
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0d1f0e', marginBottom: '0.25rem' }}>{badge.name}</p>
                        <p style={{ fontSize: '0.65rem', color: '#5a6b50', marginBottom: '0.5rem' }}>{badge.description}</p>
                        <span style={{ 
                          fontSize: '0.6rem', 
                          background: 'white', 
                          padding: '0.15rem 0.4rem', 
                          borderRadius: '9999px',
                          color: '#6b21a5'
                        }}>
                          {badge.rarity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Section */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} /> Quick Stats
                </h3>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#e8f5e2', borderRadius: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Star size={18} style={{ color: '#226b2a' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#0d1f0e' }}>Current Level</span>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#226b2a' }}>{userPoints.level}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#dbeafe', borderRadius: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Zap size={18} style={{ color: '#2563eb' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#0d1f0e' }}>Total Points</span>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{userPoints.totalPoints}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#fef3c7', borderRadius: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Flame size={18} style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#0d1f0e' }}>Current Streak</span>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>{userPoints.streak} days</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f3e8ff', borderRadius: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={18} style={{ color: '#8b5cf6' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#0d1f0e' }}>Badges Earned</span>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#8b5cf6' }}>{userPoints.badges.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {selectedTab === 'challenges' && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={18} /> Active Challenges
              </h3>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50', margin: '0.25rem 0 0' }}>Complete challenges to earn points and badges</p>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      background: challenge.completed ? '#f0fdf4' : 'white',
                      border: `1px solid ${challenge.completed ? '#bbf7d0' : '#e5e7eb'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0d1f0e', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {challenge.title}
                          {challenge.completed && (
                            <span style={{ fontSize: '0.65rem', background: '#226b2a', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                              Completed!
                            </span>
                          )}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#5a6b50', marginTop: '0.25rem' }}>{challenge.description}</p>
                      </div>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        background: '#fef3c7', 
                        color: '#92400e', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '9999px',
                        textTransform: 'capitalize'
                      }}>
                        {challenge.type}
                      </span>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#5a6b50' }}>Progress</span>
                        <span style={{ fontWeight: 600, color: '#226b2a' }}>
                          {challenge.progress} / {challenge.goal}
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        background: '#e5e7eb',
                        borderRadius: '9999px',
                        height: '6px',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            width: `${(challenge.progress / challenge.goal) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #226b2a, #48bb78)',
                            borderRadius: '9999px',
                            transition: 'width 0.5s ease-out'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                        <Gift size={14} style={{ color: '#f59e0b' }} />
                        <span style={{ fontWeight: 500, color: '#0d1f0e' }}>Reward: {challenge.reward.points} points</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
                        Expires: {new Date(challenge.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {selectedTab === 'rewards' && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gift size={18} /> Available Rewards
              </h3>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50', margin: '0.25rem 0 0' }}>Redeem your points for exclusive rewards</p>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {rewards.map((reward) => {
                  const canAfford = userPoints.totalPoints >= reward.pointsCost;
                  return (
                    <div
                      key={reward.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        background: canAfford ? '#f0fdf4' : '#f9fafb',
                        border: `1px solid ${canAfford ? '#bbf7d0' : '#e5e7eb'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0d1f0e', margin: 0 }}>{reward.name}</h4>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          background: canAfford ? '#226b2a' : '#9ca3af', 
                          color: 'white', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '9999px' 
                        }}>
                          {reward.pointsCost} pts
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#5a6b50', marginBottom: '1rem' }}>{reward.description}</p>
                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        disabled={!canAfford}
                        style={{
                          width: '100%',
                          background: canAfford ? '#226b2a' : '#e5e7eb',
                          color: canAfford ? 'white' : '#9ca3af',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: canAfford ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          if (canAfford) e.currentTarget.style.background = '#1a5420';
                        }}
                        onMouseLeave={e => {
                          if (canAfford) e.currentTarget.style.background = '#226b2a';
                        }}
                      >
                        {canAfford ? '🎁 Redeem Now' : `Need ${reward.pointsCost - userPoints.totalPoints} more points`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {selectedTab === 'leaderboard' && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#226b2a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={18} /> Top Players
              </h3>
              <p style={{ fontSize: '0.7rem', color: '#5a6b50', margin: '0.25rem 0 0' }}>See how you rank against other customers</p>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {leaderboard.map((entry) => {
                  const isCurrentUser = entry.username === username;
                  const getMedalIcon = () => {
                    if (entry.rank === 1) return '🥇';
                    if (entry.rank === 2) return '🥈';
                    if (entry.rank === 3) return '🥉';
                    return null;
                  };

                  return (
                    <div
                      key={entry.username}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isCurrentUser ? '#f0fdf4' : '#f9fafb',
                        border: isCurrentUser ? '1px solid #bbf7d0' : '1px solid #f3f4f6'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '2rem', textAlign: 'center' }}>
                          {getMedalIcon() ? (
                            <span style={{ fontSize: '1.25rem' }}>{getMedalIcon()}</span>
                          ) : (
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9ca3af' }}>#{entry.rank}</span>
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0d1f0e', margin: 0 }}>
                            {entry.fullName}
                            {isCurrentUser && <span style={{ fontSize: '0.65rem', color: '#226b2a', marginLeft: '0.5rem' }}>(You)</span>}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', color: '#5a6b50', marginTop: '0.25rem' }}>
                            <span>Level {entry.level}</span>
                            <span>•</span>
                            <span>{entry.badges} badges</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b', margin: 0 }}>{entry.points}</p>
                        <p style={{ fontSize: '0.6rem', color: '#9ca3af', margin: 0 }}>points</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}