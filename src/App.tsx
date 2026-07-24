import React, { useState, useEffect } from 'react';
import { User, CurrencyTransaction, InvestmentQuote, SystemHealthMetrics, Mortgage } from './types';
import { 
  loadCurrentSessionUser, 
  saveCurrentSessionUser, 
  loadAllUsers, 
  loadAllTransactions, 
  loadAllSavedQuotes, 
  loadAllMortgages,
  isNetworkOnline, 
  setNetworkOnlineStatus 
} from './utils/storage';
import { INITIAL_SYSTEM_HEALTH } from './data/mockData';

// Layout Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginPage } from './components/auth/LoginPage';

// Customer Components
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CurrencyConverter } from './components/customer/CurrencyConverter';
import { InvestmentQuoteCalculator } from './components/customer/InvestmentQuoteCalculator';
import { MortgageCalculator } from './components/customer/MortgageCalculator';
import { SavedQuotesView } from './components/customer/SavedQuotesView';
import { TransactionHistoryView } from './components/customer/TransactionHistoryView';

// Staff Components
import { StaffDashboard } from './components/staff/StaffDashboard';
import { CustomerManager } from './components/staff/CustomerManager';
import { StaffTransactionManager } from './components/staff/StaffTransactionManager';
import { StaffQuoteManager } from './components/staff/StaffQuoteManager';
import { StaffMortgageManager } from './components/staff/StaffMortgageManager';
import { ExchangeRatesMonitor } from './components/staff/ExchangeRatesMonitor';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserAccountManager } from './components/admin/UserAccountManager';
import { SystemDiagnosticLogs } from './components/admin/SystemDiagnosticLogs';
import { ExchangeRateAdmin } from './components/admin/ExchangeRateAdmin';
import { SecurityAuditManager } from './components/admin/SecurityAuditManager';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<CurrencyTransaction[]>([]);
  const [savedQuotes, setSavedQuotes] = useState<InvestmentQuote[]>([]);
  const [mortgages, setMortgages] = useState<Mortgage[]>([]);
  const [health, setHealth] = useState<SystemHealthMetrics>(INITIAL_SYSTEM_HEALTH);

  const refreshAppData = () => {
    setUsers(loadAllUsers());
    setTransactions(loadAllTransactions());
    setSavedQuotes(loadAllSavedQuotes());
    setMortgages(loadAllMortgages());
    setIsOnline(isNetworkOnline());
  };

  useEffect(() => {
    const sessionUser = loadCurrentSessionUser();
    setCurrentUser(sessionUser);
    refreshAppData();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    saveCurrentSessionUser(user);
    setActiveTab('overview');
    refreshAppData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentSessionUser(null);
  };

  const handleToggleNetwork = (online: boolean) => {
    setIsOnline(online);
    setNetworkOnlineStatus(online);
    refreshAppData();
  };

  // If no user is logged in, show Single Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Render role-specific main view
  const renderRoleView = () => {
    if (currentUser.role === 'CUSTOMER') {
      switch (activeTab) {
        case 'currency':
          return <CurrencyConverter currentUser={currentUser} onTransactionSaved={refreshAppData} />;
        case 'investment':
          return <InvestmentQuoteCalculator currentUser={currentUser} onQuoteSaved={refreshAppData} />;
        case 'mortgage':
          return (
            <MortgageCalculator
              currentUser={currentUser}
              mortgages={mortgages}
              onMortgageSaved={refreshAppData}
              setActiveTab={setActiveTab}
            />
          );
        case 'saved_quotes':
          return (
            <SavedQuotesView
              currentUser={currentUser}
              savedQuotes={savedQuotes}
              onQuotesUpdated={refreshAppData}
              setActiveTab={setActiveTab}
            />
          );
        case 'transactions':
          return <TransactionHistoryView currentUser={currentUser} transactions={transactions} />;
        default:
          return (
            <CustomerDashboard
              currentUser={currentUser}
              transactions={transactions}
              savedQuotes={savedQuotes}
              setActiveTab={setActiveTab}
            />
          );
      }
    }

    if (currentUser.role === 'STAFF') {
      switch (activeTab) {
        case 'customers':
          return <CustomerManager currentUser={currentUser} users={users} onUsersUpdated={refreshAppData} />;
        case 'transactions_mgr':
          return <StaffTransactionManager currentUser={currentUser} transactions={transactions} />;
        case 'quotes_mgr':
          return (
            <StaffQuoteManager
              currentUser={currentUser}
              users={users}
              savedQuotes={savedQuotes}
              onQuotesUpdated={refreshAppData}
            />
          );
        case 'mortgages_mgr':
          return (
            <StaffMortgageManager
              currentUser={currentUser}
              mortgages={mortgages}
              onMortgagesUpdated={refreshAppData}
            />
          );
        case 'exchange_rates':
          return <ExchangeRatesMonitor />;
        default:
          return (
            <StaffDashboard
              currentUser={currentUser}
              users={users}
              transactions={transactions}
              savedQuotes={savedQuotes}
              setActiveTab={setActiveTab}
            />
          );
      }
    }


    if (currentUser.role === 'ADMIN') {
      switch (activeTab) {
        case 'users_mgr':
          return <UserAccountManager currentUser={currentUser} users={users} onUsersUpdated={refreshAppData} />;
        case 'diagnostics':
          return (
            <SystemDiagnosticLogs
              currentUser={currentUser}
              isOnline={isOnline}
              onToggleNetwork={handleToggleNetwork}
            />
          );
        case 'rate_config':
          return <ExchangeRateAdmin currentUser={currentUser} />;
        case 'audit_logs':
          return <SecurityAuditManager />;
        default:
          return (
            <AdminDashboard
              currentUser={currentUser}
              users={users}
              health={health}
              isOnline={isOnline}
              onToggleNetwork={handleToggleNetwork}
              setActiveTab={setActiveTab}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Navigation */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        isOnline={isOnline}
        onToggleNetwork={handleToggleNetwork}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Role-based Sidebar */}
        <Sidebar role={currentUser.role} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-slate-100">
          {renderRoleView()}
        </main>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">Enomy-Finances System</span>
            <span>•</span>
            <span>Phonyt Digital Solutions (PDS) Bespoke Implementation</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="inline-flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span className="font-semibold text-slate-700">Infrastructure Upgraded (Tier-1 SLA)</span>
            </span>
            <span>•</span>
            <span className="font-mono text-slate-600">v2.4.0-Production</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
