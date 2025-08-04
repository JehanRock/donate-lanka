import * as z from 'zod';
import { ProjectCategory, FundingType } from '@/types/project';
import { UserRole } from '@/types/user';
import { PaymentMethod, DonationType } from '@/types/donation';

// User validation schemas
export const userRegistrationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name cannot exceed 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name cannot exceed 50 characters'),
  role: z.enum(['donor', 'creator', 'organization'] as const),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  acceptMarketing: z.boolean().optional(),
});

export const userProfileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50).optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50).optional(),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(100).optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  socialLinks: z.object({
    facebook: z.string().url('Please enter a valid Facebook URL').optional().or(z.literal('')),
    twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
    linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    instagram: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
  }).optional(),
});

// Project validation schemas
export const projectCreateSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  shortDescription: z.string()
    .min(20, 'Short description must be at least 20 characters')
    .max(200, 'Short description cannot exceed 200 characters'),
  description: z.string()
    .min(100, 'Description must be at least 100 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  category: z.enum(['medical', 'education', 'technology', 'community', 'disaster_relief', 'animals', 'arts_culture', 'sports'] as const),
  subCategory: z.string().max(50).optional(),
  fundingGoal: z.number()
    .min(5000, 'Funding goal must be at least Rs. 5,000')
    .max(50000000, 'Funding goal cannot exceed Rs. 50,000,000'),
  fundingType: z.enum(['all_or_nothing', 'keep_what_you_raise', 'recurring'] as const),
  endDate: z.date()
    .refine(date => date > new Date(), 'End date must be in the future')
    .refine(date => date <= new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'Campaign cannot run for more than 1 year'),
  location: z.object({
    country: z.string().min(2, 'Country is required'),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  tags: z.array(z.string().min(2).max(20))
    .min(1, 'At least one tag is required')
    .max(10, 'Cannot have more than 10 tags'),
});

export const projectUpdateSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  content: z.string()
    .min(20, 'Content must be at least 20 characters')
    .max(2000, 'Content cannot exceed 2000 characters'),
  isPublic: z.boolean().default(true),
});

// Donation validation schemas
export const donationFormSchema = z.object({
  amount: z.number()
    .min(100, 'Minimum donation amount is Rs. 100')
    .max(1000000, 'Maximum donation amount is Rs. 1,000,000'),
  projectId: z.string().min(1, 'Project ID is required'),
  rewardId: z.string().optional(),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'bank_transfer', 'digital_wallet'] as const),
  donationType: z.enum(['one_time', 'recurring'] as const),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
  isAnonymous: z.boolean().default(false),
  anonymousDonor: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
    email: z.string().email('Please enter a valid email address').optional(),
  }).optional(),
  recurringDetails: z.object({
    frequency: z.enum(['weekly', 'monthly', 'quarterly', 'annually'] as const),
    endDate: z.date().optional(),
  }).optional(),
  taxReceiptRequired: z.boolean().default(false),
});

// Campaign validation schemas
export const campaignBasicsSchema = z.object({
  type: z.enum(['project', 'charity', 'emergency', 'personal', 'business'] as const),
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  tagline: z.string()
    .min(10, 'Tagline must be at least 10 characters')
    .max(150, 'Tagline cannot exceed 150 characters'),
  category: z.string().min(1, 'Category is required'),
  location: z.object({
    country: z.string().min(2, 'Country is required'),
    region: z.string().optional(),
    city: z.string().optional(),
  }),
});

export const campaignStorySchema = z.object({
  description: z.string()
    .min(200, 'Description must be at least 200 characters')
    .max(10000, 'Description cannot exceed 10,000 characters'),
  videoUrl: z.string()
    .url('Please enter a valid video URL')
    .optional()
    .or(z.literal('')),
});

export const campaignFundingSchema = z.object({
  fundingGoal: z.number()
    .min(5000, 'Funding goal must be at least Rs. 5,000')
    .max(100000000, 'Funding goal cannot exceed Rs. 100,000,000'),
  currency: z.string().default('LKR'),
  endDate: z.date()
    .refine(date => date > new Date(), 'End date must be in the future')
    .refine(date => date <= new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'Campaign cannot run for more than 1 year'),
  minimumDonation: z.number()
    .min(50, 'Minimum donation must be at least Rs. 50')
    .max(10000, 'Minimum donation cannot exceed Rs. 10,000')
    .optional(),
  allowRecurringDonations: z.boolean().default(true),
  allowAnonymousDonations: z.boolean().default(true),
});

// Search and filter validation schemas
export const projectFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.array(z.enum(['medical', 'education', 'technology', 'community', 'disaster_relief', 'animals', 'arts_culture', 'sports'] as const)).optional(),
  status: z.array(z.enum(['draft', 'pending_review', 'active', 'paused', 'completed', 'cancelled', 'failed'] as const)).optional(),
  location: z.string().optional(),
  fundingGoalMin: z.number().min(0).optional(),
  fundingGoalMax: z.number().min(0).optional(),
  sortBy: z.enum(['newest', 'popular', 'ending_soon', 'most_funded', 'recently_launched'] as const).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Common validation utilities
export const emailSchema = z.string().email('Please enter a valid email address');
export const phoneSchema = z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number');
export const urlSchema = z.string().url('Please enter a valid URL');
export const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

// File upload validation
export const imageFileSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
});

export const documentFileSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, 'Document must be less than 10MB')
    .refine(
      file => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'Only PDF, JPEG, and PNG files are allowed'
    ),
});

// Validation helper functions
export function validateRequired<T>(value: T, fieldName: string): { isValid: boolean; error?: string } {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
}

export function validateMinLength(value: string, minLength: number, fieldName: string): { isValid: boolean; error?: string } {
  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  return { isValid: true };
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): { isValid: boolean; error?: string } {
  if (value.length > maxLength) {
    return { isValid: false, error: `${fieldName} cannot exceed ${maxLength} characters` };
  }
  return { isValid: true };
}