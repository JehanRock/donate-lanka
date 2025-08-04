/**
 * Format large numbers in a compact, readable format
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    const formatted = (num / 1000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}K`;
  }
  
  if (num < 1000000000) {
    const formatted = (num / 1000000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
  }
  
  const formatted = (num / 1000000000).toFixed(1);
  return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}B`;
}

/**
 * Format numbers with proper thousand separators
 */
export function formatNumber(
  num: number,
  options: {
    decimals?: number;
    locale?: string;
  } = {}
): string {
  const { decimals = 0, locale = 'en-LK' } = options;
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Calculate percentage with proper rounding
 */
export function calculatePercentage(
  value: number,
  total: number,
  decimals: number = 1
): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a random number between min and max (inclusive)
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate average from array of numbers
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Round to nearest specified value
 */
export function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest;
}

/**
 * Format ordinal numbers (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

/**
 * Calculate compound interest for recurring donations
 */
export function calculateCompoundImpact(
  monthlyAmount: number,
  months: number,
  impactMultiplier: number = 1.1
): number {
  let total = 0;
  for (let i = 0; i < months; i++) {
    total += monthlyAmount * Math.pow(impactMultiplier, i / 12);
  }
  return total;
}

/**
 * Validate numeric input
 */
export function validateNumber(
  value: string | number,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
    positive?: boolean;
  } = {}
): { isValid: boolean; value?: number; error?: string } {
  const { min, max, integer = false, positive = false } = options;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Must be a valid number' };
  }
  
  if (positive && num <= 0) {
    return { isValid: false, error: 'Must be a positive number' };
  }
  
  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: 'Must be a whole number' };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, error: `Must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `Must be no more than ${max}` };
  }
  
  return { isValid: true, value: num };
}