/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cibilScore: number;
  monthlyIncome: number;
}

export interface Loan {
  id: number;
  customerId: number;
  customerName: string;
  loanAmount: number;
  emiAmount: number;
  tenureMonths: number;
  loanStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Transaction {
  id: number;
  loanId: number;
  customerName: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  paymentDate: string | null; // YYYY-MM-DD
  status: 'PENDING' | 'PAID' | 'LATE';
}

export interface LogMessage {
  id: string;
  timestamp: string;
  service: 'PORTAL' | 'RISK_ENGINE' | 'LEDGER' | 'SCHEDULER';
  type: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  payload?: any;
}
