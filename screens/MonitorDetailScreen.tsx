
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  MoreVertical, 
  Globe, 
  Lock, 
  Clock, 
  History, 
  Play, 
  Edit, 
  Trash2, 
  Pause,
  Zap,
  Terminal,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  MoreHorizontal,
  X,
  Settings
} from 'lucide-react';
import { Monitor, MonitorStatus, LogEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useWatcher } from '../WatcherContext';

interface MonitorDetailScreenProps {
  monitor: Monitor;
  onBack: () => void;
}

type TabId = 'overview' | 'logs' | 'incidents';

const MonitorDetailScreen: React.FC<MonitorDetailScreenProps> = ({ monitor, onBack }) => {
  const { toggleMonitorStatus, manualCheck, updateMonitor, setNotification } = useWatcher();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isChecking, setIsChecking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Edit form state
  const [editName, setEditName] = useState(monitor.name);
  const [editUrl, setEditUrl] = useState(monitor.url);
  const [editInterval, setEditInterval] = useState(monitor.checkInterval || 5);
  const [isUpdating, setIsUpdating] = useState(false);

  const isUp = monitor.status === MonitorStatus.UP;
  const isPaused = monitor.status === MonitorStatus.PAUSED;
  const isDown = monitor.status === MonitorStatus.DOWN;

  const handleManualCheck = async () => {
    setIsChecking(true);
    await manualCheck(monitor.id);
    setIsChecking(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateMonitor(monitor.id, { 
      name: editName, 
      url: editUrl, 
      checkInterval: editInterval,
      lastCheck: 'Just now'
    });
    setIsUpdating(false);
    setShowEditModal(false);
    setNotification({ message: 'Configuration updated', type: 'success' });
  };

  const handlePause = () => {
    if (window.confirm(isPaused ? "Resume monitoring?" : "Pause monitoring? Check will be suspended.")) {
      toggleMonitorStatus(monitor.id);
      setShowMenu(false);
      setNotification({ message: isPaused ? 'Monitor resumed' : 'Monitor paused', type: 'success' });
    }
  };

  // Convert logs to chart data
  const chartData = [...monitor.logs].reverse().map(l => ({
    time: l.timestamp,
    ms: l.responseTime
  }));

  return (
    <div className="min-h-full bg-[#09090B] animate-in slide-in-from-right duration-300 flex flex-col relative">
      
      {/* Detail Header */}
      <div className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-[#09090B]/95 backdrop-blur-xl z-[70] border-b border-[#27272A]">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl text-[#A1A1AA] active:bg-zinc-800">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center flex-1 truncate px-4">
          <h2 className="font-bold text-xs text-[#FAFAFA] truncate max-w-full mono">{monitor.url}</h2>
          <div className="flex items-center gap-1">
             <div className={`w-1 h-1 rounded-full ${isUp ? 'bg-[#10B981]' : isDown ? 'bg-[#EF4444]' : 'bg-[#A1A1AA]'}`} />
             <span className="text-[8px] uppercase font-black text-[#A1A1AA] tracking-tighter">{monitor.name}</span>
          </div>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} className="p-2 -mr-2 text-[#A1A1AA] active:bg-zinc-800 rounded-xl relative">
          <MoreVertical size={20} />
          {showMenu && (
            <div className="absolute right-0 top-12 w-48 bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl py-2 z-[100] animate-in zoom-in-95 duration-200">
               <button onClick={handlePause} className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-800 transition-colors">
                  {isPaused ? <Play size={16} className="text-[#10B981]" /> : <Pause size={16} className="text-[#F59E0B]" />}
                  <span className="text-xs font-bold">{isPaused ? 'Resume Check' : 'Pause Monitor'}</span>
               </button>
               <button onClick={() => { setShowEditModal(true); setShowMenu(false); }} className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-800 transition-colors">
                  <Edit size={16} />
                  <span className="text-xs font-bold">Edit Config</span>
               </button>
               <div className="h-px bg-[#27272A] my-1 mx-2" />
               <button className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#EF4444]/10 transition-colors text-[#EF4444]">
                  <Trash2 size={16} />
                  <span className="text-xs font-bold">Delete</span>
               </button>
            </div>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Status Hero Section */}
        <section className="p-8 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
             {/* Large Pulsing Status */}
             <div className={`w-40 h-40 rounded-full flex items-center justify-center border-2 transition-all duration-700 relative ${
               isUp ? 'border-[#10B981]/10' : isDown ? 'border-[#EF4444]/10' : 'border-[#A1A1AA]/10'
             }`}>
                {/* Outer Glows */}
                <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
                  isUp ? 'bg-[#10B981]' : isDown ? 'bg-[#EF4444]' : 'bg-[#A1A1AA]'
                }`} />
                
                <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl transition-all duration-700 relative z-10 ${
                  isUp ? 'bg-[#10B981]/10 border-[#10B981] shadow-[#10B981]/20 animate-pulse-up' : 
                  isDown ? 'bg-[#EF4444]/10 border-[#EF4444] shadow-[#EF4444]/20 animate-pulse-down' : 
                  'bg-[#A1A1AA]/10 border-[#A1A1AA] shadow-[#A1A1AA]/10'
                }`}>
                   <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${isUp ? 'text-[#10B981]' : isDown ? 'text-[#EF4444]' : 'text-[#A1A1AA]'}`}>
                      {isChecking ? 'Checking' : monitor.status}
                   </span>
                   <div className="font-black text-2xl leading-none">
                      {isUp ? 'OPERATIONAL' : isDown ? 'CRITICAL' : 'PAUSED'}
                   </div>
                </div>
             </div>

             {/* Manual Check Button */}
             <button 
                onClick={handleManualCheck}
                disabled={isChecking || isPaused}
                className={`absolute bottom-0 right-0 w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl transition-all z-20 ${
                  isChecking ? 'bg-zinc-800 border-[#27272A]' : 'bg-[#18181B] border-[#27272A] active:scale-90 active:bg-zinc-800'
                }`}
             >
                <RefreshCw size={20} className={`text-[#10B981] ${isChecking ? 'animate-spin' : ''}`} />
             </button>
          </div>

          <div className="flex gap-2">
            <span className="px-3 py-1 bg-zinc-800 border border-[#27272A] rounded-full text-[9px] font-black text-[#A1A1AA] tracking-widest uppercase">
              {monitor.sslStatus} SSL
            </span>
            <span className="px-3 py-1 bg-zinc-800 border border-[#27272A] rounded-full text-[9px] font-black text-[#A1A1AA] tracking-widest uppercase">
              {monitor.checkInterval}m Checks
            </span>
          </div>
        </section>

        {/* Tab System (Sticky) */}
        <div className="sticky top-[105px] bg-[#09090B]/90 backdrop-blur-xl border-y border-[#27272A] z-50 flex">
          <TabItem active={activeTab === 'overview'} label="Overview" onClick={() => setActiveTab('overview')} />
          <TabItem active={activeTab === 'logs'} label="Response Logs" onClick={() => setActiveTab('logs')} />
          <TabItem active={activeTab === 'incidents'} label="Incidents" onClick={() => setActiveTab('incidents')} />
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-8 pb-32">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               {/* Response Time Chart with Scrubbing Simulation */}
               <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1AA]">Live Response (ms)</h3>
                     <div className="flex items-center gap-2">
                        <span className="mono text-[10px] text-[#A1A1AA]">Scrub to see history</span>
                     </div>
                  </div>
                  <div className="h-56 w-full bg-[#18181B] border border-[#27272A] rounded-3xl p-6 relative group">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={chartData}>
                          <defs>
                             <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isDown ? "#EF4444" : "#10B981"} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={isDown ? "#EF4444" : "#10B981"} stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
                          <XAxis dataKey="time" hide />
                          <YAxis hide domain={[0, 'auto']} />
                          <Tooltip 
                             cursor={{ stroke: '#27272A', strokeWidth: 2 }}
                             content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-[#18181B] border border-[#10B981] p-3 rounded-2xl shadow-2xl flex flex-col items-center">
                                       <span className="text-[10px] font-black text-[#A1A1AA] uppercase">{payload[0].payload.time}</span>
                                       <span className="text-sm font-bold text-[#10B981] mono">{payload[0].value}ms</span>
                                    </div>
                                  );
                                }
                                return null;
                             }}
                          />
                          <Area 
                             type="monotone" 
                             dataKey="ms" 
                             stroke={isDown ? "#EF4444" : "#10B981"} 
                             strokeWidth={3} 
                             fillOpacity={1} 
                             fill="url(#colorMs)" 
                             animationDuration={1500}
                          />
                       </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </section>

               {/* Uptime Bars (30 checks) */}
               <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1AA]">30-Day Check History</h3>
                    <span className="text-[10px] font-bold text-[#10B981]">99.8% Uptime</span>
                  </div>
                  <div className="flex items-end gap-1 h-8">
                     {Array.from({ length: 30 }).map((_, i) => (
                       <div 
                         key={i} 
                         className={`flex-1 rounded-full transition-all duration-500 hover:scale-y-125 ${
                           i === 22 ? 'h-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]' : 
                           i > 25 ? 'h-full bg-[#10B981]/40' : 
                           'h-full bg-[#10B981] shadow-[0_0_4px_#10B981]'
                         }`} 
                       />
                     ))}
                  </div>
               </section>

               {/* Stats Grid */}
               <section className="grid grid-cols-2 gap-4">
                  <StatItem label="Avg Response" value="120ms" />
                  <StatItem label="Uptime (24h)" value="99.8%" color="text-[#10B981]" />
                  <StatItem label="SSL Status" value="Valid" subValue="200 days left" color="text-[#10B981]" />
                  <StatItem label="Agent Node" value="VN-HCM-01" subValue="DigitalOcean" />
               </section>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4 animate-in fade-in duration-300">
               <div className="p-4 bg-zinc-900 border border-[#27272A] rounded-2xl flex items-center gap-3">
                  <Terminal size={18} className="text-[#10B981]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]">Real-time Agent Console</span>
               </div>
               <div className="bg-[#000] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 p-3 bg-zinc-900/50 border-b border-[#27272A]">
                     <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                     <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                     <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                     <span className="text-[8px] mono text-[#A1A1AA] ml-2">stdout — monitoring@watcher</span>
                  </div>
                  <div className="p-4 mono text-[11px] space-y-2 h-[400px] overflow-y-auto">
                     {monitor.logs.map((log) => (
                       <div key={log.id} className="flex gap-3 hover:bg-zinc-800/50 transition-colors p-1 rounded">
                          <span className="text-zinc-600">[{log.timestamp}]</span>
                          <span className="text-zinc-400 font-bold uppercase">{log.method}</span>
                          <span className={log.statusCode === 200 ? 'text-[#10B981] font-bold' : 'text-[#EF4444] font-bold'}>
                             {log.statusCode} {log.statusText}
                          </span>
                          <span className="text-[#A1A1AA] ml-auto">{log.responseTime > 0 ? `${log.responseTime}ms` : '---'}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="space-y-4 animate-in fade-in duration-300">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1AA] mb-4">Historical Events</h3>
               {monitor.incidents.length > 0 ? monitor.incidents.map((inc) => (
                 <div key={inc.id} className="p-4 bg-[#18181B] border-l-4 border-[#EF4444] rounded-r-2xl border-y border-r border-[#27272A] flex items-center justify-between">
                    <div>
                       <h4 className="text-sm font-bold text-[#EF4444]">{inc.error}</h4>
                       <p className="text-[10px] text-[#A1A1AA] font-medium mt-1 uppercase tracking-wider">{inc.time} • Down for {inc.duration}</p>
                    </div>
                    <AlertCircle className="text-[#EF4444]" size={20} />
                 </div>
               )) : (
                 <div className="py-20 flex flex-col items-center justify-center opacity-30">
                    <CheckCircle2 size={48} className="text-[#10B981] mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">No Incidents Recorded</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Monitor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[200] bg-[#09090B]/95 backdrop-blur-md flex flex-col animate-in slide-in-from-bottom duration-500">
          <div className="p-6 pt-12 flex items-center justify-between border-b border-[#27272A]">
             <button onClick={() => setShowEditModal(false)} className="p-2 text-[#A1A1AA] active:bg-zinc-800 rounded-xl">
               <X size={24} />
             </button>
             <h2 className="text-sm font-black uppercase tracking-[0.2em]">Edit Monitor</h2>
             <div className="w-10" />
          </div>

          <form onSubmit={handleUpdate} className="p-8 space-y-8">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest block pl-1">Monitor Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl py-4 px-5 text-sm font-bold text-[#FAFAFA] focus:border-[#10B981] outline-none transition-all"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest block pl-1">Target URL</label>
                <input 
                  type="text" 
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl py-4 px-5 text-sm font-bold text-[#FAFAFA] mono outline-none"
                />
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest block pl-1">Check Interval</label>
                   <span className="text-[#10B981] font-black">{editInterval} Min</span>
                </div>
                <input 
                   type="range" 
                   min="1" 
                   max="60" 
                   step="1"
                   value={editInterval}
                   onChange={(e) => setEditInterval(parseInt(e.target.value))}
                   className="w-full h-2 bg-[#18181B] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                />
             </div>

             <div className="pt-8 space-y-4">
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="w-full py-5 bg-[#FAFAFA] text-[#09090B] font-black uppercase tracking-[0.2em] rounded-3xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                   {isUpdating ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                   {isUpdating ? 'Updating Agent...' : 'Save Configuration'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-full py-5 bg-[#18181B] text-[#A1A1AA] border border-[#27272A] font-black uppercase tracking-[0.2em] rounded-3xl active:scale-95 transition-all"
                >
                   Cancel
                </button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
};

const TabItem = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
      active ? 'text-[#10B981]' : 'text-[#A1A1AA]'
    }`}
  >
    {label}
    {active && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#10B981] shadow-[0_0_10px_#10B981]" />}
  </button>
);

const StatItem = ({ label, value, subValue, color = "text-[#FAFAFA]" }: { label: string, value: string, subValue?: string, color?: string }) => (
  <div className="p-5 bg-[#18181B] border border-[#27272A] rounded-3xl space-y-1 active:bg-zinc-800 transition-colors">
     <span className="text-[9px] font-black text-[#A1A1AA] uppercase tracking-wider block">{label}</span>
     <span className={`text-lg font-black block ${color}`}>{value}</span>
     {subValue && <span className="text-[10px] font-medium text-[#A1A1AA] block">{subValue}</span>}
  </div>
);

export default MonitorDetailScreen;
