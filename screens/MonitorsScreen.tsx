
import React, { useState } from 'react';
import { Search, Monitor as MonitorIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { Monitor, MonitorStatus } from '../types';
import { useWatcher } from '../WatcherContext';

interface MonitorsScreenProps {
  onSelectMonitor: (monitor: Monitor) => void;
}

const MonitorsScreen: React.FC<MonitorsScreenProps> = ({ onSelectMonitor }) => {
  const { monitors, refreshMonitors } = useWatcher();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshMonitors();
    setIsRefreshing(false);
  };

  const filteredMonitors = monitors.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.url.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 pt-12 space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Monitors</h1>
        <button 
          onClick={handleRefresh} 
          className={`p-2 rounded-xl bg-[#18181B] border border-[#27272A] text-[#10B981] active:opacity-50 ${isRefreshing ? 'opacity-50' : ''}`}
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#18181B] border border-[#27272A] rounded-xl py-4 pl-12 pr-4 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#10B981] transition-colors"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {['All', 'UP', 'DOWN', 'PAUSED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              filter === f 
                ? 'bg-[#10B981] border-[#10B981] text-[#09090B] shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'bg-[#18181B] border-[#27272A] text-[#A1A1AA]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Monitor List */}
      <div className="space-y-3 pb-12">
        {filteredMonitors.map((m) => (
          <div 
            key={m.id}
            onClick={() => onSelectMonitor(m)}
            className={`p-4 bg-[#18181B] border rounded-2xl flex items-center gap-4 active:bg-[#27272A] transition-all duration-300 group ${
              m.status === 'DOWN' ? 'border-[#EF4444]/40 bg-[#EF4444]/5' : 'border-[#27272A]'
            }`}
          >
            <div className={`p-3 rounded-xl border transition-colors ${
              m.status === MonitorStatus.UP ? 'border-[#10B981]/20 bg-[#10B981]/5 text-[#10B981]' :
              m.status === MonitorStatus.DOWN ? 'border-[#EF4444]/20 bg-[#EF4444]/5 text-[#EF4444] animate-pulse' :
              'border-[#A1A1AA]/20 bg-[#A1A1AA]/5 text-[#A1A1AA]'
            }`}>
              <MonitorIcon size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="font-bold text-sm truncate pr-2">{m.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest border shrink-0 ${
                  m.status === MonitorStatus.UP ? 'border-[#10B981]/50 bg-[#10B981]/10 text-[#10B981]' :
                  m.status === MonitorStatus.DOWN ? 'border-[#EF4444]/50 bg-[#EF4444]/10 text-[#EF4444]' :
                  'border-[#A1A1AA]/50 bg-[#A1A1AA]/10 text-[#A1A1AA]'
                }`}>
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] truncate">{m.url}</p>
            </div>

            <div className="text-right shrink-0">
              <div className="mono text-xs font-bold text-[#FAFAFA]">{m.status === 'UP' ? `${m.responseTime}ms` : '--'}</div>
              <div className="text-[10px] text-[#A1A1AA] mt-1 font-medium">{m.lastCheck}</div>
            </div>
          </div>
        ))}

        {filteredMonitors.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-40">
            <div className="w-16 h-16 rounded-3xl bg-[#18181B] border border-[#27272A] flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold uppercase tracking-wider">No results found</h3>
              <p className="text-xs mt-1">Try adjusting your filters or search.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorsScreen;
