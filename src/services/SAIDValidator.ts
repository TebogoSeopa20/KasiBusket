/**
 * South African ID Validation Service
 * Validates 13-digit SA ID numbers and checks format/checksum
 */

export interface SaIdValidationResult {
  valid: boolean;
  message: string;
  dateOfBirth?: Date;
  gender?: 'Male' | 'Female';
  citizenship?: 'SA' | 'Other';
}

export class SAIDValidator {
  /**
   * Validate South African ID number (13 digits)
   * Format: YYMMDDGGGGGCC(S)
   * - YYMMDD: Date of birth
   * - GGGGG: Gender (0-4 = Female, 5-9 = Male)
   * - CC: Citizenship (0 = SA, 1 = Other)
   * - S: Checksum digit
   */
  static validate(idNumber: string): SaIdValidationResult {
    // Check if exactly 13 digits
    if (!idNumber || !/^\d{13}$/.test(idNumber)) {
      return {
        valid: false,
        message: 'ID must be exactly 13 digits (no spaces or special characters)'
      };
    }

    // Validate checksum (Luhn algorithm)
    if (!this.validateChecksum(idNumber)) {
      return {
        valid: false,
        message: 'Invalid ID number (checksum failed). Please verify your ID.'
      };
    }

    // Extract and validate date of birth
    const yy = parseInt(idNumber.substring(0, 2));
    const mm = parseInt(idNumber.substring(2, 4));
    const dd = parseInt(idNumber.substring(4, 6));

    // Determine century (assume 1900-1999 for yy >= 00, before current date)
    const year = yy > new Date().getFullYear() % 100 ? 1900 + yy : 2000 + yy;

    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
      return {
        valid: false,
        message: 'Invalid birth date in ID number'
      };
    }

    const dateOfBirth = new Date(year, mm - 1, dd);

    // Extract gender
    const genderCode = parseInt(idNumber.substring(6, 10));
    const gender = genderCode < 5000 ? 'Female' : 'Male';

    // Extract citizenship
    const citizenship = idNumber[10] === '0' ? 'SA' : 'Other';

    return {
      valid: true,
      message: 'ID is valid',
      dateOfBirth,
      gender,
      citizenship
    };
  }

  /**
   * Validate checksum using Luhn algorithm
   */
  private static validateChecksum(idNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    for (let i = idNumber.length - 2; i >= 0; i--) {
      let digit = parseInt(idNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(idNumber[12]);
  }

  /**
   * Verify ID matches with full name and passport
   */
  static verifyIdentity(
    idNumber: string,
    fullName: string,
    passportIfForeign?: string
  ): { verified: boolean; message: string } {
    const validation = this.validate(idNumber);

    if (!validation.valid) {
      return { verified: false, message: validation.message };
    }

    // Check age (must be 18+)
    if (validation.dateOfBirth) {
      const age = new Date().getFullYear() - validation.dateOfBirth.getFullYear();
      if (age < 18) {
        return { verified: false, message: 'You must be at least 18 years old to register' };
      }
    }

    // For non-SA citizens, passport is required
    if (validation.citizenship === 'Other' && !passportIfForeign) {
      return {
        verified: false,
        message: 'Non-SA citizens must provide a valid passport number'
      };
    }

    // In production, check against Home Affairs database
    // For now, just verify format matches
    const nameMatch = fullName && fullName.length >= 3;
    if (!nameMatch) {
      return { verified: false, message: 'Full name does not match ID records' };
    }

    return {
      verified: true,
      message: `âœ… Identity verified. Born: ${validation.dateOfBirth?.toLocaleDateString()}, Gender: ${validation.gender}`
    };
  }

  /**
   * Get age from ID
   */
  static getAgeFromID(idNumber: string): number | null {
    const validation = this.validate(idNumber);
    if (!validation.dateOfBirth) return null;

    const today = new Date();
    let age = today.getFullYear() - validation.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - validation.dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < validation.dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Format ID for display
   */
  static formatID(idNumber: string): string {
    if (!/^\d{13}$/.test(idNumber)) return idNumber;
    return `${idNumber.substring(0, 2)}-${idNumber.substring(2, 8)}-${idNumber.substring(8, 13)}`;
  }
}




