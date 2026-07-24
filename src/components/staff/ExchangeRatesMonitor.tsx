import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '../../types';
import { SUPPORTED_CURRENCIES } from '../../utils/financialCalculations';
import { loadExchangeRates } from '../../utils/storage';
import { LineChart as LineChartIcon, RefreshCw, TrendingUp, ArrowUpRight, ArrowDownRight, Globe2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const ExchangeRatesMonitor: React.FC = () => {
  const [rates, setRates] = useState<Record<CurrencyCode, number>>({
    GBP: 1.0,
    USD: 1.28,
    EUR: 1.17,
    BRL: 7.05,
    JPY: 198.4,
    TRY: 42.1,
  });

  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    setRates(loadExchangeRates());
  }, []);

  const handleRefresh = () => {
    setRates(loadExchangeRates());
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  // Mock 7-day volatility data for chart
  const volatilityData = [
    { day: 'Mon', USD: 1.272, EUR: 1.165, JPY: 196.2 },
    { day: 'Tue', USD: 1.275, EUR: 1.168, JPY: 197.1 },
    { day: 'Wed', USD: 1.278, EUR: 1.169, JPY: 197.8 },
    { day: 'Thu', USD: 1.281, EUR: 1.171, JPY: 198.0 },
    { day: 'Fri', USD: 1.280, EUR: 1.170, JPY: 198.4 },
  ];

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span>RBSX Global Exchange Gateway</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Live Market Exchange Rates Monitor</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time interbank conversion benchmark rates relative to Pound Sterling (GBP).
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-2 border border-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Rates (Updated {lastRefreshed})</span>
        </button>
      </div>

      {/* Grid of Rate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => {
          const details = SUPPORTED_CURRENCIES[code];
          const rate = rates[code];
          const isGBP = code === 'GBP';

          return (
            <div key={code} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">{details.flag} {code}</span>
                {!isGBP && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> +0.2%
                  </span>
                )}
              </div>
              <p className="text-lg font-black font-mono text-blue-700 mt-1">
                {rate.toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">1 GBP = {rate} {code}</p>
            </div>
          );
        })}
      </div>

      {/* Volatility Graph */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
          <LineChartIcon className="w-4 h-4 text-blue-600" />
          <span>5-Day FX Rate Volatility Trend</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volatilityData}>
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="USD" stroke="#2563eb" strokeWidth={2} name="USD / GBP" />
              <Line type="monotone" dataKey="EUR" stroke="#059669" strokeWidth={2} name="EUR / GBP" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
