import React from 'react';
import { UserRole } from '../../types';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  TrendingUp, 
  BookmarkCheck, 
  History, 
  Users, 
  FileCheck2, 
  LineChart, 
  ShieldAlert, 
  Terminal, 
  SlidersHorizontal, 
  KeyRound,
  FileSpreadsheet,
  Home
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab }) => {
  const customerNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'currency', label: 'Currency Converter', icon: ArrowLeftRight },
    { id: 'investment', label: 'Investment Calculator', icon: TrendingUp },
    { id: 'mortgage', label: 'Mortgage Loan Portal', icon: Home },
    { id: 'saved_quotes', label: 'My Saved Quotes', icon: BookmarkCheck },
    { id: 'transactions', label: 'Transaction History', icon: History },
  ];

  const staffNav = [
    { id: 'overview', label: 'Advisor Workspace', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'transactions_mgr', label: 'All Transactions', icon: ArrowLeftRight },
    { id: 'quotes_mgr', label: 'Customer Quotes', icon: FileCheck2 },
    { id: 'mortgages_mgr', label: 'Mortgage Applications', icon: Home },
    { id: 'exchange_rates', label: 'Market Rates Monitor', icon: LineChart },
  ];

  const adminNav = [
    { id: 'overview', label: 'System Dashboard', icon: LayoutDashboard },
    { id: 'users_mgr', label: 'User Accounts', icon: Users },
    { id: 'diagnostics', label: 'Diagnostics & Error Logs', icon: Terminal },
    { id: 'rate_config', label: 'Rate Feed Controls', icon: SlidersHorizontal },
    { id: 'audit_logs', label: 'Security & Audit Logs', icon: KeyRound },
  ];


  const navItems = role === 'ADMIN' ? adminNav : role === 'STAFF' ? staffNav : customerNav;

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex-shrink-0 p-4 flex flex-col justify-between">
      <div className="space-y-4">
        
        {/* Role Header */}
        <div className="px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {role === 'ADMIN' ? 'System Administrator' : role === 'STAFF' ? 'Staff Advisor Workspace' : 'Client Services'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">Enomy-Finances Core</p>
        <p>Bespoke System Infrastructure</p>
      </div>
    </aside>
  );
};
