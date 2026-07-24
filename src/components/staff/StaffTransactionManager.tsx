import React, { useState } from 'react';
import { User, CurrencyTransaction } from '../../types';
import { formatCurrency } from '../../utils/financialCalculations';
import { ArrowLeftRight, Search, Filter, Download, ShieldCheck } from 'lucide-react';

interface StaffTransactionManagerProps {
  currentUser: User;
  transactions: CurrencyTransaction[];
}

export const StaffTransactionManager: React.FC<StaffTransactionManagerProps> = ({
  currentUser,
  transactions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
          <span>Staff Audit & Compliance Portal</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Organization Currency Conversion Records</h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor all cross-border conversion requests, compliance checks, and fee revenues.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, Tx ID or currency..."
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

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Source Amount</th>
                <th className="py-3 px-4">Fee %</th>
                <th className="py-3 px-4">Net Target Converted</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-700">{tx.id}</td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">{tx.userName}</td>
                  <td className="py-3 px-4 font-sans text-slate-500 font-medium">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-bold">
                    {formatCurrency(tx.sourceAmount, tx.sourceCurrency)}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-bold">
                    {tx.feePercentage}% ({formatCurrency(tx.feeAmountSource, tx.sourceCurrency)})
                  </td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">
                    {formatCurrency(tx.netTargetAmount, tx.targetCurrency)}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
