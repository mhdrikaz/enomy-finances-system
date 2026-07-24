import React, { useState } from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Cpu, Code2, Server, Globe2, Layers } from 'lucide-react';

interface MethodologyReportModalProps {
  onClose: () => void;
}

export const MethodologyReportModal: React.FC<MethodologyReportModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'METHODOLOGY' | 'PARADIGMS' | 'ARCHITECTURE' | 'REQUIREMENTS'>('METHODOLOGY');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold">
              PDS
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Preliminary Software Investigation & Architecture Report</h2>
              <p className="text-xs text-slate-400">Prepared by Phonyt Digital Solutions (PDS) for Enomy-Finances CTO</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('METHODOLOGY')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'METHODOLOGY'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Software Methodology</span>
          </button>

          <button
            onClick={() => setActiveTab('PARADIGMS')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'PARADIGMS'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>2. Development Paradigms</span>
          </button>

          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'ARCHITECTURE'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>3. Web Architecture & Failover</span>
          </button>

          <button
            onClick={() => setActiveTab('REQUIREMENTS')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'REQUIREMENTS'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>4. Requirements Matrix</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          
          {activeTab === 'METHODOLOGY' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                <h3 className="font-bold text-base text-amber-400 mb-1">Selected Lifecycle Methodology: Agile Scrum (Iterative Incremental)</h3>
                <p className="text-xs leading-relaxed">
                  PDS recommends an <strong>Agile Scrum methodology</strong> for the Enomy-Finances web application migration. Given that the CTO and project client have made themselves available throughout development to provide feedback, Agile allows rapid 2-week iterations with continuous stakeholder validation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Key Justifications</span>
                  </h4>
                  <ul className="text-xs space-y-2 list-disc list-inside text-slate-300">
                    <li><strong>Evolving Requirements:</strong> Financial market integrations, currency rate feeds, and fee tiers require flexible sprint adaptability.</li>
                    <li><strong>Client Availability:</strong> Direct participation from the Enomy CTO during sprint reviews ensures complete alignment.</li>
                    <li><strong>Early Value Delivery:</strong> Core modules (Currency Converter & Savings Calculator) can be tested by staff in early sprints.</li>
                    <li><strong>Risk Mitigation:</strong> Continuous integration & diagnostic logging testing prevents costly late-stage architectural failures.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    <span>Sprint Roadmap</span>
                  </h4>
                  <ol className="text-xs space-y-2 list-decimal list-inside text-slate-300">
                    <li><strong>Sprint 1:</strong> Unified Single Login Authentication & Role-Based Navigation Routing.</li>
                    <li><strong>Sprint 2:</strong> Currency Conversion Engine with Fee Structure & Min/Max Validation (300 - 5,000).</li>
                    <li><strong>Sprint 3:</strong> Savings & Investment Quote Engine with Returns (1, 5, 10 yrs), Tax & RBSX Fees.</li>
                    <li><strong>Sprint 4:</strong> Staff Advisor Workspace, Customer Records & Saved Quotes Management.</li>
                    <li><strong>Sprint 5:</strong> Administrator Environment, Diagnostic Logging & Local File System Failover.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PARADIGMS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-200">
                <h3 className="font-bold text-base text-teal-400 mb-1">Development Paradigms: Hybrid Object-Oriented & Functional React</h3>
                <p className="text-xs leading-relaxed">
                  PDS leverages a hybrid software paradigm combining <strong>Object-Oriented Programming (OOP)</strong> for domain financial models and calculations with <strong>Functional Programming (FP)</strong> for deterministic UI state rendering and pure mathematical financial formulas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span>Functional Financial Math Engine</span>
                  </h4>
                  <p className="text-xs text-slate-300 mb-2">
                    Financial calculations (compounding interest, tax tiers, currency fee brackets) are implemented as <em>pure immutable functions</em> without side effects.
                  </p>
                  <pre className="p-2.5 rounded bg-slate-950 font-mono text-[11px] text-amber-300 overflow-x-auto">
{`function getCurrencyFeePercentage(amount: number): number {
  if (amount <= 500) return 3.5;
  if (amount <= 1500) return 2.7;
  if (amount <= 2500) return 2.0;
  return 1.5;
}`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Object-Oriented Data Abstractions</span>
                  </h4>
                  <p className="text-xs text-slate-300 mb-2">
                    Entities such as <code className="text-emerald-400">User</code>, <code className="text-emerald-400">InvestmentQuote</code>, and <code className="text-emerald-400">DiagnosticLog</code> are strictly encapsulated interfaces with strong TypeScript typing and lifecycle methods.
                  </p>
                  <pre className="p-2.5 rounded bg-slate-950 font-mono text-[11px] text-purple-300 overflow-x-auto">
{`interface InvestmentQuote {
  id: string;
  userId: string;
  planType: InvestmentPlanType;
  results: Record<1 | 5 | 10, Result>;
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200">
                <h3 className="font-bold text-base text-purple-400 mb-1">Architecture Upgrade: Web Platform & Failover Resilience</h3>
                <p className="text-xs leading-relaxed">
                  Migrating from legacy desktop networked clients to a modern Single-Page Web Application (SPA) backed by cloud microservices and local caching resilience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>Legacy Architecture vs New Web System</span>
                  </h4>
                  <p><strong>Legacy:</strong> Native desktop clients installed on staff PCs linked to local desktop server warehouse. High maintenance overhead and no client self-service access.</p>
                  <p><strong>New System:</strong> Responsive web application accessible by both Staff and Clients on any browser or tablet with unified Single Login access.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Diagnostic Logging & Local Failover</span>
                  </h4>
                  <p><strong>Normal State:</strong> Diagnostics stream to central Cloud Database.</p>
                  <p><strong>Network Outage State:</strong> Automatically diverts diagnostics to local file system (<code className="text-amber-400">/var/logs/enomy-fallback.log</code>) and immediately caches user state to prevent data loss.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'REQUIREMENTS' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-800 rounded-xl font-medium text-white flex justify-between items-center">
                <span>Total Functional Requirements Mapped</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono text-xs">28 / 28 Fulfilled</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start justify-between">
                  <div>
                    <span className="font-mono text-amber-400 font-semibold">CUS-FR-01 to 12</span>
                    <p className="text-slate-300">Customer Authentication, Currency Conversion (300-5000 limits, fees), Investment Quotes (1, 5, 10 yrs), Saved Quotes & History.</p>
                  </div>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start justify-between">
                  <div>
                    <span className="font-mono text-blue-400 font-semibold">STAFF-FR-01 to 09</span>
                    <p className="text-slate-300">Staff Secure Login, Customer Record Management, Transaction Audits, Quote Management, Rates Monitoring.</p>
                  </div>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start justify-between">
                  <div>
                    <span className="font-mono text-purple-400 font-semibold">ADMIN-FR-01 to 09</span>
                    <p className="text-slate-300">System Admin Environment, Account Management, Security Controls, Diagnostic Logging, Local Failover Logging, User Caching.</p>
                  </div>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-800/90 px-6 py-3 border-t border-slate-700 flex justify-between items-center text-xs">
          <span className="text-slate-400">Phonyt Digital Solutions &copy; 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold rounded-lg transition-colors"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
