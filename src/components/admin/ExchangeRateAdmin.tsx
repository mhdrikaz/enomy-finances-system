import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '../../types';
import { SUPPORTED_CURRENCIES } from '../../utils/financialCalculations';
import { loadExchangeRates, saveExchangeRates, logAudit } from '../../utils/storage';
import { SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

interface ExchangeRateAdminProps {
  currentUser: { id: string; name: string };
}

export const ExchangeRateAdmin: React.FC<ExchangeRateAdminProps> = ({ currentUser }) => {
  const [rates, setRates] = useState<Record<CurrencyCode, number>>({
    GBP: 1.0,
    USD: 1.28,
    EUR: 1.17,
    BRL: 7.05,
    JPY: 198.4,
    TRY: 42.1,
  });

  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setRates(loadExchangeRates());
  }, []);

  const handleRateChange = (code: CurrencyCode, value: number) => {
    setRates((prev) => ({ ...prev, [code]: value }));
  };

  const handleSave = () => {
    saveExchangeRates(rates);
    logAudit(currentUser.id, currentUser.name, 'EXCHANGE_RATES_OVERRIDE', 'Updated benchmark FX exchange rates');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Exchange Rates Administration</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Currency Feed Controls & Overrides</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure system exchange rates used across currency conversion and investment forecasting modules.
          </p>
        </div>

        {savedToast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2 rounded-xl flex items-center space-x-2 font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Exchange Rates Saved!</span>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Base Exchange Rates (Relative to 1.0 GBP)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => {
            const details = SUPPORTED_CURRENCIES[code];
            const isGBP = code === 'GBP';

            return (
              <div key={code} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs">{details.flag} {details.name} ({code})</span>
                  <span className="block text-[10px] text-slate-400 font-mono">1 GBP = X {code}</span>
                </div>

                <input
                  type="number"
                  step={0.01}
                  disabled={isGBP}
                  value={rates[code]}
                  onChange={(e) => handleRateChange(code, parseFloat(e.target.value) || 1)}
                  className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-mono font-bold text-right disabled:opacity-50 focus:outline-none focus:border-blue-600"
                />
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-200 cursor-pointer"
          >
            Save Currency Configuration
          </button>
        </div>
      </div>

    </div>
  );
};
