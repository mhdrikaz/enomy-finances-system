import React from 'react';
import { User, CurrencyTransaction, InvestmentQuote } from '../../types';
import { formatGBP } from '../../utils/financialCalculations';
import { 
  Wallet, 
  ArrowLeftRight, 
  TrendingUp, 
  BookmarkCheck, 
  ArrowUpRight, 
  Shield, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface CustomerDashboardProps {
  currentUser: User;
  transactions: CurrencyTransaction[];
  savedQuotes: InvestmentQuote[];
  setActiveTab: (tab: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  transactions,
  savedQuotes,
  setActiveTab,
}) => {
  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);
  const userQuotes = savedQuotes.filter((q) => q.userId === currentUser.id);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 text-slate-900 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Enomy-Finances Client Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Welcome back, {currentUser.name}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Access live currency conversion tools with tiered fee structures and calculate personalized savings & investment plan quotes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('currency')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-200 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Convert Currency</span>
            </button>

            <button
              onClick={() => setActiveTab('investment')}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Investment Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Portfolio Value */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Portfolio Value</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {formatGBP(currentUser.portfolioValue || 48500)}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              +4.2% annualized growth
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Currency Conversions Count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executed Conversions</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{userTransactions.length}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Limits: 300 to 5,000 units
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
        </div>

        {/* Saved Investment Quotes */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Quotes</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{userQuotes.length}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              1, 5, 10 Year Forecasts
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <BookmarkCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Currency Transactions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
              <span>Recent Currency Transactions</span>
            </h3>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {userTransactions.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No currency transactions executed yet.</p>
          ) : (
            <div className="space-y-3">
              {userTransactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors">
                  <div>
                    <p className="font-bold text-slate-900 font-mono">
                      {tx.sourceAmount} {tx.sourceCurrency} &rarr; {tx.netTargetAmount.toFixed(2)} {tx.targetCurrency}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Fee: {tx.feePercentage}% (£{tx.feeAmountGBP.toFixed(2)}) • {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Investment Quotes Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <BookmarkCheck className="w-4 h-4 text-purple-600" />
              <span>Active Investment Quotes</span>
            </h3>
            <button
              onClick={() => setActiveTab('saved_quotes')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center cursor-pointer"
            >
              <span>Manage Quotes</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {userQuotes.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No saved investment quotes found. Use the Investment Calculator to generate quotes.</p>
          ) : (
            <div className="space-y-3">
              {userQuotes.slice(0, 3).map((q) => (
                <div key={q.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors">
                  <div>
                    <p className="font-bold text-slate-900">{q.planName}</p>
                    <p className="text-[10px] text-slate-500">
                      Lump: £{q.initialLumpSum.toLocaleString()} • Monthly: £{q.monthlyDeposit.toLocaleString()}/mo
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 font-mono">{formatGBP(q.results[10].maxWorth)}</p>
                    <p className="text-[10px] text-slate-400">10-Yr Max Return</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
