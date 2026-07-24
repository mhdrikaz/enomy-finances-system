import { User, CurrencyTransaction, InvestmentQuote, DiagnosticLog, AuditLog, CurrencyCode, Mortgage, MortgageStatus } from '../types';
import { INITIAL_USERS, INITIAL_TRANSACTIONS, INITIAL_SAVED_QUOTES, INITIAL_DIAGNOSTIC_LOGS, INITIAL_AUDIT_LOGS, INITIAL_MORTGAGES } from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'enomy_current_user',
  USERS: 'enomy_users',
  TRANSACTIONS: 'enomy_transactions',
  QUOTES: 'enomy_saved_quotes',
  MORTGAGES: 'enomy_mortgages',
  DIAGNOSTIC_LOGS: 'enomy_diagnostic_logs',
  LOCAL_LOG_FILES: 'enomy_local_file_logs',
  CACHED_USER_DATA: 'enomy_offline_user_cache',
  AUDIT_LOGS: 'enomy_audit_logs',
  EXCHANGE_RATES: 'enomy_exchange_rates',
  NETWORK_STATUS: 'enomy_network_online',
};

// Helper for localStorage with fallback
function getStoredJSON<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage key:', key, e);
    return defaultValue;
  }
}

function setStoredJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage key:', key, e);
  }
}

export function loadCurrentSessionUser(): User | null {
  return getStoredJSON<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // default to customer
}

export function saveCurrentSessionUser(user: User | null): void {
  setStoredJSON(STORAGE_KEYS.CURRENT_USER, user);
}

export function loadAllUsers(): User[] {
  return getStoredJSON<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function saveAllUsers(users: User[]): void {
  setStoredJSON(STORAGE_KEYS.USERS, users);
}

export function loadAllTransactions(): CurrencyTransaction[] {
  return getStoredJSON<CurrencyTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
}

export function saveTransaction(transaction: CurrencyTransaction): CurrencyTransaction[] {
  const all = loadAllTransactions();
  const updated = [transaction, ...all];
  setStoredJSON(STORAGE_KEYS.TRANSACTIONS, updated);

  // Auto log audit
  logAudit(transaction.userId, transaction.userName, 'CURRENCY_CONVERSION', `Converted ${transaction.sourceAmount} ${transaction.sourceCurrency} to ${transaction.netTargetAmount.toFixed(2)} ${transaction.targetCurrency}`);

  // Auto log diagnostic
  logDiagnostic('INFO', `Currency transaction executed: ${transaction.id} (${transaction.sourceAmount} ${transaction.sourceCurrency} -> ${transaction.targetCurrency})`, 'CurrencyConversionModule');

  return updated;
}

export function loadAllSavedQuotes(): InvestmentQuote[] {
  return getStoredJSON<InvestmentQuote[]>(STORAGE_KEYS.QUOTES, INITIAL_SAVED_QUOTES);
}

export function saveInvestmentQuote(quote: InvestmentQuote): InvestmentQuote[] {
  const all = loadAllSavedQuotes();
  // check if quote already exists
  const existingIdx = all.findIndex((q) => q.id === quote.id);
  let updated: InvestmentQuote[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = quote;
  } else {
    updated = [quote, ...all];
  }
  setStoredJSON(STORAGE_KEYS.QUOTES, updated);

  logAudit(quote.userId, quote.userName, 'SAVE_INVESTMENT_QUOTE', `Saved investment quote ${quote.id} for ${quote.planName}`);
  logDiagnostic('INFO', `Investment quote saved: ${quote.id} (${quote.planType})`, 'InvestmentModule');

  return updated;
}

export function deleteSavedQuote(quoteId: string): InvestmentQuote[] {
  const all = loadAllSavedQuotes();
  const updated = all.filter((q) => q.id !== quoteId);
  setStoredJSON(STORAGE_KEYS.QUOTES, updated);
  return updated;
}

export function loadAllMortgages(): Mortgage[] {
  return getStoredJSON<Mortgage[]>(STORAGE_KEYS.MORTGAGES, INITIAL_MORTGAGES);
}

export function saveMortgage(mortgage: Mortgage): Mortgage[] {
  const all = loadAllMortgages();
  const existingIdx = all.findIndex((m) => m.id === mortgage.id);
  let updated: Mortgage[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = mortgage;
  } else {
    updated = [mortgage, ...all];
  }
  setStoredJSON(STORAGE_KEYS.MORTGAGES, updated);

  logAudit(mortgage.userId, mortgage.userName, 'MORTGAGE_APPLICATION', `Submitted/Updated mortgage application ${mortgage.id} for £${mortgage.loanAmount.toLocaleString()}`);
  logDiagnostic('INFO', `Mortgage application saved: ${mortgage.id} (£${mortgage.propertyValue.toLocaleString()} property)`, 'MortgageModule');

  return updated;
}

export function updateMortgageStatus(mortgageId: string, status: MortgageStatus, notes?: string): Mortgage[] {
  const all = loadAllMortgages();
  const updated = all.map((m) => {
    if (m.id === mortgageId) {
      return { ...m, status, notes: notes !== undefined ? notes : m.notes };
    }
    return m;
  });
  setStoredJSON(STORAGE_KEYS.MORTGAGES, updated);

  const target = updated.find((m) => m.id === mortgageId);
  if (target) {
    logAudit(target.userId, target.userName, 'MORTGAGE_STATUS_UPDATE', `Updated mortgage ${mortgageId} status to ${status}`);
    logDiagnostic('INFO', `Mortgage ${mortgageId} status updated to ${status}`, 'MortgageModule');
  }

  return updated;
}

export function deleteMortgage(mortgageId: string): Mortgage[] {
  const all = loadAllMortgages();
  const updated = all.filter((m) => m.id !== mortgageId);
  setStoredJSON(STORAGE_KEYS.MORTGAGES, updated);
  return updated;
}


export function isNetworkOnline(): boolean {
  return getStoredJSON<boolean>(STORAGE_KEYS.NETWORK_STATUS, true);
}

export function setNetworkOnlineStatus(online: boolean): void {
  setStoredJSON(STORAGE_KEYS.NETWORK_STATUS, online);
  
  if (!online) {
    // Immediately cache active user data as required by ADMIN-FR-06
    cacheUserDataLocally();
    logDiagnostic('WARNING', 'Network connectivity lost. Switched system error logging to local file system fallback and cached user session data immediately.', 'NetworkMonitor', 'LOCAL_FILE_SYSTEM');
  } else {
    logDiagnostic('INFO', 'Network connection restored. Syncing offline logs and local caches back to central database.', 'NetworkMonitor', 'DATABASE');
  }
}

export function cacheUserDataLocally(): void {
  const currentUser = loadCurrentSessionUser();
  const quotes = loadAllSavedQuotes();
  const transactions = loadAllTransactions();
  const mortgages = loadAllMortgages();

  const cacheSnapshot = {
    cachedAt: new Date().toISOString(),
    user: currentUser,
    userQuotes: currentUser ? quotes.filter((q) => q.userId === currentUser.id) : [],
    userTransactions: currentUser ? transactions.filter((t) => t.userId === currentUser.id) : [],
    userMortgages: currentUser ? mortgages.filter((m) => m.userId === currentUser.id) : [],
  };

  setStoredJSON(STORAGE_KEYS.CACHED_USER_DATA, cacheSnapshot);
}


export function getCachedUserDataSnapshot(): any {
  return getStoredJSON(STORAGE_KEYS.CACHED_USER_DATA, null);
}

export function loadDiagnosticLogs(): DiagnosticLog[] {
  return getStoredJSON<DiagnosticLog[]>(STORAGE_KEYS.DIAGNOSTIC_LOGS, INITIAL_DIAGNOSTIC_LOGS);
}

export function loadLocalFileLogs(): string {
  return getStoredJSON<string>(STORAGE_KEYS.LOCAL_LOG_FILES, '[ENOMY-FINANCES FALLBACK LOG STREAM /var/logs/enomy-fallback.log]\n2026-07-23 09:00:00 [SYSTEM] Local offline log stream initialized.\n');
}

export function logDiagnostic(
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL',
  message: string,
  source: string,
  overrideTarget?: 'DATABASE' | 'LOCAL_FILE_SYSTEM',
  stackTrace?: string
): DiagnosticLog {
  const online = isNetworkOnline();
  const target = overrideTarget || (online ? 'DATABASE' : 'LOCAL_FILE_SYSTEM');

  const newLog: DiagnosticLog = {
    id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toISOString(),
    level,
    message,
    source,
    storageTarget: target,
    stackTrace,
  };

  if (target === 'DATABASE') {
    const logs = loadDiagnosticLogs();
    setStoredJSON(STORAGE_KEYS.DIAGNOSTIC_LOGS, [newLog, ...logs]);
  } else {
    // Save to local file system simulation stream
    const existingFileLog = loadLocalFileLogs();
    const formattedEntry = `${newLog.timestamp} [${level}] [${source}] ${message}${stackTrace ? '\nStackTrace: ' + stackTrace : ''}\n`;
    setStoredJSON(STORAGE_KEYS.LOCAL_LOG_FILES, existingFileLog + formattedEntry);

    // Also keep copy in diagnostic logs
    const logs = loadDiagnosticLogs();
    setStoredJSON(STORAGE_KEYS.DIAGNOSTIC_LOGS, [newLog, ...logs]);
  }

  return newLog;
}

export function loadAuditLogs(): AuditLog[] {
  return getStoredJSON<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
}

export function logAudit(userId: string, userName: string, action: string, details: string): void {
  const logs = loadAuditLogs();
  const newAudit: AuditLog = {
    id: 'AUD-' + Math.floor(100 + Math.random() * 900),
    userId,
    userName,
    action,
    details,
    ipAddress: '192.168.1.102',
    timestamp: new Date().toISOString(),
  };
  setStoredJSON(STORAGE_KEYS.AUDIT_LOGS, [newAudit, ...logs]);
}

export function loadExchangeRates(): Record<CurrencyCode, number> {
  return getStoredJSON<Record<CurrencyCode, number>>(STORAGE_KEYS.EXCHANGE_RATES, {
    GBP: 1.0,
    USD: 1.28,
    EUR: 1.17,
    BRL: 7.05,
    JPY: 198.4,
    TRY: 42.1,
  });
}

export function saveExchangeRates(rates: Record<CurrencyCode, number>): void {
  setStoredJSON(STORAGE_KEYS.EXCHANGE_RATES, rates);
}
