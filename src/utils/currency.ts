export const CURRENCIES = {
  LKR: { symbol: 'Rs.', name: 'Sri Lankan Rupee', decimals: 2 },
  USD: { symbol: '$', name: 'US Dollar', decimals: 2 },
  EUR: { symbol: '€', name: 'Euro', decimals: 2 },
  GBP: { symbol: '£', name: 'British Pound', decimals: 2 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

/**
 * Format currency amount for display
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'LKR',
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
    locale?: string;
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    decimals,
    locale = 'en-LK'
  } = options;

  const currencyInfo = CURRENCIES[currency];
  const finalDecimals = decimals ?? currencyInfo.decimals;

  // Format the number with proper locale
  const formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: finalDecimals,
    maximumFractionDigits: finalDecimals,
  }).format(amount);

  // Build the final string
  let result = formattedAmount;
  
  if (showSymbol) {
    result = `${currencyInfo.symbol}${result}`;
  }
  
  if (showCode) {
    result = `${result} ${currency}`;
  }

  return result;
}

/**
 * Format currency in a compact format (e.g., 1.2K, 1.5M)
 */
export function formatCurrencyCompact(
  amount: number,
  currency: CurrencyCode = 'LKR'
): string {
  const currencyInfo = CURRENCIES[currency];
  
  if (amount < 1000) {
    return `${currencyInfo.symbol}${amount.toLocaleString('en-LK')}`;
  }
  
  if (amount < 1000000) {
    return `${currencyInfo.symbol}${(amount / 1000).toFixed(1)}K`;
  }
  
  if (amount < 1000000000) {
    return `${currencyInfo.symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  
  return `${currencyInfo.symbol}${(amount / 1000000000).toFixed(1)}B`;
}

/**
 * Calculate percentage funded
 */
export function calculatePercentageFunded(
  currentAmount: number,
  goalAmount: number
): number {
  if (goalAmount === 0) return 0;
  return Math.min((currentAmount / goalAmount) * 100, 100);
}

/**
 * Calculate amount remaining to reach goal
 */
export function calculateAmountRemaining(
  currentAmount: number,
  goalAmount: number
): number {
  return Math.max(goalAmount - currentAmount, 0);
}

/**
 * Parse currency input string to number
 */
export function parseCurrencyInput(input: string): number {
  // Remove currency symbols and spaces
  const cleaned = input
    .replace(/[Rs\.\$€£,\s]/g, '')
    .replace(/[^\d.]/g, '');
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validate currency amount
 */
export function validateCurrencyAmount(
  amount: number,
  options: {
    min?: number;
    max?: number;
    currency?: CurrencyCode;
  } = {}
): { isValid: boolean; error?: string } {
  const { min = 0, max = Number.MAX_SAFE_INTEGER } = options;

  if (isNaN(amount) || amount < 0) {
    return { isValid: false, error: 'Amount must be a positive number' };
  }

  if (amount < min) {
    return { isValid: false, error: `Amount must be at least ${formatCurrency(min, options.currency)}` };
  }

  if (amount > max) {
    return { isValid: false, error: `Amount cannot exceed ${formatCurrency(max, options.currency)}` };
  }

  return { isValid: true };
}

/**
 * Convert currency amounts (simplified - in real app would use exchange rates API)
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  // Simplified conversion rates (in real app, fetch from API)
  const rates: Record<CurrencyCode, Record<CurrencyCode, number>> = {
    USD: { USD: 1, LKR: 320, EUR: 0.85, GBP: 0.73 },
    LKR: { USD: 0.003125, LKR: 1, EUR: 0.00266, GBP: 0.00228 },
    EUR: { USD: 1.18, LKR: 376, EUR: 1, GBP: 0.86 },
    GBP: { USD: 1.37, LKR: 438, EUR: 1.16, GBP: 1 },
  };

  return amount * (rates[fromCurrency]?.[toCurrency] ?? 1);
}