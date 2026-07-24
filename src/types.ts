export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: string;
  passwordHash?: string;
  createdAt: string;
  portfolioValue?: number;
  accountNumber?: string;
  lastLogin?: string;
}

export type CurrencyCode = 'GBP' | 'USD' | 'EUR' | 'BRL' | 'JPY' | 'TRY';

export interface CurrencyDetails {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rateToGBP: number; // 1 GBP = X currency
}

export interface CurrencyTransaction {
  id: string;
  userId: string;
  userName: string;
  sourceCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  sourceAmount: number;
  convertedAmount: number;
  feePercentage: number;
  feeAmountSource: number;
  feeAmountGBP: number;
  netTargetAmount: number;
  effectiveRate: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING_REVIEW' | 'FLAGGED';
}

export type InvestmentPlanType = 'BASIC_SAVINGS' | 'SAVINGS_PLUS' | 'MANAGED_STOCK';

export interface InvestmentPlanDefinition {
  id: InvestmentPlanType;
  name: string;
  tagline: string;
  description: string;
  maxInvestmentPerYear: number | null; // null means unlimited
  minMonthlyInvestment: number;
  minInitialLumpSum: number;
  minAnnualReturnPercent: number;
  maxAnnualReturnPercent: number;
  taxDescription: string;
  monthlyRbsxFeePercent: number; // e.g. 0.25%
}

export interface InvestmentTimeframeResult {
  years: 1 | 5 | 10;
  totalDeposited: number;
  minWorth: number;
  maxWorth: number;
  minProfit: number;
  maxProfit: number;
  totalFees: number;
  estimatedTaxMin: number;
  estimatedTaxMax: number;
}

export interface InvestmentQuote {
  id: string;
  userId: string;
  userName: string;
  planType: InvestmentPlanType;
  planName: string;
  initialLumpSum: number;
  monthlyDeposit: number;
  createdAt: string;
  results: {
    1: InvestmentTimeframeResult;
    5: InvestmentTimeframeResult;
    10: InvestmentTimeframeResult;
  };
  monthlyProgression: {
    month: number;
    year: number;
    totalDeposited: number;
    minWorth: number;
    maxWorth: number;
  }[];
}

export interface DiagnosticLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  source: string;
  storageTarget: 'DATABASE' | 'LOCAL_FILE_SYSTEM';
  stackTrace?: string;
  cachedUserData?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SystemHealthMetrics {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  uptimeSeconds: number;
  activeSessions: number;
  networkLatencyMs: number;
  isOnline: boolean;
  offlineCacheItemsCount: number;
  databaseStatus: 'ONLINE' | 'OFFLINE_FALLBACK' | 'MAINTENANCE';
}

export type MortgageStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';

export interface Mortgage {
  id: string; // Mortgage_ID
  userId: string; // User_ID
  userName: string;
  propertyValue: number; // Property_Value
  downPayment: number; // Down_Payment
  loanAmount: number; // Loan_Amount
  annualIncome: number; // Annual_Income
  loanPeriodYears: number; // Loan_Period
  interestRatePercent: number; // Interest_Rate
  monthlyRepayment: number; // Monthly_Repayment
  totalRepayment: number; // Total_Repayment
  status: MortgageStatus; // Status
  applicationDate: string; // Application_Date
  notes?: string;
}
