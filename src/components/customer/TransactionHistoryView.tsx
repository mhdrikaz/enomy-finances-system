import React, { useState } from 'react';
import { User, CurrencyTransaction } from '../../types';
import { formatCurrency, formatGBP } from '../../utils/financialCalculations';
import { History, Search, ArrowLeftRight, Download, Filter } from 'lucide-react';

interface TransactionHistoryViewProps {
  currentUser: User;
  transactions: CurrencyTransaction[];
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({
  currentUser,
  transactions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');

  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);

  const filtered = userTransactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.sourceCurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.targetCurrency.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCurrency =
      selectedCurrency === 'ALL' ||
      tx.sourceCurrency === selectedCurrency ||
      tx.targetCurrency === selectedCurrency;

    return matchesSearch && matchesCurrency;
  });

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
          <History className="w-3.5 h-3.5 text-blue-600" />
          <span>Client Transaction Audit</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Currency Conversion Transaction History</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review all executed currency conversions, associated transaction fees, and exchange rates.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Transaction ID or Currency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">All Currencies</option>
            <option value="GBP">GBP (£)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="BRL">BRL (R$)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="TRY">TRY (₺)</option>
          </select>
        </div>

      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">No conversion records matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Tx ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Source Amount</th>
                  <th className="py-3 px-4">Fee Charged</th>
                  <th className="py-3 px-4">Net Target Received</th>
                  <th className="py-3 px-4">Effective Rate</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-700">{tx.id}</td>
                    <td className="py-3 px-4 font-sans text-slate-500 font-medium">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(tx.sourceAmount, tx.sourceCurrency)}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {tx.feePercentage}% ({formatCurrency(tx.feeAmountSource, tx.sourceCurrency)})
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600">
                      {formatCurrency(tx.netTargetAmount, tx.targetCurrency)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      1 {tx.sourceCurrency} = {tx.effectiveRate.toFixed(4)} {tx.targetCurrency}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
