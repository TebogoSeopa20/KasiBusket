// OTP and SMS/Email Service for customer verification

export interface OTPRecord {
  email: string;
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

const otpStore = new Map<string, OTPRecord>();

export class OTPService {
  /**
   * Generate a 6-digit OTP
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP via email (simulated - in production use SendGrid, AWS SES, etc)
   */
  static async sendOTPEmail(email: string, otp: string, fullName: string): Promise<boolean> {
    try {
      // In production, integrate with Supabase functions or email service
      console.log(`ðŸ“§ EMAIL OTP SENT to ${email}`);
      console.log(`Subject: Your Spaza Eats OTP Verification Code`);
      console.log(`Body: Dear ${fullName}, your OTP is: ${otp}. Valid for 10 minutes.`);
      
      // Store OTP
      otpStore.set(email, {
        email,
        phone: '',
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        attempts: 0,
        verified: false
      });

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 500);
      });
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return false;
    }
  }

  /**
   * Send OTP via SMS (simulated - in production use Twilio, AWS SNS, etc)
   */
  static async sendOTPSMS(
    phone: string,
    otp: string,
    fullName: string = 'Customer',
  ): Promise<boolean> {
    try {
      // In production, integrate with Twilio or AWS SNS
      console.log(`ðŸ“± SMS OTP SENT to ${phone}`);
      console.log(`Message: Hi ${fullName}, your Spaza Eats OTP is: ${otp}. Valid for 10 minutes.`);

      // Store OTP
      otpStore.set(phone, {
        email: '',
        phone,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        attempts: 0,
        verified: false
      });

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 500);
      });
    } catch (error) {
      console.error('Error sending OTP SMS:', error);
      return false;
    }
  }

  /**
   * Verify OTP
   */
  static verifyOTP(identifier: string, otp: string): { valid: boolean; message: string } {
    const record = otpStore.get(identifier);

    if (!record) {
      return { valid: false, message: 'OTP not found. Request a new OTP.' };
    }

    if (new Date() > record.expiresAt) {
      otpStore.delete(identifier);
      return { valid: false, message: 'OTP expired. Request a new one.' };
    }

    if (record.attempts > 5) {
      otpStore.delete(identifier);
      return { valid: false, message: 'Too many attempts. Request a new OTP.' };
    }

    if (record.otp !== otp) {
      record.attempts += 1;
      return { valid: false, message: `Invalid OTP. ${6 - record.attempts} attempts left.` };
    }

    // Valid OTP
    record.verified = true;
    return { valid: true, message: 'OTP verified successfully!' };
  }

  /**
   * Check if OTP is verified
   */
  static isOTPVerified(identifier: string): boolean {
    const record = otpStore.get(identifier);
    return record?.verified || false;
  }

  /**
   * Clear OTP record
   */
  static clearOTP(identifier: string): void {
    otpStore.delete(identifier);
  }

  /**
   * Get demo OTP (for testing - remove in production)
   */
  static getDemoOTP(identifier: string): string | null {
    const record = otpStore.get(identifier);
    return record?.otp || null;
  }
}




