import React, { useState } from 'react';
import { User } from '../../types';
import { saveAllUsers, logAudit } from '../../utils/storage';
import { formatGBP } from '../../utils/financialCalculations';
import { Users, Search, UserPlus, Edit, CheckCircle2, ShieldAlert, Phone, Mail, FileText } from 'lucide-react';

interface CustomerManagerProps {
  currentUser: User;
  users: User[];
  onUsersUpdated: () => void;
}

export const CustomerManager: React.FC<CustomerManagerProps> = ({
  currentUser,
  users,
  onUsersUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Client Form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [initialPortfolio, setInitialPortfolio] = useState<number>(10000);

  const customerUsers = users.filter((u) => u.role === 'CUSTOMER');
  const filteredCustomers = customerUsers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newCus: User = {
      id: 'USR-CUS-' + Math.floor(100 + Math.random() * 900),
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: 'CUSTOMER',
      status: 'ACTIVE',
      phone: newPhone.trim() || '+44 7700 900' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      portfolioValue: initialPortfolio || 0,
      accountNumber: 'EF-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
      lastLogin: new Date().toISOString(),
    };

    const updated = [...users, newCus];
    saveAllUsers(updated);
    logAudit(currentUser.id, currentUser.name, 'CREATE_CUSTOMER_PROFILE', `Staff created client account for ${newCus.name} (${newCus.email})`);

    onUsersUpdated();
    setIsCreatingNew(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const handleToggleStatus = (user: User) => {
    const updatedStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, status: updatedStatus as any } : u));
    saveAllUsers(updatedUsers);
    logAudit(currentUser.id, currentUser.name, 'UPDATE_CUSTOMER_STATUS', `Updated ${user.name} status to ${updatedStatus}`);
    onUsersUpdated();
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...user, status: updatedStatus as any });
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Staff Client Management</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Customer Record Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, search, and update client records, portfolio balances, and account statuses.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-blue-200"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients by name, email, or account ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Customer Directory Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Account #</th>
                  <th className="py-3 px-4">Portfolio Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                {filteredCustomers.map((cus) => (
                  <tr
                    key={cus.id}
                    onClick={() => setSelectedUser(cus)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      selectedUser?.id === cus.id ? 'bg-blue-50/60 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">
                      {cus.name}
                      <span className="block text-[10px] text-slate-400 font-normal font-mono">{cus.email}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{cus.accountNumber}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">
                      {formatGBP(cus.portfolioValue || 0)}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          cus.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {cus.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(cus);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {cus.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Detail Side Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          {selectedUser ? (
            <>
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedUser.id} • {selectedUser.accountNumber}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                  {selectedUser.status}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Portfolio AUM:</span>
                  <span className="font-mono font-black text-emerald-600 text-sm">
                    {formatGBP(selectedUser.portfolioValue || 0)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{selectedUser.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Created on {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(selectedUser)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    selectedUser.status === 'ACTIVE'
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {selectedUser.status === 'ACTIVE' ? 'Suspend Client Account' : 'Reactivate Client Account'}
                </button>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-medium">Select a client profile from the directory to inspect details.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal Create Client */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 text-slate-900 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Register New Client Account</h3>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700">Client Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Michael Turner"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="michael@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+44 7700 900555"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Initial Portfolio Balance (£)</label>
                <input
                  type="number"
                  value={initialPortfolio}
                  onChange={(e) => setInitialPortfolio(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
