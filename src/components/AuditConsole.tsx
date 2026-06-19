/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LogMessage } from '../types';
import { Terminal, Trash2, Search, Info, ShieldCheck, Database, RefreshCw, Layers } from 'lucide-react';

interface AuditConsoleProps {
  logs: LogMessage[];
  onClearLogs: () => void;
}

export default function AuditConsole({ logs, onClearLogs }: AuditConsoleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<'ALL' | 'PORTAL' | 'RISK_ENGINE' | 'LEDGER' | 'SCHEDULER'>('ALL');
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll Logs Terminal
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Filters logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (serviceFilter === 'ALL') return true;
    return log.service === serviceFilter;
  });

  return (
    <div className="space-y-4" id="audit-console-view">
      
      {/* EXPLANATORY HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-blue-600 animate-pulse" />
            Sandbox Systems Audit Console
          </h2>
          <p className="text-xs text-slate-400">Review system activity records, diagnostic assertions, and memory ledger transaction logs</p>
        </div>
      </div>

      {/* SEARCH AND RE-ROUTE LOGS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs" id="audit-terminal-filters">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search operational messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            id="audit-search-input"
          />
        </div>

        {/* Filter Selection */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 flex items-center text-[11px] gap-1.5">
          <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Source:</span>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value as any)}
            className="w-full bg-transparent border-none text-slate-600 font-semibold focus:outline-none cursor-pointer text-xs"
            id="audit-service-select"
          >
            <option value="ALL">All Event Channels</option>
            <option value="PORTAL">PORTAL Events</option>
            <option value="RISK_ENGINE">RISK ENGINE</option>
            <option value="LEDGER">LEDGER commits</option>
            <option value="SCHEDULER">SCHEDULER sweeps</option>
          </select>
        </div>

        {/* Clear console Button */}
        <button
          onClick={onClearLogs}
          disabled={logs.length === 0}
          className="bg-slate-100 hover:bg-slate-200 border border-slate-205 text-slate-600 font-semibold text-xs py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
          id="audit-clear-btn"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Console
        </button>

      </div>

      {/* CORE BLACK TERMINAL SCREEN */}
      <div className="bg-slate-950 border border-slate-855 rounded-xl flex flex-col h-[480px] overflow-hidden shadow-2xl relative" id="terminal-screen-box">
        {/* Top Header decorative */}
        <div className="bg-slate-900 border-b border-slate-800 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider ml-2">Active sandbox telemetry node: fintegrity-ops-prd-01</span>
          </div>
          <span className="text-[10.5px] font-mono text-slate-650 flex items-center gap-1 font-bold">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            VECTORS SECURED
          </span>
        </div>

        {/* Console entries */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2 font-mono text-[11px] leading-relaxed select-text" id="terminal-body-log">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-medium font-sans">
              No audit logs captured here matching your query. Event timeline is clean.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const colors = {
                INFO: 'text-sky-400',
                WARN: 'text-amber-500 font-semibold',
                ERROR: 'text-red-500 font-semibold animate-pulse',
                SUCCESS: 'text-emerald-400 font-semibold'
              };
              
              const serviceColors = {
                PORTAL: 'bg-red-950/40 text-red-400 border border-red-900/40',
                RISK_ENGINE: 'bg-blue-955/40 text-blue-400 border border-blue-900/40',
                LEDGER: 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40',
                SCHEDULER: 'bg-purple-950/40 text-purple-400 border border-purple-900/40',
              };

              return (
                <div key={log.id} className="hover:bg-slate-900/50 p-1 rounded transition-colors flex items-start gap-3 border border-transparent hover:border-slate-800/40" id={`terminal-msg-${log.id}`}>
                  {/* Timestamp */}
                  <span className="text-slate-600 select-none shrink-0 font-medium">{log.timestamp}</span>
                  
                  {/* Service channel label */}
                  <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold shrink-0 uppercase tracking-widest ${serviceColors[log.service]}`}>
                    {log.service.replace('_', ' ')}
                  </span>
                  
                  {/* Response status type */}
                  <span className={`${colors[log.type]} shrink-0 text-[10px]`}>
                    [{log.type}]
                  </span>
                  
                  {/* Real Message text */}
                  <span className="text-slate-205 flex-1 break-all select-all">{log.message}</span>
                </div>
              );
            })
          )}
          <div ref={consoleEndRef} />
        </div>
        
        {/* Terminal statistics count bar */}
        <div className="bg-slate-900 border-t border-slate-800/50 px-4 py-2 flex items-center justify-between text-[9.5px] font-mono text-slate-500">
          <span>Active transaction streams: persistent memory cache active</span>
          <span>Buffer capacity: {filteredLogs.length} / 1000 lines</span>
        </div>
      </div>

    </div>
  );
}
