/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Customer } from '../types';
import { 
  Users, Search, PlusCircle, AlertCircle, Sparkles, Filter, 
  ChevronRight, Calendar, UserCheck, Mail, DollarSign, RefreshCw, X
} from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (firstName: string, lastName: string, email: string, cibilScore: number, monthlyIncome: number) => void;
}

export default function CustomersView({ customers, onAddCustomer }: CustomersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cibilFilter, setCibilFilter] = useState<'ALL' | 'EXCELLENT' | 'FAIR' | 'RISKY'>('ALL');
  
  // Slide Over / Modal state for adding a customer
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cibilScore: 750,
    monthlyIncome: 65000
  });

  const [formError, setFormError] = useState('');

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setFormError('Please enter valid First and Last names.');
      return;
    }
    
    if (!form.email.includes('@') || !form.email.includes('.')) {
      setFormError('Please provide a valid corporate email structure.');
      return;
    }

    if (form.cibilScore < 300 || form.cibilScore > 900) {
      setFormError('CIBIL rating must be between 300 and 900 metrics.');
      return;
    }

    if (form.monthlyIncome <= 0) {
      setFormError('Monthly compensation must be greater than zero.');
      return;
    }

    // Call state update
    onAddCustomer(
      form.firstName.trim(),
      form.lastName.trim(),
      form.email.trim(),
      Number(form.cibilScore),
      Number(form.monthlyIncome)
    );

    // Reset forms & exit panel
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      cibilScore: 720,
      monthlyIncome: 55000
    });
    setIsAddingCustomer(false);
  };

  // Filtering Logic
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (cibilFilter === 'ALL') return true;
    if (cibilFilter === 'EXCELLENT') return c.cibilScore >= 750;
    if (cibilFilter === 'FAIR') return c.cibilScore >= 650 && c.cibilScore < 750;
    if (cibilFilter === 'RISKY') return c.cibilScore < 650;

    return true;
  });

  return (
    <div className="space-y-6" id="customers-view">
      
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Enterprise Customer Registry
          </h2>
          <p className="text-xs text-slate-400">Configure financial profiles, verify corporate email domains, and evaluate index scores</p>
        </div>

        {/* Enroll Trigger */}
        <button
          onClick={() => {
            setFormError('');
            setIsAddingCustomer(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-md shadow-blue-500/10 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          id="enroll-customer-modal-trigger"
        >
          <PlusCircle className="h-4 w-4" />
          Enroll New Customer
        </button>
      </div>

      {/* FILTER SEARCH PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="customers-filter-panel">
        
        {/* Search input */}
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search customer records by name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-2xs"
            id="customer-search-input"
          />
        </div>

        {/* Filters Select */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs shadow-2xs">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mr-1 shrink-0">CIBIL Bracket:</span>
          <select
            value={cibilFilter}
            onChange={(e) => setCibilFilter(e.target.value as any)}
            className="w-full bg-transparent border-none text-slate-700 focus:outline-none font-semibold text-xs cursor-pointer"
            id="cibil-bucket-select"
          >
            <option value="ALL">Show All Ratings</option>
            <option value="EXCELLENT">Excellent (750+)</option>
            <option value="FAIR">Good / Fair (650–749)</option>
            <option value="RISKY">Critical / Risk (&lt;650)</option>
          </select>
        </div>

      </div>

      {/* REGISTRY DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm" id="customer-registry-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10.5px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                <th className="px-6 py-3.5 w-24">Profile ID</th>
                <th className="px-4 py-3.5">Customer / Borrower Profile</th>
                <th className="px-4 py-3.5">Corporate Domain</th>
                <th className="px-4 py-3.5 text-center">Credit Class</th>
                <th className="px-4 py-3.5 text-right">CIBIL Score</th>
                <th className="px-6 py-3.5 text-right">Assessed Monthly Compensation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                    No registered operational customer parameters match your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  let badge = { text: 'Critical / Poor', styles: 'bg-rose-50 text-rose-700 border-rose-200' };
                  if (c.cibilScore >= 750) {
                    badge = { text: 'Highly Elite', styles: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
                  } else if (c.cibilScore >= 700) {
                    badge = { text: 'Robust / Safe', styles: 'bg-emerald-50 text-emerald-700 border-emerald-250' };
                  } else if (c.cibilScore >= 650) {
                    badge = { text: 'Fair Limit', styles: 'bg-amber-50 text-amber-700 border-amber-200' };
                  }
                  
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors" id={`customer-row-${c.id}`}>
                      {/* ID */}
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-400 font-bold">
                        REG-0{c.id}
                      </td>
                      
                      {/* Customer info */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs border border-blue-100">
                            {c.firstName.charAt(0)}{c.lastName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-[13px] block">{c.firstName} {c.lastName}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">CUSTID-{c.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Corporate Email */}
                      <td className="px-4 py-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-350" />
                          <span className="text-slate-500 font-medium">{c.email}</span>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase border ${badge.styles}`}>
                          {badge.text}
                        </span>
                      </td>

                      {/* CIBIL */}
                      <td className="px-4 py-4 text-right">
                        <div className="font-mono text-slate-800 font-bold">
                          {c.cibilScore} / 900
                        </div>
                        {/* Custom progress slider mini */}
                        <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden ml-auto mt-1 flex">
                          <div 
                            style={{ width: `${(c.cibilScore / 900) * 100}%` }} 
                            className={`h-full ${c.cibilScore >= 700 ? 'bg-emerald-500' : c.cibilScore >= 650 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          ></div>
                        </div>
                      </td>

                      {/* Income */}
                      <td className="px-6 py-4 text-right font-mono font-bold text-[13px] text-slate-900">
                        ₹{c.monthlyIncome.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Registry metadata count */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 text-[10px] uppercase font-mono font-bold text-slate-400 flex items-center justify-between">
          <span>Active Registry Directory Capacity: 100% stable</span>
          <span>Catalog size: {filteredCustomers.length} records</span>
        </div>
      </div>

      {/* SLIDE OUT ENROLLMENT SHEET (MODIFIED IN CLIENT MODAL LAYOUT) */}
      {isAddingCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all animate-fade-in" id="customer-form-modal-overlay">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up" id="customer-form-modal">
            
            {/* Header banner */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white font-sans">Enroll New Client Profile</h3>
                  <p className="text-[10px] text-slate-400 font-sans">Generate active credit indexes instantly</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsAddingCustomer(false)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                id="close-customer-form-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Input Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Errors container */}
              {formError && (
                <div className="bg-rose-50 border border-rose-250 rounded-lg p-3 flex items-start gap-2 text-xs text-rose-800 font-sans">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                  <p>{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">First Name Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neil"
                    value={form.firstName}
                    onChange={(e) => setForm({...form, firstName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    id="modal-fn"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Last Name Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Armstrong"
                    value={form.lastName}
                    onChange={(e) => setForm({...form, lastName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    id="modal-ln"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Corporate Verification Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. n.armstrong@nasa.gov"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  id="modal-email"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-sans">We check this email domain during risk scoring sequences.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">CIBIL Score (Credit rating)</label>
                  <input
                    type="number"
                    min="300"
                    max="900"
                    required
                    value={form.cibilScore}
                    onChange={(e) => setForm({...form, cibilScore: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    id="modal-cibil"
                  />
                  <p className="text-[9.5px] text-slate-400 mt-1 font-sans">Strict bounds: 300 to 900 metrics</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Assessed Monthly revenue (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.monthlyIncome}
                    onChange={(e) => setForm({...form, monthlyIncome: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    id="modal-income"
                  />
                  <p className="text-[9.5px] text-slate-400 mt-1 font-sans">Gross corporate income</p>
                </div>
              </div>

              {/* Score classification dynamic helpers */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-2 text-[10.5px] text-slate-500 font-sans">
                <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-700 block mb-0.5">Automated Heurist Model Guideline:</strong>
                  Selecting a score &gt; 700 with income &gt; ₹30,000 matches our standard approvals matrix. Users below these markers will trigger an automated credit limit suspension risk warning.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingCustomer(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                  id="modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/10 transition-colors inline-flex items-center gap-1.5"
                  id="modal-save-btn"
                >
                  <UserCheck className="h-4 w-4" />
                  Save profile registry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
