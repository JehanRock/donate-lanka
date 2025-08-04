import { Project, ProjectStatus } from '@/types/project';
import { User } from '@/types/user';
import { Donation } from '@/types/donation';
import { addDays, subDays, addHours } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'priya.fernando@email.com',
    firstName: 'Priya',
    lastName: 'Fernando',
    displayName: 'Priya Fernando',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    role: 'creator',
    accountStatus: 'active',
    verificationStatus: 'verified',
    bio: 'Social entrepreneur focused on education and community development in rural Sri Lanka.',
    location: 'Colombo, Sri Lanka',
    createdAt: subDays(new Date(), 180),
    updatedAt: new Date(),
    creatorProfile: {
      organizationType: 'nonprofit',
      rating: 4.8,
      totalReviews: 23,
      successfulProjects: 5,
      completionRate: 95
    },
    totalRaised: 850000,
    projectsCreated: 6,
    projectsSupported: 12
  },
  {
    id: '2',
    email: 'anura.silva@email.com',
    firstName: 'Anura',
    lastName: 'Silva',
    displayName: 'Anura Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'creator',
    accountStatus: 'active',
    verificationStatus: 'verified',
    bio: 'Tech innovator working on sustainable solutions for rural communities.',
    location: 'Kandy, Sri Lanka',
    createdAt: subDays(new Date(), 90),
    updatedAt: new Date(),
    creatorProfile: {
      organizationType: 'business',
      rating: 4.6,
      totalReviews: 18,
      successfulProjects: 3,
      completionRate: 88
    },
    totalRaised: 450000,
    projectsCreated: 4,
    projectsSupported: 8
  },
  {
    id: '3',
    email: 'sanduni.perera@email.com',
    firstName: 'Sanduni',
    lastName: 'Perera',
    displayName: 'Sanduni Perera',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    role: 'creator',
    accountStatus: 'active',
    verificationStatus: 'verified',
    bio: 'Wildlife conservationist and environmental activist.',
    location: 'Galle, Sri Lanka',
    createdAt: subDays(new Date(), 120),
    updatedAt: new Date(),
    creatorProfile: {
      organizationType: 'nonprofit',
      rating: 4.9,
      totalReviews: 31,
      successfulProjects: 7,
      completionRate: 97
    },
    totalRaised: 1200000,
    projectsCreated: 8,
    projectsSupported: 15
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Clean Water Initiative for Rural Schools',
    slug: 'clean-water-rural-schools',
    description: 'Providing clean drinking water and sanitation facilities to 15 rural schools in the Uva Province. This project will benefit over 3,000 students and their families by installing water purification systems and building proper toilet facilities.',
    shortDescription: 'Bringing clean water to 15 rural schools in Uva Province',
    category: 'community',
    creatorId: '1',
    creator: {
      id: '1',
      displayName: 'Priya Fernando',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verificationStatus: 'verified',
      rating: 4.8,
      location: 'Colombo, Sri Lanka'
    },
    fundingGoal: 500000,
    currentAmount: 342000,
    currency: 'LKR',
    fundingType: 'all_or_nothing',
    startDate: subDays(new Date(), 15),
    endDate: addDays(new Date(), 25),
    createdAt: subDays(new Date(), 20),
    updatedAt: new Date(),
    launchedAt: subDays(new Date(), 15),
    status: 'active',
    visibility: 'public',
    coverImage: 'https://images.unsplash.com/photo-1594736797933-d0aa5ba20203?w=800&h=450&fit=crop',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1594736797933-d0aa5ba20203?w=800&h=450&fit=crop',
        alt: 'Children getting water from well',
        order: 0
      }
    ],
    location: {
      country: 'Sri Lanka',
      state: 'Uva Province',
      city: 'Badulla'
    },
    donorCount: 89,
    shareCount: 23,
    viewCount: 1250,
    updates: [],
    faqs: [],
    tags: ['water', 'education', 'rural', 'children', 'health'],
    featured: true,
    trending: false,
    urgent: false,
    percentFunded: 68.4,
    daysRemaining: 25,
    isFullyFunded: false,
    isExpired: false
  },
  {
    id: '2',
    title: 'Sri Lankan Wildlife Conservation App',
    slug: 'wildlife-conservation-app',
    description: 'Developing a mobile app to track and protect endangered species in Sri Lankan national parks. The app will use AI to identify animals from photos and help rangers monitor wildlife populations in real-time.',
    shortDescription: 'AI-powered app for protecting Sri Lankan wildlife',
    category: 'technology',
    creatorId: '2',
    creator: {
      id: '2',
      displayName: 'Anura Silva',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verificationStatus: 'verified',
      rating: 4.6,
      location: 'Kandy, Sri Lanka'
    },
    fundingGoal: 800000,
    currentAmount: 620000,
    currency: 'LKR',
    fundingType: 'keep_what_you_raise',
    startDate: subDays(new Date(), 8),
    endDate: addDays(new Date(), 35),
    createdAt: subDays(new Date(), 12),
    updatedAt: new Date(),
    launchedAt: subDays(new Date(), 8),
    status: 'active',
    visibility: 'public',
    coverImage: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=450&fit=crop',
    images: [
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=450&fit=crop',
        alt: 'Leopard in Yala National Park',
        order: 0
      }
    ],
    location: {
      country: 'Sri Lanka',
      state: 'Southern Province',
      city: 'Yala'
    },
    donorCount: 156,
    shareCount: 67,
    viewCount: 2890,
    updates: [],
    faqs: [],
    tags: ['technology', 'wildlife', 'conservation', 'ai', 'mobile'],
    featured: true,
    trending: true,
    urgent: false,
    percentFunded: 77.5,
    daysRemaining: 35,
    isFullyFunded: false,
    isExpired: false
  },
  {
    id: '3',
    title: 'Emergency Medical Fund for Rural Clinic',
    slug: 'emergency-medical-fund-rural',
    description: 'Supporting the Ella Medical Clinic with emergency medical equipment and supplies. The clinic serves over 5,000 residents in remote areas and desperately needs updated equipment to handle emergency cases.',
    shortDescription: 'Emergency medical equipment for rural clinic serving 5,000 people',
    category: 'medical',
    creatorId: '1',
    creator: {
      id: '1',
      displayName: 'Priya Fernando',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verificationStatus: 'verified',
      rating: 4.8,
      location: 'Colombo, Sri Lanka'
    },
    fundingGoal: 300000,
    currentAmount: 285000,
    currency: 'LKR',
    fundingType: 'all_or_nothing',
    startDate: subDays(new Date(), 22),
    endDate: addDays(new Date(), 8),
    createdAt: subDays(new Date(), 25),
    updatedAt: new Date(),
    launchedAt: subDays(new Date(), 22),
    status: 'active',
    visibility: 'public',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop',
    images: [
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop',
        alt: 'Medical equipment in clinic',
        order: 0
      }
    ],
    location: {
      country: 'Sri Lanka',
      state: 'Uva Province',
      city: 'Ella'
    },
    donorCount: 134,
    shareCount: 45,
    viewCount: 1890,
    updates: [],
    faqs: [],
    tags: ['medical', 'emergency', 'rural', 'healthcare', 'equipment'],
    featured: false,
    trending: false,
    urgent: true,
    percentFunded: 95.0,
    daysRemaining: 8,
    isFullyFunded: false,
    isExpired: false
  },
  {
    id: '4',
    title: 'Scholarship Program for Underprivileged Students',
    slug: 'scholarship-underprivileged-students',
    description: 'Providing scholarships and educational support for 50 underprivileged students in Colombo. This program covers school fees, books, uniforms, and lunch for one academic year.',
    shortDescription: 'Educational scholarships for 50 students in Colombo',
    category: 'education',
    creatorId: '1',
    creator: {
      id: '1',
      displayName: 'Priya Fernando',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verificationStatus: 'verified',
      rating: 4.8,
      location: 'Colombo, Sri Lanka'
    },
    fundingGoal: 750000,
    currentAmount: 180000,
    currency: 'LKR',
    fundingType: 'keep_what_you_raise',
    startDate: subDays(new Date(), 5),
    endDate: addDays(new Date(), 55),
    createdAt: subDays(new Date(), 8),
    updatedAt: new Date(),
    launchedAt: subDays(new Date(), 5),
    status: 'active',
    visibility: 'public',
    coverImage: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=450&fit=crop',
    images: [
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=450&fit=crop',
        alt: 'Students in classroom',
        order: 0
      }
    ],
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo'
    },
    donorCount: 67,
    shareCount: 12,
    viewCount: 890,
    updates: [],
    faqs: [],
    tags: ['education', 'scholarship', 'students', 'underprivileged', 'school'],
    featured: false,
    trending: false,
    urgent: false,
    percentFunded: 24.0,
    daysRemaining: 55,
    isFullyFunded: false,
    isExpired: false
  },
  {
    id: '5',
    title: 'Sea Turtle Conservation Program',
    slug: 'sea-turtle-conservation',
    description: 'Protecting sea turtle nesting sites along the southern coast of Sri Lanka. This program includes night patrols, nest protection, and community education about marine conservation.',
    shortDescription: 'Protecting sea turtle nesting sites on Sri Lankan coast',
    category: 'animals',
    creatorId: '3',
    creator: {
      id: '3',
      displayName: 'Sanduni Perera',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verificationStatus: 'verified',
      rating: 4.9,
      location: 'Galle, Sri Lanka'
    },
    fundingGoal: 450000,
    currentAmount: 450000,
    currency: 'LKR',
    fundingType: 'all_or_nothing',
    startDate: subDays(new Date(), 45),
    endDate: subDays(new Date(), 2),
    createdAt: subDays(new Date(), 50),
    updatedAt: subDays(new Date(), 2),
    launchedAt: subDays(new Date(), 45),
    status: 'completed',
    visibility: 'public',
    coverImage: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=450&fit=crop',
    images: [
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=450&fit=crop',
        alt: 'Sea turtle on beach',
        order: 0
      }
    ],
    location: {
      country: 'Sri Lanka',
      state: 'Southern Province',
      city: 'Mirissa'
    },
    donorCount: 203,
    shareCount: 89,
    viewCount: 3450,
    updates: [],
    faqs: [],
    tags: ['conservation', 'sea turtles', 'marine', 'environment', 'wildlife'],
    featured: true,
    trending: false,
    urgent: false,
    percentFunded: 100.0,
    daysRemaining: 0,
    isFullyFunded: true,
    isExpired: true
  },
  {
    id: '6',
    title: 'Traditional Dance Festival Revival',
    slug: 'traditional-dance-festival',
    description: 'Reviving the annual Kandyan dance festival with traditional performances, workshops, and cultural education programs. Supporting local artists and preserving Sri Lankan cultural heritage.',
    shortDescription: 'Reviving traditional Kandyan dance festival and cultural programs',
    category: 'arts_culture',
    creatorId: '2',
    creator: {
      id: '2',
      displayName: 'Anura Silva',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verificationStatus: 'verified',
      rating: 4.6,
      location: 'Kandy, Sri Lanka'
    },
    fundingGoal: 250000,
    currentAmount: 95000,
    currency: 'LKR',
    fundingType: 'keep_what_you_raise',
    startDate: subDays(new Date(), 12),
    endDate: addDays(new Date(), 18),
    createdAt: subDays(new Date(), 15),
    updatedAt: new Date(),
    launchedAt: subDays(new Date(), 12),
    status: 'active',
    visibility: 'public',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop',
    images: [
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop',
        alt: 'Traditional Kandyan dancers',
        order: 0
      }
    ],
    location: {
      country: 'Sri Lanka',
      state: 'Central Province',
      city: 'Kandy'
    },
    donorCount: 42,
    shareCount: 18,
    viewCount: 670,
    updates: [],
    faqs: [],
    tags: ['culture', 'dance', 'traditional', 'kandyan', 'festival', 'heritage'],
    featured: false,
    trending: false,
    urgent: false,
    percentFunded: 38.0,
    daysRemaining: 18,
    isFullyFunded: false,
    isExpired: false
  },
  {
    id: '7',
    title: 'Youth Cricket Development Program',
    slug: 'youth-cricket-development',
    description: 'Training and equipment for young cricketers in rural areas. This program provides coaching, equipment, and tournament opportunities for talented young players who lack resources.',
    shortDescription: 'Cricket training and equipment for rural youth',
    category: 'sports',
    creatorId: '2',
    creator: {
      id: '2',
      displayName: 'Anura Silva',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verificationStatus: 'verified',
      rating: 4.6,
      location: 'Kandy, Sri Lanka'
    },
    fundingGoal: 350000,
    currentAmount: 125000,
    currency: 'LKR',
    fundingType: 'all_or_nothing',
    startDate: subDays(new Date(), 3),
    endDate: addDays(new Date(), 42),
    createdAt: subDays(new Date(), 6),
    updatedAt: new Date(),
    launchedAt: subDays(new Date(), 3),
    status: 'active',
    visibility: 'public',
    coverImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=450&fit=crop',
    images: [
      {
        id: '7',
        url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=450&fit=crop',
        alt: 'Young cricket players',
        order: 0
      }
    ],
    location: {
      country: 'Sri Lanka',
      state: 'North Central Province',
      city: 'Anuradhapura'
    },
    donorCount: 38,
    shareCount: 8,
    viewCount: 450,
    updates: [],
    faqs: [],
    tags: ['sports', 'cricket', 'youth', 'rural', 'training', 'equipment'],
    featured: false,
    trending: false,
    urgent: false,
    percentFunded: 35.7,
    daysRemaining: 42,
    isFullyFunded: false,
    isExpired: false
  },
  {
    id: '8',
    title: 'Flood Relief Emergency Fund',
    slug: 'flood-relief-emergency',
    description: 'Emergency relief for families affected by recent flooding in Ratnapura district. Providing food, clean water, temporary shelter, and medical supplies to 200+ affected families.',
    shortDescription: 'Emergency flood relief for 200+ families in Ratnapura',
    category: 'disaster_relief',
    creatorId: '3',
    creator: {
      id: '3',
      displayName: 'Sanduni Perera',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verificationStatus: 'verified',
      rating: 4.9,
      location: 'Galle, Sri Lanka'
    },
    fundingGoal: 600000,
    currentAmount: 520000,
    currency: 'LKR',
    fundingType: 'keep_what_you_raise',
    startDate: subDays(new Date(), 1),
    endDate: addDays(new Date(), 14),
    createdAt: subDays(new Date(), 2),
    updatedAt: addHours(new Date(), -2),
    launchedAt: subDays(new Date(), 1),
    status: 'active',
    visibility: 'public',
    coverImage: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=450&fit=crop',
    images: [
      {
        id: '8',
        url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=450&fit=crop',
        alt: 'Flood affected area',
        order: 0
      }
    ],
    location: {
      country: 'Sri Lanka',
      state: 'Sabaragamuwa Province',
      city: 'Ratnapura'
    },
    donorCount: 287,
    shareCount: 156,
    viewCount: 4560,
    updates: [],
    faqs: [],
    tags: ['emergency', 'flood', 'relief', 'disaster', 'families', 'urgent'],
    featured: true,
    trending: true,
    urgent: true,
    percentFunded: 86.7,
    daysRemaining: 14,
    isFullyFunded: false,
    isExpired: false
  }
];

// Mock platform statistics
export const mockPlatformStats = {
  totalDonors: 15742,
  totalDonations: 25680000, // LKR
  activeProjects: 156,
  partnerOrganizations: 89,
  successfulProjects: 342,
  totalRaised: 125000000 // LKR
};