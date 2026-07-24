import React, { useState } from 'react';
import { User, InvestmentQuote } from '../../types';
import { formatGBP } from '../../utils/financialCalculations';
import { deleteSavedQuote } from '../../utils/storage';
import { 
  BookmarkCheck, 
  Trash2, 
  Printer, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Layers, 
  ArrowRight 
} from 'lucide-react';

interface SavedQuotesViewProps {
  currentUser: User;
  savedQuotes: InvestmentQuote[];
  onQuotesUpdated: () => void;
  setActiveTab: (tab: string) => void;
}

export const SavedQuotesView: React.FC<SavedQuotesViewProps> = ({
  currentUser,
  savedQuotes,
  onQuotesUpdated,
  setActiveTab,
}) => {
  const [selectedQuote, setSelectedQuote] = useState<InvestmentQuote | null>(null);
  const userQuotes = savedQuotes.filter((q) => q.userId === currentUser.id);

  const handleDelete = (quoteId: string) => {
    if (window.confirm('Are you sure you want to delete this saved quote?')) {
      deleteSavedQuote(quoteId);
      if (selectedQuote?.id === quoteId) {
        setSelectedQuote(null);
      }
      onQuotesUpdated();
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <BookmarkCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Client Quotation Records</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Saved Investment Quotations</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access and manage previously generated investment plan quotes.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('investment')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-blue-200"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Generate New Quote</span>
        </button>
      </div>

      {userQuotes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-sm">
          <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Saved Investment Quotes</h3>
          <p className="text-xs max-w-md mx-auto">
            You haven't saved any investment quotations yet. Use our Savings & Investment Calculator to build a personalized forecast.
          </p>
          <button
            onClick={() => setActiveTab('investment')}
            className="mt-2 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>Open Investment Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Quotes List Table */}
          <div className="lg:col-span-6 space-y-3">
            {userQuotes.map((quote) => (
              <div
                key={quote.id}
                onClick={() => setSelectedQuote(quote)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedQuote?.id === quote.id
                    ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-100">
                    {quote.id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2">{quote.planName}</h3>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">Lump Sum</span>
                    <span className="font-bold text-slate-900">£{quote.initialLumpSum.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">Monthly Deposit</span>
                    <span className="font-bold text-slate-900">£{quote.monthlyDeposit.toLocaleString()}/mo</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500">10-Year Projected Max:</span>
                  <span className="font-mono font-black text-emerald-600 text-sm">
                    {formatGBP(quote.results[10].maxWorth)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Quote Detail Panel */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            {selectedQuote ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">
                      {selectedQuote.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{selectedQuote.planName}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center space-x-1 cursor-pointer border border-slate-200"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedQuote.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Detailed Forecast Horizon Breakdown
                  </h4>

                  {[1, 5, 10].map((yr) => {
                    const res = selectedQuote.results[yr as 1 | 5 | 10];
                    return (
                      <div key={yr} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{yr} Year Horizon</span>
                          <span className="text-emerald-600 font-mono font-black">{formatGBP(res.maxWorth)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 font-mono">
                          <div>Deposited: {formatGBP(res.totalDeposited)}</div>
                          <div>Min Return: {formatGBP(res.minWorth)}</div>
                          <div>Total Fees: {formatGBP(res.totalFees)}</div>
                          <div>Est. Tax: {formatGBP(res.estimatedTaxMax)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-medium">Select a quotation from the list to view detailed breakdowns.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
