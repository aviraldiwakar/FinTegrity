/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { Customer, Loan, Transaction, LogMessage } from './types';
import DashboardView from './components/DashboardView';
import CustomersView from './components/CustomersView';
import LoanOriginationView from './components/LoanOriginationView';
import EmiLedgerView from './components/EmiLedgerView';
import AuditConsole from './components/AuditConsole';

import { 
  Menu, X, Database, Compass, CheckCircle2, Shield,
  Users, CreditCard, Receipt, Terminal, Info, AlertCircle
} from 'lucide-react';

interface Toast {
  id: string;
  type: 'SUCCESS' | 'INFO' | 'WARN';
  message: string;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'customers' | 'loans' | 'emis' | 'logs'>('dashboard');
  
  // Custom Toasts Queue state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Simulation timeline offset state
  const [timeOffsetDays, setTimeOffsetDays] = useState(0);

  // --- SANDBOX DATABASE STATE ---
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, firstName: "Raksha", lastName: "Jain", email: "raksha@enterprise.com", cibilScore: 780, monthlyIncome: 85000 },
    { id: 2, firstName: "Aniket", lastName: "Sharma", email: "aniket@creditops.net", cibilScore: 610, monthlyIncome: 42000 },
    { id: 3, firstName: "Tulsidas", lastName: "Khan", email: "tulsi@fintech.org", cibilScore: 740, monthlyIncome: 25000 }
  ]);

  const [loans, setLoans] = useState<Loan[]>([
    { id: 101, customerId: 1, customerName: "Raksha Jain", loanAmount: 500000, emiAmount: 15277.78, tenureMonths: 36, loanStatus: 'APPROVED' }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 201, loanId: 101, customerName: "Raksha Jain", amount: 15277.78, dueDate: "2026-07-19", paymentDate: null, status: 'PENDING' },
    { id: 202, loanId: 101, customerName: "Raksha Jain", amount: 15277.78, dueDate: "2026-08-19", paymentDate: null, status: 'PENDING' },
    // Past due to demonstrate initial late flagging/re-risk matching
    { id: 203, loanId: 101, customerName: "Raksha Jain", amount: 15277.78, dueDate: "2026-05-15", paymentDate: null, status: 'PENDING' }
  ]);

  const [logs, setLogs] = useState<LogMessage[]>([
    { id: 'l1', timestamp: "03:40:11", service: 'PORTAL', type: 'INFO', message: "FinTegrity operations workspace successfully initialized on client." },
    { id: 'l2', timestamp: "03:40:12", service: 'LEDGER', type: 'SUCCESS', message: "Secure sandbox persistence active. Standard JSON state cache online." },
    { id: 'l3', timestamp: "03:40:12", service: 'RISK_ENGINE', type: 'INFO', message: "Heuristic classification service loaded. Ready to parse scoring bounds." },
    { id: 'l4', timestamp: "03:40:12", service: 'SCHEDULER', type: 'INFO', message: "Chronometer chron engine active. Daily bills scanner initialized of midnight." }
  ]);

  // --- CORE CONSOLE UTILITIES ---
  const addLog = (service: LogMessage['service'], type: LogMessage['type'], message: string) => {
    const now = new Date();
    now.setDate(now.getDate() + timeOffsetDays);
    const timestamp = now.toTimeString().split(' ')[0] + ` (Day +${timeOffsetDays})`;
    
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      timestamp,
      service,
      type,
      message
    }]);
  };

  const showToast = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto clear Toast in 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const getCurrentSimulatedDateString = () => {
    const today = new Date();
    today.setDate(today.getDate() + timeOffsetDays);
    return today.toISOString().split('T')[0];
  };

  // --- ACTIONS HANDLERS ---

  // 1. Enrolling new customer callback
  const handleAddCustomer = (firstName: string, lastName: string, email: string, cibilScore: number, monthlyIncome: number) => {
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const newCustomer: Customer = {
      id: newId,
      firstName,
      lastName,
      email,
      cibilScore,
      monthlyIncome
    };

    setCustomers(prev => [...prev, newCustomer]);
    
    addLog('PORTAL', 'INFO', `Registering consumer parameters: ${firstName} ${lastName}`);
    addLog('LEDGER', 'SUCCESS', `Committed memory block REG-0${newId} to master state segment.`);
    
    showToast('SUCCESS', `Successfully enrolled client profile for ${firstName} ${lastName}!`);
  };

  // 2. Originate Credit Loan structure & compute its individual EMIs schedule
  const handleOriginateLoan = (customerId: number, loanAmount: number, tenureMonths: number, outcome: 'APPROVED' | 'REJECTED') => {
    const customer = customers.find(c => c.id === Number(customerId));
    if (!customer) return;

    const newLoanId = loans.length > 0 ? Math.max(...loans.map(l => l.id)) + 1 : 101;
    
    // Amortize rates computation flat 10.5% per annum
    const interestFlat = 0.105;
    const totalInterest = loanAmount * (interestFlat * (tenureMonths / 12));
    const totalRepay = loanAmount + totalInterest;
    const emi = Number((totalRepay / tenureMonths).toFixed(2));

    const newLoan: Loan = {
      id: newLoanId,
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      loanAmount,
      emiAmount: emi,
      tenureMonths,
      loanStatus: outcome
    };

    setLoans(prev => [...prev, newLoan]);
    addLog('LEDGER', 'SUCCESS', `Logged loan portfolio entry #${newLoanId} for ${newLoan.customerName}`);

    if (outcome === 'APPROVED') {
      addLog('PORTAL', 'INFO', `Generating monthly repayment schedule indices representing ${tenureMonths} monthly terms...`);
      const generatedTransactions: Transaction[] = [];
      const simulatedStartDate = new Date();
      simulatedStartDate.setDate(simulatedStartDate.getDate() + timeOffsetDays);

      for (let i = 1; i <= tenureMonths; i++) {
        const dueDate = new Date(simulatedStartDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        
        const txId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + i : 201 + i;
        const tx: Transaction = {
          id: txId,
          loanId: newLoanId,
          customerName: newLoan.customerName,
          amount: emi,
          dueDate: dueDate.toISOString().split('T')[0],
          paymentDate: null,
          status: 'PENDING'
        };
        generatedTransactions.push(tx);
        addLog('LEDGER', 'SUCCESS', `Committed installment reference invoice #${txId} (Due: ${tx.dueDate}) for ₹${emi}`);
      }

      setTransactions(prev => [...prev, ...generatedTransactions]);
      showToast('SUCCESS', `Originated facility #${newLoanId} for ${newLoan.customerName}. Generated ${tenureMonths} EMIs repayment schedule!`);
    } else {
      addLog('RISK_ENGINE', 'WARN', `Target risk criteria metrics for borrower REG-0${customer.id} failed standards index. Application declined.`);
      showToast('WARN', `Loan application rejected based on insufficient scoring matrix.`);
    }
  };

  // 3. Instalment pay handler
  const handlePayTransaction = (txId: number) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    const paymentDayString = getCurrentSimulatedDateString();

    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return {
          ...t,
          status: 'PAID',
          paymentDate: paymentDayString
        };
      }
      return t;
    }));

    addLog('PORTAL', 'INFO', `Recording installment payment deposit on Invoice reference INV-0${txId}...`);
    addLog('LEDGER', 'SUCCESS', `Wrote payment settlement index on master ledger. Asset cleared timestamp set to: ${paymentDayString}`);
    showToast('SUCCESS', `Cleared installment reference #${txId} of value ₹${tx.amount.toLocaleString('en-IN')}!`);
  };

  // 4. Overdue scanner chronic sweeps
  const handleTriggerScheduler = () => {
    addLog('SCHEDULER', 'INFO', `Executing chronological sweep relative to timeline date: ${getCurrentSimulatedDateString()}`);
    
    const today = new Date();
    today.setDate(today.getDate() + timeOffsetDays);

    let lateCount = 0;
    const updatedTransactions = transactions.map(t => {
      const txDueDate = new Date(t.dueDate);
      if (t.status === 'PENDING' && txDueDate < today) {
        lateCount++;
        addLog('SCHEDULER', 'WARN', `OVERDUE EXPOSURE ID INV-0${t.id}: Past due deadline of: ${t.dueDate}. Shifting state to LATE.`);
        addLog('LEDGER', 'SUCCESS', `Altered ledger block status index on block INV-0${t.id} to LATE.`);
        return {
          ...t,
          status: 'LATE' as const
        };
      }
      return t;
    });

    if (lateCount > 0) {
      setTransactions(updatedTransactions);
      showToast('WARN', `Found and updated ${lateCount} overdue account liabilities variables!`);
    } else {
      addLog('SCHEDULER', 'INFO', `Calendar sweeps resolved clean. Overdue indices match expected limits.`);
      showToast('INFO', `Systems scan finished: No late installment records detected.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans" id="app-root">
      
      {/* MOBILE NAVBAR BANNER */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-850 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-base shadow-sm">F</div>
          <span className="text-base font-bold tracking-tight">FinTegrity</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-350"
          aria-label="Toggle Menu"
          id="mobile-menu-trigger"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* COHESIVE SIDEBAR NAVIGATION */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:flex shrink-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `} id="navigation-sidebar">
        
        {/* Brand identity header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 text-lg tracking-wider">
            F
          </div>
          <div>
            <span className="text-lg font-extrabold text-white tracking-tight">FinTegrity</span>
            <span className="block text-[9.5px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">Enterprise Credit</span>
          </div>
        </div>

        {/* Dynamic navigation choices */}
        <nav className="flex-1 px-4 py-6 space-y-5 overflow-y-auto">
          
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-3">
              Operations Hub
            </div>
            
            {/* 1. Dashboard click */}
            <button
              onClick={() => {
                setActiveView('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'hover:bg-slate-800 mb-0.5 text-slate-400 hover:text-slate-200'
              }`}
              id="sidebar-nav-dashboard"
            >
              <Compass className="h-4 w-4 shrink-0" />
              Dynamic Dashboard
            </button>

            {/* 2. Customer Directory */}
            <button
              onClick={() => {
                setActiveView('customers');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'customers'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'hover:bg-slate-800 mb-0.5 text-slate-400 hover:text-slate-200'
              }`}
              id="sidebar-nav-customers"
            >
              <Users className="h-4 w-4 shrink-0" />
              Customer Registry
            </button>

            {/* 3. Loan Origination & predict checks */}
            <button
              onClick={() => {
                setActiveView('loans');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'loans'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'hover:bg-slate-800 mb-0.5 text-slate-400 hover:text-slate-200'
              }`}
              id="sidebar-nav-origination"
            >
              <CreditCard className="h-4 w-4 shrink-0" />
              AI Predictor Sandbox
            </button>

            {/* 4. Repayment Ledger EMIs */}
            <button
              onClick={() => {
                setActiveView('emis');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'emis'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'hover:bg-slate-800 mb-0.5 text-slate-400 hover:text-slate-200'
              }`}
              id="sidebar-nav-emis"
            >
              <Receipt className="h-4 w-4 shrink-0" />
              Amortization Ledger
            </button>

            {/* 5. Systems telemetry logs */}
            <button
              onClick={() => {
                setActiveView('logs');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'logs'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'hover:bg-slate-800 mb-0.5 text-slate-400 hover:text-slate-200'
              }`}
              id="sidebar-nav-logs"
            >
              <Terminal className="h-4 w-4 shrink-0" />
              Audit Console Logs
            </button>
          </div>

          {/* SYSTEM CALENDAR OVERVIEW STATIC FOR CONTEXT */}
          <div className="border-t border-slate-800/60 pt-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3.5 px-3">
              Sandbox Status
            </div>
            <div className="px-3 space-y-2.5 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-55 bg-emerald-500 animate-pulse"></div>
                <span className="text-slate-300">Sandbox: 100% Client Only</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-slate-300">Cache state: Volatile</span>
              </div>
            </div>
          </div>

        </nav>

        {/* SIDEBAR MONITOR FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 mb-1 text-slate-300">
            <Shield className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider">Enterprise Sandbox</span>
          </div>
          <div className="text-[10px] text-slate-500 leading-normal font-sans">
            Professor review deck enabled. Zero backend network routing operations involved.
          </div>
        </div>
      </aside>

      {/* VIEW WRAPPER CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-x-hidden min-h-0" id="main-content-layout">
        
        {/* UPPER TITLE BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between shrink-0 shadow-xs z-10" id="main-header">
          <div>
            <h1 className="text-sm font-bold text-slate-705 tracking-wide uppercase font-display">
              FinTegrity &bull; Enterprise Loan Management System
            </h1>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5" id="header-status-indicator">
              Sandbox Timeline: <span className="text-blue-600 font-bold">{getCurrentSimulatedDateString()}</span> | Channel Operational
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 font-mono shadow-3xs">
              <Database className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 font-bold tracking-wider">Client database active</span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs border border-white shadow shadow-blue-500/10">
              PR
            </div>
          </div>
        </header>

        {/* CENTRAL DISPLAY WINDOW */}
        <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto" id="view-layer">
          
          {/* TOAST NOTIFICATION STACK */}
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full" id="toast-wrapper">
            {toasts.map((toast) => {
              const borderColors = {
                SUCCESS: 'border-emerald-500 bg-white text-slate-800 shadow-emerald-100',
                WARN: 'border-amber-500 bg-white text-slate-800 shadow-amber-100',
                INFO: 'border-blue-500 bg-white text-slate-800 shadow-blue-100'
              };
              
              const icons = {
                SUCCESS: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
                WARN: <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />,
                INFO: <Info className="h-5 w-5 text-blue-600 shrink-0" />
              };

              return (
                <div 
                  key={toast.id} 
                  className={`p-3.5 border-l-4 rounded-xl shadow-lg border flex items-start gap-2.5 pointer-events-auto animate-slide-in ${borderColors[toast.type]}`}
                  id={`toast-msg-${toast.id}`}
                >
                  {icons[toast.type]}
                  <p className="text-xs font-semibold leading-normal font-sans pr-2">
                    {toast.message}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="animate-fade-in">
            {/* View Switching Decision Logic */}
            {activeView === 'dashboard' && (
              <DashboardView 
                customers={customers} 
                loans={loans} 
                transactions={transactions} 
                onNavigate={(v) => setActiveView(v)}
              />
            )}

            {activeView === 'customers' && (
              <CustomersView 
                customers={customers} 
                onAddCustomer={handleAddCustomer} 
              />
            )}

            {activeView === 'loans' && (
              <LoanOriginationView 
                customers={customers} 
                loans={loans} 
                onOriginateLoan={handleOriginateLoan} 
              />
            )}

            {activeView === 'emis' && (
              <EmiLedgerView 
                transactions={transactions} 
                timeOffsetDays={timeOffsetDays} 
                onPayTransaction={handlePayTransaction}
                onSetTimeOffset={(offset) => {
                  setTimeOffsetDays(offset);
                  addLog('SCHEDULER', 'INFO', `Adjusted calendar reference date offsets parameter. Date is now: ${getCurrentSimulatedDateString()}`);
                }}
                onTriggerScheduler={handleTriggerScheduler}
              />
            )}

            {activeView === 'logs' && (
              <AuditConsole 
                logs={logs} 
                onClearLogs={() => setLogs([])} 
              />
            )}
          </div>

        </div>

        {/* BOTTOM GLOBAL STATUS BAR */}
        <footer className="h-10 bg-slate-100 border-t border-slate-200 px-6 flex items-center justify-between shrink-0 text-[10px] text-slate-500 font-mono font-bold" id="main-footer">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              PORTFOLIO: Active
            </span>
            <span className="hidden sm:inline-flex items-center gap-1/2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              CLASSIFIER: READY
            </span>
          </div>
          <div>
            Prototype Build: <span className="text-slate-600 uppercase">Interactive Pure-Frontend</span> &bull; Rev 35
          </div>
        </footer>

      </main>

    </div>
  );
}
