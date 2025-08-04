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