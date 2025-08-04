export type CampaignStatus = 'draft' | 'review' | 'approved' | 'active' | 'paused' | 'completed' | 'cancelled';
export type CampaignType = 'project' | 'charity' | 'emergency' | 'personal' | 'business';

export interface Campaign {
  id: string;
  type: CampaignType;
  
  // Basic information
  title: string;
  slug: string;
  tagline: string;
  description: string;
  
  // Campaign details
  fundingGoal: number;
  currentAmount: number;
  currency: string;
  
  // Timeline
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  
  // Status
  status: CampaignStatus;
  isPublished: boolean;
  isFeatured: boolean;
  
  // Creator
  creatorId: string;
  organizationName?: string;
  
  // Media and content
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  
  // Location and targeting
  targetCountries: string[];
  location?: {
    country: string;
    region?: string;
    city?: string;
  };
  
  // Metrics
  viewCount: number;
  shareCount: number;
  donorCount: number;
  
  // Configuration
  allowAnonymousDonations: boolean;
  allowRecurringDonations: boolean;
  minimumDonation?: number;
  maximumDonation?: number;
  
  // Progress
  percentFunded: number;
  daysRemaining: number;
  hoursRemaining: number;
  
  // Social proof
  endorsements?: CampaignEndorsement[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export interface CampaignEndorsement {
  id: string;
  endorserName: string;
  endorserTitle?: string;
  endorserAvatar?: string;
  message: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface CampaignAnalytics {
  campaignId: string;
  timeframe: 'daily' | 'weekly' | 'monthly';
  data: Array<{
    date: Date;
    views: number;
    donations: number;
    donationAmount: number;
    shares: number;
    newDonors: number;
  }>;
  totalViews: number;
  totalDonations: number;
  totalAmount: number;
  conversionRate: number;
  averageDonation: number;
}

export interface CampaignCreationStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  fields: string[];
}

// Form types for campaign creation wizard
export interface CampaignBasicsData {
  type: CampaignType;
  title: string;
  tagline: string;
  category: string;
  location: {
    country: string;
    region?: string;
    city?: string;
  };
}

export interface CampaignStoryData {
  description: string;
  coverImage: File | string;
  gallery: (File | string)[];
  videoUrl?: string;
}

export interface CampaignFundingData {
  fundingGoal: number;
  currency: string;
  endDate: Date;
  minimumDonation?: number;
  allowRecurringDonations: boolean;
  allowAnonymousDonations: boolean;
}

export interface CampaignReviewData {
  // Summary of all previous steps
  basics: CampaignBasicsData;
  story: CampaignStoryData;
  funding: CampaignFundingData;
  agreedToTerms: boolean;
}