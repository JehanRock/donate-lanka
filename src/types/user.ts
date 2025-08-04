export type UserRole = 'donor' | 'creator' | 'admin' | 'organization';
export type AccountStatus = 'active' | 'pending' | 'suspended' | 'deactivated';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Creator specific fields
  creatorProfile?: CreatorProfile;
  
  // Statistics
  totalDonated?: number;
  totalRaised?: number;
  projectsCreated?: number;
  projectsSupported?: number;
}

export interface CreatorProfile {
  organizationName?: string;
  organizationType?: 'individual' | 'nonprofit' | 'business' | 'charity';
  taxId?: string;
  bankDetails?: BankDetails;
  documents?: UserDocument[];
  rating: number;
  totalReviews: number;
  successfulProjects: number;
  completionRate: number;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode?: string;
}

export interface UserDocument {
  id: string;
  type: 'id_card' | 'passport' | 'business_license' | 'tax_certificate' | 'bank_statement';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewNotes?: string;
}

export interface UserPreferences {
  emailNotifications: {
    projectUpdates: boolean;
    newProjects: boolean;
    fundingGoalReached: boolean;
    projectLaunched: boolean;
    newsletter: boolean;
  };
  privacy: {
    showDonations: boolean;
    showProfile: boolean;
    allowMessages: boolean;
  };
  language: string;
  currency: string;
  timezone: string;
}

// Form types
export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

export interface UserProfileUpdateData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: User['socialLinks'];
}

export interface CreatorOnboardingData {
  organizationName?: string;
  organizationType: CreatorProfile['organizationType'];
  taxId?: string;
  bankDetails: BankDetails;
}