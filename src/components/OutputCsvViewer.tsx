import React from 'react';
import { PredictionResult } from '../types';
import { Download, Table, FileSpreadsheet, CheckCircle } from 'lucide-react';

interface OutputCsvViewerProps {
  predictions: PredictionResult[];
  onDownloadCsv: () => void;
}

export const OutputCsvViewer: React.FC<OutputCsvViewerProps> = ({
  predictions,
  onDownloadCsv
}) => {
  return (
    <div id="output-csv-container" className="bg-[#080808] border border-[#1A1A1A] rounded-lg p-5 space-y-4">
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Generated Evaluation File: output.csv
          </h2>
          <p className="text-[11px] font-mono text-slate-500">Strict CSV schema output format (message_id, action, message_type, reason, confidence, evidence_message_ids)</p>
        </div>

        <button
          id="btn-download-csv-tab"
          onClick={onDownloadCsv}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded transition shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span>Download output.csv</span>
        </button>
      </div>

      <div className="overflow-x-auto border border-[#1A1A1A] rounded">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-[#050505] text-slate-400 border-b border-[#1A1A1A] text-[10px] uppercase tracking-wider">
              <th className="p-2.5">message_id</th>
              <th className="p-2.5">action</th>
              <th className="p-2.5">message_type</th>
              <th className="p-2.5">reason</th>
              <th className="p-2.5 text-right">confidence</th>
              <th className="p-2.5">evidence_message_ids</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A] text-slate-300">
            {predictions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                  No prediction results generated yet. Click 'Run Prediction Engine' above.
                </td>
              </tr>
            ) : (
              predictions.map(row => (
                <tr key={row.message_id} className="hover:bg-[#121212] transition">
                  <td className="p-2.5 text-emerald-400 font-bold">{row.message_id}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      row.action === 'notify'
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/60'
                        : row.action === 'digest'
                        ? 'bg-amber-950/50 text-amber-400 border border-amber-900/60'
                        : 'bg-[#141414] text-slate-400 border border-[#222]'
                    }`}>
                      {row.action}
                    </span>
                  </td>
                  <td className="p-2.5 capitalize">{row.message_type}</td>
                  <td className="p-2.5 text-slate-300 max-w-xs truncate font-sans text-xs">{row.reason}</td>
                  <td className="p-2.5 text-right font-bold text-emerald-400">{row.confidence.toFixed(2)}</td>
                  <td className="p-2.5 text-slate-400">{row.evidence_message_ids}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
