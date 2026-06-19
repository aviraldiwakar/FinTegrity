/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Customer, Loan, Transaction } from '../types';
import { 
  TrendingUp, Users, ShieldAlert, Sparkles, AlertCircle, DollarSign, ArrowUpRight, 
  CheckCircle2, AlertTriangle, FileText, Activity
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  customers: Customer[];
  loans: Loan[];
  transactions: Transaction[];
  onNavigate: (view: 'dashboard' | 'customers' | 'loans' | 'emis' | 'logs') => void;
}

export default function DashboardView({ customers, loans, transactions, onNavigate }: DashboardViewProps) {
  // Calculations
  const approvedLoans = loans.filter(l => l.loanStatus === 'APPROVED');
  const rejectedLoans = loans.filter(l => l.loanStatus === 'REJECTED');
  
  const totalValueApproved = approvedLoans.reduce((sum, l) => sum + l.loanAmount, 0);
  const activeBorrowersCount = new Set(approvedLoans.map(l => l.customerId)).size;
  
  const lateTx = transactions.filter(t => t.status === 'LATE');
  const paidTx = transactions.filter(t => t.status === 'PAID');
  const pendingTx = transactions.filter(t => t.status === 'PENDING');
  
  const lateEmiCount = lateTx.length;
  const lateEmiSum = lateTx.reduce((sum, t) => sum + t.amount, 0);
  
  const totalPaidSum = paidTx.reduce((sum, t) => sum + t.amount, 0);
  const totalPendingSum = pendingTx.reduce((sum, t) => sum + t.amount, 0);
  
  const totalEmisCount = transactions.length;
  const healthRatio = totalEmisCount > 0 
    ? Math.round(((paidTx.length + pendingTx.length) / totalEmisCount) * 100) 
    : 100;

  const decisionRatio = loans.length > 0
    ? Math.round((approvedLoans.length / loans.length) * 100)
    : 100;

  return (
    <div className="space-y-6" id="dashboard-view">
      
      {/* METRIC BADGE STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="stats-grid">
        
        {/* Disbursed portfolio value */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="absolute -right-3 -bottom-3 p-1 text-blue-50 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-28 w-28 text-blue-600" />
          </div>
          <div className="relative z-10" id="stat-card-portfolio">
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-bold tracking-wider uppercase">
              Capital Disbursed
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-slate-900 tracking-tight">
                ₹{totalValueApproved.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Across <span className="font-semibold text-slate-700">{approvedLoans.length} active approvals</span>
            </p>
          </div>
        </div>

        {/* Active borrowers count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="absolute -right-3 -bottom-3 p-1 text-indigo-50 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="h-28 w-28 text-indigo-600" />
          </div>
          <div className="relative z-10" id="stat-card-borrowers">
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded font-bold tracking-wider uppercase">
              Active Borrowers
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-slate-900 tracking-tight">
                {activeBorrowersCount}
              </span>
              <span className="text-xs text-slate-500 font-sans">profiles</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Total registered: <span className="font-semibold text-slate-700">{customers.length} users</span>
            </p>
          </div>
        </div>

        {/* Portfolio health ratio */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="absolute -right-3 -bottom-3 p-1 text-emerald-50 opacity-10 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="h-28 w-28 text-emerald-600" />
          </div>
          <div className="relative z-10" id="stat-card-health">
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold tracking-wider uppercase">
              Portfolio Health
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-emerald-600 tracking-tight">
                {healthRatio}%
              </span>
              <span className="text-[10px] bg-emerald-100/70 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Perfect
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Interest settled: <span className="font-semibold text-slate-700">₹{totalPaidSum.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>

        {/* Overdue late amount */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-red-300 transition-all">
          <div className="absolute -right-3 -bottom-3 p-1 text-red-50 opacity-10 group-hover:scale-110 transition-transform">
            <ShieldAlert className="h-28 w-28 text-rose-600" />
          </div>
          <div className="relative z-10" id="stat-card-late">
            <span className="text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold tracking-wider uppercase">
              Late / Overdue EMIs
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`${lateEmiCount > 0 ? 'text-rose-600' : 'text-slate-900'} text-2xl font-bold font-display tracking-tight`}>
                ₹{lateEmiSum.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Affecting <span className="font-semibold text-rose-700 font-mono">{lateEmiCount} pending payments</span>
            </p>
          </div>
        </div>

      </div>

      {/* CHARTS & HEALTH DETAILS SPLIT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-panel">
        
        {/* GRAPH PANEL (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between" id="repayment-chart-box">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-600" />
                Capital Allocation & Amortization Projections
              </h3>
              <p className="text-[11px] text-slate-400">Monthly schedule representation of settled vs forecasted interest dues</p>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span>
                <span>Settled (₹)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded"></span>
                <span>Forecasted (₹)</span>
              </span>
            </div>
          </div>

          {/* SVG Micro Chart */}
          <div className="h-56 w-full flex items-end justify-between relative px-2 py-4 border-b border-dashed border-slate-100" id="svg-analytics-plot">
            {/* Background grids */}
            <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-t border-slate-100 w-full text-[9px] text-slate-300 font-mono pt-0.5">₹1.5L Max Limit</div>
              <div className="border-t border-dashed border-slate-100 w-full text-[9px] text-slate-300 font-mono pt-0.5">₹1.0L Mid Bounds</div>
              <div className="border-t border-slate-100 w-full text-[9px] text-slate-300 font-mono pt-0.5">₹50K Baseline</div>
              <div className="border-t border-slate-250 w-full"></div>
            </div>

            {/* Simulated bars representing the 6 upcoming payment periods */}
            <div className="relative z-10 w-full flex items-end justify-around h-full pt-10">
              {[
                { label: 'Jul 26', paid: totalPaidSum > 0 ? totalPaidSum * 0.4 : 12000, pending: totalPendingSum * 0.2 + 8000 },
                { label: 'Aug 26', paid: totalPaidSum > 0 ? totalPaidSum * 0.3 : 15000, pending: totalPendingSum * 0.3 + 12000 },
                { label: 'Sep 26', paid: totalPaidSum > 0 ? totalPaidSum * 0.2 : 0, pending: totalPendingSum * 0.1 || 24000 },
                { label: 'Oct 26', paid: 0, pending: totalPendingSum * 0.1 || 20000 },
                { label: 'Nov 26', paid: 0, pending: totalPendingSum * 0.1 || 18000 },
                { label: 'Dec 26', paid: 0, pending: totalPendingSum * 0.15 || 22000 },
              ].map((bucket, i) => {
                const total = bucket.paid + bucket.pending;
                const paidHeight = (bucket.paid / 150000) * 100;
                const pendHeight = (bucket.pending / 150000) * 100;
                
                return (
                  <div key={i} className="flex flex-col items-center gap-2 group w-12" id={`bar-group-${i}`}>
                    <div className="w-8 flex flex-col justify-end bg-slate-50 border border-slate-200 rounded-md overflow-hidden min-h-[4px] h-32 relative shadow-2xs group-hover:border-blue-300 transition-all">
                      {/* Interactive hover tooltips */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col bg-slate-900 text-white p-1.5 rounded text-[9px] font-mono font-medium z-30 whitespace-nowrap shadow-md">
                        <span className="text-emerald-400">Paid: ₹{bucket.paid.toLocaleString('en-IN')}</span>
                        <span className="text-blue-400">Due: ₹{bucket.pending.toLocaleString('en-IN')}</span>
                        <span className="border-t border-slate-700 mt-1 pt-0.5 text-[10px] font-bold text-slate-200">Total: ₹{total.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Forecasted stack */}
                      <div 
                        style={{ height: `${Math.max(4, pendHeight)}%` }} 
                        className="w-full bg-blue-500/90 group-hover:bg-blue-600 transition-colors"
                      ></div>
                      {/* Paid stack */}
                      <div 
                        style={{ height: `${Math.max(0, paidHeight)}%` }} 
                        className="w-full bg-emerald-500/90 group-hover:bg-emerald-600 transition-colors border-t border-emerald-400/20"
                      ></div>
                    </div>
                    
                    <span className="text-[10px] font-mono font-bold text-slate-500">{bucket.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Dynamic financial vectors sync directly to standard local storage state.
            </span>
            <button 
              onClick={() => onNavigate('loans')}
              className="mt-2 sm:mt-0 text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5 shrink-0"
              id="dash-quick-apply-btn"
            >
              Originate New Credit Facility
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* DECISION ANALYSIS CARD (Span 1) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between" id="ai-engine-overview-box">
          
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">FinTegrity AI Classifier</h3>
                <p className="text-[10px] text-slate-400">Heuristics-driven portfolio suitability metrics</p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Approval rate circular mockup */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Approval Suitability Rate</span>
                  <div className="text-xl font-extrabold text-blue-700 tracking-tight mt-1 font-display">
                    {decisionRatio}% APPROVED
                  </div>
                </div>
                <div className="w-11 h-11 rounded-full border-4 border-blue-105 border-t-blue-600 flex items-center justify-center font-mono font-bold text-xs text-blue-700 bg-white shadow-2xs">
                  {decisionRatio}%
                </div>
              </div>

              {/* Dynamic statistics */}
              <div className="space-y-2 text-xs text-slate-600 font-sans">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Total Evaluated Applications:</span>
                  <span className="font-mono font-bold text-slate-800">{loans.length}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Approved Decisions:</span>
                  <span className="font-mono font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    {approvedLoans.length}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Rejected Decisions:</span>
                  <span className="font-mono font-bold text-rose-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                    {rejectedLoans.length}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick System Diagnostics */}
          <div className="mt-5 pt-4 border-t border-slate-100" id="ai-health-diagnostics">
            {lateEmiCount > 0 ? (
              <div className="bg-amber-50/70 border border-amber-200 text-amber-800 rounded-lg p-2.5 flex items-start gap-2 text-[10.5px]">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-normal font-sans">
                  <strong className="font-bold">Overdue risk detected!</strong> {lateEmiCount} invoice records match overdue flags. We advise executing the <span className="underline cursor-pointer font-bold" onClick={() => onNavigate('emis')}>Timeline Sweep</span> to recalculate late accounts.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-250 text-emerald-800 rounded-lg p-2.5 flex items-start gap-2 text-[10.5px]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-normal font-sans">
                  <strong className="font-bold">Perfect Credit Health!</strong> Currently 105% of active payments settled. Portfolio credit exposure is nominal.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* COMPACT RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="dashboard-recent-activity">
        
        {/* RECENT REPAYMENTS TAB TABLE (Span 2) */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="latest-emi-records">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Recent Installment Payments</h3>
              <p className="text-[10px] text-slate-400">Recent statement ledger transactions overview</p>
            </div>
            
            <button 
              onClick={() => onNavigate('emis')} 
              className="text-xs text-blue-600 hover:underline font-bold"
              id="dash-view-ledger-link"
            >
              See Master Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase font-mono font-semibold text-slate-400">
                  <th className="px-4 py-2.5">Invoice Ref</th>
                  <th className="px-4 py-2.5">Borrower Client</th>
                  <th className="px-4 py-2.5 text-right">Installment Amt</th>
                  <th className="px-4 py-2.5">Due Deadline</th>
                  <th className="px-6 py-2.5 text-right">Status State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 4).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">#{t.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{t.customerName}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{t.dueDate}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold ${
                        t.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        t.status === 'LATE' ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT DECISIONS (Span 1) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col" id="recent-decisions-feed">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recent AI Credit Evaluations</h3>
            <p className="text-[10px] text-slate-400">Live feed of processed loan limits</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-56">
            {loans.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-sans" id="no-decisions-fallback">
                No credit applications found. Go to credit workspace to process.
              </div>
            ) : (
              loans.slice(-4).reverse().map((l) => (
                <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between" id={`decision-badge-${l.id}`}>
                  <div className="min-w-0" id="decision-inner-meta">
                    <span className="text-[10px] font-mono text-slate-400">Ref App #{l.id}</span>
                    <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">{l.customerName}</h4>
                    <p className="text-[11px] font-mono font-medium text-slate-500 mt-0.5">₹{l.loanAmount.toLocaleString('en-IN')} for {l.tenureMonths} Mo</p>
                  </div>
                  
                  <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase shrink-0 ${
                    l.loanStatus === 'APPROVED' ? 'bg-emerald-55 text-emerald-700 border border-emerald-200' :
                    l.loanStatus === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {l.loanStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
