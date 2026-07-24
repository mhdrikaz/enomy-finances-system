import React from 'react';
import { User, SystemHealthMetrics } from '../../types';
import { 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Server, 
  Terminal, 
  Users, 
  Globe, 
  Wifi, 
  WifiOff, 
  Activity,
  Layers
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  health: SystemHealthMetrics;
  isOnline: boolean;
  onToggleNetwork: (online: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  health,
  isOnline,
  onToggleNetwork,
  setActiveTab,
}) => {
  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>System Administrator Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              System Admin Workspace
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Deployment environment: <strong className="text-emerald-700 font-mono">Web Platform (Cloud Run Infrastructure)</strong>. Full control over security, logs, and account privileges.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('diagnostics')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-blue-200"
            >
              <Terminal className="w-4 h-4" />
              <span>Diagnostic Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Health Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>CPU LOAD</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{health.cpuUsagePercent}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${health.cpuUsagePercent}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>MEMORY UTILIZATION</span>
            <HardDrive className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{health.memoryUsagePercent}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${health.memoryUsagePercent}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>NETWORK STATUS</span>
            {isOnline ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-amber-600" />}
          </div>
          <p className={`text-xl font-black font-mono mt-1 ${isOnline ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isOnline ? 'ONLINE' : 'OFFLINE FALLBACK'}
          </p>
          <button
            onClick={() => onToggleNetwork(!isOnline)}
            className="text-[11px] text-blue-600 hover:underline mt-1 font-bold block cursor-pointer"
          >
            {isOnline ? 'Simulate Outage' : 'Restore Online Network'}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>TOTAL ACCOUNTS</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{users.length}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Clients, Staff & Admins</p>
        </div>

      </div>

      {/* Deployment & Environment Details Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
          <Server className="w-4 h-4 text-blue-600" />
          <span>System Environment & Infrastructure Specification</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-sans block text-[10px]">APPLICATION TYPE</span>
            <span className="font-bold text-slate-900">Web-Based System (Cloud SPA)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-sans block text-[10px]">DATABASE SYNC</span>
            <span className="font-bold text-emerald-600">{health.databaseStatus}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-sans block text-[10px]">SERVER UPTIME</span>
            <span className="font-bold text-slate-900">99.98% (864,200s)</span>
          </div>
        </div>
      </div>

    </div>
  );
};
