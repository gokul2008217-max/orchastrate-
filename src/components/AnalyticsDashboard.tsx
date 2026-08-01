import React from 'react';
import { AnalyticsData } from '../types';
import { Bell, CheckCircle2, Clock, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';

interface AnalyticsDashboardProps {
  analytics: AnalyticsData | null;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  if (!analytics) return null;

  const actionDistributionData = [
    { name: 'Notify', count: analytics.notify_count, color: '#10b981' },
    { name: 'Digest', count: analytics.digest_count, color: '#f59e0b' },
    { name: 'Mute', count: analytics.mute_count, color: '#f43f5e' },
  ];

  const riskData = [
    { name: 'Safe', count: analytics.total_messages - analytics.scam_count - analytics.spam_count, color: '#10b981' },
    { name: 'Spam Promos', count: analytics.spam_count, color: '#f59e0b' },
    { name: 'Blocked Scams', count: analytics.scam_count, color: '#f43f5e' },
  ];

  return (
    <div id="analytics-section" className="space-y-6">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-[#080808] border border-[#1A1A1A] rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider">Total Msgs</span>
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white font-mono">{analytics.total_messages}</p>
          <span className="text-[10px] text-slate-500 mt-1">Processed dataset</span>
        </div>

        <div className="bg-[#080808] border border-emerald-900/40 rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider">Notify</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-400 font-mono">{analytics.notify_count}</p>
          <span className="text-[10px] text-emerald-500/70 mt-1">High priority</span>
        </div>

        <div className="bg-[#080808] border border-amber-900/40 rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider">Digest</span>
            <Filter className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-400 font-mono">{analytics.digest_count}</p>
          <span className="text-[10px] text-amber-500/70 mt-1">Scheduled daily</span>
        </div>

        <div className="bg-[#080808] border border-[#222] rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider">Mute</span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-slate-300 font-mono">{analytics.mute_count}</p>
          <span className="text-[10px] text-slate-500 mt-1">Silenced chatter</span>
        </div>

        <div className="bg-[#080808] border border-rose-900/40 rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider">Blocked Scams</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-xl font-bold text-rose-400 font-mono">{analytics.scam_count}</p>
          <span className="text-[10px] text-rose-500/70 mt-1">Phishing defense</span>
        </div>

        <div className="bg-[#080808] border border-emerald-900/40 rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider">AI Precision</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-300 font-mono">{(analytics.avg_confidence * 100).toFixed(0)}%</p>
          <span className="text-[10px] text-emerald-500/70 mt-1">Model confidence</span>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Action Breakdown Chart */}
        <div className="bg-[#080808] border border-[#1A1A1A] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Routing Distribution</h3>
            <span className="text-[10px] font-mono text-slate-500">Notify / Digest / Mute</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1A1A1A" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0C0C0C', borderColor: '#222222', color: '#FFFFFF', borderRadius: '4px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {actionDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk & Scam Distribution */}
        <div className="bg-[#080808] border border-[#1A1A1A] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Threat Defense Breakdown</h3>
            <span className="text-[10px] font-mono text-slate-500">Scam & Spam Scans</span>
          </div>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0C0C0C', borderColor: '#222222', color: '#FFFFFF', borderRadius: '4px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs font-mono text-slate-400 mt-1">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Safe</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Spam</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Scams</span>
          </div>
        </div>

        {/* Daily Historical Trends */}
        <div className="bg-[#080808] border border-[#1A1A1A] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">7-Day Load Trends</h3>
            <span className="text-[10px] font-mono text-slate-500">daily_summary.csv</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.daily_summary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1A1A1A" />
                <XAxis dataKey="date" stroke="#666" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0C0C0C', borderColor: '#222222', color: '#FFFFFF', borderRadius: '4px' }} />
                <Line type="monotone" dataKey="notify_count" stroke="#10b981" strokeWidth={2} name="Notify" />
                <Line type="monotone" dataKey="digest_count" stroke="#f59e0b" strokeWidth={2} name="Digest" />
                <Line type="monotone" dataKey="mute_count" stroke="#64748b" strokeWidth={2} name="Mute" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
