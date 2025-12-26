
import React, { useState } from 'react';
import { Bell, AlertCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { Monitor } from '../types';
import { useWatcher } from '../WatcherContext';

interface DashboardScreenProps {
  onAddMonitor: () => void;
  onSelectMonitor: (monitor: Monitor) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onSelectMonitor }) => {
  const { monitors, user, refreshMonitors } = useWatcher();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshMonitors();
    setIsRefreshing(false);
  };

  const uptime = monitors.length > 0 
    ? (monitors.filter(m => m.status === 'UP').length / monitors.length * 100).toFixed(1) 
    : "0";

  const incidentsCount = monitors.filter(m => m.status === 'DOWN').length;

  return (
    <div className="p-6 pt-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 overflow-y-auto">
      {/* Pull to refresh indicator simulation */}
      <div 
        className={`flex justify-center transition-all duration-300 ${isRefreshing ? 'h-10 opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}
      >
        <RefreshCw className="animate-spin text-[#10B981]" size={20} />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#27272A] bg-zinc-800 flex items-center justify-center overflow-hidden">
             <img src={user.avatar} alt="avatar" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#FAFAFA]">Hello, {user.name.split(' ')[0]}</h1>
              {user.plan === 'Pro' && (
                <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[8px] font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(245,158,11,0.2)]">PRO</div>
              )}
            </div>
            <div className="flex items-center gap-2" onClick={handleRefresh}>
              <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_#10B981] ${incidentsCount > 0 ? 'bg-[#EF4444] shadow-[#EF4444]' : 'bg-[#10B981] animate-pulse'}`} />
              <span className="text-xs text-[#A1A1AA] uppercase font-medium">
                {incidentsCount > 0 ? `${incidentsCount} Incident active` : 'All Systems Operational'}
              </span>
            </div>
          </div>
        </div>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#18181B] border border-[#27272A] active:bg-[#27272A]">
          <Bell size={20} className="text-[#A1A1AA]" />
          {incidentsCount > 0 && <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full" />}
        </button>
      </header>

      {/* Summary Grid */}
      <section className="grid grid-cols-3 gap-3">
        <SummaryCard label="Monitors" value={monitors.length.toString()} />
        <SummaryCard label="Uptime 24h" value={`${uptime}%`} color="text-[#10B981]" />
        <SummaryCard label="Incidents" value={incidentsCount.toString()} color={incidentsCount > 0 ? "text-[#EF4444]" : "text-[#A1A1AA]"} />
      </section>

      {/* Live Status */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#A1A1AA]">Live Status</h2>
          <button onClick={handleRefresh} className="text-xs text-[#10B981] font-medium flex items-center gap-1 active:opacity-50">
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <div className="space-y-3">
          {monitors.slice(0, 4).map((m) => (
            <div 
              key={m.id}
              onClick={() => onSelectMonitor(m)}
              className={`flex items-center justify-between p-4 bg-[#18181B] border rounded-xl active:scale-[0.98] transition-all duration-300 ${
                m.status === 'DOWN' ? 'border-[#EF4444]/30 bg-[#EF4444]/5' : 'border-[#27272A]'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-sm">{m.name}</span>
                <span className="text-xs text-[#A1A1AA] truncate max-w-[180px]">{m.url}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`mono text-xs font-bold ${m.status === 'UP' ? 'text-[#10B981]' : m.status === 'DOWN' ? 'text-[#EF4444]' : 'text-[#A1A1AA]'}`}>
                  {m.status === 'UP' ? `${m.responseTime}ms` : m.status}
                </span>
                <ChevronRight size={16} className="text-[#27272A]" />
              </div>
            </div>
          ))}
          {monitors.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-[#27272A]">
               <AlertCircle size={48} className="mb-2 opacity-20" />
               <p className="text-sm font-medium">No monitors found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ label, value, color = "text-[#FAFAFA]" }) => (
  <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-2xl space-y-1 active:bg-[#27272A] transition-colors">
    <span className="text-[10px] text-[#A1A1AA] uppercase font-bold block">{label}</span>
    <span className={`text-lg font-bold block ${color}`}>{value}</span>
  </div>
);

export default DashboardScreen;
