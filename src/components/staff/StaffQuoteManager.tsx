import React, { useState } from 'react';
import { User, InvestmentQuote, InvestmentPlanType } from '../../types';
import { formatGBP, calculateInvestmentQuote } from '../../utils/financialCalculations';
import { saveInvestmentQuote } from '../../utils/storage';
import { FileCheck2, Search, Plus, Printer, CheckCircle2 } from 'lucide-react';

interface StaffQuoteManagerProps {
  currentUser: User;
  users: User[];
  savedQuotes: InvestmentQuote[];
  onQuotesUpdated: () => void;
}

export const StaffQuoteManager: React.FC<StaffQuoteManagerProps> = ({
  currentUser,
  users,
  savedQuotes,
  onQuotesUpdated,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'QUOTATIONS' | 'PLANS'>('QUOTATIONS');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // New Quote Form
  const [targetUserId, setTargetUserId] = useState(users.find((u) => u.role === 'CUSTOMER')?.id || '');
  const [planType, setPlanType] = useState<InvestmentPlanType>('SAVINGS_PLUS');
  const [lumpSum, setLumpSum] = useState<number>(2000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(300);

  const customerUsers = users.filter((u) => u.role === 'CUSTOMER');

  const filteredQuotes = savedQuotes.filter(
    (q) =>
      q.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const client = users.find((u) => u.id === targetUserId);
    if (!client) return;

    const quote = calculateInvestmentQuote(
      client.id,
      client.name,
      planType,
      lumpSum || 0,
      monthlyDeposit || 0
    );

    saveInvestmentQuote(quote);
    onQuotesUpdated();
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Investment Management Phase</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Investment Plans & Quotations Manager</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure investment plans, manage client quotations, and review calculated net returns & management fees.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('QUOTATIONS')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'QUOTATIONS' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Quotations ({savedQuotes.length})
            </button>
            <button
              onClick={() => setActiveSubTab('PLANS')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'PLANS' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Investment Plans (3)
            </button>
          </div>

          <button
            onClick={() => setIsGenerating(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Quote</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'QUOTATIONS' ? (
        <>
          {/* Filter */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 items-center justify-between shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search quotes by client name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          {/* Table View of Quotations */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Investment ID (PK)</th>
                    <th className="py-3 px-4">User ID (FK)</th>
                    <th className="py-3 px-4">Plan ID (FK)</th>
                    <th className="py-3 px-4">Investment Amount</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Estimated Return</th>
                    <th className="py-3 px-4">Mgmt Fee</th>
                    <th className="py-3 px-4">Tax Amount</th>
                    <th className="py-3 px-4">Net Return</th>
                    <th className="py-3 px-4">Total Value</th>
                    <th className="py-3 px-4">Calculation Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans text-slate-800">
                  {filteredQuotes.map((q) => {
                    const r10 = q.results[10];
                    return (
                      <tr key={q.id} className="hover:bg-slate-50 transition-colors font-mono">
                        <td className="py-3.5 px-4 font-bold text-blue-700">{q.id}</td>
                        <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                          {q.userName}
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">{q.userId}</span>
                        </td>
                        <td className="py-3.5 px-4 font-sans font-bold text-purple-700 text-[11px]">{q.planType}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {formatGBP(q.initialLumpSum)}
                          {q.monthlyDeposit > 0 && <span className="block text-[10px] font-normal text-slate-400">+{formatGBP(q.monthlyDeposit)}/mo</span>}
                        </td>
                        <td className="py-3.5 px-4 font-sans font-bold text-slate-700">10 Years</td>
                        <td className="py-3.5 px-4 font-bold text-blue-700">{formatGBP(r10.maxWorth - r10.totalDeposited)}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-600">{formatGBP(r10.totalFees)}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-600">{formatGBP(r10.estimatedTaxMax)}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">+{formatGBP(r10.maxProfit)}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">{formatGBP(r10.maxWorth)}</td>
                        <td className="py-3.5 px-4 font-sans text-slate-400 text-[11px]">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredQuotes.length === 0 && (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-500 font-medium font-sans">
                        No investment quotations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Investment Plans Management Table */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Investment Plan Definitions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Plan_ID (PK)</th>
                  <th className="py-3 px-4">Plan_Name</th>
                  <th className="py-3 px-4">Annual_Interest_Rate</th>
                  <th className="py-3 px-4">Management_Fee_Rate</th>
                  <th className="py-3 px-4">Tax_Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-slate-800">
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700">BASIC_SAVINGS</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Option 1 – Basic Savings Plan</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">1.2% – 2.4% p.a.</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">0.25% monthly</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">0% (Tax-Free ISA Cap £20k)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700">SAVINGS_PLUS</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Option 2 – Savings Plan Plus</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">3.0% – 5.5% p.a.</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">0.30% monthly</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">10% on profit over £12,000</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700">MANAGED_STOCK</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Option 3 – Managed Stock Investments</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">4.0% – 23.0% p.a.</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">1.30% monthly</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">10% (&gt;£12k), 20% (&gt;£40k)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Issue Quote */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 text-slate-900 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Issue Official Quote For Client</h3>

            <form onSubmit={handleGenerateQuote} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700">Select Client</label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  {customerUsers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Investment Option</label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value as InvestmentPlanType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="BASIC_SAVINGS">Option 1 – Basic Savings Plan</option>
                  <option value="SAVINGS_PLUS">Option 2 – Savings Plan Plus</option>
                  <option value="MANAGED_STOCK">Option 3 – Managed Stock Investments</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Initial Lump Sum (£)</label>
                <input
                  type="number"
                  value={lumpSum}
                  onChange={(e) => setLumpSum(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Monthly Deposit (£)</label>
                <input
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGenerating(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  Issue Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
