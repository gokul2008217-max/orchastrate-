import React from 'react';
import { Bell, Sparkles, Upload, Play, Download, ShieldCheck, Database } from 'lucide-react';

interface NavbarProps {
  onRunPrediction: () => void;
  onOpenUploadModal: () => void;
  onDownloadCsv: () => void;
  isProcessing: boolean;
  totalMessages: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRunPrediction,
  onOpenUploadModal,
  onDownloadCsv,
  isProcessing,
  totalMessages
}) => {
  return (
    <header id="main-header" className="bg-[#080808] border-b border-[#1A1A1A] text-white sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)]">
            <Bell className="w-4 h-4 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                NEURAL<span className="text-emerald-500">ROUTE</span>
                <span className="text-[10px] text-slate-400 font-mono ml-1 px-1.5 py-0.5 border border-[#222] bg-[#121212] rounded">
                  V2.1
                </span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide">MULTIMODAL NOTIFICATION ROUTER & SCAM DEFENSE</p>
          </div>
        </div>

        {/* Gemini Engine Connected pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#121212] rounded-full border border-[#222]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] font-mono text-slate-300">GEMINI-2.5-PRO: CONNECTED</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] rounded border border-[#1A1A1A] text-[11px] text-slate-300 font-mono">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dataset: <strong className="text-white">{totalMessages} Msgs</strong></span>
          </div>

          <button
            id="btn-upload-dataset"
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#121212] hover:bg-[#1A1A1A] text-slate-300 border border-[#222] rounded transition-colors"
            title="Upload dataset CSV"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Upload Dataset</span>
          </button>

          <button
            id="btn-download-csv"
            onClick={onDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#121212] hover:bg-[#1A1A1A] text-emerald-400 border border-emerald-900/40 rounded transition-colors"
            title="Download output.csv"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export output.csv</span>
          </button>

          <button
            id="btn-run-predict"
            onClick={onRunPrediction}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded transition-colors shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Processing AI...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>RUN PREDICTION ENGINE</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
