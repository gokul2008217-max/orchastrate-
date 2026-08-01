import React, { useState } from 'react';
import { PredictionResult } from '../types';
import { Sparkles, MessageSquare, Image as ImageIcon, Mic, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const LivePredictor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'voice'>('text');
  const [textContent, setTextContent] = useState('');
  const [senderId, setSenderId] = useState('U101');
  
  // Image states
  const [imageCaption, setImageCaption] = useState('AI & Tech Conference Poster');
  const [ocrText, setOcrText] = useState('CONGRATULATIONS! You won $50,000 cash giveaway! Send $100 processing fee to UPI id bank@verify');

  // Voice states
  const [voiceTranscript, setVoiceTranscript] = useState("Hey Sarah, this is Dr. Vance's clinic reminding you about your lab consultation today at 2 PM.");
  const [urgency, setUrgency] = useState('high');

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredictText = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/predict-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: 'MSG_LIVE_TEXT',
          sender_id: senderId,
          message_type: 'text',
          content: textContent || 'Default test prompt'
        })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictImage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/predict-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: imageCaption,
          ocr_text: ocrText
        })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictVoice = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/predict-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: voiceTranscript,
          detected_urgency: urgency
        })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="live-predictor-section" className="bg-[#080808] border border-[#1A1A1A] rounded-lg p-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Live AI Routing Sandbox
          </h2>
          <p className="text-[11px] text-slate-500">Test individual multimodal messages in real time and evaluate routing behavior</p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-[#1A1A1A] gap-6 text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('text')}
          className={`pb-2 transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'text' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Text Message
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`pb-2 transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'image' ? 'border-indigo-400 text-indigo-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Image OCR
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`pb-2 transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'voice' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Mic className="w-3.5 h-3.5" /> Voice Transcript
        </button>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Sender ID / Contact Handle</label>
              <input
                type="text"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                placeholder="e.g. U101 (Sarah) or U105 (Crypto Spammer)"
                className="w-full bg-[#050505] border border-[#1A1A1A] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Incoming Text Message Body</label>
              <textarea
                rows={3}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type or paste any WhatsApp message here... (e.g., Mom had a slip on the stairs! Emergency!)"
                className="w-full bg-[#050505] border border-[#1A1A1A] rounded p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
            <button
              onClick={handlePredictText}
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs rounded flex items-center gap-2 transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Evaluate Text Message</span>
            </button>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Poster / Screenshot Caption</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                className="w-full bg-[#050505] border border-[#1A1A1A] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">OCR Extracted Text from Poster Image</label>
              <textarea
                rows={3}
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
                placeholder="Paste OCR text extracted from poster or screenshot..."
                className="w-full bg-[#050505] border border-[#1A1A1A] rounded p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
            <button
              onClick={handlePredictImage}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded flex items-center gap-2 transition cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Evaluate Image & Poster OCR</span>
            </button>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Voice Note Audio Transcript</label>
              <textarea
                rows={3}
                value={voiceTranscript}
                onChange={(e) => setVoiceTranscript(e.target.value)}
                placeholder="Transcribed voice text..."
                className="w-full bg-[#050505] border border-[#1A1A1A] rounded p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Acoustic / Pitch Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-[#050505] border border-[#1A1A1A] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="high">High / Urgent</option>
                <option value="normal">Normal / Conversational</option>
                <option value="low">Low / Casual</option>
                <option value="critical_scam">Critical Scam Flag</option>
              </select>
            </div>
            <button
              onClick={handlePredictVoice}
              disabled={isLoading}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs rounded flex items-center gap-2 transition cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Evaluate Voice Transcript</span>
            </button>
          </div>
        )}

      </div>

      {/* Prediction Output Result Box */}
      {prediction && (
        <div className="bg-[#050505] border border-[#1A1A1A] rounded p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              AI Routing Result
            </span>
            <span className="text-xs font-mono text-emerald-400">
              Confidence: {(prediction.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border tracking-wider font-mono ${
              prediction.action === 'notify'
                ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/60'
                : prediction.action === 'digest'
                ? 'bg-amber-950/50 text-amber-400 border-amber-900/60'
                : 'bg-[#141414] text-slate-400 border-[#222]'
            }`}>
              Action: {prediction.action}
            </span>
            <span className="text-xs text-slate-400 font-mono">Medium: <strong className="text-white">{prediction.message_type}</strong></span>
          </div>

          <p className="text-xs text-slate-200 bg-[#0A0A0A] p-3 rounded border border-[#1A1A1A] font-sans leading-relaxed">
            <strong className="text-emerald-400 font-mono">Reasoning:</strong> {prediction.reason}
          </p>
        </div>
      )}

    </div>
  );
};
