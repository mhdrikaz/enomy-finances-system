import React from 'react';
import { User, CurrencyTransaction, InvestmentQuote } from '../../types';
import { formatGBP } from '../../utils/financialCalculations';
import { 
  Users, 
  ArrowLeftRight, 
  FileCheck2, 
  LineChart, 
  UserPlus, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface StaffDashboardProps {
  currentUser: User;
  users: User[];
  transactions: CurrencyTransaction[];
  savedQuotes: InvestmentQuote[];
  setActiveTab: (tab: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  users,
  transactions,
  savedQuotes,
  setActiveTab,
}) => {
  const customerUsers = users.filter((u) => u.role === 'CUSTOMER');
  const totalPortfolioValue = customerUsers.reduce((sum, u) => sum + (u.portfolioValue || 0), 0);

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Financial Advisor Workspace</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Welcome, Advisor {currentUser.name}!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage client records, review cross-border currency exchanges, and issue official investment plan quotations.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('customers')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-blue-200"
            >
              <UserPlus className="w-4 h-4" />
              <span>Manage Clients</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Clients</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{customerUsers.length}</p>
          <p className="text-[11px] text-blue-700 font-medium mt-1">Assigned profiles</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Client AUM</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatGBP(totalPortfolioValue)}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Assets Under Management</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Conversions</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{transactions.length}</p>
          <p className="text-[11px] text-blue-700 font-medium mt-1">Processed organizational-wide</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Quotes</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{savedQuotes.length}</p>
          <p className="text-[11px] text-purple-700 font-medium mt-1">Active investment proposals</p>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Customer Directory Preview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Assigned Client Accounts</span>
            </h3>
            <button
              onClick={() => setActiveTab('customers')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center cursor-pointer"
            >
              <span>View Directory</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {customerUsers.slice(0, 3).map((cus) => (
              <div key={cus.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors">
                <div>
                  <p className="font-bold text-slate-900">{cus.name}</p>
                  <p className="text-[10px] text-slate-500">{cus.email} • {cus.accountNumber}</p>
                </div>
                <div className="text-right font-mono">
                  <p className="font-bold text-emerald-600">{formatGBP(cus.portfolioValue || 0)}</p>
                  <p className="text-[10px] text-slate-400 font-sans">{cus.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Transactions Log Preview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
              <span>Recent Currency Activity</span>
            </h3>
            <button
              onClick={() => setActiveTab('transactions_mgr')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center cursor-pointer"
            >
              <span>All Logs</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors">
                <div>
                  <p className="font-bold text-slate-900">{tx.userName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {tx.sourceAmount} {tx.sourceCurrency} &rarr; {tx.netTargetAmount.toFixed(2)} {tx.targetCurrency}
                  </p>
                </div>
                <span className="font-mono text-blue-700 font-bold text-xs">
                  Fee: {tx.feePercentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
