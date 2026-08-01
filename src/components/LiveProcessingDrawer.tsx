import React from 'react';
import { Sparkles, CheckCircle, Database, Shield, Cpu, FileCheck } from 'lucide-react';

interface LiveProcessingDrawerProps {
  logs: string[];
  isProcessing: boolean;
}

export const LiveProcessingDrawer: React.FC<LiveProcessingDrawerProps> = ({
  logs,
  isProcessing
}) => {
  if (!isProcessing && logs.length === 0) return null;

  return (
    <div id="live-processing-drawer" className="bg-[#080808] border border-emerald-900/50 rounded-lg p-4 shadow-2xl space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">AI Engine Processing Log</h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-900/60">
          EXECUTION ACTIVE
        </span>
      </div>

      <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px] text-slate-300">
        {logs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
            <span className="text-emerald-400 font-bold">›</span>
            <span>{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
