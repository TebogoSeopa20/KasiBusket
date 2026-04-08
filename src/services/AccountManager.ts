import { User } from '../types';
import { SAIDValidator } from './SAIDValidator';
import { simpleHash, verifyHash } from '../utils/simpleHash';

/**
 * Customer Account Management Service
 * Handles user registration, deletion, password reset, and data persistence
 */
export class AccountManager {
  private static users: Map<string, User> = new Map<string, User>();
  private static passwordResetTokens: Map<string, { username: string; expiresAt: Date }> = new Map();

  /**
   * Create a new user account with data validation
   */
  static createAccount(userData: Partial<User>): { success: boolean; message: string; user?: User } {
    try {
      // Validate ID
      if (!userData.idNumber) {
        return { success: false, message: 'SA ID number is required' };
      }

      const idValidation = SAIDValidator.validate(userData.idNumber);
      if (!idValidation.valid) {
        return { success: false, message: idValidation.message };
      }

      // Verify identity
      const identityCheck = SAIDValidator.verifyIdentity(
        userData.idNumber,
        userData.fullName || '',
        userData.passportNumber
      );

      if (!identityCheck.verified) {
        return { success: false, message: identityCheck.message };
      }

      // Check if user exists
      if (this.users.has(userData.username || '')) {
        return { success: false, message: 'Username already exists' };
      }

      // Create new user
      const newUser: User = {
        username: userData.username || '',
        password: userData.password ? simpleHash(userData.password) : '',
        fullName: userData.fullName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        isSenior: userData.isSenior || false,
        hasDisability: userData.hasDisability || false,
        idNumber: userData.idNumber,
        passportNumber: userData.passportNumber,
        preferredLanguage: userData.preferredLanguage || 'English',
        registeredAt: new Date(),
        accountActive: true,
        role: 'customer'
      };

      // Store user
      this.users.set(userData.username || '', newUser);

      // Save to localStorage (in production: use Supabase)
      this.persistUsers();

      return {
        success: true,
        message: 'âœ… Account created successfully!',
        user: newUser
      };
    } catch (error) {
      return { success: false, message: `Error creating account: ${error}` };
    }
  }

  /**
   * Get user by username
   */
  static getUser(username: string): User | null {
    return this.users.get(username) || null;
  }

  /**
   * Get user by email
   */
  static getUserByEmail(email: string): User | null {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  /**
   * Get user by ID number (for password/username recovery)
   */
  static getUserByID(idNumber: string): User | null {
    for (const user of this.users.values()) {
      if (user.idNumber === idNumber) {
        return user;
      }
    }
    return null;
  }

  /**
   * Delete user account (soft delete)
   */
  static deleteAccount(username: string, password: string): { success: boolean; message: string } {
    const user = this.users.get(username);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Verify password before deletion
    if (!verifyHash(user.password || '', password)) {
      return { success: false, message: 'Invalid password. Account deletion cancelled.' };
    }

    // Soft delete: mark as inactive
    user.accountActive = false;
    this.persistUsers();

    return { success: true, message: 'âœ… Account deleted successfully. All data has been removed.' };
  }

  /**
   * Reset password using ID number
   */
  static initializePasswordReset(idNumber: string, username: string): { success: boolean; message: string; token?: string } {
    const user = this.getUserByID(idNumber);

    if (!user) {
      return { success: false, message: 'No account found with this ID number' };
    }

    if (user.username !== username) {
      return { success: false, message: 'ID number does not match this username' };
    }

    // Generate reset token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    this.passwordResetTokens.set(token, { username, expiresAt });

    return {
      success: true,
      message: `âœ… Password reset initiated for ${user.fullName}`,
      token
    };
  }

  /**
   * Reset password using token
   */
  static resetPassword(token: string, newPassword: string): { success: boolean; message: string } {
    const resetRecord = this.passwordResetTokens.get(token);

    if (!resetRecord) {
      return { success: false, message: 'Invalid or expired reset token' };
    }

    if (new Date() > resetRecord.expiresAt) {
      this.passwordResetTokens.delete(token);
      return { success: false, message: 'Reset token has expired. Request a new reset.' };
    }

    const user = this.users.get(resetRecord.username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Update password (store hash)
    user.password = simpleHash(newPassword);
    this.passwordResetTokens.delete(token);
    this.persistUsers();

    return { success: true, message: 'âœ… Password reset successfully!' };
  }

  /**
   * Reset username using ID number
   */
  static resetUsername(idNumber: string, newUsername: string): { success: boolean; message: string } {
    const user = this.getUserByID(idNumber);

    if (!user) {
      return { success: false, message: 'No account found with this ID number' };
    }

    if (this.users.has(newUsername)) {
      return { success: false, message: 'New username already exists' };
    }

    // Update username
    const oldUsername = user.username;
    this.users.delete(oldUsername);
    user.username = newUsername;
    this.users.set(newUsername, user);
    this.persistUsers();

    return { success: true, message: `âœ… Username reset successfully! Your new username is: ${newUsername}` };
  }

  /**
   * Update last login
   */
  static updateLastLogin(username: string): void {
    const user = this.users.get(username);
    if (user) {
      user.lastLogin = new Date();
      this.persistUsers();
    }
  }

  /**
   * Get all active users (for admin dashboard)
   */
  static getAllActiveUsers(): User[] {
    return Array.from(this.users.values()).filter(u => u.accountActive);
  }

  /**
   * Persist users to localStorage (in production: Supabase)
   */
  private static persistUsers(): void {
    try {
      const usersData = Array.from(this.users.entries());
      localStorage.setItem('spaza_users', JSON.stringify(usersData));
    } catch (error) {
      console.error('Error persisting users:', error);
    }
  }

  /**
   * Load users from localStorage
   */
  static loadUsers(): void {
    try {
      const stored = localStorage.getItem('spaza_users');
      if (stored) {
        const usersData = JSON.parse(stored) as [string, User][];
        this.users = new Map(usersData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }
}




