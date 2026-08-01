import React, { useState } from 'react';
import { WhatsAppMessage, PredictionResult } from '../types';
import { Search, Image as ImageIcon, Mic, MessageSquare, AlertTriangle, ShieldCheck, ChevronRight, Filter } from 'lucide-react';

interface MessageFeedProps {
  messages: WhatsAppMessage[];
  predictions: PredictionResult[];
  onSelectMessage: (msg: WhatsAppMessage, pred?: PredictionResult) => void;
}

export const MessageFeed: React.FC<MessageFeedProps> = ({
  messages,
  predictions,
  onSelectMessage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | 'notify' | 'digest' | 'mute' | 'scam'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'text' | 'image' | 'voice'>('all');

  const predMap = new Map<string, PredictionResult>();
  predictions.forEach(p => predMap.set(p.message_id, p));

  const filteredMessages = messages.filter(msg => {
    const pred = predMap.get(msg.message_id);
    const content = (msg.content || '').toLowerCase();
    const matchesSearch = content.includes(searchTerm.toLowerCase()) || msg.sender_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesAction = true;
    if (actionFilter === 'scam') {
      matchesAction = pred ? (pred.reason.toLowerCase().includes('scam') || pred.reason.toLowerCase().includes('defense')) : false;
    } else if (actionFilter !== 'all') {
      matchesAction = pred ? pred.action === actionFilter : true;
    }

    let matchesType = true;
    if (typeFilter !== 'all') {
      matchesType = msg.message_type === typeFilter;
    }

    return matchesSearch && matchesAction && matchesType;
  });

  const getBadgeStyle = (action?: string) => {
    switch (action) {
      case 'notify':
        return 'bg-emerald-950/50 text-emerald-400 border-emerald-900/60 shadow-[0_0_8px_rgba(16,185,129,0.15)]';
      case 'digest':
        return 'bg-amber-950/50 text-amber-400 border-amber-900/60';
      case 'mute':
        return 'bg-[#141414] text-slate-400 border-[#222222]';
      default:
        return 'bg-[#121212] text-slate-500 border-[#1A1A1A]';
    }
  };

  return (
    <div id="messages-feed-container" className="bg-[#080808] border border-[#1A1A1A] rounded-lg p-5 space-y-5">
      
      {/* Header & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Live Incoming Processing Feed
          </h2>
          <p className="text-[11px] text-slate-500">Multimodal messages parsed via OCR, voice transcription & Gemini 3.6 Flash reasoning</p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px] flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by sender or message content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050505] border border-[#1A1A1A] rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1A1A1A] text-xs">
        
        {/* Action Filters */}
        <div className="flex items-center gap-1 bg-[#050505] p-1 rounded border border-[#1A1A1A]">
          {(['all', 'notify', 'digest', 'mute', 'scam'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActionFilter(tab)}
              className={`px-3 py-1 rounded text-[11px] font-mono capitalize transition ${
                actionFilter === tab
                  ? 'bg-[#1A1A1A] text-white font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'scam' ? '🛡️ Scams Blocked' : tab}
            </button>
          ))}
        </div>

        {/* Medium Type Filters */}
        <div className="flex items-center gap-1 bg-[#050505] p-1 rounded border border-[#1A1A1A]">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${typeFilter === 'all' ? 'bg-[#1A1A1A] text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            All Mediums
          </button>
          <button
            onClick={() => setTypeFilter('text')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex items-center gap-1 ${typeFilter === 'text' ? 'bg-[#1A1A1A] text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MessageSquare className="w-3 h-3" /> Text
          </button>
          <button
            onClick={() => setTypeFilter('image')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex items-center gap-1 ${typeFilter === 'image' ? 'bg-[#1A1A1A] text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <ImageIcon className="w-3 h-3" /> Image (OCR)
          </button>
          <button
            onClick={() => setTypeFilter('voice')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex items-center gap-1 ${typeFilter === 'voice' ? 'bg-[#1A1A1A] text-amber-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Mic className="w-3 h-3" /> Voice
          </button>
        </div>

      </div>

      {/* Messages List */}
      <div className="space-y-2.5">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#1A1A1A] rounded bg-[#050505]">
            <Filter className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-mono text-slate-400">No records found matching specified filters</p>
          </div>
        ) : (
          filteredMessages.map(msg => {
            const pred = predMap.get(msg.message_id);
            const isScam = pred?.reason.toLowerCase().includes('scam') || pred?.reason.toLowerCase().includes('defense');

            return (
              <div
                key={msg.message_id}
                onClick={() => onSelectMessage(msg, pred)}
                className={`group bg-[#0C0C0C] hover:bg-[#121212] border rounded p-4 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isScam
                    ? 'border-rose-900/50 hover:border-rose-700/80'
                    : pred?.action === 'notify'
                    ? 'border-emerald-900/40 hover:border-emerald-600/60 border-l-2 border-l-emerald-500'
                    : 'border-[#1A1A1A] hover:border-[#333]'
                }`}
              >
                {/* Left info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="font-mono text-emerald-400 font-bold">{msg.message_id}</span>
                    <span className="text-white font-medium">Source: {msg.sender_id}</span>
                    
                    {msg.group_id && msg.group_id !== 'none' && (
                      <span className="text-[10px] bg-[#141414] text-slate-400 px-2 py-0.5 rounded border border-[#222] font-mono">
                        Group: {msg.group_id}
                      </span>
                    )}

                    {msg.message_type === 'image' && (
                      <span className="text-[10px] bg-indigo-950/40 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/50 flex items-center gap-1 font-mono">
                        <ImageIcon className="w-3 h-3 text-indigo-400" /> Image Poster
                      </span>
                    )}

                    {msg.message_type === 'voice' && (
                      <span className="text-[10px] bg-amber-950/40 text-amber-300 px-2 py-0.5 rounded border border-amber-900/50 flex items-center gap-1 font-mono">
                        <Mic className="w-3 h-3 text-amber-400" /> Voice Note
                      </span>
                    )}

                    {msg.is_forwarded && (
                      <span className="text-[10px] bg-[#181818] text-slate-400 px-1.5 py-0.5 rounded font-mono">
                        Forwarded
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-200 line-clamp-2 font-sans leading-relaxed">
                    "{msg.content}"
                  </p>

                  {/* AI Reason string snippet */}
                  {pred && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                      {isScam ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      )}
                      <span className="line-clamp-1">{pred.reason}</span>
                    </p>
                  )}
                </div>

                {/* Right Action Badge & Confidence */}
                <div className="flex items-center gap-4 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1A1A1A]">
                  {pred ? (
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getBadgeStyle(pred.action)}`}>
                        {pred.action}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        Conf: <strong className="text-slate-300">{(pred.confidence * 100).toFixed(0)}%</strong>
                      </div>
                      {pred.evidence_message_ids && pred.evidence_message_ids !== 'none' && (
                        <div className="text-[10px] text-emerald-400/80 mt-0.5 font-mono">
                          Ev: {pred.evidence_message_ids}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Pending prediction</span>
                  )}

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
