import React, { useState, useEffect } from 'react';
import { User, CurrencyCode, CurrencyTransaction } from '../../types';
import { 
  SUPPORTED_CURRENCIES, 
  validateCurrencyTransaction, 
  calculateCurrencyConversion, 
  formatCurrency, 
  formatGBP 
} from '../../utils/financialCalculations';
import { saveTransaction, loadExchangeRates } from '../../utils/storage';
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Receipt, 
  Printer, 
  X,
  Info,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface CurrencyConverterProps {
  currentUser: User;
  onTransactionSaved?: () => void;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ currentUser, onTransactionSaved }) => {
  const [sourceCurrency, setSourceCurrency] = useState<CurrencyCode>('GBP');
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>('EUR');
  const [sourceAmount, setSourceAmount] = useState<number>(1000);
  const [exchangeRates, setExchangeRates] = useState<Record<CurrencyCode, number>>({
    GBP: 1.0,
    USD: 1.28,
    EUR: 1.17,
    BRL: 7.05,
    JPY: 198.4,
    TRY: 42.1,
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [recentReceipt, setRecentReceipt] = useState<CurrencyTransaction | null>(null);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  useEffect(() => {
    const rates = loadExchangeRates();
    setExchangeRates(rates);
  }, []);

  // Validate on amount change
  useEffect(() => {
    const res = validateCurrencyTransaction(sourceAmount);
    setValidationError(res.error);
  }, [sourceAmount]);

  const conversionResult = calculateCurrencyConversion(
    sourceCurrency,
    targetCurrency,
    sourceAmount || 0,
    exchangeRates
  );

  const handleSwapCurrencies = () => {
    const temp = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  const handleExecuteTransaction = () => {
    if (!sourceCurrency || !targetCurrency || sourceAmount === undefined || sourceAmount === null) {
      setValidationError("All fields are required.");
      return;
    }

    if (sourceAmount <= 0) {
      setValidationError("Please enter a valid amount.");
      return;
    }

    if (sourceCurrency === targetCurrency) {
      setValidationError("Please select different currencies.");
      return;
    }

    const validation = validateCurrencyTransaction(sourceAmount);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    const tx: CurrencyTransaction = {
      id: 'TX-' + Math.floor(10000 + Math.random() * 90000),
      userId: currentUser.id,
      userName: currentUser.name,
      sourceCurrency,
      targetCurrency,
      sourceAmount,
      convertedAmount: conversionResult.convertedTargetAmount,
      feePercentage: conversionResult.feePercentage,
      feeAmountSource: conversionResult.feeAmountSource,
      feeAmountGBP: conversionResult.feeAmountGBP,
      netTargetAmount: conversionResult.convertedTargetAmount,
      effectiveRate: conversionResult.effectiveRate,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
    };

    saveTransaction(tx);
    setRecentReceipt(tx);
    setIsSuccessToast(true);
    setValidationError(null);

    if (onTransactionSaved) {
      onTransactionSaved();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Currency Exchange Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Currency Conversion & Cost Calculator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Convert between supported global currencies with transparent fee calculations based on initial amount tiers.
            </p>
          </div>

          <div className="text-left sm:text-right text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-medium">Transaction Limits</span>
            <span className="font-mono text-blue-700 font-bold text-sm">Min: 300 • Max: 5,000</span>
          </div>
        </div>
      </div>

      {/* Main Conversion Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-900">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Source Currency & Amount Input */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              From (Source Currency)
            </label>

            <div className="flex gap-2">
              <select
                value={sourceCurrency}
                onChange={(e) => setSourceCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-xl px-3 py-3 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {Object.entries(SUPPORTED_CURRENCIES).map(([code, details]) => (
                  <option key={code} value={code}>
                    {details.flag} {code}
                  </option>
                ))}
              </select>

              <div className="relative flex-1">
                <span className="absolute left-3 top-3 text-slate-400 font-bold text-xs">
                  {SUPPORTED_CURRENCIES[sourceCurrency].symbol}
                </span>
                <input
                  type="number"
                  min={300}
                  max={5000}
                  value={sourceAmount || ''}
                  onChange={(e) => setSourceAmount(parseFloat(e.target.value))}
                  placeholder="300 to 5000"
                  className={`w-full pl-8 pr-3 py-2.5 bg-slate-50 border text-slate-900 font-bold text-sm rounded-xl font-mono focus:outline-none focus:bg-white ${
                    validationError
                      ? 'border-red-400 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                  }`}
                />
              </div>
            </div>

            <span className="text-[11px] text-slate-500 block font-medium">
              {SUPPORTED_CURRENCIES[sourceCurrency].name}
            </span>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex items-center justify-center pt-2">
            <button
              onClick={handleSwapCurrencies}
              title="Swap currencies"
              className="p-3 rounded-full bg-slate-100 border border-slate-300 text-slate-700 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Target Currency & Converted Amount Output */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              To (Target Currency)
            </label>

            <div className="flex gap-2">
              <select
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-xl px-3 py-3 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {Object.entries(SUPPORTED_CURRENCIES).map(([code, details]) => (
                  <option key={code} value={code}>
                    {details.flag} {code}
                  </option>
                ))}
              </select>

              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-blue-800 font-bold text-xs">
                  {SUPPORTED_CURRENCIES[targetCurrency].symbol}
                </span>
                <span className="text-blue-900 font-black text-lg font-mono">
                  {formatCurrency(conversionResult.convertedTargetAmount, targetCurrency).replace(
                    SUPPORTED_CURRENCIES[targetCurrency].symbol,
                    ''
                  )}
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-500 block font-medium">
              {SUPPORTED_CURRENCIES[targetCurrency].name}
            </span>
          </div>

        </div>

        {/* Real-time Validation Error Banner */}
        {validationError && (
          <div className="mt-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* Calculation Breakdown Box */}
        <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Initial Amount</span>
            <span className="font-mono text-sm font-bold text-slate-900">
              {formatCurrency(sourceAmount || 0, sourceCurrency)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Transaction Fee Tier</span>
            <span className="font-mono text-sm font-bold text-blue-700">
              {conversionResult.feePercentage}% ({formatCurrency(conversionResult.feeAmountSource, sourceCurrency)})
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Amount Converted</span>
            <span className="font-mono text-sm font-bold text-emerald-600">
              {formatCurrency(conversionResult.netSourceAmount, sourceCurrency)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Effective Exchange Rate</span>
            <span className="font-mono text-xs font-bold text-slate-800">
              1 {sourceCurrency} = {conversionResult.effectiveRate.toFixed(4)} {targetCurrency}
            </span>
          </div>

        </div>

        {/* Execute Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleExecuteTransaction}
            disabled={!!validationError}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
              validationError
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 cursor-pointer'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Execute & Save Transaction</span>
          </button>
        </div>

      </div>

      {/* Fee Structure Information Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-700 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Enomy-Finances Transaction Fee Structure</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 font-medium">Up to 500</p>
            <p className="font-mono font-bold text-blue-700 text-base mt-0.5">3.5%</p>
            <p className="text-[10px] text-slate-400">Initial currency</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 font-medium">Over 500 – 1,500</p>
            <p className="font-mono font-bold text-blue-700 text-base mt-0.5">2.7%</p>
            <p className="text-[10px] text-slate-400">Initial currency</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 font-medium">Over 1,500 – 2,500</p>
            <p className="font-mono font-bold text-blue-700 text-base mt-0.5">2.0%</p>
            <p className="text-[10px] text-slate-400">Initial currency</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 font-medium">Over 2,500 – 5,000</p>
            <p className="font-mono font-bold text-blue-700 text-base mt-0.5">1.5%</p>
            <p className="text-[10px] text-slate-400">Initial currency</p>
          </div>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      {recentReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 text-slate-900 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3>Currency Conversion Successful.</h3>
              </div>
              <button
                onClick={() => setRecentReceipt(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div id="printable-receipt" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900">{recentReceipt.id}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Source Currency:</span>
                <span className="font-mono font-bold text-slate-900">
                  {recentReceipt.sourceCurrency} ({formatCurrency(recentReceipt.sourceAmount, recentReceipt.sourceCurrency)})
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Target Currency:</span>
                <span className="font-mono font-bold text-slate-900">{recentReceipt.targetCurrency}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Exchange Rate:</span>
                <span className="font-mono font-bold text-blue-700">
                  1 {recentReceipt.sourceCurrency} = {recentReceipt.effectiveRate.toFixed(4)} {recentReceipt.targetCurrency}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Converted Amount:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(recentReceipt.convertedAmount, recentReceipt.targetCurrency)}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Transaction Fee:</span>
                <span className="font-mono text-slate-700 font-bold">
                  {formatCurrency(recentReceipt.feeAmountSource, recentReceipt.sourceCurrency)} ({recentReceipt.feePercentage}%)
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Final Amount (Received):</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">
                  {formatCurrency(recentReceipt.netTargetAmount, recentReceipt.targetCurrency)}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Date & Time:</span>
                <span>{new Date(recentReceipt.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-2 transition-colors border border-slate-300 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => setRecentReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
