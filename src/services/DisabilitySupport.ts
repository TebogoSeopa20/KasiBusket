import { DisabilityProfile } from '../types';

export class DisabilitySupport {
  private customerDisabilities: Map<string, DisabilityProfile>;

  constructor() {
    this.customerDisabilities = new Map();
    this.initializeSampleDisabilities();
  }

  private initializeSampleDisabilities() {
    this.customerDisabilities.set('sarah55', {
      username: 'sarah55',
      disabilityType: 'Visual Impairment',
      specialRequirements: 'Requires assistance with reading labels and handling cash',
      registrationDate: new Date('2024-01-15')
    });

    this.customerDisabilities.set('disabled_user', {
      username: 'disabled_user',
      disabilityType: 'Mobility Impairment',
      specialRequirements: 'Needs home delivery and assistance with carrying items',
      registrationDate: new Date('2024-02-01')
    });
  }

  registerDisability(username: string, disabilityType: string, specialRequirements: string) {
    this.customerDisabilities.set(username, {
      username,
      disabilityType,
      specialRequirements,
      registrationDate: new Date()
    });
  }

  getDisabilityProfile(username: string): DisabilityProfile | undefined {
    return this.customerDisabilities.get(username);
  }

  hasDisability(username: string): boolean {
    return this.customerDisabilities.has(username);
  }

  getSpecialInstructions(username: string): string[] {
    const profile = this.customerDisabilities.get(username);
    if (!profile) return [];

    return [
      `Special attention required: ${profile.disabilityType}`,
      `Requirements: ${profile.specialRequirements}`,
      'Driver should call before arrival',
      'Assist with carrying items if needed',
      'Be patient and provide clear communication'
    ];
  }

  getAllProfiles(): DisabilityProfile[] {
    return Array.from(this.customerDisabilities.values());
  }
}

export const disabilitySupport = new DisabilitySupport();




