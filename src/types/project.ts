export type ProjectStatus = 'draft' | 'pending_review' | 'active' | 'paused' | 'completed' | 'cancelled' | 'failed';
export type ProjectCategory = 'medical' | 'education' | 'technology' | 'community' | 'disaster_relief' | 'animals' | 'arts_culture' | 'sports';
export type FundingType = 'all_or_nothing' | 'keep_what_you_raise' | 'recurring';
export type ProjectVisibility = 'public' | 'private' | 'draft';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProjectCategory;
  subCategory?: string;
  
  // Creator information
  creatorId: string;
  creator: {
    id: string;
    displayName: string;
    avatar?: string;
    verificationStatus: 'verified' | 'unverified';
    rating: number;
    location?: string;
  };
  
  // Funding details
  fundingGoal: number;
  currentAmount: number;
  currency: string;
  fundingType: FundingType;
  minimumDonation?: number;
  
  // Timeline
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  launchedAt?: Date;
  
  // Status and visibility
  status: ProjectStatus;
  visibility: ProjectVisibility;
  
  // Media
  coverImage: string;
  images: ProjectImage[];
  videos?: ProjectVideo[];
  
  // Location
  location?: ProjectLocation;
  
  // Progress tracking
  donorCount: number;
  shareCount: number;
  viewCount: number;
  
  // Features
  rewards?: ProjectReward[];
  updates: ProjectUpdate[];
  faqs: ProjectFAQ[];
  
  // Metadata
  tags: string[];
  featured: boolean;
  trending: boolean;
  urgent: boolean;
  
  // Completion metrics
  percentFunded: number;
  daysRemaining: number;
  isFullyFunded: boolean;
  isExpired: boolean;
  
  // Trust & Transparency Features
  trustScore?: number; // 0-100 trust rating
  verificationBadges?: VerificationBadge[];
  fundingBreakdown?: FundingBreakdown;
  projectMilestones?: ProjectMilestone[];
  expenseReports?: ExpenseReport[];
  partnerOrganizations?: PartnerOrganization[];
}

export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  caption?: string;
}

export interface ProjectVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  duration?: number;
  order: number;
}

export interface ProjectLocation {
  country: string;
  state?: string;
  city?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ProjectReward {
  id: string;
  title: string;
  description: string;
  amount: number;
  estimatedDelivery?: Date;
  quantity?: number;
  claimed: number;
  shippingRequired: boolean;
  digitalReward: boolean;
  images?: string[];
}

export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  isPublic: boolean;
}

export interface ProjectFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt: Date;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userId: string;
  user: {
    displayName: string;
    avatar?: string;
  };
  content: string;
  parentId?: string; // For replies
  createdAt: Date;
  updatedAt?: Date;
  likesCount: number;
  repliesCount: number;
  isDeleted: boolean;
}

// Form types
export interface ProjectCreateData {
  title: string;
  shortDescription: string;
  description: string;
  category: ProjectCategory;
  subCategory?: string;
  fundingGoal: number;
  fundingType: FundingType;
  endDate: Date;
  coverImage: File | string;
  location?: Omit<ProjectLocation, 'coordinates'>;
  tags: string[];
}

export interface ProjectEditData extends Partial<ProjectCreateData> {
  id: string;
}

export interface ProjectFilters {
  search?: string;
  category?: ProjectCategory[];
  status?: ProjectStatus[];
  location?: string;
  fundingGoalMin?: number;
  fundingGoalMax?: number;
  sortBy?: 'newest' | 'popular' | 'ending_soon' | 'most_funded' | 'recently_launched';
  page?: number;
  limit?: number;
}

export interface ProjectSearchParams {
  query?: string;
  filters?: ProjectFilters;
  suggestions?: boolean;
}

// Trust & Transparency Types
export interface VerificationBadge {
  id: string;
  type: 'identity_verified' | 'nonprofit_verified' | 'government_approved' | 'partner_organization' | 'previous_success';
  name: string;
  description: string;
  verifiedAt: Date;
  verifiedBy: string;
  icon?: string;
}

export interface FundingBreakdown {
  directBeneficiaries: number; // Percentage
  operationalCosts: number;
  equipmentMaterials: number;
  administrativeFees: number;
  contingencyFund: number;
  breakdown: ExpenseCategory[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  budgetedAmount: number;
  spentAmount: number;
  percentage: number;
  description: string;
  receipts?: ExpenseReceipt[];
}

export interface ExpenseReceipt {
  id: string;
  date: Date;
  vendor: string;
  amount: number;
  description: string;
  receiptUrl?: string;
  approved: boolean;
  approvedBy?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  fundingRequired: number;
  updates?: string[];
  evidence?: string[]; // Photo/document URLs
}

export interface ExpenseReport {
  id: string;
  reportDate: Date;
  periodStart: Date;
  periodEnd: Date;
  totalSpent: number;
  categories: ExpenseCategory[];
  summary: string;
  auditedBy?: string;
  auditDate?: Date;
  reportUrl?: string;
}

export interface PartnerOrganization {
  id: string;
  name: string;
  type: 'ngo' | 'government' | 'corporate' | 'international' | 'academic';
  logoUrl?: string;
  website?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  partnership: {
    role: string;
    contribution: string;
    startDate: Date;
    description: string;
  };
}