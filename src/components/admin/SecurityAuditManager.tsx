import React, { useState, useEffect } from 'react';
import { AuditLog } from '../../types';
import { loadAuditLogs } from '../../utils/storage';
import { KeyRound, Search, ShieldCheck } from 'lucide-react';

export const SecurityAuditManager: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setAuditLogs(loadAuditLogs());
  }, []);

  const filtered = auditLogs.filter(
    (a) =>
      a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
          <span>Security & Audit Control</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Security Trail & Audit Log Stream</h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor authentication events, administrative role changes, and sensitive operations.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-700">{a.id}</td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">{a.userName}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{a.action}</td>
                  <td className="py-3 px-4 text-slate-600 font-sans font-medium">{a.details}</td>
                  <td className="py-3 px-4 text-slate-400">{a.ipAddress}</td>
                  <td className="py-3 px-4 font-sans text-slate-500 font-medium">
                    {new Date(a.timestamp).toLocaleString()}
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
