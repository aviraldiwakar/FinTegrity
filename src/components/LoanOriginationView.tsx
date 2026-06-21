/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Customer, Loan } from '../types';
import { 
  CreditCard, Sparkles, CheckCircle2, XCircle, ChevronRight,
  RefreshCw, TrendingUp, Info, ArrowRight, Search
} from 'lucide-react';

interface LoanOriginationViewProps {
  customers: Customer[];
  loans: Loan[];
  onOriginateLoan: (customerId: number, loanAmount: number, tenureMonths: number, outcome: 'APPROVED' | 'REJECTED') => void;
}

export default function LoanOriginationView({ customers, loans, onOriginateLoan }: LoanOriginationViewProps) {
  // Input fields
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 1);
  const [loanAmount, setLoanAmount] = useState(250000);
  const [tenureMonths, setTenureMonths] = useState(12);

  // Search filter state
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || customer.email.toLowerCase().includes(searchLower);
  });

  // AI Evaluation execution states
  const [evaluationStage, setEvaluationStage] = useState<'IDLE' | 'ANALYZING' | 'DONE'>('IDLE');
  const [fakeMilestoneIndex, setFakeMilestoneIndex] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<{
    status: 'APPROVED' | 'REJECTED';
    cibil: number;
    income: number;
    confidence: number;
    loanId: number;
  } | null>(null);

  // Get active customer statistics
  const activeCustomer = customers.find(c => c.id === Number(selectedCustomerId));

  // Compute live loan parameters
  const interestRateFlat = 0.105; // 10.5% flat per annum
  const totalInterest = loanAmount * (interestRateFlat * (tenureMonths / 12));
  const totalRepayment = loanAmount + totalInterest;
  const monthlyEmi = Number((totalRepayment / tenureMonths).toFixed(2));

  // Milestones sequence for risk analytics simulator
  const milestones = [
    "VEC-201: Initiating risk audit handshake protocols...",
    "VEC-202: Retrieving authenticated credit rating (CIBIL score)...",
    "VEC-203: Analyzing gross income liquid threshold indicators...",
    "VEC-204: Testing debt-to-income margin ratios (DTI guidelines)...",
    "VEC-205: Mapping vector weights against historical master ledgers...",
    "VEC-206: Resolving classification metrics decision trees..."
  ];

  // Milestone cycle runner inside evaluation sequence
  useEffect(() => {
    let interval: any;
    if (evaluationStage === 'ANALYZING') {
      interval = setInterval(() => {
        setFakeMilestoneIndex((prev: number) => {
          if (prev >= milestones.length - 1) {
            clearInterval(interval);
            // Complete analysis
            setTimeout(() => {
              const score = activeCustomer ? activeCustomer.cibilScore : 750;
              const income = activeCustomer ? activeCustomer.monthlyIncome : 45000;
              
              const isApproved = score >= 700 && income >= 30000;
              const decision: 'APPROVED' | 'REJECTED' = isApproved ? 'APPROVED' : 'REJECTED';
              
              // Calc automated heuristic confidence score
              const baseFactor = isApproved ? 0.72 : 0.45;
              const weightCibil = (score - 300) / 600 * 0.15;
              const weightIncome = Math.min(0.12, (income / 150000) * 0.12);
              const confidence = Number(((baseFactor + weightCibil + weightIncome) * 100).toFixed(1));

              const mockId = loans.length > 0 ? Math.max(...loans.map(l => l.id)) + 1 : 101;

              setEvaluationResult({
                status: decision,
                cibil: score,
                income,
                confidence,
                loanId: mockId
              });
              setEvaluationStage('DONE');
            }, 500);
            return prev;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [evaluationStage, activeCustomer]);

  // Handle "Analyze loan metrics with risk model"
  const handleTriggerEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) {
      alert("Please enroll a borrower customer profile first in Customers Directory.");
      return;
    }
    setFakeMilestoneIndex(0);
    setEvaluationResult(null);
    setEvaluationStage('ANALYZING');
  };

  // Commit dynamic loan assets
  const handleCommitLoan = () => {
    if (!evaluationResult || !activeCustomer) return;
    onOriginateLoan(
      activeCustomer.id,
      loanAmount,
      tenureMonths,
      evaluationResult.status
    );
    // Reset back
    setEvaluationResult(null);
    setEvaluationStage('IDLE');
  };

  return (
    <div className="space-y-6" id="loan-origination-view">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Credit Origination & Heuristic Risk Engine
          </h2>
          <p className="text-xs text-slate-400">Originate custom debt limits, configure repayment tenures, and simulate real-time credit models</p>
        </div>
      </div>

      {/* CORE WORKSPACE SPLIT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="origination-grid">
        
        {/* INPUTS CONFIGURATION PANEL (Column span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CONFIGURATION CARD */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2.5 mb-4">
              1. Loan Parameters Sizing
            </h3>

            <form onSubmit={handleTriggerEvaluation} className="space-y-5">

              {/* Select Active Customer */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-2" id="org-lbl-customer">Select Target Borrower Profile</label>

                {/* Real-time Search Box */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                      type="text"
                      placeholder="Search by name or email..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(Number(e.target.value));
                    setEvaluationStage('IDLE');
                    setEvaluationResult(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                  id="originate-select-customer"
                >
                  {filteredCustomers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} (CIBIL: {c.cibilScore}, Income: ₹{c.monthlyIncome.toLocaleString('en-IN')}/mo)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Customer Rating Card Overlay */}
              {activeCustomer && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-2 gap-4 text-xs font-sans" id="active-customer-stats-overlay">
                  <div className="border-r border-slate-200 pr-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Verified Credit CIBIL Score</span>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`text-base font-extrabold font-mono px-2 py-0.5 rounded text-xs ${
                        activeCustomer.cibilScore >= 700 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-250'
                      }`}>
                        {activeCustomer.cibilScore} / 900
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Verified Profile</span>
                    </div>
                  </div>
                  <div className="pl-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Reported Liquidity Level</span>
                    <div className="mt-1.5">
                      <span className="text-sm font-bold font-mono text-slate-800">
                        ₹{activeCustomer.monthlyIncome.toLocaleString('en-IN')}/mo
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Assessed corporate tax net</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Slider for Principal Loan Amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-600" id="org-lbl-amount">Principal Facility Amount (₹)</label>
                  <span className="font-mono font-bold text-sm text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="20000"
                  max="1000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => {
                    setLoanAmount(Number(e.target.value));
                    setEvaluationStage('IDLE');
                    setEvaluationResult(null);
                  }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  id="originate-slider-amount"
                />
                
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>₹20,000 Min Limit</span>
                  <span>₹5,00,000 Mid Range</span>
                  <span>₹10,00,000 Max Limit</span>
                </div>
              </div>

              {/* Selection for Amortization Tenure */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5" id="org-lbl-tenure">Amortization Tenure Deadline</label>
                <div className="grid grid-cols-4 gap-2.5" id="originate-tenure-selectors">
                  {[6, 12, 24, 36].map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => {
                        setTenureMonths(months);
                        setEvaluationStage('IDLE');
                        setEvaluationResult(null);
                      }}
                      className={`py-2 px-3 border rounded-lg text-xs font-bold font-mono transition-all ${
                        tenureMonths === months 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                      id={`tenure-btn-${months}`}
                    >
                      {months} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Automated heuristic helper text rules */}
              <div className="bg-slate-50 border border-slate-205 p-3 rounded-lg flex items-start gap-2 text-[10.5px] text-slate-400">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Adjusting principal size and tenure instantly scales your monthly installment plans. Run the automated prediction model checks below to verify suitability limits instantly.
                </p>
              </div>

              {/* Action trigger button */}
              <button
                type="submit"
                disabled={evaluationStage === 'ANALYZING'}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-lg shadow-slate-900/15 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                id="originate-evaluate-btn"
              >
                {evaluationStage === 'ANALYZING' ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
                    Executing risk assessments checks...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
                    Verify and Run AI Suitability Predictor
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* FINANCIAL CALCULATOR PREVIEW (Column span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ESTIMATOR RESULTS CARD */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5" id="originate-preview-card">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              2. EMI Repayment Schedule Preview
            </h3>

            {/* Micro parameters display */}
            <div className="space-y-3.5">
              
              <div className="flex justify-between items-baseline py-1 border-b border-dashed border-slate-100">
                <span className="text-xs text-slate-500">Heuristic Annual Rate (Fixed):</span>
                <span className="font-mono font-bold text-xs text-slate-800">10.50% p.a.</span>
              </div>
              
              <div className="flex justify-between items-baseline py-1 border-b border-dashed border-slate-100">
                <span className="text-xs text-slate-500">Principal Volume:</span>
                <span className="font-mono font-semibold text-xs text-slate-700">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-dashed border-slate-100">
                <span className="text-xs text-slate-500">Total Interest Accrued:</span>
                <span className="font-mono font-semibold text-xs text-slate-700">₹{totalInterest.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-baseline py-1">
                <span className="text-xs text-slate-500">Total Outstanding Liabilities:</span>
                <span className="font-mono font-bold text-xs text-slate-700">₹{totalRepayment.toLocaleString('en-IN')}</span>
              </div>

            </div>

            {/* Central massive Monthly EMI marker */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-850 text-white rounded-xl p-4 text-center shadow-md relative overflow-hidden" id="estimated-emi-board">
              <div className="absolute right-2 bottom-2 text-slate-800 opacity-20 pointer-events-none">
                <TrendingUp className="h-20 w-20" />
              </div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-blue-300 block">Forecasted Monthly Installment EMI</span>
              <div className="text-3xl font-extrabold font-display tracking-tight text-white mt-1">
                ₹{monthlyEmi.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">
                Billing dates set for every 30 days starting next cycle
              </p>
            </div>

            {/* Amortization schedule mini mock rows */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">First 3 Projected Payments Terms:</span>
              
              <div className="space-y-2 text-[11px] font-sans">
                {[1, 2, 3].map((num) => {
                  const today = new Date();
                  today.setMonth(today.getMonth() + num);
                  const dateStr = today.toISOString().split('T')[0];
                  
                  return (
                    <div key={num} className="p-2 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-between text-slate-600 font-mono">
                      <span className="font-bold text-slate-700">Month #{num} Schedule</span>
                      <span className="text-slate-400">Due: {dateStr}</span>
                      <strong className="text-slate-800">₹{monthlyEmi.toLocaleString('en-IN')}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* DYNAMIC WOW FACTOR EVALUATION OVERLAY ACTION BAR */}
      {evaluationStage === 'ANALYZING' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" id="ai-evaluation-modal-overlay">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-xl w-full text-center shadow-2xl space-y-6" id="ai-evaluation-box">
            
            <div className="mx-auto w-14 h-14 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center animate-spin">
              <RefreshCw className="h-6 w-6 text-blue-400" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-bold font-mono text-slate-205 uppercase tracking-widest">
                Running Automated Credit Classifier
              </h2>
              <p className="text-xs text-slate-400 font-sans">Scanning scoring indexes relative to financial requirements</p>
            </div>

            {/* Logs Milestone flashers */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-32 overflow-hidden flex flex-col justify-end text-left font-mono text-[11px] space-y-1 text-slate-400">
              {milestones.slice(0, fakeMilestoneIndex + 1).map((m, idx) => (
                <div key={idx} className={`flex items-center gap-1.5 ${idx === fakeMilestoneIndex ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-500 font-mono">
              FinTegrity sandbox is parsing parameter matrices safely (no network required).
            </p>
          </div>
        </div>
      )}

      {/* DECISION COMPLETED CONTAINER OVERLAY PANEL (Wow factor showcase screen) */}
      {evaluationStage === 'DONE' && evaluationResult && activeCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" id="decision-modal-overlay">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl max-w-lg w-full" id="decision-modal">
            
            {/* Header branding */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="font-mono text-xs text-slate-450 uppercase tracking-widest font-bold">Heuristic credit report output</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">REF: RUN-{evaluationResult.loanId}</span>
            </div>

            {/* Inner Content card */}
            <div className="p-6 md:p-8 space-y-6 text-center" id="decision-body">
              
              {evaluationResult.status === 'APPROVED' ? (
                <div className="space-y-4" id="outcome-approved">
                  {/* Absolute epic check sign */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 scale-105 transition-transform">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Decision: Approved
                    </span>
                    <h3 className="text-xl font-bold font-sans text-slate-900">
                      Credit Suitability Confirmed
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal font-sans">
                      Our system heuristic has successfully validated risk thresholds for {activeCustomer.firstName} {activeCustomer.lastName}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4" id="outcome-rejected">
                  {/* Warning Cross */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <XCircle className="h-10 w-10" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono bg-rose-50 text-rose-700 font-bold border border-rose-150 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Decision: Rejected
                    </span>
                    <h3 className="text-xl font-bold font-sans text-slate-900">
                      Risk Bounds Exceeded
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal font-sans">
                      Automated loan origination parameters rejected due to scoring requirements.
                    </p>
                  </div>
                </div>
              )}

              {/* HEURISTIC SCORE CARD GAUGE */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-4 text-left text-xs font-sans">
                <div className="border-r border-slate-200 pr-3">
                  <span className="text-[9.5px] uppercase font-mono text-slate-400">Assessed parameters</span>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">CIBIL rating:</span>
                      <span className={`font-mono font-bold ${
                        evaluationResult.cibil >= 700 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {evaluationResult.cibil} / 900
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Monthly Compensation:</span>
                      <span className={`font-mono font-bold ${
                        evaluationResult.income >= 30000 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        ₹{evaluationResult.income.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pl-2">
                  <span className="text-[9.5px] uppercase font-mono text-slate-400">Decision Confidence</span>
                  <div className="mt-2.5">
                    <div className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">
                      {evaluationResult.confidence}%
                    </div>
                    <span className="text-[9.5px] text-slate-400 block mt-0.5">Machine evaluation ratio</span>
                  </div>
                </div>
              </div>

              {/* PARAMETER REQUIREMENT CHECKLIST */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs font-sans space-y-2">
                <span className="text-[9.5px] uppercase font-mono text-slate-400">Verification guidelines results:</span>
                
                <div className="space-y-2 font-medium">
                  {/* Rule 1: Cibil >= 700 */}
                  <div className="flex items-center justify-between border-b border-white pb-1.5">
                    <span className="text-slate-500">Verify borrower credit rating (CIBIL &gt;= 700):</span>
                    {evaluationResult.cibil >= 700 ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Checked ({evaluationResult.cibil})
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1 font-mono">
                        <XCircle className="h-3.5 w-3.5" /> Failed ({evaluationResult.cibil})
                      </span>
                    )}
                  </div>

                  {/* Rule 2: Income >= 30k */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Verify liquidation threshold (Income &gt;= ₹30K):</span>
                    {evaluationResult.income >= 30000 ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Checked (₹{evaluationResult.income.toLocaleString('en-IN')})
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1 font-mono">
                        <XCircle className="h-3.5 w-3.5" /> Failed (₹{evaluationResult.income.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION CALLOUTS */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setEvaluationStage('IDLE');
                    setEvaluationResult(null);
                  }}
                  className="flex-1 py-2.5 border border-slate-205 rounded-lg text-xs text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  id="decision-discard-btn"
                >
                  Discard App
                </button>
                <button
                  onClick={handleCommitLoan}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold text-white shadow-md transition-colors inline-flex items-center justify-center gap-1.5 uppercase tracking-wider ${
                    evaluationResult.status === 'APPROVED' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10' 
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/10'
                  }`}
                  id="decision-confirm-btn"
                >
                  {evaluationResult.status === 'APPROVED' ? 'Originate Loan & Schedule' : 'Log Rejected Decision'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
