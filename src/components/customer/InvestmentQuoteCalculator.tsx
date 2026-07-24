import React, { useState, useEffect } from 'react';
import { User, InvestmentPlanType, InvestmentQuote } from '../../types';
import { 
  INVESTMENT_PLANS, 
  validateInvestmentInput, 
  calculateInvestmentQuote, 
  formatGBP 
} from '../../utils/financialCalculations';
import { saveInvestmentQuote } from '../../utils/storage';
import { 
  TrendingUp, 
  ShieldCheck, 
  Bookmark, 
  Check, 
  AlertCircle, 
  Info, 
  Printer, 
  Sparkles,
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

interface InvestmentQuoteCalculatorProps {
  currentUser: User;
  onQuoteSaved?: () => void;
}

export const InvestmentQuoteCalculator: React.FC<InvestmentQuoteCalculatorProps> = ({
  currentUser,
  onQuoteSaved,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlanType>('SAVINGS_PLUS');
  const [initialLumpSum, setInitialLumpSum] = useState<number>(1000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(250);
  const [selectedTimeframe, setSelectedTimeframe] = useState<1 | 5 | 10>(5);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [calculatedQuote, setCalculatedQuote] = useState<InvestmentQuote | null>(null);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Recalculate quote whenever inputs change
  useEffect(() => {
    const val = validateInvestmentInput(selectedPlan, initialLumpSum, monthlyDeposit);
    setValidationErrors(val.errors);

    if (val.isValid) {
      const quote = calculateInvestmentQuote(
        currentUser.id,
        currentUser.name,
        selectedPlan,
        initialLumpSum || 0,
        monthlyDeposit || 0
      );
      setCalculatedQuote(quote);
    } else {
      setCalculatedQuote(null);
    }
  }, [selectedPlan, initialLumpSum, monthlyDeposit, currentUser]);

  const [showResultModal, setShowResultModal] = useState(false);

  const handleSaveQuote = () => {
    if (!calculatedQuote) return;

    saveInvestmentQuote(calculatedQuote);
    setIsSavedToast(true);
    setShowResultModal(true);
    setTimeout(() => setIsSavedToast(false), 3000);

    if (onQuoteSaved) {
      onQuoteSaved();
    }
  };

  const currentPlanDef = INVESTMENT_PLANS[selectedPlan];
  const activeResult = calculatedQuote ? calculatedQuote.results[selectedTimeframe] : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-slate-900 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Personalised Financial Forecasting Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Savings & Investment Quote Generator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure your lump sum and monthly investments across our 3 bespoke plan options to generate projections over 1, 5, and 10 years.
            </p>
          </div>

          {isSavedToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2 rounded-xl flex items-center space-x-2 font-bold animate-bounce">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Quote Saved to Profile!</span>
            </div>
          )}
        </div>
      </div>

      {/* Plan Option Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(INVESTMENT_PLANS) as InvestmentPlanType[]).map((planKey) => {
          const plan = INVESTMENT_PLANS[planKey];
          const isSelected = selectedPlan === planKey;

          return (
            <div
              key={planKey}
              onClick={() => setSelectedPlan(planKey)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Selected
                </div>
              )}

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{plan.name}</h3>
                <p className="text-xs text-blue-700 font-bold mt-1">
                  Expected Returns: {plan.minAnnualReturnPercent}% – {plan.maxAnnualReturnPercent}% / yr
                </p>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{plan.tagline}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Min Monthly:</span>
                  <span className="font-mono font-bold text-slate-900">£{plan.minMonthlyInvestment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Min Lump Sum:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {plan.minInitialLumpSum > 0 ? `£${plan.minInitialLumpSum}` : 'N/A (£0)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Yearly Cap:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {plan.maxInvestmentPerYear ? `£${plan.maxInvestmentPerYear.toLocaleString()}` : 'Unlimited'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RBSX Monthly Fee:</span>
                  <span className="font-mono font-bold text-blue-800">{plan.monthlyRbsxFeePercent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Form & Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs Controls */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Investment Inputs</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Initial Lump Sum (£)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">£</span>
              <input
                type="number"
                min={0}
                step={50}
                value={initialLumpSum}
                onChange={(e) => setInitialLumpSum(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-sm rounded-xl focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Min required: £{currentPlanDef.minInitialLumpSum}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Monthly Deposit (£)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">£</span>
              <input
                type="number"
                min={0}
                step={25}
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-sm rounded-xl focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Min required: £{currentPlanDef.minMonthlyInvestment} / month
            </p>
          </div>

          {/* Validation Warnings */}
          {validationErrors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
              {validationErrors.map((err, idx) => (
                <div key={idx} className="flex items-start space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">{err}</span>
                </div>
              ))}
            </div>
          )}

          {/* Timeframe Selector Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Projection Timeframe View
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 5, 10].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedTimeframe(yr as 1 | 5 | 10)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedTimeframe === yr
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {yr} Year{yr > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveQuote}
            disabled={validationErrors.length > 0 || !calculatedQuote}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              validationErrors.length > 0 || !calculatedQuote
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 cursor-pointer'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Save Quote to My Profile</span>
          </button>
        </div>

        {/* Right Output Projections & Charts */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">{currentPlanDef.name} Quote</h3>
              <p className="text-xs text-slate-500">
                Personalized forecast for {selectedTimeframe} Year{selectedTimeframe > 1 ? 's' : ''} horizon
              </p>
            </div>
            <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-blue-800 font-bold">
              Tax Rule: {currentPlanDef.taxDescription}
            </div>
          </div>

          {activeResult && (
            <>
              {/* Detailed Projections Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Total Deposited */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Deposited</span>
                  <span className="font-mono text-base font-black text-slate-900 mt-1 block">
                    {formatGBP(activeResult.totalDeposited)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Capital invested</span>
                </div>

                {/* Estimated Worth (Min - Max) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Worth</span>
                  <span className="font-mono text-sm font-black text-emerald-600 mt-1 block">
                    {formatGBP(activeResult.minWorth)}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 block">
                    up to {formatGBP(activeResult.maxWorth)}
                  </span>
                </div>

                {/* Total Net Profit */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Profit</span>
                  <span className="font-mono text-sm font-black text-blue-700 mt-1 block">
                    +{formatGBP(activeResult.minProfit)}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-800 block">
                    up to +{formatGBP(activeResult.maxProfit)}
                  </span>
                </div>

                {/* Total Fees & Tax */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Fees & Taxes</span>
                  <span className="font-mono text-xs font-bold text-slate-800 mt-1 block">
                    Fees: {formatGBP(activeResult.totalFees)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Tax: {formatGBP(activeResult.estimatedTaxMax)}
                  </span>
                </div>

              </div>

              {/* Growth Trajectory Recharts Chart */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>10-Year Growth Trajectory Curve</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Values in GBP (£)</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={calculatedQuote?.monthlyProgression || []}>
                      <defs>
                        <linearGradient id="maxReturnGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="minReturnGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>

                      <XAxis 
                        dataKey="year" 
                        stroke="#64748b" 
                        tick={{ fontSize: 11 }}
                        unit=" yr"
                      />
                      <YAxis 
                        stroke="#64748b" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                        formatter={(val: any) => [formatGBP(Number(val)), '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />

                      <Area 
                        type="monotone" 
                        dataKey="maxWorth" 
                        name="Maximum Projected Returns" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#maxReturnGrad)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="minWorth" 
                        name="Minimum Projected Returns" 
                        stroke="#2563eb" 
                        fillOpacity={1} 
                        fill="url(#minReturnGrad)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalDeposited" 
                        name="Total Capital Deposited" 
                        stroke="#94a3b8" 
                        strokeDasharray="3 3"
                        fill="transparent" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Timeframes Summary Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Horizon</th>
                      <th className="py-2.5 px-3">Total Capital</th>
                      <th className="py-2.5 px-3">Min Return</th>
                      <th className="py-2.5 px-3">Max Return</th>
                      <th className="py-2.5 px-3">Total Profit</th>
                      <th className="py-2.5 px-3">Fees Paid</th>
                      <th className="py-2.5 px-3">Estimated Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                    {[1, 5, 10].map((timeframe) => {
                      const res = calculatedQuote?.results[timeframe as 1 | 5 | 10];
                      if (!res) return null;
                      const isCurrent = selectedTimeframe === timeframe;

                      return (
                        <tr key={timeframe} className={isCurrent ? 'bg-blue-50/70 font-bold text-blue-900' : 'hover:bg-slate-50'}>
                          <td className="py-2.5 px-3 font-sans font-bold">
                            {timeframe} Year{timeframe > 1 ? 's' : ''}
                          </td>
                          <td className="py-2.5 px-3">{formatGBP(res.totalDeposited)}</td>
                          <td className="py-2.5 px-3 text-blue-700">{formatGBP(res.minWorth)}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-bold">{formatGBP(res.maxWorth)}</td>
                          <td className="py-2.5 px-3 text-emerald-600">+{formatGBP(res.maxProfit)}</td>
                          <td className="py-2.5 px-3 text-slate-500">{formatGBP(res.totalFees)}</td>
                          <td className="py-2.5 px-3 text-slate-500">{formatGBP(res.estimatedTaxMax)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>

      </div>

      {/* Investment Calculation Result Message Box Modal */}
      {showResultModal && activeResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 text-slate-900 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3>Investment Calculation Successful.</h3>
              </div>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Investment Plan:</span>
                <span className="font-bold text-slate-900">{currentPlanDef.name}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Investment Amount:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatGBP(activeResult.totalDeposited)} ({selectedTimeframe} Year Term)
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Estimated Return:</span>
                <span className="font-mono font-bold text-blue-700">
                  {formatGBP(activeResult.minWorth)} – {formatGBP(activeResult.maxWorth)}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Management Fee:</span>
                <span className="font-mono text-slate-700 font-bold">{formatGBP(activeResult.totalFees)}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Tax Amount:</span>
                <span className="font-mono text-slate-700 font-bold">{formatGBP(activeResult.estimatedTaxMax)}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Net Return (Profit):</span>
                <span className="font-mono font-bold text-emerald-600 font-extrabold">
                  +{formatGBP(activeResult.maxProfit)}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Total Investment Value:</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">
                  {formatGBP(activeResult.maxWorth)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-2 transition-colors border border-slate-300 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Quotation</span>
              </button>

              <button
                onClick={() => setShowResultModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
