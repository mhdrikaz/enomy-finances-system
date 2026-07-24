import React, { useState } from 'react';
import { User, Mortgage } from '../../types';
import { calculateMortgage, validateMortgageInput, formatGBP } from '../../utils/financialCalculations';
import { saveMortgage, deleteMortgage } from '../../utils/storage';
import { Home, Calculator, CheckCircle2, AlertTriangle, FileText, Send, Building2, Trash2 } from 'lucide-react';

interface MortgageCalculatorProps {
  currentUser: User;
  mortgages: Mortgage[];
  onMortgageSaved: () => void;
  setActiveTab?: (tab: string) => void;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  currentUser,
  mortgages,
  onMortgageSaved,
  setActiveTab,
}) => {
  const [propertyValue, setPropertyValue] = useState<number>(350000);
  const [downPayment, setDownPayment] = useState<number>(50000);
  const [annualIncome, setAnnualIncome] = useState<number>(75000);
  const [loanPeriodYears, setLoanPeriodYears] = useState<number>(25);
  const [interestRatePercent, setInterestRatePercent] = useState<number>(3.75);

  const [activeTabMode, setActiveTabMode] = useState<'CALCULATOR' | 'MY_APPLICATIONS'>('CALCULATOR');
  const [submittedSuccessMsg, setSubmittedSuccessMsg] = useState<string | null>(null);

  // Real-time calculation
  const calc = calculateMortgage(propertyValue, downPayment, annualIncome, loanPeriodYears, interestRatePercent);
  const validation = validateMortgageInput(propertyValue, downPayment, annualIncome, loanPeriodYears);

  // Filter user's applications
  const userMortgages = mortgages.filter((m) => m.userId === currentUser.id);

  const [submittedMortgage, setSubmittedMortgage] = useState<Mortgage | null>(null);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyValue || !downPayment === undefined || !annualIncome || !loanPeriodYears) {
      alert("All fields are required.");
      return;
    }

    if (propertyValue <= 0 || downPayment < 0 || annualIncome <= 0 || loanPeriodYears <= 0) {
      alert("Please enter valid application details.");
      return;
    }

    if (annualIncome < 15000) {
      alert("Mortgage application does not meet the minimum income requirement.");
      return;
    }

    if (!validation.isValid) return;

    const newMortgage: Mortgage = {
      id: 'MORT-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      userName: currentUser.name,
      propertyValue: calc.propertyValue,
      downPayment: calc.downPayment,
      loanAmount: calc.loanAmount,
      annualIncome: calc.annualIncome,
      loanPeriodYears: calc.loanPeriodYears,
      interestRatePercent: calc.interestRatePercent,
      monthlyRepayment: Math.round(calc.monthlyRepayment),
      totalRepayment: Math.round(calc.totalRepayment),
      status: 'PENDING_APPROVAL',
      applicationDate: new Date().toISOString(),
      notes: validation.warningMessage || 'Standard customer online mortgage application.',
    };

    saveMortgage(newMortgage);
    onMortgageSaved();
    setSubmittedMortgage(newMortgage);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to cancel mortgage application ${id}?`)) {
      deleteMortgage(id);
      onMortgageSaved();
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Home className="w-3.5 h-3.5 text-blue-600" />
            <span>Residential Mortgage Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Home Mortgage Loans & Affordability Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Calculate estimated monthly repayments, verify income affordability, and submit official mortgage loan applications.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTabMode('CALCULATOR')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              activeTabMode === 'CALCULATOR'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mortgage Calculator
          </button>
          <button
            onClick={() => setActiveTabMode('MY_APPLICATIONS')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTabMode === 'MY_APPLICATIONS'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Applications</span>
            <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              {userMortgages.length}
            </span>
          </button>
        </div>
      </div>

      {submittedSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{submittedSuccessMsg}</span>
        </div>
      )}

      {activeTabMode === 'CALCULATOR' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs Column */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Loan Calculation Parameters</span>
            </h3>

            <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Property Value (£)
                </label>
                <input
                  type="number"
                  min="50000"
                  step="5000"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deposit / Down Payment (£)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Equity deposit: {calc.propertyValue > 0 ? ((calc.downPayment / calc.propertyValue) * 100).toFixed(1) : 0}% of property value.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Gross Annual Income (£)
                </label>
                <input
                  type="number"
                  min="10000"
                  step="1000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loan Term (Years)
                  </label>
                  <select
                    value={loanPeriodYears}
                    onChange={(e) => setLoanPeriodYears(parseInt(e.target.value) || 25)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                    <option value={35}>35 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Fixed Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1"
                    max="15"
                    value={interestRatePercent}
                    onChange={(e) => setInterestRatePercent(parseFloat(e.target.value) || 3.75)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Validation Errors */}
              {!validation.isValid && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs space-y-1 font-medium">
                  {validation.errors.map((err, i) => (
                    <p key={i} className="flex items-start space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span>{err}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Validation Warning */}
              {validation.isValid && validation.warningMessage && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium flex items-start space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{validation.warningMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!validation.isValid}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-blue-200"
              >
                <Send className="w-4 h-4" />
                <span>Submit Mortgage Application</span>
              </button>
            </form>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] font-bold tracking-wider text-blue-200 uppercase">
                  ESTIMATED MONTHLY REPAYMENT
                </span>
                <p className="text-3xl font-black font-mono text-emerald-400">
                  {formatGBP(calc.monthlyRepayment)}
                </p>
                <p className="text-xs text-slate-300 font-medium">
                  Fixed for {calc.loanPeriodYears} years @ {calc.interestRatePercent}% APR
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  NET REQUIRED LOAN AMOUNT
                </span>
                <p className="text-3xl font-black font-mono text-slate-900">
                  {formatGBP(calc.loanAmount)}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Property £{calc.propertyValue.toLocaleString()} minus £{calc.downPayment.toLocaleString()} deposit
                </p>
              </div>
            </div>

            {/* Detailed Affordability Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Mortgage Structure & Financial Analysis</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold">LOAN TO VALUE (LTV)</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{calc.ltvPercent.toFixed(1)}%</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold font-mono">INCOME MULTIPLE</span>
                  <span className={`font-mono font-bold text-sm ${calc.affordabilityRatio > 4.5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {calc.affordabilityRatio.toFixed(2)}x Annual Income
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px] font-bold">TOTAL INTEREST PAID</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{formatGBP(calc.totalInterestPaid)}</span>
                </div>
              </div>

              {/* Progress bar ratio */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-blue-700">Principal Loan: {formatGBP(calc.loanAmount)}</span>
                  <span className="text-purple-700">Interest Portion: {formatGBP(calc.totalInterestPaid)}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex border border-slate-200">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${(calc.loanAmount / calc.totalRepayment) * 100}%` }}
                  ></div>
                  <div
                    className="bg-purple-500 h-full"
                    style={{ width: `${(calc.totalInterestPaid / calc.totalRepayment) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
                  <span>Total Payable Over Term: <strong>{formatGBP(calc.totalRepayment)}</strong></span>
                  <span>Term: {calc.loanPeriodYears} Years ({calc.loanPeriodYears * 12} Payments)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* My Applications List View */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>My Submitted Mortgage Applications</span>
          </h3>

          {userMortgages.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Home className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No mortgage applications submitted yet.</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                Use the Mortgage Calculator tab above to calculate your home loan parameters and submit your application.
              </p>
              <button
                onClick={() => setActiveTabMode('CALCULATOR')}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
              >
                Calculate Mortgage
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userMortgages.map((m) => (
                <div key={m.id} className="border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-slate-300 transition-all shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-mono text-xs font-bold text-blue-700">{m.id}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : m.status === 'REJECTED'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Property Value</span>
                      <strong className="text-slate-900 font-bold">{formatGBP(m.propertyValue)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Net Loan Amount</span>
                      <strong className="text-slate-900 font-bold">{formatGBP(m.loanAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Monthly Repayment</span>
                      <strong className="text-emerald-700 font-bold">{formatGBP(m.monthlyRepayment)}/mo</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Term & Rate</span>
                      <strong className="text-slate-900 font-bold">{m.loanPeriodYears} yrs @ {m.interestRatePercent}%</strong>
                    </div>
                  </div>

                  {m.notes && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-sans">
                      <span className="font-bold text-slate-800">Advisor Note: </span>
                      {m.notes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Applied: {new Date(m.applicationDate).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600 hover:text-red-800 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mortgage Application Result Message Box Modal */}
      {submittedMortgage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 text-slate-900 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3>Mortgage Application Submitted Successfully.</h3>
              </div>
              <button
                onClick={() => {
                  setSubmittedMortgage(null);
                  setActiveTabMode('MY_APPLICATIONS');
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Application ID:</span>
                <span className="font-mono font-bold text-slate-900">{submittedMortgage.id}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Loan Amount:</span>
                <span className="font-mono font-bold text-slate-900">{formatGBP(submittedMortgage.loanAmount)}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Interest Rate:</span>
                <span className="font-mono font-bold text-blue-700">{submittedMortgage.interestRatePercent}% Fixed</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Monthly Repayment:</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">
                  {formatGBP(submittedMortgage.monthlyRepayment)}/mo
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Total Repayment:</span>
                <span className="font-mono font-bold text-slate-900">{formatGBP(submittedMortgage.totalRepayment)}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Application Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">
                  {submittedMortgage.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSubmittedMortgage(null);
                  setActiveTabMode('MY_APPLICATIONS');
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                View My Applications
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
