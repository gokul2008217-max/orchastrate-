import React from 'react';
import { WhatsAppMessage, PredictionResult } from '../types';
import { X, ShieldCheck, AlertTriangle, FileText, Mic, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface MessageDetailModalProps {
  message: WhatsAppMessage | null;
  prediction?: PredictionResult;
  onClose: () => void;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  message,
  prediction,
  onClose
}) => {
  if (!message) return null;

  const isScam = prediction?.reason.toLowerCase().includes('scam') || prediction?.reason.toLowerCase().includes('defense');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#080808] border border-[#1A1A1A] w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-3.5 bg-[#050505] border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/60 font-bold">
              {message.message_id}
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Routing Analysis Breakdown</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-white hover:bg-[#1A1A1A] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Action Hero Box */}
          <div className={`p-4 rounded border flex items-center justify-between ${
            isScam
              ? 'bg-rose-950/30 border-rose-900/60 text-rose-300'
              : prediction?.action === 'notify'
              ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300'
              : prediction?.action === 'digest'
              ? 'bg-amber-950/30 border-amber-900/60 text-amber-300'
              : 'bg-[#121212] border-[#222222] text-slate-300'
          }`}>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest opacity-80">Routing Decision</span>
              <p className="text-xl font-extrabold capitalize mt-0.5 font-mono">{prediction?.action || 'Unclassified'}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-widest opacity-80">AI Model Confidence</span>
              <p className="text-xl font-extrabold mt-0.5 font-mono">{prediction ? (prediction.confidence * 100).toFixed(0) : 0}%</p>
            </div>
          </div>

          {/* Explanation Reason */}
          <div className="bg-[#050505] p-4 rounded border border-[#1A1A1A] space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              {isScam ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              AI Decision Explanation
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {prediction?.reason || 'No decision calculated yet.'}
            </p>
          </div>

          {/* Message Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#050505] p-3 rounded border border-[#1A1A1A]">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Sender Handle</span>
              <strong className="text-white">{message.sender_id}</strong>
            </div>
            <div className="bg-[#050505] p-3 rounded border border-[#1A1A1A]">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Group ID</span>
              <strong className="text-white">{message.group_id || 'Direct Message'}</strong>
            </div>
            <div className="bg-[#050505] p-3 rounded border border-[#1A1A1A]">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Medium Type</span>
              <strong className="text-white capitalize flex items-center gap-1">
                {message.message_type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />}
                {message.message_type === 'voice' && <Mic className="w-3.5 h-3.5 text-amber-400" />}
                {message.message_type === 'text' && <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                {message.message_type}
              </strong>
            </div>
            <div className="bg-[#050505] p-3 rounded border border-[#1A1A1A]">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Evidence Message IDs</span>
              <strong className="text-emerald-400">{prediction?.evidence_message_ids || 'none'}</strong>
            </div>
          </div>

          {/* Raw Message Body */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Raw Payload Message Content</h4>
            <div className="bg-[#050505] p-4 rounded border border-[#1A1A1A] text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          </div>

          {/* Media detail if applicable */}
          {message.media_file && message.media_file !== 'none' && (
            <div className="bg-[#050505] p-3 rounded border border-[#1A1A1A] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                Attached Media Payload:
              </span>
              <span className="text-slate-200">{message.media_file}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#050505] border-t border-[#1A1A1A] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] text-white rounded text-xs font-bold transition cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
