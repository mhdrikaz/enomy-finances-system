import { CurrencyCode, InvestmentPlanType, InvestmentPlanDefinition, InvestmentQuote, InvestmentTimeframeResult } from '../types';

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, { name: string; symbol: string; flag: string; defaultRateToGBP: number }> = {
  GBP: { name: 'Pound Sterling', symbol: '£', flag: '🇬🇧', defaultRateToGBP: 1.0 },
  USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸', defaultRateToGBP: 1.28 },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺', defaultRateToGBP: 1.17 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', defaultRateToGBP: 7.05 },
  JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', defaultRateToGBP: 198.4 },
  TRY: { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', defaultRateToGBP: 42.1 },
};

export const INVESTMENT_PLANS: Record<InvestmentPlanType, InvestmentPlanDefinition> = {
  BASIC_SAVINGS: {
    id: 'BASIC_SAVINGS',
    name: 'Option 1 – Basic Savings Plan',
    tagline: 'Low-risk, tax-free basic savings plan for short and medium term goals.',
    description: 'Designed for conservative savers. Enjoy tax-free earnings with a cap of £20,000 per year.',
    maxInvestmentPerYear: 20000,
    minMonthlyInvestment: 50,
    minInitialLumpSum: 0,
    minAnnualReturnPercent: 1.2,
    maxAnnualReturnPercent: 2.4,
    taxDescription: '0% Estimated Tax',
    monthlyRbsxFeePercent: 0.25,
  },
  SAVINGS_PLUS: {
    id: 'SAVINGS_PLUS',
    name: 'Option 2 – Savings Plan Plus',
    tagline: 'Balanced growth with higher yields for dedicated investors.',
    description: 'Higher annual allowance up to £30,000/year with attractive yields up to 5.5%.',
    maxInvestmentPerYear: 30000,
    minMonthlyInvestment: 50,
    minInitialLumpSum: 300,
    minAnnualReturnPercent: 3.0,
    maxAnnualReturnPercent: 5.5,
    taxDescription: '10% Tax on profits exceeding £12,000',
    monthlyRbsxFeePercent: 0.30,
  },
  MANAGED_STOCK: {
    id: 'MANAGED_STOCK',
    name: 'Option 3 – Managed Stock Investments',
    tagline: 'High-yield managed equity portfolio for maximum long-term returns.',
    description: 'Unlimited annual investment allowance managed by top RBSX financial analysts.',
    maxInvestmentPerYear: null, // unlimited
    minMonthlyInvestment: 150,
    minInitialLumpSum: 1000,
    minAnnualReturnPercent: 4.0,
    maxAnnualReturnPercent: 23.0,
    taxDescription: '10% on profit > £12k, 20% on profit > £40k',
    monthlyRbsxFeePercent: 1.30,
  },
};

/**
 * Calculates transaction fee percentage based on transaction amount
 * Up to 500: 3.5%
 * Over 500 up to 1500: 2.7%
 * Over 1500 up to 2500: 2.0%
 * Over 2500: 1.5%
 */
export function getCurrencyFeePercentage(amount: number): number {
  if (amount <= 500) {
    return 3.5;
  } else if (amount <= 1500) {
    return 2.7;
  } else if (amount <= 2500) {
    return 2.0;
  } else {
    return 1.5;
  }
}

export function validateCurrencyTransaction(amount: number): { isValid: boolean; error: string | null } {
  if (isNaN(amount) || amount <= 0) {
    return { isValid: false, error: 'Please enter a valid positive numeric transaction amount.' };
  }
  if (amount < 300) {
    return { isValid: false, error: 'Transaction amount is below the minimum limit of 300 units.' };
  }
  if (amount > 5000) {
    return { isValid: false, error: 'Transaction amount exceeds the maximum limit of 5,000 units.' };
  }
  return { isValid: true, error: null };
}

export interface CurrencyConversionResult {
  sourceCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  sourceAmount: number;
  feePercentage: number;
  feeAmountSource: number;
  feeAmountGBP: number;
  netSourceAmount: number;
  convertedTargetAmount: number;
  effectiveRate: number;
}

export function calculateCurrencyConversion(
  sourceCurrency: CurrencyCode,
  targetCurrency: CurrencyCode,
  amount: number,
  exchangeRates: Record<CurrencyCode, number> = {
    GBP: 1.0,
    USD: 1.28,
    EUR: 1.17,
    BRL: 7.05,
    JPY: 198.4,
    TRY: 42.1,
  }
): CurrencyConversionResult {
  const feePercentage = getCurrencyFeePercentage(amount);
  const feeAmountSource = amount * (feePercentage / 100);
  const netSourceAmount = amount - feeAmountSource;

  // Convert source amount to GBP first
  const sourceRateToGBP = exchangeRates[sourceCurrency] || 1.0;
  const targetRateToGBP = exchangeRates[targetCurrency] || 1.0;

  // Amount in GBP
  const netAmountGBP = netSourceAmount / sourceRateToGBP;
  const feeAmountGBP = feeAmountSource / sourceRateToGBP;

  // Converted amount in target currency
  const convertedTargetAmount = netAmountGBP * targetRateToGBP;
  const effectiveRate = amount > 0 ? convertedTargetAmount / amount : 0;

  return {
    sourceCurrency,
    targetCurrency,
    sourceAmount: amount,
    feePercentage,
    feeAmountSource,
    feeAmountGBP,
    netSourceAmount,
    convertedTargetAmount,
    effectiveRate,
  };
}

/**
 * Validates investment quote user inputs against option limits
 */
export function validateInvestmentInput(
  planType: InvestmentPlanType,
  initialLumpSum: number,
  monthlyDeposit: number
): { isValid: boolean; errors: string[] } {
  const plan = INVESTMENT_PLANS[planType];
  const errors: string[] = [];

  if (isNaN(initialLumpSum) || initialLumpSum < 0) {
    errors.push('Initial lump sum must be a non-negative number.');
  } else if (initialLumpSum < plan.minInitialLumpSum) {
    errors.push(`${plan.name} requires a minimum initial lump sum of £${plan.minInitialLumpSum.toLocaleString('en-GB')}.`);
  }

  if (isNaN(monthlyDeposit) || monthlyDeposit < 0) {
    errors.push('Monthly deposit must be a non-negative number.');
  } else if (monthlyDeposit < plan.minMonthlyInvestment) {
    errors.push(`${plan.name} requires a minimum monthly investment of £${plan.minMonthlyInvestment.toLocaleString('en-GB')}.`);
  }

  const annualContribution = (initialLumpSum || 0) + (monthlyDeposit || 0) * 12;
  if (plan.maxInvestmentPerYear !== null && annualContribution > plan.maxInvestmentPerYear) {
    errors.push(
      `Total annual contribution (£${annualContribution.toLocaleString('en-GB')}) exceeds the maximum annual allowance of £${plan.maxInvestmentPerYear.toLocaleString('en-GB')} for ${plan.name}.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates investment returns, profits, taxes, and fees for 1, 5, and 10 years
 */
export function calculateInvestmentQuote(
  userId: string,
  userName: string,
  planType: InvestmentPlanType,
  initialLumpSum: number,
  monthlyDeposit: number
): InvestmentQuote {
  const plan = INVESTMENT_PLANS[planType];

  const runSimulationForRate = (annualReturnPercent: number, totalYears: number) => {
    let balance = initialLumpSum;
    let totalFeesPaid = 0;
    const monthlyReturnRate = annualReturnPercent / 100 / 12;
    const monthlyFeeRate = plan.monthlyRbsxFeePercent / 100;

    const totalMonths = totalYears * 12;
    for (let m = 1; m <= totalMonths; m++) {
      // Monthly growth
      const interest = balance * monthlyReturnRate;
      balance += interest;
      // Monthly deposit added
      balance += monthlyDeposit;
      // Monthly fee deducted
      const fee = balance * monthlyFeeRate;
      balance -= fee;
      totalFeesPaid += fee;
    }

    const totalDeposited = initialLumpSum + monthlyDeposit * totalMonths;
    const grossProfit = Math.max(0, balance - totalDeposited);

    // Calculate tax
    let tax = 0;
    if (planType === 'SAVINGS_PLUS') {
      if (grossProfit > 12000) {
        tax = (grossProfit - 12000) * 0.10;
      }
    } else if (planType === 'MANAGED_STOCK') {
      if (grossProfit > 40000) {
        tax = (40000 - 12000) * 0.10 + (grossProfit - 40000) * 0.20;
      } else if (grossProfit > 12000) {
        tax = (grossProfit - 12000) * 0.10;
      }
    }

    return {
      totalDeposited,
      grossWorth: balance,
      grossProfit,
      tax,
      netWorth: balance - tax,
      netProfit: grossProfit - tax,
      totalFeesPaid,
    };
  };

  const getTimeframeResult = (years: 1 | 5 | 10): InvestmentTimeframeResult => {
    const minSim = runSimulationForRate(plan.minAnnualReturnPercent, years);
    const maxSim = runSimulationForRate(plan.maxAnnualReturnPercent, years);

    return {
      years,
      totalDeposited: minSim.totalDeposited,
      minWorth: minSim.netWorth,
      maxWorth: maxSim.netWorth,
      minProfit: minSim.netProfit,
      maxProfit: maxSim.netProfit,
      totalFees: (minSim.totalFeesPaid + maxSim.totalFeesPaid) / 2, // average estimated fees
      estimatedTaxMin: minSim.tax,
      estimatedTaxMax: maxSim.tax,
    };
  };

  // Generate monthly progression points up to 10 years (120 months) for Recharts graphing
  const monthlyProgression: {
    month: number;
    year: number;
    totalDeposited: number;
    minWorth: number;
    maxWorth: number;
  }[] = [];

  let minBal = initialLumpSum;
  let maxBal = initialLumpSum;
  const minMonthlyRate = plan.minAnnualReturnPercent / 100 / 12;
  const maxMonthlyRate = plan.maxAnnualReturnPercent / 100 / 12;
  const monthlyFeeRate = plan.monthlyRbsxFeePercent / 100;

  for (let m = 0; m <= 120; m++) {
    if (m === 0) {
      monthlyProgression.push({
        month: 0,
        year: 0,
        totalDeposited: initialLumpSum,
        minWorth: initialLumpSum,
        maxWorth: initialLumpSum,
      });
    } else {
      // min simulation
      minBal += minBal * minMonthlyRate + monthlyDeposit;
      const minFee = minBal * monthlyFeeRate;
      minBal -= minFee;

      // max simulation
      maxBal += maxBal * maxMonthlyRate + monthlyDeposit;
      const maxFee = maxBal * monthlyFeeRate;
      maxBal -= maxFee;

      const totalDeposited = initialLumpSum + monthlyDeposit * m;

      if (m % 3 === 0 || m === 12 || m === 60 || m === 120) {
        monthlyProgression.push({
          month: m,
          year: parseFloat((m / 12).toFixed(1)),
          totalDeposited,
          minWorth: Math.max(totalDeposited, minBal),
          maxWorth: Math.max(totalDeposited, maxBal),
        });
      }
    }
  }

  return {
    id: 'QUOTE-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000),
    userId,
    userName,
    planType,
    planName: plan.name,
    initialLumpSum,
    monthlyDeposit,
    createdAt: new Date().toISOString(),
    results: {
      1: getTimeframeResult(1),
      5: getTimeframeResult(5),
      10: getTimeframeResult(10),
    },
    monthlyProgression,
  };
}

/**
 * Format numbers as GBP currency to 2 decimal places (£X,XXX.XX)
 */
export function formatGBP(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '£0.00';
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format numbers in specific currency code with proper symbol and 2 decimals
 */
export function formatCurrency(value: number, currencyCode: CurrencyCode): string {
  const details = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.GBP;
  const formattedNumber = new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `${details.symbol}${formattedNumber}`;
}

/**
 * Validates mortgage calculation / application inputs
 */
export function validateMortgageInput(
  propertyValue: number,
  downPayment: number,
  annualIncome: number,
  loanPeriodYears: number
): { isValid: boolean; errors: string[]; warningMessage?: string } {
  const errors: string[] = [];
  let warningMessage: string | undefined = undefined;

  if (isNaN(propertyValue) || propertyValue <= 0) {
    errors.push('Property value must be a positive amount.');
  }
  if (isNaN(downPayment) || downPayment < 0) {
    errors.push('Down payment / deposit cannot be negative.');
  } else if (downPayment >= propertyValue) {
    errors.push('Down payment must be less than the total property value.');
  }
  if (isNaN(annualIncome) || annualIncome <= 0) {
    errors.push('Annual income must be a positive number.');
  }
  if (isNaN(loanPeriodYears) || loanPeriodYears < 5 || loanPeriodYears > 35) {
    errors.push('Loan term must be between 5 and 35 years.');
  }

  const loanAmount = propertyValue - downPayment;
  const maxAffordableLoan = annualIncome * 4.5;

  if (loanAmount > maxAffordableLoan && errors.length === 0) {
    warningMessage = `Loan amount (£${loanAmount.toLocaleString()}) exceeds the standard 4.5x annual income affordability limit (£${maxAffordableLoan.toLocaleString()}). Application will require manual underwriter review.`;
  }

  const ltvPercent = (loanAmount / propertyValue) * 100;
  if (ltvPercent > 95 && errors.length === 0) {
    errors.push('Loan-to-Value (LTV) exceeds 95%. Minimum deposit requirement is 5% of property value.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warningMessage,
  };
}

/**
 * Calculates monthly mortgage repayment and total repayment
 */
export function calculateMortgage(
  propertyValue: number,
  downPayment: number,
  annualIncome: number,
  loanPeriodYears: number,
  interestRatePercent: number = 3.75
): {
  propertyValue: number;
  downPayment: number;
  loanAmount: number;
  annualIncome: number;
  loanPeriodYears: number;
  interestRatePercent: number;
  monthlyRepayment: number;
  totalRepayment: number;
  totalInterestPaid: number;
  ltvPercent: number;
  affordabilityRatio: number;
} {
  const loanAmount = Math.max(0, propertyValue - downPayment);
  const monthlyRate = interestRatePercent / 100 / 12;
  const totalMonths = loanPeriodYears * 12;

  let monthlyRepayment = 0;
  if (monthlyRate > 0) {
    monthlyRepayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    monthlyRepayment = loanAmount / totalMonths;
  }

  const totalRepayment = monthlyRepayment * totalMonths;
  const totalInterestPaid = totalRepayment - loanAmount;
  const ltvPercent = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0;
  const affordabilityRatio = annualIncome > 0 ? loanAmount / annualIncome : 0;

  return {
    propertyValue,
    downPayment,
    loanAmount,
    annualIncome,
    loanPeriodYears,
    interestRatePercent,
    monthlyRepayment,
    totalRepayment,
    totalInterestPaid,
    ltvPercent,
    affordabilityRatio,
  };
}

