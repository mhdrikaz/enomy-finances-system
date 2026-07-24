import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Wifi, 
  WifiOff, 
  FileText, 
  Layers, 
  ChevronDown,
  Activity
} from 'lucide-react';
import { MethodologyReportModal } from '../reports/MethodologyReportModal';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  isOnline: boolean;
  onToggleNetwork: (online: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  isOnline,
  onToggleNetwork,
  activeTab,
  setActiveTab,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            System Administrator
          </span>
        );
      case 'STAFF':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <UserCheck className="w-3.5 h-3.5" />
            Staff / Financial Advisor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Building2 className="w-3.5 h-3.5" />
            Valued Client
          </span>
        );
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand Identity */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                EF
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Enomy-Finances</h1>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono font-bold border border-blue-100">
                    PDS Bespoke System
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Mortgages, Savings & Investment Portal</p>
              </div>
            </div>

            {/* Right Controls & Profile */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Network Online / Offline Switcher */}
              <button
                onClick={() => onToggleNetwork(!isOnline)}
                title={isOnline ? "Click to simulate network outage & test local offline logging/caching" : "Click to restore online network connection"}
                className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse'
                }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden md:inline">Network Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                    <span>Offline Cache Active</span>
                  </>
                )}
              </button>

              {/* PDS Software Preliminary Investigation Report Button */}
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">PDS Investigation Report</span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{currentUser.email}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-slate-800">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-xs text-slate-500">{currentUser.email}</p>
                      <div className="mt-2">{getRoleBadge(currentUser.role)}</div>
                    </div>

                    <div className="py-1 text-xs">
                      <div className="px-4 py-1.5 text-slate-500 flex items-center justify-between">
                        <span>Account ID:</span>
                        <span className="font-mono text-slate-800 font-semibold">{currentUser.id}</span>
                      </div>
                      {currentUser.accountNumber && (
                        <div className="px-4 py-1.5 text-slate-500 flex items-center justify-between">
                          <span>Account #:</span>
                          <span className="font-mono text-slate-800 font-semibold">{currentUser.accountNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 font-semibold hover:bg-red-50 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Preliminary Software Investigation Modal */}
      {showReportModal && (
        <MethodologyReportModal onClose={() => setShowReportModal(false)} />
      )}
    </>
  );
};
