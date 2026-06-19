/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  Receipt, Search, Calendar, ChevronRight, HelpCircle, CheckCircle, 
  ArrowRight, AlertTriangle, Filter, ClipboardList, Database, DollarSign, Play
} from 'lucide-react';

interface EmiLedgerViewProps {
  transactions: Transaction[];
  timeOffsetDays: number;
  onPayTransaction: (txId: number) => void;
  onSetTimeOffset: (offset: number) => void;
  onTriggerScheduler: () => void;
}

export default function EmiLedgerView({ 
  transactions, 
  timeOffsetDays, 
  onPayTransaction, 
  onSetTimeOffset, 
  onTriggerScheduler 
}: EmiLedgerViewProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'LATE'>('ALL');

  // Compute active working date
  const getCurrentSimulatedDateString = () => {
    const today = new Date();
    today.setDate(today.getDate() + timeOffsetDays);
    return today.toISOString().split('T')[0];
  };

  // Calculations
  const lateTx = transactions.filter(t => t.status === 'LATE');
  const paidTx = transactions.filter(t => t.status === 'PAID');
  const pendingTx = transactions.filter(t => t.status === 'PENDING');

  const totalPaidSum = paidTx.reduce((sum, t) => sum + t.amount, 0);
  const totalPendingSum = pendingTx.reduce((sum, t) => sum + t.amount, 0);
  const totalLateSum = lateTx.reduce((sum, t) => sum + t.amount, 0);

  // Filtered array logic
  const filteredTx = transactions.filter(t => {
    const matchesSearch = t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.toString().includes(searchTerm);
    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
  });

  return (
    <div className="space-y-6" id="emi-ledger-view">
      
      {/* TIMELINE SIMULATOR WIDGET CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-5 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-lg">
        <div>
          <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold tracking-widest uppercase flex items-center gap-1.5 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Chronometer Simulator
          </span>
          <h2 className="text-base font-bold font-sans mt-2">
            Working Calendar Date: <span className="text-blue-400 font-mono font-bold ml-1">{getCurrentSimulatedDateString()}</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Fast-forward time below to test and demonstrate automated late-repayment anomaly warnings.
          </p>
        </div>

        {/* Time Control Options */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSetTimeOffset(0)}
            disabled={timeOffsetDays === 0}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-705 text-xs text-slate-300 font-bold border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            id="ledger-reset-calendar-btn"
          >
            Reset Timeline
          </button>
          
          <button
            onClick={() => onSetTimeOffset(timeOffsetDays + 15)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold border border-slate-700 font-mono transition-colors"
            id="ledger-add-15-btn"
          >
            +15 Days
          </button>

          <button
            onClick={() => onSetTimeOffset(timeOffsetDays + 35)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold border border-slate-700 font-mono transition-colors"
            id="ledger-add-35-btn"
          >
            +35 Days
          </button>

          <button
            onClick={onTriggerScheduler}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs text-white font-bold transition-colors inline-flex items-center gap-1.5"
            id="ledger-run-sweep-btn"
          >
            <Play className="h-3 w-3 fill-white" />
            Sweep Deadlines
          </button>
        </div>
      </div>

      {/* METRIC SUMMARIES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="ledger-stats">
        
        {/* Paid box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Capital Settled</span>
            <span className="text-lg font-bold font-display text-emerald-600 block mt-1">₹{totalPaidSum.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{paidTx.length} invoices cleared</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Scheduled upcoming</span>
            <span className="text-lg font-bold font-display text-blue-600 block mt-1">₹{totalPendingSum.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{pendingTx.length} terms pending</span>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 shrink-0">
            <Receipt className="h-5 w-5" />
          </div>
        </div>

        {/* Late outstanding box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Overdue liabilities</span>
            <span className="text-lg font-bold font-display text-rose-600 block mt-1">₹{totalLateSum.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-rose-400 block mt-0.5">{lateTx.length} overdue penalties</span>
          </div>
          <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* FILTER SEARCH PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4" id="ledger-controls">
        
        {/* Search bar */}
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search invoice transactions by borrower name or reference number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            id="ledger-search-input"
          />
        </div>

        {/* Filter Tab options (Col span 6) */}
        <div className="md:col-span-6 bg-slate-100 border border-slate-200 p-1 rounded-xl flex items-center justify-around shadow-2xs" id="ledger-tab-buttons">
          {[
            { id: 'ALL', label: 'All EMIs', count: transactions.length },
            { id: 'PENDING', label: 'Scheduled', count: pendingTx.length },
            { id: 'PAID', label: 'Paid', count: paidTx.length },
            { id: 'LATE', label: 'Late', count: lateTx.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`flex-1 py-1.5 rounded-lg text-[10.5px] font-bold text-center transition-all ${
                statusFilter === tab.id 
                  ? 'bg-white text-slate-800 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id={`ledger-tab-btn-${tab.id}`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

      </div>

      {/* TRANSACTION MASTER DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm" id="ledger-table-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10.5px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                <th className="px-6 py-3.5 w-24">Invoice Ref</th>
                <th className="px-4 py-3.5">Borrower Client</th>
                <th className="px-4 py-3.5 text-right">Installment Rate</th>
                <th className="px-4 py-3.5">Due Deadline</th>
                <th className="px-4 py-3.5">Deposit Recorded On</th>
                <th className="px-4 py-3.5">Overdue Rating</th>
                <th className="px-6 py-3.5 text-right w-36">Manual Settle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                    No transactions found in this state. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                filteredTx.map((t) => {
                  const isLate = t.status === 'LATE';
                  const isPaid = t.status === 'PAID';
                  
                  return (
                    <tr 
                      key={t.id} 
                      className={`transition-colors hover:bg-slate-50/50 ${
                        isLate ? 'bg-rose-50/40 hover:bg-rose-50/60' : ''
                      }`}
                      id={`ledger-row-${t.id}`}
                    >
                      {/* ID */}
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-400 font-bold">
                        INV-0{t.id}
                      </td>

                      {/* Borrower Name */}
                      <td className="px-4 py-4 font-bold text-slate-800 text-[12.5px]">
                        {t.customerName}
                      </td>

                      {/* EMI rate */}
                      <td className="px-4 py-4 text-right font-mono font-bold text-slate-900">
                        ₹{t.amount.toLocaleString('en-IN')}
                      </td>

                      {/* Due date */}
                      <td className="px-4 py-4 font-mono text-slate-500 text-[11px]">
                        {t.dueDate}
                      </td>

                      {/* Payment timestamp */}
                      <td className="px-4 py-4 font-mono text-emerald-600 font-medium text-[11px]">
                        {t.paymentDate ? (
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            {t.paymentDate}
                          </div>
                        ) : (
                          <span className="text-slate-350">—</span>
                        )}
                      </td>

                      {/* Overdue Status indicator */}
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold border uppercase ${
                          isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          isLate ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {t.status}
                        </span>
                      </td>

                      {/* Actions Manual Pay trigger */}
                      <td className="px-6 py-4 text-right">
                        {!isPaid ? (
                          <button
                            onClick={() => onPayTransaction(t.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all"
                            id={`pay-btn-${t.id}`}
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-emerald-650 text-[10px] font-bold inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Settled
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Registry statistics metrics footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[10.5px] text-slate-500 font-mono font-medium">
          <span>Active timeline offset: Day +{timeOffsetDays}</span>
          <span className="hidden sm:block">Total logged invoices: {transactions.length} receipts</span>
        </div>

      </div>

    </div>
  );
}
