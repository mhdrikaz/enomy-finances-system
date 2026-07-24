import React, { useState } from 'react';
import { User, Mortgage, MortgageStatus } from '../../types';
import { updateMortgageStatus } from '../../utils/storage';
import { formatGBP } from '../../utils/financialCalculations';
import { Home, Search, CheckCircle2, XCircle, Clock, AlertCircle, FileText, Check, Edit3 } from 'lucide-react';

interface StaffMortgageManagerProps {
  currentUser: User;
  mortgages: Mortgage[];
  onMortgagesUpdated: () => void;
}

export const StaffMortgageManager: React.FC<StaffMortgageManagerProps> = ({
  currentUser,
  mortgages,
  onMortgagesUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Edit modal / inline action state
  const [selectedMortgage, setSelectedMortgage] = useState<Mortgage | null>(null);
  const [newStatus, setNewStatus] = useState<MortgageStatus>('APPROVED');
  const [advisorNotes, setAdvisorNotes] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredMortgages = mortgages.filter((m) => {
    const matchesSearch =
      m.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDecisionModal = (m: Mortgage) => {
    setSelectedMortgage(m);
    setNewStatus(m.status);
    setAdvisorNotes(m.notes || '');
  };

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMortgage) return;

    updateMortgageStatus(selectedMortgage.id, newStatus, advisorNotes);
    onMortgagesUpdated();

    setSuccessToast(`Mortgage application ${selectedMortgage.id} status updated to ${newStatus}.`);
    setSelectedMortgage(null);

    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Home className="w-3.5 h-3.5 text-blue-600" />
            <span>Staff Underwriting Suite</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Mortgage Loan Applications Manager</h2>
          <p className="text-xs text-slate-500 mt-1">
            Review client home loan applications, evaluate income affordability & LTV risk, and issue underwriter decisions.
          </p>
        </div>

        {successToast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2 rounded-xl flex items-center space-x-2 font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name or mortgage ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-bold">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">All Statuses ({mortgages.length})</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Mortgage_ID (PK)</th>
                <th className="py-3 px-3">User_ID (FK)</th>
                <th className="py-3 px-3">Property_Value</th>
                <th className="py-3 px-3">Down_Payment</th>
                <th className="py-3 px-3">Loan_Amount</th>
                <th className="py-3 px-3">Annual_Income</th>
                <th className="py-3 px-3">Loan_Period</th>
                <th className="py-3 px-3">Interest_Rate</th>
                <th className="py-3 px-3">Monthly_Repayment</th>
                <th className="py-3 px-3">Total_Repayment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Application_Date</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-800">
              {filteredMortgages.map((m) => {
                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors font-mono">
                    <td className="py-3.5 px-3 font-bold text-blue-700">{m.id}</td>
                    <td className="py-3.5 px-3 font-sans font-bold text-slate-900">
                      {m.userName}
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">{m.userId}</span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{formatGBP(m.propertyValue)}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-700">{formatGBP(m.downPayment)}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{formatGBP(m.loanAmount)}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-800">{formatGBP(m.annualIncome)}</td>
                    <td className="py-3.5 px-3 font-sans font-bold text-slate-700">{m.loanPeriodYears} Years</td>
                    <td className="py-3.5 px-3 font-bold text-blue-700">{m.interestRatePercent}%</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-700">{formatGBP(m.monthlyRepayment)}/mo</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{formatGBP(m.totalRepayment)}</td>
                    <td className="py-3.5 px-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                          m.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : m.status === 'REJECTED'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <span>{m.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-sans text-slate-400 text-[11px]">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-sans">
                      <button
                        onClick={() => handleOpenDecisionModal(m)}
                        className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-[11px] inline-flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Decide</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredMortgages.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                    No mortgage applications found matching the selected search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Underwriter Decision Modal */}
      {selectedMortgage && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Underwriter Decision – {selectedMortgage.id}
                </h3>
                <p className="text-xs text-slate-500">Applicant: {selectedMortgage.userName}</p>
              </div>
              <button
                onClick={() => setSelectedMortgage(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDecision} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Property Value</span>
                  <strong>{formatGBP(selectedMortgage.propertyValue)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Loan Amount</span>
                  <strong>{formatGBP(selectedMortgage.loanAmount)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Monthly Repayment</span>
                  <strong className="text-emerald-700">{formatGBP(selectedMortgage.monthlyRepayment)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Annual Income</span>
                  <strong>{formatGBP(selectedMortgage.annualIncome)}</strong>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Update Application Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as MortgageStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-blue-600"
                >
                  <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Underwriter Advisor Notes / Terms</label>
                <textarea
                  rows={3}
                  value={advisorNotes}
                  onChange={(e) => setAdvisorNotes(e.target.value)}
                  placeholder="Enter decision comments or conditions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedMortgage(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md shadow-blue-200"
                >
                  Save Underwriting Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
