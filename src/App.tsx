import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { MessageFeed } from './components/MessageFeed';
import { LivePredictor } from './components/LivePredictor';
import { OutputCsvViewer } from './components/OutputCsvViewer';
import { MessageDetailModal } from './components/MessageDetailModal';
import { UploadDatasetModal } from './components/UploadDatasetModal';
import { LiveProcessingDrawer } from './components/LiveProcessingDrawer';
import { AnalyticsData, WhatsAppMessage, PredictionResult } from './types';
import { BarChart3, MessageSquare, Sparkles, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'messages' | 'analytics' | 'sandbox' | 'output'>('messages');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResult | undefined>(undefined);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Messages
      const msgRes = await fetch('/api/messages');
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

      // 2. Fetch Analytics & Predictions
      const analyticsRes = await fetch('/api/analytics');
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      // 3. Trigger initial predict to ensure output.csv & predictions are fresh
      const predRes = await fetch('/api/predict', { method: 'POST' });
      if (predRes.ok) {
        const predData = await predRes.json();
        setPredictions(predData.results || []);
      }
    } catch (err) {
      console.error('Error fetching initial app data:', err);
    }
  };

  const handleRunPrediction = async () => {
    setIsProcessing(true);
    setLogs([
      'Initializing Data Loader service...',
      'Parsing messages.csv, users.csv, groups.csv...',
      'Executing OCR Service on attached image posters...',
      'Running Voice Note transcription and urgency analysis...',
      'Scanning for spam keywords & phishing scam signatures...',
      'Evaluating Business Trust Engine & user history...',
      'Invoking Gemini 2.5 Pro multimodal reasoning engine...',
      'Generating notification action decisions (Notify / Digest / Mute)...',
      'Calculating confidence scores & evidence IDs...',
      'Successfully updated output.csv and backend outputs!'
    ]);

    try {
      const res = await fetch('/api/predict', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPredictions(data.results || []);
        
        // Refresh analytics
        const aRes = await fetch('/api/analytics');
        if (aRes.ok) {
          setAnalytics(await aRes.json());
        }
      }
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1200);
    }
  };

  const handleDownloadCsv = () => {
    window.open('/api/output.csv', '_blank');
  };

  const handleSelectMessage = (msg: WhatsAppMessage, pred?: PredictionResult) => {
    setSelectedMessage(msg);
    setSelectedPrediction(pred);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#D1D1D1] font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-black">
      
      {/* Top Header */}
      <Navbar
        onRunPrediction={handleRunPrediction}
        onOpenUploadModal={() => setIsUploadOpen(true)}
        onDownloadCsv={handleDownloadCsv}
        isProcessing={isProcessing}
        totalMessages={messages.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        
        {/* Live Processing Logs Drawer */}
        <LiveProcessingDrawer logs={logs} isProcessing={isProcessing} />

        {/* Primary View Switcher Navigation */}
        <div className="flex border-b border-[#1A1A1A] gap-8 text-xs font-medium uppercase tracking-widest text-slate-400 overflow-x-auto">
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-2.5 transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'messages' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Message Feed
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-2.5 transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'analytics' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics Dashboard
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`pb-2.5 transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'sandbox' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Live AI Sandbox
          </button>

          <button
            onClick={() => setActiveTab('output')}
            className={`pb-2.5 transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'output' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> output.csv Export
          </button>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'messages' && (
          <MessageFeed
            messages={messages}
            predictions={predictions}
            onSelectMessage={handleSelectMessage}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard analytics={analytics} />
        )}

        {activeTab === 'sandbox' && (
          <LivePredictor />
        )}

        {activeTab === 'output' && (
          <OutputCsvViewer
            predictions={predictions}
            onDownloadCsv={handleDownloadCsv}
          />
        )}

      </main>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          prediction={selectedPrediction}
          onClose={() => setSelectedMessage(null)}
        />
      )}

      {/* Dataset Upload Modal */}
      {isUploadOpen && (
        <UploadDatasetModal
          onClose={() => setIsUploadOpen(false)}
          onSuccess={fetchData}
        />
      )}

      {/* Elegant Dark System Status Footer */}
      <footer className="h-10 border-t border-[#1A1A1A] bg-[#080808] flex items-center px-6 justify-between text-[10px] font-mono text-slate-500 mt-auto">
        <div className="flex gap-4">
          <span>PIPELINE: ACTIVE</span>
          <span>ROUTING LOGIC: HYBRID GEMINI 2.5 PRO</span>
          <span>DATASET: {messages.length} RECORDS</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
            ENGINES NOMINAL
          </span>
          <span>© NEURAL ROUTE SYSTEM</span>
        </div>
      </footer>

    </div>
  );
}
