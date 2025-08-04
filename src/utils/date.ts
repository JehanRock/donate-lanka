import { format, formatDistanceToNow, isAfter, isBefore, differenceInDays, differenceInHours, differenceInMinutes, addDays, addMonths, addYears } from 'date-fns';

/**
 * Format date for display in various contexts
 */
export function formatDate(
  date: Date | string,
  formatString: string = 'MMM dd, yyyy'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

/**
 * Format date as relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Calculate days remaining until a target date
 */
export function calculateDaysRemaining(targetDate: Date | string): number {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  
  if (isBefore(target, now)) {
    return 0;
  }
  
  return differenceInDays(target, now);
}

/**
 * Calculate hours remaining until a target date
 */
export function calculateHoursRemaining(targetDate: Date | string): number {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  
  if (isBefore(target, now)) {
    return 0;
  }
  
  return differenceInHours(target, now);
}

/**
 * Calculate minutes remaining until a target date
 */
export function calculateMinutesRemaining(targetDate: Date | string): number {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  
  if (isBefore(target, now)) {
    return 0;
  }
  
  return differenceInMinutes(target, now);
}

/**
 * Check if a campaign/project is expired
 */
export function isExpired(endDate: Date | string): boolean {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return isBefore(end, new Date());
}

/**
 * Check if a campaign/project is active
 */
export function isActive(startDate: Date | string, endDate: Date | string): boolean {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  return isAfter(now, start) && isBefore(now, end);
}

/**
 * Format campaign duration for display
 */
export function formatCampaignDuration(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const days = differenceInDays(end, start);
  
  if (days < 1) {
    const hours = differenceInHours(end, start);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  }
  
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''}`;
}

/**
 * Format time remaining in a human-readable way
 */
export function formatTimeRemaining(endDate: Date | string): string {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  if (isBefore(end, now)) {
    return 'Expired';
  }
  
  const days = differenceInDays(end, now);
  const hours = differenceInHours(end, now) % 24;
  const minutes = differenceInMinutes(end, now) % 60;
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} left`;
  }
  
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  }
  
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
  }
  
  return 'Less than a minute left';
}

/**
 * Generate date options for campaign creation
 */
export function generateCampaignDateOptions(): Array<{ value: number; label: string; date: Date }> {
  const now = new Date();
  
  return [
    { value: 7, label: '1 week', date: addDays(now, 7) },
    { value: 14, label: '2 weeks', date: addDays(now, 14) },
    { value: 30, label: '1 month', date: addDays(now, 30) },
    { value: 45, label: '45 days', date: addDays(now, 45) },
    { value: 60, label: '2 months', date: addDays(now, 60) },
    { value: 90, label: '3 months', date: addDays(now, 90) },
    { value: 180, label: '6 months', date: addDays(now, 180) },
    { value: 365, label: '1 year', date: addDays(now, 365) },
  ];
}

/**
 * Validate campaign dates
 */
export function validateCampaignDates(
  startDate: Date,
  endDate: Date
): { isValid: boolean; error?: string } {
  const now = new Date();
  
  if (isBefore(startDate, now)) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }
  
  if (isBefore(endDate, startDate)) {
    return { isValid: false, error: 'End date must be after start date' };
  }
  
  const maxDuration = 365; // 1 year max
  const days = differenceInDays(endDate, startDate);
  
  if (days > maxDuration) {
    return { isValid: false, error: `Campaign duration cannot exceed ${maxDuration} days` };
  }
  
  const minDuration = 1; // 1 day minimum
  if (days < minDuration) {
    return { isValid: false, error: `Campaign must run for at least ${minDuration} day` };
  }
  
  return { isValid: true };
}

/**
 * Get Sri Lankan timezone-aware date
 */
export function getSriLankanDate(date?: Date): Date {
  const targetDate = date || new Date();
  // Sri Lanka is UTC+5:30
  const sriLankanOffset = 5.5 * 60; // minutes
  const localOffset = targetDate.getTimezoneOffset();
  const diff = sriLankanOffset + localOffset;
  
  return new Date(targetDate.getTime() + (diff * 60 * 1000));
}