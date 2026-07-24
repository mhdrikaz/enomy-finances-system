import React, { useState, useEffect } from 'react';
import { User, DiagnosticLog } from '../../types';
import { 
  loadDiagnosticLogs, 
  loadLocalFileLogs, 
  logDiagnostic, 
  getCachedUserDataSnapshot,
  cacheUserDataLocally
} from '../../utils/storage';
import { 
  Terminal, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  HardDrive, 
  RefreshCw, 
  ShieldAlert, 
  FileText, 
  Database, 
  Bug,
  CheckCircle2
} from 'lucide-react';

interface SystemDiagnosticLogsProps {
  currentUser: User;
  isOnline: boolean;
  onToggleNetwork: (online: boolean) => void;
}

export const SystemDiagnosticLogs: React.FC<SystemDiagnosticLogsProps> = ({
  currentUser,
  isOnline,
  onToggleNetwork,
}) => {
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);
  const [localFileLogContent, setLocalFileLogContent] = useState<string>('');
  const [cachedUserSnapshot, setCachedUserSnapshot] = useState<any>(null);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'LOGS' | 'LOCAL_FILE' | 'CACHE'>('LOGS');

  const refreshAllLogs = () => {
    setLogs(loadDiagnosticLogs());
    setLocalFileLogContent(loadLocalFileLogs());
    setCachedUserSnapshot(getCachedUserDataSnapshot());
  };

  useEffect(() => {
    refreshAllLogs();
  }, [isOnline]);

  const handleTriggerSimulatedError = () => {
    logDiagnostic(
      'CRITICAL',
      'ERR_DATABASE_DEADLOCK: Internal deadlock detected during high-throughput currency conversion batch.',
      'CoreFinancialEngine',
      undefined,
      'Error: Deadlock detected at line 142 in currency_conversion_sp.sql\n  at executeTransaction (server.ts:88)\n  at processRequest (app.ts:204)'
    );

    // Also trigger user caching as part of error recovery
    cacheUserDataLocally();
    refreshAllLogs();
  };

  const filteredLogs = logs.filter((l) => filterLevel === 'ALL' || l.level === filterLevel);

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-800 text-xs font-semibold mb-2">
            <Terminal className="w-3.5 h-3.5 text-red-600" />
            <span>Diagnostics & Recovery Suite</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Diagnostic Error Logging & Failover System</h2>
          <p className="text-xs text-slate-500 mt-1">
            Fulfilling requirements <strong className="text-blue-700 font-mono">ADMIN-FR-04, 05, 06</strong>: Central database logging, local file system fallback during network outage, and immediate user session caching.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleTriggerSimulatedError}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Bug className="w-4 h-4" />
            <span>Trigger Internal Error</span>
          </button>

          <button
            onClick={() => onToggleNetwork(!isOnline)}
            className={`px-3.5 py-2 font-bold text-xs rounded-xl flex items-center space-x-1.5 border transition-all cursor-pointer ${
              isOnline
                ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            {isOnline ? (
              <>
                <WifiOff className="w-4 h-4 text-amber-600" />
                <span>Simulate Network Outage</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span>Restore Network Connection</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
        isOnline
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center space-x-3">
          {isOnline ? <Database className="w-5 h-5 text-emerald-600" /> : <HardDrive className="w-5 h-5 text-amber-600" />}
          <div>
            <p className="font-extrabold text-slate-900">
              {isOnline ? 'Online Mode Active (Database Logging Target)' : 'Network Outage Active (Local File System Fallback Target)'}
            </p>
            <p className="text-[11px] opacity-80 mt-0.5 font-medium">
              {isOnline
                ? 'All diagnostic errors are recorded into the central cloud database.'
                : 'Network unavailable: Logs are diverting to /var/logs/enomy-fallback.log and user data is cached locally.'}
            </p>
          </div>
        </div>

        <button
          onClick={refreshAllLogs}
          className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl px-4 text-xs font-bold shadow-sm">
        <button
          onClick={() => setActiveTab('LOGS')}
          className={`px-4 py-3 border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'LOGS'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Central Diagnostic Logs ({filteredLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('LOCAL_FILE')}
          className={`px-4 py-3 border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'LOCAL_FILE'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Local File System Log Stream (/var/logs)</span>
        </button>

        <button
          onClick={() => setActiveTab('CACHE')}
          className={`px-4 py-3 border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'CACHE'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Cached User Session Data Snapshot</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'LOGS' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Filter Level:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Storage Target</th>
                  <th className="py-3 px-4">Message & StackTrace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-blue-700 font-bold">{l.id}</td>
                    <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.level === 'CRITICAL'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : l.level === 'WARNING'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {l.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{l.source}</td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.storageTarget === 'LOCAL_FILE_SYSTEM'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {l.storageTarget}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900">
                      <p className="font-bold">{l.message}</p>
                      {l.stackTrace && (
                        <pre className="mt-1 p-2 bg-slate-900 rounded text-[10px] text-red-300 font-mono overflow-x-auto">
                          {l.stackTrace}
                        </pre>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'LOCAL_FILE' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono text-amber-700">
              FILE PATH: /var/logs/enomy-fallback.log
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Local File System Stream</span>
          </div>

          <pre className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {localFileLogContent}
          </pre>
        </div>
      )}

      {activeTab === 'CACHE' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono text-emerald-700">
              LOCAL STORAGE CACHE KEY: enomy_offline_user_cache
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">ADMIN-FR-06 Recovery Data Snapshot</span>
          </div>

          {cachedUserSnapshot ? (
            <pre className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {JSON.stringify(cachedUserSnapshot, null, 2)}
            </pre>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No user session cache snapshot created yet. Simulate a network outage or error to populate.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
