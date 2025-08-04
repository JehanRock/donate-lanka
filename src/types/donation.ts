export type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'digital_wallet' | 'crypto';
export type DonationType = 'one_time' | 'recurring' | 'reward_based';

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  
  // Related entities
  projectId: string;
  donorId?: string; // Optional for anonymous donations
  rewardId?: string; // For reward-based donations
  
  // Donor information (for anonymous donations)
  anonymousDonor?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
  };
  
  // Payment details
  paymentMethod: PaymentMethod;
  paymentProvider: string;
  transactionId?: string;
  processingFee: number;
  netAmount: number;
  
  // Status and timing
  status: DonationStatus;
  donationType: DonationType;
  createdAt: Date;
  completedAt?: Date;
  refundedAt?: Date;
  
  // Additional information
  message?: string;
  isAnonymous: boolean;
  isPublic: boolean;
  
  // Recurring donation details
  recurringDetails?: RecurringDonationDetails;
  
  // Reward details
  rewardDetails?: DonationRewardDetails;
  
  // Receipt and tax information
  receiptNumber: string;
  taxReceiptRequired: boolean;
  taxReceiptIssued: boolean;
}

export interface RecurringDonationDetails {
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  nextPaymentDate: Date;
  endDate?: Date;
  totalPayments?: number;
  paymentsMade: number;
  isActive: boolean;
  subscriptionId: string;
}

export interface DonationRewardDetails {
  rewardTitle: string;
  rewardDescription: string;
  estimatedDelivery?: Date;
  shippingAddress?: ShippingAddress;
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface DonationSummary {
  totalAmount: number;
  donorCount: number;
  averageDonation: number;
  topDonation: number;
  recurringDonors: number;
  recentDonations: Donation[];
}

export interface DonorLeaderboard {
  donors: Array<{
    donorId?: string;
    displayName: string;
    avatar?: string;
    totalDonated: number;
    projectsSupported: number;
    isAnonymous: boolean;
  }>;
  timeframe: 'all_time' | 'this_year' | 'this_month' | 'this_week';
}

// Form types
export interface DonationFormData {
  amount: number;
  projectId: string;
  rewardId?: string;
  paymentMethod: PaymentMethod;
  donationType: DonationType;
  message?: string;
  isAnonymous: boolean;
  
  // Anonymous donor info
  anonymousDonor?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  
  // Recurring details
  recurringDetails?: {
    frequency: RecurringDonationDetails['frequency'];
    endDate?: Date;
  };
  
  // Shipping for rewards
  shippingAddress?: ShippingAddress;
  
  // Tax receipt
  taxReceiptRequired: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret: string;
  metadata: {
    projectId: string;
    donorId?: string;
    rewardId?: string;
  };
}